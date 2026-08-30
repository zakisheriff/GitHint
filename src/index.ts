import { createProgram } from './cli/index.js';

createProgram()
  .parseAsync(process.argv)
  .catch((error: unknown) => {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`GitHint: ${message}\n`);
    process.exitCode = 1;
  });
