import { Relic } from '@/types/game';

// 遗物池（32 个）
export const RELICS: Relic[] = [
  // ============= common (8) =============
  {
    id: 'greedy-heart',
    name: '贪婪之心',
    description: '商店价格 -20%',
    rarity: 'common',
    effects: [{ type: 'shop-discount', value: 0.2 }],
    icon: '💰',
  },
  {
    id: 'time-warp',
    name: '时间扭曲',
    description: '敌人移速 -15%',
    rarity: 'common',
    effects: [{ type: 'enemy-slow', value: 0.15 }],
    icon: '⏳',
  },
  {
    id: 'stardust-magnet',
    name: '星尘磁石',
    description: '星尘获取 +30%',
    rarity: 'common',
    effects: [{ type: 'stardust-boost', value: 0.3 }],
    icon: '🧲',
  },
  {
    id: 'orb-generator',
    name: '星核生成器',
    description: '每波开始获得 1 颗随机星核',
    rarity: 'common',
    effects: [{ type: 'extra-orb', value: 1 }],
    icon: '🔮',
  },
  {
    id: 'sharp-edge',
    name: '锋锐之刃',
    description: '所有星核伤害 +12%',
    rarity: 'common',
    effects: [{ type: 'damage-boost', value: 0.12 }],
    icon: '🔪',
  },
  {
    id: 'swift-cog',
    name: '迅捷齿轮',
    description: '所有星核攻速 +15%',
    rarity: 'common',
    effects: [{ type: 'atkspd-boost', value: 0.15 }],
    icon: '⚙️',
  },
  {
    id: 'lucky-charm',
    name: '幸运符',
    description: '暴击率 +8%',
    rarity: 'common',
    effects: [{ type: 'crit-boost', value: 0.08 }],
    icon: '🍀',
  },
  {
    id: 'small-shield',
    name: '微型护盾',
    description: '免疫 1 次扣血',
    rarity: 'common',
    effects: [{ type: 'shield', value: 1 }],
    icon: '🛡️',
  },

  // ============= rare (12) =============
  {
    id: 'resonance-crystal',
    name: '共振水晶',
    description: '共鸣效果翻倍',
    rarity: 'rare',
    effects: [{ type: 'synergy-boost', value: 2 }],
    icon: '💠',
  },
  {
    id: 'catalyst',
    name: '进化催化剂',
    description: '进化后星核攻速 +25%',
    rarity: 'rare',
    effects: [{ type: 'evolution-reroll', value: 1 }],
    icon: '⚗️',
  },
  {
    id: 'orb-splitter',
    name: '星核分裂器',
    description: '每次融合 20% 概率额外产出 1 颗',
    rarity: 'rare',
    effects: [{ type: 'orb-split', value: 0.2 }],
    icon: '✨',
  },
  {
    id: 'overload',
    name: '超载',
    description: '所有星核攻速 +25%',
    rarity: 'rare',
    effects: [{ type: 'atkspd-boost', value: 0.25 }],
    icon: '⚡',
  },
  {
    id: 'power-core',
    name: '力量核心',
    description: '所有星核伤害 +20%',
    rarity: 'rare',
    effects: [{ type: 'damage-boost', value: 0.2 }],
    icon: '🔋',
  },
  {
    id: 'regen-field',
    name: '再生力场',
    description: '每波结束回复 1 点生命',
    rarity: 'rare',
    effects: [{ type: 'hp-regen', value: 1 }],
    icon: '💚',
  },
  {
    id: 'critical-lens',
    name: '临界透镜',
    description: '所有星核暴击率 +15%',
    rarity: 'rare',
    effects: [{ type: 'crit-boost', value: 0.15 }],
    icon: '🎯',
  },
  {
    id: 'blood-pact',
    name: '血之契约',
    description: '伤害 +30%，但每波开始扣 1 HP',
    rarity: 'rare',
    effects: [{ type: 'damage-boost', value: 0.3 }],
    icon: '🩸',
  },
  {
    id: 'gold-rush',
    name: '淘金热',
    description: '击杀奖励 +50%',
    rarity: 'rare',
    effects: [{ type: 'stardust-boost', value: 0.5 }],
    icon: '🪙',
  },
  {
    id: 'quick-merge',
    name: '融合加速',
    description: '攻速 +20%，伤害 +10%',
    rarity: 'rare',
    effects: [
      { type: 'atkspd-boost', value: 0.2 },
      { type: 'damage-boost', value: 0.1 },
    ],
    icon: '🔄',
  },
  {
    id: 'arcane-tome',
    name: '奥术典籍',
    description: '星尘 +25%，暴击 +10%',
    rarity: 'rare',
    effects: [
      { type: 'stardust-boost', value: 0.25 },
      { type: 'crit-boost', value: 0.1 },
    ],
    icon: '📖',
  },
  {
    id: 'time-anchor',
    name: '时间锚',
    description: '敌人移速 -25%',
    rarity: 'rare',
    effects: [{ type: 'enemy-slow', value: 0.25 }],
    icon: '⚓',
  },

  // ============= epic (8) =============
  {
    id: 'energy-shield',
    name: '能量护盾',
    description: '免疫下一次扣血',
    rarity: 'epic',
    effects: [{ type: 'shield', value: 1 }],
    icon: '🔰',
  },
  {
    id: 'twin-core',
    name: '双生核心',
    description: '攻击伤害 +50%，但攻速 -20%',
    rarity: 'epic',
    effects: [
      { type: 'damage-boost', value: 0.5 },
      { type: 'atkspd-boost', value: -0.2 },
    ],
    icon: '♊',
  },
  {
    id: 'void-heart',
    name: '虚空之心',
    description: '伤害 +35%，星尘 +20%',
    rarity: 'epic',
    effects: [
      { type: 'damage-boost', value: 0.35 },
      { type: 'stardust-boost', value: 0.2 },
    ],
    icon: '🖤',
  },
  {
    id: 'berserker',
    name: '狂战士',
    description: '生命越低伤害越高（最高 +50%）',
    rarity: 'epic',
    effects: [{ type: 'damage-boost', value: 0.5 }],
    icon: '🔥',
  },
  {
    id: 'lucky-seven',
    name: '幸运七',
    description: '暴击伤害 +100%',
    rarity: 'epic',
    effects: [{ type: 'crit-boost', value: 0.5 }],
    icon: '7️⃣',
  },
  {
    id: 'frost-crown',
    name: '霜冻之冠',
    description: '敌人移速 -35%，星尘 +15%',
    rarity: 'epic',
    effects: [
      { type: 'enemy-slow', value: 0.35 },
      { type: 'stardust-boost', value: 0.15 },
    ],
    icon: '👑',
  },
  {
    id: 'overclock',
    name: '超频核心',
    description: '攻速 +40%，伤害 +15%',
    rarity: 'epic',
    effects: [
      { type: 'atkspd-boost', value: 0.4 },
      { type: 'damage-boost', value: 0.15 },
    ],
    icon: '📈',
  },
  {
    id: 'soul-harvest',
    name: '灵魂收割',
    description: '击杀获得 2 倍星尘，伤害 +15%',
    rarity: 'epic',
    effects: [
      { type: 'stardust-boost', value: 1.0 },
      { type: 'damage-boost', value: 0.15 },
    ],
    icon: '💀',
  },

  // ============= legendary (4) =============
  {
    id: 'genesis',
    name: '创世之核',
    description: '所有数值 +25%',
    rarity: 'legendary',
    effects: [
      { type: 'damage-boost', value: 0.25 },
      { type: 'atkspd-boost', value: 0.25 },
      { type: 'stardust-boost', value: 0.25 },
    ],
    icon: '🌟',
  },
  {
    id: 'phoenix-feather',
    name: '凤凰之羽',
    description: '死亡时复活，恢复 2 点生命',
    rarity: 'legendary',
    effects: [{ type: 'shield', value: 2 }],
    icon: '🪶',
  },
  {
    id: 'cosmic-eye',
    name: '宇宙之眼',
    description: '暴击 +30%，伤害 +30%，星尘 +30%',
    rarity: 'legendary',
    effects: [
      { type: 'crit-boost', value: 0.3 },
      { type: 'damage-boost', value: 0.3 },
      { type: 'stardust-boost', value: 0.3 },
    ],
    icon: '👁️',
  },
  {
    id: 'singularity',
    name: '奇点',
    description: '伤害 +60%，攻速 +30%，敌人移速 -30%',
    rarity: 'legendary',
    effects: [
      { type: 'damage-boost', value: 0.6 },
      { type: 'atkspd-boost', value: 0.3 },
      { type: 'enemy-slow', value: 0.3 },
    ],
    icon: '🕳️',
  },
];

// 根据稀有度抽取遗物
export function rollRelics(count: number, wave: number, exclude: string[] = []): Relic[] {
  const pool = RELICS.filter(r => !exclude.includes(r.id));

  // 根据波次调整稀有度权重
  const weights: Record<string, number> = {
    common: Math.max(1, 5 - Math.floor(wave / 4)),
    rare: 3,
    epic: Math.min(3, 1 + Math.floor(wave / 6)),
    legendary: Math.min(2, Math.floor(wave / 10)),
  };

  const result: Relic[] = [];
  const used = new Set<string>();

  for (let i = 0; i < count && pool.length > 0; i++) {
    // 构建加权池
    const weighted: Relic[] = [];
    for (const r of pool) {
      if (used.has(r.id)) continue;
      const w = weights[r.rarity] || 1;
      for (let j = 0; j < w; j++) weighted.push(r);
    }
    if (weighted.length === 0) break;
    const pick = weighted[Math.floor(Math.random() * weighted.length)];
    used.add(pick.id);
    result.push(pick);
  }

  return result;
}
