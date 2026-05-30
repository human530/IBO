import {
  CartesianGrid,
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useStore } from '../store/useStore';
import { DOMAIN_MAP, DOMAINS } from '../data/domains';
import {
  computeDomainStats,
  computeReadiness,
  detectWeaknesses,
  scoreTimeline,
} from '../lib/scoring';

export default function Performance() {
  const sessions = useStore((s) => s.sessions);
  const settings = useStore((s) => s.settings);
  const attempts = sessions.flatMap((s) => s.attempts);

  if (attempts.length === 0) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">成績分析</h1>
        <div className="card text-center text-slate-400">
          尚無作答紀錄。完成模擬測驗後，這裡會顯示：
          <ul className="mx-auto mt-3 max-w-xs list-disc text-left text-sm">
            <li>成績趨勢曲線</li>
            <li>各領域掌握度雷達圖</li>
            <li>弱點偵測與複習建議</li>
          </ul>
        </div>
      </div>
    );
  }

  const stats = computeDomainStats(attempts);
  const readiness = computeReadiness(attempts);
  const weaknesses = detectWeaknesses(attempts, settings.masteryThreshold);
  const timeline = scoreTimeline(sessions).map((s, i) => ({
    name: `#${i + 1}`,
    正確率: Math.round(s.accuracy * 100),
  }));

  const radarData = stats.map((s) => ({
    domain: DOMAIN_MAP[s.domain].name,
    掌握度: s.mastery,
  }));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">成績動態分析</h1>
        <p className="text-sm text-slate-400">
          綜合準備度 <span className="font-bold text-brand-400">{readiness.score}</span> / 100，
          已作答 {attempts.length} 題。
        </p>
      </div>

      {/* Score timeline */}
      <div className="card">
        <h3 className="mb-4 font-semibold">成績趨勢</h3>
        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timeline}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
              <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={12} />
              <Tooltip
                contentStyle={{
                  background: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: 12,
                }}
              />
              <Line
                type="monotone"
                dataKey="正確率"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Mastery radar */}
      <div className="card">
        <h3 className="mb-4 font-semibold">領域掌握度雷達圖</h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid stroke="#334155" />
              <PolarAngleAxis dataKey="domain" tick={{ fill: '#cbd5e1', fontSize: 10 }} />
              <PolarRadiusAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 9 }} />
              <Radar
                dataKey="掌握度"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.4}
              />
              <Tooltip
                contentStyle={{
                  background: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: 12,
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Per-domain table */}
      <div className="card">
        <h3 className="mb-3 font-semibold">各領域詳細數據</h3>
        <div className="flex flex-col gap-1.5 text-sm">
          {stats.map((s) => {
            const meta = DOMAIN_MAP[s.domain];
            return (
              <div key={s.domain} className="flex items-center gap-3">
                <span className="w-28 truncate" style={{ color: meta.color }}>
                  {meta.name}
                </span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-700">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${s.mastery}%`, background: meta.color }}
                  />
                </div>
                <span className="w-10 text-right tabular-nums">{s.mastery}</span>
                <span className="w-16 text-right text-xs text-slate-500">
                  {s.attempted ? `${s.correct}/${s.attempted}` : '—'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recommendations */}
      <div className="card">
        <h3 className="mb-3 font-semibold">複習建議</h3>
        {weaknesses.length === 0 ? (
          <p className="text-sm text-brand-400">各領域皆達標，維持手感並挑戰更高難度題目！</p>
        ) : (
          <ol className="flex flex-col gap-2 text-sm">
            {weaknesses.slice(0, 5).map((w, i) => {
              const meta = DOMAIN_MAP[w.domain];
              return (
                <li key={w.domain} className="flex items-start gap-2">
                  <span className="font-bold text-amber-400">{i + 1}.</span>
                  <span>
                    優先加強 <span style={{ color: meta.color }}>{meta.name}</span>
                    {w.attempted === 0 ? (
                      <span className="text-slate-400">（尚未練習，建議立即測驗）</span>
                    ) : (
                      <span className="text-slate-400">
                        （掌握度 {w.mastery}，正確率 {Math.round(w.accuracy * 100)}%）
                      </span>
                    )}
                    ：{meta.description}
                  </span>
                </li>
              );
            })}
          </ol>
        )}
        <a href="#/exam?mode=adaptive" className="btn-primary mt-4 w-full">
          🎯 針對弱點開始強化練習
        </a>
      </div>

      <p className="text-center text-xs text-slate-600">
        掌握度採近因加權與樣本信賴校正；達 85 視為複賽前段水準。
        共 {DOMAINS.length} 領域。
      </p>
    </div>
  );
}
