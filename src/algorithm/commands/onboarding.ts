import { join } from 'node:path';
import { type } from 'arktype';
import { file, type ServerWebSocket } from 'bun';
import { ProjectOnboarding } from '@/schema/ProjectOnboarding';

const PROJECT_PATH = process.cwd();
const CONFIG_FILE_NAME = 'devika.json';

// TODO: Make a REST Endpoint

export function onboarding(input: unknown, ws: ServerWebSocket<unknown>) {
	const data = ProjectOnboarding(input);
	if (data instanceof type.errors) {
		return { success: false, errors: data.summary };
	}

	const configFile = file(join(PROJECT_PATH, CONFIG_FILE_NAME));
	configFile.write(JSON.stringify(data, null, 2));

	ws.send(
		JSON.stringify({
			command: 'SET-DATA',
			result: { path: 'config', data },
		}),
	);

	// TODO: Do this step after "PRD Creation"
	ws.send(
		JSON.stringify({
			command: 'START',
			result: { success: true, message: '' },
		}),
	);

	return { success: true };
}
