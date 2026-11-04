import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';

// 显示当前波次事件的横幅（HUD 下方）
export default function WaveEventBanner() {
  const currentEvent = useGameStore(s => s.currentEvent);
  const status = useGameStore(s => s.status);

  // 仅在 playing/paused/wave-clear 状态显示
  const visible = (status === 'playing' || status === 'paused' || status === 'wave-clear') && currentEvent;

  return (
    <AnimatePresence>
      {visible && currentEvent && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ type: 'spring', damping: 18 }}
          className="absolute top-14 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
          style={{ marginTop: '52px' }}
        >
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md border animate-pulse"
            style={{
              background: currentEvent.color + '22',
              borderColor: currentEvent.color + '88',
              boxShadow: `0 0 16px ${currentEvent.color}44`,
              animationDuration: '2s',
            }}
          >
            <span className="text-base">{currentEvent.icon}</span>
            <div className="flex flex-col">
              <span
                className="font-display text-xs font-bold tracking-wide"
                style={{ color: currentEvent.color }}
              >
                {currentEvent.name}
              </span>
              <span className="text-[10px] text-gray-300 font-body">
                {currentEvent.description}
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
