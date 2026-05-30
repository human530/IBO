/**
 * A soft, hand-drawn Ghibli-style backdrop: a few fluffy clouds drifting over
 * layered rolling hills. Purely decorative, fixed behind all content.
 */
export default function Scenery() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {/* soft sun haze */}
      <div
        className="absolute -right-16 top-10 h-56 w-56 rounded-full opacity-70 blur-2xl"
        style={{ background: 'radial-gradient(circle, #ffffff 0%, rgba(255,255,255,0) 70%)' }}
      />

      {/* clouds */}
      <svg className="absolute left-[6%] top-[8%] w-44 opacity-80 animate-[drift_60s_linear_infinite]" viewBox="0 0 120 50">
        <g fill="#ffffff">
          <ellipse cx="40" cy="32" rx="34" ry="16" />
          <ellipse cx="66" cy="26" rx="26" ry="18" />
          <ellipse cx="86" cy="34" rx="22" ry="13" />
          <ellipse cx="22" cy="36" rx="18" ry="11" />
        </g>
      </svg>
      <svg className="absolute right-[10%] top-[20%] w-32 opacity-70" viewBox="0 0 120 50">
        <g fill="#ffffff">
          <ellipse cx="44" cy="30" rx="30" ry="15" />
          <ellipse cx="70" cy="26" rx="22" ry="15" />
          <ellipse cx="24" cy="34" rx="16" ry="10" />
        </g>
      </svg>

      {/* layered distant hills / cloud sea in soft blues */}
      <svg
        className="absolute bottom-0 left-0 w-full"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        style={{ height: '38vh' }}
      >
        <path
          d="M0 220 C 240 160 360 260 600 230 C 840 200 960 280 1200 240 C 1320 220 1400 250 1440 240 L1440 320 L0 320 Z"
          fill="#cfe6f6"
          opacity="0.7"
        />
        <path
          d="M0 270 C 260 220 420 300 720 270 C 1020 240 1160 300 1440 280 L1440 320 L0 320 Z"
          fill="#aed3ef"
          opacity="0.75"
        />
        <path
          d="M0 300 C 300 270 540 320 900 300 C 1140 288 1300 312 1440 305 L1440 320 L0 320 Z"
          fill="#ffffff"
          opacity="0.85"
        />
      </svg>
    </div>
  );
}
