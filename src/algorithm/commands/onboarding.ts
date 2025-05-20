import { join } from 'node:path';
import { type } from 'arktype';
import { file, type ServerWebSocket } from 'bun';
import { ProjectOnboarding } from '@/schema/ProjectOnboarding';

const PROJECT_PATH = process.cwd();
const CONFIG_FILE_NAME = 'devika.json';

/**
 * Process project onboarding via WebSocket
 */
export function onboardingWs(input: unknown, ws: ServerWebSocket<unknown>) {
	const data = ProjectOnboarding(input);
	if (data instanceof type.errors) {
		return { success: false, errors: data.summary };
	}

	// Process input data
	const processedData = {
		workspaceName: data.workspaceName,
		aiEditors: data.aiEditors.split(','),
		enableTDD:
			typeof data.enableTDD === 'string'
				? data.enableTDD === 'true'
				: Boolean(data.enableTDD),
		path: data.path || PROJECT_PATH,
	};

	const configFile = file(join(PROJECT_PATH, CONFIG_FILE_NAME));
	configFile.write(JSON.stringify(processedData, null, 2));

	ws.send(
		JSON.stringify({
			command: 'SET-DATA',
			result: { path: 'config', data: processedData },
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

/**
 * Process project onboarding via HTTP request
 */
export function onboardingHttp(input: unknown) {
	const data = ProjectOnboarding(input);
	if (data instanceof type.errors) {
		return { success: false, errors: data.summary };
	}

	// Process input data
	const processedData = {
		workspaceName: data.workspaceName,
		aiEditors: data.aiEditors.split(','),
		enableTDD:
			typeof data.enableTDD === 'string'
				? data.enableTDD === 'true'
				: Boolean(data.enableTDD),
		path: data.path || PROJECT_PATH,
	};

	const configFile = file(join(PROJECT_PATH, CONFIG_FILE_NAME));
	configFile.write(JSON.stringify(processedData, null, 2));

	return { success: true, message: 'Project initialized successfully' };
}
