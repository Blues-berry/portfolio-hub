// 图鉴系统 - 持久化 store
// 记录玩家在所有局中已发现/已获得的图鉴条目
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { EnemyType, ElementType } from '@/types/game';
import { MaidenId, MonsterId } from '@/data/story';
import { CODEX_ENTRIES, CodexCategory, getCategoryCount, TOTAL_ENTRIES } from '@/data/codex';

interface CodexStore {
  // 已发现的条目 ID 集合（带前缀：enemy_xxx, maiden_xxx 等）
  discovered: string[];
  // 最后一次新发现的条目（用于 UI 高亮提示）
  lastDiscovery: string | null;

  // 记录方法（在游戏中触发）
  recordEnemy: (type: EnemyType) => void;
  recordMaiden: (id: MaidenId) => void;
  recordMonster: (id: MonsterId) => void;
  recordRelic: (relicId: string) => void;
  recordElement: (el: ElementType) => void;

  // 查询方法
  isDiscovered: (id: string) => boolean;
  getDiscoveredByCategory: (category: CodexCategory) => string[];
  getDiscoveredCount: (category?: CodexCategory) => number;
  getProgressRatio: (category?: CodexCategory) => number;  // 0-1
  getTotalProgress: () => { discovered: number; total: number };

  // 重置
  resetAll: () => void;
}

// 内部：添加条目（去重）
function addDiscovered(prev: string[], id: string): { discovered: string[]; isNew: boolean } {
  if (prev.includes(id)) return { discovered: prev, isNew: false };
  return { discovered: [...prev, id], isNew: true };
}

export const useCodexStore = create<CodexStore>()(
  persist(
    (set, get) => ({
      discovered: [],
      lastDiscovery: null,

      recordEnemy: (type) => {
        const id = `enemy_${type}`;
        set((s) => {
          const { discovered, isNew } = addDiscovered(s.discovered, id);
          return isNew ? { discovered, lastDiscovery: id } : s;
        });
      },

      recordMaiden: (maidId) => {
        const id = `maiden_${maidId}`;
        set((s) => {
          const { discovered, isNew } = addDiscovered(s.discovered, id);
          return isNew ? { discovered, lastDiscovery: id } : s;
        });
      },

      recordMonster: (monId) => {
        const id = `monster_${monId}`;
        set((s) => {
          const { discovered, isNew } = addDiscovered(s.discovered, id);
          return isNew ? { discovered, lastDiscovery: id } : s;
        });
      },

      recordRelic: (relicId) => {
        const id = `relic_${relicId}`;
        set((s) => {
          const { discovered, isNew } = addDiscovered(s.discovered, id);
          return isNew ? { discovered, lastDiscovery: id } : s;
        });
      },

      recordElement: (el) => {
        const id = `element_${el}`;
        set((s) => {
          const { discovered, isNew } = addDiscovered(s.discovered, id);
          return isNew ? { discovered, lastDiscovery: id } : s;
        });
      },

      isDiscovered: (id) => get().discovered.includes(id),

      getDiscoveredByCategory: (category) => {
        const all = get().discovered;
        return all.filter(id => {
          const entry = CODEX_ENTRIES.find(e => e.id === id);
          return entry?.category === category;
        });
      },

      getDiscoveredCount: (category) => {
        const all = get().discovered;
        if (!category) return all.length;
        return all.filter(id => {
          const entry = CODEX_ENTRIES.find(e => e.id === id);
          return entry?.category === category;
        }).length;
      },

      getProgressRatio: (category) => {
        if (!category) {
          const total = TOTAL_ENTRIES;
          const got = get().discovered.length;
          return total > 0 ? got / total : 0;
        }
        const total = getCategoryCount(category);
        const got = get().getDiscoveredCount(category);
        return total > 0 ? got / total : 0;
      },

      getTotalProgress: () => {
        return {
          discovered: get().discovered.length,
          total: TOTAL_ENTRIES,
        };
      },

      resetAll: () => {
        set({ discovered: [], lastDiscovery: null });
      },
    }),
    {
      name: 'stellar-forge-codex',
      version: 1,
      // 只持久化 discovered，不持久化 lastDiscovery
      partialize: (s) => ({ discovered: s.discovered }),
    }
  )
);

// 开发模式暴露调试 API
if (import.meta.env.DEV && typeof window !== 'undefined') {
  (window as unknown as { __codexStore: typeof useCodexStore }).__codexStore = useCodexStore;
}
