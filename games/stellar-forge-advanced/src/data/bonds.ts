import { ElementType } from '@/types/game';

// ============= 星核羁绊系统（缝合自走棋玩法）=============
// 场上同元素星核达到阈值数量即激活羁绊 buff，激励玩家布局元素组合

export type BondEffectType =
  | 'atkspd-boost'    // 攻速加成
  | 'slow-boost'      // 减速效果增强
  | 'damage-boost'    // 伤害加成
  | 'range-boost'     // 射程加成（格子数）
  | 'crit-boost';     // 暴击率加成

export interface BondTier {
  count: number;            // 激活所需星核数量
  name: string;             // 该阶名称
  description: string;     // 该阶描述
  effect: BondEffectType;
  value: number;            // 效果数值（boost 比例 / 加成）
}

export interface Bond {
  id: string;               // 元素 id 或 'diversity'
  name: string;             // 羁绊名称
  icon: string;
  color: string;
  // 多元羁绊：根据场上不同元素种类数激活
  // 元素羁绊：根据场上同元素星核数激活
  kind: 'element' | 'diversity';
  tiers: [BondTier, BondTier];  // 2 阶
}

export const BONDS: Bond[] = [
  {
    id: 'fire',
    name: '焚天',
    icon: '🔥',
    color: '#FF6B6B',
    kind: 'element',
    tiers: [
      { count: 2, name: '初燃', description: '火系攻速 +15%', effect: 'atkspd-boost', value: 0.15 },
      { count: 4, name: '烈焰', description: '火系攻速 +35%', effect: 'atkspd-boost', value: 0.35 },
    ],
  },
  {
    id: 'water',
    name: '凝霜',
    icon: '💧',
    color: '#4ECDC4',
    kind: 'element',
    tiers: [
      { count: 2, name: '初霜', description: '水系减速效果 +20%', effect: 'slow-boost', value: 0.20 },
      { count: 4, name: '冰封', description: '水系减速效果 +50%', effect: 'slow-boost', value: 0.50 },
    ],
  },
  {
    id: 'earth',
    name: '厚土',
    icon: '🪨',
    color: '#C9A26B',
    kind: 'element',
    tiers: [
      { count: 2, name: '初岩', description: '土系伤害 +15%', effect: 'damage-boost', value: 0.15 },
      { count: 4, name: '山岳', description: '土系伤害 +40%', effect: 'damage-boost', value: 0.40 },
    ],
  },
  {
    id: 'air',
    name: '疾风',
    icon: '🌀',
    color: '#95E1D3',
    kind: 'element',
    tiers: [
      { count: 2, name: '微风', description: '风系射程 +1 格', effect: 'range-boost', value: 1 },
      { count: 4, name: '飓风', description: '风系射程 +2 格', effect: 'range-boost', value: 2 },
    ],
  },
  {
    id: 'lightning',
    name: '雷云',
    icon: '⚡',
    color: '#FFE66D',
    kind: 'element',
    tiers: [
      { count: 2, name: '静电', description: '雷系暴击 +10%', effect: 'crit-boost', value: 0.10 },
      { count: 4, name: '雷暴', description: '雷系暴击 +25%', effect: 'crit-boost', value: 0.25 },
    ],
  },
  {
    id: 'diversity',
    name: '多元',
    icon: '🌈',
    color: '#FFD166',
    kind: 'diversity',
    tiers: [
      { count: 3, name: '三色', description: '全场伤害 +10%（3 种元素在场）', effect: 'damage-boost', value: 0.10 },
      { count: 5, name: '五彩', description: '全场伤害 +30%（5 种元素在场）', effect: 'damage-boost', value: 0.30 },
    ],
  },
];

export const BONDS_BY_ID: Record<string, Bond> = Object.fromEntries(BONDS.map(b => [b.id, b]));

// 激活状态的羁绊（运行时存储在 GameState.activeBonds）
export interface ActiveBond {
  bondId: string;       // 对应 Bond.id
  tierIndex: number;    // 0 或 1（对应 tiers[0]/tiers[1]）
}

// 从网格统计每种元素星核数量
export function countOrbsByElement(grid: (import('@/types/game').Orb | null)[][]): Record<ElementType, number> {
  const counts: Record<ElementType, number> = { fire: 0, water: 0, earth: 0, air: 0, lightning: 0 };
  for (const row of grid) {
    for (const cell of row) {
      if (cell) {
        counts[cell.element] = (counts[cell.element] || 0) + 1;
      }
    }
  }
  return counts;
}

// 计算场上不同元素种类数
export function countDistinctElements(counts: Record<ElementType, number>): number {
  return (Object.values(counts) as number[]).filter(n => n > 0).length;
}

// 根据网格状态计算当前激活的羁绊列表
export function computeActiveBonds(grid: (import('@/types/game').Orb | null)[][]): ActiveBond[] {
  const result: ActiveBond[] = [];
  const counts = countOrbsByElement(grid);
  const distinctCount = countDistinctElements(counts);

  for (const bond of BONDS) {
    let currentCount: number;
    if (bond.kind === 'diversity') {
      currentCount = distinctCount;
    } else {
      currentCount = counts[bond.id as ElementType] || 0;
    }
    // 判断激活到哪一阶（取最高阶）
    let activatedTier = -1;
    for (let i = 0; i < bond.tiers.length; i++) {
      if (currentCount >= bond.tiers[i].count) activatedTier = i;
    }
    if (activatedTier >= 0) {
      result.push({ bondId: bond.id, tierIndex: activatedTier });
    }
  }
  return result;
}

// 全场羁绊效果总值（仅累加"多元"等全场羁绊，作用于所有星核）
export function getGlobalBondEffect(activeBonds: ActiveBond[], effectType: BondEffectType): number {
  let sum = 0;
  for (const ab of activeBonds) {
    const bond = BONDS_BY_ID[ab.bondId];
    if (!bond || bond.kind !== 'diversity') continue;
    const tier = bond.tiers[ab.tierIndex];
    if (tier.effect === effectType) sum += tier.value;
  }
  return sum;
}

// 元素特定羁绊效果（仅作用于该元素星核，如火系攻速）
// 返回该元素羁绊当前激活阶的效果值（未激活返回 0）
export function getElementBondEffect(
  activeBonds: ActiveBond[],
  element: ElementType,
  effectType: BondEffectType
): number {
  const bond = BONDS.find(b => b.id === element && b.kind === 'element');
  if (!bond) return 0;
  const ab = activeBonds.find(a => a.bondId === element);
  if (!ab) return 0;
  const tier = bond.tiers[ab.tierIndex];
  return tier.effect === effectType ? tier.value : 0;
}
