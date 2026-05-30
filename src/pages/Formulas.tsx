import { useMemo, useState } from 'react';
import { TEXTBOOKS, allFormulas } from '../data/textbooks';

export default function Formulas() {
  const all = useMemo(() => allFormulas(), []);
  const [book, setBook] = useState<string>('all');
  const [query, setQuery] = useState('');

  const filtered = all.filter((f) => {
    if (book !== 'all' && f.book !== book) return false;
    if (query) {
      const hay = (f.formula.name + f.formula.expr + (f.formula.note ?? '') + f.chapter).toLowerCase();
      if (!hay.includes(query.toLowerCase())) return false;
    }
    return true;
  });

  const booksWithFormulas = TEXTBOOKS.filter((b) => all.some((f) => f.book === b.title));

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">公式速查 🧮</h1>
        <p className="text-sm text-ink-soft">各教材必考公式一次看，考前快速翻。</p>
      </div>

      <div className="card flex flex-col gap-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="🔍 搜尋公式名稱、式子或概念…"
          className="field"
        />
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setBook('all')}
            className={`pill ${book === 'all' ? 'bg-brand-300 text-ink' : 'text-ink-soft'}`}
          >
            全部
          </button>
          {booksWithFormulas.map((b) => (
            <button
              key={b.id}
              onClick={() => setBook(b.title)}
              className="pill"
              style={{
                backgroundColor: book === b.title ? b.color : 'transparent',
                color: book === b.title ? '#fff' : b.color,
                borderColor: b.color,
              }}
            >
              {b.title}
            </button>
          ))}
        </div>
      </div>

      <div className="text-sm text-ink-soft">共 {filtered.length} 條公式</div>

      <div className="grid gap-2 sm:grid-cols-2">
        {filtered.map((f, i) => (
          <div key={i} className="card flex flex-col gap-1 p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-ink">{f.formula.name}</span>
              <span className="pill" style={{ color: f.color, borderColor: f.color }}>
                {f.chapter}
              </span>
            </div>
            <code className="rounded-md border-2 border-line/40 bg-[#fbf3df] px-2 py-1 font-mono text-sm font-semibold text-ink">
              {f.formula.expr}
            </code>
            {f.formula.note && <span className="text-xs text-ink-faint">{f.formula.note}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
