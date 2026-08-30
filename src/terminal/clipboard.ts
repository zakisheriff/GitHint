import { runWithInput } from '../utils/processes.js';

export async function copyToClipboard(value: string): Promise<boolean> {
  const commands: Array<[string, string[]]> =
    process.platform === 'darwin'
      ? [['pbcopy', []]]
      : process.platform === 'win32'
        ? [['clip', []]]
        : [
            ['wl-copy', []],
            ['xclip', ['-selection', 'clipboard']],
          ];
  for (const [command, args] of commands) {
    if (await runWithInput(command, args, value)) return true;
  }
  return false;
}
