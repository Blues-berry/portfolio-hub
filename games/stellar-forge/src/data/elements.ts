import { ElementConfig, ElementType } from '@/types/game';

// 五大元素配置
export const ELEMENTS: Record<ElementType, ElementConfig> = {
  fire: {
    id: 'fire',
    name: '炎核',
    symbol: '🔥',
    color: '#FF6B6B',
    glow: '#FF8E8E',
    damage: 14,
    attackSpeed: 1.4,
    range: 6,
    description: '高单体伤害，20% 暴击率',
    special: { critChance: 0.2 },
    evolution: {
      tier: 3,
      branches: [
        {
          id: 'inferno',
          name: '地狱火',
          description: '攻击溅射周围 1 格敌人',
          effect: 'splash',
          color: '#FF4500',
        },
        {
          id: 'phoenix',
          name: '不死凤凰',
          description: '每 30 秒使一颗星核复活',
          effect: 'revive',
          color: '#FFAA33',
        },
      ],
    },
  },
  water: {
    id: 'water',
    name: '水核',
    symbol: '💧',
    color: '#4ECDC4',
    glow: '#7FE5DD',
    damage: 8,
    attackSpeed: 1.2,
    range: 6,
    description: '命中减速 30%',
    special: { slowAmount: 0.3 },
    evolution: {
      tier: 3,
      branches: [
        {
          id: 'frost',
          name: '霜冻核心',
          description: '攻击有 25% 概率冻结敌人 1.5 秒',
          effect: 'freeze',
          color: '#A8E6FF',
        },
        {
          id: 'tsunami',
          name: '海啸',
          description: '攻击造成范围减速',
          effect: 'aoe-slow',
          color: '#0099CC',
        },
      ],
    },
  },
  earth: {
    id: 'earth',
    name: '岩核',
    symbol: '🪨',
    color: '#C9A26B',
    glow: '#E0BC85',
    damage: 12,
    attackSpeed: 0.9,
    range: 5,
    description: '高血量护盾，反伤 20%',
    special: { reflect: 0.2 },
    evolution: {
      tier: 3,
      branches: [
        {
          id: 'magma',
          name: '熔岩核心',
          description: '产生灼烧光环，每秒伤害',
          effect: 'burn-aura',
          color: '#FF6600',
        },
        {
          id: 'mountain',
          name: '山岳之核',
          description: '为周围星核提供护盾',
          effect: 'shield-aura',
          color: '#8B7355',
        },
      ],
    },
  },
  air: {
    id: 'air',
    name: '风核',
    symbol: '🌀',
    color: '#95E1D3',
    glow: '#B5F1E3',
    damage: 6,
    attackSpeed: 2.2,
    range: 7,
    description: '快速攻击，连锁 2 次',
    special: { chain: 2 },
    evolution: {
      tier: 3,
      branches: [
        {
          id: 'storm',
          name: '风暴',
          description: '连锁次数提升至 4',
          effect: 'chain-4',
          color: '#00CCAA',
        },
        {
          id: 'gale',
          name: '飙风',
          description: '攻速翻倍',
          effect: 'atkspd-2x',
          color: '#66FFCC',
        },
      ],
    },
  },
  lightning: {
    id: 'lightning',
    name: '雷核',
    symbol: '⚡',
    color: '#FFE66D',
    glow: '#FFF099',
    damage: 18,
    attackSpeed: 1.1,
    range: 6,
    description: '高暴击伤害，穿透 1 个敌人',
    special: { critChance: 0.35, pierce: 1 },
    evolution: {
      tier: 3,
      branches: [
        {
          id: 'thunder',
          name: '雷暴',
          description: '攻击跳跃至 3 个敌人',
          effect: 'chain-lightning',
          color: '#FFCC00',
        },
        {
          id: 'judgment',
          name: '天罚',
          description: '秒杀生命低于 15% 的敌人',
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
