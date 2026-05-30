import type { AttemptRecord, DomainId, Question } from '../types';
import { QUESTIONS } from '../data/questions';
import { IBO_STYLE } from '../data/iboStyle';
import { attemptScore } from './scoring';

/** Lookup of every known bank question by id (generated items are not indexed). */
const INDEX: Map<string, Question> = new Map(
  [...QUESTIONS, ...IBO_STYLE].map((q) => [q.id, q]),
);

export interface KeyedStat {
  key: string;
  total: number;
  correct: number;
  accuracy: number; // 0–1 (uses official partial score)
  domain?: DomainId;
}

function tally(
  attempts: AttemptRecord[],
  keyOf: (a: AttemptRecord, q?: Question) => string | undefined,
): KeyedStat[] {
  const map = new Map<string, { total: number; sum: number; correct: number; domain?: DomainId }>();
  for (const a of attempts) {
    const q = INDEX.get(a.questionId);
    const key = keyOf(a, q);
    if (!key) continue;
    const e = map.get(key) ?? { total: 0, sum: 0, correct: 0, domain: a.domain };
    e.total += 1;
    e.sum += attemptScore(a);
    if (a.correct) e.correct += 1;
    map.set(key, e);
  }
  return [...map.entries()]
    .map(([key, e]) => ({ key, total: e.total, correct: e.correct, accuracy: e.sum / e.total, domain: e.domain }))
    .sort((x, y) => x.accuracy - y.accuracy);
}

export interface DetailedAnalysis {
  bySubtopic: KeyedStat[];
  byConcept: KeyedStat[];
  byDifficulty: KeyedStat[];
  byType: KeyedStat[];
  /** weakest subtopic with at least 2 attempts */
  weakestSubtopic?: KeyedStat;
  /** weakest concept with at least 2 attempts */
  weakestConcept?: KeyedStat;
  /** wrong & fast (careless) count */
  careless: number;
  /** wrong & slow (knowledge gap) count */
  gap: number;
  /** the most-missed concepts (incorrect occurrences) */
  topMissedConcepts: { concept: string; misses: number }[];
  totalAttempts: number;
}

export function detailedAnalysis(attempts: AttemptRecord[]): DetailedAnalysis {
  const bySubtopic = tally(attempts, (_a, q) => q?.subtopic);
  const byType = tally(attempts, (_a, q) =>
    q ? (q.type === 'multiple' ? '複選' : q.type === 'truefalse' ? '是非' : '單選') : undefined,
  );
  const byDifficulty = tally(attempts, (a) => `難度 ${a.difficulty}`);

  // concept tally needs to expand each question's concept list
  const conceptMap = new Map<string, { total: number; sum: number; correct: number }>();
  const missMap = new Map<string, number>();
  for (const a of attempts) {
    const q = INDEX.get(a.questionId);
    if (!q) continue;
    for (const c of q.concepts) {
      const e = conceptMap.get(c) ?? { total: 0, sum: 0, correct: 0 };
      e.total += 1;
      e.sum += attemptScore(a);
      if (a.correct) e.correct += 1;
      conceptMap.set(c, e);
      if (!a.correct) missMap.set(c, (missMap.get(c) ?? 0) + 1);
    }
  }
  const byConcept: KeyedStat[] = [...conceptMap.entries()]
    .map(([key, e]) => ({ key, total: e.total, correct: e.correct, accuracy: e.sum / e.total }))
    .sort((x, y) => x.accuracy - y.accuracy);

  // careless vs gap: median time among wrong answers
  const wrong = attempts.filter((a) => !a.correct);
  const times = wrong.map((a) => a.timeSpent).sort((p, q) => p - q);
  const median = times.length ? times[Math.floor(times.length / 2)] : 0;
  let careless = 0;
  let gap = 0;
  for (const a of wrong) {
    if (a.timeSpent <= Math.max(8, median * 0.6)) careless += 1;
    else gap += 1;
  }

  const topMissedConcepts = [...missMap.entries()]
    .map(([concept, misses]) => ({ concept, misses }))
    .sort((a, b) => b.misses - a.misses)
    .slice(0, 5);

  return {
    bySubtopic,
    byConcept,
    byDifficulty,
    byType,
    weakestSubtopic: bySubtopic.find((s) => s.total >= 2),
    weakestConcept: byConcept.find((s) => s.total >= 2),
    careless,
    gap,
    topMissedConcepts,
    totalAttempts: attempts.length,
  };
}
