import { useMemo, useState } from 'react';
import type { DomainId, Question } from '../types';
import { QUESTIONS } from '../data/questions';
import { IBO_STYLE } from '../data/iboStyle';
import { DOMAINS } from '../data/domains';
import { isCorrect } from '../lib/grade';
import QuestionView from '../components/QuestionView';

/** 刷題的三個階段：初賽、複賽、國手賽（IBO 風格多敘述）。 */
type Tier = 'preliminary' | 'semifinal' | 'national';

const TIER_META: Record<Tier, { label: string; color: string; hint: string }> = {
  preliminary: { label: '初賽', color: '#6f9e57', hint: '基礎觀念、單選為主' },
  semifinal: { label: '複賽', color: '#c8954e', hint: '整合與計算、難度提升' },
  national: { label: '國手賽', color: '#b9573e', hint: 'IBO 風格多敘述判讀、最難' },
};

interface Card {
  q: Question;
  tier: Tier;
}

/** 三級題庫：初賽/複賽取自歷屆題庫，國手賽取自 IBO 風格卷。 */
const POOLS: Record<Tier, Card[]> = {
  preliminary: QUESTIONS.filter((q) => q.round === 'preliminary').map((q) => ({ q, tier: 'preliminary' })),
  semifinal: QUESTIONS.filter((q) => q.round === 'semifinal').map((q) => ({ q, tier: 'semifinal' })),
  national: IBO_STYLE.map((q) => ({ q, tier: 'national' })),
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function Drill() {
  const [tiers, setTiers] = useState<Record<Tier, boolean>>({
    preliminary: true,
    semifinal: true,
    national: true,
  });
  const [domain, setDomain] = useState<DomainId | 'all'>('all');
  const [seed, setSeed] = useState(0); // bump to reshuffle

  const deck = useMemo(() => {
    let cards = (Object.keys(POOLS) as Tier[])
      .filter((t) => tiers[t])
      .flatMap((t) => POOLS[t]);
    if (domain !== 'all') cards = cards.filter((c) => c.q.domain === domain);
    return shuffle(cards);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tiers, domain, seed]);

  const [idx, setIdx] = useState(0);
  const [sel, setSel] = useState<string[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [stats, setStats] = useState({ answered: 0, correct: 0 });
  const [finished, setFinished] = useState(false);

  // Restart drill whenever the deck identity changes (filters / reshuffle).
  const deckKey = `${Object.entries(tiers).filter(([, v]) => v).map(([k]) => k).join(',')}|${domain}|${seed}`;
  const [activeKey, setActiveKey] = useState(deckKey);
  if (deckKey !== activeKey) {
    setActiveKey(deckKey);
    setIdx(0);
    setSel([]);
    setRevealed(false);
    setStats({ answered: 0, correct: 0 });
    setFinished(false);
  }

  const card = deck[idx];

  function doReveal(selection: string[]) {
    if (revealed || !card) return;
    setRevealed(true);
    const ok = isCorrect(card.q, selection);
    setStats((s) => ({ answered: s.answered + 1, correct: s.correct + (ok ? 1 : 0) }));
  }

  function handleSelect(optionId: string) {
    if (revealed || !card) return;
    if (card.q.type === 'multiple') {
      setSel((prev) =>
        prev.includes(optionId) ? prev.filter((x) => x !== optionId) : [...prev, optionId],
      );
    } else {
      setSel([optionId]);
      doReveal([optionId]);
    }
  }

  function next() {
    if (idx + 1 >= deck.length) {
      setFinished(true);
      return;
    }
    setIdx((i) => i + 1);
    setSel([]);
    setRevealed(false);
  }

  const accuracy = stats.answered ? Math.round((stats.correct / stats.answered) * 100) : 0;

  function toggleTier(t: Tier) {
    setTiers((prev) => {
      const nextV = { ...prev, [t]: !prev[t] };
      if (!Object.values(nextV).some(Boolean)) return prev; // keep at least one
      return nextV;
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="font-display text-2xl font-bold">刷題練習</h1>
        <p className="text-sm text-ink-soft">
          初賽・複賽・國手賽混合出題，手機點一下就作答，立即顯示難度與完整解析。
        </p>
      </div>

      {/* 階段選擇 */}
      <div className="card flex flex-col gap-3">
        <div>
          <div className="mb-2 text-sm font-medium">階段（可複選，至少一個）</div>
          <div className="grid grid-cols-3 gap-2">
            {(Object.keys(TIER_META) as Tier[]).map((t) => {
              const on = tiers[t];
              const m = TIER_META[t];
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => toggleTier(t)}
                  className="rounded-2xl border-2 px-2 py-2 text-center transition"
                  style={{
                    borderColor: m.color,
                    backgroundColor: on ? m.color : 'transparent',
                    color: on ? '#fff' : m.color,
                  }}
                >
                  <div className="text-sm font-bold">{m.label}</div>
                  <div className="text-[10px] leading-tight opacity-90">{POOLS[t].length} 題</div>
                </button>
              );
            })}
          </div>
          <p className="mt-1.5 text-[11px] text-ink-faint">
            {(Object.keys(TIER_META) as Tier[])
              .filter((t) => tiers[t])
              .map((t) => `${TIER_META[t].label}：${TIER_META[t].hint}`)
              .join('　')}
          </p>
        </div>

        <div>
          <div className="mb-2 text-sm font-medium">領域</div>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => setDomain('all')}
              className="pill border"
              style={{
                borderColor: '#9c8b6a',
                backgroundColor: domain === 'all' ? '#9c8b6a' : 'transparent',
                color: domain === 'all' ? '#fff' : '#7a6a4a',
              }}
            >
              全部
            </button>
            {DOMAINS.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => setDomain(d.id)}
                className="pill border"
                style={{
                  borderColor: d.color,
                  backgroundColor: domain === d.id ? d.color : 'transparent',
                  color: domain === d.id ? '#fff' : d.color,
                }}
              >
                {d.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 進度 + 正確率 */}
      {deck.length > 0 && !finished && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-ink-soft">
            進度 {Math.min(idx + 1, deck.length)} / {deck.length}
          </span>
          <span className="text-ink-soft">
            已答 {stats.answered}・正確率{' '}
            <span className="font-bold tabular-nums text-ink">{accuracy}%</span>
          </span>
        </div>
      )}

      {/* 題目卡 */}
      {deck.length === 0 ? (
        <div className="card text-center text-sm text-ink-soft">此條件下沒有題目，換個階段或領域試試。</div>
      ) : finished ? (
        <div className="card flex flex-col items-center gap-3 text-center">
          <div className="text-sm text-ink-soft">本輪完成</div>
          <div className="text-5xl font-bold tabular-nums text-brand-400">{accuracy}%</div>
          <div className="text-sm text-ink-soft">
            答對 {stats.correct} / {stats.answered} 題
          </div>
          <button
            className="btn-primary mt-2"
            onClick={() => setSeed((s) => s + 1)}
          >
            🔀 再刷一輪（重新洗牌）
          </button>
        </div>
      ) : (
        card && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span
                className="pill font-bold text-white"
                style={{ backgroundColor: TIER_META[card.tier].color }}
              >
                {TIER_META[card.tier].label}
              </span>
              {card.tier === 'national' && (
                <span className="text-[11px] text-ink-faint">逐敘述判斷對錯（複選）</span>
              )}
            </div>

            <QuestionView
              question={card.q}
              index={idx}
              selected={sel}
              onSelect={handleSelect}
              revealed={revealed}
            />

            <div className="flex gap-3">
              {!revealed ? (
                <button
                  className="btn-primary flex-1"
                  disabled={sel.length === 0}
                  onClick={() => doReveal(sel)}
                >
                  {card.q.type === 'multiple' ? '對答案' : '看解析'}
                </button>
              ) : (
                <button className="btn-primary flex-1" onClick={next}>
                  {idx + 1 >= deck.length ? '完成本輪' : '下一題 →'}
                </button>
              )}
              <button
                className="btn-ghost"
                title="重新洗牌"
                onClick={() => setSeed((s) => s + 1)}
              >
                🔀
              </button>
            </div>
          </div>
        )
      )}
    </div>
  );
}
