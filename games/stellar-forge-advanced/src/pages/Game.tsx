import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '@/store/gameStore';
import GameCanvas from '@/components/game/GameCanvas';
import HUD from '@/components/game/HUD';
import ShopPanel from '@/components/game/ShopPanel';
import RelicSelectPanel from '@/components/game/RelicSelectPanel';
import EvolutionSelectPanel from '@/components/game/EvolutionSelectPanel';
import GameOverPanel from '@/components/game/GameOverPanel';
import WaveIntro from '@/components/game/WaveIntro';
import StoryPanel from '@/components/game/StoryPanel';
import TutorialModal from '@/components/game/TutorialModal';
import PausePanel from '@/components/game/PausePanel';
import BossHealthBar from '@/components/game/BossHealthBar';
import WaveClearPanel from '@/components/game/WaveClearPanel';
import WaveEventBanner from '@/components/game/WaveEventBanner';
import SkillBar from '@/components/game/SkillBar';
import AchievementToast from '@/components/game/AchievementToast';
import { HelpCircle, Pause } from 'lucide-react';
import { SKILLS, SkillId } from '@/data/skills';

export default function Game() {
  const navigate = useNavigate();
  const startNewRun = useGameStore(s => s.startNewRun);
  const togglePause = useGameStore(s => s.togglePause);
  const activateSkill = useGameStore(s => s.activateSkill);
  const initializedRef = useRef(false);
  const [showTutorial, setShowTutorial] = useState(false);

  // 进入页面即开始新一局
  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      startNewRun();
      let tutorialSeen = false;
      try {
        tutorialSeen = localStorage.getItem('stellar-forge-advanced-tutorial-seen') === '1';
      } catch {
        // Keep the tutorial enabled when browser storage is unavailable.
      }
      if (!tutorialSeen) {
        useGameStore.setState({ status: 'tutorial', prevStatus: 'playing' });
        setShowTutorial(true);
      }
    }
  }, [startNewRun]);

  // 离开页面重置
  useEffect(() => {
    return () => {
      initializedRef.current = false;
    };
  }, []);

  // ESC 键暂停切换（只在 playing/paused 状态下生效）
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        const status = useGameStore.getState().status;
        if (status === 'playing' || status === 'paused') {
          e.preventDefault();
          togglePause();
        }
      } else if (e.key === ' ' || e.key === 'p' || e.key === 'P') {
        // 空格 / P 键也可暂停（仅游戏中）
        const status = useGameStore.getState().status;
        if (status === 'playing' || status === 'paused') {
          e.preventDefault();
          togglePause();
        }
      } else {
        // 主动技能快捷键 Q/W/E
        const skillId = Object.keys(SKILLS).find(k => SKILLS[k as SkillId].hotkey.toLowerCase() === e.key.toLowerCase()) as SkillId | undefined;
        if (skillId) {
          const st = useGameStore.getState();
          if (st.status === 'playing') {
            e.preventDefault();
            activateSkill(skillId);
          }
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [togglePause, activateSkill]);

  const closeTutorial = () => {
    setShowTutorial(false);
    const state = useGameStore.getState();
    if (state.status === 'tutorial') {
      useGameStore.setState({ status: state.prevStatus === 'paused' ? 'paused' : 'playing', prevStatus: null });
    }
  };

  const openTutorial = () => {
    const state = useGameStore.getState();
    if (state.status === 'playing') useGameStore.setState({ status: 'tutorial', prevStatus: 'playing' });
    setShowTutorial(true);
  };

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* 顶部 HUD */}
      <HUD />

      {/* Boss 顶部大血条 */}
      <BossHealthBar />

      {/* 波次事件横幅 */}
      <WaveEventBanner />

      {/* 主动技能栏 */}
      <SkillBar />

      {/* 成就解锁通知 */}
      <AchievementToast />

      {/* 游戏画布 */}
      <div className="sf-board-area">
        <GameCanvas />
      </div>

      {/* 浮层 */}
      <WaveIntro />
      <StoryPanel />
      <WaveClearPanel />
      <ShopPanel />
      <RelicSelectPanel />
      <EvolutionSelectPanel />
      <GameOverPanel />

      {/* 玩法说明引导（首次自动弹出 + 手动触发） */}
      <TutorialModal forceOpen={showTutorial} onClose={closeTutorial} />

      {/* 暂停面板 */}
      <PausePanel />

      {/* 左下角：返回按钮 */}
      <button
        onClick={() => navigate('/')}
        className="absolute bottom-3 left-3 z-20 px-3 py-1.5 rounded text-xs font-body text-gray-400 bg-void-900/70 border border-gray-700 hover:text-neon-gold hover:border-neon-gold/50 transition-all"
      >
        ← 退出
      </button>

      {/* 右下角：暂停 + 玩法按钮 */}
      <div className="absolute bottom-3 right-3 z-20 flex items-center gap-2">
        <button
          onClick={() => togglePause()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-body text-neon-cyan bg-void-900/70 border border-neon-cyan/30 hover:bg-void-800 hover:border-neon-cyan/60 transition-all"
          title="暂停（ESC）"
        >
          <Pause className="w-3.5 h-3.5" />
          暂停
        </button>
        <button
          onClick={openTutorial}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-body text-neon-gold bg-void-900/70 border border-neon-gold/30 hover:bg-void-800 hover:border-neon-gold/60 transition-all"
          title="查看玩法说明"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          玩法
        </button>
      </div>
    </div>
  );
}
