// 图鉴系统 - 星核收藏馆
// 整合敌人、少女、怪兽、遗物、元素 5 大类条目
import { ENEMIES } from './enemies';
import { MAIDENS, MONSTERS, MaidenId, MonsterId } from './story';
import { ELEMENTS } from './elements';
import { RELICS } from './relics';
import { EnemyType, ElementType, RelicRarity } from '@/types/game';

// 根据 rarity 推断遗物颜色
const RARITY_COLOR: Record<RelicRarity, string> = {
  common: '#9CA3AF',
  rare: '#4ECDC4',
  epic: '#C9A26B',
  legendary: '#FFD166',
};

// ============= 类型定义 =============
export type CodexCategory = 'enemy' | 'maiden' | 'monster' | 'relic' | 'element';

export interface CodexEntry {
  id: string;                    // 唯一 ID（带前缀：enemy_, maiden_, monster_, relic_, element_）
  category: CodexCategory;
  name: string;
  icon: string;
  color: string;
  rarity?: string;              // 遗物的稀有度
  description: string;          // 简短描述（属性/能力）
  lore: string;                 // 背景故事
  hidden?: boolean;             // 是否隐藏（Boss/少女等剧情角色），未遇到前显示为 ???
  triggerWave?: number;         // 触发波次（剧情角色）
}

export interface CodexCategoryMeta {
  id: CodexCategory;
  name: string;
  icon: string;
  color: string;
}

// ============= 分类元信息 =============
export const CODEX_CATEGORIES: CodexCategoryMeta[] = [
  { id: 'enemy',   name: '敌人',     icon: '⚔️', color: '#E74C3C' },
  { id: 'maiden',  name: '星核少女', icon: '💫', color: '#FF6B6B' },
  { id: 'monster', name: '虚空怪兽', icon: '🌑', color: '#9B59B6' },
  { id: 'relic',   name: '遗物',     icon: '🏺', color: '#FFD166' },
  { id: 'element', name: '元素',     icon: '🌟', color: '#4ECDC4' },
];

// ============= 敌人 emoji 与背景故事 =============
const ENEMY_EMOJI: Record<EnemyType, string> = {
  grunt:   '👾',
  fast:    '🗡️',
  armored: '🛡️',
  flyer:   '🦇',
  elite:   '👹',
  boss:    '🐉',
  swarm:   '🐝',
  healer:  '⚗️',
  rift:    '🌀',
  corrupt: '🌑',
  reaper:  '💀',
  maiden:  '👹',
};

const ENEMY_LORE: Record<EnemyType, string> = {
  grunt:   '虚空最底层的杂兵。它们没有意识，只有无尽的饥饿。无数冒险者倒下后，它们吞噬星核碎片不断壮大。',
  fast:    '由虚空能量的极速流动凝聚而成。它们的躯体脆弱，但速度快得难以捕捉——除非你能用流水的力量让它们慢下来。',
  armored: '披戴着从陨落星辰上剥下的黑曜装甲。普通攻击会被弹开，唯有厚重的大地之力能撼动它的护甲。',
  flyer:   '栖息于虚空风暴之中，只能被同样飞行的元素触及。风暴与雷霆是它们的天敌。',
  elite:   '虚空中诞生的恶念凝聚成形体。它们统御低阶敌人，唯有雷罚能贯穿其护甲。',
  boss:    '吞噬了无数星核的远古存在。它的每一次咆哮都让时空战栗，是冒险者最大的恐惧。',
  swarm:   '从腐化星核中孵化的小型虫族。个体弱小，但它们以数量淹没敌人——火焰是它们的天敌。',
  healer:  '虚空祭司，能与虚空之灵沟通。它们的治疗光环会让周遭敌人持续回血，必须用雷霆之力断其咒语。',
  rift:    '能撕裂空间的怪物。它们瞬移时无法被锁定，唯有雷电的链式追踪能锁定其轨迹。',
  corrupt: '被虚空深度腐化的星核。它们在死亡时会分裂成更小的虫群，需要纯净之水彻底净化。',
  reaper:  '虚空中最致命的猎手。它们以惊人速度冲撞星核，唯有重力的大地能让它们停下脚步。',
  maiden:  '曾经守护星核的少女，如今被虚空彻底吞噬。她的力量依然存在，只是再也无法回头...',
};

// ============= 少女补充背景 =============
const MAIDEN_LORE: Record<MaidenId, string> = {
  pyra:  '焰，炽炎之心的守护者。她性格傲娇，但内心极度珍视星核的传承。当她绽放真正的力量时，整片虚空都会被她的火焰点燃。',
  nami:  '涟，静水流深的少女。她话语不多，但每一句都饱含深情。她曾独自守护这片虚空千百年，直到你出现。',
  terra: '岩，磐石之心的守护者。她自称大姐头，外表粗犷但心地善良。她的盾可挡下任何风雨，但只有真正被她认可的人才能感受到她温柔的一面。',
  gale:  '风，自由之翼的化身。她活力四射，永远在追逐新的冒险。她把战斗当成游戏，但当她真正认真起来时，速度无人能及。',
  volt:  '雷，神之裁决的执行者。她高傲而神秘，仿佛永远在审判着什么。她的话语如雷霆般沉重，但若你能让她认可，便能获得神之力。',
};

// ============= 怪兽补充背景 =============
const MONSTER_LORE: Record<MonsterId, string> = {
  'void-devourer': '渊噬者，虚空之口的化身。无数触手从虚空中伸出，每一只眼睛都映照着陨落星辰的哀嚎。它饥饿永不止息，唯有星核的力量能让它暂时沉睡。',
  'rift-weaver':   '虚空织者，裂隙之母。她在虚空中编织着无数时空裂隙，每一根丝线都通向不同的死亡。她的网永不断裂，直到命运被改写的那一天。',
  'final-eye':     '终焉之眼，宇宙的审判者。它悬浮于虚空中央，瞳孔中倒映着过去、现在与未来。在它的注视下，所有命运都被书写——除了那些能改写命运的凡人。',
  'star-eater':    '噬星者，万物的终结。它不是生物，而是虚空本身的化身。它吞噬光芒、吞噬星辰、吞噬希望。据说当它真正苏醒时，整个宇宙都将归于虚无。',
};

// ============= 遗物补充背景 =============
const RELIC_LORE: Record<string, string> = {
  'greedy-heart':    '一枚能感知星尘脉动的古老硬币。商人曾因它致富，最终也因它而堕落。',
  'time-warp':       '被时间遗忘的怀表。指针永远停在某个特定的瞬间——传说那是世界末日的时刻。',
  'stardust-magnet': '陨落星辰的核心。它仍在渴望着回归星空，所以会主动吸引星尘靠近。',
  'orb-generator':   '古代守护者留下的装置。只要给予能量，它就能从虚空中凝聚出新的星核。',
  'sharp-edge':      '由陨铁打造的古老刀刃。即使主人陨落，它依然锋利如初。',
  'swift-cog':       '一台永不停歇的齿轮。它的转速越快，主人的反应也越快。',
  'lucky-charm':     '据说是某位幸运儿的护身符。佩戴它的人总能在关键时刻逢凶化吉。',
  // 其他遗物使用默认 lore
};

const DEFAULT_RELIC_LORE = '一件蕴含神秘力量的遗物。它的来历已不可考，但它在战斗中给予使用者的助力是真实存在的。';

// ============= 元素补充背景 =============
const ELEMENT_LORE: Record<ElementType, string> = {
  fire:      '炎之元素，最炽热的存在。它代表毁灭，也代表重生。当它彻底燃烧时，连虚空都会被点燃。',
  water:     '水之元素，至柔至刚。它能净化一切腐化，亦能在瞬间化为怒涛吞噬敌人。',
  earth:     '岩之元素，万物之基。它的稳定让世界得以存在，它的厚重让一切威胁止步。',
  air:       '风之元素，自由之灵。它无形无相，却能在瞬息之间撕裂天空。',
  lightning: '雷之元素，神之裁决。它代表着宇宙的意志，每一道闪电都是审判的回响。',
};

// ============= 构建图鉴条目 =============
function buildEntries(): CodexEntry[] {
  const entries: CodexEntry[] = [];

  // 敌人（隐藏 Boss 和 Maiden）
  for (const e of Object.values(ENEMIES)) {
    entries.push({
      id: `enemy_${e.type}`,
      category: 'enemy',
      name: e.name,
      icon: ENEMY_EMOJI[e.type],
      color: e.color,
      description: e.description || `HP ${e.baseHp} · 速度 ${(e.speed * 1000).toFixed(0)}/s · 伤害 ${e.damage}`,
      lore: ENEMY_LORE[e.type],
      hidden: e.type === 'boss' || e.type === 'maiden',
    });
  }

  // 少女
  for (const m of Object.values(MAIDENS)) {
    entries.push({
      id: `maiden_${m.id}`,
      category: 'maiden',
      name: m.name,
      icon: m.emoji,
      color: m.color,
      description: `${m.title} · ${m.element} 元素守护者`,
      lore: MAIDEN_LORE[m.id],
      hidden: true,
    });
  }

  // 怪兽
  for (const m of MONSTERS) {
    entries.push({
      id: `monster_${m.id}`,
      category: 'monster',
      name: m.name,
      icon: m.emoji,
      color: m.color,
      description: `${m.title} · 触发于第 ${m.triggerWave} 波`,
      lore: MONSTER_LORE[m.id],
      hidden: true,
      triggerWave: m.triggerWave,
    });
  }

  // 遗物
  for (const r of RELICS) {
    entries.push({
      id: `relic_${r.id}`,
      category: 'relic',
      name: r.name,
      icon: r.icon,
      color: RARITY_COLOR[r.rarity] || '#9CA3AF',
      rarity: r.rarity,
      description: r.description,
      lore: RELIC_LORE[r.id] || DEFAULT_RELIC_LORE,
      hidden: false,  // 遗物不隐藏，但未获得时显示为剪影
    });
  }

  // 元素
  for (const el of Object.values(ELEMENTS)) {
    entries.push({
      id: `element_${el.id}`,
      category: 'element',
      name: el.name,
      icon: el.symbol,
      color: el.color,
      description: `${el.description} · 伤害 ${el.damage} · 攻速 ${el.attackSpeed}/s · 射程 ${el.range}`,
      lore: ELEMENT_LORE[el.id],
      hidden: el.id !== 'fire',  // 默认只有火元素已解锁，其他需解锁后才在图鉴显示
    });
  }

  return entries;
}

export const CODEX_ENTRIES: CodexEntry[] = buildEntries();

// 通过 ID 快速查找
export const CODEX_BY_ID: Record<string, CodexEntry> = Object.fromEntries(
  CODEX_ENTRIES.map(e => [e.id, e])
);

// 统计各类别条目数
export function getCategoryCount(category: CodexCategory): number {
  return CODEX_ENTRIES.filter(e => e.category === category).length;
}

// 总条目数
export const TOTAL_ENTRIES = CODEX_ENTRIES.length;
