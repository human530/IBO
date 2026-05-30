import type { AttemptRecord, DomainId, ExamSession, Round } from '../types';
import { DOMAINS } from '../data/domains';

export interface DomainStat {
  domain: DomainId;
  attempted: number;
  correct: number;
  accuracy: number; // 0–1, 0 if none attempted
  /** mastery 0–100 with recency weighting + confidence shrinkage */
  mastery: number;
  avgTimeSec: number;
}

/**
 * Recency-weighted accuracy: more recent attempts count more. Returns 0..1.
 * A small confidence shrinkage pulls low-sample domains toward 0 so that a
 * single lucky guess does not register as "mastered".
 */
export function computeDomainStats(attempts: AttemptRecord[]): DomainStat[] {
  return DOMAINS.map((d) => {
    const rel = attempts
      .filter((a) => a.domain === d.id)
      .sort((a, b) => a.timestamp - b.timestamp);

    if (rel.length === 0) {
      return { domain: d.id, attempted: 0, correct: 0, accuracy: 0, mastery: 0, avgTimeSec: 0 };
    }

    const correct = rel.filter((a) => a.correct).length;
    const accuracy = correct / rel.length;

    // recency weighting: weight grows linearly with order
    let wSum = 0;
    let wCorrect = 0;
    rel.forEach((a, i) => {
      const w = 1 + i; // newest attempts have largest index/weight
      wSum += w;
      if (a.correct) wCorrect += w;
    });
    const weightedAcc = wCorrect / wSum;

    // confidence shrinkage: blend toward 0 when few samples
    const confidence = rel.length / (rel.length + 4);
    const mastery = Math.round(weightedAcc * confidence * 100);

    const avgTimeSec =
      Math.round((rel.reduce((s, a) => s + a.timeSpent, 0) / rel.length) * 10) / 10;

    return { domain: d.id, attempted: rel.length, correct, accuracy, mastery, avgTimeSec };
  });
}

export interface Weakness {
  domain: DomainId;
  mastery: number;
  accuracy: number;
  attempted: number;
  /** higher ⇒ more urgent to study (combines low mastery & official weight) */
  priority: number;
}

/**
 * Detect weak domains. Domains never attempted are treated as unknown and get
 * high priority (you cannot reach the 複賽 front without covering everything).
 */
export function detectWeaknesses(attempts: AttemptRecord[], masteryThreshold = 70): Weakness[] {
  const stats = computeDomainStats(attempts);
  const weights = Object.fromEntries(DOMAINS.map((d) => [d.id, d.weight])) as Record<
    DomainId,
    number
  >;

  return stats
    .map((s) => {
      const gap = Math.max(0, masteryThreshold - s.mastery) / 100;
      // unattempted domains: treat as full gap but flag separately via attempted=0
      const coverageGap = s.attempted === 0 ? 1 : gap;
      const priority = Math.round(coverageGap * (0.5 + weights[s.domain]) * 100) / 100;
      return {
        domain: s.domain,
        mastery: s.mastery,
        accuracy: s.accuracy,
        attempted: s.attempted,
        priority,
      };
    })
    .filter((w) => w.attempted === 0 || w.mastery < masteryThreshold)
    .sort((a, b) => b.priority - a.priority);
}

export interface SessionScore {
  sessionId: string;
  completedAt: number;
  total: number;
  correct: number;
  accuracy: number;
  round: Round;
}

export function scoreSession(session: ExamSession): SessionScore {
  const total = session.attempts.length;
  const correct = session.attempts.filter((a) => a.correct).length;
  return {
    sessionId: session.id,
    completedAt: session.completedAt ?? session.startedAt,
    total,
    correct,
    accuracy: total ? correct / total : 0,
    round: session.round,
  };
}

/** Accuracy timeline across completed sessions (for the score chart). */
export function scoreTimeline(sessions: ExamSession[]): SessionScore[] {
  return sessions
    .filter((s) => s.completedAt && s.attempts.length > 0)
    .map(scoreSession)
    .sort((a, b) => a.completedAt - b.completedAt);
}

export interface Readiness {
  /** 0–100 overall readiness toward the 複賽 front-runner benchmark */
  score: number;
  level: 'beginner' | 'developing' | 'competitive' | 'frontrunner';
  /** number of domains at/above the competitive bar */
  domainsReady: number;
  totalDomains: number;
}

/**
 * Composite readiness. Targets the "複賽前段" goal: every domain should be
 * solidly mastered and weighted by its exam importance. The benchmark for a
 * 複賽 front-runner is ~85% weighted mastery.
 */
export function computeReadiness(attempts: AttemptRecord[]): Readiness {
  const stats = computeDomainStats(attempts);
  const totalWeight = DOMAINS.reduce((s, d) => s + d.weight, 0);
  const weightMap = Object.fromEntries(DOMAINS.map((d) => [d.id, d.weight])) as Record<
    DomainId,
    number
  >;

  const weighted = stats.reduce((s, st) => s + st.mastery * weightMap[st.domain], 0) / totalWeight;
  const score = Math.round(weighted);
  const domainsReady = stats.filter((s) => s.mastery >= 70).length;

  let level: Readiness['level'] = 'beginner';
  if (score >= 85) level = 'frontrunner';
  else if (score >= 65) level = 'competitive';
  else if (score >= 40) level = 'developing';

  return { score, level, domainsReady, totalDomains: DOMAINS.length };
}
