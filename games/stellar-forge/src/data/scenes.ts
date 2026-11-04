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
    name: '虚空之门',
    subtitle: 'VOG-01 · THE GATE',
    description: '万物的尽头，一道紫黑色的裂隙撕开虚空',
    bgGradient: ['#1A0B2E', '#0B0518', '#04020A'],
    starColor: '#9B59B6',
    accentColor: '#9B59B6',
    trackColor: '#7B3FA0',
    coreColor: '#FFD166',
    waveRange: [1, 4],
  },
  {
    id: 'burning-sea',
    name: '燃烧星海',
    subtitle: 'BSS-02 · INFERNO TIDE',
    description: '熔岩与星尘交织，赤红的潮汐吞噬一切',
    bgGradient: ['#2E0B0B', '#180505', '#0A0202'],
    starColor: '#FF6B6B',
    accentColor: '#FF8E53',
    trackColor: '#C0392B',
    coreColor: '#FFE66D',
    waveRange: [5, 9],
  },
  {
    id: 'crystal-sanctum',
    name: '晶莹圣殿',
    subtitle: 'CS-03 · FROZEN SHRINE',
    description: '冰晶镶嵌的圣殿中，沉睡着远古星核',
    bgGradient: ['#0B1A2E', '#051018', '#02060A'],
    starColor: '#4ECDC4',
    accentColor: '#7FE5DD',
    trackColor: '#2980B9',
    coreColor: '#FFFFFF',
    waveRange: [10, 14],
  },
  {
    id: 'final-abyss',
    name: '终焉深渊',
    subtitle: 'FA-04 · THE END',
    description: '宇宙的终末，所有星核都将在此陨落',
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
