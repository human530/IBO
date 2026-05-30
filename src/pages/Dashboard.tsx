import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { QUESTIONS } from '../data/questions';
import { computeReadiness, detectWeaknesses } from '../lib/scoring';
import { daysUntil } from '../lib/countdown';
import { DOMAIN_MAP } from '../data/domains';
import CountdownCard from '../components/CountdownCard';

const LEVEL_LABEL: Record<string, { text: string; color: string; emoji: string }> = {
  beginner: { text: '入門', color: '#fb9a3c', emoji: '🌱' },
  developing: { text: '發展中', color: '#f4509b', emoji: '🌸' },
  competitive: { text: '具競爭力', color: '#38bdf8', emoji: '⭐' },
  frontrunner: { text: '複賽前段', color: '#22c55e', emoji: '🏆' },
};

export default function Dashboard() {
  const sessions = useStore((s) => s.sessions);
  const settings = useStore((s) => s.settings);
  const attempts = sessions.flatMap((s) => s.attempts);

  const readiness = computeReadiness(attempts);
  const weaknesses = detectWeaknesses(attempts, settings.masteryThreshold).slice(0, 3);
  const level = LEVEL_LABEL[readiness.level];
  const dDays = daysUntil(settings.preliminaryDate);

  return (
    <div className="flex flex-col gap-6">
      <div className="card bg-gradient-to-br from-brand-50 to-white">
        <h1 className="font-display text-2xl font-bold text-ink">準備儀表板 🧫</h1>
        <p className="mt-1 text-sm text-ink-soft">
          目標：穩定達到 <span className="font-bold text-brand-500">複賽前段</span>、一步步邁向國手 ✨
          {dDays > 0 && (
            <>
              {' '}距離初賽還有 <span className="font-bold text-brand-500">{dDays}</span> 天。
            </>
          )}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <CountdownCard title="初賽倒數" emoji="①" targetIso={settings.preliminaryDate} />
        <CountdownCard title="複賽倒數" emoji="②" targetIso={settings.semifinalDate} />
      </div>

      {/* Readiness */}
      <div className="card">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-bold text-ink">綜合準備度</h3>
          <span
            className="pill gap-1"
            style={{ backgroundColor: `${level.color}22`, color: level.color }}
          >
            {level.emoji} {level.text}
          </span>
        </div>
        <div className="mt-4 flex items-end gap-4">
          <div className="font-display text-5xl font-bold tabular-nums" style={{ color: level.color }}>
            {readiness.score}
          </div>
          <div className="pb-1 text-sm text-ink-soft">
            / 100
            <div>
              已掌握領域 {readiness.domainsReady} / {readiness.totalDomains}
            </div>
          </div>
        </div>
        <div className="relative mt-3 h-3.5 w-full overflow-hidden rounded-full bg-brand-50">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${readiness.score}%`, background: level.color }}
          />
          <div
            className="absolute -top-0.5 h-4 w-0.5 bg-ink/40"
            style={{ left: '85%' }}
            title="複賽前段標準 85"
          />
        </div>
        <p className="mt-2 text-xs text-ink-faint">虛線標示複賽前段門檻 (85)。</p>
      </div>

      {/* Weakness highlights */}
      <div className="card">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-bold text-ink">弱點警示 🔍</h3>
          <Link to="/performance" className="text-xs font-semibold text-brand-500 hover:underline">
            完整分析 →
          </Link>
        </div>
        {attempts.length === 0 ? (
          <p className="mt-3 text-sm text-ink-soft">
            尚無作答紀錄。先完成一次模擬測驗，系統就會分析你的弱點領域 💪
          </p>
        ) : weaknesses.length === 0 ? (
          <p className="mt-3 text-sm font-semibold text-emerald-500">表現優異，目前各領域皆達標！🎉</p>
        ) : (
          <div className="mt-3 flex flex-col gap-2">
            {weaknesses.map((w) => {
              const meta = DOMAIN_MAP[w.domain];
              return (
                <div key={w.domain} className="flex items-center gap-3">
                  <span className="flex w-28 items-center gap-1 text-sm" style={{ color: meta.color }}>
                    <span>{meta.emoji}</span>
                    {meta.name}
                  </span>
                  <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-brand-50">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${w.mastery}%`, background: meta.color }}
                    />
                  </div>
                  <span className="w-20 text-right text-xs text-ink-soft">
                    {w.attempted === 0 ? '未練習' : `掌握 ${w.mastery}`}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="grid gap-3 sm:grid-cols-3">
        <Link to="/exam" className="btn-primary">
          📝 開始模擬測驗
        </Link>
        <Link to="/exam?mode=adaptive" className="btn-ghost">
          🎯 弱點強化練習
        </Link>
        <Link to="/resources" className="btn-ghost">
          🔗 官方資源
        </Link>
      </div>

      <p className="text-center text-xs text-ink-faint">
        題庫共 {QUESTIONS.length} 題 · 涵蓋 7 大 IBO 領域 · 資料儲存於本機（離線可用）
      </p>
    </div>
  );
}
