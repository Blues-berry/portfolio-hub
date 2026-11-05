// ============= 星核天赋树系统（缝合 RPG 天赋树）=============
// 永久天赋，跨局持久化，每局开始时自动生效

export type TalentBranch = 'attack' | 'control' | 'defense';

export type TalentEffect =
  | 'damage-boost'      // 全场伤害加成
  | 'crit-boost'        // 全场暴击率加成
  | 'crit-damage'       // 暴击伤害加成
  | 'slow-boost'        // 减速效果增强
  | 'status-duration'   // 状态效果持续时间加成
  | 'freeze-chance'     // 水系攻击概率冻结
  | 'hp-boost'          // 起始生命加成
  | 'hp-regen'          // 每波结束回复生命
  | 'damage-chance';    // 受击概率免伤

export interface TalentDef {
  id: string;
  branch: TalentBranch;
  name: string;
  description: string;
  icon: string;
  color: string;
  cost: number;          // 天赋点花费
  effect: TalentEffect;
  value: number;
}

export const TALENT_BRANCHES: { id: TalentBranch; name: string; icon: string; color: string; desc: string }[] = [
  { id: 'attack',  name: 'The Way of Burning Heaven', icon: '⚔️', color: '#FF6B6B', desc: 'Enhanced output and critical strike' },
  { id: 'control', name: 'The Way of Frost', icon: '❄️', color: '#4ECDC4', desc: 'Strengthen control and deceleration' },
  { id: 'defense', name: 'The Way of Thick Soil', icon: '🛡️', color: '#FFD166', desc: 'Strengthen survival and recovery' },
];

export const TALENTS: TalentDef[] = [
  // 攻击流（焚天之道）
  { id: 'power-mark',     branch: 'attack',  name: 'Seal of Power', icon: '⚔️', color: '#FF6B6B', cost: 1, effect: 'damage-boost',  value: 0.15, description: 'All star core damage +15%' },
  { id: 'precision-mark', branch: 'attack',  name: 'Precision Mark', icon: '🎯', color: '#FF6B6B', cost: 2, effect: 'crit-boost',    value: 0.08, description: 'All star core critical hit rate +8%' },
  { id: 'berserker-mark', branch: 'attack',  name: 'Mark of Mad War', icon: '💥', color: '#FF6B6B', cost: 3, effect: 'crit-damage',   value: 0.5,  description: 'Critical damage +0.5x' },
  // 控制流（凝霜之道）
  { id: 'frost-mark',     branch: 'control', name: 'Frost Mark', icon: '❄️', color: '#4ECDC4', cost: 1, effect: 'slow-boost',     value: 0.25, description: 'Slowing effect +25%' },
  { id: 'time-mark',      branch: 'control', name: 'Time delay imprint', icon: '⏳', color: '#4ECDC4', cost: 2, effect: 'status-duration', value: 0.5,  description: 'Status effect duration +50%' },
  { id: 'freeze-mark',    branch: 'control', name: 'Frozen Mark', icon: '🧊', color: '#4ECDC4', cost: 3, effect: 'freeze-chance',   value: 0.15, description: 'Water attack has 15% chance of freezing for 1 second' },
  // 防御流（厚土之道）
  { id: 'life-mark',      branch: 'defense', name: 'Sign of Life', icon: '❤️', color: '#FFD166', cost: 1, effect: 'hp-boost',       value: 1,    description: 'Starting life +1' },
  { id: 'heal-mark',      branch: 'defense', name: 'Self-healing mark', icon: '💚', color: '#FFD166', cost: 2, effect: 'hp-regen',        value: 1,    description: 'Recover 1 HP at the end of each wave' },
  { id: 'iron-mark',      branch: 'defense', name: 'Steel Seal', icon: '🛡️', color: '#FFD166', cost: 3, effect: 'damage-chance',  value: 0.2,  description: '20% chance of not losing health when hit' },
];

export const TALENTS_BY_ID: Record<string, TalentDef> = Object.fromEntries(TALENTS.map(t => [t.id, t]));

export function getTalentsByBranch(branch: TalentBranch): TalentDef[] {
  return TALENTS.filter(t => t.branch === branch);
}

// 从已解锁天赋列表中，查询某类效果的总值
export function getTalentEffectSum(unlockedTalents: string[], effect: TalentEffect): number {
  let sum = 0;
  for (const id of unlockedTalents) {
    const def = TALENTS_BY_ID[id];
    if (def && def.effect === effect) sum += def.value;
  }
  return sum;
}

// 检查是否解锁了某类效果的天赋
export function hasTalentEffect(unlockedTalents: string[], effect: TalentEffect): boolean {
  return unlockedTalents.some(id => TALENTS_BY_ID[id]?.effect === effect);
}

// 每局结算时根据波次计算获得的天赋点（每 3 波 1 点）
export function calcTalentPointsGained(wave: number): number {
  return Math.floor(wave / 3);
}
