export interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
  past: boolean;
}

/** Time remaining until `targetIso`, measured from `now` (ms epoch). */
export function timeUntil(targetIso: string, now: number = Date.now()): Countdown {
  const target = new Date(targetIso).getTime();
  let diff = target - now;
  const past = diff < 0;
  diff = Math.abs(diff);
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  const seconds = Math.floor((diff % 60_000) / 1000);
  return { days, hours, minutes, seconds, totalMs: target - now, past };
}

/** Whole days until target (negative if past). */
export function daysUntil(targetIso: string, now: number = Date.now()): number {
  return Math.ceil((new Date(targetIso).getTime() - now) / 86_400_000);
}
