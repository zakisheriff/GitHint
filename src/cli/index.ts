import { Command } from 'commander';

import { resetUserConfig, setConfig, showConfig } from './commands/config.js';
import { runCommit } from './commands/commit.js';
import { runSuggest } from './commands/suggest.js';
import { addSuggestionOptions, type CliOptions, resolveOptions } from './options.js';

export function createProgram(): Command {
  const program = addSuggestionOptions(
    new Command()
      .name('ghint')
      .description('Generate local commit message hints from staged Git changes')
      .version('0.1.0'),
  ).action(async (_options: CliOptions, command: Command) => {
    return runCommit(resolveOptions(command));
  });

  addSuggestionOptions(
    program.command('suggest').description('generate a suggestion without committing'),
  ).action(async (_options: CliOptions, command: Command) => {
    return runSuggest(resolveOptions(command));
  });
  addSuggestionOptions(
    program.command('commit').description('generate and interactively commit'),
  ).action(async (_options: CliOptions, command: Command) => {
    return runCommit(resolveOptions(command));
  });

  const config = program
    .command('config')
    .description('view or update user configuration')
    .action(async () => showConfig());
  config
    .command('get [key]')
    .description('get configuration')
    .action(async (key?: string) => showConfig(key));
  config.command('set <key> <value>').description('set a configuration value').action(setConfig);
  config.command('reset').description('reset configuration to defaults').action(resetUserConfig);

  return program;
}
