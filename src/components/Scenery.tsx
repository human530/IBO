/**
 * A playful children's-drawing backdrop: a smiling sun and simple rolling
 * hills with crayon outlines, in soft pastels. Decorative, fixed behind all
 * content.
 */
const LINE = '#6b5570';

export default function Scenery() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {/* smiling sun */}
      <svg className="absolute right-6 top-6 h-24 w-24 opacity-80" viewBox="0 0 100 100">
        <g stroke={LINE} strokeWidth="3" strokeLinecap="round">
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i * Math.PI) / 6;
            return (
              <line
                key={i}
                x1={50 + Math.cos(a) * 34}
                y1={50 + Math.sin(a) * 34}
                x2={50 + Math.cos(a) * 44}
                y2={50 + Math.sin(a) * 44}
              />
            );
          })}
          <circle cx="50" cy="50" r="28" fill="#ffe08a" />
          <circle cx="42" cy="46" r="2.6" fill={LINE} stroke="none" />
          <circle cx="58" cy="46" r="2.6" fill={LINE} stroke="none" />
          <path d="M41 56c4 5 14 5 18 0" fill="none" />
        </g>
      </svg>

      {/* little flower bottom-left */}
      <svg className="absolute bottom-[26vh] left-6 h-16 w-16 opacity-70" viewBox="0 0 60 60">
        <g stroke={LINE} strokeWidth="2.5">
          <line x1="30" y1="58" x2="30" y2="34" />
          {Array.from({ length: 6 }).map((_, i) => {
            const a = (i * Math.PI) / 3;
            return (
              <ellipse key={i} cx={30 + Math.cos(a) * 9} cy={26 + Math.sin(a) * 9} rx="6" ry="6" fill="#ffb3d6" />
            );
          })}
          <circle cx="30" cy="26" r="5" fill="#ffe08a" />
        </g>
      </svg>

      {/* rolling hills with outline */}
      <svg
        className="absolute bottom-0 left-0 w-full"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        style={{ height: '34vh' }}
      >
        <path d="M0 250 C 280 180 460 290 760 250 C 1040 214 1200 286 1440 250 L1440 320 L0 320 Z" fill="#ffd9ec" opacity="0.7" />
        <path d="M0 290 C 300 250 520 320 880 296 C 1120 282 1300 312 1440 300 L1440 320 L0 320 Z" fill="#c9f3df" opacity="0.8" />
      </svg>
    </div>
  );
}
