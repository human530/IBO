/**
 * 中華民國生物奧林匹亞各階段晉級模型（用於分數落點、贏過多少人、要保持第幾名）。
 *
 * 依公開資料整理（名額逐年微調，這裡為近年代表值；分數線逐年不同，可於設定調整）：
 * - 初賽：全國約 3000 名考生，取到考前約 5%（不少於 200 名）晉級複賽。滿分 120。
 * - 複賽：約 200 名，取約 30 名（另加科展能力競賽前 10）進選拔營。
 * - 選拔營：約 40 名，取 8 名進決選營。
 * - 決選營：8 名中取 4 名為正取國手（代表參加 IBO）。
 */
export type StageId = 'preliminary' | 'semifinal' | 'camp' | 'final';

export interface Stage {
  id: StageId;
  name: string;
  emoji: string;
  maxScore: number;
  cohortSize: number;
  advanceCount: number;
  /** 參考及格／晉級分數線（百分比；逐年不同，預設值可調整） */
  cutoffPct: number;
  /** reference distribution for converting a % into a percentile */
  mean: number;
  sd: number;
  note: string;
}

export const STAGES: Stage[] = [
  {
    id: 'preliminary',
    name: '初賽',
    emoji: '①',
    maxScore: 120,
    cohortSize: 3000,
    advanceCount: 200,
    cutoffPct: 50, // 120 分中約 60 分（逐年不同）
    mean: 48,
    sd: 18,
    note: '取到考前約 5%（不少於 200 名）晉級複賽。',
  },
  {
    id: 'semifinal',
    name: '複賽',
    emoji: '②',
    maxScore: 100,
    cohortSize: 200,
    advanceCount: 30,
    cutoffPct: 60,
    mean: 56,
    sd: 14,
    note: '約取 30 名（另加科展能力競賽前 10）進選拔營。',
  },
  {
    id: 'camp',
    name: '選拔營',
    emoji: '⛺',
    maxScore: 100,
    cohortSize: 40,
    advanceCount: 8,
    cutoffPct: 68,
    mean: 62,
    sd: 12,
    note: '約 40 名中取 8 名進決選營（理論＋實作）。',
  },
  {
    id: 'final',
    name: '決選營（國手）',
    emoji: '🏅',
    maxScore: 100,
    cohortSize: 8,
    advanceCount: 4,
    cutoffPct: 72,
    mean: 70,
    sd: 10,
    note: '8 名中取 4 名為正取國手，代表參加 IBO。',
  },
];

export const STAGE_MAP: Record<StageId, Stage> = STAGES.reduce(
  (a, s) => {
    a[s.id] = s;
    return a;
  },
  {} as Record<StageId, Stage>,
);

function erf(x: number): number {
  const t = 1 / (1 + 0.3275911 * Math.abs(x));
  const y =
    1 -
    ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t +
      0.254829592) *
      t *
      Math.exp(-x * x);
  return Math.sign(x) * y;
}
function normalCdf(x: number, mean: number, sd: number): number {
  return 0.5 * (1 + erf((x - mean) / (sd * Math.SQRT2)));
}
/** Inverse normal CDF (Acklam's approximation). */
function invNorm(p: number): number {
  if (p <= 0) return -6;
  if (p >= 1) return 6;
  const a = [-39.6968302866538, 220.946098424521, -275.928510446969, 138.357751867269, -30.6647980661472, 2.50662827745924];
  const b = [-54.4760987982241, 161.585836858041, -155.698979859887, 66.8013118877197, -13.2806815528857];
  const c = [-0.00778489400243029, -0.322396458041136, -2.40075827716184, -2.54973253934373, 4.37466414146497, 2.93816398269878];
  const d = [0.00778469570904146, 0.32246712907004, 2.445134137143, 3.75440866190742];
  const pl = 0.02425;
  let q, r;
  if (p < pl) {
    q = Math.sqrt(-2 * Math.log(p));
    return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  } else if (p <= 1 - pl) {
    q = p - 0.5;
    r = q * q;
    return ((((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q) / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
  }
  q = Math.sqrt(-2 * Math.log(1 - p));
  return -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
}

export interface StageOutcome {
  stage: Stage;
  /** raw score on the stage's max */
  rawScore: number;
  /** advancement cutoff score on the stage's max */
  cutoffScore: number;
  /** percentile (0–100): share scoring at or below you */
  percentile: number;
  /** estimated people you beat */
  beats: number;
  /** projected rank (1 = best) */
  rank: number;
  /** rank you must stay within to advance */
  requiredRank: number;
  advances: boolean;
  /** % needed (on max) at this stage's line to advance */
  requiredPct: number;
}

/** Evaluate a percentage score against a stage's advancement model. */
export function stageOutcome(pct: number, stage: Stage): StageOutcome {
  const below = normalCdf(pct, stage.mean, stage.sd);
  const percentile = Math.min(99.9, Math.max(0.1, Math.round(below * 1000) / 10));
  const topFraction = Math.max(0.0003, 1 - below);
  const rank = Math.max(1, Math.round(topFraction * stage.cohortSize));
  const beats = Math.max(0, stage.cohortSize - rank);
  const requiredTop = stage.advanceCount / stage.cohortSize;
  const requiredPctRaw = stage.mean + stage.sd * invNorm(1 - requiredTop);
  const requiredPct = Math.round(Math.max(stage.cutoffPct, requiredPctRaw) * 10) / 10;
  return {
    stage,
    rawScore: Math.round((pct / 100) * stage.maxScore),
    cutoffScore: Math.round((requiredPct / 100) * stage.maxScore),
    percentile,
    beats,
    rank,
    requiredRank: stage.advanceCount,
    advances: rank <= stage.advanceCount,
    requiredPct,
  };
}

/** The % you must sustain at every stage to become a 國手 (binding hardest line). */
export function nationalTeamSustainPct(): number {
  return Math.max(...STAGES.map((s) => stageOutcome(s.cutoffPct, s).requiredPct));
}

export function stageForRound(round: 'preliminary' | 'semifinal'): Stage {
  return STAGE_MAP[round];
}
