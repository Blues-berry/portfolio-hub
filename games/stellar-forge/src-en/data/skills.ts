// 主动技能配置
// 玩家通过击杀积累能量，可释放 3 种主动技能

export type SkillId = 'meteor' | 'time-freeze' | 'elemental-storm';

export interface SkillConfig {
  id: SkillId;
  name: string;
  description: string;
  hotkey: string;            // 触发键
  cost: number;             // 能量消耗
  cooldown: number;         // 冷却时间（ms）
  color: string;
  icon: string;             // emoji 图标
  // 效果参数
  damage?: number;          // 基础伤害
  damagePerWave?: number;   // 每波额外伤害
  freezeDuration?: number;  // 冻结时长（ms）
  chainCount?: number;      // 连锁次数
}

export const SKILLS: Record<SkillId, SkillConfig> = {
  meteor: {
    id: 'meteor',
    name: 'Meteor Shower',
    description: 'Calls down meteors to damage every enemy.',
    hotkey: 'Q',
    cost: 40,
    cooldown: 10000,
    color: '#FF6B6B',
    icon: '☄️',
    damage: 60,
    damagePerWave: 12,
  },
  'time-freeze': {
    id: 'time-freeze',
    name: 'Time Freeze',
    description: 'Freezes all enemies for 4 seconds.',
    hotkey: 'W',
    cost: 60,
    cooldown: 15000,
    color: '#4ECDC4',
    icon: '❄️',
    freezeDuration: 4000,
  },
  'elemental-storm': {
    id: 'elemental-storm',
    name: 'Elemental Storm',
    description: 'Unleashes a chain of attacks using your current element.',
    hotkey: 'E',
    cost: 80,
    cooldown: 20000,
    color: '#FFD166',
    icon: '⚡',
    damage: 35,
    damagePerWave: 8,
    chainCount: 3,
  },
};

export const SKILL_IDS: SkillId[] = ['meteor', 'time-freeze', 'elemental-storm'];

// 能量上限
export const MAX_ENERGY = 100;

// 不同敌人击杀获得能量
export function getKillEnergy(enemyType: string): number {
  switch (enemyType) {
    case 'boss':
    case 'maiden':
      return 25;
    case 'elite':
    case 'corrupt':
      return 8;
    case 'swarm':
      return 1;
    case 'reaper':
    case 'fast':
      return 4;
    default:
      return 3;
  }
}
