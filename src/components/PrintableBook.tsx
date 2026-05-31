import { createPortal } from 'react-dom';
import type { Textbook } from '../data/textbooks';
import { BOOK_SECTIONS } from '../data/bookSections';

/** Print-optimised textbook summary (Save as PDF). Hidden on screen. */
export default function PrintableBook({ book }: { book: Textbook }) {
  return createPortal(
    <div className="print-root">
      <h1 className="print-title">{book.title}・重點摘要筆記</h1>
      <p className="print-sub">{book.zh} · 生物奧林匹亞模擬複習（原創學習摘要）</p>
      {book.units.map((u) => (
        <div key={u.unit}>
          <h2 className="print-h2">{u.unit}</h2>
          <ol className="print-q">
            {u.chapters.map((c) => (
              <li key={c.ch + c.title}>
                <div className="print-stem">
                  <b>
                    {c.ch} {c.title}
                  </b>
                </div>
                <div className="print-simple">🧒 {c.simple}</div>
                <div className="print-exp">{c.detail}</div>
                <ul style={{ margin: '1mm 0 0 8mm' }}>
                  {c.points.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
                {(BOOK_SECTIONS[book.id]?.[c.ch] ?? []).map((s, i) => (
                  <div key={'s' + i} style={{ margin: '0.5mm 0 0 8mm' }}>
                    {s.exam ? '⭐' : '・'}
                    <b>{s.t}</b>：{s.n}
                  </div>
                ))}
                {c.formulas && c.formulas.length > 0 && (
                  <div style={{ margin: '1.5mm 0 0 6mm' }}>
                    🧮 公式：
                    {c.formulas.map((f) => (
                      <span key={f.name}> {f.name}: {f.expr};</span>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ol>
        </div>
      ))}
    </div>,
    document.body,
  );
}
