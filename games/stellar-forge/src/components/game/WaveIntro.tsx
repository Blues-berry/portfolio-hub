import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { useEffect, useState, useRef } from 'react';

export default function WaveIntro() {
  const wave = useGameStore(s => s.wave);
  const status = useGameStore(s => s.status);
  const [showIntro, setShowIntro] = useState(false);
  const lastWaveRef = useRef(0);

  useEffect(() => {
    // 只在 wave 增加且游戏进行中时显示
    if (wave > 0 && wave > lastWaveRef.current && (status === 'playing' || status === 'wave-intro')) {
      setShowIntro(true);
      const t = setTimeout(() => setShowIntro(false), 1500);
      lastWaveRef.current = wave;
      return () => clearTimeout(t);
    }
    lastWaveRef.current = wave;
  }, [wave, status]);

  return (
    <AnimatePresence>
      {showIntro && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none"
        >
          <motion.div
            initial={{ scale: 0.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 2, opacity: 0 }}
            transition={{ type: 'spring', damping: 15 }}
            className="text-center"
          >
            <div className="text-xs font-body text-gray-400 tracking-[0.4em] mb-2">WAVE</div>
            <div className="font-display text-7xl text-neon-gold text-glow-gold">
              {String(wave).padStart(2, '0')}
            </div>
            {wave % 5 === 0 && (
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-2 font-display text-elem-fire animate-pulse"
              >
                ⚠ BOSS 来袭
              </motion.div>
            )}
            {wave % 3 === 0 && wave % 5 !== 0 && (
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-2 font-display text-purple-400"
              >
                ⚔ 精英波
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
