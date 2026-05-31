/** A cute Q-version bacteriophage (噬菌體) mascot used in headers. */
export default function Mascot({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-label="Q版噬菌體吉祥物">
      <defs>
        <linearGradient id="phageHead" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a9bd82" />
          <stop offset="1" stopColor="#7aa35a" />
        </linearGradient>
      </defs>
      {/* legs / tail fibres */}
      <g stroke="#3a2f28" strokeWidth="2.4" strokeLinecap="round" fill="none">
        <path d="M26 50c-4 3-6 5-9 5" />
        <path d="M30 52c-2 4-3 6-3 8" />
        <path d="M34 52c2 4 3 6 3 8" />
        <path d="M38 50c4 3 6 5 9 5" />
      </g>
      {/* baseplate */}
      <rect x="26" y="46" width="12" height="4" rx="2" fill="#586f39" stroke="#3a2f28" strokeWidth="2" />
      {/* tail sheath (with rings) */}
      <rect x="29" y="32" width="6" height="15" rx="2" fill="#c9d4ac" stroke="#3a2f28" strokeWidth="2" />
      <line x1="29" y1="37" x2="35" y2="37" stroke="#3a2f28" strokeWidth="1.3" />
      <line x1="29" y1="41" x2="35" y2="41" stroke="#3a2f28" strokeWidth="1.3" />
      {/* icosahedral head (hexagon) */}
      <path
        d="M32 8 L47 17 L47 30 L32 39 L17 30 L17 17 Z"
        fill="url(#phageHead)"
        stroke="#3a2f28"
        strokeWidth="2.6"
        strokeLinejoin="round"
      />
      {/* head facet lines */}
      <g stroke="#3a2f28" strokeWidth="1" opacity="0.35" fill="none">
        <path d="M32 8 L32 39 M17 17 L47 30 M47 17 L17 30" />
      </g>
      {/* cute face */}
      <circle cx="27" cy="22" r="2.2" fill="#3a2f28" />
      <circle cx="37" cy="22" r="2.2" fill="#3a2f28" />
      <circle cx="27.8" cy="21.3" r="0.7" fill="#fff" />
      <circle cx="37.8" cy="21.3" r="0.7" fill="#fff" />
      <path d="M28 28c2 2.2 6 2.2 8 0" stroke="#3a2f28" strokeWidth="2" fill="none" strokeLinecap="round" />
      <circle cx="24" cy="26" r="1.8" fill="#d98f6e" opacity="0.6" />
      <circle cx="40" cy="26" r="1.8" fill="#d98f6e" opacity="0.6" />
    </svg>
  );
}
