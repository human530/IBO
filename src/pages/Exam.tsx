import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { DomainId, ExamSession, Question, Round, SessionMode } from '../types';
import { DOMAINS } from '../data/domains';
import { QUESTIONS } from '../data/questions';
import {
  buildAdaptiveExam,
  buildExam,
  generateHardyWeinbergVariant,
} from '../lib/generator';
import { isCorrect } from '../lib/grade';
import { useStore } from '../store/useStore';
import QuestionView from '../components/QuestionView';
import DomainBadge from '../components/DomainBadge';

type Phase = 'config' | 'running' | 'result';

export default function Exam() {
  const [params] = useSearchParams();
  const initialAdaptive = params.get('mode') === 'adaptive';

  const sessions = useStore((s) => s.sessions);
  const addSession = useStore((s) => s.addSession);
  const recordAttempt = useStore((s) => s.recordAttempt);
  const completeSession = useStore((s) => s.completeSession);
  const attempts = useMemo(() => sessions.flatMap((s) => s.attempts), [sessions]);

  const [phase, setPhase] = useState<Phase>('config');
  const [round, setRound] = useState<Round>('preliminary');
  const [mode, setMode] = useState<SessionMode>(initialAdaptive ? 'adaptive' : 'mock');
  const [selectedDomains, setSelectedDomains] = useState<DomainId[]>([]);
  const [count, setCount] = useState(8);
  const [includeVariants, setIncludeVariants] = useState(false);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [sessionId, setSessionId] = useState('');
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [revealedMap, setRevealedMap] = useState<Record<string, boolean>>({});
  const [startTimes, setStartTimes] = useState<Record<string, number>>({});

  function toggleDomain(d: DomainId) {
    setSelectedDomains((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d],
    );
  }

  function start() {
    const config = { round, domains: selectedDomains, count };
    let qs =
      mode === 'adaptive'
        ? buildAdaptiveExam(QUESTIONS, attempts, config)
        : buildExam(QUESTIONS, config);
    if (includeVariants && round === 'semifinal') {
      qs = [...qs, generateHardyWeinbergVariant(Date.now())];
    }
    if (qs.length === 0) return;

    const id = `sess-${Date.now()}`;
    const session: ExamSession = {
      id,
      mode,
      round,
      domains: selectedDomains.length ? selectedDomains : DOMAINS.map((d) => d.id),
      questionIds: qs.map((q) => q.id),
      attempts: [],
      startedAt: Date.now(),
      durationSec: 0,
    };
    addSession(session);
    setSessionId(id);
    setQuestions(qs);
    setCurrent(0);
    setAnswers({});
    setRevealedMap({});
    setStartTimes({ [qs[0].id]: Date.now() });
    setPhase('running');
  }

  const q = questions[current];

  function selectOption(optionId: string) {
    if (!q || revealedMap[q.id]) return;
    setAnswers((prev) => {
      const cur = prev[q.id] ?? [];
      if (q.type === 'multiple') {
        return {
          ...prev,
          [q.id]: cur.includes(optionId)
            ? cur.filter((x) => x !== optionId)
            : [...cur, optionId],
        };
      }
      return { ...prev, [q.id]: [optionId] };
    });
  }

  function submitAnswer() {
    if (!q) return;
    const selected = answers[q.id] ?? [];
    if (selected.length === 0) return;
    const correct = isCorrect(q, selected);
    const timeSpent = Math.round((Date.now() - (startTimes[q.id] ?? Date.now())) / 1000);
    recordAttempt(sessionId, {
      questionId: q.id,
      domain: q.domain,
      round: q.round,
      difficulty: q.difficulty,
      selected,
      correct,
      timeSpent,
      timestamp: Date.now(),
    });
    setRevealedMap((prev) => ({ ...prev, [q.id]: true }));
  }

  function next() {
    if (current + 1 >= questions.length) {
      completeSession(sessionId);
      setPhase('result');
      return;
    }
    const nextIdx = current + 1;
    setCurrent(nextIdx);
    setStartTimes((prev) => ({ ...prev, [questions[nextIdx].id]: Date.now() }));
  }

  // ─────────────────────────── Config phase ───────────────────────────
  if (phase === 'config') {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold">模擬測驗設定</h1>
          <p className="text-sm text-slate-400">依初賽／複賽情境配題，作答後即時解析。</p>
        </div>

        <div className="card flex flex-col gap-5">
          <div>
            <div className="mb-2 text-sm font-medium">階段</div>
            <div className="grid grid-cols-2 gap-2">
              {(['preliminary', 'semifinal'] as Round[]).map((r) => (
                <button
                  key={r}
                  onClick={() => setRound(r)}
                  className={round === r ? 'btn-primary' : 'btn-ghost'}
                >
                  {r === 'preliminary' ? '初賽' : '複賽'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-2 text-sm font-medium">出題模式</div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setMode('mock')}
                className={mode === 'mock' ? 'btn-primary' : 'btn-ghost'}
              >
                標準配題
              </button>
              <button
                onClick={() => setMode('adaptive')}
                className={mode === 'adaptive' ? 'btn-primary' : 'btn-ghost'}
              >
                🎯 弱點強化
              </button>
            </div>
            {mode === 'adaptive' && (
              <p className="mt-2 text-xs text-slate-400">
                自適應出題：依你的歷史表現，加重弱點領域與未練習過的題目。
              </p>
            )}
          </div>

          <div>
            <div className="mb-2 text-sm font-medium">
              領域 <span className="text-slate-500">(不選＝全部，依官方權重配題)</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {DOMAINS.map((d) => (
                <button
                  key={d.id}
                  onClick={() => toggleDomain(d.id)}
                  className="pill border"
                  style={{
                    borderColor: d.color,
                    backgroundColor: selectedDomains.includes(d.id)
                      ? d.color
                      : 'transparent',
                    color: selectedDomains.includes(d.id) ? '#0b1f1a' : d.color,
                  }}
                >
                  {d.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-2 text-sm font-medium">題數：{count}</div>
            <input
              type="range"
              min={3}
              max={20}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-full accent-brand-500"
            />
          </div>

          {round === 'semifinal' && (
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={includeVariants}
                onChange={(e) => setIncludeVariants(e.target.checked)}
                className="accent-brand-500"
              />
              加入自動生成變體題 (哈溫定律計算)
            </label>
          )}

          <button className="btn-primary" onClick={start}>
            開始作答
          </button>
        </div>
      </div>
    );
  }

  // ─────────────────────────── Running phase ───────────────────────────
  if (phase === 'running' && q) {
    const selected = answers[q.id] ?? [];
    const revealed = !!revealedMap[q.id];
    const answeredCount = Object.keys(revealedMap).length;
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400">
            進度 {current + 1} / {questions.length}
          </span>
          <span className="text-slate-400">已作答 {answeredCount}</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-700">
          <div
            className="h-full bg-brand-500 transition-all"
            style={{ width: `${((current + 1) / questions.length) * 100}%` }}
          />
        </div>

        <QuestionView
          question={q}
          index={current}
          selected={selected}
          onSelect={selectOption}
          revealed={revealed}
        />

        <div className="flex gap-3">
          {!revealed ? (
            <button
              className="btn-primary flex-1"
              disabled={selected.length === 0}
              onClick={submitAnswer}
            >
              送出答案
            </button>
          ) : (
            <button className="btn-primary flex-1" onClick={next}>
              {current + 1 >= questions.length ? '完成測驗' : '下一題'}
            </button>
          )}
        </div>
      </div>
    );
  }

  // ─────────────────────────── Result phase ───────────────────────────
  const session = sessions.find((s) => s.id === sessionId);
  const correctCount = session?.attempts.filter((a) => a.correct).length ?? 0;
  const totalAnswered = session?.attempts.length ?? 0;
  const acc = totalAnswered ? Math.round((correctCount / totalAnswered) * 100) : 0;

  // per-domain breakdown for this session
  const byDomain = new Map<DomainId, { c: number; t: number }>();
  for (const a of session?.attempts ?? []) {
    const e = byDomain.get(a.domain) ?? { c: 0, t: 0 };
    e.t += 1;
    if (a.correct) e.c += 1;
    byDomain.set(a.domain, e);
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">測驗結果</h1>
      <div className="card text-center">
        <div className="text-sm text-slate-400">正確率</div>
        <div
          className={`text-6xl font-bold tabular-nums ${
            acc >= 70 ? 'text-brand-400' : acc >= 50 ? 'text-amber-400' : 'text-rose-400'
          }`}
        >
          {acc}%
        </div>
        <div className="text-sm text-slate-400">
          答對 {correctCount} / {totalAnswered} 題
        </div>
      </div>

      <div className="card">
        <h3 className="mb-3 font-semibold">本次各領域表現</h3>
        <div className="flex flex-col gap-2">
          {[...byDomain.entries()].map(([d, v]) => (
            <div key={d} className="flex items-center gap-3 text-sm">
              <span className="w-28">
                <DomainBadge domain={d} />
              </span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-700">
                <div
                  className="h-full rounded-full bg-brand-500"
                  style={{ width: `${(v.c / v.t) * 100}%` }}
                />
              </div>
              <span className="w-12 text-right text-slate-400">
                {v.c}/{v.t}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <button className="btn-primary" onClick={() => setPhase('config')}>
          再來一次
        </button>
        <a href="#/performance" className="btn-ghost">
          查看完整成績分析
        </a>
      </div>
    </div>
  );
}
