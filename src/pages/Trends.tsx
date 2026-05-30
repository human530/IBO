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
import {
  domainFrequency,
  domainTrendByYear,
  predictHotTopics,
} from '../lib/analytics';

export default function Trends() {
  const trend = domainTrendByYear(QUESTIONS);
  const freq = domainFrequency(QUESTIONS);
  const hot = predictHotTopics(QUESTIONS, 10);

  const stackedData = trend.map((t) => ({
    year: String(t.year),
    ...t.counts,
  }));

  const freqData = freq.map((f) => ({
    name: DOMAINS.find((d) => d.id === f.domain)!.name,
    出題比例: Math.round(f.share * 100),
    官方權重: Math.round(f.officialWeight * 100),
    color: DOMAINS.find((d) => d.id === f.domain)!.color,
  }));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">考題趨勢分析</h1>
        <p className="text-sm text-slate-400">
          依歷屆題目統計各領域出題分布、與官方權重比較，並預測高頻考點。
        </p>
      </div>

      {/* Domain distribution by year */}
      <div className="card">
        <h3 className="mb-4 font-semibold">各年度領域出題分布</h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stackedData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="year" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  background: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: 12,
                }}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              {DOMAINS.map((d) => (
                <Bar key={d.id} dataKey={d.id} stackId="a" fill={d.color} name={d.name} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Frequency vs official weight */}
      <div className="card">
        <h3 className="mb-1 font-semibold">出題比例 vs 官方權重 (%)</h3>
        <p className="mb-4 text-xs text-slate-400">
          比例明顯低於官方權重的領域，代表題庫覆蓋不足，也常是命題未來補強方向。
        </p>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={freqData} layout="vertical" margin={{ left: 24 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis type="number" stroke="#94a3b8" fontSize={12} />
              <YAxis type="category" dataKey="name" stroke="#94a3b8" fontSize={11} width={90} />
              <Tooltip
                contentStyle={{
                  background: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: 12,
                }}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="出題比例" fill="#10b981">
                {freqData.map((e, i) => (
                  <Cell key={i} fill={e.color} />
                ))}
              </Bar>
              <Bar dataKey="官方權重" fill="#475569" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Hot topics */}
      <div className="card">
        <h3 className="mb-1 font-semibold">高頻考點預測 🔥</h3>
        <p className="mb-4 text-xs text-slate-400">
          綜合「出現次數 × 近年熱度」計算熱度分數，分數越高越值得優先複習。
        </p>
        <div className="flex flex-col gap-2">
          {hot.map((h, i) => (
            <div key={h.concept} className="flex items-center gap-3">
              <span className="w-6 text-center text-sm font-bold text-slate-500">{i + 1}</span>
              <span className="flex-1 text-sm">#{h.concept}</span>
              <span className="text-xs text-slate-400">最近 {h.latestYear}</span>
              <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-700">
                <div
                  className="h-full rounded-full bg-amber-400"
                  style={{ width: `${Math.min(100, (h.heat / hot[0].heat) * 100)}%` }}
                />
              </div>
              <span className="w-10 text-right text-xs tabular-nums text-amber-400">
                {h.heat}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
