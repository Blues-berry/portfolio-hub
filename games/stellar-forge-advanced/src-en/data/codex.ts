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
  { id: 'enemy',   name: 'Enemy',     icon: '⚔️', color: '#E74C3C' },
  { id: 'maiden',  name: 'Star Core Guardians', icon: '💫', color: '#FF6B6B' },
  { id: 'monster', name: 'Void Monster', icon: '🌑', color: '#9B59B6' },
  { id: 'relic',   name: 'Relic',     icon: '🏺', color: '#FFD166' },
  { id: 'element', name: 'Element',     icon: '🌟', color: '#4ECDC4' },
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
  grunt:   'The soldiers at the lowest level of the void. They have no consciousness, only endless hunger. After countless adventurers fell, they devoured star core fragments and continued to grow.',
  fast:    'It is condensed by the extremely fast flow of void energy. Their bodies are fragile, but their speed is elusive—unless you can use the power of running water to slow them down.',
  armored: 'Wearing obsidian armor stripped from fallen stars. Normal attacks will be deflected, and only the power of the thick earth can shake its armor.',
  flyer:   'Inhabiting the void storm, it can only be touched by elements that also fly. Storm and thunder are their natural enemies.',
  elite:   'The evil thoughts born in the void condensed into form. They dominate low-level enemies, and only Thunder Punishment can penetrate their armor.',
  boss:    'An ancient existence that swallowed countless star cores. Every time it roars, time and space tremble, and it is the greatest fear for adventurers.',
  swarm:   'A small zerg race hatched from a corrupted star core. Individually weak, they overwhelm their enemies with their numbers - fire being their natural enemy.',
  healer:  'Void priests can communicate with void spirits. Their healing aura will continuously restore health to surrounding enemies, and their spells must be broken with the power of thunder.',
  rift:    'A monster that can tear apart space. They cannot be locked when teleporting, and only Thunder\'s chain tracking can lock their trajectory.',
  corrupt: 'A star core deeply corrupted by the void. They split into smaller swarms when they die and require complete purification with pure water.',
  reaper:  'The deadliest hunter in the void. They collide with the star core at an alarming speed, and only the gravity of the earth can stop them.',
  maiden:  'Her power is still there, but she can never turn back...',
};

// ============= 少女补充背景 =============
const MAIDEN_LORE: Record<MaidenId, string> = {
  pyra:  'Flame, the guardian of the flaming heart. She has an arrogant personality, but she deeply cherishes the inheritance of the Star Core. When she unleashes her true power, the entire void will be ablaze with her fire.',
  nami:  'Lian, the girl whose still water runs deep. She didn\'t speak much, but every word she spoke was full of affection. She had guarded this void alone for thousands of years, until you appeared.',
  terra: 'Rock, the guardian of the Heart of Rock. She calls herself the eldest sister, with a rough appearance but a kind heart. Her shield can block any wind and rain, but only those who are truly recognized by her can feel her gentle side.',
  gale:  'Wind, the embodiment of wings of freedom. She is full of energy and always looking for new adventures. She treats fighting like a game, but when she gets serious, her speed is unmatched.',
  volt:  'Thunder, the executor of God\'s judgment. She is arrogant and mysterious, as if she is always judging something. Her words are as heavy as thunder, but if you can get her to acknowledge them, you can gain divine power.',
};

// ============= 怪兽补充背景 =============
const MONSTER_LORE: Record<MonsterId, string> = {
  'void-devourer': 'The Abyss Eater, the incarnation of the Mouth of the Void. Countless tentacles stretched out from the void, and each eye reflected the wail of the falling stars. Its hunger never ends, and only the power of the star core can make it fall asleep temporarily.',
  'rift-weaver':   'The Voidweaver, the Mother of Rifts. She weaves countless time and space rifts in the void, each thread leading to a different death. Her web will never break until the day her destiny is rewritten.',
  'final-eye':     'The Eye of Finality, the judge of the universe. It is suspended in the center of the void, with the past, present and future reflected in its pupils. Under its gaze, all destinies are written—except those mortals who can rewrite them.',
  'star-eater':    'Star Eater, the end of all things. It is not a living thing, but the embodiment of the void itself. It devours light, devours stars, devours hope. It is said that when it truly awakens, the entire universe will be reduced to nothingness.',
};

// ============= 遗物补充背景 =============
const RELIC_LORE: Record<string, string> = {
  'greedy-heart':    'An ancient coin that can sense the pulse of stardust. Businessmen made fortunes from it, and eventually fell from it.',
  'time-warp':       'A pocket watch forgotten by time. The hands always stop at a certain moment - legend has it that it is the moment of the end of the world.',
  'stardust-magnet': 'The core of the fallen star. It is still eager to return to the starry sky, so it will actively attract stardust to come closer.',
  'orb-generator':   'A device left behind by ancient guardians. As long as it is given energy, it can condense new star cores from the void.',
  'sharp-edge':      'An ancient blade made of meteorite. Even if its master dies, it remains as sharp as ever.',
  'swift-cog':       'A gear that never stops. The faster it spins, the faster the owner\'s response.',
  'lucky-charm':     'It is said to be a talisman for a lucky person. The person who wears it can always turn danger into good fortune at critical moments.',
  // 其他遗物使用默认 lore
};

const DEFAULT_RELIC_LORE = 'A relic that holds mysterious power. Its origin is unknown, but the assistance it gives its user in battle is real.';

// ============= 元素补充背景 =============
const ELEMENT_LORE: Record<ElementType, string> = {
  fire:      'The element of fire, the hottest existence. It represents destruction as well as rebirth. When it burns completely, even the void will be ignited.',
  water:     'The element of water is both soft and strong. It can purify all corruption, and can also turn into a raging wave to swallow the enemy in an instant.',
  earth:     'The element of rock, the foundation of all things. Its stability allows the world to exist, and its thickness stops all threats.',
  air:       'The element of wind, the spirit of freedom. It is invisible and formless, but it can tear the sky apart in an instant.',
  lightning: 'The element of thunder, the judgment of God. It represents the will of the universe, and every lightning bolt is an echo of judgment.',
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
      description: e.description || `HP ${e.baseHp} · SPEED ${(e.speed * 1000).toFixed(0)}/s · damage ${e.damage}`,
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
      description: `${m.title} · ${m.element} Elemental Guardian`,
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
      description: `${m.title} · Triggered on ${m.triggerWave} Wave`,
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
      description: `${el.description} · Damage ${el.damage} · Attack speed ${el.attackSpeed}/s · Range ${el.range}`,
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
