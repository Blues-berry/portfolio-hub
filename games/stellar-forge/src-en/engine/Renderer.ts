// 星核熔炉 - Canvas 渲染器
import { GameState, Orb, Projectile, Particle } from '@/types/game';
import { ELEMENTS, TIER_SIZES } from '@/data/elements';
import { ENEMIES } from '@/data/enemies';
import { GRID_WIDTH, GRID_HEIGHT } from '@/types/game';
import { getSceneByWave, SceneConfig } from '@/data/scenes';

export const CELL_SIZE = 58;
export const GRID_PIXEL_W = GRID_WIDTH * CELL_SIZE;
export const GRID_PIXEL_H = GRID_HEIGHT * CELL_SIZE;
export const TRACK_WIDTH = 70;
export const CANVAS_W = GRID_PIXEL_W + TRACK_WIDTH + 20;
export const CANVAS_H = GRID_PIXEL_H + 20;
export const TRACK_X = GRID_PIXEL_W + 10;
export const TRACK_Y = 10;

// 星空背景星星
interface BgStar {
  x: number;
  y: number;
  r: number;
  twinkle: number;
  speed: number;
}

let bgStars: BgStar[] = [];

export function initStars() {
  bgStars = [];
  for (let i = 0; i < 80; i++) {
    bgStars.push({
      x: Math.random() * CANVAS_W,
      y: Math.random() * CANVAS_H,
      r: Math.random() * 1.5 + 0.3,
      twinkle: Math.random() * Math.PI * 2,
      speed: 0.5 + Math.random(),
    });
  }
}

// 绘制星空背景（基于场景）
function drawBackground(ctx: CanvasRenderingContext2D, time: number, scene: SceneConfig) {
  // 渐变底（使用场景配置）
  const grad = ctx.createRadialGradient(
    CANVAS_W / 2, CANVAS_H / 2, 0,
    CANVAS_W / 2, CANVAS_H / 2, CANVAS_W
  );
  grad.addColorStop(0, scene.bgGradient[0]);
  grad.addColorStop(0.6, scene.bgGradient[1]);
  grad.addColorStop(1, scene.bgGradient[2]);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  // 场景特有的远景光晕（呼吸感）
  const haloPulse = 0.5 + Math.sin(time * 0.0008) * 0.5;
  const haloGrad = ctx.createRadialGradient(
    CANVAS_W * 0.7, CANVAS_H * 0.3, 0,
    CANVAS_W * 0.7, CANVAS_H * 0.3, CANVAS_W * 0.6
  );
  haloGrad.addColorStop(0, scene.accentColor + Math.floor(20 + haloPulse * 20).toString(16).padStart(2, '0'));
  haloGrad.addColorStop(1, scene.accentColor + '00');
  ctx.fillStyle = haloGrad;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  // 星星（使用场景星色）
  for (const s of bgStars) {
    s.twinkle += 0.02;
    const alpha = 0.4 + Math.sin(s.twinkle) * 0.3;
    // 混合场景星色和白色
    ctx.fillStyle = scene.starColor + Math.floor(alpha * 255).toString(16).padStart(2, '0');
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();
    s.y += s.speed * 0.05;
    if (s.y > CANVAS_H) {
      s.y = 0;
      s.x = Math.random() * CANVAS_W;
    }
  }

  // 场景装饰：飘动的光点（增加氛围）
  for (let i = 0; i < 12; i++) {
    const t = time * 0.0005 + i * 0.7;
    const px = (Math.sin(t) * 0.5 + 0.5) * CANVAS_W;
    const py = ((time * 0.02 + i * 80) % CANVAS_H);
    const palpha = 0.2 + Math.sin(t * 2) * 0.15;
    ctx.fillStyle = scene.accentColor + Math.floor(palpha * 255).toString(16).padStart(2, '0');
    ctx.beginPath();
    ctx.arc(px, py, 1.5, 0, Math.PI * 2);
    ctx.fill();
  }
}

// 绘制网格（使用场景配色）
function drawGrid(ctx: CanvasRenderingContext2D, time: number, hoverCol: number, scene: SceneConfig) {
  const offsetX = 10;
  const offsetY = 10;

  // 网格背景
  ctx.fillStyle = 'rgba(11,11,31,0.6)';
  ctx.fillRect(offsetX, offsetY, GRID_PIXEL_W, GRID_PIXEL_H);

  // 边框（使用场景色）
  ctx.strokeStyle = scene.accentColor + '66';
  ctx.lineWidth = 2;
  ctx.strokeRect(offsetX, offsetY, GRID_PIXEL_W, GRID_PIXEL_H);

  // 列高亮
  if (hoverCol >= 0 && hoverCol < GRID_WIDTH) {
    const grad = ctx.createLinearGradient(0, offsetY, 0, offsetY + GRID_PIXEL_H);
    grad.addColorStop(0, scene.accentColor + '33');
    grad.addColorStop(1, scene.accentColor + '05');
    ctx.fillStyle = grad;
    ctx.fillRect(offsetX + hoverCol * CELL_SIZE, offsetY, CELL_SIZE, GRID_PIXEL_H);
  }

  // 网格线（使用场景色淡化）
  ctx.strokeStyle = scene.accentColor + '20';
  ctx.lineWidth = 1;
  for (let i = 1; i < GRID_WIDTH; i++) {
    ctx.beginPath();
    ctx.moveTo(offsetX + i * CELL_SIZE, offsetY);
    ctx.lineTo(offsetX + i * CELL_SIZE, offsetY + GRID_PIXEL_H);
    ctx.stroke();
  }
  for (let i = 1; i < GRID_HEIGHT; i++) {
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY + i * CELL_SIZE);
    ctx.lineTo(offsetX + GRID_PIXEL_W, offsetY + i * CELL_SIZE);
    ctx.stroke();
  }

  // 底部"核心"提示线（使用场景核心色）
  ctx.strokeStyle = scene.coreColor + '88';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([6, 4]);
  ctx.beginPath();
  ctx.moveTo(offsetX, offsetY + GRID_PIXEL_H);
  ctx.lineTo(offsetX + GRID_PIXEL_W, offsetY + GRID_PIXEL_H);
  ctx.stroke();
  ctx.setLineDash([]);
}

// 绘制共鸣连线
function drawSynergies(ctx: CanvasRenderingContext2D, state: GameState, time: number) {
  const offsetX = 10;
  const offsetY = 10;

  for (const syn of state.synergies) {
    if (syn.positions.length < 2) continue;
    const p1 = syn.positions[0];
    const p2 = syn.positions[1];
    const x1 = offsetX + p1.x * CELL_SIZE + CELL_SIZE / 2;
    const y1 = offsetY + p1.y * CELL_SIZE + CELL_SIZE / 2;
    const x2 = offsetX + p2.x * CELL_SIZE + CELL_SIZE / 2;
    const y2 = offsetY + p2.y * CELL_SIZE + CELL_SIZE / 2;

    const pulse = 0.5 + Math.sin(time * 0.005) * 0.5;
    ctx.strokeStyle = `rgba(255,209,102,${0.3 + pulse * 0.3})`;
    ctx.lineWidth = 2 + syn.level;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    // 标签
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;
    ctx.fillStyle = `rgba(255,209,102,${0.7 + pulse * 0.3})`;
    ctx.font = '10px Rajdhani';
    ctx.textAlign = 'center';
    ctx.fillText(syn.config.name, midX, midY - 8);
  }
}

// 绘制单颗星核
function drawOrb(ctx: CanvasRenderingContext2D, orb: Orb, time: number) {
  const offsetX = 10;
  const offsetY = 10;
  const cx = offsetX + orb.gridX * CELL_SIZE + CELL_SIZE / 2;
  const cy = offsetY + orb.gridY * CELL_SIZE + CELL_SIZE / 2;

  const elem = ELEMENTS[orb.element];
  const baseRadius = TIER_SIZES[orb.tier] / 2;
  const radius = Math.max(8, baseRadius);

  // 出生动画
  const age = time - orb.spawnTime;
  let scale = 1;
  if (age < 200) {
    scale = 0.5 + (age / 200) * 0.5;
  }
  // 融合动画
  if (orb.mergeAnimUntil && time < orb.mergeAnimUntil) {
    const t = (orb.mergeAnimUntil - time) / 300;
    scale *= 1 + t * 0.3;
  }

  const r = radius * scale;

  // 外发光
  const glowGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 2.2);
  glowGrad.addColorStop(0, elem.color + 'CC');
  glowGrad.addColorStop(0.5, elem.color + '44');
  glowGrad.addColorStop(1, elem.color + '00');
  ctx.fillStyle = glowGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, r * 2.2, 0, Math.PI * 2);
  ctx.fill();

  // 主体
  const bodyGrad = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.3, 0, cx, cy, r);
  bodyGrad.addColorStop(0, elem.glow);
  bodyGrad.addColorStop(0.6, elem.color);
  bodyGrad.addColorStop(1, elem.color + 'AA');
  ctx.fillStyle = bodyGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();

  // 高光
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.beginPath();
  ctx.arc(cx - r * 0.35, cy - r * 0.35, r * 0.25, 0, Math.PI * 2);
  ctx.fill();

  // 等级标识（小圆点）
  if (orb.tier >= 2) {
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    for (let i = 0; i < orb.tier; i++) {
      const a = (Math.PI * 2 * i) / Math.max(1, orb.tier) - Math.PI / 2;
      ctx.beginPath();
      ctx.arc(cx + Math.cos(a) * (r + 4), cy + Math.sin(a) * (r + 4), 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // 进化标识
  if (orb.evolution) {
    const evBranch = elem.evolution.branches.find(b => b.id === orb.evolution);
    if (evBranch) {
      ctx.strokeStyle = evBranch.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy, r + 3, 0, Math.PI * 2);
      ctx.stroke();

      // 进化符号
      ctx.fillStyle = evBranch.color;
      ctx.font = `bold ${Math.floor(r * 0.6)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('★', cx, cy);
    }
  } else {
    // 元素符号
    ctx.font = `${Math.floor(r * 0.9)}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(elem.symbol, cx, cy + 1);
  }
}

// 绘制敌人
function drawEnemies(ctx: CanvasRenderingContext2D, state: GameState, time: number) {
  for (const enemy of state.enemies) {
    const cfg = ENEMIES[enemy.type];
    const x = TRACK_X + TRACK_WIDTH / 2;
    const y = TRACK_Y + 10 + enemy.position * (GRID_PIXEL_H - 20);

    // 受击闪烁
    let color = cfg.color;
    if (enemy.hitFlash > 0) {
      color = '#FFFFFF';
    }

    // 减速效果
    const isFrozen = enemy.effects.some(e => e.type === 'freeze');
    const isSlowed = enemy.effects.some(e => e.type === 'slow');

    // 治疗光环（healer 类型）
    if (cfg.healAura) {
      const haloR = (cfg.healRadius || 0.12) * GRID_PIXEL_H;
      const haloGrad = ctx.createRadialGradient(x, y, 0, x, y, haloR);
      const pulse = 0.5 + Math.sin(time * 0.004) * 0.5;
      haloGrad.addColorStop(0, `rgba(39,174,96,${0.05 + pulse * 0.1})`);
      haloGrad.addColorStop(0.7, `rgba(39,174,96,${0.02 + pulse * 0.05})`);
      haloGrad.addColorStop(1, 'rgba(39,174,96,0)');
      ctx.fillStyle = haloGrad;
      ctx.beginPath();
      ctx.arc(x, y, haloR, 0, Math.PI * 2);
      ctx.fill();
      // 治疗光环虚线
      ctx.strokeStyle = `rgba(39,174,96,${0.3 + pulse * 0.3})`;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 6]);
      ctx.beginPath();
      ctx.arc(x, y, haloR, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // 外发光（让敌人更显眼）
    const glowR = cfg.size + 6;
    const glowGrad = ctx.createRadialGradient(x, y, 0, x, y, glowR);
    glowGrad.addColorStop(0, color + 'AA');
    glowGrad.addColorStop(0.5, color + '44');
    glowGrad.addColorStop(1, color + '00');
    ctx.fillStyle = glowGrad;
    ctx.beginPath();
    ctx.arc(x, y, glowR, 0, Math.PI * 2);
    ctx.fill();

    // 阴影
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.beginPath();
    ctx.ellipse(x, y + cfg.size / 2 + 3, cfg.size / 2, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // 主体
    if (enemy.type === 'boss') {
      // Boss: 多边形
      ctx.fillStyle = color;
      ctx.beginPath();
      const sides = 8;
      for (let i = 0; i < sides; i++) {
        const a = (Math.PI * 2 * i) / sides + time * 0.001;
        const px = x + Math.cos(a) * cfg.size;
        const py = y + Math.sin(a) * cfg.size;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#FFD166';
      ctx.lineWidth = 2;
      ctx.stroke();
    } else if (enemy.type === 'flyer') {
      // 飞行：三角
      ctx.fillStyle = color;
      const wing = Math.sin(time * 0.01) * 3;
      ctx.beginPath();
      ctx.moveTo(x, y - cfg.size);
      ctx.lineTo(x - cfg.size + wing, y + cfg.size / 2);
      ctx.lineTo(x + cfg.size - wing, y + cfg.size / 2);
      ctx.closePath();
      ctx.fill();
    } else if (enemy.type === 'swarm') {
      // 虫群：多个小圆点聚集
      ctx.fillStyle = color;
      for (let i = 0; i < 4; i++) {
        const a = (Math.PI * 2 * i) / 4 + time * 0.005;
        const r = 4 + Math.sin(time * 0.008 + i) * 1.5;
        const px = x + Math.cos(a) * r;
        const py = y + Math.sin(a) * r;
        ctx.beginPath();
        ctx.arc(px, py, cfg.size / 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
      // 中心点
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(x, y, 1.5, 0, Math.PI * 2);
      ctx.fill();
    } else if (enemy.type === 'healer') {
      // 治疗：菱形带十字
      const bodyGrad = ctx.createRadialGradient(x, y, 0, x, y, cfg.size / 2);
      bodyGrad.addColorStop(0, '#FFFFFF');
      bodyGrad.addColorStop(0.5, color);
      bodyGrad.addColorStop(1, color + 'AA');
      ctx.fillStyle = bodyGrad;
      ctx.beginPath();
      ctx.moveTo(x, y - cfg.size / 2);
      ctx.lineTo(x + cfg.size / 2, y);
      ctx.lineTo(x, y + cfg.size / 2);
      ctx.lineTo(x - cfg.size / 2, y);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      // 十字标记
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x - 4, y);
      ctx.lineTo(x + 4, y);
      ctx.moveTo(x, y - 4);
      ctx.lineTo(x, y + 4);
      ctx.stroke();
    } else if (enemy.type === 'rift') {
      // 裂隙者：扭曲的椭圆 + 周围旋转的符文
      const phase = time * 0.003;
      // 扭曲主体
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.ellipse(x, y, cfg.size / 2, cfg.size / 2 * 0.7, phase, 0, Math.PI * 2);
      ctx.fill();
      // 裂隙线
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1;
      for (let i = 0; i < 3; i++) {
        const a = phase + (i * Math.PI * 2) / 3;
        ctx.beginPath();
        ctx.moveTo(x + Math.cos(a) * 2, y + Math.sin(a) * 2);
        ctx.lineTo(x + Math.cos(a) * cfg.size / 2, y + Math.sin(a) * cfg.size / 2 * 0.7);
        ctx.stroke();
      }
      // 旋转符文
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([2, 4]);
      ctx.beginPath();
      ctx.arc(x, y, cfg.size / 2 + 5, phase, phase + Math.PI * 1.5);
      ctx.stroke();
      ctx.setLineDash([]);
    } else if (enemy.type === 'corrupt') {
      // 腐化星核：黑色主体 + 红色裂纹
      const bodyGrad = ctx.createRadialGradient(x, y, 0, x, y, cfg.size / 2);
      bodyGrad.addColorStop(0, '#3A0A0A');
      bodyGrad.addColorStop(0.5, color);
      bodyGrad.addColorStop(1, '#000000');
      ctx.fillStyle = bodyGrad;
      ctx.beginPath();
      ctx.arc(x, y, cfg.size / 2, 0, Math.PI * 2);
      ctx.fill();
      // 裂纹（红线）
      ctx.strokeStyle = '#FF3333';
      ctx.lineWidth = 1.2;
      const crackSeed = enemy.id.charCodeAt(0) || 1;
      for (let i = 0; i < 4; i++) {
        const a = (crackSeed + i * 91) % 360 * Math.PI / 180;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + Math.cos(a) * cfg.size / 2, y + Math.sin(a) * cfg.size / 2);
        ctx.stroke();
      }
      // 外圈腐化光环
      ctx.strokeStyle = '#FF000066';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(x, y, cfg.size / 2 + 3, 0, Math.PI * 2);
      ctx.stroke();
    } else if (enemy.type === 'reaper') {
      // 收割者：镰刀形状 + 残影
      // 残影
      ctx.fillStyle = color + '33';
      for (let i = 1; i <= 2; i++) {
        ctx.beginPath();
        ctx.arc(x, y - i * 4, cfg.size / 2 - i, 0, Math.PI * 2);
        ctx.fill();
      }
      // 主体（尖刺圆）
      const bodyGrad = ctx.createRadialGradient(x, y, 0, x, y, cfg.size / 2);
      bodyGrad.addColorStop(0, '#FFFFFF');
      bodyGrad.addColorStop(0.4, color);
      bodyGrad.addColorStop(1, color);
      ctx.fillStyle = bodyGrad;
      ctx.beginPath();
      const spikes = 6;
      for (let i = 0; i < spikes * 2; i++) {
        const a = (Math.PI * 2 * i) / (spikes * 2) + time * 0.008;
        const r = i % 2 === 0 ? cfg.size / 2 : cfg.size / 3;
        const px = x + Math.cos(a) * r;
        const py = y + Math.sin(a) * r;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
      // 镰刀
      const scytheAngle = time * 0.012;
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, cfg.size / 2 + 4, scytheAngle, scytheAngle + Math.PI * 0.8);
      ctx.stroke();
    } else if (enemy.type === 'maiden') {
      // 堕落少女 Boss：复合形态
      // 外圈黑暗光环
      const darkGrad = ctx.createRadialGradient(x, y, 0, x, y, cfg.size);
      darkGrad.addColorStop(0, color + 'CC');
      darkGrad.addColorStop(0.5, color + '66');
      darkGrad.addColorStop(1, '#000000');
      ctx.fillStyle = darkGrad;
      ctx.beginPath();
      ctx.arc(x, y, cfg.size, 0, Math.PI * 2);
      ctx.fill();
      // 旋转的多边形护盾
      ctx.strokeStyle = '#FFD166';
      ctx.lineWidth = 1.5;
      for (let layer = 0; layer < 2; layer++) {
        ctx.beginPath();
        const sides = 6;
        const layerR = cfg.size * (0.7 + layer * 0.15);
        const layerAngle = time * (0.001 + layer * 0.0007) + layer;
        for (let i = 0; i < sides; i++) {
          const a = (Math.PI * 2 * i) / sides + layerAngle;
          const px = x + Math.cos(a) * layerR;
          const py = y + Math.sin(a) * layerR;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();
      }
      // 主体（少女轮廓圆）
      const bodyGrad = ctx.createRadialGradient(x - 4, y - 4, 0, x, y, cfg.size / 2);
      bodyGrad.addColorStop(0, '#FFFFFF');
      bodyGrad.addColorStop(0.4, color);
      bodyGrad.addColorStop(1, '#330000');
      ctx.fillStyle = bodyGrad;
      ctx.beginPath();
      ctx.arc(x, y, cfg.size / 2, 0, Math.PI * 2);
      ctx.fill();
      // "泪痕"
      ctx.strokeStyle = '#FF66CC';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x - 5, y - 3);
      ctx.lineTo(x - 5, y + 6);
      ctx.moveTo(x + 5, y - 3);
      ctx.lineTo(x + 5, y + 6);
      ctx.stroke();
    } else {
      // 普通：圆形（带渐变让它更立体）
      const bodyGrad = ctx.createRadialGradient(x - cfg.size / 4, y - cfg.size / 4, 0, x, y, cfg.size / 2);
      bodyGrad.addColorStop(0, '#FFFFFF');
      bodyGrad.addColorStop(0.3, color);
      bodyGrad.addColorStop(1, color);
      ctx.fillStyle = bodyGrad;
      ctx.beginPath();
      ctx.arc(x, y, cfg.size / 2, 0, Math.PI * 2);
      ctx.fill();
      // 高亮边缘
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(x, y, cfg.size / 2, 0, Math.PI * 2);
      ctx.stroke();
    }

    // 眼睛（让敌人更有"生命感"，虫群/Boss/裂隙者/腐化/收割者/堕落少女除外）
    if (enemy.type !== 'boss' && enemy.type !== 'swarm' &&
        enemy.type !== 'rift' && enemy.type !== 'corrupt' &&
        enemy.type !== 'reaper' && enemy.type !== 'maiden') {
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(x - 3, y - 2, 2, 0, Math.PI * 2);
      ctx.arc(x + 3, y - 2, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(x - 3, y - 2, 1, 0, Math.PI * 2);
      ctx.arc(x + 3, y - 2, 1, 0, Math.PI * 2);
      ctx.fill();
    }

    // 减速光环
    if (isSlowed) {
      ctx.strokeStyle = 'rgba(78,205,196,0.7)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, cfg.size / 2 + 4, 0, Math.PI * 2);
      ctx.stroke();
    }
    if (isFrozen) {
      // 冰封覆盖（半透明蓝色）
      ctx.fillStyle = 'rgba(168,230,255,0.5)';
      ctx.beginPath();
      ctx.arc(x, y, cfg.size / 2 + 2, 0, Math.PI * 2);
      ctx.fill();
      // 冰晶外环
      ctx.strokeStyle = 'rgba(127,229,221,0.9)';
      ctx.lineWidth = 2;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.arc(x, y, cfg.size / 2 + 5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      // 冰晶六角形装饰
      ctx.strokeStyle = 'rgba(255,255,255,0.6)';
      ctx.lineWidth = 1;
      const crystalR = cfg.size / 3;
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI * 2 * i) / 6 + time * 0.001;
        const px = x + Math.cos(a) * crystalR;
        const py = y + Math.sin(a) * crystalR;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.stroke();
    }

    // HP 条
    const hpRatio = enemy.hp / enemy.maxHp;
    const barW = cfg.size + 10;
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillRect(x - barW / 2, y - cfg.size / 2 - 10, barW, 4);
    ctx.fillStyle = hpRatio > 0.5 ? '#4ECDC4' : hpRatio > 0.25 ? '#FFD166' : '#FF6B6B';
    ctx.fillRect(x - barW / 2 + 1, y - cfg.size / 2 - 9, (barW - 2) * hpRatio, 2);
  }
}

// 绘制投射物
function drawProjectiles(ctx: CanvasRenderingContext2D, projectiles: Projectile[]) {
  for (const p of projectiles) {
    // 拖尾
    ctx.fillStyle = p.color + '66';
    ctx.beginPath();
    ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
    ctx.fill();

    // 主体
    const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 4);
    grad.addColorStop(0, '#FFFFFF');
    grad.addColorStop(0.5, p.color);
    grad.addColorStop(1, p.color + '00');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
    ctx.fill();
  }
}

// 绘制粒子
function drawParticles(ctx: CanvasRenderingContext2D, particles: Particle[]) {
  for (const p of particles) {
    const alpha = p.life / p.maxLife;
    if (p.kind === 'damage-text') {
      const isCrit = p.color === '#FFD166' || (p.text || '').includes('!');
      ctx.save();
      ctx.globalAlpha = alpha;

      // 暴击：放大 + 旋转动画 + 描边
      if (isCrit) {
        const scaleAnim = 1 + (1 - alpha) * 0.3; // 末尾稍微放大
        ctx.translate(p.x, p.y);
        ctx.scale(scaleAnim, scaleAnim);
        ctx.font = `bold ${p.size}px Rajdhani`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // 金色发光
        ctx.shadowColor = '#FFD166';
        ctx.shadowBlur = 12;
        ctx.fillStyle = '#FFE66D';
        ctx.fillText(p.text || '', 0, 0);

        // 黑色描边（提高可读性）
        ctx.shadowBlur = 0;
        ctx.strokeStyle = 'rgba(0,0,0,0.9)';
        ctx.lineWidth = 2;
        ctx.strokeText(p.text || '', 0, 0);

        // 重新填充
        ctx.fillStyle = '#FFD166';
        ctx.fillText(p.text || '', 0, 0);
      } else {
        // 普通伤害：白色 + 黑色描边
        ctx.font = `bold ${p.size}px Rajdhani`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.strokeStyle = 'rgba(0,0,0,0.9)';
        ctx.lineWidth = 2;
        ctx.strokeText(p.text || '', p.x, p.y);
        ctx.fillStyle = p.color;
        ctx.fillText(p.text || '', p.x, p.y);
      }
      ctx.restore();
    } else {
      ctx.fillStyle = p.color;
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }
}

// 绘制敌人接近终点的轨道警告
function drawDangerWarning(ctx: CanvasRenderingContext2D, state: GameState, time: number) {
  // 检查是否有敌人接近终点（position > 0.7）
  const dangerEnemies = state.enemies.filter(e => e.position > 0.7);
  if (dangerEnemies.length === 0) return;

  // 闪烁强度（基于最危险的敌人）
  const maxPos = Math.max(...dangerEnemies.map(e => e.position));
  const dangerLevel = (maxPos - 0.7) / 0.3; // 0~1
  const pulse = 0.5 + Math.sin(time * 0.015) * 0.5;
  const alpha = (0.15 + dangerLevel * 0.35) * (0.5 + pulse * 0.5);

  // 危险区域高亮（轨道底部 30%）
  const dangerY = TRACK_Y + GRID_PIXEL_H * 0.7;
  const dangerH = GRID_PIXEL_H * 0.3;
  const grad = ctx.createLinearGradient(0, dangerY, 0, dangerY + dangerH);
  grad.addColorStop(0, `rgba(255,107,107,0)`);
  grad.addColorStop(1, `rgba(255,30,30,${alpha})`);
  ctx.fillStyle = grad;
  ctx.fillRect(TRACK_X, dangerY, TRACK_WIDTH, dangerH);

  // 警告边框闪烁
  if (dangerLevel > 0.5) {
    ctx.strokeStyle = `rgba(255,30,30,${alpha * 1.5})`;
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 4]);
    ctx.lineDashOffset = -time * 0.05;
    ctx.strokeRect(TRACK_X, dangerY, TRACK_WIDTH, dangerH);
    ctx.setLineDash([]);
  }

  // CORE 顶部警示三角
  if (dangerLevel > 0.7) {
    const coreY = TRACK_Y + GRID_PIXEL_H - 10;
    ctx.fillStyle = `rgba(255,30,30,${alpha * 1.5})`;
    ctx.beginPath();
    ctx.moveTo(TRACK_X + TRACK_WIDTH / 2 - 6, coreY + 4);
    ctx.lineTo(TRACK_X + TRACK_WIDTH / 2 + 6, coreY + 4);
    ctx.lineTo(TRACK_X + TRACK_WIDTH / 2, coreY - 4);
    ctx.closePath();
    ctx.fill();
  }
}

// 绘制敌人轨道（使用场景轨道色）
function drawTrack(ctx: CanvasRenderingContext2D, time: number, scene: SceneConfig) {
  ctx.fillStyle = 'rgba(11,11,31,0.6)';
  ctx.fillRect(TRACK_X, TRACK_Y, TRACK_WIDTH, GRID_PIXEL_H);

  ctx.strokeStyle = scene.trackColor + '88';
  ctx.lineWidth = 2;
  ctx.strokeRect(TRACK_X, TRACK_Y, TRACK_WIDTH, GRID_PIXEL_H);

  // 轨道刻度（使用场景轨道色）
  ctx.strokeStyle = scene.trackColor + '33';
  ctx.lineWidth = 1;
  for (let i = 1; i < 10; i++) {
    const y = TRACK_Y + (i / 10) * GRID_PIXEL_H;
    ctx.beginPath();
    ctx.moveTo(TRACK_X + 5, y);
    ctx.lineTo(TRACK_X + TRACK_WIDTH - 5, y);
    ctx.stroke();
  }

  // 终点（核心，使用场景核心色）
  const pulse = 0.5 + Math.sin(time * 0.005) * 0.5;
  ctx.fillStyle = scene.coreColor + '22';
  ctx.fillRect(TRACK_X + 2, TRACK_Y + GRID_PIXEL_H - 26, TRACK_WIDTH - 4, 24);
  ctx.strokeStyle = scene.coreColor + '99';
  ctx.beginPath();
  ctx.moveTo(TRACK_X + 2, TRACK_Y + GRID_PIXEL_H - 26);
  ctx.lineTo(TRACK_X + TRACK_WIDTH - 2, TRACK_Y + GRID_PIXEL_H - 26);
  ctx.stroke();
  ctx.fillStyle = scene.coreColor + Math.floor((0.6 + pulse * 0.4) * 255).toString(16).padStart(2, '0');
  ctx.font = 'bold 14px Orbitron';
  ctx.textAlign = 'center';
  ctx.fillText('CORE', TRACK_X + TRACK_WIDTH / 2, TRACK_Y + GRID_PIXEL_H - 10);

  // 轨道流光（增加动态感）
  const flowY = (time * 0.05) % GRID_PIXEL_H;
  const flowGrad = ctx.createLinearGradient(0, TRACK_Y + flowY - 20, 0, TRACK_Y + flowY + 20);
  flowGrad.addColorStop(0, scene.trackColor + '00');
  flowGrad.addColorStop(0.5, scene.trackColor + '44');
  flowGrad.addColorStop(1, scene.trackColor + '00');
  ctx.fillStyle = flowGrad;
  ctx.fillRect(TRACK_X + 2, TRACK_Y + flowY - 20, TRACK_WIDTH - 4, 40);
}

// 主渲染函数
export function render(
  ctx: CanvasRenderingContext2D,
  state: GameState,
  time: number,
  hoverCol: number
) {
  // 屏幕震动
  ctx.save();
  if (state.screenShake > 0) {
    const sx = (Math.random() - 0.5) * state.screenShake * 8;
    const sy = (Math.random() - 0.5) * state.screenShake * 8;
    ctx.translate(sx, sy);
  }

  // 获取当前场景
  const scene = getSceneByWave(state.wave || 1);

  drawBackground(ctx, time, scene);
  drawGrid(ctx, time, hoverCol, scene);
  drawSynergies(ctx, state, time);
  drawTrack(ctx, time, scene);
  // 敌人接近终点的轨道警告闪烁
  drawDangerWarning(ctx, state, time);

  // 星核
  for (let y = 0; y < GRID_HEIGHT; y++) {
    for (let x = 0; x < GRID_WIDTH; x++) {
      const orb = state.grid[y][x];
      if (orb) drawOrb(ctx, orb, time);
    }
  }

  drawEnemies(ctx, state, time);
  drawProjectiles(ctx, state.projectiles);
  drawParticles(ctx, state.particles);

  ctx.restore();
}
