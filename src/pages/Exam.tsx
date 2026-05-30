import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type {
  DomainId,
  ExamSession,
  InputMode,
  Question,
  Round,
  SessionMode,
} from '../types';
import { DOMAINS } from '../data/domains';
import { QUESTIONS } from '../data/questions';
import {
  buildAdaptiveExam,
  buildExam,
  generateQuestionSet,
} from '../lib/generator';
import { isCorrect } from '../lib/grade';
import {
  MEDAL_LABEL,
  cohortDistribution,
  estimatePlacement,
  scoreQuestion,
} from '../lib/iboScoring';
import { attemptScore, formatDuration, sessionTotalTime } from '../lib/scoring';
import { useStore } from '../store/useStore';
import QuestionView from '../components/QuestionView';
import DomainBadge from '../components/DomainBadge';
import HandwritingCanvas from '../components/HandwritingCanvas';
import ExamTimer from '../components/ExamTimer';
import PrintablePaper from '../components/PrintablePaper';

type Phase = 'config' | 'running' | 'result';

/** Seconds allowed per question when the timed mode is on. */
const PER_QUESTION_SEC: Record<Round, number> = { preliminary: 90, semifinal: 120 };

const MEDAL_COLOR: Record<string, string> = {
  gold: '#e3b341',
  silver: '#cbd5e1',
  bronze: '#d97706',
  none: '#64748b',
};

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
  const [inputMode, setInputMode] = useState<InputMode>('select');
  const [timed, setTimed] = useState(true);
  const [selectedDomains, setSelectedDomains] = useState<DomainId[]>([]);
  const [count, setCount] = useState(8);
  const [includeVariants, setIncludeVariants] = useState(false);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [sessionId, setSessionId] = useState('');
  const [durationSec, setDurationSec] = useState(0);
  const [startedAt, setStartedAt] = useState(0);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [images, setImages] = useState<Record<string, string>>({});
  const [revealedMap, setRevealedMap] = useState<Record<string, boolean>>({});
  const [startTimes, setStartTimes] = useState<Record<string, number>>({});
  const [paper, setPaper] = useState<{ title: string; questions: Question[] } | null>(null);

  function downloadPdf(title: string, qs: Question[]) {
    if (qs.length === 0) return;
    setPaper({ title, questions: qs });
    // let the printable paper mount before opening the print dialog
    setTimeout(() => window.print(), 120);
  }

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
    if (includeVariants) {
      qs = [...qs, ...generateQuestionSet(2, Date.now())];
    }
    if (qs.length === 0) return;

    const dur = timed ? qs.length * PER_QUESTION_SEC[round] : 0;
    const id = `sess-${Date.now()}`;
    const now = Date.now();
    const session: ExamSession = {
      id,
      mode,
      round,
      domains: selectedDomains.length ? selectedDomains : DOMAINS.map((d) => d.id),
      questionIds: qs.map((q) => q.id),
      attempts: [],
      startedAt: now,
      durationSec: dur,
    };
    addSession(session);
    setSessionId(id);
    setQuestions(qs);
    setDurationSec(dur);
    setStartedAt(now);
    setCurrent(0);
    setAnswers({});
    setImages({});
    setRevealedMap({});
    setStartTimes({ [qs[0].id]: now });
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

  function gradeAndRecord(question: Question, selected: string[]) {
    const timeSpent = Math.round(
      (Date.now() - (startTimes[question.id] ?? Date.now())) / 1000,
    );
    recordAttempt(sessionId, {
      questionId: question.id,
      domain: question.domain,
      round: question.round,
      difficulty: question.difficulty,
      selected,
      correct: isCorrect(question, selected),
      score: scoreQuestion(question, selected),
      timeSpent,
      timestamp: Date.now(),
      answerImage: images[question.id],
    });
  }

  function submitAnswer() {
    if (!q) return;
    const selected = answers[q.id] ?? [];
    if (selected.length === 0) return;
    gradeAndRecord(q, selected);
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

  /** Time ran out: grade every not-yet-graded question and finish. */
  function finalizeOnExpire() {
    for (const question of questions) {
      if (!revealedMap[question.id]) {
        gradeAndRecord(question, answers[question.id] ?? []);
      }
    }
    completeSession(sessionId);
    setPhase('result');
  }

  // ─────────────────────────── Config phase ───────────────────────────
  if (phase === 'config') {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="font-display text-2xl font-bold">模擬測驗設定</h1>
          <p className="text-sm text-ink-soft">
            依初賽／複賽情境配題，採用生物奧林匹亞官方計分（部分給分），作答後即時解析並分析分數落點。
          </p>
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
              <p className="mt-2 text-xs text-ink-soft">
                自適應出題：依你的歷史表現，加重弱點領域與未練習過的題目。
              </p>
            )}
          </div>

          <div>
            <div className="mb-2 text-sm font-medium">作答模式</div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setInputMode('select')}
                className={inputMode === 'select' ? 'btn-primary' : 'btn-ghost'}
              >
                🖱️ 點選模式
              </button>
              <button
                onClick={() => setInputMode('handwriting')}
                className={inputMode === 'handwriting' ? 'btn-primary' : 'btn-ghost'}
              >
                ✍️ 手寫模式
              </button>
            </div>
            {inputMode === 'handwriting' && (
              <p className="mt-2 text-xs text-ink-soft">
                手寫模式提供作答畫布（像平板寫考卷），仍以官方算法依你點選的最終選項計分。
              </p>
            )}
          </div>

          <label className="flex items-center justify-between text-sm">
            <span className="font-medium">計時模式</span>
            <input
              type="checkbox"
              checked={timed}
              onChange={(e) => setTimed(e.target.checked)}
              className="h-5 w-5 accent-brand-500"
            />
          </label>
          {timed && (
            <p className="-mt-3 text-xs text-ink-soft">
              每題 {PER_QUESTION_SEC[round]} 秒，共約 {Math.round((count * PER_QUESTION_SEC[round]) / 60)} 分鐘，時間到自動交卷。
            </p>
          )}

          <div>
            <div className="mb-2 text-sm font-medium">
              領域 <span className="text-ink-faint">(不選＝全部，依官方權重配題)</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {DOMAINS.map((d) => (
                <button
                  key={d.id}
                  onClick={() => toggleDomain(d.id)}
                  className="pill border"
                  style={{
                    borderColor: d.color,
                    backgroundColor: selectedDomains.includes(d.id) ? d.color : 'transparent',
                    color: selectedDomains.includes(d.id) ? '#fff' : d.color,
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

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={includeVariants}
              onChange={(e) => setIncludeVariants(e.target.checked)}
              className="accent-brand-500"
            />
            加入自動生成題（哈溫、重組、酶動力學、表面積比，每次都不一樣）
          </label>

          <button className="btn-primary" onClick={start}>
            開始作答
          </button>
          <button
            className="btn-ghost"
            onClick={() => {
              const base = buildExam(QUESTIONS, { round, domains: selectedDomains, count });
              const qs = includeVariants ? [...base, ...generateQuestionSet(2, Date.now())] : base;
              downloadPdf(
                `生物奧林匹亞${round === 'preliminary' ? '初賽' : '複賽'}模擬考卷`,
                qs,
              );
            }}
          >
            📄 生成考卷並下載 PDF（含解析）
          </button>
        </div>

        {paper && <PrintablePaper title={paper.title} questions={paper.questions} />}
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
          <span className="text-ink-soft">
            進度 {current + 1} / {questions.length}
          </span>
          <div className="flex items-center gap-3">
            <span className="text-ink-soft">已作答 {answeredCount}</span>
            <ExamTimer startedAt={startedAt} durationSec={durationSec} onExpire={finalizeOnExpire} />
          </div>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-brand-50">
          <div
            className="h-full bg-brand-500 transition-all"
            style={{ width: `${((current + 1) / questions.length) * 100}%` }}
          />
        </div>

        {inputMode === 'handwriting' && (
          <HandwritingCanvas
            questionId={q.id}
            initial={images[q.id]}
            disabled={revealed}
            onChange={(url) => setImages((prev) => ({ ...prev, [q.id]: url }))}
          />
        )}

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
  const sessAttempts = session?.attempts ?? [];
  const rawScore = sessAttempts.reduce((s, a) => s + attemptScore(a), 0);
  const maxScore = sessAttempts.length || 1;
  const percentage = Math.round((rawScore / maxScore) * 1000) / 10;
  const fullyCorrect = sessAttempts.filter((a) => a.correct).length;
  const totalTime = session ? sessionTotalTime(session) : 0;
  const placement = estimatePlacement(percentage, round);
  const medalColor = MEDAL_COLOR[placement.medal];

  const dist = cohortDistribution(round).map((d) => ({
    bin: `${d.bin}`,
    人數: d.count,
    isUser: percentage >= d.bin && percentage < d.bin + 5,
  }));

  // per-domain breakdown for this session
  const byDomain = new Map<DomainId, { score: number; t: number }>();
  for (const a of sessAttempts) {
    const e = byDomain.get(a.domain) ?? { score: 0, t: 0 };
    e.t += 1;
    e.score += attemptScore(a);
    byDomain.set(a.domain, e);
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-2xl font-bold">測驗結果</h1>

      {/* Official score + time */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card text-center">
          <div className="text-sm text-ink-soft">官方得分率</div>
          <div
            className={`text-5xl font-bold tabular-nums ${
              percentage >= 70 ? 'text-brand-400' : percentage >= 50 ? 'text-amber-400' : 'text-rose-400'
            }`}
          >
            {percentage}%
          </div>
          <div className="text-xs text-ink-soft">
            得分 {rawScore.toFixed(2)} / {maxScore}（全對 {fullyCorrect} 題）
          </div>
        </div>
        <div className="card text-center">
          <div className="text-sm text-ink-soft">作答時間</div>
          <div className="text-5xl font-bold tabular-nums text-ink">
            {formatDuration(totalTime)}
          </div>
          <div className="text-xs text-ink-soft">
            平均 {sessAttempts.length ? Math.round(totalTime / sessAttempts.length) : 0} 秒 / 題
          </div>
        </div>
        <div className="card text-center">
          <div className="text-sm text-ink-soft">模擬獎牌</div>
          <div className="text-5xl font-bold" style={{ color: medalColor }}>
            {placement.medal === 'gold'
              ? '🥇'
              : placement.medal === 'silver'
                ? '🥈'
                : placement.medal === 'bronze'
                  ? '🥉'
                  : '—'}
          </div>
          <div className="text-xs" style={{ color: medalColor }}>
            {MEDAL_LABEL[placement.medal]}
          </div>
        </div>
      </div>

      {/* 分數落點 / 排名 */}
      <div className="card">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">分數落點與模擬排名</h3>
          <span
            className="pill"
            style={{
              backgroundColor: placement.reachesFrontRunner ? '#10b98122' : '#f59e0b22',
              color: placement.reachesFrontRunner ? '#34d399' : '#f59e0b',
            }}
          >
            {placement.label}
          </span>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-3 text-center">
          <div>
            <div className="font-display text-2xl font-bold tabular-nums text-brand-400">
              {placement.percentile}%
            </div>
            <div className="text-xs text-ink-soft">百分位 (PR)</div>
          </div>
          <div>
            <div className="font-display text-2xl font-bold tabular-nums text-ink">
              {placement.rank}
            </div>
            <div className="text-xs text-ink-soft">
              模擬排名 / {placement.cohortSize} 人
            </div>
          </div>
          <div>
            <div className="font-display text-2xl font-bold tabular-nums text-ink">
              {Math.round(placement.topFraction * 100)}%
            </div>
            <div className="text-xs text-ink-soft">勝過你的比例</div>
          </div>
        </div>

        <div className="mt-5 h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dist}>
              <CartesianGrid strokeDasharray="3 3" stroke="#dbe7f2" />
              <XAxis dataKey="bin" stroke="#94a3b8" fontSize={10} interval={1} />
              <YAxis stroke="#94a3b8" fontSize={10} allowDecimals={false} />
              <Tooltip
                contentStyle={{ background: '#ffffff', border: '1px solid #cfe2f2', borderRadius: 16, color: '#324155' }}
                labelFormatter={(l) => `分數 ${l}–${Number(l) + 5}%`}
              />
              <ReferenceLine
                x={`${Math.min(95, Math.floor(percentage / 5) * 5)}`}
                stroke="#ef9d6b"
                strokeWidth={2}
                label={{ value: '你', fill: '#ef9d6b', fontSize: 11, position: 'top' }}
              />
              <Bar dataKey="人數">
                {dist.map((d, i) => (
                  <Cell key={i} fill={d.isUser ? '#ef9d6b' : '#d8d3c0'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="mt-1 text-center text-xs text-ink-faint">
          落點以該階段參賽者成績分布推估（金牌前 10%、銀牌前 30%、銅牌前 60%）。
        </p>
      </div>

      {/* per-domain */}
      <div className="card">
        <h3 className="mb-3 font-semibold">本次各領域表現（官方部分給分）</h3>
        <div className="flex flex-col gap-2">
          {[...byDomain.entries()].map(([d, v]) => (
            <div key={d} className="flex items-center gap-3 text-sm">
              <span className="w-28">
                <DomainBadge domain={d} />
              </span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-brand-50">
                <div
                  className="h-full rounded-full bg-brand-500"
                  style={{ width: `${(v.score / v.t) * 100}%` }}
                />
              </div>
              <span className="w-16 text-right text-ink-soft">
                {v.score.toFixed(1)}/{v.t}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <button className="btn-primary" onClick={() => setPhase('config')}>
          再來一次
        </button>
        <button
          className="btn-ghost"
          onClick={() => downloadPdf('生物奧林匹亞模擬考卷（本次作答）', questions)}
        >
          📄 下載 PDF
        </button>
        <a href="#/performance" className="btn-ghost">
          完整成績分析
        </a>
      </div>

      {paper && <PrintablePaper title={paper.title} questions={paper.questions} />}
    </div>
  );
}
