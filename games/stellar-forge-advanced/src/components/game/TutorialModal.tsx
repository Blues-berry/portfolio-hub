import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, MousePointerClick, Combine, Zap, Swords, Sparkles, Heart } from 'lucide-react';

const STORAGE_KEY = 'stellar-forge-advanced-tutorial-seen';

type TabId = 'basics' | 'merge' | 'synergy' | 'combat' | 'story';

interface Tab {
  id: TabId;
  title: string;
  icon: React.ReactNode;
  color: string;
}

const TABS: Tab[] = [
  { id: 'basics', title: '基础操作', icon: <MousePointerClick className="w-4 h-4" />, color: '#FFD166' },
  { id: 'merge', title: '融合升级', icon: <Combine className="w-4 h-4" />, color: '#4ECDC4' },
  { id: 'synergy', title: '共鸣组合', icon: <Zap className="w-4 h-4" />, color: '#9B59B6' },
  { id: 'combat', title: '战斗系统', icon: <Swords className="w-4 h-4" />, color: '#FF6B6B' },
  { id: 'story', title: '剧情博弈', icon: <Sparkles className="w-4 h-4" />, color: '#E94560' },
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
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700/50">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-neon-gold" />
                <h2 className="font-display text-xl text-neon-gold">玩法指南</h2>
                <span className="text-xs text-gray-500 font-body">STELLAR FORGE GUIDE</span>
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
            <div className="px-6 py-5 overflow-y-auto" style={{ maxHeight: '60vh' }}>
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
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-700/50">
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
                    上一页
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
                  {currentIdx === TABS.length - 1 ? '开始冒险' : '下一页'}
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
      <p className="sf-boss-warning">目标：守住核心并击败第 20 波首领。使用拆除可消耗 1 点部署能量，移除指定列最上方的星核。每次投放消耗 1 点部署能量，2 秒恢复 1 点，最多 6 点。星核自动攻击，相邻同元素星核可融合。</p>
      <SectionTitle icon={<MousePointerClick className="w-4 h-4" />} color="#FFD166" title="投放星核" />
      <ul className="space-y-2 pl-1">
        <li className="flex gap-2">
          <span className="text-neon-gold">▸</span>
          <span><b className="text-neon-gold">点击</b>网格中任意列，在最低空位投放当前元素星核</span>
        </li>
        <li className="flex gap-2">
          <span className="text-neon-gold">▸</span>
          <span>按键盘 <kbd className="px-1.5 py-0.5 rounded bg-void-700 text-neon-gold font-mono text-xs">1</kbd> ~ <kbd className="px-1.5 py-0.5 rounded bg-void-700 text-neon-gold font-mono text-xs">6</kbd> 在对应列快速投放</span>
        </li>
        <li className="flex gap-2">
          <span className="text-neon-gold">▸</span>
          <span>HUD 顶部显示 <b className="text-neon-cyan">NEXT</b> 下一个星核的元素，投放后会自动切换</span>
        </li>
      </ul>

      <SectionTitle icon={<Sparkles className="w-4 h-4" />} color="#4ECDC4" title="5 大元素" />
      <div className="grid grid-cols-5 gap-2">
        {[
          { sym: '🔥', name: '火', color: '#FF6B6B', desc: '高伤害' },
          { sym: '💧', name: '水', color: '#4ECDC4', desc: '减速' },
          { sym: '🪨', name: '土', color: '#C9A26B', desc: '范围' },
          { sym: '🌀', name: '风', color: '#95E1D3', desc: '快攻' },
          { sym: '⚡', name: '雷', color: '#FFE66D', desc: '暴击' },
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
          💡 <b>提示</b>：第 3、5、7、10 波分别解锁水、土、风、雷；点击顶部元素按钮切换当前投放的元素。
        </p>
      </div>
    </div>
  );
}

// ============= 融合升级 =============
function MergeTab() {
  return (
    <div className="space-y-4 text-sm text-gray-200 font-body">
      <SectionTitle icon={<Combine className="w-4 h-4" />} color="#4ECDC4" title="自动融合机制" />
      <p className="text-gray-300 leading-relaxed">
        当<b className="text-neon-cyan">同元素、同等级</b>的星核相邻（上下/左右），会自动融合为<b className="text-neon-cyan">高一阶</b>的星核，伤害与射程大幅提升。
      </p>

      <div className="flex items-center justify-center gap-2 py-3">
        <MergeNode sym="🔥" color="#FF6B6B" label="Lv.1" />
        <span className="text-neon-gold text-xl">+</span>
        <MergeNode sym="🔥" color="#FF6B6B" label="Lv.1" />
        <ChevronRight className="w-4 h-4 text-gray-500" />
        <MergeNode sym="🔥" color="#FF8E53" label="Lv.2" bigger />
      </div>

      <SectionTitle icon={<Sparkles className="w-4 h-4" />} color="#FFD166" title="等级与进化" />
      <ul className="space-y-1.5 pl-1">
        <li><span className="text-neon-gold">Lv.1 → 3：</span>每融合一次升一阶，伤害/射程递增</li>
        <li><span className="text-neon-gold">Lv.3 觉醒：</span>融合到 3 级时触发<b className="text-neon-gold">星核觉醒</b>，可选择两种进化分支</li>
        <li><span className="text-neon-gold">进化后：</span>获得专属能力（如范围溅射、连锁闪电、暴击增益等）</li>
      </ul>

      <div className="p-3 rounded bg-elem-water/10 border border-elem-water/30">
        <p className="text-xs text-elem-water font-body">
          💡 <b>策略</b>：优先将主战元素升到 Lv.3 触发进化，比堆砌多个低级星核更有效
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
    { pair: '🔥 + 💧', name: '蒸汽共鸣', color: '#BFE5E5', desc: '范围减速 + 灼烧' },
    { pair: '🔥 + 🌀', name: '烈焰风暴', color: '#FFB347', desc: '攻速 + 伤害双提升' },
    { pair: '💧 + ⚡', name: '电磁脉冲', color: '#7FE5DD', desc: '连锁闪电 + 减速' },
    { pair: '🪨 + 🔥', name: '岩浆喷发', color: '#FF6B6B', desc: '爆炸溅射' },
    { pair: '🪨 + 💧', name: '冰封大地', color: '#9FE5DD', desc: '冻结 + 装甲穿透' },
    { pair: '🌀 + ⚡', name: '风暴之怒', color: '#FFE66D', desc: '暴击 + 连锁' },
  ];
  return (
    <div className="space-y-4 text-sm text-gray-200 font-body">
      <SectionTitle icon={<Zap className="w-4 h-4" />} color="#9B59B6" title="共鸣系统" />
      <p className="text-gray-300 leading-relaxed">
        当<b className="text-neon-purple">不同元素</b>的星核在网格中<b className="text-neon-purple">相邻</b>时，会自动触发共鸣，连线之间产生光环效果，并叠加增益。
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
          💡 <b>策略</b>：网格中可同时存在多组共鸣，尝试构建"共鸣阵"让增益最大化
        </p>
      </div>
    </div>
  );
}

// ============= 战斗系统 =============
function CombatTab() {
  return (
    <div className="space-y-4 text-sm text-gray-200 font-body">
      <SectionTitle icon={<Swords className="w-4 h-4" />} color="#FF6B6B" title="战斗循环" />
      <div className="space-y-2">
        <Step n={1} text="敌人从轨道顶部出现，向下推进" color="#FF6B6B" />
        <Step n={2} text="网格中的星核自动攻击射程内的敌人" color="#FFD166" />
        <Step n={3} text="击败敌人获得星尘（ 💎 ）" color="#FFD166" />
        <Step n={4} text="敌人到达底部撞击 CORE，扣除 HP" color="#FF6B6B" />
        <Step n={5} text="清空所有敌人 → 进入星核商店" color="#4ECDC4" />
        <Step n={6} text="选择三选一遗物 → 进入下一波" color="#9B59B6" />
      </div>
      <p className="sf-boss-warning">每次投放消耗 1 点部署能量，每 2 秒恢复 1 点（最多 6 点）。首领突破防线会立即结束本局；击败第 20 波首领即可获胜。</p>

      <SectionTitle icon={<Heart className="w-4 h-4" />} color="#E74C3C" title="敌人类型" />
      <div className="grid grid-cols-2 gap-2 text-xs">
        <EnemyCard color="#9B59B6" name="杂兵" desc="普通推进" />
        <EnemyCard color="#E74C3C" name="刺客" desc="高速冲锋" />
        <EnemyCard color="#34495E" name="守卫" desc="装甲减伤" />
        <EnemyCard color="#16A085" name="飞行" desc="只能被风/雷击中" />
        <EnemyCard color="#27AE60" name="祭司" desc="范围治疗友军" />
        <EnemyCard color="#9B59B6" name="裂隙者" desc="定期瞬移前进" />
        <EnemyCard color="#7F1A1A" name="腐化星核" desc="死亡分裂" />
        <EnemyCard color="#C0392B" name="收割者" desc="低血极速冲撞" />
      </div>

      <SectionTitle icon={<Zap className="w-4 h-4" />} color="#FFD166" title="主动技能（NEW）" />
      <p className="text-gray-300 leading-relaxed">
        击杀敌人积累 <b className="text-neon-cyan">能量</b>（上限 100），可释放 3 种主动技能扭转战局：
      </p>
      <div className="grid grid-cols-3 gap-2">
        <SkillCard sym="☄️" name="陨石爆破" hotkey="Q" cost={40} color="#FF6B6B" desc="全屏伤害" />
        <SkillCard sym="❄️" name="时空冻结" hotkey="W" cost={60} color="#4ECDC4" desc="冰冻 4 秒" />
        <SkillCard sym="⚡" name="元素风暴" hotkey="E" cost={80} color="#FFD166" desc="连锁爆破" />
      </div>
      <div className="p-3 rounded bg-neon-gold/10 border border-neon-gold/30">
        <p className="text-xs text-neon-gold font-body">
          💡 <b>提示</b>：Boss 击杀 +25 能量，是释放大招的关键节奏点。能量满时按钮会闪烁提示
        </p>
      </div>

      <div className="p-3 rounded bg-elem-fire/10 border border-elem-fire/30">
        <p className="text-xs text-elem-fire font-body">
          ⚠ <b>注意</b>：飞行单位只能被<b>风</b>或<b>雷</b>元素击中，需要保留对应星核
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
      <div className="text-[10px] text-gray-400">{cost} 能量</div>
      <div className="text-[10px] text-gray-300">{desc}</div>
    </div>
  );
}

// ============= 剧情博弈 =============
function StoryTab() {
  return (
    <div className="space-y-4 text-sm text-gray-200 font-body">
      <SectionTitle icon={<Sparkles className="w-4 h-4" />} color="#E94560" title="场景随波次切换" />
      <div className="space-y-1.5">
        <SceneRow wave="1-4" name="虚空之门" color="#9B59B6" desc="紫黑色调 · 起点" />
        <SceneRow wave="5-9" name="燃烧星海" color="#FF8E53" desc="赤红熔岩 · 渊噬者登场" />
        <SceneRow wave="10-14" name="晶莹圣殿" color="#7FE5DD" desc="冰晶圣殿 · 虚空织者登场" />
        <SceneRow wave="15+" name="终焉深渊" color="#C0392B" desc="宇宙终末 · 终焉之眼登场" />
      </div>

      <SectionTitle icon={<Heart className="w-4 h-4" />} color="#FF6B6B" title="星核少女系统" />
      <ul className="space-y-1.5 pl-1">
        <li className="flex gap-2"><span className="text-elem-fire">❤</span><span>特定波次会触发少女登场对话（焰/涟/岩/风/雷）</span></li>
        <li className="flex gap-2"><span className="text-elem-fire">🎁</span><span>用 <b className="text-neon-gold">20 星尘</b> 送礼物可提升 15 好感度</span></li>
        <li className="flex gap-2"><span className="text-elem-fire">✨</span><span>契约波次缔结契约，好感度 +20 并激活对应祝福</span></li>
        <li className="flex gap-2"><span className="text-elem-fire">⭐</span><span>好感度阈值 <b>30/60/100</b> 解锁永久遗物（伤害/攻速/暴击/护盾）</span></li>
      </ul>

      <SectionTitle icon={<Swords className="w-4 h-4" />} color="#7F1A1A" title="怪兽黑暗契约" />
      <ul className="space-y-1.5 pl-1">
        <li className="flex gap-2"><span className="text-elem-fire">⚔</span><span>Boss 波（5/10/15/20）登场前会触发怪兽剧情</span></li>
        <li className="flex gap-2"><span className="text-elem-fire">💀</span><span>击败怪兽后可选择<b>接受</b>或<b>拒绝</b>契约</span></li>
        <li className="flex gap-2"><span className="text-elem-fire">📑</span><span>接受：获得强力遗物，但付出代价（HP/星尘）并累积堕落值</span></li>
        <li className="flex gap-2"><span className="text-elem-fire">🚫</span><span>拒绝：无代价也无奖励，直接进入下一波</span></li>
      </ul>

      <div className="p-3 rounded bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/40">
        <p className="text-xs text-pink-300 font-body">
          💗 <b>核心博弈</b>：少女路线 = 永久祝福（安全但慢热）；怪兽路线 = 即时强力（但有代价和堕落风险）
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
