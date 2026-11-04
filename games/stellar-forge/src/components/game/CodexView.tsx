// 图鉴系统 - 主视图组件
// 显示 5 类图鉴（敌人/少女/怪兽/遗物/元素）的收集进度
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCodexStore } from '@/store/codexStore';
import { useMetaStore } from '@/store/metaStore';
import {
  CODEX_ENTRIES,
  CODEX_CATEGORIES,
  CodexCategory,
  CodexEntry,
  getCategoryCount,
  TOTAL_ENTRIES,
} from '@/data/codex';
import { BookOpen, X, Lock, Sparkles } from 'lucide-react';

type FilterCategory = CodexCategory | 'all';

export default function CodexView() {
  const discovered = useCodexStore(s => s.discovered);
  const recordElement = useCodexStore(s => s.recordElement);
  const [filter, setFilter] = useState<FilterCategory>('all');
  const [selected, setSelected] = useState<CodexEntry | null>(null);
  const meta = useMetaStore();

  // 同步已解锁元素到 codex（保险：永久升级解锁的元素也应被图鉴记录）
  useEffect(() => {
    meta.unlocks.unlockedElements.forEach(el => recordElement(el));
  }, [meta.unlocks.unlockedElements, recordElement]);

  const filtered = filter === 'all' ? CODEX_ENTRIES : CODEX_ENTRIES.filter(e => e.category === filter);
  const totalDiscovered = discovered.length;
  const totalRatio = TOTAL_ENTRIES > 0 ? totalDiscovered / TOTAL_ENTRIES : 0;

  return (
    <div className="w-full max-w-4xl px-6 overflow-y-auto h-full pb-20">
      <div className="flex items-center justify-between mb-1">
        <h2 className="font-display text-2xl text-neon-gold text-glow-gold">星核收藏馆</h2>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-void-900/60 border border-neon-gold/30">
          <BookOpen className="w-3.5 h-3.5 text-neon-gold" />
          <span className="font-display text-neon-gold text-sm">{totalDiscovered} / {TOTAL_ENTRIES}</span>
        </div>
      </div>
      <p className="text-gray-400 text-sm font-body mb-3">在游戏中遭遇敌人、结识少女、拾取遗物以填充图鉴</p>

      {/* 总进度条 */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-body text-gray-400 uppercase tracking-wider">总进度</span>
          <span className="text-[10px] font-display text-neon-gold">{Math.floor(totalRatio * 100)}%</span>
        </div>
        <div className="w-full h-2 bg-void-900/80 border border-neon-gold/30 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${totalRatio * 100}%` }}
            transition={{ duration: 0.5, type: 'spring' }}
            className="h-full bg-gradient-to-r from-neon-gold to-amber-300"
            style={{ boxShadow: '0 0 8px rgba(255,209,102,0.6)' }}
          />
        </div>
      </div>

      {/* 分类筛选 */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        <FilterChip
          active={filter === 'all'}
          onClick={() => setFilter('all')}
          icon="📚"
          label={`全部 ${discovered.length}/${TOTAL_ENTRIES}`}
          color="#FFD166"
        />
        {CODEX_CATEGORIES.map(cat => {
          const got = useCodexStore.getState().getDiscoveredCount(cat.id);
          const total = getCategoryCount(cat.id);
          return (
            <FilterChip
              key={cat.id}
              active={filter === cat.id}
              onClick={() => setFilter(cat.id)}
              icon={cat.icon}
              label={`${cat.name} ${got}/${total}`}
              color={cat.color}
            />
          );
        })}
      </div>

      {/* 图鉴网格 */}
      <div className="grid grid-cols-3 gap-2">
        {filtered.map((entry, i) => {
          const isDiscovered = discovered.includes(entry.id);
          // 隐藏条目未发现时显示为 ???
          const showAsMystery = !isDiscovered && entry.hidden;
          const showAsLocked = !isDiscovered && !entry.hidden;
          return (
            <motion.button
              key={entry.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: Math.min(i * 0.015, 0.6) }}
              whileHover={isDiscovered ? { scale: 1.04, y: -2 } : {}}
              onClick={() => isDiscovered && setSelected(entry)}
              disabled={!isDiscovered}
              className={`relative p-3 rounded-lg clip-corner border text-center overflow-hidden transition-all ${
                isDiscovered
                  ? 'bg-void-800/80 hover:shadow-glow-gold cursor-pointer'
                  : 'bg-void-900/60 border-gray-800 cursor-not-allowed'
              }`}
              style={{
                borderColor: isDiscovered ? `${entry.color}88` : 'rgba(60,60,80,0.4)',
              }}
            >
              {/* 大图标 */}
              <div
                className={`text-3xl mb-1 ${isDiscovered ? '' : 'grayscale opacity-30'}`}
                style={{
                  filter: isDiscovered ? `drop-shadow(0 0 6px ${entry.color}88)` : 'none',
                }}
              >
                {showAsMystery ? '❓' : entry.icon}
              </div>

              {/* 名称 */}
              <div
                className={`font-display text-xs truncate ${isDiscovered ? 'text-white' : 'text-gray-600'}`}
              >
                {showAsMystery ? '???' : entry.name}
              </div>

              {/* 描述（仅 1 行） */}
              <div className="text-[9px] text-gray-500 font-body truncate mt-0.5">
                {isDiscovered ? entry.description : showAsLocked ? '未拾取' : '未遭遇'}
              </div>

              {/* 稀有度标签 */}
              {isDiscovered && entry.rarity && (
                <div
                  className="absolute top-1 right-1 px-1 py-0.5 rounded text-[8px] font-display uppercase"
                  style={{
                    background: `${entry.color}33`,
                    color: entry.color,
                    border: `1px solid ${entry.color}66`,
                  }}
                >
                  {entry.rarity}
                </div>
              )}

              {/* 锁图标 */}
              {!isDiscovered && (
                <div className="absolute top-1 right-1">
                  <Lock className="w-2.5 h-2.5 text-gray-700" />
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* 详情弹窗 */}
      <AnimatePresence>
        {selected && (
          <EntryDetail
            entry={selected}
            onClose={() => setSelected(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ============= 详情面板 =============
function EntryDetail({ entry, onClose }: { entry: CodexEntry; onClose: () => void }) {
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
        className="glass-panel rounded-xl p-6 max-w-md w-full mx-4 clip-corner relative"
        style={{
          borderColor: `${entry.color}66`,
          boxShadow: `0 0 40px ${entry.color}33`,
        }}
      >
        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-7 h-7 rounded-full bg-void-900/80 hover:bg-void-700 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4 text-gray-400" />
        </button>

        {/* 头部：图标 + 名称 */}
        <div className="flex items-center gap-4 mb-4">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', damping: 12, delay: 0.1 }}
            className="w-20 h-20 rounded-xl flex items-center justify-center text-5xl flex-shrink-0"
            style={{
              background: `radial-gradient(circle, ${entry.color}33, ${entry.color}11)`,
              border: `2px solid ${entry.color}88`,
              boxShadow: `0 0 20px ${entry.color}55`,
            }}
          >
            {entry.icon}
          </motion.div>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-body text-gray-400 uppercase tracking-wider mb-0.5">
              {categoryLabel(entry.category)}
            </div>
            <h3 className="font-display text-xl text-white truncate" style={{ color: entry.color }}>
              {entry.name}
            </h3>
            {entry.rarity && (
              <div
                className="inline-block mt-1 px-2 py-0.5 rounded text-[9px] font-display uppercase tracking-wider"
                style={{
                  background: `${entry.color}22`,
                  color: entry.color,
                  border: `1px solid ${entry.color}55`,
                }}
              >
                {entry.rarity}
              </div>
            )}
            {entry.triggerWave && (
              <div className="text-[10px] text-gray-500 font-body mt-1">
                触发波次：第 {entry.triggerWave} 波
              </div>
            )}
          </div>
        </div>

        {/* 描述 */}
        <div className="mb-3">
          <div className="text-[10px] font-body text-gray-400 uppercase tracking-wider mb-1">
            属性
          </div>
          <div className="text-sm font-body text-gray-200 leading-snug">
            {entry.description}
          </div>
        </div>

        {/* 背景故事 */}
        <div className="mb-2">
          <div className="text-[10px] font-body text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5" />
            传说
          </div>
          <div className="text-sm font-body text-gray-300 leading-relaxed italic">
            "{entry.lore}"
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function categoryLabel(cat: CodexCategory): string {
  return CODEX_CATEGORIES.find(c => c.id === cat)?.name || cat;
}

// ============= 筛选按钮 =============
function FilterChip({ active, onClick, icon, label, color }: {
  active: boolean;
  onClick: () => void;
  icon: string;
  label: string;
  color: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-body transition-all ${
        active ? 'text-void-900 font-bold' : 'text-gray-400 hover:text-white'
      }`}
      style={{
        background: active ? color : 'rgba(20,20,35,0.6)',
        border: `1px solid ${color}${active ? '' : '44'}`,
      }}
    >
      <span>{icon}</span>
      {label}
    </button>
  );
}
