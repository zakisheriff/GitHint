import { execFile, spawn } from 'node:child_process';

export interface ProcessResult {
  stdout: string;
  stderr: string;
  exitCode: number;
}

export function runProcess(
  command: string,
  args: string[],
  options: { cwd?: string; maxBuffer?: number } = {},
): Promise<ProcessResult> {
  return new Promise((resolve, reject) => {
    execFile(
      command,
      args,
      {
        cwd: options.cwd,
        encoding: 'utf8',
        maxBuffer: options.maxBuffer ?? 8 * 1024 * 1024,
        windowsHide: true,
      },
      (error, stdout, stderr) => {
        if (error && typeof error.code === 'string') {
          reject(error);
          return;
        }
        resolve({
          stdout,
          stderr,
          exitCode: error && typeof error.code === 'number' ? error.code : 0,
        });
      },
    );
  });
}

export function runWithInput(command: string, args: string[], input: string): Promise<boolean> {
  return new Promise((resolve) => {
    const child = spawn(command, args, { stdio: ['pipe', 'ignore', 'ignore'], windowsHide: true });
    child.once('error', () => resolve(false));
    child.once('exit', (code) => resolve(code === 0));
    child.stdin.end(input);
  });
}
