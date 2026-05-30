import type { Question } from '../types';
import DomainBadge, { DifficultyDots } from './DomainBadge';

interface Props {
  question: Question;
  index?: number;
  selected: string[];
  onSelect: (optionId: string) => void;
  /** When true, show correctness + explanation and lock input. */
  revealed: boolean;
}

export default function QuestionView({ question, index, selected, onSelect, revealed }: Props) {
  const multi = question.type === 'multiple';

  return (
    <div className="card">
      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
        {index !== undefined && <span className="font-semibold text-slate-200">第 {index + 1} 題</span>}
        <DomainBadge domain={question.domain} />
        <span>{question.subtopic}</span>
        {question.year > 0 && <span>· {question.year}</span>}
        <span>· {question.round === 'preliminary' ? '初賽' : '複賽'}</span>
        {multi && <span className="text-amber-400">· 複選</span>}
        <span className="ml-auto">
          <DifficultyDots level={question.difficulty} />
        </span>
      </div>

      <p className="mt-3 whitespace-pre-wrap leading-relaxed">{question.stem}</p>

      <div className="mt-4 flex flex-col gap-2">
        {question.options.map((opt) => {
          const isSel = selected.includes(opt.id);
          const isAns = question.answer.includes(opt.id);
          let cls = 'border-slate-700 bg-slate-800/50 hover:border-slate-500';
          if (revealed) {
            if (isAns) cls = 'border-brand-500 bg-brand-500/15';
            else if (isSel && !isAns) cls = 'border-rose-500 bg-rose-500/15';
            else cls = 'border-slate-700 bg-slate-800/30 opacity-70';
          } else if (isSel) {
            cls = 'border-brand-500 bg-brand-500/15';
          }
          return (
            <button
              key={opt.id}
              type="button"
              disabled={revealed}
              onClick={() => onSelect(opt.id)}
              className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-left transition ${cls}`}
            >
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-current text-xs font-bold">
                {opt.id}
              </span>
              <span className="flex-1">{opt.text}</span>
              {revealed && isAns && <span className="text-brand-400">✓</span>}
              {revealed && isSel && !isAns && <span className="text-rose-400">✗</span>}
            </button>
          );
        })}
      </div>

      {revealed && (
        <div className="mt-4 rounded-xl border border-slate-700 bg-slate-900/60 p-4">
          <div className="text-xs font-semibold text-brand-400">詳解</div>
          <p className="mt-1 text-sm leading-relaxed text-slate-200">{question.explanation}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {question.concepts.map((c) => (
              <span key={c} className="pill bg-slate-700/70 text-slate-300">
                #{c}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
