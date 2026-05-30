import type { AttemptRecord, DomainId, Question, Round } from '../types';
import { DOMAINS } from '../data/domains';
import { detectWeaknesses } from './scoring';

export interface ExamConfig {
  round: Round;
  domains: DomainId[]; // empty ⇒ all domains
  count: number;
  /** include generated numeric variants */
  includeVariants?: boolean;
}

/** Deterministic-ish shuffle using a seeded PRNG so tests are reproducible. */
export function seededShuffle<T>(arr: T[], seed: number): T[] {
  const a = [...arr];
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  const next = () => (s = (s * 16807) % 2147483647) / 2147483647;
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(next() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Filter the bank by round and (optional) domain set. */
export function filterPool(
  questions: Question[],
  round: Round,
  domains: DomainId[],
): Question[] {
  return questions.filter((q) => {
    if (q.round !== round) return false;
    if (domains.length > 0 && !domains.includes(q.domain)) return false;
    return true;
  });
}

/**
 * Build a straightforward mock exam: sample `count` questions from the pool,
 * roughly proportional to the IBO official domain weighting when no specific
 * domains are requested.
 */
export function buildExam(
  questions: Question[],
  config: ExamConfig,
  seed = Date.now(),
): Question[] {
  const pool = filterPool(questions, config.round, config.domains);
  if (pool.length === 0) return [];

  const shuffled = seededShuffle(pool, seed);

  // When all domains are in play, bias selection toward official weights.
  if (config.domains.length === 0) {
    const targetPerDomain = new Map<DomainId, number>();
    for (const d of DOMAINS) {
      targetPerDomain.set(d.id, Math.max(1, Math.round(config.count * d.weight)));
    }
    const picked: Question[] = [];
    const usedIds = new Set<string>();
    // first pass: satisfy per-domain targets
    for (const [domain, target] of targetPerDomain) {
      const domainQs = shuffled.filter((q) => q.domain === domain && !usedIds.has(q.id));
      for (let i = 0; i < target && i < domainQs.length; i++) {
        picked.push(domainQs[i]);
        usedIds.add(domainQs[i].id);
      }
    }
    // second pass: fill any remaining slots
    for (const q of shuffled) {
      if (picked.length >= config.count) break;
      if (!usedIds.has(q.id)) {
        picked.push(q);
        usedIds.add(q.id);
      }
    }
    return seededShuffle(picked.slice(0, config.count), seed + 1);
  }

  return shuffled.slice(0, config.count);
}

/**
 * Adaptive exam: weight selection toward the user's weak domains so practice
 * targets the gaps that keep them from the 複賽 front.
 */
export function buildAdaptiveExam(
  questions: Question[],
  attempts: AttemptRecord[],
  config: ExamConfig,
  seed = Date.now(),
): Question[] {
  const pool = filterPool(questions, config.round, config.domains);
  if (pool.length === 0) return [];

  const weaknesses = detectWeaknesses(attempts);
  const priorityMap = new Map<DomainId, number>();
  for (const w of weaknesses) priorityMap.set(w.domain, w.priority);

  // Score each question: weak-domain questions and unseen questions rank higher.
  const seen = new Set(attempts.map((a) => a.questionId));
  const scored = pool.map((q) => {
    const domainPriority = priorityMap.get(q.domain) ?? 0.1;
    const noveltyBonus = seen.has(q.id) ? 0 : 0.3;
    return { q, weight: domainPriority + noveltyBonus };
  });

  // Weighted sampling without replacement.
  const result: Question[] = [];
  const items = [...scored];
  let s = (seed % 2147483647) || 1;
  const next = () => (s = (s * 16807) % 2147483647) / 2147483647;
  while (result.length < config.count && items.length > 0) {
    const totalW = items.reduce((sum, it) => sum + it.weight, 0);
    let r = next() * totalW;
    let idx = 0;
    for (let i = 0; i < items.length; i++) {
      r -= items[i].weight;
      if (r <= 0) {
        idx = i;
        break;
      }
    }
    result.push(items[idx].q);
    items.splice(idx, 1);
  }
  return result;
}

/**
 * Generate a parameterised numeric variant from a template archetype, so the
 * bank can produce fresh practice items ("出題") beyond the fixed set.
 * Currently supports the Hardy–Weinberg archetype.
 */
export function generateHardyWeinbergVariant(seed: number): Question {
  let s = (seed % 2147483647) || 1;
  const next = () => (s = (s * 16807) % 2147483647) / 2147483647;
  // pick q in {0.2,0.3,0.4,0.5,0.6,0.7}
  const qChoices = [0.2, 0.3, 0.4, 0.5, 0.6, 0.7];
  const q = qChoices[Math.floor(next() * qChoices.length)];
  const p = Math.round((1 - q) * 100) / 100;
  const recessive = Math.round(q * q * 100) / 100;
  const het = Math.round(2 * p * q * 100) / 100;
  const distractors = new Set<number>([het]);
  while (distractors.size < 4) {
    const cand = Math.round((het + (next() - 0.5) * 0.3) * 100) / 100;
    if (cand > 0 && cand < 1) distractors.add(cand);
  }
  const opts = seededShuffle(Array.from(distractors), seed + 7);
  const letters = ['A', 'B', 'C', 'D'];
  const options = opts.map((v, i) => ({ id: letters[i], text: v.toFixed(2) }));
  const answer = options.find((o) => Math.abs(parseFloat(o.text) - het) < 1e-9)!.id;

  return {
    id: `gen-hw-${seed}`,
    year: 0,
    round: 'semifinal',
    domain: 'genetics',
    subtopic: '族群遺傳',
    difficulty: 4,
    type: 'single',
    stem: `某族群符合哈溫定律，隱性表現型 (aa) 頻率為 ${recessive.toFixed(
      2,
    )}，求異型合子 (Aa) 的頻率。`,
    options,
    answer: [answer],
    explanation: `q² = ${recessive.toFixed(2)} → q = ${q.toFixed(2)}，p = ${p.toFixed(
      2,
    )}。異型合子頻率 2pq = 2 × ${p.toFixed(2)} × ${q.toFixed(2)} = ${het.toFixed(2)}。`,
    concepts: ['族群遺傳', '哈溫定律', '基因頻率', '異型合子'],
    generated: true,
  };
}
