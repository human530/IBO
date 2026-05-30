import { Link } from 'react-router-dom';
import { BOOK_COMPARE, CAMP_FOCUS, CAMP_INFO } from '../data/camp';

export default function Camp() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">選拔營特訓 🔥</h1>
        <p className="text-sm text-ink-soft">{CAMP_INFO.direction}</p>
      </div>

      {/* exam direction */}
      <div className="card">
        <h3 className="mb-2 font-display font-bold text-ink">考試方向</h3>
        <ul className="flex flex-col gap-1.5 text-sm text-ink">
          {CAMP_INFO.tips.map((t) => (
            <li key={t} className="flex gap-2">
              <span className="text-brand-500">▸</span>
              <span>{t}</span>
            </li>
          ))}
        </ul>
        <Link to="/exam?camp=1" className="btn-primary mt-4 w-full">
          🔥 開始選拔營高強度測驗（IBO 風格＋自動生成難題）
        </Link>
      </div>

      {/* high-intensity focus: 難題簡單化 + 必考 */}
      <div className="card">
        <h3 className="mb-1 font-display font-bold text-ink">高強度複習重點（難題簡單化）</h3>
        <p className="mb-3 text-xs text-ink-soft">
          每個難點先用一句白話講懂，再記必考核心與對應教材。
        </p>
        <div className="flex flex-col gap-3">
          {CAMP_FOCUS.map((f, i) => (
            <div key={f.area} className="rounded-2xl border-2 border-line/40 bg-white/60 p-4">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border-2 border-line/50 font-display text-sm font-bold text-ink">
                  {i + 1}
                </span>
                <h4 className="font-display font-bold text-ink">{f.area}</h4>
              </div>
              <p className="mt-2 text-xs text-ink-faint">常見難點：{f.hard}</p>
              <div className="mt-2 rounded-xl border-2 border-dashed border-brand-300 bg-brand-50/50 p-2.5">
                <span className="text-xs font-bold text-brand-600">🧒 難題秒懂</span>
                <p className="mt-0.5 text-[15px] font-medium leading-relaxed text-ink">{f.simple}</p>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                <span className="pill bg-brand-100 text-ink">必考：{f.must}</span>
                <span className="pill bg-candy-lemon/30 text-ink">📖 {f.book}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* textbook comparison / integration */}
      <div className="card">
        <h3 className="mb-1 font-display font-bold text-ink">教材對照整合 📚</h3>
        <p className="mb-3 text-xs text-ink-soft">不同主題用最對的書，效率最高。</p>
        <div className="flex flex-col gap-2">
          {BOOK_COMPARE.map((b) => (
            <div key={b.topic} className="flex items-start gap-3 rounded-2xl border-2 border-line/35 bg-white/60 p-3 text-sm">
              <span className="w-28 shrink-0 font-semibold text-brand-600">{b.topic}</span>
              <div className="flex-1">
                <div className="font-semibold text-ink">{b.best}</div>
                <div className="text-xs text-ink-soft">{b.note}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-center text-xs text-ink-faint">
        以「長考必考 + 難題簡單化」為核心；搭配複習筆記與 IBO 風格測驗一起練。
      </p>
    </div>
  );
}
