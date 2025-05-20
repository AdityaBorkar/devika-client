#!/usr/bin/env bun
import chalk from 'chalk';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { connect } from './commands/connect';
import { init } from './commands/init';
import { start } from './commands/start';
import { stop } from './commands/stop';

console.log(chalk.white('devika'), chalk.gray('(Assisting your AI IDE)\n'));

void yargs(hideBin(process.argv))
	.scriptName('devika')
	.usage('$0 <command> [options]')
	.command(
		'init',
		'Initialize a new Devika project',
		init.builder,
		init.handler,
	)
	.command(
		'stop',
		'Stop the Devika communication server',
		stop.builder,
		stop.handler,
	)
	.command(
		'start',
		'Start the Devika communication server',
		start.builder,
		start.handler,
	)
	.command('connect', false, connect.builder, connect.handler)
	.demandCommand(1, chalk.yellow('Please specify a command to run'))
	.strict()
	.help()
	.alias('h', 'help')
	.alias('v', 'version')
	.epilogue(
		chalk.cyan('For more information visit https://devika.adityab.tech/docs'),
	)
	.parse();
