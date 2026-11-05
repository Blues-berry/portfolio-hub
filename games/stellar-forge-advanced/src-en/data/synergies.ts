import { SynergyConfig, ElementType } from '@/types/game';

// 共鸣组合表（双向）
export const SYNERGIES: SynergyConfig[] = [
  {
    key: 'fire+water',
    elements: ['fire', 'water'],
    name: 'Steam Aura',
    description: 'Enemies around you continue to lose health',
    effect: 'aura-damage',
    value: 3,
    radius: 1,
  },
  {
    key: 'fire+earth',
    elements: ['fire', 'earth'],
    name: 'Lava Flow',
    description: 'The ground continues to burn',
    effect: 'ground-burn',
    value: 4,
    radius: 1,
  },
  {
    key: 'air+lightning',
    elements: ['air', 'lightning'],
    name: 'Thunderstorm',
    description: 'Chain damage doubled',
    effect: 'chain-double',
    value: 2,
    radius: 1,
  },
  {
    key: 'water+earth',
    elements: ['water', 'earth'],
    name: 'Swamp',
    description: 'Strong slowdown',
    effect: 'strong-slow',
    value: 0.5,
    radius: 1,
  },
  {
    key: 'air+fire',
    elements: ['air', 'fire'],
    name: 'Firestorm',
    description: 'Attack speed +50%',
    effect: 'atkspd-boost',
    value: 0.5,
    radius: 1,
  },
  {
    key: 'lightning+water',
    elements: ['lightning', 'water'],
    name: 'Electrolysis',
    description: 'Damage amplification +20%',
    effect: 'aura-damage',
    value: 5,
    radius: 1,
  },
];

// 获取共鸣键
export function synergyKey(a: ElementType, b: ElementType): string {
  return [a, b].sort().join('+');
}

// 查找共鸣
export function findSynergy(a: ElementType, b: ElementType): SynergyConfig | null {
  if (a === b) return null;
  const key = synergyKey(a, b);
  return SYNERGIES.find(s => s.key === key) || null;
}
