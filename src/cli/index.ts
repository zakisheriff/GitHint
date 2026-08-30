import { Command } from 'commander';

export function createProgram(): Command {
  return new Command()
    .name('ghint')
    .description('Generate local commit message hints from staged Git changes')
    .version('0.1.0')
    .action(() => {
      process.stdout.write('GitHint is ready.\n');
    });
}
