// 日常挑战模式配置
// 基于日期生成确定性挑战，每日一个固定 seed

import { ElementType } from '@/types/game';

// ============= 修饰符 =============
export type ModifierId =
  | 'element_master'    // 起始全元素
  | 'speed_demon'       // 敌人速度+50%，星尘+100%
  | 'hardcore'          // HP 1，但伤害+50%
  | 'combo_fever'       // 连击窗口+50%，连击伤害+2x
  | 'no_shop'           // 无商店阶段，每波自动给遗物
  | 'energy_overflow'   // 起始能量满，技能冷却-50%
  | 'double_boss'       // BOSS血量2x，奖励2x
  | 'gift_of_void'      // 起始星尘+200，但每波-10
  | 'glass_cannon'      // 伤害+100%，HP-50%
  | 'swift_strike';     // 攻击速度+50%

export interface ChallengeModifierFlags {
  noShop?: boolean;
  autoRelicPerWave?: boolean;
  damageMult?: number;
  enemySpeedMult?: number;
  enemyHpMult?: number;
  stardustMult?: number;
  comboTimerMult?: number;
  comboDamageMult?: number;
  skillCooldownMult?: number;
  hpDrainPerWave?: number;
  attackSpeedMult?: number;
}

export interface ChallengeModifier {
  id: ModifierId;
  name: string;
  description: string;
  icon: string;
  color: string;
  flags: ChallengeModifierFlags;
}

export const MODIFIERS: Record<ModifierId, ChallengeModifier> = {
  element_master: {
    id: 'element_master',
    name: 'Master of Elements',
    description: 'Start with all 5 elements unlocked',
    icon: '🌈',
    color: '#9B59B6',
    flags: {},
  },
  speed_demon: {
    id: 'speed_demon',
    name: 'Sprint',
    description: 'Enemy Speed +50%, but Stardust Bonus +100%',
    icon: '💨',
    color: '#E74C3C',
    flags: { enemySpeedMult: 1.5, stardustMult: 2.0 },
  },
  hardcore: {
    id: 'hardcore',
    name: 'Hardcore Challenge',
    description: 'Starting HP 1, but damage +50%',
    icon: '💀',
    color: '#C0392B',
    flags: { damageMult: 1.5 },
  },
  combo_fever: {
    id: 'combo_fever',
    name: 'Combo Mania',
    description: 'Combo window +50%, combo damage bonus +2 times',
    icon: '🔥',
    color: '#FF6B6B',
    flags: { comboTimerMult: 1.5, comboDamageMult: 2.0 },
  },
  no_shop: {
    id: 'no_shop',
    name: 'No store',
    description: 'There is no shop between waves, but you will automatically get 1 random relic in each wave',
    icon: '🚫',
    color: '#8E44AD',
    flags: { noShop: true, autoRelicPerWave: true },
  },
  energy_overflow: {
    id: 'energy_overflow',
    name: 'Full of energy',
    description: 'Starting energy is full, skill cooldown -50%',
    icon: '⚡',
    color: '#FFD166',
    flags: { skillCooldownMult: 0.5 },
  },
  double_boss: {
    id: 'double_boss',
    name: 'DOUBLE BOSS',
    description: 'BOSS HP ×2, but reward ×2',
    icon: '👑',
    color: '#FF8E3C',
    flags: { enemyHpMult: 1.5 },  // 全局 1.5x（包括 BOSS），实际 BOSS 会在 generateWave 时再加成
  },
  gift_of_void: {
    id: 'gift_of_void',
    name: 'Gift of the Void',
    description: 'Starting Stardust +200, but -10 per wave',
    icon: '🎁',
    color: '#4ECDC4',
    flags: { hpDrainPerWave: 0 },  // 用 stardustDrainPerWave 单独处理
  },
  glass_cannon: {
    id: 'glass_cannon',
    name: 'Glass Cannon',
    description: 'Damage +100%, but HP -50%',
    icon: '🔮',
    color: '#E94560',
    flags: { damageMult: 2.0 },
  },
  swift_strike: {
    id: 'swift_strike',
    name: 'Swift Strike',
    description: 'Star core attack speed +50%',
    icon: '🗡️',
    color: '#16A085',
    flags: { attackSpeedMult: 1.5 },
  },
};

export const ALL_MODIFIER_IDS: ModifierId[] = Object.keys(MODIFIERS) as ModifierId[];

// ============= 日期种子 =============
// 将 YYYY-MM-DD 转为数字种子
function dateToSeed(dateStr: string): number {
  const [y, m, d] = dateStr.split('-').map(Number);
  // 简单 hash
  return y * 10000 + m * 100 + d;
}

// 线性同余生成器（LCG），保证可重现
function createRng(seed: number) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 0xFFFFFFFF;
    return state / 0xFFFFFFFF;
  };
}

function formatDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

// ============= 挑战定义 =============
export interface DailyChallenge {
  date: string;
  seed: number;
  modifiers: ChallengeModifier[];
  startHp: number;
  startStardust: number;
  startElements: ElementType[];
  startEnergy: number;
}

// 获取指定日期的挑战（不传则当天）
export function getDailyChallenge(date?: Date): DailyChallenge {
  const target = date ?? new Date();
  const dateStr = formatDate(target);
  const seed = dateToSeed(dateStr);
  const rng = createRng(seed);

  // 选择 2 个不冲突的修饰符
  const pool = [...ALL_MODIFIER_IDS];
  const picked: ModifierId[] = [];
  // 排除冲突：hardcore + glass_cannon 不共存
  const conflicts: Record<ModifierId, ModifierId[]> = {
    hardcore: ['glass_cannon'],
    glass_cannon: ['hardcore'],
    element_master: [],
    speed_demon: [],
    combo_fever: [],
    no_shop: [],
    energy_overflow: [],
    double_boss: [],
    gift_of_void: [],
    swift_strike: [],
  };
  for (let i = 0; i < 2 && pool.length > 0; i++) {
    const idx = Math.floor(rng() * pool.length);
    const id = pool[idx];
    // 检查冲突
    if (picked.some(p => conflicts[id].includes(p))) {
      i--;
      pool.splice(idx, 1);
      continue;
    }
    picked.push(id);
    pool.splice(idx, 1);
  }

  const modifiers = picked.map(id => MODIFIERS[id]);

  // 基础起始条件
  let startHp = 3;
  let startStardust = 30;
  let startElements: ElementType[] = ['fire'];
  let startEnergy = 0;

  // 应用修饰符
  for (const mod of modifiers) {
    switch (mod.id) {
      case 'element_master':
        startElements = ['fire', 'water', 'earth', 'air', 'lightning'];
        break;
      case 'hardcore':
        startHp = 1;
        break;
      case 'glass_cannon':
        startHp = Math.max(1, Math.floor(startHp * 0.5));
        break;
      case 'gift_of_void':
        startStardust += 200;
        break;
      case 'energy_overflow':
        startEnergy = 100;
        break;
    }
  }

  return {
    date: dateStr,
    seed,
    modifiers,
    startHp,
    startStardust,
    startElements,
    startEnergy,
  };
}

// 获取今日挑战
export function getTodayChallenge(): DailyChallenge {
  return getDailyChallenge(new Date());
}

// 获取当日挑战的 flag 合并（用于 gameStore 查询）
export function getChallengeFlags(challenge: DailyChallenge): ChallengeModifierFlags {
  const merged: ChallengeModifierFlags = {};
  for (const mod of challenge.modifiers) {
    Object.assign(merged, mod.flags);
    // 数值类叠加（取最大值或加和）
    if (mod.flags.damageMult) {
      merged.damageMult = (merged.damageMult ?? 1) * mod.flags.damageMult;
    }
    if (mod.flags.enemySpeedMult) {
      merged.enemySpeedMult = (merged.enemySpeedMult ?? 1) * mod.flags.enemySpeedMult;
    }
    if (mod.flags.stardustMult) {
      merged.stardustMult = (merged.stardustMult ?? 1) * mod.flags.stardustMult;
    }
  }
  return merged;
}
