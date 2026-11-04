import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, MousePointerClick, Combine, Zap, Swords, Sparkles, Heart } from 'lucide-react';

const STORAGE_KEY = 'stellar-forge-tutorial-seen';

type TabId = 'basics' | 'merge' | 'synergy' | 'combat' | 'story';

interface Tab {
  id: TabId;
  title: string;
  icon: React.ReactNode;
  color: string;
}

const TABS: Tab[] = [
  { id: 'basics', title: 'Controls', icon: <MousePointerClick className="w-4 h-4" />, color: '#FFD166' },
  { id: 'merge', title: 'Merge & Evolve', icon: <Combine className="w-4 h-4" />, color: '#4ECDC4' },
  { id: 'synergy', title: 'Resonance', icon: <Zap className="w-4 h-4" />, color: '#9B59B6' },
  { id: 'combat', title: 'Combat', icon: <Swords className="w-4 h-4" />, color: '#FF6B6B' },
  { id: 'story', title: 'Story & Contracts', icon: <Sparkles className="w-4 h-4" />, color: '#E94560' },
];

interface TutorialModalProps {
  // 外部强制显示（用于点击问号按钮）
  forceOpen?: boolean;
  onClose?: () => void;
}

export default function TutorialModal({ forceOpen, onClose }: TutorialModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tab, setTab] = useState<TabId>('basics');

  // 首次进入自动弹出
  useEffect(() => {
    if (forceOpen) {
      setIsOpen(true);
      setTab('basics');
      return;
    }
    try {
      const seen = localStorage.getItem(STORAGE_KEY);
      if (!seen) {
        setIsOpen(true);
      }
    } catch {
      // localStorage 不可用时默认不弹出
    }
  }, [forceOpen]);

  const handleClose = () => {
    setIsOpen(false);
    try {
      localStorage.setItem(STORAGE_KEY, '1');
    } catch {
      // ignore
    }
    onClose?.();
  };

  const goNext = () => {
    const idx = TABS.findIndex(t => t.id === tab);
    if (idx < TABS.length - 1) {
      setTab(TABS[idx + 1].id);
    } else {
      handleClose();
    }
  };

  const goPrev = () => {
    const idx = TABS.findIndex(t => t.id === tab);
    if (idx > 0) {
      setTab(TABS[idx - 1].id);
    }
  };

  const currentIdx = TABS.findIndex(t => t.id === tab);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md pointer-auto"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 22 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-[640px] max-w-[95vw] max-h-[90vh] overflow-hidden rounded-lg clip-corner border-2"
            style={{
              borderColor: TABS.find(t => t.id === tab)?.color || '#FFD166',
              background: 'linear-gradient(180deg, #1A1A3A 0%, #0B0518 100%)',
              boxShadow: '0 0 50px rgba(255,209,102,0.3)',
            }}
          >
            {/* 顶部：标题 + 关闭 */}
            <div className="flex items-center justify-between gap-2 px-3 py-3 sm:px-6 sm:py-4 border-b border-gray-700/50">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-neon-gold" />
                <h2 className="font-display text-xl text-neon-gold">How to play</h2>
                <span className="hidden text-xs text-gray-500 font-body sm:inline">STELLAR FORGE GUIDE</span>
              </div>
              <button
                onClick={handleClose}
                className="p-1.5 rounded text-gray-400 hover:text-white hover:bg-void-700/50 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 标签栏 */}
            <div className="flex gap-1 px-4 py-3 border-b border-gray-700/30 overflow-x-auto">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-display whitespace-nowrap transition-all ${
                    tab === t.id
                      ? 'text-void-900'
                      : 'text-gray-400 hover:text-white hover:bg-void-700/50'
                  }`}
                  style={tab === t.id ? { background: t.color } : {}}
                >
                  {t.icon}
                  {t.title}
                </button>
              ))}
            </div>

            {/* 内容区 */}
            <div className="px-3 py-4 overflow-y-auto sm:px-6 sm:py-5" style={{ maxHeight: '60vh' }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={tab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {tab === 'basics' && <BasicsTab />}
                  {tab === 'merge' && <MergeTab />}
                  {tab === 'synergy' && <SynergyTab />}
                  {tab === 'combat' && <CombatTab />}
                  {tab === 'story' && <StoryTab />}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* 底部：进度 + 翻页 */}
            <div className="flex items-center justify-between gap-2 px-3 py-3 sm:px-6 sm:py-4 border-t border-gray-700/50">
              <div className="flex gap-1.5">
                {TABS.map((t, i) => (
                  <div
                    key={t.id}
                    className="h-1.5 rounded-full transition-all"
                    style={{
                      width: i === currentIdx ? 24 : 8,
                      background: i <= currentIdx
                        ? TABS[currentIdx].color
                        : 'rgba(255,255,255,0.15)',
                    }}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                {currentIdx > 0 && (
                  <button
                    onClick={goPrev}
                    className="flex items-center gap-1 px-3 py-1.5 rounded text-xs font-display text-gray-300 hover:text-white bg-void-700/50 hover:bg-void-700 transition-all"
                  >
                    <ChevronLeft className="w-3 h-3" />
                    Back
                  </button>
                )}
                <button
                  onClick={goNext}
                  className="flex items-center gap-1 px-4 py-1.5 rounded text-xs font-display text-void-900 transition-all"
                  style={{
                    background: TABS[currentIdx].color,
                    boxShadow: `0 0 12px ${TABS[currentIdx].color}66`,
                  }}
                >
                  {currentIdx === TABS.length - 1 ? 'Start Run' : 'Next'}
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ============= 基础操作 =============
function BasicsTab() {
  return (
    <div className="space-y-4 text-sm text-gray-200 font-body">
      <SectionTitle icon={<MousePointerClick className="w-4 h-4" />} color="#FFD166" title="Place Star Cores" />
      <ul className="space-y-2 pl-1">
        <li className="flex gap-2">
          <span className="text-neon-gold">▸</span>
          <span>Click or tap a board column to drop the current Star Core into its lowest available space.</span>
        </li>
        <li className="flex gap-2">
          <span className="text-neon-gold">▸</span>
          <span>Press <kbd className="px-1.5 py-0.5 rounded bg-void-700 text-neon-gold font-mono text-xs">1</kbd>–<kbd className="px-1.5 py-0.5 rounded bg-void-700 text-neon-gold font-mono text-xs">6</kbd> to drop a core into the matching column.</span>
        </li>
        <li className="flex gap-2">
          <span className="text-neon-gold">▸</span>
          <span>The <b className="text-neon-cyan">NEXT</b> indicator shows which element will drop next. The element advances automatically after each placement.</span>
        </li>
      </ul>

      <SectionTitle icon={<Sparkles className="w-4 h-4" />} color="#4ECDC4" title="Five Elements" />
      <div className="grid grid-cols-5 gap-2">
        {[
          { sym: '🔥', name: 'Fire', color: '#FF6B6B', desc: 'High damage' },
          { sym: '💧', name: 'Water', color: '#4ECDC4', desc: 'Slows enemies' },
          { sym: '🪨', name: 'Earth', color: '#C9A26B', desc: 'Area damage' },
          { sym: '🌀', name: 'Wind', color: '#95E1D3', desc: 'Fast attacks' },
          { sym: '⚡', name: 'Lightning', color: '#FFE66D', desc: 'Critical hits' },
        ].map((el) => (
          <div
            key={el.name}
            className="flex flex-col items-center gap-1 p-2 rounded text-center"
            style={{ background: el.color + '22', border: `1px solid ${el.color}66` }}
          >
            <span className="text-2xl">{el.sym}</span>
            <span className="font-display text-xs" style={{ color: el.color }}>{el.name}</span>
            <span className="text-[10px] text-gray-400">{el.desc}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 rounded bg-neon-gold/10 border border-neon-gold/30">
        <p className="text-xs text-neon-gold font-body">
          💡 <b>Tip:</b> More elements unlock as you advance. Select an element in the HUD to choose which one drops next.
        </p>
      </div>
    </div>
  );
}

// ============= 融合升级 =============
function MergeTab() {
  return (
    <div className="space-y-4 text-sm text-gray-200 font-body">
      <SectionTitle icon={<Combine className="w-4 h-4" />} color="#4ECDC4" title="Automatic Merging" />
      <p className="text-gray-300 leading-relaxed">
        Adjacent Star Cores with the <b className="text-neon-cyan">same element and level</b> merge automatically into a <b className="text-neon-cyan">higher-level</b> core with increased damage and range.
      </p>

      <div className="flex items-center justify-center gap-2 py-3">
        <MergeNode sym="🔥" color="#FF6B6B" label="Lv.1" />
        <span className="text-neon-gold text-xl">+</span>
        <MergeNode sym="🔥" color="#FF6B6B" label="Lv.1" />
        <ChevronRight className="w-4 h-4 text-gray-500" />
        <MergeNode sym="🔥" color="#FF8E53" label="Lv.2" bigger />
      </div>

      <SectionTitle icon={<Sparkles className="w-4 h-4" />} color="#FFD166" title="Levels & Evolution" />
      <ul className="space-y-1.5 pl-1">
        <li><span className="text-neon-gold">Levels 1–3:</span> Each merge raises the core's level and improves its damage and range.</li>
        <li><span className="text-neon-gold">At level 3:</span> Choose one of two evolution paths.</li>
        <li><span className="text-neon-gold">Evolution:</span> Grants a unique ability, such as splash damage, chain lightning, or a critical-hit bonus.</li>
      </ul>

      <div className="p-3 rounded bg-elem-water/10 border border-elem-water/30">
        <p className="text-xs text-elem-water font-body">
          💡 <b>Tip:</b> Focus your merges to unlock an evolution early, then build around its strengths.
        </p>
      </div>
    </div>
  );
}

function MergeNode({ sym, color, label, bigger }: { sym: string; color: string; label: string; bigger?: boolean }) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-full ${bigger ? 'w-14 h-14' : 'w-12 h-12'}`}
      style={{
        background: `radial-gradient(circle, ${color}, ${color}66)`,
        boxShadow: `0 0 16px ${color}`,
        border: `2px solid ${color}`,
      }}
    >
      <span className={bigger ? 'text-2xl' : 'text-xl'}>{sym}</span>
      <span className="text-[9px] text-white font-display">{label}</span>
    </div>
  );
}

// ============= 共鸣组合 =============
function SynergyTab() {
  const synergies = [
    { pair: '🔥 + 💧', name: 'Steam Resonance', color: '#BFE5E5', desc: 'AoE Slow + Burn' },
    { pair: '🔥 + 🌀', name: 'Firestorm', color: '#FFB347', desc: 'Attack speed + damage increased' },
    { pair: '💧 + ⚡', name: 'Electromagnetic Pulse', color: '#7FE5DD', desc: 'Chain Lightning + Slow' },
    { pair: '🪨 + 🔥', name: 'Magma Eruption', color: '#FF6B6B', desc: 'Explosive Sputter' },
    { pair: '🪨 + 💧', name: 'Frozen Earth', color: '#9FE5DD', desc: 'Freeze + Armor Penetration' },
    { pair: '🌀 + ⚡', name: 'Fury of the Storm', color: '#FFE66D', desc: 'Critical Hit + Chain' },
  ];
  return (
    <div className="space-y-4 text-sm text-gray-200 font-body">
      <SectionTitle icon={<Zap className="w-4 h-4" />} color="#9B59B6" title="Elemental Resonance" />
      <p className="text-gray-300 leading-relaxed">
        Place <b className="text-neon-purple">different elements</b> next to each other to activate resonance. Connected cores create a link that grants a bonus.
      </p>

      <div className="grid grid-cols-2 gap-2">
        {synergies.map((syn) => (
          <div
            key={syn.name}
            className="p-2 rounded border"
            style={{
              background: syn.color + '11',
              borderColor: syn.color + '44',
            }}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-base">{syn.pair}</span>
              <span className="font-display text-xs" style={{ color: syn.color }}>{syn.name}</span>
            </div>
            <p className="text-[11px] text-gray-400">{syn.desc}</p>
          </div>
        ))}
      </div>

      <div className="p-3 rounded bg-neon-purple/10 border border-neon-purple/30">
        <p className="text-xs text-neon-purple font-body">
          💡 <b>Tip:</b> You can activate several resonances at once. Arrange your cores to keep useful links connected.
        </p>
      </div>
    </div>
  );
}

// ============= 战斗系统 =============
function CombatTab() {
  return (
    <div className="space-y-4 text-sm text-gray-200 font-body">
      <SectionTitle icon={<Swords className="w-4 h-4" />} color="#FF6B6B" title="How Combat Works" />
      <div className="space-y-2">
        <Step n={1} text="Enemies advance from the top of the board toward your core." color="#FF6B6B" />
        <Step n={2} text="Your Star Cores automatically attack enemies in range." color="#FFD166" />
        <Step n={3} text="Defeat enemies to earn Stardust and build energy for your skills." color="#FFD166" />
        <Step n={4} text="Enemies that reach your core reduce its health." color="#FF6B6B" />
        <Step n={5} text="Clear the wave to visit the shop and choose a relic." color="#4ECDC4" />
        <Step n={6} text="Continue to face the next wave." color="#9B59B6" />
      </div>

      <SectionTitle icon={<Heart className="w-4 h-4" />} color="#E74C3C" title="Enemy Types" />
      <div className="grid grid-cols-2 gap-2 text-xs">
        <EnemyCard color="#9B59B6" name="Grunt" desc="Moves at a steady pace" />
        <EnemyCard color="#E74C3C" name="Assassin" desc="High Speed Charge" />
        <EnemyCard color="#34495E" name="Guardian" desc="Reduces incoming damage" />
        <EnemyCard color="#16A085" name="Flyer" desc="Only Wind or Lightning can hit it" />
        <EnemyCard color="#27AE60" name="Priest" desc="Heals nearby allies" />
        <EnemyCard color="#9B59B6" name="Splitter" desc="Teleports forward" />
        <EnemyCard color="#7F1A1A" name="Corrupted Core" desc="Splits when defeated" />
        <EnemyCard color="#C0392B" name="Reaper" desc="Charges quickly at low health" />
      </div>

      <SectionTitle icon={<Zap className="w-4 h-4" />} color="#FFD166" title="Active Skills" />
      <p className="text-gray-300 leading-relaxed">
        Defeating enemies fills your <b className="text-neon-cyan">Energy</b> meter (up to 100). Spend energy to unleash one of three skills:
      </p>
      <div className="grid grid-cols-3 gap-2">
        <SkillCard sym="☄️" name="Meteor Shower" hotkey="Q" cost={40} color="#FF6B6B" desc="Damages all enemies" />
        <SkillCard sym="❄️" name="Time Freeze" hotkey="W" cost={60} color="#4ECDC4" desc="Freezes enemies for 4 sec" />
        <SkillCard sym="⚡" name="Elemental Storm" hotkey="E" cost={80} color="#FFD166" desc="Triggers chain blasts" />
      </div>
      <div className="p-3 rounded bg-neon-gold/10 border border-neon-gold/30">
        <p className="text-xs text-neon-gold font-body">
          💡 <b>Tip:</b> Skill buttons glow when you have enough energy to use them.
        </p>
      </div>

      <div className="p-3 rounded bg-elem-fire/10 border border-elem-fire/30">
        <p className="text-xs text-elem-fire font-body">
          ⚠ <b>Note:</b> Flying enemies can only be hit by <b>Wind</b> or <b>Lightning</b>. Keep at least one of these elements on the board.
        </p>
      </div>
    </div>
  );
}

function Step({ n, text, color }: { n: number; text: string; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="w-6 h-6 rounded-full flex items-center justify-center font-display text-xs"
        style={{ background: color, color: '#0B0518' }}
      >
        {n}
      </div>
      <span className="text-gray-200">{text}</span>
    </div>
  );
}

function EnemyCard({ color, name, desc }: { color: string; name: string; desc: string }) {
  return (
    <div
      className="flex items-center gap-2 p-2 rounded border"
      style={{ background: color + '11', borderColor: color + '44' }}
    >
      <div className="w-3 h-3 rounded-full" style={{ background: color }} />
      <div>
        <div className="font-display text-xs" style={{ color }}>{name}</div>
        <div className="text-[10px] text-gray-400">{desc}</div>
      </div>
    </div>
  );
}

function SkillCard({ sym, name, hotkey, cost, color, desc }: { sym: string; name: string; hotkey: string; cost: number; color: string; desc: string }) {
  return (
    <div
      className="flex flex-col items-center gap-1 p-2 rounded border"
      style={{ background: color + '11', borderColor: color + '44' }}
    >
      <div className="flex items-center gap-1">
        <span className="text-xl">{sym}</span>
        <kbd className="px-1.5 py-0.5 rounded bg-void-700 text-neon-gold font-mono text-[10px]">{hotkey}</kbd>
      </div>
      <div className="font-display text-xs" style={{ color }}>{name}</div>
      <div className="text-[10px] text-gray-400">{cost} Energy</div>
      <div className="text-[10px] text-gray-300">{desc}</div>
    </div>
  );
}

// ============= 剧情博弈 =============
function StoryTab() {
  return (
    <div className="space-y-4 text-sm text-gray-200 font-body">
      <SectionTitle icon={<Sparkles className="w-4 h-4" />} color="#E94560" title="Battlefields" />
      <div className="space-y-1.5">
        <SceneRow wave="1–4" name="Void Gate" color="#9B59B6" desc="The run begins" />
        <SceneRow wave="5–9" name="Burning Star Sea" color="#FF8E53" desc="The Abyss Eater appears" />
        <SceneRow wave="10–14" name="Crystal Temple" color="#7FE5DD" desc="The Void Weaver appears" />
        <SceneRow wave="15+" name="Final Abyss" color="#C0392B" desc="The Eye of Finality awaits" />
      </div>

      <SectionTitle icon={<Heart className="w-4 h-4" />} color="#FF6B6B" title="Star Core Guardians" />
      <ul className="space-y-1.5 pl-1">
        <li className="flex gap-2"><span className="text-elem-fire">❤</span><span>Element-themed dialogue appears on specific waves.</span></li>
        <li className="flex gap-2"><span className="text-elem-fire">🎁</span><span>Spend <b className="text-neon-gold">20 Stardust</b> on a gift to gain 15 affection.</span></li>
        <li className="flex gap-2"><span className="text-elem-fire">✨</span><span>Complete her event to gain affection and activate an elemental blessing.</span></li>
        <li className="flex gap-2"><span className="text-elem-fire">⭐</span><span>At <b>30, 60, and 100 affection</b>, unlock permanent relic bonuses.</span></li>
      </ul>

      <SectionTitle icon={<Swords className="w-4 h-4" />} color="#7F1A1A" title="Monster Contracts" />
      <ul className="space-y-1.5 pl-1">
        <li className="flex gap-2"><span className="text-elem-fire">⚔</span><span>A contract event appears before boss waves 5, 10, 15, and 20.</span></li>
        <li className="flex gap-2"><span className="text-elem-fire">💀</span><span>After the encounter, choose to <b>accept</b> or <b>reject</b> the contract.</span></li>
        <li className="flex gap-2"><span className="text-elem-fire">📑</span><span>Accept for a powerful relic, but pay a cost and gain corruption.</span></li>
        <li className="flex gap-2"><span className="text-elem-fire">🚫</span><span>Reject to avoid the cost and continue without a reward.</span></li>
      </ul>

      <div className="p-3 rounded bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/40">
        <p className="text-xs text-pink-300 font-body">
          💗 <b>Choose your path:</b> Earn lasting blessings from the Guardians, or take a risky contract for immediate power.
        </p>
      </div>
    </div>
  );
}

function SceneRow({ wave, name, color, desc }: { wave: string; name: string; color: string; desc: string }) {
  return (
    <div
      className="flex items-center gap-3 p-2 rounded border"
      style={{ background: color + '11', borderColor: color + '44' }}
    >
      <span className="font-display text-xs text-gray-400 w-12">W{wave}</span>
      <span className="font-display text-sm" style={{ color }}>{name}</span>
      <span className="text-xs text-gray-400">{desc}</span>
    </div>
  );
}

function SectionTitle({ icon, color, title }: { icon: React.ReactNode; color: string; title: string }) {
  return (
    <div className="flex items-center gap-2 mt-2">
      <div
        className="w-6 h-6 rounded flex items-center justify-center"
        style={{ background: color + '22', color }}
      >
        {icon}
      </div>
      <h3 className="font-display text-sm" style={{ color }}>{title}</h3>
    </div>
  );
}

// 暴露重置方法供外部使用（开发调试用）
export function resetTutorialSeen() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
