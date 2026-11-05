import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { useNavigate } from 'react-router-dom';
import { useMetaStore } from '@/store/metaStore';
import { useEffect, useState } from 'react';
import { Skull, Sparkles, Trophy, Clock, Calendar } from 'lucide-react';

export default function GameOverPanel() {
  const navigate = useNavigate();
  const isDead = useGameStore(s => s.status === 'dead');
  const isVictory = useGameStore(s => s.status === 'victory');
  const isFinished = isDead || isVictory;
  const endRun = useGameStore(s => s.endRun);
  const currentChallenge = useGameStore(s => s.currentChallenge);
  const recordRun = useMetaStore(s => s.recordRun);
  const recordDailyResult = useMetaStore(s => s.recordDailyResult);
  const [result, setResult] = useState<{ wave: number; score: number; kills: number; stardust: number } | null>(null);
  const [isNewRecord, setIsNewRecord] = useState(false);

  useEffect(() => {
    if (isFinished && !result) {
      const r = endRun();
      setResult(r);
      recordRun(r.wave, r.score, r.kills, r.stardust);
      // 如果是挑战模式，记录今日成绩
      if (currentChallenge) {
        const prevBest = useMetaStore.getState().getDailyBest(currentChallenge.date);
        const isNew = !prevBest || r.score > prevBest.score;
        setIsNewRecord(isNew);
        recordDailyResult(currentChallenge.date, r.wave, r.score, r.kills);
      }
    }
  }, [isFinished, endRun, recordRun, recordDailyResult, currentChallenge, result]);

  return (
    <AnimatePresence>
      {isFinished && result && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-void-900/90 backdrop-blur-md pointer-auto"
        >
          <motion.div
            initial={{ scale: 0.7, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: 'spring', damping: 18 }}
            className="glass-panel rounded-xl p-8 max-w-md w-full mx-4 clip-corner"
          >
            <div className="flex flex-col items-center text-center">
              <motion.div
                initial={{ rotate: -10, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', damping: 12 }}
                className="mb-4"
              >
                {isVictory
                  ? <Trophy className="w-16 h-16 text-neon-gold" />
                  : <Skull className="w-16 h-16 text-elem-fire" />}
              </motion.div>
              <h2 className={`font-display text-3xl mb-1 ${isVictory ? 'text-neon-gold' : 'text-elem-fire'}`}>
                {isVictory ? 'Victory!' : 'Core Lost'}
              </h2>
              <p className="text-gray-400 text-sm font-body mb-2">
                {isVictory ? 'You defeated the final threat from the Void.' : 'The enemy overwhelmed your core. Try again and come back stronger.'}
              </p>

              {/* 挑战模式标识 */}
              {currentChallenge && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mb-3 px-3 py-1.5 rounded-full bg-neon-gold/10 border border-neon-gold/40 flex items-center gap-2"
                >
                  <Calendar className="w-3 h-3 text-neon-gold" />
                  <span className="text-[10px] font-display text-neon-gold tracking-wider uppercase">
                    Daily Challenge · {currentChallenge.date}
                  </span>
                </motion.div>
              )}

              {/* 新纪录提示 */}
              {currentChallenge && isNewRecord && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5, type: 'spring', damping: 8 }}
                  className="mb-3 px-4 py-2 rounded-lg bg-gradient-to-r from-neon-gold/20 to-amber-300/20 border border-neon-gold"
                >
                  <div className="flex items-center gap-2 justify-center">
                    <Trophy className="w-4 h-4 text-neon-gold animate-pulse" />
                    <span className="font-display text-sm text-neon-gold">New record today!</span>
                  </div>
                </motion.div>
              )}

              <div className="grid grid-cols-2 gap-3 w-full mb-6">
                <Stat icon={<Trophy className="w-4 h-4 text-neon-gold" />} label="Wave" value={result.wave} color="text-neon-gold" />
                <Stat icon={<Skull className="w-4 h-4 text-elem-fire" />} label="Kills" value={result.kills} color="text-elem-fire" />
                <Stat icon={<Sparkles className="w-4 h-4 text-neon-gold" />} label="Stardust earned" value={`+${result.stardust}`} color="text-neon-gold" />
                <Stat icon={<Clock className="w-4 h-4 text-neon-cyan" />} label="Score" value={result.score} color="text-neon-cyan" />
              </div>

              <div className="flex gap-3 w-full">
                <button
                  onClick={() => {
                    useGameStore.getState().startNewRun();
                    setResult(null);
                  }}
                  className="flex-1 py-2.5 rounded clip-corner font-display text-sm bg-neon-gold text-void-900 hover:brightness-110 transition-all shadow-glow-gold"
                >
                  Play Again
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="flex-1 py-2.5 rounded clip-corner font-display text-sm bg-void-700 text-gray-300 border border-gray-600 hover:bg-void-600 transition-all"
                >
                  Main Menu
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Stat({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string | number; color: string }) {
  return (
    <div className="bg-void-800/60 rounded p-3 border border-gray-700/50">
      <div className="flex items-center justify-center gap-1.5 mb-1">
        {icon}
        <span className="text-xs text-gray-400 font-body uppercase">{label}</span>
      </div>
      <div className={`font-display text-xl ${color}`}>{value}</div>
    </div>
  );
}
