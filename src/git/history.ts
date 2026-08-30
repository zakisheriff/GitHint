export function parseHistory(output: string): string[] {
  return output
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 10);
}

export function prefersScopes(commits: string[]): boolean {
  if (commits.length < 3) return false;
  const scoped = commits.filter((commit) => /^[a-z]+\([^)]+\):\s/.test(commit)).length;
  return scoped / commits.length >= 0.6;
}
