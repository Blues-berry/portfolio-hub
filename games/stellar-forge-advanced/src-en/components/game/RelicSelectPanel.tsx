import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { Relic } from '@/types/game';

const RARITY_STYLES: Record<string, { border: string; glow: string; text: string; bg: string }> = {
  common: { border: 'border-gray-400', glow: 'shadow-gray-400/30', text: 'text-gray-300', bg: 'from-gray-800/80' },
  rare: { border: 'border-neon-cyan', glow: 'shadow-glow-cyan', text: 'text-neon-cyan', bg: 'from-cyan-900/60' },
  epic: { border: 'border-purple-400', glow: 'shadow-purple-500/40', text: 'text-purple-300', bg: 'from-purple-900/60' },
  legendary: { border: 'border-neon-gold', glow: 'shadow-glow-gold', text: 'text-neon-gold', bg: 'from-amber-900/60' },
};

function RelicCard({ relic, onPick }: { relic: Relic; onPick: () => void }) {
  const style = RARITY_STYLES[relic.rarity] || RARITY_STYLES.common;
  return (
    <motion.button
      whileHover={{ y: -6, scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      onClick={onPick}
      className={`relative flex-1 max-w-xs p-5 rounded-lg clip-corner border-2 ${style.border} bg-gradient-to-b ${style.bg} to-void-900/90 ${style.glow} shadow-lg transition-all group`}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-neon-gold/5 to-transparent rounded-lg" />
      <div className="flex flex-col items-center gap-3">
        <div className="text-5xl drop-shadow-lg">{relic.icon}</div>
        <h4 className={`font-display text-lg ${style.text} text-center`}>{relic.name}</h4>
        <span className={`text-[10px] uppercase tracking-widest ${style.text} opacity-70`}>{relic.rarity}</span>
        <p className="text-sm text-gray-300 text-center font-body leading-snug">{relic.description}</p>
      </div>
    </motion.button>
  );
}

export default function RelicSelectPanel() {
  const { relicChoices, selectRelic } = useGameStore();
  const isOpen = useGameStore(s => s.status === 'relic-select');

  return (
    <AnimatePresence>
      {isOpen && relicChoices && relicChoices.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-40 flex flex-col items-center justify-center pointer-auto bg-void-900/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-8 text-center"
          >
            <h2 className="font-display text-3xl text-neon-gold text-glow-gold mb-2">Choose a Relic</h2>
            <p className="text-gray-400 text-sm font-body">Choose one relic for the rest of this run.</p>
          </motion.div>
          <div className="flex gap-5 px-8 max-w-4xl">
            {relicChoices.map((relic, i) => (
              <motion.div
                key={relic.id}
                initial={{ y: 30, opacity: 0, rotateY: -20 }}
                animate={{ y: 0, opacity: 1, rotateY: 0 }}
                transition={{ delay: 0.2 + i * 0.1, type: 'spring', damping: 18 }}
                className="flex-1"
              >
                <RelicCard relic={relic} onPick={() => selectRelic(relic)} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
