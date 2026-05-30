import { describe, expect, it } from 'vitest';
import { STAGES, stageOutcome, nationalTeamSustainPct, stageForRound } from './cutoffs';

describe('stage cutoffs', () => {
  it('models 4 stages with shrinking advancement', () => {
    expect(STAGES.map((s) => s.id)).toEqual(['preliminary', 'semifinal', 'camp', 'final']);
    expect(STAGES[0].maxScore).toBe(120);
    expect(STAGES[STAGES.length - 1].advanceCount).toBe(4);
  });

  it('higher % yields better rank, more people beaten, and can advance', () => {
    const pre = STAGES[0];
    const low = stageOutcome(40, pre);
    const high = stageOutcome(95, pre);
    expect(high.rank).toBeLessThan(low.rank);
    expect(high.beats).toBeGreaterThan(low.beats);
    expect(high.advances).toBe(true);
    expect(low.advances).toBe(false);
    expect(high.rawScore).toBe(Math.round(0.95 * 120));
  });

  it('rank never exceeds cohort and requiredRank equals advanceCount', () => {
    for (const s of STAGES) {
      const o = stageOutcome(55, s);
      expect(o.rank).toBeLessThanOrEqual(s.cohortSize);
      expect(o.requiredRank).toBe(s.advanceCount);
    }
  });

  it('national-team sustain target is a sensible percentage', () => {
    const p = nationalTeamSustainPct();
    expect(p).toBeGreaterThan(50);
    expect(p).toBeLessThan(100);
  });

  it('maps round to stage', () => {
    expect(stageForRound('preliminary').name).toBe('初賽');
    expect(stageForRound('semifinal').name).toBe('複賽');
  });
});
