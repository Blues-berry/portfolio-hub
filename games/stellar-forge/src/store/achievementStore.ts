import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ElementType } from '@/types/game';
import { SkillId } from '@/data/skills';
import {
  AchievementId,
  AchievementStats,
  ACHIEVEMENTS,
  getAchievementById,
} from '@/data/achievements';
import { useMetaStore } from './metaStore';

// 持久化的累计统计（跨局保存）
interface PersistedStats {
  totalKills: number;
  bossKills: number;
  totalSkillUses: number;
  seenMaidens: string[];
  maidenPacts: string[];
  monsterPacts: number;
}

interface AchievementStore {
  // 持久化数据
  unlocked: AchievementId[];
  stats: PersistedStats;
  // 非持久化的 Toast 队列
  toastQueue: AchievementId[];

  // 检测并解锁新成就（传入本局实时数据）
  checkAchievements: (liveStats: Partial<AchievementStats>) => void;
  // 累计统计更新方法
  recordKill: (isBoss: boolean) => void;
  recordSkillUse: (skillId: SkillId) => void;
  recordSeenMaiden: (id: string) => void;
  recordMaidenPact: (id: string) => void;
  recordMonsterPact: () => void;
  // Toast 管理
  dismissToast: () => void;
  // 查询
  isUnlocked: (id: AchievementId) => boolean;
  getProgress: (id: AchievementId, liveStats: Partial<AchievementStats>) => number;
  // 重置
  resetAll: () => void;
}

const DEFAULT_STATS: PersistedStats = {
  totalKills: 0,
  bossKills: 0,
  totalSkillUses: 0,
  seenMaidens: [],
  maidenPacts: [],
  monsterPacts: 0,
};

// 从 metaStore 拉取元素解锁状态
function getUnlockedElements(): ElementType[] {
  try {
    return useMetaStore.getState().unlocks.unlockedElements;
  } catch {
    return ['fire'];
  }
}

export const useAchievementStore = create<AchievementStore>()(
  persist(
    (set, get) => ({
      unlocked: [],
      stats: { ...DEFAULT_STATS },
      toastQueue: [],

      checkAchievements: (liveStats) => {
        const state = get();
        // 合并持久化统计 + 实时统计
        const fullStats: AchievementStats = {
          totalKills: state.stats.totalKills,
          runKills: liveStats.runKills ?? 0,
          currentWave: liveStats.currentWave ?? 0,
          bestWave: Math.max(useMetaStore.getState().bestWave, liveStats.currentWave ?? 0),
          bestCombo: liveStats.bestCombo ?? 0,
          currentCombo: liveStats.currentCombo ?? 0,
          bossKills: state.stats.bossKills,
          totalSkillUses: state.stats.totalSkillUses,
          runSkillsUsed: liveStats.runSkillsUsed ?? [],
          seenMaidens: state.stats.seenMaidens,
          maidenPacts: state.stats.maidenPacts,
          monsterPacts: state.stats.monsterPacts,
          unlockedElements: liveStats.unlockedElements ?? getUnlockedElements(),
          energy: liveStats.energy ?? 0,
          hpLostInRun: liveStats.hpLostInRun ?? 0,
        };

        // 检查所有未解锁成就
        const newUnlocked: AchievementId[] = [];
        for (const def of ACHIEVEMENTS) {
          if (state.unlocked.includes(def.id)) continue;
          if (def.isUnlocked(fullStats)) {
            newUnlocked.push(def.id);
          }
        }

        if (newUnlocked.length === 0) return;

        // 更新状态
        set((s) => ({
          unlocked: [...s.unlocked, ...newUnlocked],
          toastQueue: [...s.toastQueue, ...newUnlocked],
        }));

        // 奖励星尘（写入 metaStore）
        let totalReward = 0;
        for (const id of newUnlocked) {
          const def = getAchievementById(id);
          if (def && def.reward > 0) totalReward += def.reward;
        }
        if (totalReward > 0) {
          useMetaStore.getState().addStardust(totalReward);
        }
      },

      recordKill: (isBoss) => {
        set((s) => ({
          stats: {
            ...s.stats,
            totalKills: s.stats.totalKills + 1,
            bossKills: s.stats.bossKills + (isBoss ? 1 : 0),
          },
        }));
      },

      recordSkillUse: () => {
        set((s) => ({
          stats: {
            ...s.stats,
            totalSkillUses: s.stats.totalSkillUses + 1,
          },
        }));
      },

      recordSeenMaiden: (id) => {
        set((s) => {
          if (s.stats.seenMaidens.includes(id)) return s;
          return {
            stats: {
              ...s.stats,
              seenMaidens: [...s.stats.seenMaidens, id],
            },
          };
        });
      },

      recordMaidenPact: (id) => {
        set((s) => {
          if (s.stats.maidenPacts.includes(id)) return s;
          return {
            stats: {
              ...s.stats,
              maidenPacts: [...s.stats.maidenPacts, id],
            },
          };
        });
      },

      recordMonsterPact: () => {
        set((s) => ({
          stats: {
            ...s.stats,
            monsterPacts: s.stats.monsterPacts + 1,
          },
        }));
      },

      dismissToast: () => {
        set((s) => ({
          toastQueue: s.toastQueue.slice(1),
        }));
      },

      isUnlocked: (id) => get().unlocked.includes(id),

      getProgress: (id, liveStats) => {
        const state = get();
        const def = getAchievementById(id);
        if (!def) return 0;
        if (state.unlocked.includes(id)) return 1;
        const fullStats: AchievementStats = {
          totalKills: state.stats.totalKills,
          runKills: liveStats.runKills ?? 0,
          currentWave: liveStats.currentWave ?? 0,
          bestWave: useMetaStore.getState().bestWave,
          bestCombo: liveStats.bestCombo ?? 0,
          currentCombo: liveStats.currentCombo ?? 0,
          bossKills: state.stats.bossKills,
          totalSkillUses: state.stats.totalSkillUses,
          runSkillsUsed: liveStats.runSkillsUsed ?? [],
          seenMaidens: state.stats.seenMaidens,
          maidenPacts: state.stats.maidenPacts,
          monsterPacts: state.stats.monsterPacts,
          unlockedElements: liveStats.unlockedElements ?? getUnlockedElements(),
          energy: liveStats.energy ?? 0,
          hpLostInRun: liveStats.hpLostInRun ?? 0,
        };
        return Math.min(1, def.progress(fullStats));
      },

      resetAll: () => {
        set({
          unlocked: [],
          stats: { ...DEFAULT_STATS },
          toastQueue: [],
        });
      },
    }),
    {
      name: 'stellar-forge-achievements',
      version: 1,
      // 只持久化 unlocked 和 stats，不持久化 toastQueue
      partialize: (s) => ({ unlocked: s.unlocked, stats: s.stats }),
    }
  )
);

// 开发调试
if (import.meta.env.DEV && typeof window !== 'undefined') {
  (window as unknown as { __achievementStore: typeof useAchievementStore }).__achievementStore = useAchievementStore;
}
