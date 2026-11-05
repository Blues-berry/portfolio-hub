import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useMetaStore, UPGRADES, isUpgradePurchased, type UpgradeId } from '@/store/metaStore';
import { useAchievementStore } from '@/store/achievementStore';
import { ACHIEVEMENTS, ACHIEVEMENT_CATEGORIES, AchievementCategory } from '@/data/achievements';
import type { MetaProgress } from '@/types/game';
import AchievementToast from '@/components/game/AchievementToast';
import DailyChallengeDialog from '@/components/game/DailyChallengeDialog';
import CodexView from '@/components/game/CodexView';
import RuneView from '@/components/game/RuneView';
import TalentView from '@/components/game/TalentView';
import { Sparkles, Play, Store, HelpCircle, Trophy, Check, Award, Calendar, BookOpen, Gem, Star } from 'lucide-react';

type Tab = 'home' | 'shop' | 'achievements' | 'codex' | 'runes' | 'talents' | 'help';

export default function Home() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('home');
  const [dailyOpen, setDailyOpen] = useState(false);
  const meta = useMetaStore();
  const upgrade = useMetaStore(s => s.upgrade);

  const handleStart = () => {
    navigate('/game');
  };

  const handleDailyOpen = () => {
    setDailyOpen(true);
  };

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* 星空背景 */}
      <div className="absolute inset-0 starfield opacity-60" />
      <div className="absolute inset-0 bg-gradient-to-b from-void-900/40 via-transparent to-void-900/80" />

      {/* 顶部导航 */}
      <nav className="absolute top-0 left-0 right-0 z-30 flex flex-wrap items-center justify-between gap-x-2 gap-y-2 px-2 py-2 sm:flex-nowrap sm:px-6 sm:py-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-neon-gold" />
          <span className="hidden font-display text-sm text-neon-gold tracking-widest sm:inline">STELLAR FORGE: LAST STAND</span>
        </div>
        <div className="order-3 flex w-full min-w-0 max-w-full gap-1 overflow-x-auto rounded-full border border-neon-gold/20 bg-void-900/60 p-1 sm:order-none sm:w-auto">
          <TabButton active={tab === 'home'} onClick={() => setTab('home')} icon={<Play className="w-3.5 h-3.5" />}>
            Main Menu
          </TabButton>
          <TabButton active={tab === 'shop'} onClick={() => setTab('shop')} icon={<Store className="w-3.5 h-3.5" />}>
            Upgrades
          </TabButton>
          <TabButton active={tab === 'achievements'} onClick={() => setTab('achievements')} icon={<Award className="w-3.5 h-3.5" />}>
            Achievements
          </TabButton>
          <TabButton active={tab === 'codex'} onClick={() => setTab('codex')} icon={<BookOpen className="w-3.5 h-3.5" />}>
            Codex
          </TabButton>
          <TabButton active={tab === 'runes'} onClick={() => setTab('runes')} icon={<Gem className="w-3.5 h-3.5" />}>
            Runes
          </TabButton>
          <TabButton active={tab === 'talents'} onClick={() => setTab('talents')} icon={<Star className="w-3.5 h-3.5" />}>
            Talents
          </TabButton>
          <TabButton active={tab === 'help'} onClick={() => setTab('help')} icon={<HelpCircle className="w-3.5 h-3.5" />}>
            How to Play
          </TabButton>
        </div>
        <div className="order-2 flex flex-shrink-0 items-center gap-2 rounded-full border border-neon-gold/30 bg-void-900/60 px-3 py-1.5 sm:order-none">
          <Sparkles className="w-4 h-4 text-neon-gold" />
          <span className="font-display text-neon-gold text-sm">{meta.totalStardust}</span>
        </div>
      </nav>

      {/* 内容区 */}
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-center" style={{ top: '8rem' }}>
        {tab === 'home' && <HomeView onStart={handleStart} onDaily={handleDailyOpen} meta={meta} />}
        {tab === 'shop' && <ShopView upgrade={upgrade} meta={meta} />}
        {tab === 'achievements' && <AchievementsView />}
        {tab === 'codex' && <CodexView />}
        {tab === 'runes' && <RuneView />}
        {tab === 'talents' && <TalentView />}
        {tab === 'help' && <HelpView />}
      </div>

      {/* 成就解锁通知 */}
      <AchievementToast />

      {/* 日常挑战对话框 */}
      <DailyChallengeDialog open={dailyOpen} onClose={() => setDailyOpen(false)} />
    </div>
  );
}

function TabButton({ active, onClick, icon, children }: { active: boolean; onClick: () => void; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-shrink-0 items-center gap-1.5 px-2 py-1.5 text-[10px] font-body transition-all sm:rounded-full sm:px-3 sm:text-xs ${
        active ? 'bg-neon-gold text-void-900 shadow-glow-gold' : 'text-gray-400 hover:text-neon-gold'
      }`}
    >
      {icon}
      {children}
    </button>
  );
}

function HomeView({ onStart, onDaily, meta }: { onStart: () => void; onDaily: () => void; meta: MetaProgress }) {
  return (
    <div className="flex flex-col items-center text-center px-6">
      {/* 标题 */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, type: 'spring', damping: 20 }}
        className="mb-2"
      >
        <div className="text-xs font-body text-neon-cyan tracking-[0.5em] mb-3 opacity-70">
          MERGE · ROGUELIKE · TOWER DEFENSE
        </div>
        <h1 className="font-display font-black text-4xl sm:text-6xl xl:text-7xl leading-none">
          <span className="bg-gradient-to-r from-neon-gold via-amber-300 to-neon-gold bg-clip-text text-transparent text-glow-gold">
            STELLAR FORGE: LAST STAND
          </span>
        </h1>
        <div className="font-display text-sm text-neon-cyan/80 tracking-[0.3em] mt-2">MERGE · EVOLVE · SURVIVE</div>
      </motion.div>
      {/* 副标题 */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-gray-400 text-base font-body max-w-md mb-8"
      >
        Defend your core for 20 waves. Spend limited deployment charges to place and merge elemental towers; defeat the final boss before it reaches your core.
      </motion.p>

      {/* 最高纪录 */}
      {meta.bestWave > 0 && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center gap-6 mb-8 px-6 py-2 rounded-full bg-void-900/60 border border-neon-gold/20"
        >
          <div className="flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-neon-gold" />
            <span className="text-xs text-gray-400 font-body">Best wave</span>
            <span className="font-display text-neon-gold">{meta.bestWave}</span>
          </div>
          <div className="w-px h-4 bg-gray-700" />
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-gray-400 font-body">Highest score</span>
            <span className="font-display text-neon-cyan">{meta.bestScore}</span>
          </div>
          <div className="w-px h-4 bg-gray-700" />
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-gray-400 font-body">Total kills</span>
            <span className="font-display text-elem-fire">{meta.totalKills}</span>
          </div>
        </motion.div>
      )}

      {/* 开始按钮 */}
      <motion.button
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.6, type: 'spring', damping: 15 }}
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.98 }}
        onClick={onStart}
        className="group relative px-12 py-4 mb-3 clip-hex font-display text-xl font-bold text-void-900 bg-gradient-to-r from-neon-gold via-amber-300 to-neon-gold shadow-glow-gold overflow-hidden"
      >
        <span className="relative z-10 flex items-center gap-2">
          <Play className="w-5 h-5 fill-void-900" />
          Start a Run
        </span>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
      </motion.button>

      {/* 日常挑战按钮 */}
      <motion.button
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.7, type: 'spring', damping: 15 }}
        whileHover={{ scale: 1.03, y: -1 }}
        whileTap={{ scale: 0.98 }}
        onClick={onDaily}
        className="group relative px-6 py-2.5 mb-3 rounded-lg font-display text-sm font-bold text-neon-gold border-2 border-neon-gold/60 bg-void-900/60 hover:bg-neon-gold/10 hover:border-neon-gold transition-all overflow-hidden flex items-center gap-2"
      >
        <Calendar className="w-4 h-4" />
        Daily Challenge
        <span className="text-[10px] text-gray-400 font-body">A new set of rules every day</span>
      </motion.button>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-xs text-gray-500 font-body"
      >
        Click a column to drop a Star Core. Matching cores merge automatically.
      </motion.p>

      {/* 元素预览 */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1 }}
        className="flex gap-3 mt-10"
      >
        {[
          { sym: '🔥', name: 'Fire', col: '#FF6B6B' },
          { sym: '💧', name: 'Water', col: '#4ECDC4' },
          { sym: '🪨', name: 'Earth', col: '#C9A26B' },
          { sym: '🌀', name: 'Wind', col: '#95E1D3' },
          { sym: '⚡', name: 'Lightning', col: '#FFE66D' },
        ].map((e, i) => (
          <motion.div
            key={e.name}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1 + i * 0.1, type: 'spring', damping: 12 }}
            className="flex flex-col items-center gap-1"
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-xl animate-float"
              style={{
                background: `radial-gradient(circle, ${e.col}, ${e.col}66)`,
                boxShadow: `0 0 20px ${e.col}88`,
                animationDelay: `${i * 0.3}s`,
              }}
            >
              {e.sym}
            </div>
            <span className="text-[10px] font-body text-gray-400">{e.name}</span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

function ShopView({ upgrade, meta }: { upgrade: (id: UpgradeId) => boolean; meta: MetaProgress }) {
  const checkAchievements = useAchievementStore(s => s.checkAchievements);

  const handleUpgrade = (id: UpgradeId) => {
    const success = upgrade(id);
    if (success) {
      // 元素解锁后触发成就检测
      checkAchievements({
        unlockedElements: useMetaStore.getState().unlocks.unlockedElements,
      });
    }
  };

  return (
    <div className="w-full max-w-3xl px-6 overflow-y-auto h-full pb-20">
      <h2 className="font-display text-2xl text-neon-gold text-glow-gold mb-1">Permanent Upgrades</h2>
      <p className="text-gray-400 text-sm font-body mb-6">Spend Stardust to unlock upgrades that carry over between runs.</p>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {UPGRADES.map((u, i) => {
          const purchased = isUpgradePurchased(meta, u.id);
          const canAfford = meta.totalStardust >= u.cost;
          return (
            <motion.button
              key={u.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              whileHover={purchased ? {} : { y: -2 }}
              onClick={() => handleUpgrade(u.id)}
              disabled={purchased || !canAfford}
              className={`relative flex items-center gap-3 p-3 rounded-lg clip-corner border text-left transition-all ${
                purchased
                  ? 'bg-neon-gold/10 border-neon-gold/40 opacity-60'
                  : canAfford
                  ? 'bg-void-700/80 border-neon-gold/40 hover:border-neon-gold hover:shadow-glow-gold'
                  : 'bg-void-800/50 border-gray-700 opacity-40 cursor-not-allowed'
              }`}
            >
              <div className="text-3xl">{u.icon}</div>
              <div className="flex-1">
                <div className="font-display text-sm text-white">{u.name}</div>
                <div className="text-xs text-gray-400 font-body">{u.description}</div>
                <div className="flex items-center gap-1 mt-0.5">
                  {purchased ? (
                    <span className="flex items-center gap-1 text-xs text-neon-gold">
                      <Check className="w-3 h-3" /> Unlocked
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs text-neon-gold">
                      <Sparkles className="w-3 h-3" /> {u.cost}
                    </span>
                  )}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

function AchievementsView() {
  const unlocked = useAchievementStore(s => s.unlocked);
  const stats = useAchievementStore(s => s.stats);
  const [filter, setFilter] = useState<AchievementCategory | 'all'>('all');
  const meta = useMetaStore();

  // 构建 liveStats 用于进度显示
  const liveStats = {
    totalKills: stats.totalKills,
    bestWave: meta.bestWave,
    currentWave: 0,
    bossKills: stats.bossKills,
    totalSkillUses: stats.totalSkillUses,
    runSkillsUsed: [],
    seenMaidens: stats.seenMaidens,
    maidenPacts: stats.maidenPacts,
    monsterPacts: stats.monsterPacts,
    unlockedElements: meta.unlocks.unlockedElements,
    energy: 0,
    hpLostInRun: 0,
    bestCombo: 0,
    currentCombo: 0,
    runKills: 0,
  };

  const filtered = filter === 'all' ? ACHIEVEMENTS : ACHIEVEMENTS.filter(a => a.category === filter);
  const unlockedCount = unlocked.length;
  const totalCount = ACHIEVEMENTS.length;
  const unlockedRatio = totalCount > 0 ? unlockedCount / totalCount : 0;

  return (
    <div className="w-full max-w-4xl px-6 overflow-y-auto h-full pb-20">
      <div className="flex items-center justify-between mb-1">
        <h2 className="font-display text-2xl text-neon-gold text-glow-gold">Achievement</h2>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-void-900/60 border border-neon-gold/30">
          <Award className="w-3.5 h-3.5 text-neon-gold" />
          <span className="font-display text-neon-gold text-sm">{unlockedCount} / {totalCount}</span>
        </div>
      </div>
      <p className="text-gray-400 text-sm font-body mb-3">Complete challenges to unlock achievements, some achievements will reward permanent stardust</p>

      {/* 总进度条 */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-body text-gray-400 uppercase tracking-wider">Total progress</span>
          <span className="text-[10px] font-display text-neon-gold">{Math.floor(unlockedRatio * 100)}%</span>
        </div>
        <div className="w-full h-2 bg-void-900/80 border border-neon-gold/30 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${unlockedRatio * 100}%` }}
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
          icon="🏆"
          label="All"
          color="#FFD166"
        />
        {ACHIEVEMENT_CATEGORIES.map(cat => (
          <FilterChip
            key={cat.id}
            active={filter === cat.id}
            onClick={() => setFilter(cat.id)}
            icon={cat.icon}
            label={cat.name}
            color={cat.color}
          />
        ))}
      </div>

      {/* 成就列表 */}
      <div className="grid grid-cols-2 gap-2.5">
        {filtered.map((a, i) => {
          const isUnlocked = unlocked.includes(a.id);
          const progress = useAchievementStore.getState().getProgress(a.id, liveStats);
          return (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02 }}
              className={`relative p-3 rounded-lg clip-corner border overflow-hidden ${
                isUnlocked
                  ? 'bg-neon-gold/10 border-neon-gold/50'
                  : 'bg-void-800/60 border-gray-700/50'
              }`}
            >
              <div className="flex items-start gap-2.5">
                <div className={`text-2xl ${isUnlocked ? '' : 'grayscale opacity-50'}`}>
                  {a.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`font-display text-sm ${isUnlocked ? 'text-neon-gold' : 'text-gray-300'}`}>
                    {a.name}
                  </div>
                  <div className="text-[11px] text-gray-400 font-body leading-snug">
                    {a.description}
                  </div>
                  <div className="flex items-center justify-between mt-1.5">
                    {a.reward > 0 ? (
                      <span className={`flex items-center gap-1 text-[10px] ${isUnlocked ? 'text-neon-gold' : 'text-gray-500'}`}>
                        <Sparkles className="w-2.5 h-2.5" /> {a.reward}
                      </span>
                    ) : (
                      <span className="text-[10px] text-gray-500">No reward</span>
                    )}
                    {isUnlocked ? (
                      <span className="flex items-center gap-1 text-[10px] text-neon-gold font-display">
                        <Check className="w-3 h-3" /> Unlocked
                      </span>
                    ) : (
                      <span className="text-[10px] text-gray-500">
                        {Math.floor(progress * 100)}%
                      </span>
                    )}
                  </div>
                  {/* 进度条 */}
                  {!isUnlocked && (
                    <div className="mt-1 h-1 bg-void-700/60 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-gray-500 to-gray-400 transition-all"
                        style={{ width: `${progress * 100}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function FilterChip({ active, onClick, icon, label, color }: { active: boolean; onClick: () => void; icon: string; label: string; color: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-body transition-all ${
        active ? 'text-void-900' : 'text-gray-400 hover:text-white'
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

function HelpView() {
  const sections = [
    {
      icon: '🎯',
      title: 'Objective',
      text: 'Place Star Cores on the 6×7 board, merge matching cores, and hold back waves of Void enemies for as long as you can.',
    },
    {
      icon: '🔄',
      title: 'Fusion',
      text: 'Adjacent Star Cores with the same element and level merge automatically. Higher-level cores deal more damage; reaching level 3 unlocks an evolution choice.',
    },
    {
      icon: '⚡',
      title: 'Evolution',
      text: 'At level 3, choose one of two evolution paths for that element. Each path grants a distinct ability.',
    },
    {
      icon: '🔗',
      title: 'Resonance',
      text: 'Place different elements next to each other to activate a resonance bonus. Discover six combinations, including Fire + Water and Wind + Lightning.',
    },
    {
      icon: '🧩',
      title: 'Element Bonds',
      text: 'Fielding 2 or 4 cores of the same element unlocks bond bonuses. Build a mixed-element lineup to activate additional team-wide effects.',
    },
    {
      icon: '⭐',
      title: 'Talent',
      text: 'Earn talent points as you progress, then spend them on permanent paths focused on damage, crowd control, or defense. Your upgrades carry over between runs.',
    },
    {
      icon: '🎮',
      title: 'Wave Rewards',
      text: 'After clearing a wave, visit the shop and choose one of three random relics before facing the next wave.',
    },
    {
      icon: '💝',
      title: 'Story Events',
      text: 'Meet the Star Core Guardians and face monster contracts as the waves advance. Accepting a contract grants power at a cost and increases corruption.',
    },
    {
      icon: '⭐',
      title: 'Progress Between Runs',
      text: 'Earn Stardust when a run ends and spend it on permanent upgrades, new elements, health, and extra shop refreshes.',
    },
  ];
  return (
    <div className="w-full max-w-3xl px-6 overflow-y-auto h-full pb-20">
      <h2 className="font-display text-2xl text-neon-gold text-glow-gold mb-1">How to play</h2>
      <p className="text-gray-400 text-sm font-body mb-6">The essentials for your first run</p>

      <div className="grid grid-cols-2 gap-3">
        {sections.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="p-4 rounded-lg clip-corner glass-panel"
          >
            <div className="text-3xl mb-2">{s.icon}</div>
            <h3 className="font-display text-neon-gold text-base mb-1">{s.title}</h3>
            <p className="text-xs text-gray-300 font-body leading-relaxed">{s.text}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 p-4 rounded-lg border border-neon-cyan/30 bg-neon-cyan/5">
        <h3 className="font-display text-neon-cyan text-sm mb-2">Controls</h3>
        <div className="text-xs text-gray-300 font-body space-y-1">
          <div>• <span className="text-neon-gold">Click or tap a column</span> to place the current Star Core</div>
          <div>• Press <span className="text-neon-gold font-mono">1</span>–<span className="text-neon-gold font-mono">6</span> to place it in the matching column</div>
          <div>• <span className="text-neon-gold">Select an element icon</span> to switch the next Star Core</div>
          <div>• Clear the wave to enter the <span className="text-neon-gold">shop</span></div>
          <div>• Choose one of three <span className="text-neon-gold">relics</span>, then continue to the next wave</div>
        </div>
      </div>

      <div className="mt-3 p-4 rounded-lg border border-neon-purple/30 bg-neon-purple/5">
        <h3 className="font-display text-neon-purple text-sm mb-2">Enemy Traits</h3>
        <div className="text-xs text-gray-300 font-body space-y-1">
          <div>• <span className="text-neon-purple">Flying enemies</span> can only be hit by Wind or Lightning</div>
          <div>• <span className="text-neon-purple">Armored enemies</span> take 50% less damage</div>
          <div>• <span className="text-neon-purple">Splitters</span> teleport forward at intervals</div>
          <div>• <span className="text-neon-purple">Corrupted Star Cores</span> split into swarms when defeated</div>
        </div>
      </div>
    </div>
  );
}
