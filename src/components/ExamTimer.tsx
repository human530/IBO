import { useEffect, useState } from 'react';
import { formatDuration } from '../lib/scoring';

interface Props {
  startedAt: number;
  /** Total allowed seconds; 0 = untimed (count up). */
  durationSec: number;
  /** Fired once when a timed exam reaches zero. */
  onExpire?: () => void;
}

/** Elapsed/remaining clock shown during an exam. */
export default function ExamTimer({ startedAt, durationSec, onExpire }: Props) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const elapsed = Math.floor((now - startedAt) / 1000);

  useEffect(() => {
    if (durationSec > 0 && elapsed >= durationSec) onExpire?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elapsed, durationSec]);

  if (durationSec > 0) {
    const remaining = Math.max(0, durationSec - elapsed);
    const danger = remaining <= 30;
    return (
      <span
        className={`tabular-nums rounded-full px-3 py-1 text-sm font-bold ${
          danger ? 'bg-rose-100 text-rose-500' : 'bg-brand-50 text-brand-600'
        }`}
        title="剩餘作答時間"
      >
        ⏱ {formatDuration(remaining)}
      </span>
    );
  }

  return (
    <span
      className="tabular-nums rounded-full bg-brand-50 px-3 py-1 text-sm font-bold text-brand-600"
      title="已用時間"
    >
      ⏱ {formatDuration(elapsed)}
    </span>
  );
}
