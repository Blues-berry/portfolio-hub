// 符文系统 - 融合 ARPG 词缀机制
// 符文是持久化收集物，每局可装备 3 个提供被动效果
import { RelicRarity } from '@/types/game';

// ============= 类型定义 =============
export type RuneEffectType =
  | 'damage-boost'      // 全局伤害加成
  | 'crit-boost'         // 暴击率加成
  | 'crit-damage'        // 暴击伤害加成
  | 'armor-pierce'       // 护甲穿透
  | 'atkspd-boost'       // 攻速加成
  | 'fire-damage'        // 火元素伤害加成
  | 'water-damage'       // 水元素伤害加成
  | 'earth-damage'       // 土元素伤害加成
  | 'air-damage'         // 风元素伤害加成
  | 'lightning-damage'   // 雷元素伤害加成
  | 'lifesteal'          // 击杀回血（value = 概率）
  | 'energy-leech'       // 击杀额外能量
  | 'range-boost';       // 攻击范围加成

export interface RuneEffect {
  type: RuneEffectType;
  value: number;
}

export interface RuneDef {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: RelicRarity;
  color: string;
  effects: RuneEffect[];
}

// ============= 符文稀有度颜色 =============
export const RUNE_RARITY_COLOR: Record<RelicRarity, string> = {
  common: '#9CA3AF',
  rare: '#4ECDC4',
  epic: '#C9A26B',
  legendary: '#FFD166',
};

// ============= 12 个符文配置 =============
export const RUNES: RuneDef[] = [
  // ============= 攻击类 (5) =============
  {
    id: 'sharp-edge',
    name: 'Sharp Blade',
    description: 'All star core damage +12%',
    icon: '⚔️',
    rarity: 'common',
    color: '#9CA3AF',
    effects: [{ type: 'damage-boost', value: 0.12 }],
  },
  {
    id: 'lethal-strike',
    name: 'Critical Blow',
    description: 'Critical hit rate +10%',
    icon: '🎯',
    rarity: 'rare',
    color: '#4ECDC4',
    effects: [{ type: 'crit-boost', value: 0.10 }],
  },
  {
    id: 'fury',
    name: 'Rage',
    description: 'Critical damage +60% (base 200% → 260%)',
    icon: '💢',
    rarity: 'epic',
    color: '#C9A26B',
    effects: [{ type: 'crit-damage', value: 0.6 }],
  },
  {
    id: 'armor-pierce',
    name: 'Penetrate',
    description: 'Ignores 25% enemy armor',
    icon: '🗡️',
    rarity: 'rare',
    color: '#4ECDC4',
    effects: [{ type: 'armor-pierce', value: 0.25 }],
  },
  {
    id: 'haste',
    name: 'Rapid',
    description: 'All star core attack speed +18%',
    icon: '⚡',
    rarity: 'rare',
    color: '#4ECDC4',
    effects: [{ type: 'atkspd-boost', value: 0.18 }],
  },

  // ============= 元素类 (4) =============
  {
    id: 'ember-core',
    name: 'Heart of Fire',
    description: 'Fire elemental damage +30%',
    icon: '🔥',
    rarity: 'rare',
    color: '#FF6B6B',
    effects: [{ type: 'fire-damage', value: 0.30 }],
  },
  {
    id: 'frostbite',
    name: 'Frost',
    description: 'Water element damage +30%',
    icon: '❄️',
    rarity: 'rare',
    color: '#4ECDC4',
    effects: [{ type: 'water-damage', value: 0.30 }],
  },
  {
    id: 'mountain-heart',
    name: 'Heart of Rock',
    description: 'Earth elemental damage +30%',
    icon: '⛰️',
    rarity: 'rare',
    color: '#C9A26B',
    effects: [{ type: 'earth-damage', value: 0.30 }],
  },
  {
    id: 'thunderstruck',
    name: 'Thunder',
    description: 'Thunder element damage +35%',
    icon: '🌩️',
    rarity: 'epic',
    color: '#FFE66D',
    effects: [{ type: 'lightning-damage', value: 0.35 }],
  },

  // ============= 特殊类 (3) =============
  {
    id: 'vampiric',
    name: 'Vampire',
    description: 'Killing an enemy has an 8% chance of restoring 1 life',
    icon: '🩸',
    rarity: 'epic',
    color: '#C9A26B',
    effects: [{ type: 'lifesteal', value: 0.08 }],
  },
  {
    id: 'energy-siphon',
    name: 'Energy Siphon',
    description: 'Gain 2 extra energy per kill',
    icon: '🔮',
    rarity: 'rare',
    color: '#4ECDC4',
    effects: [{ type: 'energy-leech', value: 2 }],
  },
  {
    id: 'divine',
    name: 'HOLY',
    description: 'Damage +15% / Critical hit rate +5% / Attack speed +10% (Almighty)',
    icon: '✨',
    rarity: 'legendary',
    color: '#FFD166',
    effects: [
      { type: 'damage-boost', value: 0.15 },
      { type: 'crit-boost', value: 0.05 },
      { type: 'atkspd-boost', value: 0.10 },
    ],
  },
];

// 通过 ID 查找
export const RUNES_BY_ID: Record<string, RuneDef> = Object.fromEntries(
  RUNES.map(r => [r.id, r])
);

// 根据稀有度获取掉落权重
export const DROP_WEIGHTS: Record<RelicRarity, number> = {
  common: 50,
  rare: 30,
  epic: 15,
  legendary: 5,
};

// 随机掉落一个符文（按稀有度权重）
export function rollRune(): RuneDef {
  // 按权重选择稀有度
  const rarityPool: RelicRarity[] = [];
  (Object.keys(DROP_WEIGHTS) as RelicRarity[]).forEach(rarity => {
    const weight = DROP_WEIGHTS[rarity];
    for (let i = 0; i < weight; i++) rarityPool.push(rarity);
  });
  const targetRarity = rarityPool[Math.floor(Math.random() * rarityPool.length)];
  // 在该稀有度中随机选一个
  const candidates = RUNES.filter(r => r.rarity === targetRarity);
  if (candidates.length === 0) return RUNES[0];
  return candidates[Math.floor(Math.random() * candidates.length)];
}

// 装备槽位上限
export const MAX_EQUIPPED_RUNES = 3;

// 背包上限
export const RUNE_BAG_LIMIT = 30;
