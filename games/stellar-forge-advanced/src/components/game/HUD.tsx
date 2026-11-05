import { useState, useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import { ELEMENTS } from '@/data/elements';
import { BONDS_BY_ID } from '@/data/bonds';
import { Heart, Gem, Zap, Trophy, Crosshair, Volume2, VolumeX, Sparkles, Skull, AlertTriangle, Calendar, Link2 } from 'lucide-react';
import { setSoundEnabled, isSoundEnabled } from '@/engine/sound';
import { getSceneByWave } from '@/data/scenes';

// 判断下一波是否为 Boss/精英波
function getNextWaveType(wave: number): { type: 'boss' | 'elite' | 'normal'; label: string } | null {
  const next = wave + 1;
  if (next === 20) return { type: 'boss', label: '终极Boss' };
  if (next % 5 === 0) return { type: 'boss', label: 'Boss 波' };
  if (next % 3 === 0) return { type: 'elite', label: '精英波' };
  return null;
}

export default function HUD() {
  const { hp, maxHp, stardust, wave, deploymentCharge, currentElement, availableElements, combo, comboTimer, score, killCount, corruption, status, currentChallenge, activeRunes, activeBonds } = useGameStore();
  const elem = ELEMENTS[currentElement];
  const [soundOn, setSoundOn] = useState(isSoundEnabled());
  const scene = getSceneByWave(wave || 1);
  const [lowHpPulse, setLowHpPulse] = useState(false);

  // HP 低警告（≤1 时心形闪烁）
  useEffect(() => {
    if (hp <= 1 && status === 'playing') {
      const interval = setInterval(() => {
        setLowHpPulse(p => !p);
      }, 500);
      return () => clearInterval(interval);
    } else {
      setLowHpPulse(false);
    }
  }, [hp, status]);

  const toggleSound = () => {
    const v = !soundOn;
    setSoundOn(v);
    setSoundEnabled(v);
  };

  // 下一波预警（仅在 shop/relic-select 显示）
  const nextWaveInfo = (status === 'shop' || status === 'relic-select') ? getNextWaveType(wave) : null;

  return (
    <div className="absolute top-0 left-0 right-0 z-20 pointer-events-none">
      <div className="flex flex-col gap-1 px-2 py-1 bg-gradient-to-b from-void-900/95 to-transparent sm:flex-row sm:items-center sm:justify-between sm:px-4 sm:py-2">
        {/* 左：生命 + 波次 + 场景 */}
        <div className="flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-start sm:gap-4">
          <div className={`flex items-center gap-1.5 ${lowHpPulse ? 'animate-pulse' : ''}`}>
            <Heart className={`w-5 h-5 ${hp <= 1 ? 'text-red-500 fill-red-500' : 'text-elem-fire fill-elem-fire'} ${lowHpPulse ? 'animate-ping' : ''}`} style={{ animationDuration: '0.8s' }} />
            <div className="flex gap-0.5">
              {Array.from({ length: maxHp }).map((_, i) => (
                <div
                  key={i}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    i < hp ? 'bg-elem-fire shadow-glow-fire' : 'bg-void-600'
                  } ${i === 0 && hp === 1 ? 'animate-pulse' : ''}`}
                />
              ))}
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-neon-gold" />
            <span className="font-display text-neon-gold text-sm">WAVE {wave}</span>
          </div>
          <div style={{ color: '#c6f8f1', fontSize: 11, whiteSpace: 'nowrap', padding: '4px 7px', border: '1px solid #4ecdc466', borderRadius: 6, background: '#091d28' }} aria-label={`部署 ${Math.floor(deploymentCharge)} / 6`}>部署 {Math.floor(deploymentCharge)}/6 · 2秒回1点</div>
          {/* 当前场景 */}
          <div
            className="hidden items-center gap-1 px-2 py-0.5 rounded text-[10px] font-display sm:flex"
            style={{
              background: scene.accentColor + '22',
              border: `1px solid ${scene.accentColor}66`,
              color: scene.accentColor,
            }}
            title={scene.description}
          >
            <Sparkles className="w-3 h-3" />
            {scene.name}
          </div>
          {/* 挑战模式标识 */}
          {currentChallenge && (
            <div
              className="hidden items-center gap-1 px-2 py-0.5 rounded text-[10px] font-display animate-pulse sm:flex"
              style={{
                background: 'rgba(255,209,102,0.15)',
                border: '1px solid rgba(255,209,102,0.6)',
                color: '#FFD166',
                animationDuration: '2s',
              }}
              title={`日常挑战 · ${currentChallenge.date}\n${currentChallenge.modifiers.map(m => m.name).join(' + ')}`}
            >
              <Calendar className="w-3 h-3" />
              {currentChallenge.modifiers.map(m => m.icon).join(' ')}
            </div>
          )}
          {/* 堕落值 */}
          {corruption > 0 && (
            <div
              className="hidden items-center gap-1 px-2 py-0.5 rounded text-[10px] font-display sm:flex"
              style={{
                background: '#7F1A1A44',
                border: '1px solid #C0392B88',
                color: '#FF6B6B',
              }}
              title="接受怪兽契约会累积堕落值"
            >
              <Skull className="w-3 h-3" />
              堕落 {corruption}
            </div>
          )}
          {/* 已装备符文 */}
          {activeRunes.length > 0 && (
            <div
              className="hidden items-center gap-1 px-2 py-0.5 rounded text-[10px] sm:flex"
              style={{
                background: 'rgba(78,205,196,0.12)',
                border: '1px solid rgba(78,205,196,0.5)',
              }}
              title={`已装备符文：\n${activeRunes.map(r => `${r.icon} ${r.name} - ${r.description}`).join('\n')}`}
            >
              <Gem className="w-3 h-3 text-neon-cyan" />
              {activeRunes.map((r, i) => (
                <span key={i} style={{ color: r.color }}>{r.icon}</span>
              ))}
            </div>
          )}
          {/* 激活的星核羁绊（缝合自走棋玩法） */}
          {Array.isArray(activeBonds) && activeBonds.length > 0 && (
            <div
              className="hidden items-center gap-1 px-2 py-0.5 rounded text-[10px] sm:flex"
              style={{
                background: 'rgba(255,209,102,0.12)',
                border: '1px solid rgba(255,209,102,0.5)',
              }}
              title={`激活的羁绊：\n${activeBonds.map(ab => {
                const b = BONDS_BY_ID[ab.bondId];
                const t = b?.tiers[ab.tierIndex];
                return b && t ? `${b.icon} ${b.name} · ${t.name}（${t.description}）` : '';
              }).join('\n')}`}
            >
              <Link2 className="w-3 h-3 text-neon-gold" />
              {activeBonds.map((ab, i) => {
                const b = BONDS_BY_ID[ab.bondId];
                if (!b) return null;
                return (
                  <span
                    key={i}
                    style={{ color: b.color }}
                    className="font-display"
                  >
                    {b.icon}{ab.tierIndex + 1}
                  </span>
                );
              })}
            </div>
          )}
          {/* 下一波预警 */}
          {nextWaveInfo && (
            <div
              className={`hidden items-center gap-1 px-2 py-0.5 rounded text-[10px] font-display animate-pulse sm:flex ${
                nextWaveInfo.type === 'boss' ? 'text-elem-fire' : 'text-neon-gold'
              }`}
              style={{
                background: nextWaveInfo.type === 'boss' ? '#FF6B6B22' : '#FFD16622',
                border: `1px solid ${nextWaveInfo.type === 'boss' ? '#FF6B6B66' : '#FFD16666'}`,
              }}
              title={`下一波 WAVE ${wave + 1} ${nextWaveInfo.label}`}
            >
              <AlertTriangle className="w-3 h-3" />
              下一波 {nextWaveInfo.label}
            </div>
          )}
        </div>

        {/* 中：当前元素 */}
        <div className="flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-center">
          <span className="text-xs font-body text-gray-400 uppercase tracking-wider">NEXT</span>
          <div
            className="flex items-center gap-2 px-3 py-1 rounded-md clip-corner"
            style={{
              background: `linear-gradient(135deg, ${elem.color}33, ${elem.color}11)`,
              border: `1px solid ${elem.color}66`,
              boxShadow: `0 0 12px ${elem.color}44`,
            }}
          >
            <span className="text-lg">{elem.symbol}</span>
            <span className="font-display text-sm" style={{ color: elem.color }}>
              {elem.name}
            </span>
          </div>
          {/* 元素切换 */}
          <div className="flex gap-1 pointer-events-auto">
            {availableElements.map(el => (
              <button
                key={el}
                onClick={() => useGameStore.getState().setCurrentElement(el)}
                className={`w-7 h-7 rounded text-xs transition-all ${
                  el === currentElement ? 'scale-110' : 'opacity-50 hover:opacity-80'
                }`}
                style={{
                  background: ELEMENTS[el].color + '22',
                  border: `1px solid ${ELEMENTS[el].color}`,
                }}
              >
                {ELEMENTS[el].symbol}
              </button>
            ))}
          </div>
        </div>

        {/* 右：星尘 + 分数 */}
        <div className="flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-end sm:gap-4">
          {combo > 1 && (
            <div
              className={`hidden items-center gap-1 px-2 py-0.5 rounded border animate-pulse sm:flex ${
                combo >= 20 ? 'bg-red-500/30 border-red-400'
                  : combo >= 10 ? 'bg-orange-500/25 border-orange-400'
                  : combo >= 5 ? 'bg-neon-gold/25 border-neon-gold'
                  : 'bg-elem-fire/20 border-elem-fire/50'
              }`}
              style={{ animationDuration: '0.6s' }}
            >
              <Zap className={`w-3 h-3 ${
                combo >= 20 ? 'text-red-400'
                  : combo >= 10 ? 'text-orange-400'
                  : combo >= 5 ? 'text-neon-gold'
                  : 'text-elem-fire'
              }`} />
              <span className={`font-display text-xs ${
                combo >= 20 ? 'text-red-400'
                  : combo >= 10 ? 'text-orange-400'
                  : combo >= 5 ? 'text-neon-gold'
                  : 'text-elem-fire'
              }`}>
                {combo}x
                {combo >= 5 && (
                  <span className="ml-1 text-[10px] opacity-80">
                    +{combo >= 20 ? 50 : combo >= 10 ? 25 : 10}%
                  </span>
                )}
              </span>
              {/* 连击计时条 */}
              <div className="ml-1 w-8 h-1 bg-void-700/60 rounded overflow-hidden">
                <div
                  className="h-full rounded transition-all"
                  style={{
                    width: `${(comboTimer / 2.0) * 100}%`,
                    background: combo >= 20 ? '#F87171' : combo >= 10 ? '#FB923C' : combo >= 5 ? '#FFD166' : '#FF6B6B',
                  }}
                />
              </div>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <Crosshair className="w-4 h-4 text-neon-cyan" />
            <span className="font-body text-sm text-neon-cyan">{killCount}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Gem className="w-4 h-4 text-neon-gold" />
            <span className="font-display text-neon-gold text-sm">{stardust}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-gray-400 font-body">SCORE</span>
            <span className="font-display text-sm text-white">{Math.floor(score)}</span>
          </div>
          <button
            onClick={toggleSound}
            className="pointer-events-auto p-1.5 rounded text-gray-400 hover:text-neon-gold hover:bg-void-700/50 transition-all"
            title={soundOn ? '关闭音效' : '开启音效'}
          >
            {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
