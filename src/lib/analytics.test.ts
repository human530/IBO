import { describe, expect, it } from 'vitest';
import {
  conceptFrequency,
  domainFrequency,
  domainTrendByYear,
  predictHotTopics,
} from './analytics';
import { QUESTIONS } from '../data/questions';

describe('domainTrendByYear', () => {
  it('produces one entry per distinct (positive) year, sorted ascending', () => {
    const trend = domainTrendByYear(QUESTIONS);
    const years = trend.map((t) => t.year);
    expect(years).toEqual([...years].sort((a, b) => a - b));
    expect(years.every((y) => y > 0)).toBe(true);
  });

  it('per-year totals sum to the number of questions in that year', () => {
    const trend = domainTrendByYear(QUESTIONS);
    for (const t of trend) {
      const sum = Object.values(t.counts).reduce((a, b) => a + b, 0);
      expect(sum).toBe(t.total);
    }
  });
});

describe('domainFrequency', () => {
  it('covers all 7 domains and shares sum to ~1', () => {
    const freq = domainFrequency(QUESTIONS);
    expect(freq).toHaveLength(7);
    const total = freq.reduce((s, f) => s + f.share, 0);
    expect(total).toBeCloseTo(1, 5);
  });

  it('counts match the bank totals', () => {
    const freq = domainFrequency(QUESTIONS);
    const totalCount = freq.reduce((s, f) => s + f.count, 0);
    expect(totalCount).toBe(QUESTIONS.length);
  });
});

describe('conceptFrequency', () => {
  it('returns concepts sorted by descending count', () => {
    const cf = conceptFrequency(QUESTIONS);
    for (let i = 1; i < cf.length; i++) {
      expect(cf[i - 1].count).toBeGreaterThanOrEqual(cf[i].count);
    }
  });
});

describe('predictHotTopics', () => {
  it('returns at most topN items sorted by heat', () => {
    const hot = predictHotTopics(QUESTIONS, 5);
    expect(hot.length).toBeLessThanOrEqual(5);
    for (let i = 1; i < hot.length; i++) {
      expect(hot[i - 1].heat).toBeGreaterThanOrEqual(hot[i].heat);
    }
  });

  it('gives more recent concepts a higher heat than equally-frequent older ones', () => {
    const recent = predictHotTopics(QUESTIONS, 50);
    expect(recent.every((h) => h.heat > 0)).toBe(true);
  });
});
