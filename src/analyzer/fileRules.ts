import type { ChangedFile, CommitType } from '../types/index.js';

const DOCUMENTATION =
  /(^|\/)(readme|changelog|contributing|license)(\.|$)|(^|\/)docs\/|\.(md|mdx)$/i;
const STYLES = /\.(css|scss|sass|less|styl)$/i;
const TESTS = /(^|\/)(__tests__|tests?|cypress|playwright)(\/|$)|\.(test|spec)\.[^.]+$/i;
const CI = /(^|\/)(\.github\/workflows|\.circleci)(\/|$)|(^|\/)(\.gitlab-ci\.yml|jenkinsfile)$/i;
const BUILD =
  /(^|\/)(dockerfile|docker-compose[^/]*|webpack\.config|vite\.config|rollup\.config|esbuild\.config)/i;
const CHORE =
  /(^|\/)(package(-lock)?\.json|pnpm-lock\.yaml|yarn\.lock|bun\.lockb?|\.gitignore|\.editorconfig|\.prettierrc[^/]*|eslint\.config[^/]*|tsconfig[^/]*\.json)$/i;

export function scoresForFile(file: ChangedFile): Partial<Record<CommitType, number>> {
  const path = file.path;
  if (DOCUMENTATION.test(path)) return { docs: 10 };
  if (STYLES.test(path)) return { style: 10 };
  if (TESTS.test(path)) return { test: 10 };
  if (CI.test(path)) return { ci: 12 };
  if (BUILD.test(path)) return { build: 10 };
  if (CHORE.test(path)) return { chore: 9 };
  if (file.status === 'renamed') return { refactor: 8 };
  if (file.status === 'added') return { feat: 4 };
  if (file.status === 'deleted') return { refactor: 3, chore: 2 };
  return { feat: 1, fix: 1, refactor: 1 };
}

export function fileCategory(file: ChangedFile): CommitType | 'code' {
  const scores = scoresForFile(file);
  const ranked = Object.entries(scores).sort((left, right) => right[1] - left[1]);
  const winner = ranked[0];
  if (!winner || winner[1] < 5) return 'code';
  return winner[0] as CommitType;
}
