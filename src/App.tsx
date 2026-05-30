import { lazy, Suspense } from 'react';
import { NavLink, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Mascot from './components/Mascot';

// Code-split heavier routes (charts, exam runner) so the first paint stays light.
const Exam = lazy(() => import('./pages/Exam'));
const Bank = lazy(() => import('./pages/Bank'));
const Trends = lazy(() => import('./pages/Trends'));
const Performance = lazy(() => import('./pages/Performance'));
const Resources = lazy(() => import('./pages/Resources'));
const Settings = lazy(() => import('./pages/Settings'));

interface NavItem {
  to: string;
  label: string;
  icon: string;
  tint: string;
  end?: boolean;
}

const NAV: NavItem[] = [
  { to: '/', label: '首頁', icon: '🏠', tint: '#ffe4f0', end: true },
  { to: '/exam', label: '模擬測驗', icon: '📝', tint: '#e8e2ff' },
  { to: '/bank', label: '題庫', icon: '📚', tint: '#dcfaef' },
  { to: '/trends', label: '趨勢分析', icon: '📈', tint: '#fff0d6' },
  { to: '/performance', label: '成績分析', icon: '🎯', tint: '#ffe1ec' },
  { to: '/resources', label: '官方資源', icon: '🔗', tint: '#dff0ff' },
  { to: '/settings', label: '設定', icon: '⚙️', tint: '#efe9f3' },
];

export default function App() {
  return (
    <div className="min-h-full flex flex-col md:flex-row">
      {/* Sidebar (desktop) */}
      <aside className="hidden md:flex md:w-64 md:flex-col border-r border-brand-100 bg-white/70 p-4 backdrop-blur-sm">
        <div className="flex items-center gap-3 px-2 pb-6 pt-2">
          <Mascot size={44} />
          <div>
            <div className="font-display text-lg font-bold leading-tight text-ink">生物奧林匹亞</div>
            <div className="text-xs text-ink-soft">模擬複習・邁向國手</div>
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
                    : 'text-ink hover:bg-brand-50'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className="icon-chip"
                    style={{ background: isActive ? 'rgba(255,255,255,0.25)' : n.tint }}
                  >
                    {n.icon}
                  </span>
                  {n.label}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Mobile header */}
      <header className="md:hidden sticky top-0 z-10 flex items-center gap-2 border-b border-brand-100 bg-white/85 px-4 py-3 backdrop-blur">
        <Mascot size={30} />
        <span className="font-display font-bold text-ink">生物奧林匹亞模擬複習</span>
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
              <Route path="/trends" element={<Trends />} />
              <Route path="/performance" element={<Performance />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </Suspense>
        </div>
      </main>

      {/* Bottom nav (mobile) */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-10 grid grid-cols-7 border-t border-brand-100 bg-white/90 backdrop-blur">
        {NAV.map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            end={n.end}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 py-2 text-[9px] font-medium ${
                isActive ? 'text-brand-500' : 'text-ink-soft'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className="flex h-7 w-7 items-center justify-center rounded-xl text-base"
                  style={{ background: isActive ? '#ffe4f0' : 'transparent' }}
                >
                  {n.icon}
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
