import { describe, expect, it } from 'vitest';
import { BOOK_COMPARE, CAMP_FOCUS, CAMP_INFO } from './camp';

describe('camp data', () => {
  it('has exam direction and focus items with 難題簡單化', () => {
    expect(CAMP_INFO.direction.length).toBeGreaterThan(0);
    expect(CAMP_FOCUS.length).toBeGreaterThanOrEqual(10);
    for (const f of CAMP_FOCUS) {
      expect(f.simple.length).toBeGreaterThan(0);
      expect(f.must.length).toBeGreaterThan(0);
      expect(f.book.length).toBeGreaterThan(0);
    }
  });

  it('covers the requested textbooks in the comparison', () => {
    const all = BOOK_COMPARE.map((b) => b.best).join(' ');
    for (const kw of ['Vander', 'Immunolog', 'Campbell', '陳佳芬', '植物生理學', '基礎遺傳學']) {
      expect(all).toContain(kw);
    }
  });
});
