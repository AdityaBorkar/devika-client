import type { ServerWebSocket } from 'bun';
import { init } from '@/algorithm/commands/init';
import { onboarding } from '@/algorithm/commands/onboarding';
import { start } from '@/algorithm/commands/start';
import { stop } from '@/algorithm/commands/stop';

export function handleCommand(
	command: string,
	data: unknown,
	ws: ServerWebSocket<unknown>,
) {
	if (command === 'INIT') return init();
	if (command === 'STOP') return stop();
	if (command === 'START') return start();
	if (command === 'ONBOARDING') return onboarding(data, ws);
}
