import type { DomainId } from '../types';
import { DOMAIN_MAP } from '../data/domains';
import DoodleIcon, { type DoodleName } from './DoodleIcon';

/** Hand-drawn doodle icon for a domain, in the domain's colour. */
export function DomainIcon({ domain, size = 18 }: { domain: DomainId; size?: number }) {
  return <DoodleIcon name={domain as DoodleName} size={size} className="shrink-0" />;
}

export default function DomainBadge({ domain }: { domain: DomainId }) {
  const meta = DOMAIN_MAP[domain];
  return (
    <span className="pill gap-1" style={{ backgroundColor: `${meta.color}26`, color: meta.color }}>
      <DomainIcon domain={domain} size={14} />
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
          className={`h-1.5 w-1.5 rounded-full border border-line/50 ${
            i <= level ? 'bg-brand-400' : 'bg-transparent'
          }`}
        />
      ))}
    </span>
  );
}
