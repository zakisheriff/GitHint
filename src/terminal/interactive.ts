import { confirm, input, select } from '@inquirer/prompts';
import chalk from 'chalk';

import type { CommitCandidate } from '../types/index.js';
import { copyToClipboard } from './clipboard.js';

export type InteractiveResult = { action: 'commit'; message: string } | { action: 'cancel' };

export async function chooseCommit(candidates: CommitCandidate[]): Promise<InteractiveResult> {
  let index = 0;
  while (true) {
    const current = candidates[index % candidates.length];
    if (!current) return { action: 'cancel' };
    const action = await select({
      message: current.message,
      choices: [
        { name: 'Enter  commit', value: 'commit' },
        { name: 'e      edit', value: 'edit' },
        { name: 'r      alternative', value: 'regenerate' },
        { name: 'c      copy', value: 'copy' },
        { name: 'q      cancel', value: 'cancel' },
      ],
    });

    if (action === 'commit') return { action: 'commit', message: current.message };
    if (action === 'cancel') return { action: 'cancel' };
    if (action === 'regenerate') {
      index += 1;
      continue;
    }
    if (action === 'copy') {
      const copied = await copyToClipboard(current.message);
      process.stdout.write(
        copied ? `${chalk.green('✓')} Copied\n` : '! Clipboard tool not available.\n',
      );
      continue;
    }
    const edited = await input({ message: 'Commit message', default: current.message });
    const approved = await confirm({ message: `Commit as “${edited}”?`, default: true });
    if (approved) return { action: 'commit', message: edited.trim() };
  }
}
