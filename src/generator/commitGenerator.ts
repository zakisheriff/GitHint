import { generateDescriptions } from '../analyzer/generateDescription.js';
import type { ChangeAnalysis, CommitCandidate, GenerateOptions } from '../types/index.js';
import { formatConventionalCommit } from './conventionalCommit.js';

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

export function generateCandidates(
  analysis: ChangeAnalysis,
  options: GenerateOptions = {},
): CommitCandidate[] {
  const type = options.type ?? analysis.primaryCategory;
  const scope = options.includeScope ? analysis.likelyScope : undefined;
  return generateDescriptions(type, analysis)
    .map((description, index) => {
      const message =
        options.conventional === false
          ? description
          : formatConventionalCommit(type, description, scope, options.maxLength);
      const candidate: CommitCandidate = {
        type,
        description,
        message,
        score: candidateScore(description, analysis, index),
      };
      if (scope) candidate.scope = scope;
      return candidate;
    })
    .sort((left, right) => right.score - left.score);
}
