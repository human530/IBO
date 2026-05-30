import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { DOMAINS, DOMAIN_MAP } from '../data/domains';
import { QUESTIONS } from '../data/questions';
import {
  domainProjections,
  historicalShareByYear,
  predictHotTopics,
  totalByYear,
} from '../lib/analytics';
import { CHART } from '../lib/chartTheme';

const ARROW = { up: '📈', down: '📉', flat: '➖' } as const;
const DIR_WORD = { up: '越來越常考', down: '越來越少考', flat: '大致持平' } as const;
const DIR_COLOR = { up: '#3d83bf', down: '#c98a86', flat: '#7f8aa0' } as const;

export default function Trends() {
  const shareData = historicalShareByYear();
  const projections = [...domainProjections()].sort((a, b) => b.nextYearShare - a.nextYearShare);
  const totals = totalByYear();
  const hot = predictHotTopics(QUESTIONS, 8);
  const span = `${shareData[0].year}–${shareData[shareData.length - 1].year}`;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">考題趨勢分析 📈</h1>
        <p className="text-sm text-ink-soft">
          用近 20 年（{span}）的歷屆資料畫成折線，看出每個主題「越來越常考還是越來越少考」，並預估明年。
        </p>
      </div>

      {/* 20-year multi-line: domain share over time */}
      <div className="card">
        <h3 className="mb-1 font-display font-bold text-ink">近 20 年各領域出題比例趨勢（%）</h3>
        <p className="mb-3 text-xs text-ink-soft">
          每一條線 = 一個主題。線往上＝這個主題越考越多。
        </p>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={shareData}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} />
              <XAxis dataKey="year" stroke={CHART.axis} fontSize={10} interval={2} />
              <YAxis stroke={CHART.axis} fontSize={CHART.axisFont} unit="%" />
              <Tooltip contentStyle={CHART.tooltip} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              {DOMAINS.map((d) => (
                <Line
                  key={d.id}
                  type="monotone"
                  dataKey={d.id}
                  name={d.name}
                  stroke={d.color}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* total questions per year line */}
      <div className="card">
        <h3 className="mb-3 font-display font-bold text-ink">每年理論題數趨勢</h3>
        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={totals}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} />
              <XAxis dataKey="year" stroke={CHART.axis} fontSize={10} interval={2} />
              <YAxis stroke={CHART.axis} fontSize={CHART.axisFont} />
              <Tooltip contentStyle={CHART.tooltip} />
              <Line type="monotone" dataKey="total" name="題數" stroke="#3d83bf" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* evaluation + extrapolation */}
      <div className="card">
        <h3 className="mb-1 font-display font-bold text-ink">趨勢評估與明年預估 🔮</h3>
        <p className="mb-3 text-xs text-ink-soft">
          根據 20 年的折線斜率，預測明年（{projections[0].nextYear}）每個主題大概佔多少比例。
        </p>
        <div className="flex flex-col gap-2">
          {projections.map((p) => {
            const meta = DOMAIN_MAP[p.domain];
            return (
              <div key={p.domain} className="flex items-center gap-3 text-sm">
                <span className="flex w-32 items-center gap-1" style={{ color: meta.color }}>
                  <span>{meta.emoji}</span>
                  {meta.name}
                </span>
                <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-brand-50">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${Math.min(100, p.nextYearShare * 3)}%`, background: meta.color }}
                  />
                </div>
                <span className="w-12 text-right font-semibold tabular-nums text-ink">
                  {p.nextYearShare}%
                </span>
                <span
                  className="w-24 text-right text-xs font-medium"
                  style={{ color: DIR_COLOR[p.direction] }}
                >
                  {ARROW[p.direction]} {DIR_WORD[p.direction]}
                </span>
              </div>
            );
          })}
        </div>
        <p className="mt-3 rounded-2xl bg-brand-50/60 p-3 text-xs text-ink-soft">
          🧒 白話：箭頭往上的主題（例如{' '}
          <span className="font-semibold text-ink">
            {projections.find((p) => p.direction === 'up')?.domain
              ? DOMAIN_MAP[projections.find((p) => p.direction === 'up')!.domain].name
              : '—'}
          </span>
          ）這幾年越考越多，要多花時間；箭頭往下的可以先抓重點就好。
        </p>
      </div>

      {/* hot concepts */}
      <div className="card">
        <h3 className="mb-1 font-display font-bold text-ink">高頻考點 🔥</h3>
        <p className="mb-3 text-xs text-ink-soft">出現越多次、越近期的考點，越值得先讀。</p>
        <div className="flex flex-col gap-2">
          {hot.map((h, i) => (
            <div key={h.concept} className="flex items-center gap-3">
              <span className="w-6 text-center font-display text-sm font-bold text-brand-300">
                {i + 1}
              </span>
              <span className="flex-1 text-sm text-ink">#{h.concept}</span>
              <span className="text-xs text-ink-faint">最近 {h.latestYear}</span>
              <div className="h-2.5 w-24 overflow-hidden rounded-full bg-brand-50">
                <div
                  className="h-full rounded-full bg-candy-peach"
                  style={{ width: `${Math.min(100, (h.heat / hot[0].heat) * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
