import { describe, expect, it } from 'vitest';
import {
  buildAdaptiveExam,
  buildExam,
  filterPool,
  generateHardyWeinbergVariant,
  seededShuffle,
} from './generator';
import { isCorrect } from './grade';
import { QUESTIONS } from '../data/questions';
import type { AttemptRecord } from '../types';

describe('seededShuffle', () => {
  it('is deterministic for the same seed', () => {
    const a = seededShuffle([1, 2, 3, 4, 5, 6, 7, 8], 42);
    const b = seededShuffle([1, 2, 3, 4, 5, 6, 7, 8], 42);
    expect(a).toEqual(b);
  });

  it('preserves all elements', () => {
    const input = [1, 2, 3, 4, 5];
    const out = seededShuffle(input, 7);
    expect([...out].sort()).toEqual(input);
  });
});

describe('filterPool', () => {
  it('filters by round', () => {
    const pre = filterPool(QUESTIONS, 'preliminary', []);
    expect(pre.every((q) => q.round === 'preliminary')).toBe(true);
  });

  it('filters by domain set', () => {
    const cell = filterPool(QUESTIONS, 'preliminary', ['cell']);
    expect(cell.every((q) => q.domain === 'cell' && q.round === 'preliminary')).toBe(true);
  });
});

describe('buildExam', () => {
  it('respects the requested count', () => {
    const exam = buildExam(QUESTIONS, { round: 'preliminary', domains: [], count: 6 }, 1);
    expect(exam.length).toBeLessThanOrEqual(6);
    expect(exam.length).toBeGreaterThan(0);
  });

  it('only includes the requested round', () => {
    const exam = buildExam(QUESTIONS, { round: 'semifinal', domains: [], count: 5 }, 2);
    expect(exam.every((q) => q.round === 'semifinal')).toBe(true);
  });

  it('only includes requested domains', () => {
    const exam = buildExam(
      QUESTIONS,
      { round: 'preliminary', domains: ['genetics'], count: 5 },
      3,
    );
    expect(exam.every((q) => q.domain === 'genetics')).toBe(true);
  });

  it('produces no duplicate questions', () => {
    const exam = buildExam(QUESTIONS, { round: 'preliminary', domains: [], count: 12 }, 9);
    const ids = exam.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('is reproducible with the same seed', () => {
    const a = buildExam(QUESTIONS, { round: 'preliminary', domains: [], count: 8 }, 123);
    const b = buildExam(QUESTIONS, { round: 'preliminary', domains: [], count: 8 }, 123);
    expect(a.map((q) => q.id)).toEqual(b.map((q) => q.id));
  });
});

describe('buildAdaptiveExam', () => {
  it('prioritises weak domains', () => {
    // user is strong in cell, weak in genetics
    const attempts: AttemptRecord[] = [];
    let t = 1;
    for (let i = 0; i < 6; i++) {
      attempts.push({
        questionId: `c${i}`,
        domain: 'cell',
        round: 'preliminary',
        difficulty: 2,
        selected: ['A'],
        correct: true,
        timeSpent: 10,
        timestamp: t++,
      });
    }
    const exam = buildAdaptiveExam(
      QUESTIONS,
      attempts,
      { round: 'preliminary', domains: [], count: 8 },
      5,
    );
    expect(exam.length).toBeGreaterThan(0);
    // genetics (weak/unseen) should be represented at least as often as cell (strong)
    const gCount = exam.filter((q) => q.domain === 'genetics').length;
    const cCount = exam.filter((q) => q.domain === 'cell').length;
    expect(gCount).toBeGreaterThanOrEqual(cCount);
  });

  it('returns no duplicates', () => {
    const exam = buildAdaptiveExam(
      QUESTIONS,
      [],
      { round: 'preliminary', domains: [], count: 10 },
      11,
    );
    const ids = exam.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('generateHardyWeinbergVariant', () => {
  it('produces a self-consistent, solvable question', () => {
    for (const seed of [1, 2, 99, 1000, 54321]) {
      const q = generateHardyWeinbergVariant(seed);
      expect(q.generated).toBe(true);
      expect(q.options).toHaveLength(4);
      // exactly one answer, and it must be present among options
      expect(q.answer).toHaveLength(1);
      const ids = q.options.map((o) => o.id);
      expect(ids).toContain(q.answer[0]);
      // the stated answer should grade as correct
      expect(isCorrect(q, q.answer)).toBe(true);
      // options are unique
      expect(new Set(q.options.map((o) => o.text)).size).toBe(4);
    }
  });
});

import {
  generateQuestionSet,
  generateRecombinationVariant,
  generateEnzymeKineticsVariant,
  generateSurfaceVolumeVariant,
} from './generator';

describe('extra generators', () => {
  it('recombination variant is solvable and self-consistent', () => {
    for (const seed of [1, 2, 7, 100]) {
      const q = generateRecombinationVariant(seed);
      expect(q.answer).toHaveLength(1);
      expect(q.options.map((o) => o.id)).toContain(q.answer[0]);
      expect(isCorrect(q, q.answer)).toBe(true);
      expect(q.simple).toBeTruthy();
    }
  });

  it('enzyme kinetics variant has the correct Km/Vmax answer', () => {
    const comp = generateEnzymeKineticsVariant(2); // even => competitive
    const compAns = comp.options.find((o) => o.id === comp.answer[0])!.text;
    expect(compAns).toBe('Vmax 不變、Km 增大');
    const non = generateEnzymeKineticsVariant(3); // odd => non-competitive
    const nonAns = non.options.find((o) => o.id === non.answer[0])!.text;
    expect(nonAns).toBe('Vmax 下降、Km 不變');
  });

  it('surface/volume variant is solvable', () => {
    for (const seed of [0, 1, 2, 5]) {
      const q = generateSurfaceVolumeVariant(seed);
      expect(isCorrect(q, q.answer)).toBe(true);
      expect(new Set(q.options.map((o) => o.text)).size).toBe(4);
    }
  });

  it('generateQuestionSet returns the requested count of generated questions', () => {
    const set = generateQuestionSet(6, 42);
    expect(set).toHaveLength(6);
    expect(set.every((q) => q.generated)).toBe(true);
    expect(new Set(set.map((q) => q.id)).size).toBe(6);
  });
});
