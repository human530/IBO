import { describe, expect, it } from 'vitest';
import { TEXTBOOKS, allFormulas } from './textbooks';

describe('textbooks', () => {
  it('includes the requested books', () => {
    const titles = TEXTBOOKS.map((b) => b.title).join(' ');
    for (const kw of ['Campbell', 'Vander', 'Immunology', 'Plant Physiology', '基礎遺傳學', '分子生物學', '陳佳芬']) {
      expect(titles).toContain(kw);
    }
  });

  it('every chapter has simple, detail, points and (optional) formulas', () => {
    for (const b of TEXTBOOKS) {
      for (const u of b.units) {
        for (const c of u.chapters) {
          expect(c.simple.length).toBeGreaterThan(0);
          expect(c.detail.length).toBeGreaterThan(20);
          expect(c.points.length).toBeGreaterThanOrEqual(2);
          for (const f of c.formulas ?? []) {
            expect(f.name.length).toBeGreaterThan(0);
            expect(f.expr.length).toBeGreaterThan(0);
          }
        }
      }
    }
  });

  it('aggregates formulas across books', () => {
    const all = allFormulas();
    expect(all.length).toBeGreaterThan(15);
    expect(all.some((f) => /哈溫|p²/.test(f.formula.expr) || /哈溫/.test(f.formula.name))).toBe(true);
  });
});
