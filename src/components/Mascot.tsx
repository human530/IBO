/** A cute pastel cell mascot used in headers. */
export default function Mascot({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-label="生物小細胞吉祥物">
      <defs>
        <linearGradient id="mascotBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#ffeef6" />
        </linearGradient>
      </defs>
      {/* wobbly cell membrane */}
      <path
        d="M32 6c9 0 16 4 19 11s2 16-3 23-10 11-16 11-15-3-20-11S7 25 12 18 23 6 32 6Z"
        fill="url(#mascotBody)"
        stroke="#fda4cf"
        strokeWidth="2.5"
      />
      {/* organelles */}
      <circle cx="22" cy="24" r="2.4" fill="#c4b5fd" />
      <circle cx="44" cy="22" r="2" fill="#7ef0c8" />
      <circle cx="46" cy="38" r="2.2" fill="#ffd97a" />
      <circle cx="20" cy="40" r="1.8" fill="#9cd4fb" />
      {/* nucleus */}
      <circle cx="32" cy="34" r="9" fill="#fecde3" />
      {/* face */}
      <circle cx="28.5" cy="33" r="1.8" fill="#5b4660" />
      <circle cx="35.5" cy="33" r="1.8" fill="#5b4660" />
      <path d="M28 38c2.2 2.6 6 2.6 8 0" stroke="#f4509b" strokeWidth="2" fill="none" strokeLinecap="round" />
      <circle cx="25.5" cy="36.5" r="2" fill="#fda4cf" opacity="0.7" />
      <circle cx="38.5" cy="36.5" r="2" fill="#fda4cf" opacity="0.7" />
    </svg>
  );
}
