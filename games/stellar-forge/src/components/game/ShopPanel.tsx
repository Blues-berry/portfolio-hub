import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { ELEMENTS } from '@/data/elements';
import { RefreshCw, Coins, Heart, Sparkles } from 'lucide-react';

export default function ShopPanel() {
  const { shopItems, stardust, rerollsLeft, buyShopItem, rerollShop, closeShop } = useGameStore();
  const isOpen = useGameStore(s => s.status === 'shop');

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="absolute bottom-0 left-0 right-0 z-30 pointer-events-auto"
        >
          <div className="glass-panel mx-4 mb-4 p-4 clip-corner">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display text-lg text-neon-gold text-glow-gold">星核商店</h3>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-sm">
                  <Sparkles className="w-4 h-4 text-neon-gold" />
                  <span className="font-display text-neon-gold">{stardust}</span>
                </div>
                <button
                  onClick={rerollShop}
                  disabled={rerollsLeft <= 0 || stardust < 5}
                  className="flex items-center gap-1 px-2 py-1 rounded text-xs bg-void-700 hover:bg-void-600 disabled:opacity-30 transition-colors border border-neon-cyan/30"
                >
                  <RefreshCw className="w-3 h-3 text-neon-cyan" />
                  <span className="text-neon-cyan">刷新({rerollsLeft})</span>
                </button>
                <button
                  onClick={closeShop}
                  className="flex items-center gap-1 px-3 py-1 rounded text-xs bg-neon-gold text-void-900 font-display font-bold hover:brightness-110 transition-all"
                >
                  继续 →
                </button>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {shopItems.map(item => {
                const canAfford = stardust >= item.price;
                return (
                  <button
                    key={item.id}
                    onClick={() => buyShopItem(item.id)}
                    disabled={!canAfford}
                    className={`relative p-2 rounded clip-corner border transition-all ${
                      canAfford
                        ? 'bg-void-700/80 border-neon-gold/40 hover:border-neon-gold hover:shadow-glow-gold hover:-translate-y-0.5'
                        : 'bg-void-800/50 border-gray-700 opacity-40 cursor-not-allowed'
                    }`}
                  >
                    {item.kind === 'orb' && item.element && (
                      <div className="flex flex-col items-center gap-1">
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center text-lg"
                          style={{
                            background: `radial-gradient(circle, ${ELEMENTS[item.element].glow}, ${ELEMENTS[item.element].color})`,
                            boxShadow: `0 0 12px ${ELEMENTS[item.element].color}66`,
                          }}
                        >
                          {ELEMENTS[item.element].symbol}
                        </div>
                        <span className="text-xs text-gray-300">星核 Lv1</span>
                      </div>
                    )}
                    {item.kind === 'relic' && item.relic && (
                      <div className="flex flex-col items-center gap-1">
                        <div className="text-2xl">{item.relic.icon}</div>
                        <span className="text-xs text-neon-gold font-body text-center leading-tight">
                          {item.relic.name}
                        </span>
                        <span
                          className={`text-[10px] uppercase ${
                            item.relic.rarity === 'legendary' ? 'text-neon-gold' :
                            item.relic.rarity === 'epic' ? 'text-purple-400' :
                            item.relic.rarity === 'rare' ? 'text-neon-cyan' : 'text-gray-400'
                          }`}
                        >
                          {item.relic.rarity}
                        </span>
                      </div>
                    )}
                    {item.kind === 'heal' && (
                      <div className="flex flex-col items-center gap-1">
                        <Heart className="w-7 h-7 text-elem-fire fill-elem-fire" />
                        <span className="text-xs text-elem-fire">+1 HP</span>
                      </div>
                    )}
                    <div className="absolute -bottom-1 -right-1 flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-void-900 border border-neon-gold/50">
                      <Coins className="w-2.5 h-2.5 text-neon-gold" />
                      <span className="text-[10px] font-display text-neon-gold">{item.price}</span>
                    </div>
                  </button>
                );
              })}
              {/* 填充空位 */}
              {Array.from({ length: Math.max(0, 5 - shopItems.length) }).map((_, i) => (
                <div key={`empty-${i}`} className="p-2 rounded clip-corner border border-dashed border-gray-700 opacity-30">
                  <div className="w-9 h-9" />
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
