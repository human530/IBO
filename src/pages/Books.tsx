import { useState } from 'react';
import { TEXTBOOKS, type ChapterNote } from '../data/textbooks';
import { BOOK_SECTIONS } from '../data/bookSections';
import PrintableBook from '../components/PrintableBook';

export default function Books() {
  const [bookId, setBookId] = useState<string | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  const [print, setPrint] = useState(false);
  const book = TEXTBOOKS.find((b) => b.id === bookId) ?? null;

  function downloadPdf() {
    setPrint(true);
    setTimeout(() => window.print(), 120);
  }

  // ── Bookshelf ──
  if (!book) {
    return (
      <div className="flex flex-col gap-5">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">教材書庫 📚</h1>
          <p className="text-sm text-ink-soft">
            點一本書，翻開章節讀重點摘要筆記（以白話＋條列整理，可下載 PDF）。
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {TEXTBOOKS.map((b) => {
            const chapters = b.units.reduce((n, u) => n + u.chapters.length, 0);
            return (
              <button
                key={b.id}
                onClick={() => {
                  setBookId(b.id);
                  setOpen(null);
                }}
                className="card flex items-center gap-3 text-left transition hover:-translate-y-0.5"
              >
                <span
                  className="flex h-16 w-12 shrink-0 items-center justify-center rounded-md border-[3px] border-line/60 font-display text-xs font-bold text-white"
                  style={{ background: b.color }}
                >
                  BIO
                </span>
                <span className="flex-1">
                  <span className="block font-display font-bold text-ink">{b.title}</span>
                  <span className="block text-xs text-ink-soft">{b.zh}</span>
                  <span className="mt-1 block text-[11px] text-ink-faint">
                    {b.units.length} 單元 · {chapters} 章重點
                  </span>
                </span>
                <span className="text-brand-500">翻開 →</span>
              </button>
            );
          })}
        </div>
        <p className="text-center text-xs text-ink-faint">
          內容為依各書標準章節結構撰寫的原創學習摘要，非書本原文。
        </p>
      </div>
    );
  }

  // ── Book reader ──
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <button onClick={() => setBookId(null)} className="text-sm font-semibold text-brand-500">
          ← 書庫
        </button>
        <button className="btn-ghost px-3 py-1.5 text-sm" onClick={downloadPdf}>
          📄 下載本書筆記 PDF
        </button>
      </div>

      <div className="card" style={{ borderColor: `${book.color}` }}>
        <h1 className="font-display text-xl font-bold text-ink">{book.title}</h1>
        <p className="text-sm text-ink-soft">{book.zh}</p>
      </div>

      {book.units.map((u) => (
        <div key={u.unit} className="card">
          <h3 className="mb-3 font-display font-bold" style={{ color: book.color }}>
            {u.unit}
          </h3>
          <div className="flex flex-col gap-2">
            {u.chapters.map((c) => {
              const key = u.unit + c.ch + c.title;
              const isOpen = open === key;
              return (
                <div key={key} className="rounded-2xl border-2 border-line/40 bg-white/60">
                  <button
                    onClick={() => setOpen(isOpen ? null : key)}
                    className="flex w-full items-center gap-3 px-3 py-2.5 text-left"
                  >
                    <span
                      className="shrink-0 rounded-md border-2 border-line/50 px-2 py-0.5 text-xs font-bold"
                      style={{ color: book.color }}
                    >
                      {c.ch}
                    </span>
                    <span className="flex-1 font-display font-bold text-ink">{c.title}</span>
                    <span className="text-ink-soft">{isOpen ? '▲' : '▼'}</span>
                  </button>
                  {isOpen && <ChapterBody note={c} color={book.color} bookId={book.id} />}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {print && <PrintableBook book={book} />}
    </div>
  );
}

function ChapterBody({ note, color, bookId }: { note: ChapterNote; color: string; bookId: string }) {
  const sections = BOOK_SECTIONS[bookId]?.[note.ch] ?? [];
  const examCount = sections.filter((s) => s.exam).length;
  const [examOnly, setExamOnly] = useState(false);
  const shown = examOnly ? sections.filter((s) => s.exam) : sections;
  return (
    <div className="border-t-2 border-line/30 px-4 py-3">
      <div className="rounded-xl border-2 border-dashed border-brand-300 bg-brand-50/50 p-2.5">
        <span className="text-xs font-bold text-brand-600">🧒 秒懂</span>
        <p className="mt-0.5 text-[15px] font-medium leading-relaxed text-ink">{note.simple}</p>
      </div>

      <div className="mt-3">
        <div className="mb-1 text-xs font-bold" style={{ color }}>
          📖 詳細理解
        </div>
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-ink">{note.detail}</p>
      </div>

      <div className="mt-3">
        <div className="mb-1 text-xs font-bold text-ink-soft">重點整理</div>
        <ul className="flex flex-col gap-1.5">
          {note.points.map((p, i) => (
            <li key={i} className="flex gap-2 text-sm leading-relaxed text-ink">
              <span style={{ color }}>▸</span>
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </div>

      {sections.length > 0 && (
        <div className="mt-3">
          <div className="mb-1.5 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold" style={{ color }}>
              📑 逐節統整（全 {sections.length} 節 · 會考 {examCount}）
            </span>
            <button
              onClick={() => setExamOnly((v) => !v)}
              className={`pill ${examOnly ? 'bg-clay text-white' : 'text-clay'}`}
              style={{ borderColor: '#b9573e' }}
            >
              {examOnly ? '顯示全部' : '只看會考 ⭐'}
            </button>
          </div>
          <div className="flex flex-col gap-1.5">
            {shown.map((s, i) => (
              <div
                key={i}
                className={`rounded-lg border-2 px-3 py-2 ${
                  s.exam ? 'border-clay/55 bg-clay/10' : 'border-line/35 bg-white/50'
                }`}
              >
                <div>
                  {s.exam && (
                    <span className="mr-1 rounded border border-clay/60 bg-clay/15 px-1 py-0.5 text-[10px] font-bold text-clay">
                      ⭐會考
                    </span>
                  )}
                  <span className="text-sm font-bold text-ink">{s.t}</span>
                  <span className="text-sm text-ink-soft"> — {s.n}</span>
                </div>
                {s.teach && (
                  <div className="mt-1.5 rounded-md border-l-4 border-clay/50 bg-[#fbf3df] px-3 py-2">
                    <div className="mb-0.5 text-[11px] font-bold text-clay">📝 完整教學筆記</div>
                    <p className="text-sm leading-relaxed text-ink">{s.teach}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {note.formulas && note.formulas.length > 0 && (
        <div className="mt-3 rounded-xl border-2 border-line/45 bg-[#fbf3df] p-3">
          <div className="mb-1.5 text-xs font-bold text-clay">🧮 必考公式</div>
          <div className="flex flex-col gap-2">
            {note.formulas.map((f) => (
              <div key={f.name} className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                <span className="text-xs font-bold text-ink-soft">{f.name}</span>
                <code className="rounded-md border border-line/40 bg-white px-2 py-0.5 font-mono text-sm font-semibold text-ink">
                  {f.expr}
                </code>
                {f.note && <span className="text-[11px] text-ink-faint">{f.note}</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
