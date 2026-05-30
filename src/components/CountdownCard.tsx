import { useEffect, useState } from 'react';
import { timeUntil } from '../lib/countdown';

interface Props {
  title: string;
  targetIso: string;
}

function Unit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="tabular-nums text-2xl md:text-3xl font-bold text-white">
        {String(value).padStart(2, '0')}
      </span>
      <span className="text-[10px] text-slate-400">{label}</span>
    </div>
  );
}

export default function CountdownCard({ title, targetIso }: Props) {
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
        <h3 className="font-semibold">{title}</h3>
        <span className="text-xs text-slate-400">{dateStr}</span>
      </div>
      {cd.past ? (
        <p className="mt-3 text-sm text-amber-400">已過考試日期，請至設定更新日期。</p>
      ) : (
        <div className="mt-4 flex items-center justify-between gap-2">
          <Unit value={cd.days} label="天" />
          <span className="text-slate-600">:</span>
          <Unit value={cd.hours} label="時" />
          <span className="text-slate-600">:</span>
          <Unit value={cd.minutes} label="分" />
          <span className="text-slate-600">:</span>
          <Unit value={cd.seconds} label="秒" />
        </div>
      )}
    </div>
  );
}
