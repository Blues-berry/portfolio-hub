import { useRef, useEffect, useCallback, useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { render, initStars, CANVAS_W, CANVAS_H, CELL_SIZE } from '@/engine/Renderer';
import { GRID_WIDTH } from '@/types/game';

interface GameCanvasProps {
  onCanvasReady?: () => void;
  recycleMode: boolean;
  onRecycle: () => void;
}

interface Flash {
  col: number;
  id: number;
}

export default function GameCanvas({ onCanvasReady, recycleMode, onRecycle }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hoverColRef = useRef<number>(-1);
  const [scale, setScale] = useState(1);
  const [flashes, setFlashes] = useState<Flash[]>([]);

  // 处理画布尺寸自适应
  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const sx = rect.width / CANVAS_W;
      const sy = rect.height / CANVAS_H;
      setScale(Math.min(sx, sy, 1.2));
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 初始化星星
  useEffect(() => {
    initStars();
    onCanvasReady?.();
  }, [onCanvasReady]);

  // 游戏循环
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let lastTime = performance.now();

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;

      // 更新状态
      useGameStore.getState().tick(dt, now);

      // 渲染
      const state = useGameStore.getState();
      render(ctx, state, now, hoverColRef.current);

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  // 计算列：x 为 canvas 坐标，clamp 到 [0, 5]
  const colFromX = (x: number) => {
    const raw = Math.floor((x - 10) / CELL_SIZE);
    if (raw < 0) return 0;
    if (raw > GRID_WIDTH - 1) return GRID_WIDTH - 1;
    return raw;
  };

  // 投放并触发视觉反馈
  const dropWithFeedback = useCallback((col: number) => {
    if (recycleMode) {
      if (useGameStore.getState().recycleOrb(col)) onRecycle();
      return;
    }
    const before = useGameStore.getState().deploymentCharge;
    useGameStore.getState().dropOrb(col);
    if (useGameStore.getState().deploymentCharge === before) return;
    const id = Date.now() + Math.random();
    setFlashes(prev => [...prev, { col, id }]);
    // 250ms 后移除
    setTimeout(() => {
      setFlashes(prev => prev.filter(f => f.id !== id));
    }, 250);
  }, [recycleMode, onRecycle]);

  // 点击投放（点击 canvas 任意位置都会找到最近列）
  const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * CANVAS_W;
    const col = colFromX(x);
    dropWithFeedback(col);
  }, [dropWithFeedback]);

  // 触摸支持
  const handleTouch = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const touch = e.touches[0] || e.changedTouches[0];
    if (!touch) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((touch.clientX - rect.left) / rect.width) * CANVAS_W;
    const col = colFromX(x);
    dropWithFeedback(col);
  }, [dropWithFeedback]);

  // hover
  const handleMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * CANVAS_W;
    const col = colFromX(x);
    hoverColRef.current = col;
  }, []);

  const handleLeave = useCallback(() => {
    hoverColRef.current = -1;
  }, []);

  // 键盘 1-6 快速投放
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const key = e.key;
      if (key >= '1' && key <= '6') {
        const col = parseInt(key, 10) - 1;
        dropWithFeedback(col);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [dropWithFeedback]);

  // 计算 canvas 在容器中的偏移（用于闪光定位）
  const canvasW = CANVAS_W * scale;
  const canvasH = CANVAS_H * scale;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center"
    >
      <canvas
        ref={canvasRef}
        width={CANVAS_W}
        height={CANVAS_H}
        onClick={handleClick}
        onTouchEnd={handleTouch}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
          cursor: 'pointer',
          imageRendering: 'auto',
          boxShadow: '0 0 60px rgba(255,209,102,0.15)',
          borderRadius: 8,
        }}
        className="bg-void-900"
      />
      {/* 点击列闪光提示（短暂） */}
      {flashes.map(f => (
        <div
          key={f.id}
          className="pointer-events-none absolute"
          style={{
            left: `calc(50% - ${canvasW / 2}px + ${(10 + f.col * CELL_SIZE) * scale}px)`,
            top: `calc(50% - ${canvasH / 2}px)`,
            width: `${CELL_SIZE * scale}px`,
            height: `${canvasH}px`,
            background: 'linear-gradient(to bottom, rgba(255,209,102,0.35), rgba(255,209,102,0))',
            animation: 'sf-fade 250ms ease-out forwards',
          }}
        />
      ))}
      {/* 操作提示 */}
      <div className="absolute bottom-1 left-1/2 hidden -translate-x-1/2 text-[10px] text-gray-500 font-body pointer-events-none whitespace-nowrap sm:block">
        点击网格投放星核 · 键盘 1-6 快速投放
      </div>
      <style>{`
        @keyframes sf-fade {
          from { opacity: 1; }
          to { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
