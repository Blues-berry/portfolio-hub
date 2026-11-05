import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '@/store/gameStore';
import { ELEMENTS } from '@/data/elements';
import { MAIDENS, MaidenConfig } from '@/data/story';
import { Play, LogOut, Volume2, VolumeX, Package, Heart, Skull, Sparkles, X } from 'lucide-react';
import { useState } from 'react';
import { setSoundEnabled, isSoundEnabled } from '@/engine/sound';

type PanelTab = 'pause' | 'relics' | 'maidens';

export default function PausePanel() {
  const navigate = useNavigate();
  const isOpen = useGameStore(s => s.status === 'paused');
  const togglePause = useGameStore(s => s.togglePause);
  const ownedRelics = useGameStore(s => s.ownedRelics);
  const maidenAffinity = useGameStore(s => s.maidenAffinity);
  const seenMaidens = useGameStore(s => s.seenMaidens);
  const corruption = useGameStore(s => s.corruption);
  const hp = useGameStore(s => s.hp);
  const maxHp = useGameStore(s => s.maxHp);
  const stardust = useGameStore(s => s.stardust);
  const wave = useGameStore(s => s.wave);
  const [tab, setTab] = useState<PanelTab>('pause');
  const [soundOn, setSoundOn] = useState(isSoundEnabled());

  const toggleSound = () => {
    const v = !soundOn;
    setSoundOn(v);
    setSoundEnabled(v);
  };

  const handleQuit = () => {
    togglePause(); // 关闭暂停
    navigate('/');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-[55] flex items-center justify-center bg-black/75 backdrop-blur-sm pointer-auto"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', damping: 22 }}
            className="relative w-[560px] max-w-[95vw] max-h-[90vh] rounded-lg clip-corner border-2 border-neon-gold/60 overflow-hidden flex flex-col"
            style={{
              background: 'linear-gradient(180deg, #1A1A3A 0%, #0B0518 100%)',
              boxShadow: '0 0 50px rgba(255,209,102,0.3)',
            }}
          >
            {/* 顶部 */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700/50">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-neon-gold" />
                <h2 className="font-display text-xl text-neon-gold">
                  {tab === 'pause' ? 'Paused' : tab === 'relics' ? 'Relics' : 'Guardians'}
                </h2>
              </div>
              <button
                onClick={() => { setTab('pause'); togglePause(); }}
                className="p-1.5 rounded text-gray-400 hover:text-white hover:bg-void-700/50 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 标签栏 */}
            <div className="flex gap-1 px-4 py-2 border-b border-gray-700/30">
              <TabBtn active={tab === 'pause'} onClick={() => setTab('pause')} icon={<Play className="w-3.5 h-3.5" />}>Pause</TabBtn>
              <TabBtn active={tab === 'relics'} onClick={() => setTab('relics')} icon={<Package className="w-3.5 h-3.5" />}>Relics ({ownedRelics.length})</TabBtn>
              <TabBtn active={tab === 'maidens'} onClick={() => setTab('maidens')} icon={<Heart className="w-3.5 h-3.5" />}>Guardians ({seenMaidens.length})</TabBtn>
            </div>

            {/* 内容区 */}
            <div className="flex-1 overflow-y-auto p-5">
              {tab === 'pause' && (
                <PauseTab
                  wave={wave}
                  hp={hp}
                  maxHp={maxHp}
                  stardust={stardust}
                  corruption={corruption}
                  soundOn={soundOn}
                  onToggleSound={toggleSound}
                  onResume={() => togglePause()}
                  onQuit={handleQuit}
                />
              )}
              {tab === 'relics' && <RelicsTab relics={ownedRelics} />}
              {tab === 'maidens' && <MaidensTab affinity={maidenAffinity} seenMaidens={seenMaidens} />}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function TabBtn({ active, onClick, icon, children }: { active: boolean; onClick: () => void; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-display transition-all ${
        active ? 'bg-neon-gold text-void-900' : 'text-gray-400 hover:text-white hover:bg-void-700/50'
      }`}
    >
      {icon}
      {children}
    </button>
  );
}

// ============= 暂停首页 =============
function PauseTab({ wave, hp, maxHp, stardust, corruption, soundOn, onToggleSound, onResume, onQuit }: {
  wave: number;
  hp: number;
  maxHp: number;
  stardust: number;
  corruption: number;
  soundOn: boolean;
  onToggleSound: () => void;
  onResume: () => void;
  onQuit: () => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      {/* 当前状态卡片 */}
      <div className="grid grid-cols-3 gap-2">
        <StatCard label="Wave" value={String(wave)} color="#FFD166" />
        <StatCard label="LIFE" value={`${hp}/${maxHp}`} color="#FF6B6B" />
        <StatCard label="Stardust" value={String(stardust)} color="#4ECDC4" />
      </div>

      {corruption > 0 && (
        <div className="flex items-center gap-2 px-3 py-2 rounded bg-red-900/30 border border-red-500/40 text-xs">
          <Skull className="w-3.5 h-3.5 text-red-400" />
          <span className="text-red-300">Corruption: <b>{corruption}</b> / 100</span>
        </div>
      )}

      {/* 按钮 */}
      <div className="flex flex-col gap-2 mt-2">
        <button
          onClick={onResume}
          className="flex items-center justify-center gap-2 py-3 rounded font-display text-base bg-gradient-to-r from-neon-gold to-amber-300 text-void-900 hover:shadow-glow-gold transition-all"
        >
          <Play className="w-4 h-4 fill-void-900" />
          Resume Run
        </button>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onToggleSound}
            className="flex items-center justify-center gap-2 py-2.5 rounded font-body text-sm bg-void-700/70 border border-gray-700 text-gray-300 hover:text-white hover:border-neon-gold/40 transition-all"
          >
            {soundOn ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            {soundOn ? 'Sound: On' : 'Sound: Off'}
          </button>
          <button
            onClick={onQuit}
            className="flex items-center justify-center gap-2 py-2.5 rounded font-body text-sm bg-void-700/70 border border-gray-700 text-gray-300 hover:text-elem-fire hover:border-elem-fire/50 transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            Leave Run
          </button>
        </div>
      </div>

      {/* 提示 */}
      <div className="text-center text-[11px] text-gray-500 mt-1 font-body">
        Press <kbd className="px-1.5 py-0.5 rounded bg-void-700 text-neon-gold font-mono">ESC</kbd> or select Resume Run to continue.
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div
      className="flex flex-col items-center gap-0.5 p-3 rounded border"
      style={{ background: color + '11', borderColor: color + '44' }}
    >
      <span className="text-[10px] text-gray-400 uppercase tracking-wider">{label}</span>
      <span className="font-display text-lg" style={{ color }}>{value}</span>
    </div>
  );
}

// ============= 遗物查看 =============
function RelicsTab({ relics }: { relics: ReturnType<typeof useGameStore.getState>['ownedRelics'] }) {
  if (relics.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-500">
        <Package className="w-10 h-10 mb-3 opacity-30" />
        <p className="text-sm font-body">No relics collected yet.</p>
        <p className="text-xs mt-1">Choose a relic after clearing a wave.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-2">
      {relics.map((r) => (
        <div
          key={r.id}
          className="flex items-start gap-3 p-3 rounded border border-neon-gold/30 bg-neon-gold/5"
        >
          <div className="w-10 h-10 rounded flex items-center justify-center text-xl bg-void-700/80">
            {r.icon || '✨'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline justify-between gap-2">
              <h4 className="font-display text-sm text-neon-gold truncate">{r.name}</h4>
            </div>
            <p className="text-[11px] text-gray-400 font-body mt-0.5 leading-snug">{r.description}</p>
            {r.effects.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1.5">
                {r.effects.map((e, i) => (
                  <span
                    key={i}
                    className="px-1.5 py-0.5 rounded text-[10px] font-display bg-void-700/50 text-neon-cyan"
                  >
                    {e.type}: {e.value}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ============= 少女好感度查看 =============
function MaidensTab({ affinity, seenMaidens }: {
  affinity: Record<string, number>;
  seenMaidens: string[];
}) {
  if (seenMaidens.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-500">
        <Heart className="w-10 h-10 mb-3 opacity-30" />
        <p className="text-sm font-body">You have not met a Star Core Guardian yet.</p>
        <p className="text-xs mt-1">First encounter triggered after advancing to wave 2</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-2">
      {seenMaidens.map((id) => {
        const maiden = MAIDENS[id as keyof typeof MAIDENS] as MaidenConfig | undefined;
        if (!maiden) return null;
        const aff = affinity[id] || 0;
        const elem = ELEMENTS[maiden.element];
        // 好感度阶段
        const stage = aff >= 100 ? 'Pledge' : aff >= 60 ? 'Love' : aff >= 30 ? 'Heartbeat' : aff >= 10 ? 'Meet' : 'First meeting';

        return (
          <div
            key={id}
            className="flex items-start gap-3 p-3 rounded border"
            style={{
              background: elem.color + '11',
              borderColor: elem.color + '44',
            }}
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
              style={{
                background: `radial-gradient(circle, ${elem.color}, ${elem.color}66)`,
                boxShadow: `0 0 16px ${elem.color}88`,
              }}
            >
              {maiden.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between gap-2">
                <div className="flex items-baseline gap-1.5">
                  <h4 className="font-display text-sm" style={{ color: elem.color }}>{maiden.name}</h4>
                  <span className="text-[10px] text-gray-500">·{stage}</span>
                </div>
                <span className="font-display text-xs text-neon-gold">{aff}/100</span>
              </div>
              <p className="text-[10px] text-gray-500 mb-1">{maiden.title}</p>

              {/* 好感度进度条 */}
              <div className="h-1.5 rounded-full bg-void-700/60 overflow-hidden mb-1.5">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${Math.min(100, aff)}%`,
                    background: `linear-gradient(to right, ${elem.color}, #FFD166)`,
                  }}
                />
              </div>

              {/* Boon 解锁状态 */}
              <div className="flex flex-wrap gap-1">
                {maiden.boons.map((b, idx) => {
                  const unlocked = aff >= b.threshold;
                  return (
                    <span
                      key={`${maiden.id}-boon-${idx}`}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-display ${
                        unlocked
                          ? 'bg-neon-gold/20 text-neon-gold border border-neon-gold/40'
                          : 'bg-void-700/40 text-gray-500 border border-gray-700'
                      }`}
                      title={unlocked ? b.description : `Favorability ${b.threshold} Unlock`}
                    >
                      {unlocked ? '✓ ' : '🔒 '}{b.name}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
