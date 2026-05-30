import { describe, expect, it } from 'vitest';
import { detailedAnalysis } from './analysis';
import { QUESTIONS } from '../data/questions';
import type { AttemptRecord, DomainId } from '../types';

function att(q: { id: string; domain: DomainId; difficulty: number }, correct: boolean, t: number, time = 30): AttemptRecord {
  return { questionId: q.id, domain: q.domain, round: 'preliminary', difficulty: q.difficulty, selected: ['A'], correct, score: correct ? 1 : 0, timeSpent: time, timestamp: t };
}

describe('detailedAnalysis', () => {
  it('breaks down by subtopic, concept, difficulty and type', () => {
    const sample = QUESTIONS.slice(0, 6);
    const attempts = sample.map((q, i) => att(q, i % 2 === 0, i + 1));
    const a = detailedAnalysis(attempts);
    expect(a.totalAttempts).toBe(6);
    expect(a.bySubtopic.length).toBeGreaterThan(0);
    expect(a.byConcept.length).toBeGreaterThan(0);
    expect(a.byDifficulty.length).toBeGreaterThan(0);
    // sorted weakest-first
    for (let i = 1; i < a.bySubtopic.length; i++) {
      expect(a.bySubtopic[i - 1].accuracy).toBeLessThanOrEqual(a.bySubtopic[i].accuracy);
    }
  });

  it('classifies careless (fast+wrong) vs gap (slow+wrong)', () => {
    const q = QUESTIONS[0];
    const attempts = [att(q, false, 1, 4), att(QUESTIONS[1], false, 2, 90)];
    const a = detailedAnalysis(attempts);
    expect(a.careless + a.gap).toBe(2);
    expect(a.careless).toBeGreaterThanOrEqual(1);
  });
});
