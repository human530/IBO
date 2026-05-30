import type { DomainId, Question } from '../types';
import { DOMAINS } from '../data/domains';
import { HISTORY, type YearComposition } from '../data/history';

export interface DomainYearTrend {
  year: number;
  /** counts keyed by domain id */
  counts: Record<DomainId, number>;
  total: number;
}

/**
 * Build a per-year breakdown of how many questions each domain contributed.
 * Used by the 趨勢分析 charts.
 */
export function domainTrendByYear(questions: Question[]): DomainYearTrend[] {
  const years = Array.from(new Set(questions.map((q) => q.year)))
    .filter((y) => y > 0)
    .sort((a, b) => a - b);

  return years.map((year) => {
    const counts = {} as Record<DomainId, number>;
    for (const d of DOMAINS) counts[d.id] = 0;
    let total = 0;
    for (const q of questions) {
      if (q.year === year) {
        counts[q.domain] += 1;
        total += 1;
      }
    }
    return { year, counts, total };
  });
}

export interface DomainFrequency {
  domain: DomainId;
  count: number;
  /** share of the whole bank (0–1) */
  share: number;
  /** official IBO weighting (0–1) */
  officialWeight: number;
}

export function domainFrequency(questions: Question[]): DomainFrequency[] {
  const counts = {} as Record<DomainId, number>;
  for (const d of DOMAINS) counts[d.id] = 0;
  for (const q of questions) counts[q.domain] += 1;
  const total = questions.length || 1;
  return DOMAINS.map((d) => ({
    domain: d.id,
    count: counts[d.id],
    share: counts[d.id] / total,
    officialWeight: d.weight,
  }));
}

export interface ConceptFrequency {
  concept: string;
  count: number;
  /** most recent year this concept appeared */
  latestYear: number;
  domains: DomainId[];
}

export function conceptFrequency(questions: Question[]): ConceptFrequency[] {
  const map = new Map<string, ConceptFrequency>();
  for (const q of questions) {
    for (const c of q.concepts) {
      const existing = map.get(c);
      if (existing) {
        existing.count += 1;
        existing.latestYear = Math.max(existing.latestYear, q.year);
        if (!existing.domains.includes(q.domain)) existing.domains.push(q.domain);
      } else {
        map.set(c, { concept: c, count: 1, latestYear: q.year, domains: [q.domain] });
      }
    }
  }
  return Array.from(map.values()).sort((a, b) => b.count - a.count);
}

export interface HotTopic {
  concept: string;
  /** Composite heat score: frequency × recency weighting. */
  heat: number;
  count: number;
  latestYear: number;
  domain: DomainId;
}

/**
 * Predict "hot" topics likely to recur by combining how often a concept
 * appears with how recently it appeared. Recent + frequent ⇒ higher heat.
 */
export function predictHotTopics(questions: Question[], topN = 8): HotTopic[] {
  const freqs = conceptFrequency(questions);
  const maxYear = Math.max(...questions.map((q) => q.year).filter((y) => y > 0), 1);
  const minYear = Math.min(...questions.map((q) => q.year).filter((y) => y > 0), maxYear);
  const span = Math.max(1, maxYear - minYear);

  return freqs
    .map((f) => {
      // recency in [0,1]: most recent year ⇒ 1
      const recency = (f.latestYear - minYear) / span;
      const heat = f.count * (0.6 + 0.4 * recency);
      return {
        concept: f.concept,
        heat: Math.round(heat * 100) / 100,
        count: f.count,
        latestYear: f.latestYear,
        domain: f.domains[0],
      };
    })
    .sort((a, b) => b.heat - a.heat)
    .slice(0, topN);
}

// ───────────────────── 20 年歷史趨勢分析與延伸預測 ─────────────────────

export interface YearSharePoint {
  year: number;
  /** share (%) per domain that year */
  [domain: string]: number;
}

/** Per-year share (%) of each domain across the historical window. */
export function historicalShareByYear(history: YearComposition[] = HISTORY): YearSharePoint[] {
  return history.map((h) => {
    const point: YearSharePoint = { year: h.year };
    for (const d of DOMAINS) {
      point[d.id] = Math.round(((h.counts[d.id] ?? 0) / h.total) * 1000) / 10;
    }
    return point;
  });
}

export type TrendDirection = 'up' | 'down' | 'flat';

export interface DomainProjection {
  domain: DomainId;
  /** mean share (%) over the window */
  avgShare: number;
  /** slope in percentage-points per year (least-squares) */
  slope: number;
  direction: TrendDirection;
  /** projected share (%) for the year after the window */
  nextYear: number;
  nextYearShare: number;
}

/**
 * Least-squares linear trend of each domain's share over the 20-year window,
 * with a one-year-ahead extrapolation (相關延伸/評估).
 */
export function domainProjections(history: YearComposition[] = HISTORY): DomainProjection[] {
  const shares = historicalShareByYear(history);
  const n = shares.length;
  const xs = shares.map((_, i) => i);
  const meanX = xs.reduce((a, b) => a + b, 0) / n;
  const lastYear = history[history.length - 1].year;

  return DOMAINS.map((d) => {
    const ys = shares.map((p) => p[d.id] as number);
    const meanY = ys.reduce((a, b) => a + b, 0) / n;
    let num = 0;
    let den = 0;
    xs.forEach((x, i) => {
      num += (x - meanX) * (ys[i] - meanY);
      den += (x - meanX) ** 2;
    });
    const slope = den === 0 ? 0 : num / den;
    const nextShare = Math.max(0, Math.round((meanY + slope * (n - meanX)) * 10) / 10);
    let direction: TrendDirection = 'flat';
    if (slope > 0.08) direction = 'up';
    else if (slope < -0.08) direction = 'down';
    return {
      domain: d.id,
      avgShare: Math.round(meanY * 10) / 10,
      slope: Math.round(slope * 100) / 100,
      direction,
      nextYear: lastYear + 1,
      nextYearShare: nextShare,
    };
  });
}

/** Total questions per year (for a simple line). */
export function totalByYear(history: YearComposition[] = HISTORY): { year: number; total: number }[] {
  return history.map((h) => ({ year: h.year, total: h.total }));
}
