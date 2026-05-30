import { Link } from 'react-router-dom';
import { CONTACT, RESOURCE_GROUPS } from '../data/resources';

export default function Resources() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">官方資源 🔗</h1>
        <p className="text-sm text-ink-soft">
          直接連到中華民國生物奧林匹亞官方網站，掌握第一手的時程、範圍與歷屆試題。
        </p>
      </div>

      {/* 在站內直接做歷屆風格模擬，不必跳出網站 */}
      <div className="card">
        <h3 className="mb-1 font-display font-bold text-ink">站內歷屆模擬測驗 📝</h3>
        <p className="mb-3 text-xs text-ink-soft">
          不用跳到官網——直接在這裡按情境做題、計時、官方計分並分析分數落點。
        </p>
        <div className="grid gap-2 sm:grid-cols-3">
          <Link to="/exam" className="btn-ghost">初賽模擬</Link>
          <Link to="/exam?style=ibo" className="btn-ghost">IBO 風格</Link>
          <Link to="/exam?camp=1" className="btn-primary">選拔營高強度</Link>
        </div>
      </div>

      {RESOURCE_GROUPS.map((group) => (
        <div key={group.title} className="card">
          <h3 className="mb-3 flex items-center gap-2 font-display font-bold text-ink">
            <span className="icon-chip bg-brand-50">{group.emoji}</span>
            {group.title}
          </h3>
          <div className="grid gap-2 sm:grid-cols-2">
            {group.links.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 rounded-2xl border border-brand-100 bg-white px-4 py-3 transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-soft"
              >
                <span className="text-xl">{link.emoji}</span>
                <span className="flex-1">
                  <span className="block text-sm font-semibold text-ink">{link.label}</span>
                  {link.note && <span className="block text-xs text-ink-soft">{link.note}</span>}
                </span>
                <span className="text-brand-400 transition group-hover:translate-x-0.5">↗</span>
              </a>
            ))}
          </div>
        </div>
      ))}

      <div className="card">
        <h3 className="mb-3 flex items-center gap-2 font-display font-bold text-ink">
          <span className="icon-chip bg-brand-50">✉️</span>
          聯絡承辦單位
        </h3>
        <div className="flex flex-col gap-2 text-sm">
          <a href={`mailto:${CONTACT.email}`} className="flex items-center gap-3 rounded-2xl bg-brand-50/60 px-4 py-2.5">
            <span className="text-lg">📧</span>
            <span className="text-ink">{CONTACT.email}</span>
          </a>
          <a href={`tel:${CONTACT.phone.replace(/-/g, '')}`} className="flex items-center gap-3 rounded-2xl bg-brand-50/60 px-4 py-2.5">
            <span className="text-lg">☎️</span>
            <span className="text-ink">{CONTACT.phone}</span>
          </a>
          <a
            href={CONTACT.site}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-2xl bg-brand-50/60 px-4 py-2.5"
          >
            <span className="text-lg">🌐</span>
            <span className="text-ink">tpmso.org/ibo</span>
          </a>
        </div>
      </div>

      <p className="text-center text-xs text-ink-faint">
        以上連結導向官方網站，內容以官方公告為準。
      </p>
    </div>
  );
}
