import type { Question, Round } from '../types';

/**
 * 生物奧林匹亞官方計分演算法 (IBO-style scoring).
 *
 * IBO theory questions are sets of independent True/False statements: the
 * candidate must commit a T/F decision on every statement and is credited the
 * *proportion* of statements decided correctly. We map our question types onto
 * that model:
 *
 *  - `multiple` (select-all): each option is a T/F statement. "Selected" means
 *    the candidate marked it True, "not selected" means False. The question
 *    score is (correct T/F decisions) / (number of options) ∈ [0,1].
 *  - `single` / `truefalse`: single-statement, all-or-nothing (1 or 0).
 *
 * Totals are normalised to a percentage of the maximum attainable, exactly as
 * the IBO normalises raw theory marks before ranking.
 */
export function scoreQuestion(question: Question, selected: string[]): number {
  if (question.type === 'multiple') {
    const total = question.options.length || 1;
    let correctMarks = 0;
    for (const opt of question.options) {
      const isAnswer = question.answer.includes(opt.id);
      const marked = selected.includes(opt.id);
      if (isAnswer === marked) correctMarks += 1;
    }
    return correctMarks / total;
  }
  // single / true-false: exact match required
  const a = [...question.answer].sort();
  const b = [...selected].sort();
  const exact = a.length === b.length && a.every((v, i) => v === b[i]);
  return exact ? 1 : 0;
}

export interface QuestionScore {
  questionId: string;
  score: number; // 0–1
  max: number; // always 1 in this model
}

export interface IboExamResult {
  rawScore: number; // Σ per-question score
  maxScore: number; // number of graded questions
  percentage: number; // 0–100
  perQuestion: QuestionScore[];
  fullyCorrect: number; // questions scored exactly 1
}

/** Aggregate an exam using the official per-statement model. */
export function scoreExam(
  graded: { question: Question; selected: string[] }[],
): IboExamResult {
  const perQuestion: QuestionScore[] = graded.map(({ question, selected }) => ({
    questionId: question.id,
    score: scoreQuestion(question, selected),
    max: 1,
  }));
  const rawScore = perQuestion.reduce((s, q) => s + q.score, 0);
  const maxScore = perQuestion.length;
  const fullyCorrect = perQuestion.filter((q) => q.score >= 1 - 1e-9).length;
  return {
    rawScore: Math.round(rawScore * 100) / 100,
    maxScore,
    percentage: maxScore ? Math.round((rawScore / maxScore) * 1000) / 10 : 0,
    perQuestion,
    fullyCorrect,
  };
}

// ─────────────────────── 分數落點 / 排名 (placement & ranking) ───────────────────────

export interface CohortParams {
  /** mean percentage of the reference cohort */
  mean: number;
  /** standard deviation of the reference cohort */
  sd: number;
  /** typical number of participants at this stage */
  size: number;
}

/**
 * Reference cohorts modelled on the spread of real olympiad fields. Used to
 * estimate where a score lands and the likely rank — there are no other live
 * participants in a solo study app, so we project against these distributions.
 */
export const COHORTS: Record<Round, CohortParams> = {
  preliminary: { mean: 48, sd: 18, size: 600 },
  semifinal: { mean: 58, sd: 13, size: 80 },
};

/** Gaussian error function (Abramowitz & Stegun 7.1.26). */
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

/** Normal CDF. */
export function normalCdf(x: number, mean: number, sd: number): number {
  return 0.5 * (1 + erf((x - mean) / (sd * Math.SQRT2)));
}

export type Medal = 'gold' | 'silver' | 'bronze' | 'none';

export interface Placement {
  /** percentile (0–100): share of the cohort scoring at or below the user */
  percentile: number;
  /** fraction of the cohort ranked above the user (0–1) */
  topFraction: number;
  /** projected rank (1 = best) */
  rank: number;
  cohortSize: number;
  medal: Medal;
  /** human-readable 落點 label */
  label: string;
  /** whether this clears the 複賽前段 goal */
  reachesFrontRunner: boolean;
}

/**
 * IBO medal cut-offs follow Gold:Silver:Bronze ≈ 1:2:3, awarded by rank:
 * Gold ≈ top 10%, Silver ≈ next 20% (→30%), Bronze ≈ next 30% (→60%).
 */
export function medalForTopFraction(topFraction: number): Medal {
  if (topFraction <= 0.1) return 'gold';
  if (topFraction <= 0.3) return 'silver';
  if (topFraction <= 0.6) return 'bronze';
  return 'none';
}

export const MEDAL_LABEL: Record<Medal, string> = {
  gold: '金牌',
  silver: '銀牌',
  bronze: '銅牌',
  none: '佳作 / 無獎牌',
};

/** Estimate placement of a percentage score within the round's cohort. */
export function estimatePlacement(percentage: number, round: Round): Placement {
  const params = COHORTS[round];
  const below = normalCdf(percentage, params.mean, params.sd); // 0–1
  const percentile = Math.min(99.9, Math.max(0.1, Math.round(below * 1000) / 10));
  const topFraction = Math.max(0.001, 1 - below);
  const rank = Math.max(1, Math.round(topFraction * params.size));
  const medal = medalForTopFraction(topFraction);
  const reachesFrontRunner = topFraction <= 0.25; // top quartile = 前段

  let label: string;
  if (round === 'semifinal') {
    if (topFraction <= 0.1) label = '複賽頂尖（國手候選區）';
    else if (topFraction <= 0.25) label = '複賽前段（達成目標！）';
    else if (topFraction <= 0.5) label = '複賽中段';
    else label = '複賽後段，仍需加強';
  } else {
    if (topFraction <= 0.2) label = '初賽前段，可望晉級複賽';
    else if (topFraction <= 0.5) label = '初賽中段，晉級邊緣';
    else label = '初賽後段，需大幅提升';
  }

  return { percentile, topFraction, rank, cohortSize: params.size, medal, label, reachesFrontRunner };
}

/**
 * Build a smooth reference distribution (percentage bins) for charting, with
 * the user's score marked. Returns counts per 5-point bin scaled to cohort size.
 */
export function cohortDistribution(round: Round): { bin: number; count: number }[] {
  const { mean, sd, size } = COHORTS[round];
  const bins: { bin: number; count: number }[] = [];
  for (let b = 0; b < 100; b += 5) {
    const lo = normalCdf(b, mean, sd);
    const hi = normalCdf(b + 5, mean, sd);
    bins.push({ bin: b, count: Math.round((hi - lo) * size) });
  }
  return bins;
}
