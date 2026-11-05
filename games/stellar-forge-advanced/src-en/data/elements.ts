import { ElementConfig, ElementType } from '@/types/game';

// 五大元素配置
export const ELEMENTS: Record<ElementType, ElementConfig> = {
  fire: {
    id: 'fire',
    name: 'Fire Core',
    symbol: '🔥',
    color: '#FF6B6B',
    glow: '#FF8E8E',
    damage: 14,
    attackSpeed: 1.4,
    range: 6,
    description: 'High single-target damage with a 20% critical-hit chance.',
    special: { critChance: 0.2 },
    evolution: {
      tier: 3,
      branches: [
        {
          id: 'inferno',
          name: 'Hellfire',
          description: 'Attacks splash to nearby enemies.',
          effect: 'splash',
          color: '#FF4500',
        },
        {
          id: 'phoenix',
          name: 'Immortal Phoenix',
          description: 'Revives one Star Core every 30 seconds.',
          effect: 'revive',
          color: '#FFAA33',
        },
      ],
    },
  },
  water: {
    id: 'water',
    name: 'Water Core',
    symbol: '💧',
    color: '#4ECDC4',
    glow: '#7FE5DD',
    damage: 8,
    attackSpeed: 1.2,
    range: 6,
    description: 'Hits slow enemies by 30%.',
    special: { slowAmount: 0.3 },
    evolution: {
      tier: 3,
      branches: [
        {
          id: 'frost',
          name: 'Frost Core',
          description: 'Attacks have a 25% chance to freeze an enemy for 1.5 seconds.',
          effect: 'freeze',
          color: '#A8E6FF',
        },
        {
          id: 'tsunami',
          name: 'Tsunami',
          description: 'Attacks slow nearby enemies.',
          effect: 'aoe-slow',
          color: '#0099CC',
        },
      ],
    },
  },
  earth: {
    id: 'earth',
    name: 'Earth Core',
    symbol: '🪨',
    color: '#C9A26B',
    glow: '#E0BC85',
    damage: 12,
    attackSpeed: 0.9,
    range: 5,
    description: 'A durable shield that reflects 20% of incoming damage.',
    special: { reflect: 0.2 },
    evolution: {
      tier: 3,
      branches: [
        {
          id: 'magma',
          name: 'Lava Core',
          description: 'Creates a burning aura that deals damage over time.',
          effect: 'burn-aura',
          color: '#FF6600',
        },
        {
          id: 'mountain',
          name: 'Mountain Core',
          description: 'Shields nearby Star Cores.',
          effect: 'shield-aura',
          color: '#8B7355',
        },
      ],
    },
  },
  air: {
    id: 'air',
    name: 'Wind Core',
    symbol: '🌀',
    color: '#95E1D3',
    glow: '#B5F1E3',
    damage: 6,
    attackSpeed: 2.2,
    range: 7,
    description: 'Attacks quickly and chains to two enemies.',
    special: { chain: 2 },
    evolution: {
      tier: 3,
      branches: [
        {
          id: 'storm',
          name: 'Storm',
          description: 'Chains to four enemies instead of two.',
          effect: 'chain-4',
          color: '#00CCAA',
        },
        {
          id: 'gale',
          name: 'Gale',
          description: 'Doubles attack speed.',
          effect: 'atkspd-2x',
          color: '#66FFCC',
        },
      ],
    },
  },
  lightning: {
    id: 'lightning',
    name: 'Lightning Core',
    symbol: '⚡',
    color: '#FFE66D',
    glow: '#FFF099',
    damage: 18,
    attackSpeed: 1.1,
    range: 6,
    description: 'High critical damage; attacks pierce one enemy.',
    special: { critChance: 0.35, pierce: 1 },
    evolution: {
      tier: 3,
      branches: [
        {
          id: 'thunder',
          name: 'Thunderstorm',
          description: 'Attacks chain to three enemies.',
          effect: 'chain-lightning',
          color: '#FFCC00',
        },
        {
          id: 'judgment',
          name: 'Judgment',
          description: 'Instantly defeats enemies below 15% health.',
          effect: 'execute',
          color: '#FFFFFF',
        },
      ],
    },
  },
};

// 星核尺寸（每等级）
export const TIER_SIZES = [0, 28, 38, 50, 64, 80]; // 0级不存在
export const TIER_DAMAGE_MULT = [0, 1, 2.2, 4.5, 9, 18]; // 每级伤害倍率

// 获取星核实际伤害
export function getOrbDamage(element: ElementType, tier: number, evolution?: string): number {
  const base = ELEMENTS[element].damage * TIER_DAMAGE_MULT[tier];
  // 进化加成
  if (evolution === 'gale') return base * 1.5;
  if (evolution === 'judgment') return base * 1.3;
  return base;
}

// 获取星核攻击间隔(ms)
export function getOrbAttackInterval(element: ElementType, tier: number, evolution?: string): number {
  const base = 1000 / ELEMENTS[element].attackSpeed;
  const tierMult = Math.pow(0.85, tier - 1); // 每级提速15%
  let interval = base * tierMult;
  if (evolution === 'gale') interval *= 0.5;
  return interval;
}

// 获取星核射程（格子数）
export function getOrbRange(element: ElementType, tier: number): number {
  const base = ELEMENTS[element].range;
  return base + Math.floor((tier - 1) / 2); // 高级+1射程
}

export const ELEMENT_LIST = Object.values(ELEMENTS);
