import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { Trophy, Crosshair, Gem, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function WaveClearPanel() {
  const status = useGameStore(s => s.status);
  const wave = useGameStore(s => s.wave);
  const killCount = useGameStore(s => s.killCount);
  const waveStartKillCount = useGameStore(s => s.waveStartKillCount);
  const stardust = useGameStore(s => s.stardust);
  const waveStartStardust = useGameStore(s => s.waveStartStardust);

  const [visible, setVisible] = useState(false);
  const [stats, setStats] = useState({ kills: 0, stardust: 0, wave: 0 });

  // 监听 status 变化，记录本波统计
  useEffect(() => {
    if (status === 'wave-clear') {
      setStats({
        kills: killCount - waveStartKillCount,
        stardust: stardust - waveStartStardust,
        wave,
      });
      setVisible(true);
    } else if (status === 'shop') {
      // 商店打开后淡出结算面板
      const t = setTimeout(() => setVisible(false), 200);
      return () => clearTimeout(t);
    }
  }, [status, killCount, waveStartKillCount, stardust, waveStartStardust, wave]);

  const isOpen = status === 'wave-clear' && visible;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none"
        >
          <motion.div
            initial={{ scale: 0.7, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 18, stiffness: 200 }}
            className="relative px-8 py-5 rounded-lg clip-corner backdrop-blur-md border-2 border-neon-gold/60"
            style={{
              background: 'linear-gradient(180deg, rgba(26,26,58,0.95), rgba(11,5,24,0.95))',
              boxShadow: '0 0 40px rgba(255,209,102,0.4)',
              minWidth: 320,
            }}
          >
            {/* 顶部装饰 */}
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-b bg-neon-gold text-void-900 text-[10px] font-display tracking-wider">
              WAVE CLEAR
            </div>

            {/* 标题 */}
            <div className="flex items-center justify-center gap-2 mb-4">
              <Trophy className="w-6 h-6 text-neon-gold" />
              <h2 className="font-display text-2xl text-neon-gold text-glow-gold">
                Wave {stats.wave} Cleared!
              </h2>
            </div>

            {/* 统计数据 */}
            <div className="grid grid-cols-2 gap-3">
              <StatBox
                icon={<Crosshair className="w-4 h-4" />}
                label="Enemies defeated"
                value={`+${stats.kills}`}
                color="#4ECDC4"
                delay={0.1}
              />
              <StatBox
                icon={<Gem className="w-4 h-4" />}
                label="Stardust earned"
                value={`+${stats.stardust}`}
                color="#FFD166"
                delay={0.2}
              />
            </div>

            {/* 进度提示 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-400 font-body"
            >
              <Clock className="w-3 h-3 animate-pulse" />
              Heading to the Star Core Shop…
            </motion.div>

            {/* 底部进度条 */}
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 1.5, ease: 'linear' }}
              className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-neon-gold to-amber-300 rounded-b"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function StatBox({ icon, label, value, color, delay }: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay }}
      className="flex items-center gap-2 p-2.5 rounded border"
      style={{
        background: color + '11',
        borderColor: color + '44',
      }}
    >
      <div
        className="w-8 h-8 rounded flex items-center justify-center"
        style={{ background: color + '22', color }}
      >
        {icon}
      </div>
      <div className="flex-1">
        <div className="text-[10px] text-gray-400 uppercase tracking-wider">{label}</div>
        <div className="font-display text-base" style={{ color }}>{value}</div>
      </div>
    </motion.div>
  );
}
