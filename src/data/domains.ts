import type { DomainId, DomainMeta } from '../types';

/**
 * The seven IBO theory domains with their official approximate weightings
 * (used by the international Biology Olympiad theory exams) and the colours
 * used throughout the charts/UI.
 */
export const DOMAINS: DomainMeta[] = [
  {
    id: 'cell',
    name: '細胞生物學',
    enName: 'Cell Biology',
    weight: 0.2,
    color: '#5aa9a0',
    emoji: '🔬',
    description: '細胞結構、膜運輸、代謝、酶動力學、訊息傳遞、細胞週期與分子生物學基礎。',
  },
  {
    id: 'plant',
    name: '植物解剖與生理',
    enName: 'Plant Anatomy & Physiology',
    weight: 0.15,
    color: '#7fb069',
    emoji: '🌿',
    description: '維管束組織、光合作用、蒸散作用、植物激素、開花與生殖。',
  },
  {
    id: 'animal',
    name: '動物解剖與生理',
    enName: 'Animal Anatomy & Physiology',
    weight: 0.25,
    color: '#5ca5b5',
    emoji: '🐾',
    description: '神經、循環、呼吸、消化、內分泌、免疫、排泄與恆定。',
  },
  {
    id: 'ethology',
    name: '動物行為',
    enName: 'Ethology',
    weight: 0.05,
    color: '#e0a458',
    emoji: '🦋',
    description: '本能與學習行為、訊號溝通、性擇、利他行為與社會生物學。',
  },
  {
    id: 'genetics',
    name: '遺傳與演化',
    enName: 'Genetics & Evolution',
    weight: 0.2,
    color: '#a58fc4',
    emoji: '🧬',
    description: '孟德爾遺傳、連鎖與重組、族群遺傳、突變、天擇與物種形成。',
  },
  {
    id: 'ecology',
    name: '生態學',
    enName: 'Ecology',
    weight: 0.1,
    color: '#6cc0a8',
    emoji: '🌍',
    description: '族群動態、群落、能量流、營養循環、生態系與生物多樣性。',
  },
  {
    id: 'systematics',
    name: '生物系統分類',
    enName: 'Biosystematics',
    weight: 0.05,
    color: '#d98a9e',
    emoji: '🌳',
    description: '三域系統、親緣關係樹、主要分類群特徵與演化關係。',
  },
];

export const DOMAIN_MAP: Record<DomainId, DomainMeta> = DOMAINS.reduce(
  (acc, d) => {
    acc[d.id] = d;
    return acc;
  },
  {} as Record<DomainId, DomainMeta>,
);

export function domainName(id: DomainId): string {
  return DOMAIN_MAP[id]?.name ?? id;
}

export function domainColor(id: DomainId): string {
  return DOMAIN_MAP[id]?.color ?? '#64748b';
}
