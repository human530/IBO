import { useEffect, useState } from 'react';
import { timeUntil } from '../lib/countdown';

interface Props {
  title: string;
  emoji?: string;
  targetIso: string;
}

function Unit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 font-display text-xl font-bold tabular-nums text-brand-600 md:h-14 md:w-14 md:text-2xl">
        {String(value).padStart(2, '0')}
      </span>
      <span className="mt-1 text-[10px] text-ink-soft">{label}</span>
    </div>
  );
}

export default function CountdownCard({ title, emoji = '⏳', targetIso }: Props) {
  const [cd, setCd] = useState(() => timeUntil(targetIso));

  useEffect(() => {
    setCd(timeUntil(targetIso));
    const t = setInterval(() => setCd(timeUntil(targetIso)), 1000);
    return () => clearInterval(t);
  }, [targetIso]);

  const dateStr = new Date(targetIso).toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-display font-bold text-ink">
          <span>{emoji}</span>
          {title}
        </h3>
        <span className="text-xs text-ink-soft">{dateStr}</span>
      </div>
      {cd.past ? (
        <p className="mt-3 text-sm text-brand-500">已過考試日期，請至設定更新日期 🗓️</p>
      ) : (
        <div className="mt-4 flex items-center justify-between gap-1">
          <Unit value={cd.days} label="天" />
          <span className="text-brand-200">:</span>
          <Unit value={cd.hours} label="時" />
          <span className="text-brand-200">:</span>
          <Unit value={cd.minutes} label="分" />
          <span className="text-brand-200">:</span>
          <Unit value={cd.seconds} label="秒" />
        </div>
      )}
    </div>
  );
}
