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
          <span className="hidden font-display text-sm text-neon-gold tracking-widest sm:inline">STELLAR FORGE</span>
        </div>
        <div className="order-3 flex w-full min-w-0 max-w-full gap-1 overflow-x-auto rounded-full border border-neon-gold/20 bg-void-900/60 p-1 sm:order-none sm:w-auto">
          <TabButton active={tab === 'home'} onClick={() => setTab('home')} icon={<Play className="w-3.5 h-3.5" />}>
            主菜单
          </TabButton>
          <TabButton active={tab === 'shop'} onClick={() => setTab('shop')} icon={<Store className="w-3.5 h-3.5" />}>
            永久升级
          </TabButton>
          <TabButton active={tab === 'achievements'} onClick={() => setTab('achievements')} icon={<Award className="w-3.5 h-3.5" />}>
            成就
          </TabButton>
          <TabButton active={tab === 'codex'} onClick={() => setTab('codex')} icon={<BookOpen className="w-3.5 h-3.5" />}>
            图鉴
          </TabButton>
          <TabButton active={tab === 'runes'} onClick={() => setTab('runes')} icon={<Gem className="w-3.5 h-3.5" />}>
            符文
          </TabButton>
          <TabButton active={tab === 'talents'} onClick={() => setTab('talents')} icon={<Star className="w-3.5 h-3.5" />}>
            天赋
          </TabButton>
          <TabButton active={tab === 'help'} onClick={() => setTab('help')} icon={<HelpCircle className="w-3.5 h-3.5" />}>
            玩法
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
        <h1 className="font-display font-black text-7xl leading-none">
          <span className="bg-gradient-to-r from-neon-gold via-amber-300 to-neon-gold bg-clip-text text-transparent text-glow-gold">
            星核熔炉
          </span>
        </h1>
        <div className="font-display text-2xl text-neon-cyan/80 tracking-[0.3em] mt-1">STELLAR FORGE</div>
      </motion.div>

      {/* 副标题 */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-gray-400 text-base font-body max-w-md mb-8"
      >
        防守核心，坚持 20 波。投放并融合元素星核，在最终首领抵达核心前击败它。
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
            <span className="text-xs text-gray-400 font-body">最高波次</span>
            <span className="font-display text-neon-gold">{meta.bestWave}</span>
          </div>
          <div className="w-px h-4 bg-gray-700" />
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-gray-400 font-body">最高分</span>
            <span className="font-display text-neon-cyan">{meta.bestScore}</span>
          </div>
          <div className="w-px h-4 bg-gray-700" />
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-gray-400 font-body">总击杀</span>
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
          开始游戏
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
        日常挑战
        <span className="text-[10px] text-gray-400 font-body">每日独特规则</span>
      </motion.button>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-xs text-gray-500 font-body"
      >
        点击列投放星核 · 相同等级自动融合
      </motion.p>

      {/* 元素预览 */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1 }}
        className="flex gap-3 mt-10"
      >
        {[
          { sym: '🔥', name: '炎核', col: '#FF6B6B' },
          { sym: '💧', name: '水核', col: '#4ECDC4' },
          { sym: '🪨', name: '岩核', col: '#C9A26B' },
          { sym: '🌀', name: '风核', col: '#95E1D3' },
          { sym: '⚡', name: '雷核', col: '#FFE66D' },
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
      <h2 className="font-display text-2xl text-neon-gold text-glow-gold mb-1">永久升级</h2>
      <p className="text-gray-400 text-sm font-body mb-6">使用星尘解锁永久强化，效果在所有局中生效</p>

      <div className="grid grid-cols-2 gap-3">
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
                      <Check className="w-3 h-3" /> 已解锁
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
        <h2 className="font-display text-2xl text-neon-gold text-glow-gold">成就</h2>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-void-900/60 border border-neon-gold/30">
          <Award className="w-3.5 h-3.5 text-neon-gold" />
          <span className="font-display text-neon-gold text-sm">{unlockedCount} / {totalCount}</span>
        </div>
      </div>
      <p className="text-gray-400 text-sm font-body mb-3">完成挑战解锁成就，部分成就奖励永久星尘</p>

      {/* 总进度条 */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-body text-gray-400 uppercase tracking-wider">总进度</span>
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
          label="全部"
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
                      <span className="text-[10px] text-gray-500">无奖励</span>
                    )}
                    {isUnlocked ? (
                      <span className="flex items-center gap-1 text-[10px] text-neon-gold font-display">
                        <Check className="w-3 h-3" /> 已解锁
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
      title: '目标',
      text: '在 6×7 网格投放星核，融合升级，抵御一波波虚空敌人，存活越久越好。',
    },
    {
      icon: '🔄',
      title: '融合',
      text: '相邻相同元素、相同等级的星核自动融合升级。等级越高伤害越高，3 级触发进化分支。',
    },
    {
      icon: '⚡',
      title: '进化',
      text: '星核达到 3 级时选择进化分支，例如炎核可进化为溅射的"地狱火"或可复活的"不死凤凰"。',
    },
    {
      icon: '🔗',
      title: '共鸣',
      text: '相邻不同元素星核触发共鸣：火+水=蒸汽光环，风+雷=雷暴连锁，6 种组合等你发现。',
    },
    {
      icon: '🧩',
      title: '羁绊',
      text: '场上同元素星核达到 2/4 颗即激活羁绊：焚天加攻速、凝霜强减速、厚土增伤害、疾风加射程、雷云加暴击；3/5 种元素在场触发多元全场伤害加成。',
    },
    {
      icon: '⭐',
      title: '天赋',
      text: '每局结算按波次获得天赋点（每 3 波 +1 点），用于解锁三大流派永久天赋：焚天之道强化输出、凝霜之道强化控制、厚土之道强化防御，跨局永久生效。',
    },
    {
      icon: '🎮',
      title: 'Roguelike',
      text: '每波结束进入商店购买星核/遗物，并从 3 个随机遗物中选一，每局体验独一无二。',
    },
    {
      icon: '💝',
      title: '剧情博弈',
      text: '随波次推进触发星核少女剧情和虚空怪兽契约，少女路线获永久祝福，怪兽路线即时强力但有代价。',
    },
    {
      icon: '⭐',
      title: '元进度',
      text: '死亡后获得星尘，用于永久解锁新元素、生命值、刷新次数，让你下次走得更远。',
    },
  ];
  return (
    <div className="w-full max-w-3xl px-6 overflow-y-auto h-full pb-20">
      <h2 className="font-display text-2xl text-neon-gold text-glow-gold mb-1">玩法说明</h2>
      <p className="text-gray-400 text-sm font-body mb-6">七张卡片速成，立即上手</p>

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
        <h3 className="font-display text-neon-cyan text-sm mb-2">操作</h3>
        <div className="text-xs text-gray-300 font-body space-y-1">
          <div>• <span className="text-neon-gold">点击/触摸</span> 网格列 → 投放当前星核</div>
          <div>• 按键盘 <span className="text-neon-gold font-mono">1</span> ~ <span className="text-neon-gold font-mono">6</span> → 快速在对应列投放</div>
          <div>• <span className="text-neon-gold">点击元素图标</span> → 切换下一个投放元素</div>
          <div>• 波次清空后自动进入 <span className="text-neon-gold">商店</span></div>
          <div>• 商店"继续"按钮 → <span className="text-neon-gold">遗物三选一</span> → 下一波</div>
        </div>
      </div>

      <div className="mt-3 p-4 rounded-lg border border-neon-purple/30 bg-neon-purple/5">
        <h3 className="font-display text-neon-purple text-sm mb-2">敌人弱点</h3>
        <div className="text-xs text-gray-300 font-body space-y-1">
          <div>• <span className="text-neon-purple">飞行单位</span> 只能被风/雷击中</div>
          <div>• <span className="text-neon-purple">装甲单位</span> 减伤 50%，需要高伤害</div>
          <div>• <span className="text-neon-purple">裂隙者</span> 定期瞬移，需要速战速决</div>
          <div>• <span className="text-neon-purple">腐化星核</span> 死亡会分裂成虫群</div>
        </div>
      </div>
    </div>
  );
}
