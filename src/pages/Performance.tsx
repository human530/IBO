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
import { DOMAIN_MAP } from '../data/domains';
import { DomainIcon } from '../components/DomainBadge';
import {
  computeDomainStats,
  computeReadiness,
  detectWeaknesses,
  scoreTimeline,
} from '../lib/scoring';
import { attemptScore } from '../lib/scoring';
import { detailedAnalysis } from '../lib/analysis';
import { STAGES, stageOutcome, nationalTeamSustainPct } from '../data/cutoffs';
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

  const analysis = detailedAnalysis(attempts);
  const overallPct = Math.round(
    (attempts.reduce((s, a) => s + attemptScore(a), 0) / attempts.length) * 100,
  );
  const sustain = nationalTeamSustainPct();

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
                stroke="#6e8a4a"
                strokeWidth={3}
                dot={{ r: 4, fill: '#6e8a4a' }}
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
              <Radar dataKey="掌握度" stroke="#6e8a4a" fill="#5ca5b5" fillOpacity={0.4} />
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
                  <DomainIcon domain={s.domain} size={16} />
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
                    優先加強 <span className="inline-flex items-center gap-1" style={{ color: meta.color }}><DomainIcon domain={w.domain} size={14} />{meta.name}</span>
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

      {/* 嚴師全方位分析 */}
      <div className="card border-clay/60">
        <h3 className="mb-1 font-display font-bold text-ink">嚴師講評・全方位分析 🧑‍🏫</h3>
        <p className="mb-3 text-xs text-ink-soft">
          目標是國手，標準從嚴。以下是你的弱點細節與錯誤型態，務必逐項補強。
        </p>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border-2 border-line/40 bg-white/60 p-3">
            <div className="text-xs font-bold text-clay">最不擅長的細節</div>
            {analysis.weakestSubtopic ? (
              <p className="mt-1 text-sm text-ink">
                考點「<b>{analysis.weakestSubtopic.key}</b>」正確率僅{' '}
                {Math.round(analysis.weakestSubtopic.accuracy * 100)}%
                （{analysis.weakestSubtopic.correct}/{analysis.weakestSubtopic.total}）— 立刻回課本重讀。
              </p>
            ) : (
              <p className="mt-1 text-sm text-ink-soft">資料不足，多練幾題我才能抓出你的破綻。</p>
            )}
            {analysis.weakestConcept && (
              <p className="mt-2 text-sm text-ink">
                最弱概念：<b>#{analysis.weakestConcept.key}</b>（
                {Math.round(analysis.weakestConcept.accuracy * 100)}%）。
              </p>
            )}
          </div>

          <div className="rounded-2xl border-2 border-line/40 bg-white/60 p-3">
            <div className="text-xs font-bold text-clay">錯誤型態</div>
            <p className="mt-1 text-sm text-ink">
              粗心（看太快就錯）<b>{analysis.careless}</b> 題；
              觀念不足（想很久還錯）<b>{analysis.gap}</b> 題。
            </p>
            <p className="mt-1 text-xs text-ink-soft">
              {analysis.careless > analysis.gap
                ? '你的主要問題是「粗心」——放慢、看完每個敘述再作答。'
                : analysis.gap > 0
                  ? '你的主要問題是「觀念不足」——回課本把原理弄懂，別硬背。'
                  : '錯誤不多，保持手感、挑戰更難的題。'}
            </p>
          </div>
        </div>

        {analysis.topMissedConcepts.length > 0 && (
          <div className="mt-3">
            <div className="text-xs font-bold text-ink-soft">最常錯的概念（優先補）</div>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {analysis.topMissedConcepts.map((c) => (
                <span key={c.concept} className="pill bg-clay/15 text-ink">
                  #{c.concept} ×{c.misses}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 晉級門檻：分數線、贏過多少人、要保持第幾名 */}
      <div className="card">
        <h3 className="mb-1 font-display font-bold text-ink">晉級門檻與分數落點 🪜</h3>
        <p className="mb-3 text-xs text-ink-soft">
          以你目前的得分率 <b className="text-brand-600">{overallPct}%</b> 換算各關的分數、名次與晉級狀況
          （名額逐年微調，分數線可於設定調整）。要當國手，每一關都要穩定考到約{' '}
          <b className="text-clay">{sustain}%</b> 以上。
        </p>
        <div className="flex flex-col gap-2">
          {STAGES.map((st) => {
            const o = stageOutcome(overallPct, st);
            return (
              <div key={st.id} className="rounded-2xl border-2 border-line/40 bg-white/60 p-3">
                <div className="flex items-center justify-between">
                  <span className="font-display font-bold text-ink">
                    {st.emoji} {st.name}
                  </span>
                  <span
                    className="pill"
                    style={{
                      backgroundColor: o.advances ? '#8fd6a033' : '#b9573e22',
                      color: o.advances ? '#46582f' : '#b9573e',
                    }}
                  >
                    {o.advances ? '可晉級 ✓' : '未達標 ✗'}
                  </span>
                </div>
                <div className="mt-1 grid grid-cols-3 gap-2 text-center text-xs">
                  <div>
                    <div className="text-sm font-bold tabular-nums text-ink">
                      {o.rawScore}<span className="text-ink-faint">/{st.maxScore}</span>
                    </div>
                    <div className="text-ink-soft">你的分數｜線 {o.cutoffScore}</div>
                  </div>
                  <div>
                    <div className="text-sm font-bold tabular-nums text-ink">
                      第 {o.rank} 名
                    </div>
                    <div className="text-ink-soft">需 ≤ 第 {o.requiredRank} 名</div>
                  </div>
                  <div>
                    <div className="text-sm font-bold tabular-nums text-ink">
                      贏過 {o.beats.toLocaleString()} 人
                    </div>
                    <div className="text-ink-soft">約 {st.cohortSize.toLocaleString()} 人</div>
                  </div>
                </div>
                <div className="mt-1 text-[11px] text-ink-faint">{st.note}</div>
              </div>
            );
          })}
        </div>
      </div>

      <p className="text-center text-xs text-ink-faint">
        掌握度採近因加權與樣本信賴校正；分數線與名額為近年公開資料整理之估計，逐年不同。
      </p>
    </div>
  );
}
