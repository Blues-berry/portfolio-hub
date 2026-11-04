// 成就系统配置
// 持久化解锁记录 + 游戏内 Toast 提示

import { ElementType } from '@/types/game';
import { SkillId } from '@/data/skills';

export type AchievementCategory = 'kill' | 'wave' | 'combo' | 'skill' | 'story' | 'special';

export type AchievementId =
  // 击杀类
  | 'first_blood' | 'kills_100' | 'kills_500' | 'kills_1000' | 'boss_slayer'
  // 波次类
  | 'wave_5' | 'wave_10' | 'wave_15' | 'wave_20'
  // 连击类
  | 'combo_10' | 'combo_25'
  // 技能类
  | 'skill_first' | 'skills_30' | 'triple_skill'
  // 剧情类
  | 'maiden_first' | 'maiden_pact_5' | 'monster_pact_3'
  // 特殊类
  | 'element_master' | 'energy_max' | 'flawless_5';

export interface AchievementDef {
  id: AchievementId;
  name: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  reward: number;          // 星尘奖励
  hidden?: boolean;        // 隐藏成就（达成前不显示描述）
  // 进度计算（0-1），用于 UI 显示
  progress: (stats: AchievementStats) => number;
  // 是否达成
  isUnlocked: (stats: AchievementStats) => boolean;
}

// 成就检测用的统计数据
export interface AchievementStats {
  totalKills: number;          // 累计击杀（跨局）
  runKills: number;            // 本局击杀
  currentWave: number;         // 当前波次
  bestWave: number;            // 最高波次
  bestCombo: number;           // 本局最高连击
  currentCombo: number;       // 当前连击
  bossKills: number;           // 累计 Boss 击杀
  totalSkillUses: number;     // 累计技能使用次数
  runSkillsUsed: SkillId[];   // 本局使用过的技能
  seenMaidens: string[];      // 累计见过的少女
  maidenPacts: string[];      // 累计缔结契约的少女
  monsterPacts: number;       // 累计接受的怪兽契约数
  unlockedElements: ElementType[];  // 已解锁元素
  energy: number;             // 当前能量
  hpLostInRun: number;       // 本局失去的 HP
}

export const ACHIEVEMENTS: AchievementDef[] = [
  // ============= 击杀类 =============
  {
    id: 'first_blood',
    name: '初次接触',
    description: '击杀第一个敌人',
    icon: '🩸',
    category: 'kill',
    reward: 0,
    progress: (s) => Math.min(1, s.totalKills / 1),
    isUnlocked: (s) => s.totalKills >= 1,
  },
  {
    id: 'kills_100',
    name: '虚空猎手',
    description: '累计击杀 100 个敌人',
    icon: '⚔️',
    category: 'kill',
    reward: 30,
    progress: (s) => Math.min(1, s.totalKills / 100),
    isUnlocked: (s) => s.totalKills >= 100,
  },
  {
    id: 'kills_500',
    name: '星核守护者',
    description: '累计击杀 500 个敌人',
    icon: '🗡️',
    category: 'kill',
    reward: 50,
    progress: (s) => Math.min(1, s.totalKills / 500),
    isUnlocked: (s) => s.totalKills >= 500,
  },
  {
    id: 'kills_1000',
    name: '终焉之刃',
    description: '累计击杀 1000 个敌人',
    icon: '🌙',
    category: 'kill',
    reward: 100,
    progress: (s) => Math.min(1, s.totalKills / 1000),
    isUnlocked: (s) => s.totalKills >= 1000,
  },
  {
    id: 'boss_slayer',
    name: '弑神者',
    description: '击败首个 Boss',
    icon: '👑',
    category: 'kill',
    reward: 40,
    progress: (s) => Math.min(1, s.bossKills / 1),
    isUnlocked: (s) => s.bossKills >= 1,
  },

  // ============= 波次类 =============
  {
    id: 'wave_5',
    name: '初露锋芒',
    description: '到达第 5 波',
    icon: '🌟',
    category: 'wave',
    reward: 20,
    progress: (s) => Math.min(1, Math.max(s.currentWave, s.bestWave) / 5),
    isUnlocked: (s) => Math.max(s.currentWave, s.bestWave) >= 5,
  },
  {
    id: 'wave_10',
    name: '深空行者',
    description: '到达第 10 波',
    icon: '🚀',
    category: 'wave',
    reward: 40,
    progress: (s) => Math.min(1, Math.max(s.currentWave, s.bestWave) / 10),
    isUnlocked: (s) => Math.max(s.currentWave, s.bestWave) >= 10,
  },
  {
    id: 'wave_15',
    name: '虚空征服',
    description: '到达第 15 波',
    icon: '🌌',
    category: 'wave',
    reward: 60,
    progress: (s) => Math.min(1, Math.max(s.currentWave, s.bestWave) / 15),
    isUnlocked: (s) => Math.max(s.currentWave, s.bestWave) >= 15,
  },
  {
    id: 'wave_20',
    name: '终焉救世主',
    description: '通关第 20 波',
    icon: '🏆',
    category: 'wave',
    reward: 100,
    progress: (s) => Math.min(1, Math.max(s.currentWave, s.bestWave) / 20),
    isUnlocked: (s) => Math.max(s.currentWave, s.bestWave) >= 20,
  },

  // ============= 连击类 =============
  {
    id: 'combo_10',
    name: '连击新秀',
    description: '单局达成 10 连击',
    icon: '⚡',
    category: 'combo',
    reward: 20,
    progress: (s) => Math.min(1, s.bestCombo / 10),
    isUnlocked: (s) => s.bestCombo >= 10,
  },
  {
    id: 'combo_25',
    name: '连击大师',
    description: '单局达成 25 连击',
    icon: '🔥',
    category: 'combo',
    reward: 50,
    progress: (s) => Math.min(1, s.bestCombo / 25),
    isUnlocked: (s) => s.bestCombo >= 25,
  },

  // ============= 技能类 =============
  {
    id: 'skill_first',
    name: '能量觉醒',
    description: '首次释放主动技能',
    icon: '✨',
    category: 'skill',
    reward: 10,
    progress: (s) => Math.min(1, s.totalSkillUses / 1),
    isUnlocked: (s) => s.totalSkillUses >= 1,
  },
  {
    id: 'skills_30',
    name: '技能专家',
    description: '累计释放 30 次主动技能',
    icon: '🎓',
    category: 'skill',
    reward: 50,
    progress: (s) => Math.min(1, s.totalSkillUses / 30),
    isUnlocked: (s) => s.totalSkillUses >= 30,
  },
  {
    id: 'triple_skill',
    name: '三相一体',
    description: '单局内释放过全部 3 种主动技能',
    icon: '🌟',
    category: 'skill',
    reward: 30,
    progress: (s) => Math.min(1, s.runSkillsUsed.length / 3),
    isUnlocked: (s) => s.runSkillsUsed.length >= 3,
  },

  // ============= 剧情类 =============
  {
    id: 'maiden_first',
    name: '初次邂逅',
    description: '首次遇见星核少女',
    icon: '💝',
    category: 'story',
    reward: 20,
    progress: (s) => Math.min(1, s.seenMaidens.length / 1),
    isUnlocked: (s) => s.seenMaidens.length >= 1,
  },
  {
    id: 'maiden_pact_5',
    name: '众星之约',
    description: '与全部 5 个星核少女缔结契约',
    icon: '💞',
    category: 'story',
    reward: 100,
    progress: (s) => Math.min(1, s.maidenPacts.length / 5),
    isUnlocked: (s) => s.maidenPacts.length >= 5,
  },
  {
    id: 'monster_pact_3',
    name: '黑暗交易',
    description: '接受 3 次怪兽契约',
    icon: '😈',
    category: 'story',
    reward: 60,
    progress: (s) => Math.min(1, s.monsterPacts / 3),
    isUnlocked: (s) => s.monsterPacts >= 3,
  },

  // ============= 特殊类 =============
  {
    id: 'element_master',
    name: '元素精通',
    description: '解锁全部 5 种元素',
    icon: '🌈',
    category: 'special',
    reward: 80,
    progress: (s) => Math.min(1, s.unlockedElements.length / 5),
    isUnlocked: (s) => s.unlockedElements.length >= 5,
  },
  {
    id: 'energy_max',
    name: '能量充盈',
    description: '能量达到 100 上限',
    icon: '🔋',
    category: 'special',
    reward: 20,
    progress: (s) => Math.min(1, s.energy / 100),
    isUnlocked: (s) => s.energy >= 100,
  },
  {
    id: 'flawless_5',
    name: '完美开局',
    description: '单局前 5 波未损失任何 HP',
    icon: '🛡️',
    category: 'special',
    reward: 80,
    progress: (s) => {
      if (s.hpLostInRun > 0) return 0;
      return Math.min(1, s.currentWave / 5);
    },
    isUnlocked: (s) => s.hpLostInRun === 0 && s.currentWave >= 5,
  },
];

export const ACHIEVEMENT_CATEGORIES: { id: AchievementCategory; name: string; icon: string; color: string }[] = [
  { id: 'kill', name: '击杀', icon: '⚔️', color: '#FF6B6B' },
  { id: 'wave', name: '波次', icon: '🌊', color: '#4ECDC4' },
  { id: 'combo', name: '连击', icon: '⚡', color: '#FFD166' },
  { id: 'skill', name: '技能', icon: '✨', color: '#9B59B6' },
  { id: 'story', name: '剧情', icon: '💝', color: '#E94560' },
  { id: 'special', name: '特殊', icon: '🏆', color: '#FFE66D' },
];

export function getAchievementById(id: AchievementId): AchievementDef | undefined {
  return ACHIEVEMENTS.find(a => a.id === id);
}
