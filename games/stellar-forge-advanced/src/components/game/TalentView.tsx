import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMetaStore } from '@/store/metaStore';
import { TALENTS, TALENT_BRANCHES, getTalentsByBranch, TalentDef } from '@/data/talents';
import { X, Check, Star } from 'lucide-react';

export default function TalentView() {
  const meta = useMetaStore();
  const unlockTalent = useMetaStore(s => s.unlockTalent);
  const [detail, setDetail] = useState<TalentDef | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const handleUnlock = (talent: TalentDef) => {
    if (meta.unlockedTalents.includes(talent.id)) {
      setToast('该天赋已解锁');
      setTimeout(() => setToast(null), 1500);
      return;
    }
    if (meta.talentPoints < talent.cost) {
      setToast(`天赋点不足（需要 ${talent.cost}，当前 ${meta.talentPoints}）`);
      setTimeout(() => setToast(null), 2000);
      return;
    }
    const ok = unlockTalent(talent.id);
    if (ok) {
      setToast(`✨ 解锁天赋：${talent.name}`);
      setTimeout(() => setToast(null), 2000);
    }
  };

  const unlockedCount = meta.unlockedTalents.length;

  return (
    <div className="w-full max-w-4xl px-6 overflow-y-auto h-full pb-20">
      {/* 标题 + 天赋点 */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-display text-2xl text-neon-gold text-glow-gold mb-1">星核天赋</h2>
          <p className="text-gray-400 text-xs font-body">永久天赋，跨局生效，每局自动激活</p>
        </div>
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-lg"
          style={{
            background: 'rgba(255,209,102,0.12)',
            border: '1px solid rgba(255,209,102,0.5)',
          }}
        >
          <Star className="w-5 h-5 text-neon-gold" />
          <div>
            <div className="text-[10px] text-gray-400 font-body">天赋点</div>
            <div className="font-display text-neon-gold text-lg leading-none">{meta.talentPoints}</div>
          </div>
        </div>
      </div>

      {/* 进度 */}
      <div className="mb-4 text-xs text-gray-400 font-body">
        已解锁 <span className="text-neon-gold">{unlockedCount}</span> / {TALENTS.length} 个天赋
      </div>

      {/* 三大流派 */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {TALENT_BRANCHES.map(branch => {
          const branchTalents = getTalentsByBranch(branch.id);
          const branchUnlocked = branchTalents.filter(t => meta.unlockedTalents.includes(t.id)).length;
          return (
            <div
              key={branch.id}
              className="p-3 rounded-lg"
              style={{
                background: branch.color + '0D',
                border: `1px solid ${branch.color}44`,
              }}
            >
              {/* 流派标题 */}
              <div className="flex items-center gap-2 mb-3 pb-2 border-b" style={{ borderColor: branch.color + '33' }}>
                <span className="text-2xl">{branch.icon}</span>
                <div>
                  <div className="font-display text-sm" style={{ color: branch.color }}>{branch.name}</div>
                  <div className="text-[10px] text-gray-400 font-body">{branch.desc}</div>
                </div>
              </div>
              <div className="text-[10px] text-gray-500 mb-2 font-body">{branchUnlocked}/{branchTalents.length} 已解锁</div>

              {/* 天赋节点 */}
              <div className="space-y-2">
                {branchTalents.map(talent => {
                  const unlocked = meta.unlockedTalents.includes(talent.id);
                  return (
                    <motion.button
                      key={talent.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setDetail(talent)}
                      className="w-full text-left p-2 rounded-md transition-all"
                      style={{
                        background: unlocked ? talent.color + '22' : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${unlocked ? talent.color : 'rgba(255,255,255,0.1)'}`,
                        opacity: unlocked ? 1 : 0.7,
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg" style={{ filter: unlocked ? 'none' : 'grayscale(1) brightness(0.5)' }}>
                          {talent.icon}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1">
                            <span className="font-display text-xs" style={{ color: unlocked ? talent.color : '#888' }}>
                              {talent.name}
                            </span>
                            {unlocked && <Check className="w-3 h-3 text-neon-cyan" />}
                          </div>
                          <div className="text-[10px] text-gray-400 font-body truncate">{talent.description}</div>
                        </div>
                        {!unlocked && (
                          <div className="flex items-center gap-0.5 text-[10px] text-neon-gold font-body">
                            <Star className="w-2.5 h-2.5" />
                            {talent.cost}
                          </div>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* 说明 */}
      <div className="p-3 rounded-lg border border-neon-purple/30 bg-neon-purple/5">
        <h3 className="font-display text-neon-purple text-sm mb-2">如何获取天赋点</h3>
        <div className="text-xs text-gray-300 font-body space-y-1">
          <div>• 每局游戏结算时，按通关波次计算：<span className="text-neon-gold">每 3 波 +1 天赋点</span></div>
          <div>• 例如通关第 9 波 = 获得 3 点，通关第 15 波 = 获得 5 点</div>
          <div>• 天赋点永久保留，可在任意时间解锁天赋节点</div>
          <div>• 已解锁天赋在每局游戏开始时自动生效</div>
        </div>
      </div>

      {/* 详情弹窗 */}
      <AnimatePresence>
        {detail && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
            onClick={() => setDetail(null)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="relative p-6 rounded-xl max-w-xs"
              style={{
                background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
                border: `2px solid ${detail.color}`,
                boxShadow: `0 0 24px ${detail.color}44`,
              }}
            >
              <button
                onClick={() => setDetail(null)}
                className="absolute top-2 right-2 text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="text-center mb-3">
                <motion.div
                  initial={{ rotate: -180, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  className="text-5xl mb-2"
                  style={{ filter: meta.unlockedTalents.includes(detail.id) ? 'none' : 'grayscale(1) brightness(0.5)' }}
                >
                  {detail.icon}
                </motion.div>
                <h3 className="font-display text-lg" style={{ color: detail.color }}>{detail.name}</h3>
                <div className="text-[10px] text-gray-400 font-body mt-1">
                  {TALENT_BRANCHES.find(b => b.id === detail.branch)?.name}
                </div>
              </div>
              <p className="text-sm text-gray-200 font-body text-center mb-3">{detail.description}</p>
              <div className="flex items-center justify-center gap-2 mb-3 text-xs">
                <span className="text-gray-400 font-body">花费</span>
                <span className="flex items-center gap-1 text-neon-gold font-display">
                  <Star className="w-3 h-3" />{detail.cost}
                </span>
              </div>
              {meta.unlockedTalents.includes(detail.id) ? (
                <div className="flex items-center justify-center gap-1 py-2 rounded text-neon-cyan text-sm font-display">
                  <Check className="w-4 h-4" /> 已解锁
                </div>
              ) : (
                <button
                  onClick={() => { handleUnlock(detail); setDetail(null); }}
                  disabled={meta.talentPoints < detail.cost}
                  className="w-full py-2 rounded font-display text-sm transition-all"
                  style={{
                    background: meta.talentPoints >= detail.cost ? detail.color : 'rgba(255,255,255,0.05)',
                    color: meta.talentPoints >= detail.cost ? '#000' : '#666',
                    cursor: meta.talentPoints >= detail.cost ? 'pointer' : 'not-allowed',
                  }}
                >
                  {meta.talentPoints >= detail.cost ? '解锁天赋' : '天赋点不足'}
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast 提示 */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-lg bg-void-900 border border-neon-gold/50 text-neon-gold text-sm font-display"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
