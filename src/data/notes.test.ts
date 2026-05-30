import { describe, expect, it } from 'vitest';
import { DOMAIN_NOTES } from './notes';
import { DOMAINS } from './domains';

describe('DOMAIN_NOTES', () => {
  it('has notes for every one of the 7 domains', () => {
    for (const d of DOMAINS) {
      expect(DOMAIN_NOTES[d.id]?.length ?? 0).toBeGreaterThanOrEqual(4);
    }
  });

  it('every note has a simple explanation and at least 2 points', () => {
    for (const d of DOMAINS) {
      for (const note of DOMAIN_NOTES[d.id]) {
        expect(note.title.length).toBeGreaterThan(0);
        expect(note.simple.length).toBeGreaterThan(0);
        expect(note.points.length).toBeGreaterThanOrEqual(2);
      }
    }
  });
});
