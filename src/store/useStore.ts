import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AttemptRecord, ExamSession } from '../types';

interface Settings {
  /** ISO date for the 初賽 (preliminary). */
  preliminaryDate: string;
  /** ISO date for the 複賽 (semifinal). */
  semifinalDate: string;
  masteryThreshold: number;
}

interface StoreState {
  sessions: ExamSession[];
  settings: Settings;
  addSession: (session: ExamSession) => void;
  recordAttempt: (sessionId: string, attempt: AttemptRecord) => void;
  completeSession: (sessionId: string) => void;
  deleteSession: (sessionId: string) => void;
  updateSettings: (patch: Partial<Settings>) => void;
  resetAll: () => void;
  /** flattened attempts across all sessions */
  allAttempts: () => AttemptRecord[];
}

const defaultSettings: Settings = {
  // 初賽：11 月入門選拔；複賽：隔年 2 月。可於設定調整。
  preliminaryDate: '2026-11-14T09:00:00',
  semifinalDate: '2027-02-07T09:00:00',
  masteryThreshold: 70,
};

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      sessions: [],
      settings: defaultSettings,
      addSession: (session) => set((s) => ({ sessions: [...s.sessions, session] })),
      recordAttempt: (sessionId, attempt) =>
        set((s) => ({
          sessions: s.sessions.map((sess) =>
            sess.id === sessionId
              ? {
                  ...sess,
                  attempts: [
                    ...sess.attempts.filter((a) => a.questionId !== attempt.questionId),
                    attempt,
                  ],
                }
              : sess,
          ),
        })),
      completeSession: (sessionId) =>
        set((s) => ({
          sessions: s.sessions.map((sess) =>
            sess.id === sessionId ? { ...sess, completedAt: Date.now() } : sess,
          ),
        })),
      deleteSession: (sessionId) =>
        set((s) => ({ sessions: s.sessions.filter((sess) => sess.id !== sessionId) })),
      updateSettings: (patch) => set((s) => ({ settings: { ...s.settings, ...patch } })),
      resetAll: () => set({ sessions: [], settings: defaultSettings }),
      allAttempts: () => get().sessions.flatMap((s) => s.attempts),
    }),
    { name: 'ibo-prep-store', version: 1 },
  ),
);
