import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MetaProgress, ElementType } from '@/types/game';
import { TALENTS_BY_ID } from '@/data/talents';

interface MetaStore extends MetaProgress {
  // 日常挑战历史（按日期记录）
  dailyHistory: Record<string, { wave: number; score: number; kills: number; completedAt: number }>;
  // 天赋系统：可用天赋点 + 已解锁天赋 ID 列表
  talentPoints: number;
  unlockedTalents: string[];
  addStardust: (amount: number) => void;
  spendStardust: (amount: number) => boolean;
  recordRun: (wave: number, score: number, kills: number, stardust: number) => void;
  recordDailyResult: (date: string, wave: number, score: number, kills: number) => void;
  getDailyBest: (date: string) => { wave: number; score: number; kills: number } | null;
  resetProgress: () => void;
  upgrade: (upgradeId: UpgradeId) => boolean;
  // 天赋系统
  unlockTalent: (talentId: string) => boolean;
  addTalentPoints: (amount: number) => void;
}

export type UpgradeId =
  | 'startHp1' | 'startHp2' | 'startHp3'
  | 'startStardust1' | 'startStardust2'
  | 'extraReroll1'
  | 'startRelic1'
  | 'unlockWater' | 'unlockEarth' | 'unlockAir' | 'unlockLightning';

export interface UpgradeDef {
  id: UpgradeId;
  name: string;
  description: string;
  cost: number;
  icon: string;
}

export const UPGRADES: UpgradeDef[] = [
  { id: 'startHp1', name: 'Life Enhancement I', description: 'Starting life +1', cost: 50, icon: '❤️' },
  { id: 'startHp2', name: 'Life Enhancement II', description: 'Starting life +1', cost: 150, icon: '❤️' },
  { id: 'startHp3', name: 'Life Enhancement III', description: 'Starting life +1', cost: 400, icon: '❤️' },
  { id: 'startStardust1', name: 'Initial Stardust I', description: 'Starting Stardust +30', cost: 40, icon: '✨' },
  { id: 'startStardust2', name: 'Initial Stardust II', description: 'Starting Stardust +30', cost: 120, icon: '✨' },
  { id: 'extraReroll1', name: 'Extra Reroll', description: 'One extra shop reroll per wave', cost: 80, icon: '🔄' },
  { id: 'startRelic1', name: 'Starting Relic', description: 'Get a random relic at the beginning', cost: 200, icon: '🎁' },
  { id: 'unlockWater', name: 'Starting Water', description: 'Start each run with Water unlocked', cost: 60, icon: '💧' },
  { id: 'unlockEarth', name: 'Starting Earth', description: 'Start each run with Earth unlocked', cost: 100, icon: '🪨' },
  { id: 'unlockAir', name: 'Starting Wind', description: 'Start each run with Wind unlocked', cost: 140, icon: '🌀' },
  { id: 'unlockLightning', name: 'Starting Lightning', description: 'Start each run with Lightning unlocked', cost: 200, icon: '⚡' },
];

const DEFAULT_META: MetaProgress = {
  totalStardust: 0,
  bestWave: 0,
  bestScore: 0,
  totalKills: 0,
  totalRuns: 0,
  unlocks: {
    startHp: 0,
    startStardust: 0,
    extraRerolls: 0,
    startRelicSlots: 0,
    unlockedElements: ['fire'],
  },
  achievements: [],
};

// 计算解锁后的起始配置
export function getStartConfig(meta: MetaProgress) {
  return {
    startHp: 3 + meta.unlocks.startHp,
    startStardust: 30 + meta.unlocks.startStardust * 30,
    startRerolls: 1 + meta.unlocks.extraRerolls,
    startRelic: meta.unlocks.startRelicSlots > 0,
    availableElements: meta.unlocks.unlockedElements,
  };
}

// 根据升级ID应用到meta
function applyUpgrade(meta: MetaProgress, id: UpgradeId): MetaProgress {
  const newMeta = JSON.parse(JSON.stringify(meta));
  const u = newMeta.unlocks;

  switch (id) {
    case 'startHp1': case 'startHp2': case 'startHp3':
      u.startHp += 1;
      break;
    case 'startStardust1': case 'startStardust2':
      u.startStardust += 1;
      break;
    case 'extraReroll1':
      u.extraRerolls += 1;
      break;
    case 'startRelic1':
      u.startRelicSlots += 1;
      break;
    case 'unlockWater':
      if (!u.unlockedElements.includes('water')) u.unlockedElements.push('water');
      break;
    case 'unlockEarth':
      if (!u.unlockedElements.includes('earth')) u.unlockedElements.push('earth');
      break;
    case 'unlockAir':
      if (!u.unlockedElements.includes('air')) u.unlockedElements.push('air');
      break;
    case 'unlockLightning':
      if (!u.unlockedElements.includes('lightning')) u.unlockedElements.push('lightning');
      break;
  }
  return newMeta;
}

// 检查升级是否已购买
export function isUpgradePurchased(meta: MetaProgress, id: UpgradeId): boolean {
  const u = meta.unlocks;
  switch (id) {
    case 'startHp1': return u.startHp >= 1;
    case 'startHp2': return u.startHp >= 2;
    case 'startHp3': return u.startHp >= 3;
    case 'startStardust1': return u.startStardust >= 1;
    case 'startStardust2': return u.startStardust >= 2;
    case 'extraReroll1': return u.extraRerolls >= 1;
    case 'startRelic1': return u.startRelicSlots >= 1;
    case 'unlockWater': return u.unlockedElements.includes('water');
    case 'unlockEarth': return u.unlockedElements.includes('earth');
    case 'unlockAir': return u.unlockedElements.includes('air');
    case 'unlockLightning': return u.unlockedElements.includes('lightning');
  }
  return false;
}

export const useMetaStore = create<MetaStore>()(
  persist(
    (set, get) => ({
      ...DEFAULT_META,
      dailyHistory: {},
      // 天赋系统初始化
      talentPoints: 0,
      unlockedTalents: [],

      addStardust: (amount) => {
        set((s) => ({ totalStardust: s.totalStardust + amount }));
      },

      spendStardust: (amount) => {
        const s = get();
        if (s.totalStardust < amount) return false;
        set({ totalStardust: s.totalStardust - amount });
        return true;
      },

      recordRun: (wave, score, kills, stardust) => {
        // 每局结算时按波次获得天赋点（每 3 波 1 点）
        const earnedTalents = Math.floor(wave / 3);
        set((s) => ({
          totalStardust: s.totalStardust + stardust,
          bestWave: Math.max(s.bestWave, wave),
          bestScore: Math.max(s.bestScore, score),
          totalKills: s.totalKills + kills,
          totalRuns: s.totalRuns + 1,
          talentPoints: s.talentPoints + earnedTalents,
        }));
      },

      recordDailyResult: (date, wave, score, kills) => {
        set((s) => {
          const existing = s.dailyHistory[date];
          // 只保留最高分
          if (existing && existing.score >= score) return s;
          return {
            dailyHistory: {
              ...s.dailyHistory,
              [date]: { wave, score, kills, completedAt: Date.now() },
            },
          };
        });
      },

      getDailyBest: (date) => {
        const r = get().dailyHistory[date];
        if (!r) return null;
        return { wave: r.wave, score: r.score, kills: r.kills };
      },

      upgrade: (upgradeId) => {
        const s = get();
        const def = UPGRADES.find(u => u.id === upgradeId);
        if (!def) return false;
        if (isUpgradePurchased(s, upgradeId)) return false;
        if (s.totalStardust < def.cost) return false;

        const newMeta = applyUpgrade(s, upgradeId);
        set({
          totalStardust: s.totalStardust - def.cost,
          unlocks: newMeta.unlocks,
        });
        return true;
      },

      resetProgress: () => {
        set({ ...DEFAULT_META, dailyHistory: {}, talentPoints: 0, unlockedTalents: [] });
      },

      // 天赋系统：解锁天赋节点（消耗天赋点）
      unlockTalent: (talentId) => {
        const s = get();
        const def = TALENTS_BY_ID[talentId];
        if (!def) return false;
        if (s.unlockedTalents.includes(talentId)) return false;
        if (s.talentPoints < def.cost) return false;
        set({
          talentPoints: s.talentPoints - def.cost,
          unlockedTalents: [...s.unlockedTalents, talentId],
        });
        return true;
      },

      addTalentPoints: (amount) => {
        set((s) => ({ talentPoints: s.talentPoints + amount }));
      },
    }),
    {
      name: 'stellar-forge-advanced-meta',
      version: 1,
    }
  )
);

// 工具：检测哪些元素可用（基于解锁）
export function getAvailableElements(meta: MetaProgress): ElementType[] {
  return meta.unlocks.unlockedElements.length > 0
    ? meta.unlocks.unlockedElements
    : ['fire'];
}

// 暴露到 window 用于开发调试
if (typeof window !== 'undefined') {
  (window as unknown as { __metaStore: typeof useMetaStore }).__metaStore = useMetaStore;
}
