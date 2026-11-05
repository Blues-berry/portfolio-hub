import { EnemyConfig, EnemyType } from '@/types/game';

export const ENEMIES: Record<EnemyType, EnemyConfig> = {
  grunt: {
    type: 'grunt',
    name: 'Void Soldier',
    baseHp: 10,
    speed: 0.025,        // 40秒走完，给玩家更多反应时间
    damage: 1,
    color: '#9B59B6',
    size: 18,
    reward: 2,
  },
  fast: {
    type: 'fast',
    name: 'Phantom Assassin',
    baseHp: 6,
    speed: 0.05,
    damage: 1,
    color: '#E74C3C',
    size: 14,
    reward: 3,
    weakTo: ['water'],      // 水减速 + 弱点
    description: 'Extremely fast, water element restraint',
  },
  armored: {
    type: 'armored',
    name: 'Obsidian Guard',
    baseHp: 28,
    speed: 0.018,
    damage: 2,
    armor: 0.5,
    color: '#34495E',
    size: 22,
    reward: 5,
    weakTo: ['earth'],      // 土元素破甲
    resist: ['fire', 'air'], // 火风被装甲弹开
    description: 'The armor is strong and earth elements can break through it',
  },
  flyer: {
    type: 'flyer',
    name: 'Stormwing',
    baseHp: 10,
    speed: 0.045,
    damage: 1,
    onlyHitBy: ['air', 'lightning'],
    color: '#16A085',
    size: 16,
    reward: 4,
    weakTo: ['air', 'lightning'],  // 风雷对其双倍伤害
    description: 'Can only be hit by wind/lightning and suffer from its weakness',
  },
  elite: {
    type: 'elite',
    name: 'Abyss Lord',
    baseHp: 75,
    speed: 0.022,
    damage: 2,
    armor: 0.3,
    color: '#8E44AD',
    size: 26,
    reward: 12,
    weakTo: ['lightning'],   // 雷元素穿透
    description: 'Thick blood, high armor, weak point of thunder',
  },
  boss: {
    type: 'boss',
    name: 'Devourer of Nothingness',
    baseHp: 320,
    speed: 0.015,
    damage: 3,
    armor: 0.4,
    color: '#C0392B',
    size: 36,
    reward: 50,
  },
  swarm: {
    type: 'swarm',
    name: 'Swarm',
    baseHp: 3,
    speed: 0.045,
    damage: 1,
    color: '#FF9933',
    size: 10,
    reward: 1,
    weakTo: ['fire'],       // 火烧虫群
    description: 'Weak but in groups, the fire element is restrained',
  },
  healer: {
    type: 'healer',
    name: 'Void Priest',
    baseHp: 24,
    speed: 0.022,
    damage: 1,
    armor: 0.1,
    color: '#27AE60',
    size: 20,
    reward: 8,
    healAura: 4,       // 每秒治疗 4 HP
    healRadius: 0.12,  // 治疗范围（位置距离）
    weakTo: ['lightning'],  // 雷断治疗
    description: 'Healing allies, thunder element can break the healing',
  },
  rift: {
    type: 'rift',
    name: 'Splitter',
    baseHp: 18,
    speed: 0.02,
    damage: 1,
    color: '#9B59B6',
    size: 16,
    reward: 6,
    teleport: { interval: 3000, distance: 0.15 },  // 每 3 秒瞬移 0.15 距离
    weakTo: ['lightning'],  // 电磁锁定瞬移
    description: 'Can tear apart time and space, and the thunder element can be locked',
  },
  corrupt: {
    type: 'corrupt',
    name: 'Corrupted Star Core',
    baseHp: 60,
    speed: 0.015,
    damage: 2,
    armor: 0.3,
    color: '#7F1A1A',
    size: 24,
    reward: 10,
    splitOnDeath: { type: 'swarm', count: 3 },  // 死亡时分裂成 3 个虫群
    weakTo: ['water'],      // 水净化腐化
    description: 'Contaminated by void, purified by water element',
  },
  reaper: {
    type: 'reaper',
    name: 'Reaper',
    baseHp: 8,
    speed: 0.08,
    damage: 2,
    color: '#C0392B',
    size: 14,
    reward: 5,
    weakTo: ['earth'],      // 土重力压制
    description: 'Extreme speed collision, earth element suppression',
  },
  maiden: {
    type: 'maiden',
    name: 'Fallen Girl',
    baseHp: 200,
    speed: 0.018,
    damage: 3,
    armor: 0.2,
    color: '#E74C3C',
    size: 32,
    reward: 30,
    healAura: 8,
    healRadius: 0.15,
    description: 'The star-core girl swallowed by the void, the ultimate boss',
  },
};

// 按波次缩放敌人血量
export function scaleEnemyHp(baseHp: number, wave: number): number {
  return Math.floor(baseHp * Math.pow(1.18, wave - 1));
}

// 按波次缩放敌人速度
export function scaleEnemySpeed(baseSpeed: number, wave: number): number {
  return baseSpeed * (1 + Math.min(0.5, (wave - 1) * 0.02));
}

// 按波次缩放奖励
export function scaleReward(baseReward: number, wave: number): number {
  return Math.floor(baseReward * (1 + (wave - 1) * 0.05));
}
