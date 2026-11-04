import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { ELEMENTS } from '@/data/elements';
import { EvolutionId } from '@/types/game';

export default function EvolutionSelectPanel() {
  const { pendingEvolution, selectEvolution } = useGameStore();
  const isOpen = useGameStore(s => s.status === 'evolution-select');

  return (
    <AnimatePresence>
      {isOpen && pendingEvolution && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-40 flex flex-col items-center justify-center pointer-auto bg-void-900/85 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 20 }}
            className="text-center mb-6"
          >
            <div className="text-4xl mb-2">✨</div>
            <h2 className="font-display text-3xl text-neon-gold text-glow-gold mb-1">Star Core Evolution</h2>
            <p className="text-gray-400 text-sm font-body">Choose an evolution path</p>
          </motion.div>

          <div className="flex gap-4">
            {pendingEvolution.branches.map((branch, i) => {
              // 找到星核元素
              const orb = useGameStore.getState().grid.flat().find(o => o?.id === pendingEvolution.orbId);
              const elem = orb ? ELEMENTS[orb.element] : ELEMENTS.fire;
              return (
                <motion.button
                  key={branch.id}
                  initial={{ x: i === 0 ? -50 : 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  whileHover={{ y: -8, scale: 1.04 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => selectEvolution(pendingEvolution.orbId, branch.id as EvolutionId)}
                  className="relative w-64 p-6 rounded-lg clip-corner border-2 transition-all group"
                  style={{
                    borderColor: branch.color,
                    background: `linear-gradient(180deg, ${branch.color}22 0%, ${branch.color}05 50%, rgba(11,11,31,0.95) 100%)`,
                    boxShadow: `0 0 30px ${branch.color}44, inset 0 0 20px ${branch.color}11`,
                  }}
                >
                  <div className="flex flex-col items-center gap-3">
                    <div
                      className="w-20 h-20 rounded-full flex items-center justify-center text-3xl mb-2 relative"
                      style={{
                        background: `radial-gradient(circle, ${branch.color}, ${elem.color})`,
                        boxShadow: `0 0 25px ${branch.color}88`,
                      }}
                    >
                      <span className="text-white drop-shadow">{elem.symbol}</span>
                      <div
                        className="absolute -inset-1 rounded-full border-2 animate-spin-slow"
                        style={{ borderColor: branch.color, borderTopColor: 'transparent' }}
                      />
                    </div>
                    <h4 className="font-display text-xl" style={{ color: branch.color }}>
                      {branch.name}
                    </h4>
                    <p className="text-sm text-gray-300 text-center font-body leading-snug min-h-[2.5rem]">
                      {branch.description}
                    </p>
                    <div
                      className="px-3 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-display"
                      style={{ background: branch.color + '22', color: branch.color }}
                    >
                      Evolution Ability
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
