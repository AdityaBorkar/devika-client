import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import type { Arguments, Argv } from 'yargs';

interface StopCommandArgs {
	pidFile: string;
	force: boolean;
}

export const builder = (yargs: Argv): Argv<StopCommandArgs> => {
	return yargs
		.option('pidFile', {
			type: 'string',
			description: 'Path and name of the PID file',
			default: 'devika.pid',
		})
		.option('force', {
			alias: 'f',
			type: 'boolean',
			description: 'Force kill the processes',
			default: false,
		});
};

export const handler = async (
	argv: Arguments<StopCommandArgs>,
): Promise<void> => {
	const { pidFile, force } = argv;
	const pidFilePath = path.resolve(String(pidFile));

	try {
		if (!fs.existsSync(pidFilePath)) {
			console.error(`PID file not found: ${pidFilePath}`);
			return;
		}

		const pidFileContent = fs.readFileSync(pidFilePath, 'utf8');
		const pidLines = pidFileContent.split('\n');

		// Extract PIDs from the file
		const pids: number[] = [];
		pidLines.forEach((line) => {
			const match = line.match(/PID: (\d+)/);
			if (match?.at?.(1)) {
				pids.push(Number.parseInt(match[1], 10));
			}
		});

		if (pids.length === 0) {
			console.error('No PIDs found in the PID file');
			return;
		}

		// Kill each process using promises to track completion
		const killPromises = pids.map((pid) => {
			return new Promise<void>((resolve) => {
				// Build the kill command
				const killSignal = force ? '-9' : '';

				// Using spawn to execute the kill command
				const killProcess = spawn(
					'kill',
					killSignal ? [killSignal, String(pid)] : [String(pid)],
					{
						stdio: 'pipe',
						shell: true,
					},
				);

				// Handle stdout output
				killProcess.stdout.on('data', (data) => {
					process.stdout.write(`[Kill PID ${pid}] ${data}`);
				});

				// Handle stderr output
				killProcess.stderr.on('data', (data) => {
					process.stderr.write(`[Kill PID ${pid}] Error: ${data}`);
				});

				// Handle process completion
				killProcess.on('close', (code) => {
					if (code === 0) {
						console.log(
							`Process with PID ${pid} has been ${force ? 'forcefully ' : ''}terminated`,
						);
					} else {
						console.error(
							`Failed to kill process with PID ${pid}, exit code: ${code}`,
						);
					}

					// Resolve the promise
					resolve();
				});
			});
		});

		// Wait for all kill processes to complete
		await Promise.all(killPromises);

		// After all processes are killed, remove the PID file
		fs.unlinkSync(pidFilePath);
		console.log(`PID file ${pidFilePath} has been removed`);
	} catch (error) {
		console.error('Error while killing processes:', error);
	}
};

export const stop = { builder, handler };
