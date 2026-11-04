import { SynergyConfig, ElementType } from '@/types/game';

// 共鸣组合表（双向）
export const SYNERGIES: SynergyConfig[] = [
  {
    key: 'fire+water',
    elements: ['fire', 'water'],
    name: '蒸汽光环',
    description: '周围敌人持续掉血',
    effect: 'aura-damage',
    value: 3,
    radius: 1,
  },
  {
    key: 'fire+earth',
    elements: ['fire', 'earth'],
    name: '熔岩流',
    description: '地面持续灼烧',
    effect: 'ground-burn',
    value: 4,
    radius: 1,
  },
  {
    key: 'air+lightning',
    elements: ['air', 'lightning'],
    name: '雷暴',
    description: '连锁伤害翻倍',
    effect: 'chain-double',
    value: 2,
    radius: 1,
  },
  {
    key: 'water+earth',
    elements: ['water', 'earth'],
    name: '泥沼',
    description: '强力减速',
    effect: 'strong-slow',
    value: 0.5,
    radius: 1,
  },
  {
    key: 'air+fire',
    elements: ['air', 'fire'],
    name: '烈焰风暴',
    description: '攻速 +50%',
    effect: 'atkspd-boost',
    value: 0.5,
    radius: 1,
  },
  {
    key: 'lightning+water',
    elements: ['lightning', 'water'],
    name: '电解',
    description: '伤害加深 +20%',
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
