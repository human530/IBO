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
import { CHART } from '../lib/chartTheme';

export default function Performance() {
  const sessions = useStore((s) => s.sessions);
  const settings = useStore((s) => s.settings);
  const attempts = sessions.flatMap((s) => s.attempts);

  if (attempts.length === 0) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="font-display text-2xl font-bold text-ink">成績分析 🎯</h1>
        <div className="card text-center text-ink-soft">
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
        <h1 className="font-display text-2xl font-bold text-ink">成績動態分析 🎯</h1>
        <p className="text-sm text-ink-soft">
          綜合準備度 <span className="font-bold text-brand-500">{readiness.score}</span> / 100，
          已作答 {attempts.length} 題。
        </p>
      </div>

      <div className="card">
        <h3 className="mb-4 font-display font-bold text-ink">成績趨勢</h3>
        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timeline}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} />
              <XAxis dataKey="name" stroke={CHART.axis} fontSize={CHART.axisFont} />
              <YAxis domain={[0, 100]} stroke={CHART.axis} fontSize={CHART.axisFont} />
              <Tooltip contentStyle={CHART.tooltip} />
              <Line
                type="monotone"
                dataKey="正確率"
                stroke="#f4509b"
                strokeWidth={3}
                dot={{ r: 4, fill: '#f4509b' }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <h3 className="mb-4 font-display font-bold text-ink">領域掌握度雷達圖</h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid stroke={CHART.grid} />
              <PolarAngleAxis dataKey="domain" tick={{ fill: '#8a7593', fontSize: 10 }} />
              <PolarRadiusAxis domain={[0, 100]} tick={{ fill: '#b8a9bf', fontSize: 9 }} />
              <Radar dataKey="掌握度" stroke="#f4509b" fill="#5ca5b5" fillOpacity={0.4} />
              <Tooltip contentStyle={CHART.tooltip} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <h3 className="mb-3 font-display font-bold text-ink">各領域詳細數據</h3>
        <div className="flex flex-col gap-1.5 text-sm">
          {stats.map((s) => {
            const meta = DOMAIN_MAP[s.domain];
            return (
              <div key={s.domain} className="flex items-center gap-3">
                <span className="flex w-28 items-center gap-1 truncate" style={{ color: meta.color }}>
                  <span>{meta.emoji}</span>
                  {meta.name}
                </span>
                <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-brand-50">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${s.mastery}%`, background: meta.color }}
                  />
                </div>
                <span className="w-10 text-right font-semibold tabular-nums text-ink">{s.mastery}</span>
                <span className="w-16 text-right text-xs text-ink-faint">
                  {s.attempted ? `${s.correct}/${s.attempted}` : '—'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="card">
        <h3 className="mb-3 font-display font-bold text-ink">複習建議 ✨</h3>
        {weaknesses.length === 0 ? (
          <p className="text-sm font-semibold text-emerald-500">
            各領域皆達標，維持手感並挑戰更高難度題目！
          </p>
        ) : (
          <ol className="flex flex-col gap-2 text-sm">
            {weaknesses.slice(0, 5).map((w, i) => {
              const meta = DOMAIN_MAP[w.domain];
              return (
                <li key={w.domain} className="flex items-start gap-2">
                  <span className="font-display font-bold text-brand-400">{i + 1}.</span>
                  <span className="text-ink">
                    優先加強 <span style={{ color: meta.color }}>{meta.emoji}{meta.name}</span>
                    {w.attempted === 0 ? (
                      <span className="text-ink-soft">（尚未練習，建議立即測驗）</span>
                    ) : (
                      <span className="text-ink-soft">
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

      <p className="text-center text-xs text-ink-faint">
        掌握度採近因加權與樣本信賴校正；達 85 視為複賽前段水準。共 {DOMAINS.length} 領域。
      </p>
    </div>
  );
}
