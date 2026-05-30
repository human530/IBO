/**
 * A soft, hand-painted Ghibli-style backdrop: layered rolling hills under a
 * gentle haze. Purely decorative, fixed behind all content. (No clouds.)
 */
export default function Scenery() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {/* soft light haze */}
      <div
        className="absolute -right-16 top-10 h-56 w-56 rounded-full opacity-70 blur-3xl"
        style={{ background: 'radial-gradient(circle, #ffffff 0%, rgba(255,255,255,0) 70%)' }}
      />
      <div
        className="absolute -left-10 top-1/3 h-48 w-48 rounded-full opacity-50 blur-3xl"
        style={{ background: 'radial-gradient(circle, #e6f2fb 0%, rgba(230,242,251,0) 70%)' }}
      />

      {/* layered distant hills in soft blues */}
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
