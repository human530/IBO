import { describe, expect, it } from 'vitest';
import {
  computeDomainStats,
  computeReadiness,
  detectWeaknesses,
  scoreTimeline,
} from './scoring';
import type { AttemptRecord, DomainId, ExamSession } from '../types';

function att(
  domain: DomainId,
  correct: boolean,
  timestamp: number,
  difficulty = 3,
): AttemptRecord {
  return {
    questionId: `${domain}-${timestamp}`,
    domain,
    round: 'preliminary',
    difficulty,
    selected: ['A'],
    correct,
    timeSpent: 20,
    timestamp,
  };
}

describe('computeDomainStats', () => {
  it('returns zeroed stats for unattempted domains', () => {
    const stats = computeDomainStats([]);
    expect(stats).toHaveLength(7);
    expect(stats.every((s) => s.attempted === 0 && s.mastery === 0)).toBe(true);
  });

  it('computes accuracy and applies confidence shrinkage', () => {
    const attempts = [att('cell', true, 1), att('cell', true, 2)];
    const cell = computeDomainStats(attempts).find((s) => s.domain === 'cell')!;
    expect(cell.accuracy).toBe(1);
    // 2 perfect attempts: confidence 2/6 ⇒ mastery well below 100
    expect(cell.mastery).toBeLessThan(50);
    expect(cell.mastery).toBeGreaterThan(0);
  });

  it('weights recent attempts more heavily', () => {
    const improving = [
      att('cell', false, 1),
      att('cell', false, 2),
      att('cell', true, 3),
      att('cell', true, 4),
    ];
    const declining = [
      att('cell', true, 1),
      att('cell', true, 2),
      att('cell', false, 3),
      att('cell', false, 4),
    ];
    const impM = computeDomainStats(improving).find((s) => s.domain === 'cell')!.mastery;
    const decM = computeDomainStats(declining).find((s) => s.domain === 'cell')!.mastery;
    // same raw accuracy (0.5) but improving should score higher due to recency
    expect(impM).toBeGreaterThan(decM);
  });
});

describe('detectWeaknesses', () => {
  it('flags every unattempted domain with full priority', () => {
    const w = detectWeaknesses([]);
    expect(w).toHaveLength(7);
    expect(w.every((x) => x.attempted === 0)).toBe(true);
  });

  it('ranks lower-mastery domains higher', () => {
    const attempts = [
      // strong cell
      att('cell', true, 1),
      att('cell', true, 2),
      att('cell', true, 3),
      att('cell', true, 4),
      att('cell', true, 5),
      att('cell', true, 6),
      att('cell', true, 7),
      att('cell', true, 8),
      // weak genetics
      att('genetics', false, 9),
      att('genetics', false, 10),
      att('genetics', false, 11),
      att('genetics', true, 12),
    ];
    const w = detectWeaknesses(attempts, 70);
    const genetics = w.find((x) => x.domain === 'genetics');
    expect(genetics).toBeDefined();
    // strong cell may still be below threshold due to shrinkage, but genetics must rank above it
    const gIdx = w.findIndex((x) => x.domain === 'genetics');
    const cIdx = w.findIndex((x) => x.domain === 'cell');
    if (cIdx >= 0) expect(gIdx).toBeLessThan(cIdx);
  });
});

describe('computeReadiness', () => {
  it('is 0 with no data and beginner level', () => {
    const r = computeReadiness([]);
    expect(r.score).toBe(0);
    expect(r.level).toBe('beginner');
    expect(r.totalDomains).toBe(7);
  });

  it('rises with consistent correct answers across domains', () => {
    const domains: DomainId[] = [
      'cell',
      'plant',
      'animal',
      'ethology',
      'genetics',
      'ecology',
      'systematics',
    ];
    const attempts: AttemptRecord[] = [];
    let t = 1;
    for (const d of domains) {
      for (let i = 0; i < 12; i++) attempts.push(att(d, true, t++));
    }
    const r = computeReadiness(attempts);
    expect(r.score).toBeGreaterThan(70);
    expect(r.domainsReady).toBe(7);
  });
});

describe('scoreTimeline', () => {
  it('includes only completed sessions sorted by time', () => {
    const sessions: ExamSession[] = [
      {
        id: 's2',
        mode: 'mock',
        round: 'preliminary',
        domains: ['cell'],
        questionIds: ['x'],
        attempts: [att('cell', true, 1)],
        startedAt: 200,
        completedAt: 250,
        durationSec: 0,
      },
      {
        id: 's1',
        mode: 'mock',
        round: 'preliminary',
        domains: ['cell'],
        questionIds: ['y'],
        attempts: [att('cell', false, 2)],
        startedAt: 100,
        completedAt: 150,
        durationSec: 0,
      },
      {
        id: 's3-incomplete',
        mode: 'mock',
        round: 'preliminary',
        domains: ['cell'],
        questionIds: ['z'],
        attempts: [],
        startedAt: 300,
        durationSec: 0,
      },
    ];
    const tl = scoreTimeline(sessions);
    expect(tl).toHaveLength(2);
    expect(tl[0].sessionId).toBe('s1'); // earliest first
    expect(tl[1].sessionId).toBe('s2');
  });
});
