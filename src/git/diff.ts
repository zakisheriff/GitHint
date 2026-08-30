import type { DiffStats } from '../types/index.js';

export const MAX_DIFF_BYTES = 4 * 1024 * 1024;

export function parseNumstat(output: string): DiffStats {
  let files = 0;
  let additions = 0;
  let deletions = 0;
  for (const line of output.split('\n')) {
    if (!line) continue;
    const [added, deleted] = line.split('\t');
    files += 1;
    if (added && added !== '-') additions += Number.parseInt(added, 10) || 0;
    if (deleted && deleted !== '-') deletions += Number.parseInt(deleted, 10) || 0;
  }
  return { files, additions, deletions };
}

export function sampleDiff(
  diff: string,
  maxBytes = MAX_DIFF_BYTES,
): { diff: string; truncated: boolean } {
  if (Buffer.byteLength(diff) <= maxBytes) return { diff, truncated: false };
  return { diff: Buffer.from(diff).subarray(0, maxBytes).toString('utf8'), truncated: true };
}
