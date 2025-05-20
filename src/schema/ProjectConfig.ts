import { type } from 'arktype';

export const ProjectConfig = type({
	workspaceName: 'string',
	aiEditors: ['string'],  // Array of supported editors
	enableTDD: 'boolean',
	path: 'string?',        // Optional path to the project
	// Additional configuration options can be added in the future
	web: {
		host: 'string?',
		port: 'number?',
	}?,
});

export type ProjectConfig = typeof ProjectConfig.infer;

// import { readFileSync } from 'node:fs';
// import { join } from 'node:path';
// function getDefaultConfig(basePath: string) {
// 	// const config = getDefaultConfig(path);
// 	// TODO: If not exists create file
// 	const packageJson = readFileSync(join(basePath, 'package.json'), 'utf8');
// 	const pkg = JSON.parse(packageJson);
// 	return {
// 		// name: pkg.name,
// 		// description: pkg.description,
// 		// aiEditor: "cursor",
// 		paths: {
// 			cycles: '.ai/cycles',
// 			prd: '.ai/prd',
// 			tasks: '.ai/tasks',
// 		},
// 		web: {
// 			host: 'localhost',
// 			port: 4100,
// 			// theme: {
// 			// 	name: "light",
// 			// 	color: "#000000",
// 			// },
// 		},
// 	};
// }
