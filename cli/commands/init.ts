import fs from 'node:fs';
import path from 'node:path';
import chalk from 'chalk';
import inquirer from 'inquirer';
import fetch from 'node-fetch';
import ora from 'ora';
import type { Arguments, Argv } from 'yargs';

type InitCommandArgs = Record<string, unknown>;

const builder = (yargs: Argv): Argv<InitCommandArgs> => {
	return yargs;
};

const handler = async (_argv: Arguments<InitCommandArgs>) => {
	console.log(chalk.cyan('\n=== Project Initialization Wizard ===\n'));

	const answers = await inquirer.prompt([
		{
			type: 'input',
			name: 'workspaceName',
			message: chalk.green('Workspace Name:'),
			validate: (input: string) =>
				input.trim() !== '' || 'Workspace name cannot be empty',
		},
		{
			type: 'checkbox',
			name: 'aiEditors',
			message: chalk.green('Select AI Editors to support:'),
			choices: [
				{ name: 'VS Code', value: 'vscode' },
				{ name: 'Cursor', value: 'cursor' },
				{ name: 'Windsurf', value: 'windsurf' },
				{ name: 'Cline', value: 'cline' },
				{ name: 'Augment', value: 'augment' },
				{ name: 'GitHub Copilot', value: 'github-copilot' },
			],
			validate: (input: string[]) =>
				input.length > 0 || 'Select at least one editor',
		},
		{
			type: 'confirm',
			name: 'enableTDD',
			message: chalk.green('Enable Test-Driven Development (TDD)?'),
			default: false,
		},
	]);

	const config = {
		workspaceName: answers.workspaceName,
		aiEditors: answers.aiEditors,
		enableTDD: answers.enableTDD,
		path: process.cwd(),
	};

	// Save configuration to file
	const configPath = path.join(process.cwd(), 'devika.json');
	fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
	console.log(chalk.green(`✓ Configuration saved to ${configPath}`));

	// Prepare parameters for the onboarding request
	const params = new URLSearchParams({
		workspaceName: config.workspaceName,
		aiEditors: config.aiEditors.join(','),
		enableTDD: String(config.enableTDD),
		path: config.path,
	});

	// Initialize the project with the server
	const spinner = ora('Initializing Devika project...').start();
	try {
		await fetch(`http://localhost:3000/onboarding?${params.toString()}`);
		spinner.succeed('Project initialized successfully!');
		console.log(`Run ${chalk.yellow('npx devika start')} to continue.`);
	} catch (e) {
		spinner.fail('Failed to initialize project');
		console.error(chalk.red('Error sending onboarding request:'), e);
		console.log(
			chalk.yellow(
				'\nTip: Make sure the Devika server is running on localhost:3000',
			),
		);
	}
};

export const init = { builder, handler };
