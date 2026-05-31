import { useState } from 'react';
import { useStore } from '../store/useStore';

function toLocalInput(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours(),
  )}:${pad(d.getMinutes())}`;
}

export default function Settings() {
  const settings = useStore((s) => s.settings);
  const updateSettings = useStore((s) => s.updateSettings);
  const resetAll = useStore((s) => s.resetAll);
  const sessions = useStore((s) => s.sessions);
  const [confirmReset, setConfirmReset] = useState(false);

  const attempts = sessions.flatMap((s) => s.attempts).length;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-2xl font-bold text-ink">設定 ⚙️</h1>

      <div className="card flex flex-col gap-4">
        <h3 className="font-display font-bold text-ink">考試日期（倒數計時）🗓️</h3>
        <label className="text-sm">
          <span className="mb-1 block text-ink-soft">初賽日期</span>
          <input
            type="datetime-local"
            value={toLocalInput(settings.preliminaryDate)}
            onChange={(e) =>
              updateSettings({ preliminaryDate: new Date(e.target.value).toISOString() })
            }
            className="field"
          />
        </label>
        <label className="text-sm">
          <span className="mb-1 block text-ink-soft">複賽日期</span>
          <input
            type="datetime-local"
            value={toLocalInput(settings.semifinalDate)}
            onChange={(e) =>
              updateSettings({ semifinalDate: new Date(e.target.value).toISOString() })
            }
            className="field"
          />
        </label>
      </div>

      <div className="card flex flex-col gap-3">
        <h3 className="font-display font-bold text-ink">
          掌握度達標門檻：<span className="text-brand-500">{settings.masteryThreshold}</span>
        </h3>
        <p className="text-xs text-ink-soft">
          低於此門檻的領域會被列為弱點。複賽前段建議設定 70–85。
        </p>
        <input
          type="range"
          min={50}
          max={90}
          value={settings.masteryThreshold}
          onChange={(e) => updateSettings({ masteryThreshold: Number(e.target.value) })}
          className="w-full accent-brand-500"
        />
      </div>

      <div className="card flex flex-col gap-3">
        <h3 className="font-display font-bold text-ink">資料管理</h3>
        <p className="text-sm text-ink-soft">
          目前已累積 {sessions.length} 次測驗、{attempts} 筆作答紀錄，全部儲存於本機瀏覽器。
        </p>
        {!confirmReset ? (
          <button className="btn-ghost text-rose-500" onClick={() => setConfirmReset(true)}>
            清除所有資料
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              className="btn flex-1 bg-rose-500 text-white hover:bg-rose-400"
              onClick={() => {
                resetAll();
                setConfirmReset(false);
              }}
            >
              確定清除
            </button>
            <button className="btn-ghost flex-1" onClick={() => setConfirmReset(false)}>
              取消
            </button>
          </div>
        )}
      </div>

      <p className="text-center text-xs text-ink-faint">
        闖進IBO大作戰 · PWA 離線可用 · 資料不上傳雲端 🩷
      </p>
    </div>
  );
}
