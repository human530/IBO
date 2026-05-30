import { describe, expect, it } from 'vitest';
import { READING_LIST, SUCCESS_FACTORS, DOMAIN_BOOKS } from './strategy';
import { DOMAINS } from './domains';

describe('strategy data', () => {
  it('has success factors and a reading list', () => {
    expect(SUCCESS_FACTORS.length).toBeGreaterThanOrEqual(6);
    expect(SUCCESS_FACTORS.every((f) => f.simple && f.detail)).toBe(true);
    expect(READING_LIST.some((b) => /Campbell/i.test(b.title))).toBe(true);
  });

  it('maps every domain to recommended chapters', () => {
    for (const d of DOMAINS) {
      expect(DOMAIN_BOOKS[d.id]?.campbell.length).toBeGreaterThan(0);
    }
  });
});
