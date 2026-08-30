import type { ChangedFile } from '../types/index.js';

const GENERIC = new Set(['src', 'lib', 'app', 'apps', 'components', 'pages', 'routes', 'packages']);

export function determineScope(files: ChangedFile[]): string | undefined {
  const counts = new Map<string, number>();
  for (const file of files) {
    const segments = file.directory.split('/').filter(Boolean);
    const candidate = segments.find((segment) => !GENERIC.has(segment.toLowerCase()));
    if (candidate) counts.set(candidate, (counts.get(candidate) ?? 0) + 1);
  }

  const ranked = [...counts.entries()].sort((left, right) => right[1] - left[1]);
  const winner = ranked[0];
  if (!winner) return undefined;
  const threshold = files.length === 1 ? 1 : Math.ceil(files.length * 0.6);
  return winner[1] >= threshold ? winner[0].toLowerCase().replace(/[^a-z0-9-]/g, '-') : undefined;
}
