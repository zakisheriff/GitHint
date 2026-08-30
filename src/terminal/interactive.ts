import readline from 'node:readline';

import { confirm, input } from '@inquirer/prompts';
import chalk from 'chalk';

import type { CommitCandidate } from '../types/index.js';
import { copyToClipboard } from './clipboard.js';

export type InteractiveResult = { action: 'commit'; message: string } | { action: 'cancel' };

type Action = 'commit' | 'edit' | 'regenerate' | 'copy' | 'cancel';

function readAction(): Promise<Action> {
  if (!process.stdin.isTTY) return Promise.resolve('cancel');
  readline.emitKeypressEvents(process.stdin);
  process.stdin.setRawMode(true);
  process.stdin.resume();

  return new Promise((resolve) => {
    const finish = (action: Action) => {
      process.stdin.off('keypress', onKeypress);
      process.stdin.setRawMode(false);
      process.stdin.pause();
      process.stdout.write('\n');
      resolve(action);
    };
    const onKeypress = (character: string | undefined, key: readline.Key) => {
      if (key.ctrl && key.name === 'c') return finish('cancel');
      if (key.name === 'return') return finish('commit');
      if (character === 'e') return finish('edit');
      if (character === 'r') return finish('regenerate');
      if (character === 'c') return finish('copy');
      if (character === 'q' || key.name === 'escape') return finish('cancel');
    };
    process.stdin.on('keypress', onKeypress);
  });
}

function renderActions(message?: string): void {
  const suggestion = message ? `Suggested\n\n  ${chalk.bold(message)}\n\n` : '';
  process.stdout.write(
    `${suggestion}Enter  commit\ne      edit\nr      alternative\nc      copy\nq      cancel\n`,
  );
}

export async function chooseCommit(candidates: CommitCandidate[]): Promise<InteractiveResult> {
  let index = 0;
  while (true) {
    const current = candidates[index % candidates.length];
    if (!current) return { action: 'cancel' };
    renderActions(index === 0 ? undefined : current.message);
    const action = await readAction();

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
