import { createPortal } from 'react-dom';
import type { Question } from '../types';
import { DOMAIN_MAP } from '../data/domains';

interface Props {
  title: string;
  questions: Question[];
}

/**
 * A clean, print-optimised exam paper rendered into a body portal. Hidden on
 * screen; shown only when printing (use the browser's "Save as PDF").
 * Includes the questions, then an answer key with the 秒懂版 + 完整詳解.
 */
export default function PrintablePaper({ title, questions }: Props) {
  return createPortal(
    <div className="print-root">
      <h1 className="print-title">{title}</h1>
      <p className="print-sub">
        共 {questions.length} 題 · 闖進IBO大作戰 · {new Date().toLocaleDateString('zh-TW')}
      </p>

      <ol className="print-q">
        {questions.map((q, i) => (
          <li key={q.id}>
            <div className="print-stem">
              <b>{i + 1}.</b>（{DOMAIN_MAP[q.domain].name}
              {q.type === 'multiple' ? '・複選' : ''}）{q.stem}
            </div>
            <div className="print-opts">
              {q.options.map((o) => (
                <span key={o.id} className="print-opt">
                  ({o.id}) {o.text}
                </span>
              ))}
            </div>
          </li>
        ))}
      </ol>

      <h2 className="print-h2">解答與解析</h2>
      <ol className="print-ans">
        {questions.map((q, i) => (
          <li key={q.id}>
            <div>
              <b>{i + 1}. 答案：{q.answer.join('、')}</b>
            </div>
            {q.simple && <div className="print-simple">🧒 秒懂版：{q.simple}</div>}
            <div className="print-exp">📘 詳解：{q.explanation}</div>
          </li>
        ))}
      </ol>
    </div>,
    document.body,
  );
}
