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
    name: '焰',
    title: '炽炎之心',
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
      '哼，你竟然敢踏入虚空之门？看起来不太聪明呢。',
      '我是焰，星核的守护者之一。别误会，我只是...有点好奇你的能耐。',
      '看什么看？专心打你的敌人！别让我失望。',
    ],
    greetLines: [
      '又来了？呵，还挺有干劲的。',
      '今天状态怎么样？别打得太难看啊。',
      '哼，这次又给我带什么来了？',
    ],
    giftLines: [
      '这、这是什么意思？才、才不是为了感谢你呢！',
      '哼，既然你都送了，那我就勉强收下吧。',
      '别误会！我只是...喜欢这东西而已。',
    ],
    pactLines: [
      '你...愿意和我缔结星核契约吗？这种事...一辈子只有一次的。',
      '既然如此，我的火焰将永远守护你。直到宇宙终结。',
    ],
    boons: [
      { threshold: 30, name: '焰之眷顾', description: '伤害 +15%', effect: 'damage-boost', value: 0.15 },
      { threshold: 60, name: '炽炎之拥', description: '攻速 +20%', effect: 'atkspd-boost', value: 0.20 },
      { threshold: 100, name: '永恒契约', description: '免疫一次死亡', effect: 'shield', value: 1 },
    ],
  },
  nami: {
    id: 'nami',
    name: '涟',
    title: '静水流深',
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
      '...你好。我是涟。请...不要盯着我看太久。',
      '这片虚空曾经是海洋。在你来之前，我已经守护了很久。',
      '如果累了，就停下来休息一下。我会帮你的。',
    ],
    greetLines: [
      '你回来了。...我等你很久了。',
      '看起来状态不错。今天也要小心。',
      '...你的眼神变了。变强了呢。',
    ],
    giftLines: [
      '啊...谢谢。我会珍惜的。',
      '你总是这么体贴。...我很高兴。',
      '这个...给我吗？我真的可以收下吗？',
    ],
    pactLines: [
      '契约...是吗？...嗯。我愿意。',
      '从今以后，无论潮起潮落，我都会陪在你身边。',
    ],
    boons: [
      { threshold: 30, name: '涟漪祝福', description: '敌人移速 -15%', effect: 'enemy-slow', value: 0.15 },
      { threshold: 60, name: '深海回响', description: '星尘 +30%', effect: 'stardust-boost', value: 0.30 },
      { threshold: 100, name: '永恒之潮', description: '免疫一次死亡', effect: 'shield', value: 1 },
    ],
  },
  terra: {
    id: 'terra',
    name: '岩',
    title: '磐石之心',
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
      '哼。又一个想挑战虚空的？叫我大姐头就行。',
      '岩，记住了？以后有什么麻烦，尽管来找我。',
      '别看我这样，我比你想象的可靠多了。',
    ],
    greetLines: [
      '哟，回来了？这就对了，多来几次才能变强。',
      '今天精神不错啊，好好干。',
      '怎么，又被揍了？下次小心点。',
    ],
    giftLines: [
      '哦？这玩意儿不错嘛，谢了。',
      '哈哈，你小子还挺有心的。',
      '行行行，我收下了，别这么客气。',
    ],
    pactLines: [
      '契约？...哈，你这小子还真敢说。行，我答应你。',
      '从今往后，我这座山就替你挡下所有风雨。',
    ],
    boons: [
      { threshold: 30, name: '岩石之盾', description: '伤害 +10%', effect: 'damage-boost', value: 0.10 },
      { threshold: 60, name: '山岳之力', description: '攻速 +15%, 伤害 +10%', effect: 'atkspd-boost', value: 0.15 },
      { threshold: 100, name: '磐石之心', description: '免疫一次死亡', effect: 'shield', value: 1 },
    ],
  },
  gale: {
    id: 'gale',
    name: '风',
    title: '自由之翼',
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
      '哇！你就是那个挑战者？看起来超有趣的样子！',
      '我是风！飞得最快的那个！要不要比赛跑？',
      '诶嘿，我们一起去打怪兽吧！快点快点！',
    ],
    greetLines: [
      '回来啦回来啦！今天我们要玩什么？',
      '诶嘿嘿，我等你好久了！快开始吧！',
      '咦？你今天看起来更厉害了！',
    ],
    giftLines: [
      '哇哇哇！给我的吗？！太棒了！',
      '嘿嘿嘿，最喜欢你了！',
      '我要好好珍藏起来！',
    ],
    pactLines: [
      '契约？听起来好像很好玩！我答应你！',
      '从今以后，风就是你的翅膀啦！我们要一直一起飞！',
    ],
    boons: [
      { threshold: 30, name: '风的祝福', description: '攻速 +18%', effect: 'atkspd-boost', value: 0.18 },
      { threshold: 60, name: '疾风之刃', description: '暴击 +15%', effect: 'crit-boost', value: 0.15 },
      { threshold: 100, name: '永恒之风', description: '免疫一次死亡', effect: 'shield', value: 1 },
    ],
  },
  volt: {
    id: 'volt',
    name: '雷',
    title: '神之裁决',
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
      '...凡人。你能承受这雷罚的重量吗？',
      '我是雷。审判虚空的执行者。不要让我失望。',
      '你的命运已被书写。是否能改写，看你自己的造化。',
    ],
    greetLines: [
      '又来了？...看来你还活着。',
      '凡人，准备好接受下一次审判了吗？',
      '你的存在...已经超出了我的预期。',
    ],
    giftLines: [
      '凡人...你这是什么意思？',
      '...哼，既然你执意如此，我便收下。',
      '你的诚意...我感受到了。',
    ],
    pactLines: [
      '你想要与我缔结契约？...凡人，你可知道这意味着什么？',
      '...好。从此以后，雷罚即是你，你即是雷罚。',
    ],
    boons: [
      { threshold: 30, name: '雷霆之怒', description: '暴击 +20%', effect: 'crit-boost', value: 0.20 },
      { threshold: 60, name: '神之裁决', description: '伤害 +25%', effect: 'damage-boost', value: 0.25 },
      { threshold: 100, name: '永恒雷罚', description: '免疫一次死亡', effect: 'shield', value: 1 },
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
    name: '渊噬者',
    title: '虚空之口的化身',
    color: '#8E44AD',
    accent: '#9B59B6',
    emoji: '🐙',
    triggerWave: 5,
    form: '巨大的紫色触手从虚空中伸出，无数的眼睛在黑暗中闪烁',
    introLines: [
      '凡人...你竟敢闯入我的领地？',
      '尝尝虚空的滋味吧！你的星核将成为我的食粮！',
      '哈哈哈哈！你以为是来挑战我的？不，你是来喂养我的！',
    ],
    threatLines: [
      '吞噬！吞噬！吞噬一切！',
      '你的星核...好美味啊...',
      '这点程度就想伤到我？可笑！',
    ],
    defeatLines: [
      '不...不可能！我竟然被打败了？！',
      '哼，这次算你赢。但虚空的深处...还有更可怕的东西在等着你！',
    ],
    pact: {
      title: '深渊之约',
      description: '获得「渊噬核心」（伤害+25%，星尘+30%），但失去 1 点生命',
      cost: { hp: 1 },
      rewardRelicId: 'void-heart',
      corruption: 25,
    },
  },
  {
    id: 'rift-weaver',
    name: '虚空织者',
    title: '裂隙之母',
    color: '#16A085',
    accent: '#1ABC9C',
    emoji: '🕷️',
    triggerWave: 10,
    form: '银白色的蜘蛛在虚空中编织着无数裂隙，每一根丝线都是一条时空通道',
    introLines: [
      '愚蠢的挑战者...你以为裂隙是你可以跨越的？',
      '我编织的每一根丝线，都是你无法理解的命运。',
      '看看这些裂隙...它们都通向你的死亡。',
    ],
    threatLines: [
      '让你尝尝被命运切割的滋味！',
      '在我的网中，你只是猎物。',
      '挣扎吧！那只会让你的丝线缠得更紧！',
    ],
    defeatLines: [
      '我的网...竟然断了？',
      '但这不是结束...命运的丝线永不断裂...',
    ],
    pact: {
      title: '裂隙契约',
      description: '获得「虚空织网」（攻速+30%，暴击+15%），但失去 30 星尘',
      cost: { stardust: 30 },
      rewardRelicId: 'overclock',
      corruption: 40,
    },
  },
  {
    id: 'final-eye',
    name: '终焉之眼',
    title: '宇宙的审判者',
    color: '#C0392B',
    accent: '#E74C3C',
    emoji: '👁️',
    triggerWave: 15,
    form: '一只巨大的赤红之眼悬浮在虚空中央，瞳孔中倒映着无数陨落的星辰',
    introLines: [
      '我看见了一切。你的过去，你的现在，你的未来。',
      '凡人，你以为你在挑战我？不，你只是在完成我早已预见的命运。',
      '睁眼，看清楚——这就是宇宙的终末。',
    ],
    threatLines: [
      '我看见你的恐惧。',
      '你的命运已经被我书写。',
      '睁开眼睛！看着自己陨落！',
    ],
    defeatLines: [
      '不...这不可能！我看见的未来里...没有这一幕！',
      '你...竟然改变了命运？',
    ],
    pact: {
      title: '末日之约',
      description: '获得「终焉之瞳」（伤害+35%，敌人减速30%），但失去 2 点生命',
      cost: { hp: 2 },
      rewardRelicId: 'frost-crown',
      corruption: 60,
    },
  },
  {
    id: 'star-eater',
    name: '噬星者',
    title: '万物的终结',
    color: '#000000',
    accent: '#1A0000',
    emoji: '🌑',
    triggerWave: 20,
    form: '一团漆黑的虚无，吞噬着周围所有的光芒，连星核的光都无法逃脱',
    introLines: [
      '...',
      '...',
      '你来了。终于，你来了。',
    ],
    threatLines: [
      '...',
      '......',
      '............',
    ],
    defeatLines: [
      '原来...这就是终焉的感觉。',
      '谢谢你...让我...终于...可以...安息...',
    ],
    pact: {
      title: '终极契约',
      description: '获得「虚无之核」（全属性大幅提升），但失去 50% 当前生命',
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
