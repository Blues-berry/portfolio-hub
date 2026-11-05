// 星核熔炉 - 核心类型定义

import { WaveEventConfig } from '@/data/events';
import { SkillId } from '@/data/skills';
import { DailyChallenge } from '@/data/dailyChallenge';
import { RuneDef } from '@/data/runes';
import { ActiveBond } from '@/data/bonds';

// ============= 元素 =============
export type ElementType = 'fire' | 'water' | 'earth' | 'air' | 'lightning';

// 星核进化分支 ID
export type EvolutionId =
  | 'inferno' | 'phoenix'        // 火
  | 'frost' | 'tsunami'          // 水
  | 'magma' | 'mountain'         // 土
  | 'storm' | 'gale'             // 风
  | 'thunder' | 'judgment';      // 雷

// 进化效果类型
export type EvolutionEffect =
  | 'splash'       // 溅射
  | 'revive'       // 复活
  | 'freeze'       // 冻结
  | 'aoe-slow'     // 范围减速
  | 'burn-aura'    // 灼烧光环
  | 'shield-aura'  // 护盾光环
  | 'chain-4'      // 连锁4次
  | 'atkspd-2x'    // 攻速翻倍
  | 'chain-lightning' // 链式闪电
  | 'execute';     // 斩杀

// 元素配置
export interface ElementConfig {
  id: ElementType;
  name: string;
  symbol: string;
  color: string;
  glow: string;
  damage: number;
  attackSpeed: number;   // 攻击次数/秒
  range: number;          // 攻击距离（格子数）
  description: string;
  special: {
    critChance?: number;
    slowAmount?: number;
    chain?: number;
    pierce?: number;
    reflect?: number;
  };
  evolution: {
    tier: number;
    branches: EvolutionBranch[];
  };
}

export interface EvolutionBranch {
  id: EvolutionId;
  name: string;
  description: string;
  effect: EvolutionEffect;
  color: string;
}

// ============= 星核 =============
export interface Orb {
  id: string;
  element: ElementType;
  tier: number;            // 1-5
  gridX: number;           // 0-5
  gridY: number;           // 0-6
  evolution?: EvolutionId;
  cooldown: number;        // 当前冷却
  attackInterval: number;  // 攻击间隔(ms)
  lastAttack: number;
  // 视觉/动画状态
  spawnTime: number;
  mergeAnimUntil?: number;
}

// ============= 敌人 =============
export type EnemyType =
  | 'grunt' | 'fast' | 'armored' | 'flyer' | 'elite' | 'boss' | 'swarm' | 'healer'
  | 'rift' | 'corrupt' | 'reaper' | 'maiden';

export interface EnemyConfig {
  type: EnemyType;
  name: string;
  baseHp: number;
  speed: number;          // 每秒移动比例
  damage: number;         // 触碰核心扣血
  armor?: number;          // 减伤百分比
  onlyHitBy?: ElementType[]; // 只受特定元素攻击（飞行）
  color: string;
  size: number;
  reward: number;          // 星尘奖励
  healAura?: number;        // 治疗光环（每秒治疗量）
  healRadius?: number;      // 治疗范围
  teleport?: {              // 瞬移能力
    interval: number;       // 每次瞬移间隔(ms)
    distance: number;       // 瞬移距离（position 增量）
  };
  splitOnDeath?: {          // 死亡时分裂
    type: EnemyType;
    count: number;
  };
  weakTo?: ElementType[];   // 弱点元素（受其攻击伤害 ×1.5）
  resist?: ElementType[];   // 抗性元素（受其攻击伤害 ×0.5）
  description?: string;
}

export interface StatusEffect {
  type: 'slow' | 'burn' | 'freeze' | 'shock';
  duration: number;       // 剩余ms
  value: number;
  source?: string;
}

export interface Enemy {
  id: string;
  type: EnemyType;
  hp: number;
  maxHp: number;
  position: number;       // 0-1 沿轨道
  speed: number;
  effects: StatusEffect[];
  hitFlash: number;       // 受击闪烁剩余时间
  reward: number;
  teleportCooldown?: number;  // 瞬移冷却剩余时间(ms)
}

// ============= 遗物 =============
export type RelicRarity = 'common' | 'rare' | 'epic' | 'legendary';

export type RelicEffectType =
  | 'shop-discount'
  | 'synergy-boost'
  | 'evolution-reroll'
  | 'orb-split'
  | 'enemy-slow'
  | 'atkspd-boost'
  | 'damage-boost'
  | 'hp-regen'
  | 'crit-boost'
  | 'stardust-boost'
  | 'extra-orb'
  | 'shield';

export interface RelicEffect {
  type: RelicEffectType;
  value: number;
}

export interface Relic {
  id: string;
  name: string;
  description: string;
  rarity: RelicRarity;
  effects: RelicEffect[];
  icon: string;
}

// ============= 波次 =============
export interface WaveSpawn {
  type: EnemyType;
  count: number;
  interval: number;     // 间隔ms
  delay: number;        // 起始延迟
}

export interface WaveConfig {
  wave: number;
  spawns: WaveSpawn[];
  reward: number;        // 星尘
  isBoss?: boolean;
}

// ============= 商店 =============
export interface ShopItem {
  id: string;
  kind: 'orb' | 'relic' | 'reroll' | 'heal';
  element?: ElementType;
  tier?: number;
  relic?: Relic;
  price: number;
}

// ============= 共鸣 =============
export interface SynergyConfig {
  key: string;
  elements: [ElementType, ElementType];
  name: string;
  description: string;
  effect: 'aura-damage' | 'ground-burn' | 'chain-double' | 'strong-slow' | 'atkspd-boost';
  value: number;
  radius: number;
}

export interface ActiveSynergy {
  config: SynergyConfig;
  positions: { x: number; y: number }[];  // 触发位置
  level: number;
}

// ============= 游戏状态 =============
export type GameStatus =
  | 'tutorial'         // first-run or manual tutorial; simulation is paused
  | 'wave-intro'
  | 'playing'
  | 'paused'           // 暂停
  | 'shop'
  | 'relic-select'
  | 'evolution-select'
  | 'wave-clear'
  | 'dead'
  | 'victory'
  | 'scene-change'      // 场景切换动画
  | 'maiden-visit'      // 少女登场对话
  | 'maiden-pact'       // 少女契约选择
  | 'monster-intro'     // 怪兽登场
  | 'monster-pact'      // 怪兽契约选择
  | 'monster-defeated'; // 怪兽被击败对话

// 剧情事件类型
export type StoryEvent =
  | { kind: 'scene-change'; fromScene: string; toScene: string; wave: number }
  | { kind: 'maiden-visit'; maidenId: string; isFirstTime: boolean }
  | { kind: 'maiden-pact'; maidenId: string }
  | { kind: 'monster-intro'; monsterId: string; wave: number }
  | { kind: 'monster-pact'; monsterId: string }
  | { kind: 'monster-defeated'; monsterId: string };

export interface GameState {
  grid: (Orb | null)[][];        // [y][x] = grid[y][x]
  enemies: Enemy[];
  projectiles: Projectile[];
  particles: Particle[];
  synergies: ActiveSynergy[];
  wave: number;
  hp: number;
  maxHp: number;
  stardust: number;
  currentElement: ElementType;
  availableElements: ElementType[];
  status: GameStatus;
  prevStatus: GameStatus | null;     // 暂停前状态（用于恢复）
  waveClearTime: number;             // 波次清除时间戳（用于结算面板显示）
  waveStartKillCount: number;        // 该波开始时的击杀数（用于计算本波击杀）
  waveStartStardust: number;         // 该波开始时的星尘数（用于计算本波获得）
  currentEvent: WaveEventConfig | null;  // 当前波次事件（null 表示普通波）
  eventTimer: number;                // 事件周期效果计时器（ms）
  // 主动技能系统
  deploymentCharge: number; // 0–6; one charge per placement
  energy: number;                   // 当前能量（0-100）
  skillCooldowns: Record<SkillId, number>;  // 各技能剩余冷却（ms）
  // 成就追踪（本局）
  bestCombo: number;                // 本局最高连击
  runSkillUses: SkillId[];         // 本局使用过的技能
  hpLostInRun: number;             // 本局累计损失 HP
  // 日常挑战
  currentChallenge: DailyChallenge | null;  // 当前挑战配置（null = 普通模式）
  // 符文系统：本局装备的符文定义（从 runeStore 同步过来，避免运行时跨 store 调用）
  activeRunes: RuneDef[];
  // 星核羁绊系统：当前激活的羁绊列表（tick 中节流重算）
  activeBonds: ActiveBond[];
  // 天赋系统：本局生效的已解锁天赋 ID 列表（从 metaStore 同步）
  unlockedTalents: string[];
  shopItems: ShopItem[];
  relicChoices: Relic[] | null;
  pendingEvolution: { orbId: string; branches: EvolutionBranch[] } | null;
  ownedRelics: Relic[];
  rerollsLeft: number;
  killCount: number;
  startTime: number;
  score: number;
  comboTimer: number;
  combo: number;
  screenShake: number;
  waveStartTime: number;
  // 剧情系统字段
  currentScene: string;             // 当前场景 ID
  pendingStory: StoryEvent | null;  // 待处理的剧情事件
  maidenAffinity: Record<string, number>;  // 少女好感度 { maidenId: affinity }
  seenMaidens: string[];            // 已见过的少女 ID
  corruption: number;              // 堕落值（0-100）
  currentMaidenId: string | null;   // 当前出场的少女
  currentMonsterId: string | null; // 当前对峙的怪兽
}

// ============= 投射物 & 粒子 =============
export interface Projectile {
  id: string;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  speed: number;
  damage: number;
  element: ElementType;
  color: string;
  pierce: number;
  chainLeft: number;
  hitEnemies: Set<string>;
  isCrit: boolean;
}

export interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  kind: 'spark' | 'merge' | 'explosion' | 'trail' | 'damage-text';
  text?: string;
  gravity?: number;
}

// ============= 永久元进度 =============
export interface MetaUnlocks {
  startHp: number;
  startStardust: number;
  extraRerolls: number;
  startRelicSlots: number;
  unlockedElements: ElementType[];
}

export interface MetaProgress {
  totalStardust: number;
  bestWave: number;
  bestScore: number;
  totalKills: number;
  totalRuns: number;
  unlocks: MetaUnlocks;
  achievements: string[];
}

// 升级项定义
export interface MetaUpgrade {
  id: string;
  name: string;
  description: string;
  icon: string;
  cost: number;
  maxLevel: number;
  apply: (meta: MetaProgress) => void;
}

// ============= 配置常量 =============
export const GRID_WIDTH = 6;
export const GRID_HEIGHT = 7;
export const MAX_TIER = 5;
export const EVOLUTION_TIER = 3;
export const STARTING_HP = 3;
export const STARTING_STARDUST = 30;
