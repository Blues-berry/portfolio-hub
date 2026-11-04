import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAchievementStore } from '@/store/achievementStore';
import { getAchievementById } from '@/data/achievements';
import { X, Sparkles } from 'lucide-react';

// 成就解锁 Toast 通知
// 顶部居中弹出，5 秒后自动消失，可点击关闭

export default function AchievementToast() {
  const toastQueue = useAchievementStore(s => s.toastQueue);
  const dismissToast = useAchievementStore(s => s.dismissToast);
  const [isVisible, setIsVisible] = useState(false);

  const currentId = toastQueue[0];
  const def = currentId ? getAchievementById(currentId) : null;

  useEffect(() => {
    if (currentId && def) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => dismissToast(), 300);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [currentId, def, dismissToast]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => dismissToast(), 300);
  };

  return (
    <AnimatePresence>
      {currentId && def && isVisible && (
        <motion.div
          initial={{ y: -100, opacity: 0, scale: 0.85 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -100, opacity: 0, scale: 0.9 }}
          transition={{ type: 'spring', damping: 18, stiffness: 200 }}
          className="absolute top-14 left-1/2 -translate-x-1/2 z-[55] pointer-events-auto"
          onClick={handleClose}
        >
          <div
            className="relative flex items-center gap-3 px-5 py-3 rounded-lg clip-corner overflow-hidden cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, rgba(26, 26, 58, 0.95), rgba(11, 5, 24, 0.95))',
              border: '2px solid #FFD166',
              boxShadow: '0 0 30px rgba(255,209,102,0.5), 0 4px 16px rgba(0,0,0,0.5)',
            }}
          >
            {/* 背景闪光 */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-neon-gold/20 to-transparent pointer-events-none"
            />

            {/* 图标 */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: 'spring', damping: 10 }}
              className="relative z-10 text-4xl flex-shrink-0"
              style={{ filter: 'drop-shadow(0 0 8px #FFD166)' }}
            >
              {def.icon}
            </motion.div>

            {/* 文本 */}
            <div className="relative z-10 flex flex-col gap-0.5 min-w-[200px]">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-neon-gold" />
                <span className="text-[10px] font-display text-neon-gold tracking-widest uppercase">
                  Achievement Unlocked
                </span>
              </div>
              <div className="font-display text-base text-white font-bold leading-tight">
                {def.name}
              </div>
              <div className="text-[11px] text-gray-300 font-body">
                {def.description}
              </div>
              {def.reward > 0 && (
                <div className="flex items-center gap-1 mt-0.5">
                  <Sparkles className="w-2.5 h-2.5 text-neon-gold" />
                  <span className="text-[10px] text-neon-gold font-display">
                    +{def.reward} Stardust Reward
                  </span>
                </div>
              )}
            </div>

            {/* 关闭按钮 */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleClose();
              }}
              className="relative z-10 p-1 rounded text-gray-400 hover:text-white hover:bg-void-700/50 transition-all flex-shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
