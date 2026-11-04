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
  { id: 'attack',  name: '焚天之道', icon: '⚔️', color: '#FF6B6B', desc: '强化输出与暴击' },
  { id: 'control', name: '凝霜之道', icon: '❄️', color: '#4ECDC4', desc: '强化控制与减速' },
  { id: 'defense', name: '厚土之道', icon: '🛡️', color: '#FFD166', desc: '强化生存与回复' },
];

export const TALENTS: TalentDef[] = [
  // 攻击流（焚天之道）
  { id: 'power-mark',     branch: 'attack',  name: '力量印记', icon: '⚔️', color: '#FF6B6B', cost: 1, effect: 'damage-boost',  value: 0.15, description: '所有星核伤害 +15%' },
  { id: 'precision-mark', branch: 'attack',  name: '精准印记', icon: '🎯', color: '#FF6B6B', cost: 2, effect: 'crit-boost',    value: 0.08, description: '所有星核暴击率 +8%' },
  { id: 'berserker-mark', branch: 'attack',  name: '狂战印记', icon: '💥', color: '#FF6B6B', cost: 3, effect: 'crit-damage',   value: 0.5,  description: '暴击伤害 +0.5x' },
  // 控制流（凝霜之道）
  { id: 'frost-mark',     branch: 'control', name: '寒霜印记', icon: '❄️', color: '#4ECDC4', cost: 1, effect: 'slow-boost',     value: 0.25, description: '减速效果 +25%' },
  { id: 'time-mark',      branch: 'control', name: '时滞印记', icon: '⏳', color: '#4ECDC4', cost: 2, effect: 'status-duration', value: 0.5,  description: '状态效果持续时间 +50%' },
  { id: 'freeze-mark',    branch: 'control', name: '冰封印记', icon: '🧊', color: '#4ECDC4', cost: 3, effect: 'freeze-chance',   value: 0.15, description: '水系攻击 15% 概率冻结 1 秒' },
  // 防御流（厚土之道）
  { id: 'life-mark',      branch: 'defense', name: '生命印记', icon: '❤️', color: '#FFD166', cost: 1, effect: 'hp-boost',       value: 1,    description: '起始生命 +1' },
  { id: 'heal-mark',      branch: 'defense', name: '自愈印记', icon: '💚', color: '#FFD166', cost: 2, effect: 'hp-regen',        value: 1,    description: '每波结束回复 1 HP' },
  { id: 'iron-mark',      branch: 'defense', name: '钢铁印记', icon: '🛡️', color: '#FFD166', cost: 3, effect: 'damage-chance',  value: 0.2,  description: '受击时 20% 概率不减生命' },
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
