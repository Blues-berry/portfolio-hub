import { useGameStore } from '@/store/gameStore';
import { SKILLS, SKILL_IDS, MAX_ENERGY } from '@/data/skills';
import { useEffect, useState } from 'react';

export default function SkillBar() {
  const energy = useGameStore(s => s.energy);
  const skillCooldowns = useGameStore(s => s.skillCooldowns);
  const status = useGameStore(s => s.status);
  const activateSkill = useGameStore(s => s.activateSkill);
  const currentElement = useGameStore(s => s.currentElement);
  const [flashSkill, setFlashSkill] = useState<string | null>(null);

  // 触发动画：能量刚够时按钮闪烁
  useEffect(() => {
    if (energy >= MAX_ENERGY) {
      setFlashSkill('full');
      const t = setTimeout(() => setFlashSkill(null), 400);
      return () => clearTimeout(t);
    }
  }, [energy]);

  const isPlaying = status === 'playing';

  return (
    <div className="absolute left-1/2 -translate-x-1/2 bottom-14 z-20 pointer-events-auto">
      <div className="flex flex-col items-center gap-1.5">
        {/* 能量条 */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-display text-neon-cyan tracking-wider">ENERGY</span>
          <div className="w-48 h-2.5 bg-void-900/80 border border-neon-cyan/40 rounded-full overflow-hidden relative">
            <div
              className="h-full rounded-full transition-all duration-200 relative"
              style={{
                width: `${(energy / MAX_ENERGY) * 100}%`,
                background: energy >= MAX_ENERGY
                  ? 'linear-gradient(90deg, #FFD166, #FF6B6B, #FFD166)'
                  : energy >= 40
                    ? 'linear-gradient(90deg, #4ECDC4, #FFD166)'
                    : 'linear-gradient(90deg, #4ECDC4, #7FE5DD)',
                boxShadow: `0 0 ${energy >= MAX_ENERGY ? 16 : 8}px ${energy >= MAX_ENERGY ? '#FFD166' : '#4ECDC4'}`,
              }}
            />
            {/* 能量满闪烁 */}
            {energy >= MAX_ENERGY && (
              <div className="absolute inset-0 rounded-full animate-pulse" style={{ background: 'rgba(255, 209, 102, 0.3)', animationDuration: '0.6s' }} />
            )}
          </div>
          <span className="text-[10px] font-display text-neon-cyan w-8 text-right">{Math.floor(energy)}/{MAX_ENERGY}</span>
        </div>

        {/* 技能按钮组 */}
        <div className="flex items-center gap-2">
          {SKILL_IDS.map(id => {
            const skill = SKILLS[id];
            const cd = skillCooldowns[id] || 0;
            const cdRatio = cd / skill.cooldown;
            const energyReady = energy >= skill.cost;
            const canUse = isPlaying && energyReady && cd === 0;
            const isElemental = id === 'elemental-storm';
            const iconColor = isElemental
              ? (currentElement === 'fire' ? '#FF6B6B'
                : currentElement === 'water' ? '#4ECDC4'
                : currentElement === 'earth' ? '#A78BFA'
                : currentElement === 'air' ? '#E0E7FF'
                : '#FFD166')
              : skill.color;

            return (
              <button
                key={id}
                onClick={() => activateSkill(id)}
                disabled={!canUse}
                className={`relative w-16 h-16 rounded-lg border-2 transition-all overflow-hidden group ${
                  canUse
                    ? 'hover:scale-105 cursor-pointer'
                    : 'opacity-60 cursor-not-allowed'
                } ${flashSkill === 'full' && energyReady ? 'animate-pulse' : ''}`}
                style={{
                  background: canUse
                    ? `radial-gradient(circle at center, ${iconColor}33, ${iconColor}11)`
                    : 'rgba(20, 20, 35, 0.7)',
                  borderColor: canUse ? iconColor : 'rgba(100, 116, 139, 0.4)',
                  boxShadow: canUse ? `0 0 12px ${iconColor}66, inset 0 0 8px ${iconColor}33` : 'none',
                  animationDuration: '0.4s',
                }}
                title={`${skill.name} — ${skill.description}\nShortcut: ${skill.hotkey}\nCost: ${skill.cost} Energy · Cooldown: ${skill.cooldown / 1000}s`}
              >
                {/* 图标 */}
                <div className="text-2xl leading-none mb-0.5">{skill.icon}</div>
                {/* 名称 + 按键 */}
                <div className="text-[9px] font-display tracking-wide" style={{ color: canUse ? iconColor : '#94A3B8' }}>
                  {skill.name}
                </div>
                <div className="absolute top-0.5 left-1 text-[9px] font-mono text-gray-400">{skill.hotkey}</div>
                {/* 冷却覆盖 */}
                {cd > 0 && (
                  <div
                    className="absolute inset-0 bg-void-900/80 flex items-center justify-center"
                    style={{
                      clipPath: `inset(0 0 ${(1 - cdRatio) * 100}% 0)`,
                    }}
                  >
                    <span className="text-sm font-display text-white">
                      {Math.ceil(cd / 1000)}s
                    </span>
                  </div>
                )}
                {/* 能量不足指示 */}
                {!energyReady && cd === 0 && (
                  <div className="absolute inset-0 bg-void-900/40 flex items-center justify-center">
                    <span className="text-[10px] text-gray-400 font-body">{skill.cost} Energy</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
