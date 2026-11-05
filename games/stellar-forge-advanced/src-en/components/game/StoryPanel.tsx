import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import { MAIDENS, MONSTERS, MaidenConfig, MonsterConfig } from '@/data/story';
import { SCENES } from '@/data/scenes';
import { Heart, Gift, Sparkles, Skull, X, FastForward } from 'lucide-react';
import type { StoryEvent } from '@/types/game';

// 跳过按钮组件（仅在非选择类剧情中显示）
function SkipButton({ onClick, label = 'Skip' }: { onClick: () => void; label?: string }) {
  return (
    <button
      onClick={onClick}
      className="absolute top-4 right-4 z-50 flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-body text-gray-400 bg-void-900/70 border border-gray-700 hover:text-neon-gold hover:border-neon-gold/50 transition-all pointer-auto"
      title="Skip this scene"
    >
      <FastForward className="w-3 h-3" />
      {label}
    </button>
  );
}

// 角色立绘区域（用 emoji + 渐变模拟，无真实美术资源）
function PortraitMaiden({ maiden, mood }: { maiden: MaidenConfig; mood: 'intro' | 'greet' | 'gift' | 'pact' }) {
  return (
    <div className="relative w-44 h-56 flex items-center justify-center">
      {/* 外发光 */}
      <div
        className="absolute inset-0 rounded-full blur-2xl opacity-60"
        style={{ background: `radial-gradient(circle, ${maiden.color}, transparent 70%)` }}
      />
      {/* 主体圆形立绘 */}
      <motion.div
        animate={{
          y: [0, -8, 0],
          scale: mood === 'pact' ? [1, 1.05, 1] : 1,
        }}
        transition={{
          y: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
          scale: mood === 'pact' ? { duration: 1.5, repeat: Infinity } : {},
        }}
        className="relative w-40 h-52 rounded-3xl flex flex-col items-center justify-center"
        style={{
          background: `linear-gradient(180deg, ${maiden.color}44 0%, ${maiden.portrait.outfitColor}99 50%, ${maiden.color}22 100%)`,
          border: `2px solid ${maiden.accent}`,
          boxShadow: `0 0 40px ${maiden.color}66, inset 0 0 30px ${maiden.color}33`,
        }}
      >
        {/* 头发区域 */}
        <div
          className="w-20 h-20 rounded-full mb-2 flex items-center justify-center"
          style={{
            background: `radial-gradient(circle, ${maiden.portrait.hairColor}, ${maiden.color})`,
            boxShadow: `0 0 20px ${maiden.color}`,
          }}
        >
          <span className="text-5xl">{maiden.emoji}</span>
        </div>
        {/* 眼睛 */}
        <div className="flex gap-2 mb-1">
          <div
            className="w-2 h-3 rounded-full"
            style={{ background: maiden.portrait.eyeColor, boxShadow: `0 0 6px ${maiden.portrait.eyeColor}` }}
          />
          <div
            className="w-2 h-3 rounded-full"
            style={{ background: maiden.portrait.eyeColor, boxShadow: `0 0 6px ${maiden.portrait.eyeColor}` }}
          />
        </div>
        {/* 名字 */}
        <div className="font-display text-xl" style={{ color: maiden.accent }}>
          {maiden.name}
        </div>
        <div className="text-[10px] text-gray-300 font-body">{maiden.title}</div>
      </motion.div>
    </div>
  );
}

function PortraitMonster({ monster }: { monster: MonsterConfig }) {
  return (
    <div className="relative w-56 h-64 flex items-center justify-center">
      <div
        className="absolute inset-0 rounded-full blur-3xl opacity-80"
        style={{ background: `radial-gradient(circle, ${monster.color}, #000 70%)` }}
      />
      <motion.div
        animate={{
          rotate: [0, 3, -3, 0],
          scale: [1, 1.08, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="relative w-52 h-60 rounded-3xl flex flex-col items-center justify-center"
        style={{
          background: `radial-gradient(circle, ${monster.color}99, #000 70%)`,
          border: `3px solid ${monster.accent}`,
          boxShadow: `0 0 60px ${monster.color}, inset 0 0 40px #000`,
        }}
      >
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-7xl mb-3"
          style={{ filter: `drop-shadow(0 0 20px ${monster.color})` }}
        >
          {monster.emoji}
        </motion.div>
        <div className="font-display text-2xl text-white" style={{ textShadow: `0 0 15px ${monster.color}` }}>
          {monster.name}
        </div>
        <div className="text-[11px] text-gray-300 font-body mt-1">{monster.title}</div>
      </motion.div>
    </div>
  );
}

export default function StoryPanel() {
  const status = useGameStore(s => s.status);
  const pendingStory = useGameStore(s => s.pendingStory);
  const advanceStory = useGameStore(s => s.advanceStory);
  const giftMaiden = useGameStore(s => s.giftMaiden);
  const acceptMonsterPact = useGameStore(s => s.acceptMonsterPact);
  const rejectMonsterPact = useGameStore(s => s.rejectMonsterPact);
  const maidenAffinity = useGameStore(s => s.maidenAffinity);
  const stardust = useGameStore(s => s.stardust);

  const [lineIndex, setLineIndex] = useState(0);
  const [, setShowPactConfirm] = useState(false);

  // 切换剧情时重置 line index
  useEffect(() => {
    setLineIndex(0);
    setShowPactConfirm(false);
  }, [pendingStory]);

  if (!pendingStory) return null;

  // ============= 场景切换 =============
  if (status === 'scene-change') {
    const scene = SCENES.find(s => s.id === (pendingStory as Extract<StoryEvent, { kind: 'scene-change' }>).toScene);
    if (!scene) return null;
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-50 flex flex-col items-center justify-center pointer-auto"
          style={{ background: `radial-gradient(circle, ${scene.bgGradient[0]}, ${scene.bgGradient[1]}, ${scene.bgGradient[2]})` }}
        >
          <SkipButton onClick={advanceStory} label="Skip scene" />
          <motion.div
            initial={{ scale: 0.5, opacity: 0, rotateX: -90 }}
            animate={{ scale: 1, opacity: 1, rotateX: 0 }}
            transition={{ type: 'spring', damping: 15, delay: 0.2 }}
            className="text-center"
          >
            <div className="text-xs tracking-[0.5em] text-gray-400 font-display mb-3">
              {scene.subtitle}
            </div>
            <motion.h2
              animate={{ textShadow: [`0 0 20px ${scene.accentColor}`, `0 0 40px ${scene.accentColor}`, `0 0 20px ${scene.accentColor}`] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="font-display text-6xl mb-4"
              style={{ color: scene.accentColor }}
            >
              {scene.name}
            </motion.h2>
            <p className="text-gray-300 text-base font-body max-w-md mx-auto px-6">
              {scene.description}
            </p>
          </motion.div>
          <motion.button
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            onClick={advanceStory}
            className="mt-10 px-8 py-3 rounded clip-corner font-display text-sm"
            style={{
              background: `linear-gradient(90deg, ${scene.accentColor}, ${scene.coreColor})`,
              color: '#0B0518',
              boxShadow: `0 0 30px ${scene.accentColor}88`,
            }}
          >
            Enter Battlefield →
          </motion.button>
        </motion.div>
      </AnimatePresence>
    );
  }

  // ============= 少女登场 / 契约选择 =============
  if (status === 'maiden-visit' || status === 'maiden-pact') {
    const story = pendingStory as Extract<StoryEvent, { maidenId: string }>;
    const maiden = MAIDENS[story.maidenId as keyof typeof MAIDENS];
    if (!maiden) return null;

    const aff = maidenAffinity[maiden.id] || 0;
    const isFirstTime = story.kind === 'maiden-visit' && story.isFirstTime;
    const isPact = status === 'maiden-pact';
    const lines = isFirstTime ? maiden.introLines : maiden.greetLines;
    const currentLine = lines[lineIndex] || (isPact ? maiden.pactLines[lineIndex - lines.length] : '');
    const allLinesDone = isPact
      ? lineIndex >= lines.length + maiden.pactLines.length
      : lineIndex >= lines.length;

    const boon = maiden.boons.find(b => aff >= b.threshold && !useGameStore.getState().ownedRelics.some(r => r.id === `${maiden.id}-boon-${b.threshold}`));
    const nextBoon = maiden.boons.find(b => aff < b.threshold);

    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-50 flex flex-col items-center justify-center pointer-auto"
          style={{
            background: `radial-gradient(circle at center, ${maiden.color}22, rgba(11,11,31,0.96) 70%)`,
          }}
        >
          {/* 跳过按钮（仅 maiden-visit 状态可跳过，pact 需要选择） */}
          {!isPact && <SkipButton onClick={advanceStory} label="Skip Conversation" />}
          {/* 立绘 */}
          <PortraitMaiden maiden={maiden} mood={isPact ? 'pact' : isFirstTime ? 'intro' : 'greet'} />

          {/* 好感度条 */}
          <div className="mt-4 flex items-center gap-3">
            <Heart className="w-4 h-4" style={{ color: maiden.accent }} fill={maiden.accent} />
            <div className="w-40 h-2 bg-void-900 rounded-full overflow-hidden">
              <motion.div
                animate={{ width: `${aff}%` }}
                className="h-full rounded-full"
                style={{ background: `linear-gradient(90deg, ${maiden.color}, ${maiden.accent})` }}
              />
            </div>
            <span className="text-xs font-display" style={{ color: maiden.accent }}>{aff}/100</span>
          </div>

          {/* 对话框 */}
          <motion.div
            key={lineIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 max-w-xl mx-6 px-8 py-5 rounded-lg backdrop-blur-md"
            style={{
              background: `linear-gradient(180deg, ${maiden.color}22, rgba(11,11,31,0.95))`,
              border: `1px solid ${maiden.accent}66`,
              boxShadow: `0 0 30px ${maiden.color}33`,
            }}
          >
            <div className="font-display text-lg mb-1" style={{ color: maiden.accent }}>
              {maiden.name}
              <span className="text-xs text-gray-400 ml-2">· {maiden.title}</span>
            </div>
            <p className="text-gray-100 font-body text-base leading-relaxed min-h-[3rem]">
              {currentLine || '...'}
            </p>
          </motion.div>

          {/* 按钮 */}
          <div className="mt-6 flex gap-3">
            {!allLinesDone ? (
              <button
                onClick={() => setLineIndex(i => i + 1)}
                className="px-6 py-2.5 rounded clip-corner font-display text-sm"
                style={{
                  background: maiden.color,
                  color: '#0B0518',
                  boxShadow: `0 0 20px ${maiden.color}66`,
                }}
              >
                Continue ▸
              </button>
            ) : (
              <>
                <button
                  onClick={advanceStory}
                  className="px-6 py-2.5 rounded clip-corner font-display text-sm"
                  style={{
                    background: maiden.accent,
                    color: '#0B0518',
                    boxShadow: `0 0 20px ${maiden.accent}88`,
                  }}
                >
                  {isPact ? 'Seal the Pact ✨' : 'Continue ▸'}
                </button>
                {!isPact && (
                  <button
                    onClick={() => giftMaiden(maiden.id)}
                    disabled={stardust < 20}
                    className="px-4 py-2.5 rounded clip-corner font-display text-sm bg-void-700 text-neon-gold border border-neon-gold/50 hover:bg-void-600 disabled:opacity-30 transition-all flex items-center gap-1.5"
                  >
                    <Gift className="w-4 h-4" />
                    Give Gift (20 ✨)
                  </button>
                )}
              </>
            )}
          </div>

          {/* boon 提示 */}
          {isPact && boon && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 px-4 py-2 rounded text-xs font-body"
              style={{ background: `${maiden.color}22`, border: `1px solid ${maiden.accent}` }}
            >
              <Sparkles className="w-3 h-3 inline mr-1" style={{ color: maiden.accent }} />
              Blessing unlocked: <span style={{ color: maiden.accent }}>{boon.name}</span> · {boon.description}
            </motion.div>
          )}
          {isPact && nextBoon && (
            <div className="mt-2 text-xs text-gray-500 font-body">
              Reach {nextBoon.threshold} affection to unlock “{nextBoon.name}.”
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    );
  }

  // ============= 怪兽登场 =============
  if (status === 'monster-intro') {
    const story = pendingStory as Extract<StoryEvent, { kind: 'monster-intro' }>;
    const monster = MONSTERS.find(m => m.id === story.monsterId);
    if (!monster) return null;

    const lines = monster.introLines;
    const currentLine = lines[lineIndex];

    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-50 flex flex-col items-center justify-center pointer-auto"
          style={{
            background: `radial-gradient(circle at center, ${monster.color}44, #000 80%)`,
          }}
        >
          <SkipButton onClick={advanceStory} label="Skip Scene" />
          <PortraitMonster monster={monster} />

          {/* 怪兽描述 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4 text-xs text-gray-400 font-body italic max-w-md text-center px-6"
          >
            {monster.form}
          </motion.div>

          {/* 对话框 */}
          <motion.div
            key={lineIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 max-w-xl mx-6 px-8 py-5 rounded-lg"
            style={{
              background: `linear-gradient(180deg, ${monster.color}33, #000 90%)`,
              border: `2px solid ${monster.accent}`,
              boxShadow: `0 0 40px ${monster.color}66`,
            }}
          >
            <div className="font-display text-xl mb-1" style={{ color: monster.accent, textShadow: `0 0 10px ${monster.color}` }}>
              {monster.name}
            </div>
            <p className="text-gray-100 font-body text-base leading-relaxed min-h-[3rem]">
              {currentLine || '...'}
            </p>
          </motion.div>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            onClick={() => {
              if (lineIndex >= lines.length - 1) {
                advanceStory();
              } else {
                setLineIndex(i => i + 1);
              }
            }}
            className="mt-6 px-8 py-3 rounded clip-corner font-display text-sm"
            style={{
              background: `linear-gradient(90deg, ${monster.color}, ${monster.accent})`,
              color: '#fff',
              boxShadow: `0 0 30px ${monster.color}88`,
            }}
          >
            {lineIndex >= lines.length - 1 ? '⚔ Face the Boss' : 'Continue ▸'}
          </motion.button>
        </motion.div>
      </AnimatePresence>
    );
  }

  // ============= 怪兽被击败 =============
  if (status === 'monster-defeated') {
    const story = pendingStory as Extract<StoryEvent, { kind: 'monster-defeated' }>;
    const monster = MONSTERS.find(m => m.id === story.monsterId);
    if (!monster) return null;

    const lines = monster.defeatLines;
    const currentLine = lines[lineIndex];
    const allDone = lineIndex >= lines.length;

    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-50 flex flex-col items-center justify-center pointer-auto"
          style={{
            background: `radial-gradient(circle at center, ${monster.color}22, #000 80%)`,
          }}
        >
          {/* 怪兽立绘（破碎效果） */}
          <motion.div
            animate={{ rotate: [0, -5, 5, 0], opacity: [1, 0.6, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <PortraitMonster monster={monster} />
          </motion.div>

          <div className="mt-6 font-display text-2xl text-neon-gold text-glow-gold">
            ▼ Boss Defeated ▼
          </div>

          {/* 对话框 */}
          <motion.div
            key={lineIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 max-w-xl mx-6 px-8 py-5 rounded-lg"
            style={{
              background: `linear-gradient(180deg, ${monster.color}33, #000 90%)`,
              border: `2px solid ${monster.accent}`,
            }}
          >
            <p className="text-gray-100 font-body text-base leading-relaxed min-h-[3rem]">
              {currentLine || '...'}
            </p>
          </motion.div>

          {!allDone ? (
            <button
              onClick={() => setLineIndex(i => i + 1)}
              className="mt-6 px-8 py-3 rounded clip-corner font-display text-sm bg-void-700 text-gray-300 border border-gray-600"
            >
              Continue ▸
            </button>
          ) : (
            <div className="mt-6 flex flex-col gap-3 items-center">
              <div className="text-sm text-gray-400 font-body">Do you accept the monster's contract?</div>
              <div className="flex gap-4">
                <button
                  onClick={acceptMonsterPact}
                  className="px-6 py-3 rounded clip-corner font-display text-sm flex items-center gap-2"
                  style={{
                    background: `linear-gradient(90deg, ${monster.color}, ${monster.accent})`,
                    color: '#fff',
                    boxShadow: `0 0 30px ${monster.color}88`,
                  }}
                >
                  <Skull className="w-4 h-4" />
                  Accept Contract (+{monster.pact.corruption} Corruption)
                </button>
                <button
                  onClick={rejectMonsterPact}
                  className="px-6 py-3 rounded clip-corner font-display text-sm bg-void-700 text-gray-300 border border-gray-600 hover:bg-void-600"
                >
                  <X className="w-4 h-4 inline mr-1" />
                  Deny
                </button>
              </div>
              <div className="mt-2 max-w-md text-center text-xs text-gray-400 font-body px-6">
                {monster.pact.description}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    );
  }

  return null;
}
