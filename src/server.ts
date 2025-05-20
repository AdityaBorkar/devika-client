import { serve } from 'bun';
import { handleCommand } from './algorithm';
import { onboardingHttp } from './algorithm/commands/onboarding';
import ApiServerRoute from './api/server/route';

// Handler for onboarding HTTP requests
async function handleOnboarding(req: Request): Promise<Response> {
	const url = new URL(req.url);
	const params = Object.fromEntries(url.searchParams.entries());

	try {
		// Process query parameters
		const data = {
			workspaceName: params.workspaceName,
			aiEditors: params.aiEditors || '',
			enableTDD: params.enableTDD === 'true',
			path: params.path || process.cwd(),
		};

		// Use the onboardingHttp function
		const result = onboardingHttp(data);

		if (!result.success) {
			return new Response(
				JSON.stringify({
					success: false,
					error: result.errors || 'Invalid onboarding data',
				}),
				{ status: 400, headers: { 'Content-Type': 'application/json' } },
			);
		}

		return new Response(JSON.stringify(result), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (error) {
		console.error('Onboarding error:', error);
		return new Response(
			JSON.stringify({
				success: false,
				error: 'Server error during onboarding',
			}),
			{ status: 500, headers: { 'Content-Type': 'application/json' } },
		);
	}
}

// Handle HTTP requests based on route
async function handleHttpRequest(req: Request): Promise<Response | undefined> {
	const url = new URL(req.url);
	const path = url.pathname;

	if (path === '/onboarding') {
		return handleOnboarding(req);
	}

	return undefined;
}

const server = serve({
	development: process.env.NODE_ENV !== 'production' && {
		hmr: true,
		console: true,
	},
	port: process.env.SERVER_PORT || 3000,
	fetch: handleHttpRequest,
	routes: {
		'/api/server': ApiServerRoute,
	},
	websocket: {
		open() {
			console.log('[SERVER] WebSocket opened');
		},
		close() {
			// TODO: Stop the NODE SERVER
			console.log('[SERVER] WebSocket closed');
		},
		async message(ws, message) {
			console.log('[SERVER] Message:', message);
			// TODO: Exchange files, and database
			const { command, data } = JSON.parse(message.toString());
			const result = await handleCommand(command, data, ws);
			const resultJson = JSON.stringify({ command, result });
			ws.send(resultJson);
		},
	},
});

console.log(`🚀 Server running at ${server.url}`);
