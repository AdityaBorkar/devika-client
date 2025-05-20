import { serve } from 'bun';

const _server = serve({
	routes: {
		// Serve index.html for all unmatched routes.
		// "/*": index,

		'/api/hello': {
			async GET(_req) {
				return Response.json({
					message: 'Hello, world!',
					method: 'GET',
				});
			},
			async PUT(_req) {
				return Response.json({
					message: 'Hello, world!',
					method: 'PUT',
				});
			},
		},
	},

	development: process.env.NODE_ENV !== 'production' && {
		// Enable browser hot reloading in development
		hmr: true,

		// Echo console logs from the browser to the server
		console: true,
	},
});
