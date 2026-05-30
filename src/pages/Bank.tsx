import { useMemo, useState } from 'react';
import type { DomainId, Round } from '../types';
import { DOMAINS } from '../data/domains';
import { QUESTIONS } from '../data/questions';
import QuestionView from '../components/QuestionView';

export default function Bank() {
  const [domain, setDomain] = useState<DomainId | 'all'>('all');
  const [round, setRound] = useState<Round | 'all'>('all');
  const [query, setQuery] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const qLower = query.trim().toLowerCase();
    return QUESTIONS.filter((q) => {
      if (domain !== 'all' && q.domain !== domain) return false;
      if (round !== 'all' && q.round !== round) return false;
      if (qLower) {
        const hay = (q.stem + q.subtopic + q.concepts.join(' ')).toLowerCase();
        if (!hay.includes(qLower)) return false;
      }
      return true;
    });
  }, [domain, round, query]);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold">題庫瀏覽</h1>
        <p className="text-sm text-slate-400">共 {QUESTIONS.length} 題，可依領域、階段、關鍵字篩選並查看詳解。</p>
      </div>

      <div className="card flex flex-col gap-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="搜尋題幹、考點或概念…"
          className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm outline-none focus:border-brand-500"
        />
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setDomain('all')}
            className={`pill border border-slate-600 ${
              domain === 'all' ? 'bg-slate-200 text-slate-900' : 'text-slate-300'
            }`}
          >
            全部領域
          </button>
          {DOMAINS.map((d) => (
            <button
              key={d.id}
              onClick={() => setDomain(d.id)}
              className="pill border"
              style={{
                borderColor: d.color,
                backgroundColor: domain === d.id ? d.color : 'transparent',
                color: domain === d.id ? '#0b1f1a' : d.color,
              }}
            >
              {d.name}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          {(['all', 'preliminary', 'semifinal'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRound(r)}
              className={`pill border border-slate-600 ${
                round === r ? 'bg-slate-200 text-slate-900' : 'text-slate-300'
              }`}
            >
              {r === 'all' ? '全部階段' : r === 'preliminary' ? '初賽' : '複賽'}
            </button>
          ))}
        </div>
      </div>

      <div className="text-sm text-slate-400">符合 {filtered.length} 題</div>

      <div className="flex flex-col gap-3">
        {filtered.map((q) =>
          openId === q.id ? (
            <div key={q.id}>
              <QuestionView question={q} selected={q.answer} onSelect={() => {}} revealed />
              <button
                onClick={() => setOpenId(null)}
                className="mt-2 text-xs text-slate-400 hover:underline"
              >
                收合 ▲
              </button>
            </div>
          ) : (
            <button
              key={q.id}
              onClick={() => setOpenId(q.id)}
              className="card text-left hover:border-brand-600"
            >
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span
                  className="pill"
                  style={{
                    backgroundColor: `${DOMAINS.find((d) => d.id === q.domain)?.color}22`,
                    color: DOMAINS.find((d) => d.id === q.domain)?.color,
                  }}
                >
                  {DOMAINS.find((d) => d.id === q.domain)?.name}
                </span>
                <span>{q.subtopic}</span>
                {q.year > 0 && <span>· {q.year}</span>}
                <span className="ml-auto text-brand-400">展開詳解 ▼</span>
              </div>
              <p className="mt-2 line-clamp-2 text-sm">{q.stem}</p>
            </button>
          ),
        )}
      </div>
    </div>
  );
}
