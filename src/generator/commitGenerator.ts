import { generateDescriptions } from '../analyzer/generateDescription.js';
import type {
  ChangeAnalysis,
  CommitCandidate,
  CommitType,
  GenerateOptions,
} from '../types/index.js';
import { COMMIT_TYPES } from '../types/index.js';
import { formatConventionalCommit } from './conventionalCommit.js';

/** How many runner-up types to offer as alternatives. */
const ALTERNATIVE_TYPES = 3;

/**
 * For a change to source code these three are always live options — the diff shows
 * the same edited lines whether the author was fixing, extending or tidying.
 */
const SOURCE_ALTERNATIVES: CommitType[] = ['feat', 'fix', 'refactor'];

const GENERIC =
  /^(update project files|maintain project changes|modify app|change code|fix issue|make changes)$/i;

function candidateScore(description: string, analysis: ChangeAnalysis, index: number): number {
  const words = description.split(/\s+/).filter(Boolean);
  let score = analysis.confidence * 30 - index * 2;
  if (index === 0) score += 12;
  if (words.length >= 3 && words.length <= 8) score += 12;
  if (analysis.concepts.some((concept) => description.includes(concept))) score += 10;
  if (analysis.identifiers.some((identifier) => description.includes(identifier))) score += 12;
  if (GENERIC.test(description)) score -= analysis.unrelatedChanges ? 0 : 20;
  if (words.length < 2) score -= 30;
  if (new Set(words).size !== words.length) score -= 8;
  return score;
}

function candidatesForType(
  type: CommitType,
  analysis: ChangeAnalysis,
  options: GenerateOptions,
  penalty: number,
): CommitCandidate[] {
  const scope = options.includeScope ? analysis.likelyScope : undefined;
  return generateDescriptions(type, analysis).map((description, index) => {
    const message =
      options.conventional === false
        ? description
        : formatConventionalCommit(type, description, scope, options.maxLength);
    const candidate: CommitCandidate = {
      type,
      description,
      message,
      score: candidateScore(description, analysis, index) - penalty,
    };
    if (scope) candidate.scope = scope;
    return candidate;
  });
}

/**
 * Whether a commit is a `fix` or a `refactor` is a statement about intent that the
 * diff cannot always settle. Rather than pretend otherwise, the runner-up types are
 * offered as alternatives so the right message is one keystroke away.
 */
export function generateCandidates(
  analysis: ChangeAnalysis,
  options: GenerateOptions = {},
): CommitCandidate[] {
  const primary = options.type ?? analysis.primaryCategory;
  const candidates = candidatesForType(primary, analysis, options, 0);

  if (!options.type) {
    const plausible = analysis.sourceDriven
      ? [...new Set([...COMMIT_TYPES.filter((t) => analysis.scores[t] > 0), ...SOURCE_ALTERNATIVES])]
      : COMMIT_TYPES.filter((type) => analysis.scores[type] > 0);
    const runnersUp = plausible
      .filter((type) => type !== primary)
      .sort((left, right) => analysis.scores[right] - analysis.scores[left])
      .slice(0, ALTERNATIVE_TYPES);
    // Keep every alternative below the primary's best line, but interleaved by merit.
    runnersUp.forEach((type, rank) => {
      candidates.push(...candidatesForType(type, analysis, options, 100 + rank * 10).slice(0, 2));
    });
  }

  return candidates.sort((left, right) => right.score - left.score);
}
