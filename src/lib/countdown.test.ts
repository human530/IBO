import { describe, expect, it } from 'vitest';
import { daysUntil, timeUntil } from './countdown';

describe('timeUntil', () => {
  const now = new Date('2026-01-01T00:00:00Z').getTime();

  it('breaks down a future duration', () => {
    const target = '2026-01-03T01:02:03Z';
    const cd = timeUntil(target, now);
    expect(cd.past).toBe(false);
    expect(cd.days).toBe(2);
    expect(cd.hours).toBe(1);
    expect(cd.minutes).toBe(2);
    expect(cd.seconds).toBe(3);
  });

  it('flags past dates', () => {
    const cd = timeUntil('2025-12-31T00:00:00Z', now);
    expect(cd.past).toBe(true);
    expect(cd.days).toBe(1);
  });
});

describe('daysUntil', () => {
  const now = new Date('2026-01-01T00:00:00Z').getTime();
  it('counts whole days ahead (ceil)', () => {
    expect(daysUntil('2026-01-11T12:00:00Z', now)).toBe(11);
  });
  it('returns non-positive for past', () => {
    expect(daysUntil('2025-12-30T00:00:00Z', now)).toBeLessThanOrEqual(0);
  });
});
