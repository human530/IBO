import type { Question } from '../types';

/**
 * Grade a response. For multiple-answer questions the selection must match the
 * answer set exactly (no partial credit), matching olympiad marking style.
 */
export function isCorrect(question: Question, selected: string[]): boolean {
  const a = [...question.answer].sort();
  const b = [...selected].sort();
  if (a.length !== b.length) return false;
  return a.every((v, i) => v === b[i]);
}
