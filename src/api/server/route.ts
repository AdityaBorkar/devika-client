import type { Server } from 'bun';

export default function ApiServerRoute(req: Request, server: Server) {
	const success = server.upgrade(req);
	return success
		? undefined
		: new Response('WebSocket upgrade error', { status: 400 });
}
