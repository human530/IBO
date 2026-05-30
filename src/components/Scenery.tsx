/**
 * A cozy hand-drawn survival/storybook backdrop: sketchy ink doodles of a sun,
 * a little tree and grass tufts on a parchment ground. Decorative, fixed
 * behind all content.
 */
const INK = '#3a2f28';

export default function Scenery() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {/* hand-drawn sun */}
      <svg className="absolute right-7 top-7 h-20 w-20 opacity-70" viewBox="0 0 100 100">
        <g stroke={INK} strokeWidth="2.5" strokeLinecap="round" fill="none">
          {Array.from({ length: 10 }).map((_, i) => {
            const a = (i * Math.PI) / 5;
            return (
              <line
                key={i}
                x1={50 + Math.cos(a) * 33}
                y1={50 + Math.sin(a) * 33}
                x2={50 + Math.cos(a) * 43}
                y2={50 + Math.sin(a) * 43}
              />
            );
          })}
          <circle cx="50" cy="50" r="26" fill="#e3c25a" />
        </g>
      </svg>

      {/* little tree bottom-left */}
      <svg className="absolute bottom-[20vh] left-7 h-24 w-24 opacity-70" viewBox="0 0 100 100">
        <g stroke={INK} strokeWidth="2.5">
          <rect x="44" y="60" width="12" height="28" rx="3" fill="#b08453" />
          <circle cx="50" cy="44" r="22" fill="#8aa35f" />
          <circle cx="34" cy="52" r="13" fill="#8aa35f" />
          <circle cx="66" cy="52" r="13" fill="#8aa35f" />
        </g>
      </svg>

      {/* parchment ground with grass tufts */}
      <svg
        className="absolute bottom-0 left-0 w-full"
        viewBox="0 0 1440 220"
        preserveAspectRatio="none"
        style={{ height: '26vh' }}
      >
        <path
          d="M0 120 C 280 80 520 150 820 120 C 1080 96 1260 140 1440 118 L1440 220 L0 220 Z"
          fill="#d9c79a"
          stroke="#3a2f28"
          strokeWidth="2"
        />
        <g stroke="#3a2f28" strokeWidth="2" strokeLinecap="round" opacity="0.5">
          {Array.from({ length: 22 }).map((_, i) => {
            const x = 40 + i * 64;
            const y = 150 + (i % 3) * 8;
            return (
              <g key={i}>
                <line x1={x} y1={y} x2={x - 5} y2={y - 12} />
                <line x1={x} y1={y} x2={x} y2={y - 15} />
                <line x1={x} y1={y} x2={x + 5} y2={y - 12} />
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
