import { createPortal } from 'react-dom';
import type { StudyNote } from '../data/notes';

interface Props {
  title: string;
  notes: StudyNote[];
}

/** Print-optimised review notes (Save as PDF). Hidden on screen. */
export default function PrintableNotes({ title, notes }: Props) {
  return createPortal(
    <div className="print-root">
      <h1 className="print-title">{title}・長考重點複習筆記</h1>
      <p className="print-sub">生物奧林匹亞模擬複習 · {new Date().toLocaleDateString('zh-TW')}</p>
      <ol className="print-q">
        {notes.map((n) => (
          <li key={n.title}>
            <div className="print-stem">
              <b>{n.title}</b>
            </div>
            <div className="print-simple">🧒 {n.simple}</div>
            <ul style={{ margin: '1mm 0 0 8mm' }}>
              {n.points.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
            {n.exam && <div className="print-exp">⚠️ {n.exam}</div>}
          </li>
        ))}
      </ol>
    </div>,
    document.body,
  );
}
