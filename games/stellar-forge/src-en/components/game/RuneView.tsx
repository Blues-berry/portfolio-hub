// 符文系统 - 主界面组件
// 显示 3 个装备槽 + 符文背包，玩家可装备/卸下符文
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRuneStore } from '@/store/runeStore';
import { RUNES_BY_ID, MAX_EQUIPPED_RUNES, RuneDef } from '@/data/runes';
import { Gem, X, Plus, Check, Trash2, Sparkles } from 'lucide-react';

export default function RuneView() {
  const bag = useRuneStore(s => s.bag);
  const equipped = useRuneStore(s => s.equipped);
  const equipRune = useRuneStore(s => s.equipRune);
  const unequipRune = useRuneStore(s => s.unequipRune);
  const removeRune = useRuneStore(s => s.removeRune);
  const autoEquip = useRuneStore(s => s.autoEquip);
  const [selected, setSelected] = useState<RuneDef | null>(null);
  const [selectedUid, setSelectedUid] = useState<string | null>(null);

  // 已装备的 uid 集合
  const equippedUids = new Set(equipped.filter((uid): uid is string => uid !== null));

  return (
    <div className="w-full max-w-4xl px-6 overflow-y-auto h-full pb-20">
      <div className="flex items-center justify-between mb-1">
        <h2 className="font-display text-2xl text-neon-gold text-glow-gold">Rune Forging</h2>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-void-900/60 border border-neon-gold/30">
          <Gem className="w-3.5 h-3.5 text-neon-gold" />
          <span className="font-display text-neon-gold text-sm">{bag.length} pieces</span>
        </div>
      </div>
      <p className="text-gray-400 text-sm font-body mb-3">
        Each game can equip {MAX_EQUIPPED_RUNES} Runes, must be dropped when killing the boss, elites have a 30% chance of dropping
      </p>

      {/* 装备槽 */}
      <div className="mb-5 p-4 rounded-lg bg-void-900/60 border border-neon-gold/30">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-body text-gray-400 uppercase tracking-wider">
            Equipment slot ({equippedUids.size}/{MAX_EQUIPPED_RUNES}）
          </span>
          {bag.length > 0 && (
            <button
              onClick={autoEquip}
              className="text-[10px] font-display text-neon-cyan hover:text-neon-gold transition-colors flex items-center gap-1"
            >
              <Sparkles className="w-2.5 h-2.5" />
              Automatic equipment
            </button>
          )}
        </div>
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: MAX_EQUIPPED_RUNES }).map((_, i) => {
            const uid = equipped[i];
            const item = uid ? bag.find(r => r.uid === uid) : null;
            const def = item ? RUNES_BY_ID[item.runeId] : null;
            return (
              <EquipSlot
                key={i}
                def={def}
                onClick={() => def && unequipRune(i)}
              />
            );
          })}
        </div>
        {/* 当前激活效果汇总 */}
        {equippedUids.size > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-700/50">
            <div className="text-[10px] font-body text-gray-400 uppercase tracking-wider mb-1">
              Activation effect
            </div>
            <div className="flex flex-wrap gap-1.5">
              {Array.from(equippedUids).map(uid => {
                const item = bag.find(r => r.uid === uid);
                if (!item) return null;
                const def = RUNES_BY_ID[item.runeId];
                if (!def) return null;
                return (
                  <span
                    key={uid}
                    className="px-2 py-0.5 rounded text-[10px] font-body"
                    style={{
                      background: `${def.color}22`,
                      color: def.color,
                      border: `1px solid ${def.color}55`,
                    }}
                  >
                    {def.icon} {def.name}
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 背包 */}
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[10px] font-body text-gray-400 uppercase tracking-wider">
          Backpack
        </span>
        <span className="text-[10px] font-body text-gray-500">{bag.length} / 30</span>
      </div>

      {bag.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Gem className="w-12 h-12 mx-auto mb-2 opacity-30" />
          <div className="text-sm font-body">Backpack is empty</div>
          <div className="text-xs text-gray-600 mt-1">Defeat bosses or elite enemies to earn runes.</div>
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {bag.map((item, i) => {
            const def = RUNES_BY_ID[item.runeId];
            if (!def) return null;
            const isEquipped = equippedUids.has(item.uid);
            return (
              <motion.button
                key={item.uid}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: Math.min(i * 0.02, 0.5) }}
                whileHover={{ scale: 1.04, y: -2 }}
                onClick={() => {
                  setSelected(def);
                  setSelectedUid(item.uid);
                }}
                className="relative p-2 rounded-lg clip-corner border text-center transition-all"
                style={{
                  background: isEquipped ? `${def.color}22` : 'rgba(20,20,35,0.6)',
                  borderColor: isEquipped ? def.color : `${def.color}66`,
                  boxShadow: isEquipped ? `0 0 12px ${def.color}55` : 'none',
                }}
              >
                <div
                  className="text-3xl mb-1"
                  style={{ filter: `drop-shadow(0 0 6px ${def.color}88)` }}
                >
                  {def.icon}
                </div>
                <div className="font-display text-[10px] text-white truncate">
                  {def.name}
                </div>
                <div
                  className="text-[8px] font-display uppercase tracking-wider mt-0.5"
                  style={{ color: def.color }}
                >
                  {def.rarity}
                </div>
                {isEquipped && (
                  <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-neon-gold flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 text-void-900" />
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      )}

      {/* 详情弹窗 */}
      <AnimatePresence>
        {selected && selectedUid && (
          <RuneDetail
            def={selected}
            isEquipped={equippedUids.has(selectedUid)}
            onEquip={() => {
              equipRune(selectedUid);
              setSelectedUid(null);
              setSelected(null);
            }}
            onUnequip={() => {
              // 找到该 uid 在 equipped 中的索引
              const idx = equipped.findIndex(u => u === selectedUid);
              if (idx >= 0) unequipRune(idx);
              setSelectedUid(null);
              setSelected(null);
            }}
            onRemove={() => {
              removeRune(selectedUid);
              setSelectedUid(null);
              setSelected(null);
            }}
            onClose={() => {
              setSelectedUid(null);
              setSelected(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ============= 装备槽 =============
function EquipSlot({ def, onClick }: { def: RuneDef | null; onClick: () => void }) {
  if (!def) {
    return (
      <div className="aspect-square rounded-lg border-2 border-dashed border-gray-700 flex items-center justify-center bg-void-900/40">
        <Plus className="w-6 h-6 text-gray-700" />
      </div>
    );
  }
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="aspect-square rounded-lg border-2 p-2 flex flex-col items-center justify-center relative transition-all"
      style={{
        background: `${def.color}22`,
        borderColor: def.color,
        boxShadow: `0 0 12px ${def.color}55`,
      }}
    >
      <div
        className="text-3xl mb-1"
        style={{ filter: `drop-shadow(0 0 8px ${def.color})` }}
      >
        {def.icon}
      </div>
      <div className="font-display text-[10px] text-white truncate w-full text-center">
        {def.name}
      </div>
      <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-void-900/80 flex items-center justify-center">
        <X className="w-2.5 h-2.5 text-gray-400" />
      </div>
    </motion.button>
  );
}

// ============= 详情弹窗 =============
function RuneDetail({
  def,
  isEquipped,
  onEquip,
  onUnequip,
  onRemove,
  onClose,
}: {
  def: RuneDef;
  isEquipped: boolean;
  onEquip: () => void;
  onUnequip: () => void;
  onRemove: () => void;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-void-900/80 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.85, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', damping: 18 }}
        onClick={(e) => e.stopPropagation()}
        className="glass-panel rounded-xl p-6 max-w-sm w-full mx-4 clip-corner relative"
        style={{
          borderColor: `${def.color}66`,
          boxShadow: `0 0 40px ${def.color}33`,
        }}
      >
        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-7 h-7 rounded-full bg-void-900/80 hover:bg-void-700 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4 text-gray-400" />
        </button>

        {/* 头部 */}
        <div className="flex flex-col items-center text-center mb-4">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', damping: 12, delay: 0.1 }}
            className="w-24 h-24 rounded-xl flex items-center justify-center text-5xl mb-2"
            style={{
              background: `radial-gradient(circle, ${def.color}33, ${def.color}11)`,
              border: `2px solid ${def.color}88`,
              boxShadow: `0 0 24px ${def.color}55`,
            }}
          >
            {def.icon}
          </motion.div>
          <div
            className="px-2 py-0.5 rounded text-[9px] font-display uppercase tracking-wider mb-1"
            style={{
              background: `${def.color}22`,
              color: def.color,
              border: `1px solid ${def.color}55`,
            }}
          >
            {def.rarity}
          </div>
          <h3 className="font-display text-xl" style={{ color: def.color }}>
            {def.name}
          </h3>
        </div>

        {/* 描述 */}
        <div className="mb-4 p-3 rounded-lg bg-void-900/60 border border-gray-700/50">
          <div className="text-[10px] font-body text-gray-400 uppercase tracking-wider mb-1">
            Effect
          </div>
          <div className="text-sm font-body text-gray-200">{def.description}</div>
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-2">
          {isEquipped ? (
            <button
              onClick={onUnequip}
              className="flex-1 py-2.5 rounded clip-corner font-display text-sm bg-void-700 text-gray-300 border border-gray-600 hover:bg-void-600 transition-all"
            >
              Remove
            </button>
          ) : (
            <button
              onClick={onEquip}
              className="flex-1 py-2.5 rounded clip-corner font-display text-sm bg-neon-gold text-void-900 hover:brightness-110 transition-all shadow-glow-gold"
            >
              Equipment
            </button>
          )}
          <button
            onClick={onRemove}
            className="px-3 py-2.5 rounded clip-corner font-display text-sm bg-elem-fire/20 text-elem-fire border border-elem-fire/50 hover:bg-elem-fire/30 transition-all"
            title="Destroy Rune"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
