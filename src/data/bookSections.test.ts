import { describe, expect, it } from 'vitest';
import { BOOK_SECTIONS } from './bookSections';
import { TEXTBOOKS } from './textbooks';

describe('bookSections', () => {
  it('covers every chapter of every book', () => {
    for (const b of TEXTBOOKS) {
      for (const u of b.units) {
        for (const c of u.chapters) {
          const secs = BOOK_SECTIONS[b.id]?.[c.ch];
          expect(secs, `${b.id} ${c.ch}`).toBeDefined();
          expect(secs!.length).toBeGreaterThanOrEqual(2);
        }
      }
    }
  });

  it('marks some sections as 會考 (exam) and each has title+note', () => {
    let exam = 0;
    let total = 0;
    for (const chs of Object.values(BOOK_SECTIONS)) {
      for (const secs of Object.values(chs)) {
        for (const s of secs) {
          total++;
          if (s.exam) exam++;
          expect(s.t.length).toBeGreaterThan(0);
          expect(s.n.length).toBeGreaterThan(0);
        }
      }
    }
    expect(total).toBeGreaterThan(100);
    expect(exam).toBeGreaterThan(50);
    expect(exam).toBeLessThan(total); // not everything is 會考
  });
});
