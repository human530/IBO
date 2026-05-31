import { lazy, Suspense } from 'react';
import { NavLink, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Mascot from './components/Mascot';
import DoodleIcon, { type DoodleName } from './components/DoodleIcon';

// Code-split heavier routes (charts, exam runner) so the first paint stays light.
const Exam = lazy(() => import('./pages/Exam'));
const Bank = lazy(() => import('./pages/Bank'));
const Notes = lazy(() => import('./pages/Notes'));
const Books = lazy(() => import('./pages/Books'));
const Formulas = lazy(() => import('./pages/Formulas'));
const Camp = lazy(() => import('./pages/Camp'));
const Trends = lazy(() => import('./pages/Trends'));
const Performance = lazy(() => import('./pages/Performance'));
const Strategy = lazy(() => import('./pages/Strategy'));
const Resources = lazy(() => import('./pages/Resources'));
const Settings = lazy(() => import('./pages/Settings'));

interface NavItem {
  to: string;
  label: string;
  icon: DoodleName;
  tint: string;
  end?: boolean;
}

const NAV: NavItem[] = [
  { to: '/', label: '首頁', icon: 'home', tint: '#e7dcbd', end: true },
  { to: '/exam', label: '模擬測驗', icon: 'exam', tint: '#e3d7b6' },
  { to: '/bank', label: '題庫', icon: 'book', tint: '#dfe6c9' },
  { to: '/notes', label: '複習筆記', icon: 'notes', tint: '#e8ddbf' },
  { to: '/books', label: '教材書庫', icon: 'shelf', tint: '#e3e6cf' },
  { to: '/formulas', label: '公式速查', icon: 'formula', tint: '#e7dcc0' },
  { to: '/camp', label: '選拔營特訓', icon: 'camp', tint: '#ecd2bc' },
  { to: '/trends', label: '趨勢分析', icon: 'trends', tint: '#ecdcb4' },
  { to: '/performance', label: '成績分析', icon: 'target', tint: '#ecd6c0' },
  { to: '/strategy', label: '成功心法', icon: 'medal', tint: '#ecdcb0' },
  { to: '/resources', label: '官方資源', icon: 'link', tint: '#dde6d2' },
  { to: '/settings', label: '設定', icon: 'gear', tint: '#e3dcc8' },
];

export default function App() {
  return (
    <div className="min-h-full flex flex-col md:flex-row">
      {/* Sidebar (desktop) */}
      <aside className="hidden md:flex md:w-64 md:flex-col border-r border-ink/10 bg-cream/70 p-4 backdrop-blur-sm">
        <div className="flex items-center gap-3 px-2 pb-6 pt-2">
          <Mascot size={44} />
          <div>
            <div className="font-display text-lg font-bold leading-tight text-ink">闖進IBO大作戰</div>
            <div className="text-xs text-ink-soft">生物奧林匹亞・邁向國手</div>
          </div>
        </div>
        <nav className="flex flex-col gap-1.5">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? 'bg-gradient-to-r from-brand-400 to-brand-500 text-white shadow-cute'
                    : 'text-ink hover:bg-brand-100/60'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className="icon-chip text-ink"
                    style={{ background: isActive ? 'rgba(255,255,255,0.4)' : n.tint }}
                  >
                    <DoodleIcon name={n.icon} size={18} />
                  </span>
                  {n.label}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Mobile header */}
      <header className="md:hidden sticky top-0 z-10 flex items-center gap-2 border-b border-ink/10 bg-cream/85 px-4 py-3 backdrop-blur">
        <Mascot size={30} />
        <span className="font-display font-bold text-ink">闖進IBO大作戰</span>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-x-hidden pb-28 md:pb-10">
        <div className="mx-auto max-w-5xl px-4 py-6 md:px-8">
          <Suspense
            fallback={
              <div className="flex items-center justify-center py-20 text-ink-soft">載入中… 🧫</div>
            }
          >
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/exam" element={<Exam />} />
              <Route path="/bank" element={<Bank />} />
              <Route path="/notes" element={<Notes />} />
              <Route path="/books" element={<Books />} />
              <Route path="/formulas" element={<Formulas />} />
              <Route path="/camp" element={<Camp />} />
              <Route path="/trends" element={<Trends />} />
              <Route path="/performance" element={<Performance />} />
              <Route path="/strategy" element={<Strategy />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </Suspense>
        </div>
      </main>

      {/* Bottom nav (mobile) — horizontally scrollable */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-10 flex overflow-x-auto border-t border-ink/10 bg-cream/90 backdrop-blur [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {NAV.map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            end={n.end}
            className={({ isActive }) =>
              `flex w-[19%] shrink-0 flex-col items-center gap-0.5 py-2 text-[9px] font-medium ${
                isActive ? 'text-brand-500' : 'text-ink-soft'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className="flex h-7 w-7 items-center justify-center rounded-lg border-2 border-line/40 text-ink"
                  style={{ background: isActive ? '#e7dcbd' : 'transparent' }}
                >
                  <DoodleIcon name={n.icon} size={15} />
                </span>
                {n.label}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
