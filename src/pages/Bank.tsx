import { useMemo, useState } from 'react';
import type { DomainId, Round } from '../types';
import { DOMAINS, DOMAIN_MAP } from '../data/domains';
import { DomainIcon } from '../components/DomainBadge';
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
        <h1 className="font-display text-2xl font-bold text-ink">題庫瀏覽 📚</h1>
        <p className="text-sm text-ink-soft">
          共 {QUESTIONS.length} 題，可依領域、階段、關鍵字篩選並查看詳解。
        </p>
      </div>

      <div className="card flex flex-col gap-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="🔍 搜尋題幹、考點或概念…"
          className="field"
        />
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setDomain('all')}
            className={`pill border ${
              domain === 'all'
                ? 'border-brand-400 bg-brand-400 text-white'
                : 'border-brand-100 text-ink-soft'
            }`}
          >
            全部領域
          </button>
          {DOMAINS.map((d) => (
            <button
              key={d.id}
              onClick={() => setDomain(d.id)}
              className="pill gap-1 border"
              style={{
                borderColor: d.color,
                backgroundColor: domain === d.id ? d.color : 'transparent',
                color: domain === d.id ? '#fff' : d.color,
              }}
            >
              <DomainIcon domain={d.id} size={14} /> {d.name}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          {(['all', 'preliminary', 'semifinal'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRound(r)}
              className={`pill border ${
                round === r
                  ? 'border-brand-400 bg-brand-400 text-white'
                  : 'border-brand-100 text-ink-soft'
              }`}
            >
              {r === 'all' ? '全部階段' : r === 'preliminary' ? '初賽' : '複賽'}
            </button>
          ))}
        </div>
      </div>

      <div className="text-sm text-ink-soft">符合 {filtered.length} 題</div>

      <div className="flex flex-col gap-3">
        {filtered.map((q) =>
          openId === q.id ? (
            <div key={q.id}>
              <QuestionView question={q} selected={q.answer} onSelect={() => {}} revealed />
              <button
                onClick={() => setOpenId(null)}
                className="mt-2 text-xs font-semibold text-ink-soft hover:underline"
              >
                收合 ▲
              </button>
            </div>
          ) : (
            <button
              key={q.id}
              onClick={() => setOpenId(q.id)}
              className="card text-left transition hover:-translate-y-0.5 hover:border-brand-300"
            >
              <div className="flex items-center gap-2 text-xs text-ink-soft">
                <span
                  className="pill gap-1"
                  style={{
                    backgroundColor: `${DOMAIN_MAP[q.domain].color}22`,
                    color: DOMAIN_MAP[q.domain].color,
                  }}
                >
                  <DomainIcon domain={q.domain} size={14} /> {DOMAIN_MAP[q.domain].name}
                </span>
                <span>{q.subtopic}</span>
                {q.year > 0 && <span>· {q.year}</span>}
                <span className="ml-auto font-semibold text-brand-500">展開詳解 ▼</span>
              </div>
              <p className="mt-2 line-clamp-2 text-sm text-ink">{q.stem}</p>
            </button>
          ),
        )}
      </div>
    </div>
  );
}
