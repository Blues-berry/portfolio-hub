// 剧情系统 - 星核少女 + 虚空怪兽
import { ElementType } from '@/types/game';

// ============= 星核少女 =============
export type MaidenId = 'pyra' | 'nami' | 'terra' | 'gale' | 'volt';

export interface MaidenConfig {
  id: MaidenId;
  name: string;
  title: string;
  element: ElementType;
  color: string;
  accent: string;
  emoji: string;
  // 立绘描述（无真实美术，用 emoji + 渐变模拟）
  portrait: {
    hairColor: string;
    eyeColor: string;
    outfitColor: string;
    symbol: string;
  };
  // 性格台词
  introLines: string[];      // 初次登场
  greetLines: string[];      // 已见过
  giftLines: string[];       // 收到礼物
  pactLines: string[];       // 缔结契约
  // 提供的能力（好感度阈值激活）
  boons: {
    threshold: number;       // 好感度阈值
    name: string;
    description: string;
    effect: 'damage-boost' | 'atkspd-boost' | 'crit-boost' | 'stardust-boost' | 'enemy-slow' | 'shield';
    value: number;
  }[];
}

export const MAIDENS: Record<MaidenId, MaidenConfig> = {
  pyra: {
    id: 'pyra',
    name: 'Pyra',
    title: 'Heart of Flame',
    element: 'fire',
    color: '#FF6B6B',
    accent: '#FF8E8E',
    emoji: '🔥',
    portrait: {
      hairColor: '#FF4500',
      eyeColor: '#FFD166',
      outfitColor: '#8B0000',
      symbol: '🔥',
    },
    introLines: [
      'You really stepped into the Void Gate? Either you are fearless or not very bright.',
      'I am Pyra, guardian of the Star Core. Do not get the wrong idea. I am only curious about what you can do.',
      'Eyes on the enemy. Show me what you are made of.',
    ],
    greetLines: [
      'Back again? I admire your persistence.',
      'Ready for another run? Try not to make a mess of it.',
      'What have you brought me this time?',
    ],
    giftLines: [
      'W-what is this for? I am not thanking you or anything.',
      'Well, since you insist, I will accept it.',
      'Do not get the wrong idea. I just happen to like this.',
    ],
    pactLines: [
      'Will you make a Star Core pact with me? A bond like this only happens once.',
      'Then my flame will protect you, all the way to the end of the universe.',
    ],
    boons: [
      { threshold: 30, name: 'Blessing of Fire', description: 'Damage +15%', effect: 'damage-boost', value: 0.15 },
      { threshold: 60, name: 'Blazing Embrace', description: 'Attack speed +20%', effect: 'atkspd-boost', value: 0.20 },
      { threshold: 100, name: 'Eternal Contract', description: 'Immunity to one death', effect: 'shield', value: 1 },
    ],
  },
  nami: {
    id: 'nami',
    name: 'Ripple',
    title: 'Still Waters Run Deep',
    element: 'water',
    color: '#4ECDC4',
    accent: '#7FE5DD',
    emoji: '💧',
    portrait: {
      hairColor: '#1ABC9C',
      eyeColor: '#A8E6FF',
      outfitColor: '#0E5E5E',
      symbol: '💧',
    },
    introLines: [
      '...Hello. I am Ripple. Please do not stare for too long.',
      'This part of the Void was once an ocean. I have watched over it for a very long time.',
      'If you are tired, take a moment to rest. I will be here.',
    ],
    greetLines: [
      'You came back. ...I was hoping you would.',
      'You look well. Please be careful out there.',
      'Your eyes seem brighter. You have grown stronger.',
    ],
    giftLines: [
      'Oh... thank you. I will treasure it.',
      'You are always so thoughtful. This makes me happy.',
      'This is for me? Are you sure?',
    ],
    pactLines: [
      'A pact...? ...Yes. I would like that.',
      'From now on, I will stay by your side through every rise and fall.',
    ],
    boons: [
      { threshold: 30, name: 'Ripple blessing', description: 'Enemy movement speed -15%', effect: 'enemy-slow', value: 0.15 },
      { threshold: 60, name: 'Deep Sea Echo', description: 'Stardust +30%', effect: 'stardust-boost', value: 0.30 },
      { threshold: 100, name: 'Eternal Tide', description: 'Immunity to one death', effect: 'shield', value: 1 },
    ],
  },
  terra: {
    id: 'terra',
    name: 'Terra',
    title: 'Heart of Stone',
    element: 'earth',
    color: '#C9A26B',
    accent: '#E0BC85',
    emoji: '🪨',
    portrait: {
      hairColor: '#8B7355',
      eyeColor: '#D4A574',
      outfitColor: '#5D4E2C',
      symbol: '🪨',
    },
    introLines: [
      'Hmph. Another challenger for the Void? You can call me big sis.',
      'Name is Terra. If trouble finds you, come to me.',
      'What are you looking at? I am more reliable than I look.',
    ],
    greetLines: [
      'Back already? Good. Every run makes you tougher.',
      'You seem ready. Give it your best today.',
      'Lost again? Do not worry. You will get them next time.',
    ],
    giftLines: [
      'Oh, this is nice. Thanks.',
      'You thought of me? That is sweet.',
      'All right, I will take it. No need to be shy.',
    ],
    pactLines: [
      'A pact? You really know how to ask. All right, I am in.',
      'From now on, my strength will shield you from every storm.',
    ],
    boons: [
      { threshold: 30, name: 'Shield of Rock', description: 'Damage +10%', effect: 'damage-boost', value: 0.10 },
      { threshold: 60, name: 'Mountain Power', description: 'Attack speed +15%, damage +10%', effect: 'atkspd-boost', value: 0.15 },
      { threshold: 100, name: 'Heart of Rock', description: 'Immunity to one death', effect: 'shield', value: 1 },
    ],
  },
  gale: {
    id: 'gale',
    name: 'Gale',
    title: 'Wings of Freedom',
    element: 'air',
    color: '#95E1D3',
    accent: '#B5F1E3',
    emoji: '🌀',
    portrait: {
      hairColor: '#66FFCC',
      eyeColor: '#A8FFEE',
      outfitColor: '#1F7F6F',
      symbol: '🌀',
    },
    introLines: [
      'Whoa! You are the challenger? This is going to be fun!',
      'I am Gale, the fastest wind in the Void. Want to race?',
      'Come on, let us take on those monsters together!',
    ],
    greetLines: [
      'You are back! What are we doing today?',
      'I have been waiting. Let us get moving!',
      'You look even more confident today!',
    ],
    giftLines: [
      'For me? This is amazing!',
      'Hehe, you are my favorite!',
      'I will keep it safe. Thank you!',
    ],
    pactLines: [
      'A pact? Sounds exciting. I am in!',
      'From now on, I will be the wind beneath your wings. Let us fly together!',
    ],
    boons: [
      { threshold: 30, name: 'Blessing of the Wind', description: 'Attack speed +18%', effect: 'atkspd-boost', value: 0.18 },
      { threshold: 60, name: 'Wind Blade', description: 'Critical +15%', effect: 'crit-boost', value: 0.15 },
      { threshold: 100, name: 'Eternal Wind', description: 'Immunity to one death', effect: 'shield', value: 1 },
    ],
  },
  volt: {
    id: 'volt',
    name: 'Volt',
    title: 'Storm Judge',
    element: 'lightning',
    color: '#FFE66D',
    accent: '#FFF099',
    emoji: '⚡',
    portrait: {
      hairColor: '#FFD700',
      eyeColor: '#FFFFCC',
      outfitColor: '#4D4D00',
      symbol: '⚡',
    },
    introLines: [
      '...Mortal. Can you withstand the force of the storm?',
      'I am Volt, keeper of the Void\'s final judgment. Do not disappoint me.',
      'Fate is written in lightning. Only you can decide whether to change it.',
    ],
    greetLines: [
      'Back again? You survived the last trial.',
      'Mortal, are you ready for the next test?',
      'You continue to exceed my expectations.',
    ],
    giftLines: [
      'A gift? What is the meaning of this, mortal?',
      '...Hmph. Since you insist, I will accept it.',
      'Your sincerity is clear. Thank you.',
    ],
    pactLines: [
      'Do you seek a pact with me? Mortal, do you understand what it demands?',
      '...Very well. From this moment on, we face the storm as one.',
    ],
    boons: [
      { threshold: 30, name: 'Thunder Fury', description: 'Critical +20%', effect: 'crit-boost', value: 0.20 },
      { threshold: 60, name: 'God\'s Judgment', description: 'Damage +25%', effect: 'damage-boost', value: 0.25 },
      { threshold: 100, name: 'Eternal Thunder Punishment', description: 'Immunity to one death', effect: 'shield', value: 1 },
    ],
  },
};

// ============= 虚空怪兽 =============
export type MonsterId = 'void-devourer' | 'rift-weaver' | 'final-eye' | 'star-eater';

export interface MonsterConfig {
  id: MonsterId;
  name: string;
  title: string;
  color: string;
  accent: string;
  emoji: string;
  // 触发波次（Boss 波）
  triggerWave: number;
  // 形态描述
  form: string;
  // 对话
  introLines: string[];
  threatLines: string[];
  defeatLines: string[];
  // 黑暗契约
  pact: {
    title: string;
    description: string;
    // 接受契约的代价
    cost: {
      hp?: number;
      stardust?: number;
    };
    // 获得的遗物（id 由 relics.ts 中查找）
    rewardRelicId: string;
    // 接受后增加的堕落值
    corruption: number;
  };
}

export const MONSTERS: MonsterConfig[] = [
  {
    id: 'void-devourer',
    name: 'The Devourer',
    title: 'Mouth of the Void',
    color: '#8E44AD',
    accent: '#9B59B6',
    emoji: '🐙',
    triggerWave: 5,
    form: 'Massive purple tentacles reach out of the Void as countless eyes glimmer in the dark.',
    introLines: [
      'Mortal... how dare you enter my domain?',
      'Taste the Void! Your Star Core will be my next meal!',
      'You thought you came here to challenge me? No. You came here to feed me!',
    ],
    threatLines: [
      'Devour! Consume everything!',
      'Your Star Core... tastes exquisite.',
      'You think you can hurt me? How ridiculous.',
    ],
    defeatLines: [
      'No... impossible. I have been defeated?',
      'You win this time. But something far worse waits in the depths of the Void.',
    ],
    pact: {
      title: 'Covenant in the Abyss',
      description: 'Gain Abyssal Core: +25% damage and +30% Stardust. Lose 1 HP.',
      cost: { hp: 1 },
      rewardRelicId: 'void-heart',
      corruption: 25,
    },
  },
  {
    id: 'rift-weaver',
    name: 'Voidweaver',
    title: 'Mother of Rifts',
    color: '#16A085',
    accent: '#1ABC9C',
    emoji: '🕷️',
    triggerWave: 10,
    form: 'A silver spider weaves rifts through the Void, each thread opening a passage through space and time.',
    introLines: [
      'Foolish challenger... you think you can cross the rift?',
      'Every thread I weave binds another strand of your fate.',
      'Look closely. Every rift leads to your downfall.',
    ],
    threatLines: [
      'Feel the edge of fate!',
      'In my web, you are nothing but prey.',
      'Struggle all you like. You will only tighten the web around yourself.',
    ],
    defeatLines: [
      'My web... has been severed?',
      'This is not the end. The threads of fate cannot be broken...',
    ],
    pact: {
      title: 'Rift Contract',
      description: 'Gain Void Web: +30% attack speed and +15% critical chance. Lose 30 Stardust.',
      cost: { stardust: 30 },
      rewardRelicId: 'overclock',
      corruption: 40,
    },
  },
  {
    id: 'final-eye',
    name: 'Eye of Finality',
    title: 'Judge of the Universe',
    color: '#C0392B',
    accent: '#E74C3C',
    emoji: '👁️',
    triggerWave: 15,
    form: 'A colossal red eye hangs in the Void, reflecting countless fallen stars.',
    introLines: [
      'I have seen everything: your past, your present, your future.',
      'You are not challenging me, mortal. You are walking the path I foresaw.',
      'Open your eyes. This is the end of the universe.',
    ],
    threatLines: [
      'I can see your fear.',
      'I have already written your fate.',
      'Look upon the end I have chosen for you!',
    ],
    defeatLines: [
      'Impossible... I never saw this future.',
      'You... changed your fate?',
    ],
    pact: {
      title: 'Doomsday Promise',
      description: 'Gain Eye of the End: +35% damage and slow enemies by 30%. Lose 2 HP.',
      cost: { hp: 2 },
      rewardRelicId: 'frost-crown',
      corruption: 60,
    },
  },
  {
    id: 'star-eater',
    name: 'Star Eater',
    title: 'End of All Things',
    color: '#000000',
    accent: '#1A0000',
    emoji: '🌑',
    triggerWave: 20,
    form: 'A lightless void consumes everything around it. Even the glow of a Star Core cannot escape.',
    introLines: [
      '...',
      '...',
      'You have come at last.',
    ],
    threatLines: [
      '...',
      '......',
      '............',
    ],
    defeatLines: [
      'So this is what the end feels like.',
      'Thank you... for finally letting me rest.',
    ],
    pact: {
      title: 'Ultimate Contract',
      description: 'Gain the Core of Nothingness and greatly increase all attributes. Lose half your current HP.',
      cost: { hp: 99 },
      rewardRelicId: 'singularity',
      corruption: 100,
    },
  },
];

export function getMonsterByWave(wave: number): MonsterConfig | null {
  return MONSTERS.find(m => m.triggerWave === wave) || null;
}

// 根据当前可用元素选择出场少女
export function pickMaidenByElements(availableElements: ElementType[]): MaidenConfig {
  for (const el of availableElements) {
    for (const maiden of Object.values(MAIDENS)) {
      if (maiden.element === el) return maiden;
    }
  }
  return MAIDENS.pyra;
}

// 触发少女登场的波次
export const MAIDEN_VISIT_WAVES = [2, 4, 6, 8, 11, 13, 16, 18];

// 触发少女剧情选择（影响能力）的波次
export const MAIDEN_PACT_WAVES = [3, 7, 12, 17];
