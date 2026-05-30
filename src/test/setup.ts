import '@testing-library/jest-dom/vitest';

// jsdom lacks ResizeObserver, which Recharts' ResponsiveContainer relies on.
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver = globalThis.ResizeObserver ?? (ResizeObserverStub as never);
