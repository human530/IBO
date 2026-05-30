import { describe, expect, it } from 'vitest';
import { IBO_STYLE } from './iboStyle';
import { buildExam } from '../lib/generator';
import { scoreQuestion } from '../lib/iboScoring';

describe('IBO_STYLE bank', () => {
  it('has multi-statement questions with simple explanations', () => {
    expect(IBO_STYLE.length).toBeGreaterThanOrEqual(8);
    for (const q of IBO_STYLE) {
      expect(q.type).toBe('multiple');
      expect(q.options.length).toBe(4);
      expect(q.answer.length).toBeGreaterThanOrEqual(1);
      expect(q.simple && q.simple.length).toBeGreaterThan(0);
      // a fully-correct response scores 1 under official per-statement marking
      expect(scoreQuestion(q, q.answer)).toBe(1);
    }
  });

  it('can be assembled into an IBO-style paper via buildExam', () => {
    const paper = buildExam(IBO_STYLE, { round: 'semifinal', domains: [], count: 6 }, 7);
    expect(paper.length).toBeGreaterThan(0);
    expect(paper.length).toBeLessThanOrEqual(6);
    expect(paper.every((q) => q.source === 'IBO 風格')).toBe(true);
    expect(new Set(paper.map((q) => q.id)).size).toBe(paper.length);
  });
});
