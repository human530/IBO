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
      <div className="flex flex-wrap items-center gap-2 text-xs text-ink-soft">
        {index !== undefined && (
          <span className="font-display font-bold text-ink">第 {index + 1} 題</span>
        )}
        <DomainBadge domain={question.domain} />
        <span>{question.subtopic}</span>
        {question.year > 0 && <span>· {question.year}</span>}
        <span>· {question.round === 'preliminary' ? '初賽' : '複賽'}</span>
        {multi && <span className="font-semibold text-brand-500">· 複選</span>}
        <span className="ml-auto">
          <DifficultyDots level={question.difficulty} />
        </span>
      </div>

      <p className="mt-3 whitespace-pre-wrap leading-relaxed text-ink">{question.stem}</p>

      <div className="mt-4 flex flex-col gap-2">
        {question.options.map((opt) => {
          const isSel = selected.includes(opt.id);
          const isAns = question.answer.includes(opt.id);
          let cls = 'border-brand-100 bg-white hover:border-brand-300';
          if (revealed) {
            if (isAns) cls = 'border-emerald-300 bg-emerald-50';
            else if (isSel && !isAns) cls = 'border-rose-300 bg-rose-50';
            else cls = 'border-brand-100 bg-white opacity-70';
          } else if (isSel) {
            cls = 'border-brand-400 bg-brand-50';
          }
          return (
            <button
              key={opt.id}
              type="button"
              disabled={revealed}
              onClick={() => onSelect(opt.id)}
              className={`flex items-start gap-3 rounded-2xl border px-4 py-3 text-left transition ${cls}`}
            >
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-current text-xs font-bold text-ink">
                {opt.id}
              </span>
              <span className="flex-1 text-ink">{opt.text}</span>
              {revealed && isAns && <span className="text-emerald-500">✓</span>}
              {revealed && isSel && !isAns && <span className="text-rose-400">✗</span>}
            </button>
          );
        })}
      </div>

      {revealed && (
        <div className="mt-4 rounded-2xl border border-brand-100 bg-brand-50/50 p-4">
          <div className="flex items-center gap-1.5 text-xs font-bold text-brand-500">
            <span>💡</span> 詳解
          </div>
          <p className="mt-1 text-sm leading-relaxed text-ink">{question.explanation}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {question.concepts.map((c) => (
              <span key={c} className="pill bg-white text-ink-soft">
                #{c}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
