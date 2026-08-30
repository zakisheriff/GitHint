import type { ChangeAnalysis, CommitType } from '../types/index.js';
import { isGenericConcept } from '../utils/paths.js';

function subjectFor(analysis: ChangeAnalysis): string {
  const identifier = analysis.identifiers.find((value) => !isGenericConcept(value));
  if (identifier) return identifier;
  const concept = analysis.concepts.find((value) => !isGenericConcept(value));
  if (concept) return concept;
  return analysis.primaryCategory === 'docs' ? 'documentation' : 'project files';
}

function specializedDescription(type: CommitType, analysis: ChangeAnalysis): string | undefined {
  const paths = analysis.files.map((file) => file.path.toLowerCase());
  if (type === 'feat' && paths.some((path) => /(^|\/)cli(\/|$)/.test(path))) {
    return analysis.addedFiles.length > 0 ? 'add cli commands' : 'update cli commands';
  }
  if (
    type === 'chore' &&
    paths.some((path) => /(?:package-lock\.json|pnpm-lock\.yaml|yarn\.lock|bun\.lock)/.test(path))
  ) {
    return 'update dependencies';
  }
  if (
    type === 'chore' &&
    paths.every((path) => /config|\.json|\.ya?ml|\.gitignore|\.editorconfig/.test(path))
  ) {
    return 'update project configuration';
  }
  if (type === 'docs' && paths.some((path) => /readme/.test(path)))
    return 'update readme documentation';
  if (type === 'ci' && analysis.addedFiles.length > 0) return 'add continuous integration workflow';
  if (type === 'build' && paths.some((path) => /docker/.test(path)))
    return 'update container build configuration';
  return undefined;
}

export function generateDescriptions(type: CommitType, analysis: ChangeAnalysis): string[] {
  if (analysis.unrelatedChanges) return ['update project files', 'maintain project changes'];
  const specialized = specializedDescription(type, analysis);
  const subject = subjectFor(analysis);
  const allAdded = analysis.addedFiles.length === analysis.files.length;
  const allDeleted = analysis.deletedFiles.length === analysis.files.length;

  const verbs: Record<CommitType, string[]> = {
    feat: allAdded ? ['add', 'introduce', 'implement'] : ['add', 'improve', 'update'],
    fix: ['prevent', 'handle', 'correct', 'resolve'],
    refactor: analysis.files.some((file) => file.status === 'renamed')
      ? ['reorganize', 'rename', 'move']
      : ['simplify', 'extract', 'reorganize'],
    style: ['adjust', 'update', 'improve'],
    docs: allAdded ? ['add', 'document', 'write'] : ['update', 'clarify', 'improve'],
    test: allAdded ? ['add', 'cover', 'test'] : ['update', 'improve', 'extend'],
    chore: ['update', 'maintain', 'configure'],
    perf: ['optimize', 'improve', 'speed up'],
    build: ['update', 'configure', 'improve'],
    ci: allAdded ? ['add', 'configure', 'introduce'] : ['update', 'improve', 'configure'],
    revert: ['revert', 'restore', 'undo'],
  };
  if (allDeleted) verbs[type] = ['remove', 'drop', 'delete'];
  const generated = verbs[type].map((verb) => `${verb} ${subject}`);
  return specialized ? [specialized, ...generated] : generated;
}
