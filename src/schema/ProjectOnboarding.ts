import { type } from 'arktype';

export const ProjectOnboarding = type({
	workspaceName: 'string',
	aiEditors: 'string', // Comma-separated list of supported editors
	enableTDD: 'boolean|string', // Can be a string "true" or "false" from URL params
	path: 'string?', // Optional path to the project
});

export type ProjectOnboarding = typeof ProjectOnboarding.infer;
