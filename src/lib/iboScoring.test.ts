import { describe, expect, it } from 'vitest';
import {
  cohortDistribution,
  estimatePlacement,
  medalForTopFraction,
  normalCdf,
  scoreExam,
  scoreQuestion,
} from './iboScoring';
import { COHORTS } from './iboScoring';
import type { Question } from '../types';

function q(partial: Partial<Question>): Question {
  return {
    id: 'q',
    year: 2024,
    round: 'preliminary',
    domain: 'cell',
    subtopic: 't',
    difficulty: 3,
    type: 'single',
    stem: 's',
    options: [
      { id: 'A', text: 'a' },
      { id: 'B', text: 'b' },
      { id: 'C', text: 'c' },
      { id: 'D', text: 'd' },
    ],
    answer: ['A'],
    explanation: 'e',
    concepts: [],
    ...partial,
  };
}

describe('scoreQuestion (official per-statement)', () => {
  it('single answer is all-or-nothing', () => {
    const single = q({ type: 'single', answer: ['B'] });
    expect(scoreQuestion(single, ['B'])).toBe(1);
    expect(scoreQuestion(single, ['A'])).toBe(0);
    expect(scoreQuestion(single, [])).toBe(0);
  });

  it('multiple gives proportional partial credit over all options', () => {
    const multi = q({ type: 'multiple', answer: ['A', 'C'] });
    // perfect: all 4 T/F decisions correct
    expect(scoreQuestion(multi, ['A', 'C'])).toBe(1);
    // selected A only: A correct(T), C wrong(F), B correct(F), D correct(F) ⇒ 3/4
    expect(scoreQuestion(multi, ['A'])).toBeCloseTo(0.75, 5);
    // selected A,B: A right, B wrong(marked T should be F), C wrong(F), D right ⇒ 2/4
    expect(scoreQuestion(multi, ['A', 'B'])).toBeCloseTo(0.5, 5);
    // selecting everything: A,C right (T), B,D wrong ⇒ 2/4
    expect(scoreQuestion(multi, ['A', 'B', 'C', 'D'])).toBeCloseTo(0.5, 5);
  });

  it('true-false is all-or-nothing', () => {
    const tf = q({
      type: 'truefalse',
      options: [
        { id: 'A', text: '正確' },
        { id: 'B', text: '錯誤' },
      ],
      answer: ['B'],
    });
    expect(scoreQuestion(tf, ['B'])).toBe(1);
    expect(scoreQuestion(tf, ['A'])).toBe(0);
  });
});

describe('scoreExam', () => {
  it('aggregates raw, max and percentage', () => {
    const graded = [
      { question: q({ id: 'q1', type: 'single', answer: ['A'] }), selected: ['A'] }, // 1
      { question: q({ id: 'q2', type: 'multiple', answer: ['A', 'C'] }), selected: ['A'] }, // 0.75
      { question: q({ id: 'q3', type: 'single', answer: ['A'] }), selected: ['B'] }, // 0
    ];
    const r = scoreExam(graded);
    expect(r.maxScore).toBe(3);
    expect(r.rawScore).toBeCloseTo(1.75, 5);
    expect(r.fullyCorrect).toBe(1);
    expect(r.percentage).toBeCloseTo(58.3, 1);
  });

  it('handles empty exams without dividing by zero', () => {
    const r = scoreExam([]);
    expect(r.maxScore).toBe(0);
    expect(r.percentage).toBe(0);
  });
});

describe('normalCdf', () => {
  it('is 0.5 at the mean and monotonic', () => {
    expect(normalCdf(50, 50, 10)).toBeCloseTo(0.5, 2);
    expect(normalCdf(40, 50, 10)).toBeLessThan(normalCdf(60, 50, 10));
    expect(normalCdf(80, 50, 10)).toBeGreaterThan(0.99);
  });
});

describe('medalForTopFraction', () => {
  it('maps IBO 1:2:3 cut-offs', () => {
    expect(medalForTopFraction(0.05)).toBe('gold');
    expect(medalForTopFraction(0.2)).toBe('silver');
    expect(medalForTopFraction(0.5)).toBe('bronze');
    expect(medalForTopFraction(0.8)).toBe('none');
  });
});

describe('estimatePlacement', () => {
  it('higher scores yield better (smaller) rank and higher percentile', () => {
    const low = estimatePlacement(40, 'semifinal');
    const high = estimatePlacement(90, 'semifinal');
    expect(high.percentile).toBeGreaterThan(low.percentile);
    expect(high.rank).toBeLessThan(low.rank);
    expect(high.topFraction).toBeLessThan(low.topFraction);
  });

  it('a top score reaches the 複賽前段 goal and earns a medal', () => {
    const p = estimatePlacement(95, 'semifinal');
    expect(p.reachesFrontRunner).toBe(true);
    expect(['gold', 'silver']).toContain(p.medal);
  });

  it('rank never exceeds the cohort size and is at least 1', () => {
    for (const pct of [0, 25, 50, 75, 100]) {
      const p = estimatePlacement(pct, 'preliminary');
      expect(p.rank).toBeGreaterThanOrEqual(1);
      expect(p.rank).toBeLessThanOrEqual(COHORTS.preliminary.size);
    }
  });
});

describe('cohortDistribution', () => {
  it('produces 20 five-point bins covering 0–100', () => {
    const dist = cohortDistribution('semifinal');
    expect(dist).toHaveLength(20);
    expect(dist[0].bin).toBe(0);
    expect(dist[dist.length - 1].bin).toBe(95);
  });

  it('total roughly matches the cohort size', () => {
    const dist = cohortDistribution('preliminary');
    const total = dist.reduce((s, d) => s + d.count, 0);
    // most of the mass falls within 0–100; allow tail loss
    expect(total).toBeGreaterThan(COHORTS.preliminary.size * 0.8);
    expect(total).toBeLessThanOrEqual(COHORTS.preliminary.size);
  });
});
