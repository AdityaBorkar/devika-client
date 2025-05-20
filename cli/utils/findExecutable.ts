import { existsSync } from 'node:fs';

/**
 * Find the executable path for a command
 */
export function findExecutable(command: string): string {
	const envVar = `${command.toUpperCase()}_PATH`;
	if (process.env[envVar]) {
		return process.env[envVar] as string;
	}

	if (process.env.HOME) {
		if (command === 'bun') {
			const homeBunPath = `${process.env.HOME}/.bun/bin/bun`;
			if (existsSync(homeBunPath)) return homeBunPath;
		}
		if (command === 'turso') {
			const homeTursoPath = `${process.env.HOME}/.turso/bin/turso`;
			if (existsSync(homeTursoPath)) return homeTursoPath;
		}
	}

	return command;
}
