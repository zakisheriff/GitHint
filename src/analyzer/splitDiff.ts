/**
 * Splits a unified diff into per-file sections so diff heuristics can be applied
 * to the files that carry intent instead of the whole staged blob.
 */
const FILE_HEADER = /^diff --git a\/(.+?) b\/(.+)$/;

export interface DiffSection {
  path: string;
  body: string;
  additions: number;
  deletions: number;
}

export function splitDiff(diff: string): DiffSection[] {
  const sections: DiffSection[] = [];
  let current: DiffSection | undefined;

  for (const line of diff.split('\n')) {
    const header = FILE_HEADER.exec(line);
    if (header) {
      if (current) sections.push(current);
      current = { path: header[2] ?? header[1] ?? '', body: '', additions: 0, deletions: 0 };
      continue;
    }
    if (!current) continue;
    if (line.startsWith('+++') || line.startsWith('---')) continue;
    if (line.startsWith('+')) current.additions += 1;
    else if (line.startsWith('-')) current.deletions += 1;
    current.body += `${line}\n`;
  }
  if (current) sections.push(current);
  return sections;
}

/** Concatenates only the diff sections belonging to the given paths. */
export function diffForPaths(sections: DiffSection[], paths: Set<string>): string {
  return sections
    .filter((section) => paths.has(section.path))
    .map((section) => section.body)
    .join('\n');
}
