import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { getTodayChallenge, DailyChallenge } from '@/data/dailyChallenge';
import { useMetaStore } from '@/store/metaStore';
import { useNavigate } from 'react-router-dom';
import { Calendar, X, Zap, Heart, Sparkles, Play, Trophy, Flame } from 'lucide-react';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function DailyChallengeDialog({ open, onClose }: Props) {
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState<DailyChallenge | null>(null);
  const dailyBest = useMetaStore(s => challenge ? s.dailyHistory[challenge.date] : undefined);
  const startDailyChallenge = useGameStoreStartDaily();

  useEffect(() => {
    if (open) {
      setChallenge(getTodayChallenge());
    }
  }, [open]);

  const handleStart = () => {
    startDailyChallenge();
    navigate('/game');
    onClose();
  };

  return (
    <AnimatePresence>
      {open && challenge && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-void-900/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.85, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ type: 'spring', damping: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-md w-full mx-4 rounded-xl clip-corner overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(26,26,58,0.98), rgba(11,5,24,0.98))',
              border: '2px solid #FFD166',
              boxShadow: '0 0 40px rgba(255,209,102,0.4), 0 8px 32px rgba(0,0,0,0.6)',
            }}
          >
            {/* 关闭按钮 */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-void-900/60 text-gray-400 hover:text-white hover:bg-void-700/60 transition-all"
            >
              <X className="w-4 h-4" />
            </button>

            {/* 标题区 */}
            <div
              className="relative px-6 py-5 overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(255,209,102,0.15), rgba(255,107,107,0.1))',
                borderBottom: '1px solid rgba(255,209,102,0.3)',
              }}
            >
              {/* 背景装饰 */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                className="absolute -top-12 -right-12 w-32 h-32 rounded-full"
                style={{ background: 'radial-gradient(circle, rgba(255,209,102,0.15), transparent)' }}
              />
              <div className="relative flex items-center gap-2 mb-1">
                <Calendar className="w-4 h-4 text-neon-gold" />
                <span className="text-xs font-display text-neon-gold tracking-widest uppercase">
                  Daily Challenge
                </span>
              </div>
              <h2 className="font-display text-2xl text-neon-gold text-glow-gold mb-1">
                Daily Challenge
              </h2>
              <p className="text-xs text-gray-400 font-body">
                {challenge.date} · The same rules for the whole server · Daily refresh
              </p>
            </div>

            {/* 修饰符卡片 */}
            <div className="px-6 py-4">
              <div className="flex items-center gap-1.5 mb-2">
                <Zap className="w-3 h-3 text-neon-cyan" />
                <span className="text-[10px] font-display text-neon-cyan tracking-widest uppercase">
                  Modifier ({challenge.modifiers.length}）
                </span>
              </div>
              <div className="grid grid-cols-1 gap-2 mb-4">
                {challenge.modifiers.map((mod, i) => (
                  <motion.div
                    key={mod.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.1 }}
                    className="flex items-start gap-2.5 p-3 rounded-lg border"
                    style={{
                      background: mod.color + '11',
                      borderColor: mod.color + '44',
                    }}
                  >
                    <div
                      className="text-2xl flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center"
                      style={{ background: mod.color + '22' }}
                    >
                      {mod.icon}
                    </div>
                    <div className="flex-1">
                      <div className="font-display text-sm" style={{ color: mod.color }}>
                        {mod.name}
                      </div>
                      <div className="text-[11px] text-gray-300 font-body leading-snug">
                        {mod.description}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* 起始条件 */}
              <div className="flex items-center gap-1.5 mb-2">
                <Sparkles className="w-3 h-3 text-neon-gold" />
                <span className="text-[10px] font-display text-neon-gold tracking-widest uppercase">
                  Starting condition
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-4">
                <Stat icon={<Heart className="w-3 h-3 text-elem-fire" />} label="HP" value={challenge.startHp} color="#FF6B6B" />
                <Stat icon={<Sparkles className="w-3 h-3 text-neon-gold" />} label="Stardust" value={challenge.startStardust} color="#FFD166" />
                <Stat icon={<Flame className="w-3 h-3 text-elem-fire" />} label="Element" value={`${challenge.startElements.length}Kind`} color="#4ECDC4" />
              </div>

              {/* 历史最佳 */}
              {dailyBest && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mb-4 p-2.5 rounded-lg bg-void-900/60 border border-neon-cyan/30"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Trophy className="w-3 h-3 text-neon-cyan" />
                      <span className="text-[10px] font-display text-neon-cyan tracking-wider uppercase">
                        Today’s Best
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-gray-400">Wave <span className="text-neon-gold font-display">{dailyBest.wave}</span></span>
                      <span className="text-gray-400">Score <span className="text-neon-cyan font-display">{dailyBest.score}</span></span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* 开始按钮 */}
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleStart}
                className="w-full py-3 rounded clip-corner font-display text-base font-bold text-void-900 bg-gradient-to-r from-neon-gold via-amber-300 to-neon-gold shadow-glow-gold flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-void-900" />
                {dailyBest ? 'Challenge again' : 'Start the challenge'}
              </motion.button>

              <p className="mt-2 text-center text-[10px] text-gray-500 font-body">
                Challenge results are saved independently and do not affect the normal mode
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Stat({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string | number; color: string }) {
  return (
    <div
      className="p-2 rounded-lg border text-center"
      style={{ background: color + '11', borderColor: color + '33' }}
    >
      <div className="flex items-center justify-center gap-1 mb-0.5">
        {icon}
        <span className="text-[9px] text-gray-400 font-body uppercase">{label}</span>
      </div>
      <div className="font-display text-sm" style={{ color }}>{value}</div>
    </div>
  );
}

// 包装 useGameStore 的 startDailyChallenge（避免循环导入）
import { useGameStore } from '@/store/gameStore';
function useGameStoreStartDaily() {
  return useGameStore(s => s.startDailyChallenge);
}
