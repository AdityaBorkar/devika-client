import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { findExecutable } from 'cli/utils/findExecutable';
import type { Arguments, Argv } from 'yargs';

interface StartCommandArgs {
	port: number;
	background: boolean;
	pidFile: string;
}

const builder = (yargs: Argv): Argv<StartCommandArgs> => {
	return yargs
		.option('port', {
			alias: 'p',
			type: 'number',
			description: 'Port number to run the connection on',
			default: 3210,
		})
		.option('background', {
			alias: 'b',
			type: 'boolean',
			description: 'Run the process in the background',
			default: false,
		})
		.option('pidFile', {
			type: 'string',
			description: 'Path and name of the PID file',
			default: 'devika.pid',
		});
};

const handler = (argv: Arguments<StartCommandArgs>): void => {
	const { port, background = false, pidFile } = argv;
	const processConfig = {
		detached: background,
		stdio: background ? 'ignore' : 'pipe',
		shell: true,
		env: {
			...process.env,
			SERVER_PORT: port.toString(),
			NODE_ENV: 'production',
		},
	} as const;

	// Find executable paths
	const tursoPath = findExecutable('turso');
	const bunPath = findExecutable('bun');

	console.log(`Starting Turso DB (using ${tursoPath})...`);
	const turso = spawn(
		tursoPath,
		['dev', '--port', '5000', '--db-file', 'local.db'],
		processConfig,
	);

	console.log(`Starting Devika server (using ${bunPath})...`);
	const server = spawn(bunPath, ['run', 'src/server.ts'], processConfig);

	if (background) {
		turso.unref();
		server.unref();

		// Log the PIDs
		if (turso.pid && server.pid) {
			fs.writeFileSync(
				path.resolve(String(pidFile)),
				`Turso PID: ${turso.pid}\nWeb Server PID: ${server.pid}`,
			);
		} else {
			console.error('Failed to get process PIDs');
		}
		process.exit(0);
		return;
	}

	turso.stdout?.on('data', (data) => {
		process.stdout.write(`[Turso DB] ${data}`);
	});
	turso.stderr?.on('data', (data) => {
		process.stderr.write(`[Turso DB] ${data}`);
	});
	turso.on('exit', (code) => {
		if (code !== 0)
			console.error(`[Turso DB] Process exited with code ${code}`);
	});
	server.stdout?.on('data', (data) => {
		process.stdout.write(`[Web Server] ${data}`);
	});
	server.stderr?.on('data', (data) => {
		process.stderr.write(`[Web Server] ${data}`);
	});
	server.on('exit', (code) => {
		if (code !== 0)
			console.error(`[Web Server] Process exited with code ${code}`);
	});
};

export const start = { builder, handler };
