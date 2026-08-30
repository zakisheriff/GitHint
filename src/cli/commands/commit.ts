import { chooseCommit } from '../../terminal/interactive.js';
import { renderSuccess, renderSuggestion } from '../../terminal/renderer.js';
import type { CliOptions } from '../options.js';
import { createSuggestion } from './suggest.js';

export async function runCommit(options: CliOptions): Promise<void> {
  const context = await createSuggestion(options);
  const first = context?.candidates[0];
  if (!context || !first) return;

  let message = first.message;
  if (options.plain && !options.yes) {
    process.stdout.write(`${message}\n`);
    return;
  }
  if (!options.yes && context.confirmCommit) {
    renderSuggestion(message, context.analysis, context.showStats);
    const result = await chooseCommit(context.candidates);
    if (result.action === 'cancel') {
      process.stdout.write('Cancelled.\n');
      return;
    }
    message = result.message;
  }

  const committed = await context.repository.commit(message);
  if (!committed.ok) throw new Error(committed.output || 'Git commit failed.');
  let pushed = false;
  if (options.push) {
    if (!(await context.repository.hasUpstream())) {
      process.stderr.write(
        '! Commit created, but this branch has no upstream. Push it with git push --set-upstream origin <branch>.\n',
      );
    } else {
      const result = await context.repository.push();
      if (!result.ok) throw new Error(`Commit created, but push failed: ${result.output}`);
      pushed = true;
    }
  }
  renderSuccess(message, pushed);
}
