import { Relic } from '@/types/game';

// 遗物池（32 个）
export const RELICS: Relic[] = [
  // ============= common (8) =============
  {
    id: 'greedy-heart',
    name: 'Greed',
    description: 'Store Price -20%',
    rarity: 'common',
    effects: [{ type: 'shop-discount', value: 0.2 }],
    icon: '💰',
  },
  {
    id: 'time-warp',
    name: 'Time Warp',
    description: 'Enemy movement speed -15%',
    rarity: 'common',
    effects: [{ type: 'enemy-slow', value: 0.15 }],
    icon: '⏳',
  },
  {
    id: 'stardust-magnet',
    name: 'Stardust Magnet',
    description: 'Stardust acquisition +30%',
    rarity: 'common',
    effects: [{ type: 'stardust-boost', value: 0.3 }],
    icon: '🧲',
  },
  {
    id: 'orb-generator',
    name: 'Star Core Generator',
    description: 'Get 1 random star core at the beginning of each wave',
    rarity: 'common',
    effects: [{ type: 'extra-orb', value: 1 }],
    icon: '🔮',
  },
  {
    id: 'sharp-edge',
    name: 'Sharp Blade',
    description: 'All star core damage +12%',
    rarity: 'common',
    effects: [{ type: 'damage-boost', value: 0.12 }],
    icon: '🔪',
  },
  {
    id: 'swift-cog',
    name: 'Swift Gear',
    description: 'All star core attack speed +15%',
    rarity: 'common',
    effects: [{ type: 'atkspd-boost', value: 0.15 }],
    icon: '⚙️',
  },
  {
    id: 'lucky-charm',
    name: 'Lucky Charm',
    description: 'Critical hit rate +8%',
    rarity: 'common',
    effects: [{ type: 'crit-boost', value: 0.08 }],
    icon: '🍀',
  },
  {
    id: 'small-shield',
    name: 'Microshield',
    description: 'Immunity 1 blood deduction',
    rarity: 'common',
    effects: [{ type: 'shield', value: 1 }],
    icon: '🛡️',
  },

  // ============= rare (12) =============
  {
    id: 'resonance-crystal',
    name: 'Resonance Crystal',
    description: 'The resonance effect is doubled',
    rarity: 'rare',
    effects: [{ type: 'synergy-boost', value: 2 }],
    icon: '💠',
  },
  {
    id: 'catalyst',
    name: 'Evolution Catalyst',
    description: 'After evolution, star core attack speed +25%',
    rarity: 'rare',
    effects: [{ type: 'evolution-reroll', value: 1 }],
    icon: '⚗️',
  },
  {
    id: 'orb-splitter',
    name: 'Star Core Splitter',
    description: 'Each fusion has a 20% probability of producing an additional',
    rarity: 'rare',
    effects: [{ type: 'orb-split', value: 0.2 }],
    icon: '✨',
  },
  {
    id: 'overload',
    name: 'Overload',
    description: 'All star core attack speed +25%',
    rarity: 'rare',
    effects: [{ type: 'atkspd-boost', value: 0.25 }],
    icon: '⚡',
  },
  {
    id: 'power-core',
    name: 'Power Core',
    description: 'All star core damage +20%',
    rarity: 'rare',
    effects: [{ type: 'damage-boost', value: 0.2 }],
    icon: '🔋',
  },
  {
    id: 'regen-field',
    name: 'Regenerative force field',
    description: 'Recover 1 life point at the end of each wave',
    rarity: 'rare',
    effects: [{ type: 'hp-regen', value: 1 }],
    icon: '💚',
  },
  {
    id: 'critical-lens',
    name: 'Critical Lens',
    description: 'All star core critical hit rate +15%',
    rarity: 'rare',
    effects: [{ type: 'crit-boost', value: 0.15 }],
    icon: '🎯',
  },
  {
    id: 'blood-pact',
    name: 'Blood Contract',
    description: 'Damage +30%, but 1 HP will be deducted at the beginning of each wave',
    rarity: 'rare',
    effects: [{ type: 'damage-boost', value: 0.3 }],
    icon: '🩸',
  },
  {
    id: 'gold-rush',
    name: 'Gold Rush',
    description: 'Kill reward +50%',
    rarity: 'rare',
    effects: [{ type: 'stardust-boost', value: 0.5 }],
    icon: '🪙',
  },
  {
    id: 'quick-merge',
    name: 'Fusion Acceleration',
    description: 'Attack speed +20%, damage +10%',
    rarity: 'rare',
    effects: [
      { type: 'atkspd-boost', value: 0.2 },
      { type: 'damage-boost', value: 0.1 },
    ],
    icon: '🔄',
  },
  {
    id: 'arcane-tome',
    name: 'Arcane Tome',
    description: 'Stardust +25%, Critical +10%',
    rarity: 'rare',
    effects: [
      { type: 'stardust-boost', value: 0.25 },
      { type: 'crit-boost', value: 0.1 },
    ],
    icon: '📖',
  },
  {
    id: 'time-anchor',
    name: 'Time Anchor',
    description: 'Enemy movement speed -25%',
    rarity: 'rare',
    effects: [{ type: 'enemy-slow', value: 0.25 }],
    icon: '⚓',
  },

  // ============= epic (8) =============
  {
    id: 'energy-shield',
    name: 'Energy Shield',
    description: 'Immune to the next blood deduction',
    rarity: 'epic',
    effects: [{ type: 'shield', value: 1 }],
    icon: '🔰',
  },
  {
    id: 'twin-core',
    name: 'Twin Core',
    description: 'Attack damage +50%, but attack speed -20%',
    rarity: 'epic',
    effects: [
      { type: 'damage-boost', value: 0.5 },
      { type: 'atkspd-boost', value: -0.2 },
    ],
    icon: '♊',
  },
  {
    id: 'void-heart',
    name: 'Heart of the Void',
    description: 'Damage +35%, Stardust +20%',
    rarity: 'epic',
    effects: [
      { type: 'damage-boost', value: 0.35 },
      { type: 'stardust-boost', value: 0.2 },
    ],
    icon: '🖤',
  },
  {
    id: 'berserker',
    name: 'Berserker',
    description: 'The lower the health, the higher the damage (up to +50%)',
    rarity: 'epic',
    effects: [{ type: 'damage-boost', value: 0.5 }],
    icon: '🔥',
  },
  {
    id: 'lucky-seven',
    name: 'Lucky Seven',
    description: 'Critical damage +100%',
    rarity: 'epic',
    effects: [{ type: 'crit-boost', value: 0.5 }],
    icon: '7️⃣',
  },
  {
    id: 'frost-crown',
    name: 'Frost Crown',
    description: 'Enemy movement speed -35%, Stardust +15%',
    rarity: 'epic',
    effects: [
      { type: 'enemy-slow', value: 0.35 },
      { type: 'stardust-boost', value: 0.15 },
    ],
    icon: '👑',
  },
  {
    id: 'overclock',
    name: 'Overclocked Core',
    description: 'Attack speed +40%, damage +15%',
    rarity: 'epic',
    effects: [
      { type: 'atkspd-boost', value: 0.4 },
      { type: 'damage-boost', value: 0.15 },
    ],
    icon: '📈',
  },
  {
    id: 'soul-harvest',
    name: 'Soul Harvest',
    description: 'Kill to gain 2x stardust, damage +15%',
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
    name: 'Core of Creation',
    description: 'All values +25%',
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
    name: 'Phoenix Feather',
    description: 'Resurrection on death, restores 2 health',
    rarity: 'legendary',
    effects: [{ type: 'shield', value: 2 }],
    icon: '🪶',
  },
  {
    id: 'cosmic-eye',
    name: 'Eye of the Universe',
    description: 'Critical +30%, Damage +30%, Stardust +30%',
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
    name: 'Singularity',
    description: 'Damage +60%, attack speed +30%, enemy movement speed -30%',
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
