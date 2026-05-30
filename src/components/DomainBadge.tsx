import type { DomainId } from '../types';
import { DOMAIN_MAP } from '../data/domains';

export default function DomainBadge({ domain }: { domain: DomainId }) {
  const meta = DOMAIN_MAP[domain];
  return (
    <span className="pill gap-1" style={{ backgroundColor: `${meta.color}22`, color: meta.color }}>
      <span>{meta.emoji}</span>
      {meta.name}
    </span>
  );
}

export function DifficultyDots({ level }: { level: number }) {
  return (
    <span className="inline-flex gap-0.5" title={`難度 ${level}/5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={`h-1.5 w-1.5 rounded-full ${i <= level ? 'bg-brand-400' : 'bg-brand-100'}`}
        />
      ))}
    </span>
  );
}
