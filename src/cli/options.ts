import type { Command } from 'commander';

import { COMMIT_TYPES, type CommitType } from '../types/index.js';

export interface CliOptions {
  plain?: boolean;
  yes?: boolean;
  type?: CommitType;
  scope?: boolean;
  push?: boolean;
}

export function addSuggestionOptions(command: Command): Command {
  return command
    .option('--plain', 'print only the commit message')
    .option('-y, --yes', 'commit immediately without confirmation')
    .option('--type <type>', `force commit type (${COMMIT_TYPES.join(', ')})`, (value: string) => {
      if (!COMMIT_TYPES.includes(value as CommitType))
        throw new Error(`Unsupported commit type: ${value}`);
      return value as CommitType;
    })
    .option('--scope', 'include an inferred scope when possible')
    .option('--push', 'push after a successful commit');
}

export function resolveOptions(command: Command): CliOptions {
  return { ...(command.parent?.opts<CliOptions>() ?? {}), ...command.opts<CliOptions>() };
}
