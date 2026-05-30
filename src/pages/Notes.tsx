import { useState } from 'react';
import type { DomainId } from '../types';
import { DOMAINS, DOMAIN_MAP } from '../data/domains';
import { DomainIcon } from '../components/DomainBadge';
import { DOMAIN_NOTES } from '../data/notes';
import { DOMAIN_BOOKS } from '../data/strategy';
import PrintableNotes from '../components/PrintableNotes';

export default function Notes() {
  const [domain, setDomain] = useState<DomainId>('cell');
  const [print, setPrint] = useState<{ title: string } | null>(null);
  const meta = DOMAIN_MAP[domain];
  const notes = DOMAIN_NOTES[domain];

  function downloadPdf() {
    setPrint({ title: meta.name });
    setTimeout(() => window.print(), 120);
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">複習筆記 📒</h1>
        <p className="text-sm text-ink-soft">
          七大領域的「長考重點」整理：先看 🧒 白話秒懂，再記考點，⚠️ 是易錯提醒。
        </p>
      </div>

      {/* domain selector */}
      <div className="flex flex-wrap gap-2">
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

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-ink-soft">
          <span
            className="pill"
            style={{ backgroundColor: `${meta.color}22`, color: meta.color }}
          >
            <DomainIcon domain={domain} size={14} /> {meta.name}
          </span>
          <span>{notes.length} 則重點</span>
        </div>
        <button className="btn-ghost px-3 py-1.5 text-sm" onClick={downloadPdf}>
          📄 下載本領域筆記 PDF
        </button>
      </div>

      <p className="rounded-2xl border border-brand-100 bg-brand-50/50 p-3 text-xs text-ink-soft">
        {meta.description}
      </p>
      <p className="-mt-2 rounded-2xl bg-candy-lemon/20 px-3 py-2 text-xs text-ink-soft">
        📖 對應課本：{DOMAIN_BOOKS[domain].campbell} · 延伸：{DOMAIN_BOOKS[domain].also}
      </p>

      {/* notes */}
      <div className="flex flex-col gap-3">
        {notes.map((n, i) => (
          <div key={n.title} className="card">
            <div className="flex items-start gap-3">
              <span
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl font-display text-sm font-bold text-white"
                style={{ background: meta.color }}
              >
                {i + 1}
              </span>
              <div className="flex-1">
                <h3 className="font-display font-bold text-ink">{n.title}</h3>

                <div className="mt-2 rounded-2xl border-2 border-dashed border-brand-300 bg-brand-50/50 p-3">
                  <span className="text-xs font-bold text-brand-600">🧒 秒懂</span>
                  <p className="mt-0.5 text-[15px] font-medium leading-relaxed text-ink">
                    {n.simple}
                  </p>
                </div>

                <ul className="mt-3 flex flex-col gap-1.5">
                  {n.points.map((p, j) => (
                    <li key={j} className="flex gap-2 text-sm leading-relaxed text-ink">
                      <span style={{ color: meta.color }}>▸</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>

                {n.exam && (
                  <p className="mt-3 rounded-xl bg-candy-peach/20 px-3 py-2 text-xs text-ink">
                    ⚠️ {n.exam}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {print && <PrintableNotes title={print.title} notes={notes} />}
    </div>
  );
}
