import { lazy, Suspense } from 'react';
import { NavLink, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';

// Code-split heavier routes (charts, exam runner) so the first paint stays light.
const Exam = lazy(() => import('./pages/Exam'));
const Bank = lazy(() => import('./pages/Bank'));
const Trends = lazy(() => import('./pages/Trends'));
const Performance = lazy(() => import('./pages/Performance'));
const Settings = lazy(() => import('./pages/Settings'));

const NAV = [
  { to: '/', label: '首頁', icon: '🏠', end: true },
  { to: '/exam', label: '模擬測驗', icon: '📝' },
  { to: '/bank', label: '題庫', icon: '📚' },
  { to: '/trends', label: '趨勢分析', icon: '📈' },
  { to: '/performance', label: '成績分析', icon: '🎯' },
  { to: '/settings', label: '設定', icon: '⚙️' },
];

export default function App() {
  return (
    <div className="min-h-full flex flex-col md:flex-row">
      {/* Sidebar (desktop) */}
      <aside className="hidden md:flex md:w-60 md:flex-col border-r border-slate-800 bg-slate-900/60 p-4">
        <div className="flex items-center gap-2 px-2 pb-6">
          <span className="text-2xl">🧬</span>
          <div>
            <div className="font-bold leading-tight">生物奧林匹亞</div>
            <div className="text-xs text-slate-400">模擬複習系統</div>
          </div>
        </div>
        <nav className="flex flex-col gap-1">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                  isActive ? 'bg-brand-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                }`
              }
            >
              <span>{n.icon}</span>
              {n.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Mobile header */}
      <header className="md:hidden sticky top-0 z-10 flex items-center gap-2 border-b border-slate-800 bg-slate-900/90 px-4 py-3 backdrop-blur">
        <span className="text-xl">🧬</span>
        <span className="font-bold">生物奧林匹亞模擬複習</span>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-x-hidden pb-24 md:pb-8">
        <div className="mx-auto max-w-5xl px-4 py-6 md:px-8">
          <Suspense
            fallback={
              <div className="flex items-center justify-center py-20 text-slate-400">
                載入中…
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/exam" element={<Exam />} />
              <Route path="/bank" element={<Bank />} />
              <Route path="/trends" element={<Trends />} />
              <Route path="/performance" element={<Performance />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </Suspense>
        </div>
      </main>

      {/* Bottom nav (mobile) */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-10 grid grid-cols-6 border-t border-slate-800 bg-slate-900/95 backdrop-blur">
        {NAV.map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            end={n.end}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 py-2 text-[10px] ${
                isActive ? 'text-brand-400' : 'text-slate-400'
              }`
            }
          >
            <span className="text-lg">{n.icon}</span>
            {n.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
