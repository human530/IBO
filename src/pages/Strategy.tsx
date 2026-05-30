import { READING_LIST, SUCCESS_FACTORS, DOMAIN_BOOKS } from '../data/strategy';
import { DOMAINS } from '../data/domains';

const LEVEL_COLOR: Record<string, string> = {
  入門: '#86efac',
  核心: '#fda4cf',
  進階: '#c4b5fd',
  實作: '#fdba9b',
};

export default function Strategy() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">邁向國手・成功心法 🏅</h1>
        <p className="text-sm text-ink-soft">
          整理國際生物奧林匹亞獎牌得主的備考方式與學習科學研究，轉成你能照做的策略。
        </p>
      </div>

      {/* success factors */}
      <div className="grid gap-3 sm:grid-cols-2">
        {SUCCESS_FACTORS.map((f) => (
          <div key={f.title} className="card">
            <h3 className="flex items-center gap-2 font-display font-bold text-ink">
              <span className="icon-chip bg-brand-100">{f.emoji}</span>
              {f.title}
            </h3>
            <div className="mt-2 rounded-2xl border-2 border-dashed border-brand-300 bg-brand-50/50 p-3">
              <span className="text-xs font-bold text-brand-600">🧒 秒懂</span>
              <p className="mt-0.5 text-[15px] font-medium leading-relaxed text-ink">{f.simple}</p>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{f.detail}</p>
          </div>
        ))}
      </div>

      {/* reading list */}
      <div className="card">
        <h3 className="mb-1 font-display font-bold text-ink">生奧書單 📚</h3>
        <p className="mb-3 text-xs text-ink-soft">
          先用核心書打地基，再用進階書補深度，並反覆練歷屆題。
        </p>
        <div className="flex flex-col gap-2">
          {READING_LIST.map((b) => (
            <div key={b.title} className="flex items-start gap-3 rounded-2xl border border-brand-100 bg-white/70 p-3">
              <span
                className="pill shrink-0"
                style={{ backgroundColor: `${LEVEL_COLOR[b.level]}33`, color: '#6b5060' }}
              >
                {b.level}
              </span>
              <div className="flex-1">
                <div className="text-sm font-semibold text-ink">
                  {b.title} <span className="text-ink-soft">· {b.zh}</span>
                </div>
                <div className="text-xs text-ink-soft">{b.use}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* per-domain chapters */}
      <div className="card">
        <h3 className="mb-1 font-display font-bold text-ink">各領域對應課本章節 🔖</h3>
        <p className="mb-3 text-xs text-ink-soft">配合「複習筆記」一起讀，效果加倍。</p>
        <div className="flex flex-col gap-2">
          {DOMAINS.map((d) => {
            const ref = DOMAIN_BOOKS[d.id];
            return (
              <div key={d.id} className="flex items-start gap-2 text-sm">
                <span className="shrink-0" style={{ color: d.color }}>
                  {d.emoji} {d.name}
                </span>
                <span className="text-ink-soft">
                  ｜{ref.campbell} <span className="text-ink-faint">· 延伸：{ref.also}</span>
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <p className="text-center text-xs text-ink-faint">
        心法整理自 IBO/USABO 獎牌得主分享與學習科學（刻意練習、間隔重複、成長型思維）研究。
      </p>
    </div>
  );
}
