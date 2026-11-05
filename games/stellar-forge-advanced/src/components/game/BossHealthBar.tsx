import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { ENEMIES } from '@/data/enemies';
import { Enemy } from '@/types/game';

// 判断是否为 Boss 级敌人
function isBossEnemy(enemy: Enemy): boolean {
  return enemy.type === 'boss' || enemy.type === 'maiden';
}

export default function BossHealthBar() {
  const enemies = useGameStore(s => s.enemies);
  const status = useGameStore(s => s.status);
  const currentMonsterId = useGameStore(s => s.currentMonsterId);

  // 仅在 playing/paused 状态下显示，且只取 Boss 级敌人
  const boss = enemies.find(isBossEnemy);
  const visible = (status === 'playing' || status === 'paused') && boss;

  return (
    <AnimatePresence>
      {visible && boss && (
        <motion.div
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -60, opacity: 0 }}
          transition={{ type: 'spring', damping: 18, stiffness: 200 }}
          className="absolute top-14 left-1/2 -translate-x-1/2 z-30 pointer-events-none w-[min(560px,90vw)]"
        >
          <BossBarContent enemy={boss} monsterId={currentMonsterId} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function BossBarContent({ enemy, monsterId }: { enemy: Enemy; monsterId: string | null }) {
  const cfg = ENEMIES[enemy.type];
  const isMaiden = enemy.type === 'maiden';
  const hpRatio = Math.max(0, enemy.hp / enemy.maxHp);

  // 颜色配置：maiden 用紫色，boss 用暗红
  const barColor = isMaiden ? '#E94560' : '#C0392B';
  const barGlow = isMaiden ? '#FF66CC' : '#FF6B6B';

  // Boss 名称（如果有怪兽 ID 关联，用怪兽名）
  const bossName = monsterId ? cfg.name : cfg.name;

  // 阶段标识（HP < 30% 时显示"狂暴"）
  const phase = hpRatio < 0.3 ? '⚠ 狂暴' : hpRatio < 0.6 ? '激战' : '对峙';

  return (
    <div
      className="relative px-4 py-2 rounded-lg backdrop-blur-md border"
      style={{
        background: `linear-gradient(180deg, ${barColor}22, rgba(11,5,24,0.85))`,
        borderColor: barColor + '88',
        boxShadow: `0 0 24px ${barColor}44, 0 4px 12px rgba(0,0,0,0.5)`,
      }}
    >
      {/* 顶部：名称 + 阶段 */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <span
            className="text-xs font-display tracking-wider"
            style={{ color: barGlow }}
          >
            {isMaiden ? '💔 堕落少女' : '⚠ BOSS'}
          </span>
          <span className="font-display text-sm text-white font-bold">
            {bossName}
          </span>
        </div>
        <span
          className="text-[10px] font-display px-2 py-0.5 rounded"
          style={{
            background: barColor + '33',
            color: barGlow,
            border: `1px solid ${barColor}66`,
          }}
        >
          {phase}
        </span>
      </div>

      {/* 血条 */}
      <div
        className="relative h-3 rounded-full overflow-hidden border"
        style={{
          background: 'rgba(0,0,0,0.6)',
          borderColor: barColor + '88',
        }}
      >
        {/* 血量条 */}
        <motion.div
          animate={{ width: `${hpRatio * 100}%` }}
          transition={{ type: 'tween', duration: 0.15 }}
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            background: `linear-gradient(90deg, ${barColor}, ${barGlow})`,
            boxShadow: `0 0 12px ${barGlow}`,
          }}
        />
        {/* 高光 */}
        <div
          className="absolute inset-x-0 top-0 h-1/2 rounded-t-full"
          style={{
            background: `linear-gradient(180deg, rgba(255,255,255,0.3), transparent)`,
          }}
        />
        {/* 刻度线（25/50/75） */}
        {[0.25, 0.5, 0.75].map((p) => (
          <div
            key={p}
            className="absolute top-0 bottom-0 w-px"
            style={{
              left: `${p * 100}%`,
              background: 'rgba(0,0,0,0.5)',
            }}
          />
        ))}
      </div>

      {/* 底部：HP 数值 */}
      <div className="flex items-center justify-between mt-1 text-[10px] font-body">
        <span className="text-gray-400">{Math.ceil(enemy.hp)} / {Math.ceil(enemy.maxHp)}</span>
        <span className="text-gray-500">{Math.floor(hpRatio * 100)}%</span>
      </div>
    </div>
  );
}
