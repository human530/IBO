import { useEffect, useRef, useState } from 'react';

interface Props {
  /** Stable key so the canvas resets between questions. */
  questionId: string;
  /** Existing saved drawing (data-URL) to restore. */
  initial?: string;
  /** Called whenever strokes change, with the latest PNG data-URL. */
  onChange: (dataUrl: string) => void;
  disabled?: boolean;
}

/**
 * A finger/stylus drawing surface that mimics writing on a paper answer sheet
 * (平板寫考卷). Uses Pointer Events so it works with touch, pen and mouse.
 */
export default function HandwritingCanvas({ questionId, initial, onChange, disabled }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);
  const [hasInk, setHasInk] = useState(false);

  // (re)initialise the canvas when the question changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ratio = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * ratio;
    canvas.height = rect.height * ratio;
    const ctx = canvas.getContext('2d');
    if (!ctx) return; // environments without canvas support (e.g. jsdom)
    ctx.scale(ratio, ratio);
    ctx.fillStyle = '#fffafd';
    ctx.fillRect(0, 0, rect.width, rect.height);
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#e23080';
    setHasInk(false);
    if (initial) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, rect.width, rect.height);
        setHasInk(true);
      };
      img.src = initial;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionId]);

  function pos(e: React.PointerEvent) {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  function start(e: React.PointerEvent) {
    if (disabled) return;
    drawing.current = true;
    last.current = pos(e);
    (e.target as Element).setPointerCapture(e.pointerId);
  }

  function move(e: React.PointerEvent) {
    if (!drawing.current || disabled) return;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    const p = pos(e);
    ctx.beginPath();
    ctx.moveTo(last.current!.x, last.current!.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    last.current = p;
    if (!hasInk) setHasInk(true);
  }

  function end() {
    if (!drawing.current) return;
    drawing.current = false;
    last.current = null;
    const canvas = canvasRef.current;
    if (canvas) onChange(canvas.toDataURL('image/png'));
  }

  function clear() {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.fillStyle = '#fffafd';
    ctx.fillRect(0, 0, rect.width, rect.height);
    setHasInk(false);
    onChange('');
  }

  return (
    <div className="rounded-2xl border border-brand-100 bg-white p-3">
      <div className="mb-2 flex items-center justify-between text-xs text-ink-soft">
        <span>✍️ 手寫作答區（可用手指 / 觸控筆書寫）</span>
        <button
          type="button"
          onClick={clear}
          disabled={disabled || !hasInk}
          className="rounded-full bg-brand-50 px-3 py-1 font-semibold text-brand-500 disabled:opacity-40"
        >
          清除重寫
        </button>
      </div>
      <canvas
        ref={canvasRef}
        onPointerDown={start}
        onPointerMove={move}
        onPointerUp={end}
        onPointerLeave={end}
        className="h-44 w-full touch-none rounded-xl border border-brand-100"
        style={{ touchAction: 'none' }}
      />
      <p className="mt-2 text-[11px] text-ink-faint">
        手寫模式下請在上方寫出推理 / 答案，並於下方點選你的最終選項以套用官方計分。
      </p>
    </div>
  );
}
