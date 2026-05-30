import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { DOMAINS } from '../data/domains';
import { QUESTIONS } from '../data/questions';
import { domainFrequency, domainTrendByYear, predictHotTopics } from '../lib/analytics';
import { CHART } from '../lib/chartTheme';

export default function Trends() {
  const trend = domainTrendByYear(QUESTIONS);
  const freq = domainFrequency(QUESTIONS);
  const hot = predictHotTopics(QUESTIONS, 10);

  const stackedData = trend.map((t) => ({ year: String(t.year), ...t.counts }));

  const freqData = freq.map((f) => ({
    name: DOMAINS.find((d) => d.id === f.domain)!.name,
    出題比例: Math.round(f.share * 100),
    官方權重: Math.round(f.officialWeight * 100),
    color: DOMAINS.find((d) => d.id === f.domain)!.color,
  }));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">考題趨勢分析 📈</h1>
        <p className="text-sm text-ink-soft">
          依歷屆題目統計各領域出題分布、與官方權重比較，並預測高頻考點。
        </p>
      </div>

      <div className="card">
        <h3 className="mb-4 font-display font-bold text-ink">各年度領域出題分布</h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stackedData}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} />
              <XAxis dataKey="year" stroke={CHART.axis} fontSize={CHART.axisFont} />
              <YAxis stroke={CHART.axis} fontSize={CHART.axisFont} allowDecimals={false} />
              <Tooltip contentStyle={CHART.tooltip} cursor={{ fill: '#fff1f7' }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              {DOMAINS.map((d) => (
                <Bar key={d.id} dataKey={d.id} stackId="a" fill={d.color} name={d.name} radius={[3, 3, 0, 0]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <h3 className="mb-1 font-display font-bold text-ink">出題比例 vs 官方權重 (%)</h3>
        <p className="mb-4 text-xs text-ink-soft">
          比例明顯低於官方權重的領域，代表覆蓋不足，也常是未來補強方向。
        </p>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={freqData} layout="vertical" margin={{ left: 24 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} />
              <XAxis type="number" stroke={CHART.axis} fontSize={CHART.axisFont} />
              <YAxis type="category" dataKey="name" stroke={CHART.axis} fontSize={CHART.axisFont} width={90} />
              <Tooltip contentStyle={CHART.tooltip} cursor={{ fill: '#fff1f7' }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="出題比例" radius={[0, 6, 6, 0]}>
                {freqData.map((e, i) => (
                  <Cell key={i} fill={e.color} />
                ))}
              </Bar>
              <Bar dataKey="官方權重" fill="#e7d6e3" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <h3 className="mb-1 font-display font-bold text-ink">高頻考點預測 🔥</h3>
        <p className="mb-4 text-xs text-ink-soft">
          綜合「出現次數 × 近年熱度」計算熱度分數，分數越高越值得優先複習。
        </p>
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
              <span className="w-10 text-right text-xs font-bold tabular-nums text-brand-500">
                {h.heat}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
