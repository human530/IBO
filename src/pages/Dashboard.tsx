import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { QUESTIONS } from '../data/questions';
import { computeReadiness, detectWeaknesses } from '../lib/scoring';
import { daysUntil } from '../lib/countdown';
import { DOMAIN_MAP } from '../data/domains';
import CountdownCard from '../components/CountdownCard';

const LEVEL_LABEL: Record<string, { text: string; color: string }> = {
  beginner: { text: '入門', color: '#94a3b8' },
  developing: { text: '發展中', color: '#f59e0b' },
  competitive: { text: '具競爭力', color: '#0ea5e9' },
  frontrunner: { text: '複賽前段', color: '#10b981' },
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
      <div>
        <h1 className="text-2xl font-bold">準備儀表板</h1>
        <p className="text-sm text-slate-400">
          目標：穩定達到 <span className="text-brand-400 font-medium">複賽前段</span>。距離初賽還有{' '}
          {dDays > 0 ? `${dDays} 天` : '— '}。
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <CountdownCard title="初賽倒數" targetIso={settings.preliminaryDate} />
        <CountdownCard title="複賽倒數" targetIso={settings.semifinalDate} />
      </div>

      {/* Readiness */}
      <div className="card">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">綜合準備度</h3>
          <span
            className="pill"
            style={{ backgroundColor: `${level.color}22`, color: level.color }}
          >
            {level.text}
          </span>
        </div>
        <div className="mt-4 flex items-end gap-4">
          <div className="text-5xl font-bold tabular-nums" style={{ color: level.color }}>
            {readiness.score}
          </div>
          <div className="pb-1 text-sm text-slate-400">
            / 100
            <div>
              已掌握領域 {readiness.domainsReady} / {readiness.totalDomains}
            </div>
          </div>
        </div>
        <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-slate-700">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${readiness.score}%`, background: level.color }}
          />
          <div className="relative">
            <div
              className="absolute -top-3 h-3 w-0.5 bg-white/70"
              style={{ left: '85%' }}
              title="複賽前段標準 85"
            />
          </div>
        </div>
        <p className="mt-2 text-xs text-slate-500">白線標示複賽前段門檻 (85)。</p>
      </div>

      {/* Weakness highlights */}
      <div className="card">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">弱點警示</h3>
          <Link to="/performance" className="text-xs text-brand-400 hover:underline">
            完整分析 →
          </Link>
        </div>
        {attempts.length === 0 ? (
          <p className="mt-3 text-sm text-slate-400">
            尚無作答紀錄。先完成一次模擬測驗，系統就會分析你的弱點領域。
          </p>
        ) : weaknesses.length === 0 ? (
          <p className="mt-3 text-sm text-brand-400">表現優異，目前各領域皆達標！</p>
        ) : (
          <div className="mt-3 flex flex-col gap-2">
            {weaknesses.map((w) => {
              const meta = DOMAIN_MAP[w.domain];
              return (
                <div key={w.domain} className="flex items-center gap-3">
                  <span className="w-28 text-sm" style={{ color: meta.color }}>
                    {meta.name}
                  </span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-700">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${w.mastery}%`, background: meta.color }}
                    />
                  </div>
                  <span className="w-20 text-right text-xs text-slate-400">
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
        <Link to="/trends" className="btn-ghost">
          📈 查看考題趨勢
        </Link>
      </div>

      <p className="text-center text-xs text-slate-600">
        題庫共 {QUESTIONS.length} 題 · 涵蓋 7 大 IBO 領域 · 資料儲存於本機 (離線可用)
      </p>
    </div>
  );
}
