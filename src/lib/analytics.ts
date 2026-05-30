import type { DomainId, Question } from '../types';
import { DOMAINS } from '../data/domains';

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
