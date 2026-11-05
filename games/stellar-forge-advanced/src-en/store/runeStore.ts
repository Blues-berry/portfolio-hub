// 符文系统 - 持久化 store
// 管理符文背包 + 当前装备的 3 个符文槽位
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { RUNES_BY_ID, MAX_EQUIPPED_RUNES, RUNE_BAG_LIMIT, RuneDef } from '@/data/runes';

interface RuneStore {
  // 背包中的符文实例（每个实例有唯一 uid，便于装备/销毁操作）
  bag: { uid: string; runeId: string }[];
  // 装备槽（最多 3 个，存 uid 引用）
  equipped: (string | null)[];   // 长度固定为 3，元素为 bag 中的 uid 或 null

  // 操作
  addRune: (runeId: string) => void;
  equipRune: (uid: string) => void;              // 装备到第一个空槽
  unequipRune: (slotIndex: number) => void;     // 取消装备某槽位
  removeRune: (uid: string) => void;             // 从背包销毁
  autoEquip: () => void;                          // 自动装备（清空后填入前 3 个）
  resetAll: () => void;

  // 查询
  getEquippedDefs: () => RuneDef[];               // 当前装备的符文定义
  getBagCount: () => number;
  isFull: () => boolean;
}

// 生成唯一 uid
let _uid = 0;
const genUid = () => `rune_${Date.now()}_${_uid++}`;

export const useRuneStore = create<RuneStore>()(
  persist(
    (set, get) => ({
      bag: [],
      equipped: [null, null, null],

      addRune: (runeId) => {
        set((s) => {
          if (s.bag.length >= RUNE_BAG_LIMIT) return s;  // 背包已满
          const uid = genUid();
          return { bag: [...s.bag, { uid, runeId }] };
        });
      },

      equipRune: (uid) => {
        set((s) => {
          // 该 uid 已装备？跳过
          if (s.equipped.includes(uid)) return s;
          // 找到第一个空槽
          const emptyIdx = s.equipped.findIndex(slot => slot === null);
          if (emptyIdx === -1) return s;  // 无空槽
          const newEquipped = [...s.equipped];
          newEquipped[emptyIdx] = uid;
          return { equipped: newEquipped };
        });
      },

      unequipRune: (slotIndex) => {
        set((s) => {
          if (slotIndex < 0 || slotIndex >= MAX_EQUIPPED_RUNES) return s;
          const newEquipped = [...s.equipped];
          newEquipped[slotIndex] = null;
          return { equipped: newEquipped };
        });
      },

      removeRune: (uid) => {
        set((s) => {
          // 如果该符文已装备，先取消装备
          const newEquipped = s.equipped.map(slot => slot === uid ? null : slot);
          return {
            bag: s.bag.filter(r => r.uid !== uid),
            equipped: newEquipped,
          };
        });
      },

      autoEquip: () => {
        set((s) => {
          const newEquipped: (string | null)[] = [null, null, null];
          let idx = 0;
          for (const item of s.bag) {
            if (idx >= MAX_EQUIPPED_RUNES) break;
            newEquipped[idx] = item.uid;
            idx++;
          }
          return { equipped: newEquipped };
        });
      },

      resetAll: () => {
        set({ bag: [], equipped: [null, null, null] });
      },

      getEquippedDefs: () => {
        const s = get();
        const defs: RuneDef[] = [];
        for (const uid of s.equipped) {
          if (!uid) continue;
          const item = s.bag.find(r => r.uid === uid);
          if (!item) continue;
          const def = RUNES_BY_ID[item.runeId];
          if (def) defs.push(def);
        }
        return defs;
      },

      getBagCount: () => get().bag.length,
      isFull: () => get().bag.length >= RUNE_BAG_LIMIT,
    }),
    {
      name: 'stellar-forge-advanced-runes',
      version: 1,
    }
  )
);

// 开发模式暴露调试 API
if (import.meta.env.DEV && typeof window !== 'undefined') {
  (window as unknown as { __runeStore: typeof useRuneStore }).__runeStore = useRuneStore;
}
