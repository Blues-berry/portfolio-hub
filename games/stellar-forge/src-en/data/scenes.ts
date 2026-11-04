// 场景系统 - 4 大主题场景随波次切换

export type SceneId = 'void-gate' | 'burning-sea' | 'crystal-sanctum' | 'final-abyss';

export interface SceneConfig {
  id: SceneId;
  name: string;
  subtitle: string;
  description: string;
  // 视觉
  bgGradient: [string, string, string]; // 渐变色（内→中→外）
  starColor: string;
  accentColor: string; // 网格边框/高亮
  trackColor: string;
  coreColor: string;
  // 触发此场景的波次范围
  waveRange: [number, number];
}

export const SCENES: SceneConfig[] = [
  {
    id: 'void-gate',
    name: 'Gate of the Void',
    subtitle: 'VOG-01 · THE GATE',
    description: 'At the end of all things, a purple-black crack tears open the void',
    bgGradient: ['#1A0B2E', '#0B0518', '#04020A'],
    starColor: '#9B59B6',
    accentColor: '#9B59B6',
    trackColor: '#7B3FA0',
    coreColor: '#FFD166',
    waveRange: [1, 4],
  },
  {
    id: 'burning-sea',
    name: 'Burning Star Sea',
    subtitle: 'BSS-02 · INFERNO TIDE',
    description: 'Lava and stardust intertwined, and the red tide swallowed everything',
    bgGradient: ['#2E0B0B', '#180505', '#0A0202'],
    starColor: '#FF6B6B',
    accentColor: '#FF8E53',
    trackColor: '#C0392B',
    coreColor: '#FFE66D',
    waveRange: [5, 9],
  },
  {
    id: 'crystal-sanctum',
    name: 'Crystal Temple',
    subtitle: 'CS-03 · FROZEN SHRINE',
    description: 'In the temple inlaid with ice crystals, sleeps the ancient star core',
    bgGradient: ['#0B1A2E', '#051018', '#02060A'],
    starColor: '#4ECDC4',
    accentColor: '#7FE5DD',
    trackColor: '#2980B9',
    coreColor: '#FFFFFF',
    waveRange: [10, 14],
  },
  {
    id: 'final-abyss',
    name: 'Final Abyss',
    subtitle: 'FA-04 · THE END',
    description: 'At the end of the universe, all star cores will fall here',
    bgGradient: ['#1A0000', '#0A0000', '#020000'],
    starColor: '#FFD166',
    accentColor: '#C0392B',
    trackColor: '#7F1A1A',
    coreColor: '#FF6B6B',
    waveRange: [15, 99],
  },
];

// 根据波次获取场景
export function getSceneByWave(wave: number): SceneConfig {
  for (const scene of SCENES) {
    if (wave >= scene.waveRange[0] && wave <= scene.waveRange[1]) {
      return scene;
    }
  }
  return SCENES[SCENES.length - 1];
}

// 检测场景是否切换
export function getSceneChangeWave(wave: number): SceneConfig | null {
  // 在场景切换点（第 5、10、15 波开始时）返回新场景
  const triggerWaves = [5, 10, 15];
  if (triggerWaves.includes(wave)) {
    return getSceneByWave(wave);
  }
  return null;
}
