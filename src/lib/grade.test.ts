import { describe, expect, it } from 'vitest';
import { isCorrect } from './grade';
import type { Question } from '../types';

const single: Question = {
  id: 'q1',
  year: 2024,
  round: 'preliminary',
  domain: 'cell',
  subtopic: 't',
  difficulty: 2,
  type: 'single',
  stem: 's',
  options: [
    { id: 'A', text: 'a' },
    { id: 'B', text: 'b' },
  ],
  answer: ['B'],
  explanation: 'e',
  concepts: [],
};

const multi: Question = { ...single, id: 'q2', type: 'multiple', answer: ['A', 'C'] };

describe('isCorrect', () => {
  it('grades a correct single answer', () => {
    expect(isCorrect(single, ['B'])).toBe(true);
  });

  it('grades a wrong single answer', () => {
    expect(isCorrect(single, ['A'])).toBe(false);
  });

  it('requires an exact set match for multiple answers', () => {
    expect(isCorrect(multi, ['A', 'C'])).toBe(true);
    expect(isCorrect(multi, ['C', 'A'])).toBe(true); // order independent
  });

  it('gives no partial credit', () => {
    expect(isCorrect(multi, ['A'])).toBe(false);
    expect(isCorrect(multi, ['A', 'C', 'B'])).toBe(false);
  });

  it('treats empty selection as incorrect', () => {
    expect(isCorrect(single, [])).toBe(false);
  });
});
