// 随机事件类型
export type WaveEventId =
  | 'double-stardust'    // 双倍星尘
  | 'frenzy'             // 狂暴：敌人速度+50%，奖励+50%
  | 'meteor-shower'      // 流星雨：定期流星砸向轨道
  | 'blood-tide'         // 血潮：敌人HP+50%，遗物概率提升
  | 'stardust-rain'      // 星尘雨：定期获得星尘
  | 'void-storm';        // 虚空风暴：投射物减速但伤害提升

export interface WaveEventConfig {
  id: WaveEventId;
  name: string;
  description: string;
  color: string;
  icon: string;
  // 效果
  enemySpeedMult?: number;       // 敌人速度倍率
  enemyHpMult?: number;         // 敌人HP倍率
  rewardMult?: number;           // 奖励倍率
  stardustMult?: number;         // 星尘倍率
  projectileSpeedMult?: number; // 投射物速度倍率
  projectileDmgMult?: number;    // 投射物伤害倍率
  // 周期性效果
  meteorInterval?: number;       // 流星间隔(ms)
  meteorDamage?: number;         // 流星伤害
  stardustInterval?: number;     // 星尘雨间隔(ms)
  stardustAmount?: number;       // 每次星尘量
}

export const WAVE_EVENTS: Record<WaveEventId, WaveEventConfig> = {
  'double-stardust': {
    id: 'double-stardust',
    name: 'Double Stardust',
    description: 'Kill this wave to get double stardust reward',
    color: '#FFD166',
    icon: '💎',
    stardustMult: 2.0,
  },
  'frenzy': {
    id: 'frenzy',
    name: 'Rage',
    description: 'Enemy speed +50%, but kill reward +50%',
    color: '#FF6B6B',
    icon: '💢',
    enemySpeedMult: 1.5,
    rewardMult: 1.5,
  },
  'meteor-shower': {
    id: 'meteor-shower',
    name: 'Meteor Shower',
    description: 'A meteor falls from the sky every 4 seconds, causing 30 damage to the enemy',
    color: '#FF8E53',
    icon: '☄️',
    meteorInterval: 4000,
    meteorDamage: 30,
  },
  'blood-tide': {
    id: 'blood-tide',
    name: 'Bloody Tide',
    description: 'Enemy HP +50%, but this wave will definitely drop relics',
    color: '#C0392B',
    icon: '🩸',
    enemyHpMult: 1.5,
  },
  'stardust-rain': {
    id: 'stardust-rain',
    name: 'Stardust Rain',
    description: '8 pieces of stardust fall from the sky every 5 seconds',
    color: '#4ECDC4',
    icon: '✨',
    stardustInterval: 5000,
    stardustAmount: 8,
  },
  'void-storm': {
    id: 'void-storm',
    name: 'Void Storm',
    description: 'Projectile speed -30%, but damage +30%',
    color: '#9B59B6',
    icon: '🌪️',
    projectileSpeedMult: 0.7,
    projectileDmgMult: 1.3,
  },
};

// 所有事件 ID 列表
export const ALL_EVENT_IDS: WaveEventId[] = [
  'double-stardust', 'frenzy', 'meteor-shower', 'blood-tide', 'stardust-rain', 'void-storm',
];

// 触发事件的波次（每 3 波一个事件）
export function shouldTriggerEvent(wave: number): boolean {
  // 跳过第 1-2 波（教学期）和 Boss 波
  if (wave <= 2) return false;
  if (wave % 5 === 0) return false;  // Boss 波不触发
  return wave % 3 === 0;  // 每 3 波触发
}

// 随机选择一个事件
export function rollWaveEvent(): WaveEventConfig {
  const idx = Math.floor(Math.random() * ALL_EVENT_IDS.length);
  return WAVE_EVENTS[ALL_EVENT_IDS[idx]];
}
