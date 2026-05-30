import { describe, expect, it } from 'vitest';
import { TEXTBOOKS } from './textbooks';

describe('textbooks', () => {
  it('includes the requested books', () => {
    const titles = TEXTBOOKS.map((b) => b.title).join(' ');
    for (const kw of ['Campbell', 'Vander', 'Immunology', 'Plant Physiology', '基礎遺傳學', '分子生物學', '陳佳芬']) {
      expect(titles).toContain(kw);
    }
  });

  it('every chapter has a simple summary and points', () => {
    for (const b of TEXTBOOKS) {
      expect(b.units.length).toBeGreaterThan(0);
      for (const u of b.units) {
        for (const c of u.chapters) {
          expect(c.title.length).toBeGreaterThan(0);
          expect(c.simple.length).toBeGreaterThan(0);
          expect(c.points.length).toBeGreaterThanOrEqual(2);
        }
      }
    }
  });
});
