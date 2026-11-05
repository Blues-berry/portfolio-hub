import { create } from 'zustand';
import {
  GameState,
  Orb,
  Enemy,
  EnemyType,
  Particle,
  ElementType,
  Relic,
  ShopItem,
  EvolutionId,
  GRID_WIDTH,
  GRID_HEIGHT,
  EVOLUTION_TIER,
  STARTING_HP,
} from '@/types/game';
import { ELEMENTS, getOrbDamage, getOrbAttackInterval, getOrbRange } from '@/data/elements';
import { ENEMIES, scaleEnemyHp, scaleEnemySpeed, scaleReward } from '@/data/enemies';
import { FINAL_WAVE, generateWave } from '@/data/waves';
import { rollRelics, RELICS } from '@/data/relics';
import { findSynergy, synergyKey } from '@/data/synergies';
import { getStartConfig, useMetaStore } from './metaStore';
import { sfx } from '@/engine/sound';
import { getSceneChangeWave } from '@/data/scenes';
import {
  MAIDENS,
  MONSTERS,
  getMonsterByWave,
  MAIDEN_VISIT_WAVES,
  MAIDEN_PACT_WAVES,
  pickMaidenByElements,
  MaidenId,
  MonsterId,
} from '@/data/story';
import { shouldTriggerEvent, rollWaveEvent } from '@/data/events';
import { SKILLS, SKILL_IDS, SkillId, MAX_ENERGY, getKillEnergy } from '@/data/skills';
import { useAchievementStore } from './achievementStore';
import { useCodexStore } from './codexStore';
import { useRuneStore } from './runeStore';
import { rollRune, RuneEffectType } from '@/data/runes';
import { computeActiveBonds, getGlobalBondEffect, getElementBondEffect } from '@/data/bonds';
import { getTalentEffectSum, hasTalentEffect, TalentEffect } from '@/data/talents';
import { getTodayChallenge, getChallengeFlags, ChallengeModifierFlags } from '@/data/dailyChallenge';

// ID 生成
let _id = 0;
const uid = (prefix = 'x') => `${prefix}_${Date.now()}_${_id++}`;

// 羁绊系统重算节流累加器（每 500ms 重算一次 activeBonds）
let bondRecalcAccum = 0;

// 获取当前挑战的 flags 合并（普通模式返回空对象）
function getChallengeFlagsSafe(state: GameState): ChallengeModifierFlags {
  if (!state.currentChallenge) return {};
  return getChallengeFlags(state.currentChallenge);
}

// 累计所有已装备符文中某种效果的总值
function getRuneEffectSum(state: GameState, type: RuneEffectType): number {
  let sum = 0;
  for (const rune of state.activeRunes) {
    for (const effect of rune.effects) {
      if (effect.type === type) sum += effect.value;
    }
  }
  return sum;
}

// 检查是否装备了某类型符文（用于触发型效果，如吸血）
function hasRuneEffect(state: GameState, type: RuneEffectType): boolean {
  for (const rune of state.activeRunes) {
    if (rune.effects.some(e => e.type === type)) return true;
  }
  return false;
}

// 创建空网格 [y][x]
function createEmptyGrid(): (Orb | null)[][] {
  return Array.from({ length: GRID_HEIGHT }, () => Array(GRID_WIDTH).fill(null));
}

// 随机元素
function randomElement(available: ElementType[]): ElementType {
  return available[Math.floor(Math.random() * available.length)];
}

interface GameStore extends GameState {
  // 初始化
  initGame: () => void;
  startNewRun: () => void;
  startDailyChallenge: () => void;     // 启动日常挑战模式
  // 操作
  dropOrb: (col: number) => void;
  selectRelic: (relic: Relic) => void;
  selectEvolution: (orbId: string, branchId: EvolutionId) => void;
  buyShopItem: (itemId: string) => void;
  rerollShop: () => void;
  closeShop: () => void;
  startNextWave: () => void;
  // 系统更新（由引擎调用）
  tick: (dt: number, now: number) => void;
  // 状态变更
  setCurrentElement: (el: ElementType) => void;
  togglePause: () => void;                          // 切换暂停状态
  activateSkill: (skillId: SkillId) => void;        // 释放主动技能
  // 剧情系统
  advanceStory: () => void;                                   // 推进剧情到下一阶段
  giftMaiden: (maidenId: string) => void;                     // 给少女礼物（消耗星尘增加好感度）
  acceptMonsterPact: () => void;                              // 接受怪兽契约
  rejectMonsterPact: () => void;                              // 拒绝怪兽契约
  // 结算
  endRun: () => { wave: number; score: number; kills: number; stardust: number };
}

function createInitialState(): GameState {
  return {
    grid: createEmptyGrid(),
    enemies: [],
    projectiles: [],
    particles: [],
    synergies: [],
    wave: 0,
    hp: STARTING_HP,
    maxHp: STARTING_HP,
    stardust: 0,
    currentElement: 'fire',
    availableElements: ['fire'],
    status: 'wave-intro',
    shopItems: [],
    relicChoices: null,
    pendingEvolution: null,
    ownedRelics: [],
    rerollsLeft: 1,
    killCount: 0,
    startTime: performance.now(),
    score: 0,
    comboTimer: 0,
    combo: 0,
    screenShake: 0,
    waveStartTime: 0,
    // 剧情系统初始化
    currentScene: 'void-gate',
    pendingStory: null,
    maidenAffinity: {},
    seenMaidens: [],
    corruption: 0,
    currentMaidenId: null,
    currentMonsterId: null,
    // 暂停系统
    prevStatus: null,
    // 波次结算系统
    waveClearTime: 0,
    waveStartKillCount: 0,
    waveStartStardust: 0,
    // 随机事件系统
    currentEvent: null,
    eventTimer: 0,
    // 主动技能系统
    energy: 0,
    deploymentCharge: 6,
    skillCooldowns: { meteor: 0, 'time-freeze': 0, 'elemental-storm': 0 },
    // 成就追踪（本局）
    bestCombo: 0,
    runSkillUses: [],
    hpLostInRun: 0,
    // 日常挑战
    currentChallenge: null,
    // 符文系统：本局装备的符文（startNewRun 时从 runeStore 同步）
    activeRunes: [],
    // 羁绊系统：当前激活的羁绊列表（tick 中节流重算）
    activeBonds: [],
    // 天赋系统：本局生效的已解锁天赋（startNewRun 时从 metaStore 同步）
    unlockedTalents: [],
  };
}

// ============= 系统：融合 =============
// 查找可融合的相邻同元素同等级星核
function findMerges(grid: (Orb | null)[][]): { a: Orb; b: Orb }[] {
  const merges: { a: Orb; b: Orb }[] = [];
  const visited = new Set<string>();

  for (let y = 0; y < GRID_HEIGHT; y++) {
    for (let x = 0; x < GRID_WIDTH; x++) {
      const orb = grid[y][x];
      if (!orb || visited.has(orb.id)) continue;

      // 检查右、下方向
      const neighbors = [
        { x: x + 1, y },
        { x, y: y + 1 },
      ];

      for (const n of neighbors) {
        if (n.x >= GRID_WIDTH || n.y >= GRID_HEIGHT) continue;
        const other = grid[n.y][n.x];
        if (!other || visited.has(other.id)) continue;

        // 同元素、同等级、未进化 或 同进化
        if (
          orb.element === other.element &&
          orb.tier === other.tier &&
          orb.evolution === other.evolution &&
          orb.tier < 5
        ) {
          merges.push({ a: orb, b: other });
          visited.add(orb.id);
          visited.add(other.id);
          break;
        }
      }
    }
  }
  return merges;
}

// 处理融合：返回是否发生融合及新粒子
function processMerges(state: GameState, now: number): { merged: boolean; particles: Particle[] } {
  const particles: Particle[] = [];
  let merged = false;

  // 重复处理直到没有可融合
  let iterations = 0;
  while (iterations++ < 10) {
    const merges = findMerges(state.grid);
    if (merges.length === 0) break;

    for (const { a, b } of merges) {
      // 选择保留位置（取平均位置作为新位置）
      const newX = Math.min(a.gridX, b.gridX);
      const newY = Math.max(a.gridY, b.gridY);

      // 检查是否需要进化选择
      const newTier = a.tier + 1;
      const needsEvolution = newTier === EVOLUTION_TIER;

      const newOrb: Orb = {
        id: uid('orb'),
        element: a.element,
        tier: newTier,
        gridX: newX,
        gridY: newY,
        cooldown: 0,
        attackInterval: getOrbAttackInterval(a.element, newTier, a.evolution),
        lastAttack: now,
        spawnTime: now,
        mergeAnimUntil: now + 300,
      };

      // 清除旧位置
      state.grid[a.gridY][a.gridX] = null;
      state.grid[b.gridY][b.gridX] = null;
      // 放置新位置
      state.grid[newY][newX] = newOrb;

      // 粒子特效
      const px = 10 + newX * 58 + 29;
      const py = 10 + newY * 58 + 29;
      for (let i = 0; i < 12; i++) {
        const angle = (Math.PI * 2 * i) / 12;
        particles.push({
          id: uid('p'),
          x: px,
          y: py,
          vx: Math.cos(angle) * 80,
          vy: Math.sin(angle) * 80,
          life: 0.6,
          maxLife: 0.6,
          size: 4,
          color: ELEMENTS[a.element].color,
          kind: 'merge',
        });
      }

      // 星核分裂器遗物：每次融合 20% 概率额外产出 1 颗同元素 tier 1 星核
      const hasSplitter = state.ownedRelics.some(r => r.id === 'orb-splitter');
      if (hasSplitter && Math.random() < 0.2) {
        // 在网格中找第一个空位（从下到上、左到右扫描）
        outer: for (let yy = GRID_HEIGHT - 1; yy >= 0; yy--) {
          for (let xx = 0; xx < GRID_WIDTH; xx++) {
            if (!state.grid[yy][xx]) {
              state.grid[yy][xx] = {
                id: uid('orb'),
                element: a.element,
                tier: 1,
                gridX: xx,
                gridY: yy,
                cooldown: 0,
                attackInterval: getOrbAttackInterval(a.element, 1),
                lastAttack: now,
                spawnTime: now,
              };
              break outer;
            }
          }
        }
      }

      merged = true;
      sfx.merge();

      // 触发进化选择
      if (needsEvolution && ELEMENTS[a.element].evolution.branches.length > 0) {
        state.pendingEvolution = {
          orbId: newOrb.id,
          branches: ELEMENTS[a.element].evolution.branches,
        };
        state.status = 'evolution-select';
        return { merged, particles };
      }
    }
  }

  return { merged, particles };
}

// ============= 系统：敌人波次 =============
interface WaveSpawnState {
  spawnsLeft: { type: EnemyType; count: number; delay: number; interval: number }[];
  lastSpawn: number;
}

let waveSpawnState: WaveSpawnState | null = null;

function startWave(state: GameState, waveNum: number) {
  const config = generateWave(waveNum);
  waveSpawnState = {
    spawnsLeft: config.spawns.map(s => ({
      type: s.type,
      count: s.count,
      delay: s.delay,
      interval: s.interval,
    })),
    lastSpawn: 0,
  };
  state.wave = waveNum;
  state.status = 'playing';
  // Give every fresh run the tools needed for later enemy types. Meta unlocks
  // still let players start with these elements earlier in subsequent runs.
  const waveElements: [number, ElementType][] = [[3, 'water'], [5, 'earth'], [7, 'air'], [10, 'lightning']];
  const unlocked = waveElements.filter(([wave, element]) => waveNum >= wave && !state.availableElements.includes(element));
  if (unlocked.length) state.availableElements = [...state.availableElements, ...unlocked.map(([, element]) => element)];
  // 记录波次开始时的统计（用于结算面板）
  state.waveStartKillCount = state.killCount;
  state.waveStartStardust = state.stardust;
  // 随机事件系统：每 3 波触发一个事件（跳过 Boss 波和前 2 波）
  if (shouldTriggerEvent(waveNum)) {
    state.currentEvent = rollWaveEvent();
    state.eventTimer = 0;
  } else {
    state.currentEvent = null;
    state.eventTimer = 0;
  }
  sfx.waveStart();

  // orb-generator 遗物：每波开始随机放一颗星核
  const hasGenerator = state.ownedRelics.some(r => r.id === 'orb-generator');
  if (hasGenerator && state.availableElements.length > 0) {
    const elem = state.availableElements[Math.floor(Math.random() * state.availableElements.length)];
    const col = Math.floor(Math.random() * GRID_WIDTH);
    // 找到最低空位
    let placeY = -1;
    for (let y = GRID_HEIGHT - 1; y >= 0; y--) {
      if (!state.grid[y][col]) { placeY = y; break; }
    }
    if (placeY >= 0) {
      const now = performance.now();
      state.grid[placeY][col] = {
        id: uid('orb'),
        element: elem,
        tier: 1,
        gridX: col,
        gridY: placeY,
        cooldown: 0,
        attackInterval: getOrbAttackInterval(elem, 1),
        lastAttack: now,
        spawnTime: now,
      };
    }
  }

  // blood-pact 遗物：每波开始扣 1 HP（伤害 +30% 的代价）
  const hasBloodPact = state.ownedRelics.some(r => r.id === 'blood-pact');
  if (hasBloodPact && waveNum > 1) {
    state.hp = Math.max(1, state.hp - 1);
    state.hpLostInRun += 1;
  }

  // 成就检测：波次到达类
  useAchievementStore.getState().checkAchievements({
    runKills: state.killCount,
    currentWave: waveNum,
    bestCombo: state.bestCombo,
    currentCombo: state.combo,
    runSkillsUsed: state.runSkillUses,
    energy: state.energy,
    hpLostInRun: state.hpLostInRun,
  });

  // 挑战修饰符：gift_of_void 每波 -10 星尘
  if (state.currentChallenge?.modifiers.some(m => m.id === 'gift_of_void') && waveNum > 1) {
    state.stardust = Math.max(0, state.stardust - 10);
  }
}

function updateWaveSpawns(state: GameState, now: number, dt: number): Particle[] {
  const particles: Particle[] = [];
  if (!waveSpawnState) {
    return particles;
  }
  if (state.status !== 'playing') return particles;

  for (const spawn of waveSpawnState.spawnsLeft) {
    if (spawn.count <= 0) continue;
    spawn.delay -= dt * 1000;
    if (spawn.delay <= 0) {
      // 生成敌人
      const cfg = ENEMIES[spawn.type];
      // 事件：敌人 HP 倍率（血色潮汐 +50%）
      const eventHpMult = state.currentEvent?.enemyHpMult || 1;
      // 挑战：敌人 HP 倍率（double_boss +50%）
      const challengeHpMult = getChallengeFlagsSafe(state).enemyHpMult ?? 1;
      const doubleBoss = (spawn.type === 'boss' || spawn.type === 'maiden') &&
        !!state.currentChallenge?.modifiers.some(m => m.id === 'double_boss');
      const baseHp = scaleEnemyHp(cfg.baseHp, state.wave) * eventHpMult * challengeHpMult * (doubleBoss ? 2 : 1);
      const enemy: Enemy = {
        id: uid('enemy'),
        type: spawn.type,
        hp: baseHp,
        maxHp: baseHp,
        position: 0,
        speed: scaleEnemySpeed(cfg.speed, state.wave),
        effects: [],
        hitFlash: 0,
        reward: scaleReward(cfg.reward, state.wave) * (doubleBoss ? 2 : 1),
      };
      state.enemies.push(enemy);
      spawn.count -= 1;
      spawn.delay = spawn.interval || 600; // 间隔
      // 图鉴记录：发现敌人
      useCodexStore.getState().recordEnemy(spawn.type);
    }
  }

  // 检查波次完成
  const allSpawned = waveSpawnState.spawnsLeft.every(s => s.count <= 0);
  if (allSpawned && state.enemies.length === 0) {
    // 检查是否是 Boss 波且怪兽被击败
    const monsterId = state.currentMonsterId;
    if (monsterId) {
      state.status = 'monster-defeated';
      state.pendingStory = { kind: 'monster-defeated', monsterId };
    } else {
      // 普通波次清除
      state.status = 'wave-clear';
    }
    // 庆祝粒子（金色烟花）
    for (let i = 0; i < 30; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 80 + Math.random() * 120;
      particles.push({
        id: uid('cele'),
        x: 200 + (Math.random() - 0.5) * 100,
        y: 200 + (Math.random() - 0.5) * 100,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 50,
        life: 1.0 + Math.random() * 0.5,
        maxLife: 1.5,
        size: 3 + Math.random() * 2,
        color: ['#FFD166', '#FF6B6B', '#4ECDC4', '#FFE66D'][Math.floor(Math.random() * 4)],
        kind: 'spark',
        gravity: 200,
      });
    }
  }

  return particles;
}

// ============= 系统：战斗 =============
function processCombat(state: GameState, now: number, dt: number): Particle[] {
  const particles: Particle[] = [];
  if (state.status !== 'playing') return particles;

  // 敌人移动
  for (const enemy of state.enemies) {
    let speed = enemy.speed;
    // 事件：敌人速度倍率（狂暴之潮）
    if (state.currentEvent?.enemySpeedMult) {
      speed *= state.currentEvent.enemySpeedMult;
    }
    // 挑战：敌人速度倍率（speed_demon +50%）
    const challengeSpeedMult = getChallengeFlagsSafe(state).enemySpeedMult ?? 1;
    speed *= challengeSpeedMult;
    // 减速效果（状态）
    for (const eff of enemy.effects) {
      if (eff.type === 'slow' || eff.type === 'freeze') {
        speed *= (1 - eff.value);
      }
      eff.duration -= dt * 1000;
    }
    enemy.effects = enemy.effects.filter(e => e.duration > 0);
    // 减速遗物（全局）
    const slowRelic = state.ownedRelics
      .filter(r => r.effects.some(e => e.type === 'enemy-slow'))
      .reduce((sum, r) => sum + r.effects.find(e => e.type === 'enemy-slow')!.value, 0);
    speed *= (1 - slowRelic);
    enemy.position += speed * dt;
    enemy.hitFlash = Math.max(0, enemy.hitFlash - dt * 1000);

    // 裂隙者瞬移
    const enemyCfg = ENEMIES[enemy.type];
    if (enemyCfg.teleport) {
      if (enemy.teleportCooldown === undefined) {
        enemy.teleportCooldown = enemyCfg.teleport.interval;
      }
      enemy.teleportCooldown -= dt * 1000;
      if (enemy.teleportCooldown <= 0) {
        enemy.position = Math.min(0.99, enemy.position + enemyCfg.teleport.distance);
        enemy.teleportCooldown = enemyCfg.teleport.interval;
        // 瞬移粒子特效
        for (let i = 0; i < 8; i++) {
          const a = Math.random() * Math.PI * 2;
          particles.push({
            id: uid('tp'),
            x: 393,
            y: 20 + enemy.position * 386,
            vx: Math.cos(a) * 60,
            vy: Math.sin(a) * 60,
            life: 0.4,
            maxLife: 0.4,
            size: 2,
            color: enemyCfg.color,
            kind: 'spark',
          });
        }
      }
    }

    // 到达终点
    if (enemy.position >= 1) {
      // Boss 突破防线即失败，不能在存活时被记作已击败。
      if (enemy.type === 'boss' || enemy.type === 'maiden') {
        state.hpLostInRun += state.hp;
        state.hp = 0;
        enemy.hp = 0;
        state.screenShake = 0.4;
        sfx.hurt();
        continue;
      }
      const damage = ENEMIES[enemy.type].damage;
      // 检查护盾遗物（免疫一次扣血）
      const shieldIdx = state.ownedRelics.findIndex(r => r.effects.some(e => e.type === 'shield'));
      if (shieldIdx >= 0) {
        // 消耗一个护盾遗物（重新赋值保持引用变化，确保订阅 ownedRelics 的 UI 更新）
        state.ownedRelics = state.ownedRelics.filter((_, i) => i !== shieldIdx);
        // 护盾破碎粒子效果
        for (let i = 0; i < 20; i++) {
          const a = Math.random() * Math.PI * 2;
          const sp = 60 + Math.random() * 80;
          particles.push({
            id: uid('sh'),
            x: 200,
            y: 400,
            vx: Math.cos(a) * sp,
            vy: Math.sin(a) * sp,
            life: 0.6,
            maxLife: 0.6,
            size: 3,
            color: '#4ECDC4',
            kind: 'spark',
          });
        }
        sfx.relic();
      } else {
        // 天赋：钢铁印记（damage-chance）受击概率免伤
        const dodgeChance = getTalentEffectSum(state.unlockedTalents, 'damage-chance' as TalentEffect);
        if (Math.random() < dodgeChance) {
          // 免伤成功，只播放粒子不计血
          state.screenShake = 0.2;
        } else {
          state.hp -= damage;
          state.hpLostInRun += damage;
          state.screenShake = 0.4;
          sfx.hurt();
        }
      }
      enemy.hp = 0;
    }
  }

  // 星核攻击
  for (let y = 0; y < GRID_HEIGHT; y++) {
    for (let x = 0; x < GRID_WIDTH; x++) {
      const orb = state.grid[y][x];
      if (!orb) continue;

      // 攻速遗物加成 + 符文加成
      let atkInterval = orb.attackInterval;
      const atkBoostRelic = state.ownedRelics
        .filter(r => r.effects.some(e => e.type === 'atkspd-boost'))
        .reduce((sum, r) => sum + r.effects.find(e => e.type === 'atkspd-boost')!.value, 0);
      const atkBoostRune = getRuneEffectSum(state, 'atkspd-boost');
      // 羁绊：火系"焚天"激活时给该星核额外攻速加成（仅火元素）
      const atkBoostBond = getElementBondEffect(state.activeBonds, orb.element, 'atkspd-boost');
      atkInterval *= (1 - atkBoostRelic - atkBoostRune - atkBoostBond);

      // 烈焰风暴共鸣攻速加成
      const fireAirBoost = state.synergies.some(s => s.config.effect === 'atkspd-boost');
      if (fireAirBoost) atkInterval *= 0.7;

      if (now - orb.lastAttack < atkInterval) continue;

      // 查找射程内最近的敌人（基础射程 + 风系"疾风"羁绊加成）
      const range = getOrbRange(orb.element, orb.tier) + getElementBondEffect(state.activeBonds, orb.element, 'range-boost');
      // 星核在屏幕上的实际 Y 坐标（与 Renderer 一致：10 + gridY*58 + 29）
      const orbScreenY = 10 + orb.gridY * 58 + 29;
      // 敌人在屏幕上的实际 Y 坐标（与 Renderer 一致：20 + position*386）
      let target: Enemy | null = null;
      let bestDist = Infinity;
      for (const e of state.enemies) {
        if (e.hp <= 0) continue;
        // 飞行单位只受特定元素攻击
        const flyCfg = ENEMIES[e.type];
        if (flyCfg.onlyHitBy && !flyCfg.onlyHitBy.includes(orb.element)) continue;
        // 使用屏幕距离转换为格子数（CELL_SIZE=58）
        const enemyScreenY = 20 + e.position * 386;
        const dist = Math.abs(enemyScreenY - orbScreenY) / 58;
        if (dist <= range && dist < bestDist) {
          bestDist = dist;
          target = e;
        }
      }

      if (target) {
        orb.lastAttack = now;
        // 创建投射物
        const dmg = getOrbDamage(orb.element, orb.tier, orb.evolution);
        // 遗物全局伤害加成
        const dmgBoostRelic = state.ownedRelics
          .filter(r => r.effects.some(e => e.type === 'damage-boost'))
          .reduce((sum, r) => sum + r.effects.find(e => e.type === 'damage-boost')!.value, 0);
        // 符文全局伤害加成
        const dmgBoostRune = getRuneEffectSum(state, 'damage-boost');
        // 符文元素伤害加成（按当前星核元素）
        const elemRuneKey = `${orb.element}-damage` as RuneEffectType;
        const elemBoostRune = getRuneEffectSum(state, elemRuneKey);
        // 羁绊：土系"厚土"激活时给该星核额外伤害（仅土元素）
        const dmgBoostBondElem = getElementBondEffect(state.activeBonds, orb.element, 'damage-boost');
        // 羁绊：多元羁绊给全场星核伤害加成（3/5 元素在场）
        const dmgBoostBondGlobal = getGlobalBondEffect(state.activeBonds, 'damage-boost');
        // 天赋：力量印记（damage-boost）全场伤害加成
        const dmgBoostTalent = getTalentEffectSum(state.unlockedTalents, 'damage-boost' as TalentEffect);
        // 事件：投射物伤害倍率（虚空风暴 +30%）
        const eventProjDmgMult = state.currentEvent?.projectileDmgMult || 1;
        const finalDmg = dmg * (1 + dmgBoostRelic + dmgBoostRune + elemBoostRune + dmgBoostBondElem + dmgBoostBondGlobal + dmgBoostTalent) * eventProjDmgMult;

        // 暴击率：基础 + 遗物 + 符文 + 羁绊 + 天赋（精准印记）
        const critChance = (ELEMENTS[orb.element].special.critChance || 0) +
          state.ownedRelics.filter(r => r.effects.some(e => e.type === 'crit-boost'))
            .reduce((s, r) => s + r.effects.find(e => e.type === 'crit-boost')!.value, 0) +
          getRuneEffectSum(state, 'crit-boost') +
          getElementBondEffect(state.activeBonds, orb.element, 'crit-boost') +
          getTalentEffectSum(state.unlockedTalents, 'crit-boost' as TalentEffect);
        const isCrit = Math.random() < critChance;
        // 暴击伤害：基础 2.0 + 符文 crit-damage + 天赋（狂战印记）
        const critDmgBonus = getRuneEffectSum(state, 'crit-damage') +
          getTalentEffectSum(state.unlockedTalents, 'crit-damage' as TalentEffect);
        const critDmg = isCrit ? (2.0 + critDmgBonus) : 1.0;

        // 事件：投射物速度倍率（虚空风暴 -30%）
        const eventProjSpeedMult = state.currentEvent?.projectileSpeedMult || 1;
        // 投射物起始位置 = 星核屏幕位置（与 Renderer 一致）
        const projStartX = 10 + orb.gridX * 58 + 29;
        const projStartY = orbScreenY;
        // 投射物目标 = 敌人屏幕位置（与 drawEnemies 一致）
        const targetScreenX = 358 + 70 / 2; // TRACK_X + TRACK_WIDTH/2 = 393
        const targetScreenY = 20 + target.position * 386;
        state.projectiles.push({
          id: uid('proj'),
          x: projStartX,
          y: projStartY,
          targetX: targetScreenX,
          targetY: targetScreenY,
          speed: 600 * eventProjSpeedMult,
          damage: finalDmg * critDmg,
          element: orb.element,
          color: ELEMENTS[orb.element].color,
          pierce: ELEMENTS[orb.element].special.pierce || 0,
          chainLeft: ELEMENTS[orb.element].special.chain || (orb.evolution === 'storm' ? 4 : 0),
          hitEnemies: new Set(),
          isCrit,
        });
        sfx.shoot(orb.element);
      }
    }
  }

  // 投射物移动
  for (const proj of state.projectiles) {
    const dx = proj.targetX - proj.x;
    const dy = proj.targetY - proj.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 5) {
      // 命中
      for (const enemy of state.enemies) {
        if (enemy.hp <= 0) continue;
        if (proj.hitEnemies.has(enemy.id)) continue;
        const flyCfg = ENEMIES[enemy.type];
        if (flyCfg.onlyHitBy && !flyCfg.onlyHitBy.includes(proj.element)) continue;

        // 命中
        let dmg = proj.damage;
        // 护甲减伤（含符文穿透效果）
        if (flyCfg.armor) {
          const armorPierce = getRuneEffectSum(state, 'armor-pierce');
          const effectiveArmor = Math.max(0, flyCfg.armor - armorPierce);
          dmg *= (1 - effectiveArmor);
        }

        // 元素克制系统
        let weaknessMult = 1.0;
        let weaknessLabel = '';
        if (flyCfg.weakTo && flyCfg.weakTo.includes(proj.element)) {
          weaknessMult = 1.5;
          weaknessLabel = '弱点';
        } else if (flyCfg.resist && flyCfg.resist.includes(proj.element)) {
          weaknessMult = 0.5;
          weaknessLabel = '抗性';
        }
        dmg *= weaknessMult;

        // 连击伤害加成（combo >= 5 时生效）
        const baseComboMult = state.combo >= 20 ? 1.5 : state.combo >= 10 ? 1.25 : state.combo >= 5 ? 1.1 : 1.0;
        // 挑战修饰符：连击伤害加成倍率（如 combo_fever ×2）
        const comboChallengeMult = getChallengeFlagsSafe(state).comboDamageMult ?? 1;
        const comboMult = 1 + (baseComboMult - 1) * comboChallengeMult;
        // 挑战修饰符：全局伤害倍率（hardcore 1.5, glass_cannon 2.0）
        const challengeDmgMult = getChallengeFlagsSafe(state).damageMult ?? 1;
        dmg *= comboMult * challengeDmgMult;

        enemy.hp -= dmg;
        enemy.hitFlash = 150;
        proj.hitEnemies.add(enemy.id);
        // 命中音效
        if (proj.isCrit) sfx.crit();
        else sfx.hit();

        // 状态效果
        const elemCfg = ELEMENTS[proj.element];
        if (elemCfg.special.slowAmount) {
          // 羁绊：水系"凝霜"激活时增强该投射物的减速效果（仅水元素）
          const slowBoostBond = getElementBondEffect(state.activeBonds, proj.element, 'slow-boost');
          // 天赋：寒霜印记（slow-boost）增强减速效果
          const slowBoostTalent = getTalentEffectSum(state.unlockedTalents, 'slow-boost' as TalentEffect);
          // 天赋：时滞印记（status-duration）延长状态效果持续时间
          const statusDurationTalent = getTalentEffectSum(state.unlockedTalents, 'status-duration' as TalentEffect);
          enemy.effects.push({
            type: 'slow',
            duration: 2000 * (1 + statusDurationTalent),
            value: elemCfg.special.slowAmount * (1 + slowBoostBond + slowBoostTalent),
          });
        }
        // 天赋：冰封印记（freeze-chance）水系攻击概率冻结敌人
        if (proj.element === 'water' && hasTalentEffect(state.unlockedTalents, 'freeze-chance' as TalentEffect)) {
          const freezeChance = getTalentEffectSum(state.unlockedTalents, 'freeze-chance' as TalentEffect);
          if (Math.random() < freezeChance) {
            const statusDurationTalent = getTalentEffectSum(state.unlockedTalents, 'status-duration' as TalentEffect);
            enemy.effects.push({
              type: 'freeze',
              duration: 1000 * (1 + statusDurationTalent),
              value: 1,
            });
          }
        }
        // 伤害文字粒子（弱点/抗性/暴击显示不同颜色）
        const dmgColor = weaknessMult > 1
          ? '#4ECDC4'  // 弱点：青色
          : weaknessMult < 1
            ? '#888888' // 抗性：灰色
            : proj.isCrit ? '#FFD166' : '#FFFFFF';
        const dmgLabel = weaknessLabel
          ? `${Math.floor(dmg)}${weaknessLabel === '弱点' ? ' 弱点!' : ' 抗性'}`
          : `${Math.floor(dmg)}${proj.isCrit ? '!' : ''}`;
        particles.push({
          id: uid('dmg'),
          x: proj.targetX,
          y: proj.targetY,
          vx: (Math.random() - 0.5) * 30,
          vy: -50,
          life: 0.8,
          maxLife: 0.8,
          size: weaknessMult > 1 ? 16 : 14,
          color: dmgColor,
          kind: 'damage-text',
          text: dmgLabel,
        });

        // 击杀
        if (enemy.hp <= 0) {
          // 星尘加成遗物
          const dustBoost = state.ownedRelics
            .filter(r => r.effects.some(e => e.type === 'stardust-boost'))
            .reduce((sum, r) => sum + r.effects.find(e => e.type === 'stardust-boost')!.value, 0);
          // 事件：奖励倍率（狂暴之潮 +50%，双倍星尘 ×2）
          const eventRewardMult = state.currentEvent?.rewardMult || 1;
          const eventStardustMult = state.currentEvent?.stardustMult || 1;
          state.stardust += Math.floor(enemy.reward * (1 + dustBoost) * eventRewardMult * eventStardustMult * (getChallengeFlagsSafe(state).stardustMult ?? 1));
          state.killCount += 1;
          state.combo += 1;
          state.comboTimer = 2.0 * (getChallengeFlagsSafe(state).comboTimerMult ?? 1);
          state.bestCombo = Math.max(state.bestCombo, state.combo);
          state.score += enemy.reward * 10 * (1 + state.combo * 0.1);
          // 主动技能：击杀获得能量
          const gained = getKillEnergy(enemy.type);
          state.energy = Math.min(MAX_ENERGY, state.energy + gained);
          // 符文：能量虹吸（每击杀额外 +N 能量）
          const energyLeech = getRuneEffectSum(state, 'energy-leech');
          if (energyLeech > 0) {
            state.energy = Math.min(MAX_ENERGY, state.energy + energyLeech);
          }
          // 符文：吸血（按概率回血）
          if (hasRuneEffect(state, 'lifesteal')) {
            const lifestealChance = getRuneEffectSum(state, 'lifesteal');
            if (Math.random() < lifestealChance) {
              state.hp = Math.min(state.maxHp, state.hp + 1);
            }
          }

          // 成就追踪
          const isBossKill = enemy.type === 'boss' || enemy.type === 'maiden';
          const ach = useAchievementStore.getState();
          ach.recordKill(isBossKill);
          ach.checkAchievements({
            runKills: state.killCount,
            currentWave: state.wave,
            bestCombo: state.bestCombo,
            currentCombo: state.combo,
            runSkillsUsed: state.runSkillUses,
            energy: state.energy,
            hpLostInRun: state.hpLostInRun,
          });

          // 击杀音效
          if (enemy.type === 'boss' || enemy.type === 'maiden') sfx.bossKill();
          else sfx.kill();

          // 符文掉落：Boss 必掉，精英 30% 掉
          if (isBossKill || (enemy.type === 'elite' && Math.random() < 0.3)) {
            const droppedRune = rollRune();
            useRuneStore.getState().addRune(droppedRune.id);
            // 添加掉落粒子（金色光芒）
            for (let i = 0; i < 12; i++) {
              const a = Math.random() * Math.PI * 2;
              particles.push({
                id: uid('rdrop'),
                x: proj.targetX,
                y: proj.targetY,
                vx: Math.cos(a) * 60,
                vy: Math.sin(a) * 60 - 80,
                life: 1.2,
                maxLife: 1.2,
                size: 4,
                color: '#FFD166',
                kind: 'spark',
                gravity: 120,
              });
            }
          }

          // 击杀粒子
          for (let i = 0; i < 8; i++) {
            const a = Math.random() * Math.PI * 2;
            particles.push({
              id: uid('kp'),
              x: proj.targetX,
              y: proj.targetY,
              vx: Math.cos(a) * 100,
              vy: Math.sin(a) * 100,
              life: 0.5,
              maxLife: 0.5,
              size: 3,
              color: ENEMIES[enemy.type].color,
              kind: 'explosion',
            });
          }

          // 腐化星核死亡分裂
          const deadCfg = ENEMIES[enemy.type];
          if (deadCfg.splitOnDeath) {
            const splitType = deadCfg.splitOnDeath.type;
            const splitCount = deadCfg.splitOnDeath.count;
            const splitCfg = ENEMIES[splitType];
            for (let i = 0; i < splitCount; i++) {
              state.enemies.push({
                id: uid('split'),
                type: splitType,
                hp: scaleEnemyHp(splitCfg.baseHp, state.wave),
                maxHp: scaleEnemyHp(splitCfg.baseHp, state.wave),
                position: Math.max(0, enemy.position - 0.05 * (i + 1)),
                speed: scaleEnemySpeed(splitCfg.speed, state.wave),
                effects: [],
                hitFlash: 0,
                reward: scaleReward(splitCfg.reward, state.wave),
              });
            }
            // 图鉴记录：分裂产生的敌人
            useCodexStore.getState().recordEnemy(splitType);
          }
        }

        // 连锁
        if (proj.chainLeft > 0) {
          proj.chainLeft -= 1;
          // 找下一个目标
          let next: Enemy | null = null;
          let nextDist = Infinity;
          for (const e2 of state.enemies) {
            if (e2.hp <= 0 || proj.hitEnemies.has(e2.id)) continue;
            const d = Math.abs(e2.position - enemy.position) * 10;
            if (d < nextDist && d < 3) {
              nextDist = d;
              next = e2;
            }
          }
          if (next) {
            proj.targetX = 393; // TRACK_X + TRACK_WIDTH/2
            proj.targetY = 20 + next.position * 386;
            proj.x = proj.targetX; // 瞬移简化
            proj.damage *= 0.6;
          }
        }

        if (proj.pierce > 0) {
          proj.pierce -= 1;
        } else {
          // 标记移除
          proj.speed = 0;
          break;
        }
      }
    } else {
      const mv = proj.speed * dt;
      const mvx = (dx / dist) * mv;
      const mvy = (dy / dist) * mv;
      proj.x += mvx;
      proj.y += mvy;
    }
  }

  // 清理死亡投射物
  state.projectiles = state.projectiles.filter(p => p.speed > 0);

  // 治疗者光环（每秒治疗附近敌人）
  for (const healer of state.enemies) {
    if (healer.hp <= 0) continue;
    const cfg = ENEMIES[healer.type];
    if (!cfg.healAura) continue;
    // 每帧按 dt 比例治疗
    const healPerFrame = cfg.healAura * dt;
    for (const target of state.enemies) {
      if (target === healer || target.hp <= 0) continue;
      const dist = Math.abs(target.position - healer.position);
      if (dist <= (cfg.healRadius || 0.12)) {
        target.hp = Math.min(target.maxHp, target.hp + healPerFrame);
      }
    }
  }

  // 清理死亡敌人
  state.enemies = state.enemies.filter(e => e.hp > 0);

  // 共鸣伤害（光环类）
  for (const syn of state.synergies) {
    if (syn.config.effect === 'aura-damage') {
      for (const enemy of state.enemies) {
        // 简化：所有敌人都受光环影响
        if (Math.random() < dt * 2) { // 每秒2次判定
          enemy.hp -= syn.config.value * syn.level;
          enemy.hitFlash = 80;
        }
      }
    }
  }

  // 检查死亡
  if (state.hp <= 0) {
    state.hp = 0;
    state.status = 'dead';
    sfx.gameOver();
  }

  // 连击计时
  if (state.comboTimer > 0) {
    state.comboTimer -= dt;
    if (state.comboTimer <= 0) {
      state.combo = 0;
    }
  }

  // 屏幕震动衰减
  if (state.screenShake > 0) {
    state.screenShake = Math.max(0, state.screenShake - dt);
  }

  // 主动技能冷却衰减
  for (const id of SKILL_IDS) {
    if (state.skillCooldowns[id] > 0) {
      state.skillCooldowns[id] = Math.max(0, state.skillCooldowns[id] - dt * 1000);
    }
  }

  return particles;
}

// ============= 系统：波次事件 =============
function processWaveEvent(state: GameState, now: number, dt: number): Particle[] {
  const particles: Particle[] = [];
  if (state.status !== 'playing') return particles;
  if (!state.currentEvent) return particles;

  const event = state.currentEvent;
  state.eventTimer += dt * 1000;

  // 流星雨：每 X 秒一颗流星砸向轨道，对所有敌人造成伤害
  if (event.meteorInterval && event.meteorDamage) {
    if (state.eventTimer >= event.meteorInterval) {
      // 对所有敌人造成伤害
      for (const enemy of state.enemies) {
        if (enemy.hp <= 0) continue;
        enemy.hp -= event.meteorDamage;
        enemy.hitFlash = 200;
        // 流星伤害文字
        particles.push({
          id: uid('meteor-dmg'),
          x: 393,
          y: 20 + enemy.position * 386,
          vx: 0,
          vy: -60,
          life: 1.0,
          maxLife: 1.0,
          size: 18,
          color: '#FF8E53',
          kind: 'damage-text',
          text: `${event.meteorDamage} ☄`,
        });
      }
      // 流星坠落粒子特效（轨道顶部到底部的火光）
      for (let i = 0; i < 30; i++) {
        const py = 20 + Math.random() * 400;
        particles.push({
          id: uid('meteor-fx'),
          x: 393 + (Math.random() - 0.5) * 60,
          y: py,
          vx: (Math.random() - 0.5) * 100,
          vy: 200 + Math.random() * 200,
          life: 0.6,
          maxLife: 0.6,
          size: 3 + Math.random() * 2,
          color: ['#FF8E53', '#FFD166', '#FF6B6B'][Math.floor(Math.random() * 3)],
          kind: 'spark',
          gravity: 300,
        });
      }
      state.eventTimer = 0;
      sfx.crit(); // 复用暴击音效
    }
  }

  // 星尘雨：每 X 秒获得少量星尘
  if (event.stardustInterval && event.stardustAmount) {
    if (state.eventTimer >= event.stardustInterval) {
      state.stardust += event.stardustAmount;
      // 星尘飘落粒子特效
      for (let i = 0; i < 12; i++) {
        particles.push({
          id: uid('rain'),
          x: Math.random() * 400,
          y: 0,
          vx: (Math.random() - 0.5) * 40,
          vy: 80 + Math.random() * 60,
          life: 1.5,
          maxLife: 1.5,
          size: 2 + Math.random() * 2,
          color: '#4ECDC4',
          kind: 'spark',
          gravity: 50,
        });
      }
      state.eventTimer = 0;
    }
  }

  return particles;
}

// ============= 系统：共鸣 =============
function recomputeSynergies(state: GameState) {
  const synergies: GameState['synergies'] = [];
  const counted = new Set<string>();

  for (let y = 0; y < GRID_HEIGHT; y++) {
    for (let x = 0; x < GRID_WIDTH; x++) {
      const orb = state.grid[y][x];
      if (!orb) continue;

      const neighbors = [
        { x: x + 1, y },
        { x, y: y + 1 },
      ];
      for (const n of neighbors) {
        if (n.x >= GRID_WIDTH || n.y >= GRID_HEIGHT) continue;
        const other = state.grid[n.y][n.x];
        if (!other) continue;
        if (orb.element === other.element) continue;

        const key = synergyKey(orb.element, other.element);
        if (counted.has(key)) continue;
        const cfg = findSynergy(orb.element, other.element);
        if (!cfg) continue;
        counted.add(key);

        const boostMul = state.ownedRelics.some(r => r.id === 'resonance-crystal') ? 2 : 1;
        synergies.push({
          config: cfg,
          positions: [{ x, y }, { x: n.x, y: n.y }],
          level: Math.min(orb.tier, other.tier) * boostMul,
        });
      }
    }
  }
  state.synergies = synergies;
}

// ============= 商店 =============
function generateShopItems(state: GameState): ShopItem[] {
  const items: ShopItem[] = [];
  const discount = state.ownedRelics.some(r => r.id === 'greedy-heart') ? 0.8 : 1.0;
  const stardustBoost = state.ownedRelics.some(r => r.id === 'stardust-magnet') ? 1.3 : 1.0;
  void stardustBoost;

  // 3 个星核
  for (let i = 0; i < 3; i++) {
    const el = randomElement(state.availableElements);
    const price = Math.floor((8 + state.wave * 2) * discount);
    items.push({
      id: uid('shop'),
      kind: 'orb',
      element: el,
      tier: 1,
      price,
    });
  }

  // 1 个遗物（50% 概率）
  if (Math.random() < 0.5) {
    const relic = rollRelics(1, state.wave, state.ownedRelics.map(r => r.id))[0];
    if (relic) {
      const price = Math.floor((30 + state.wave * 5) * discount);
      items.push({
        id: uid('shop'),
        kind: 'relic',
        relic,
        price,
      });
    }
  }

  // 治疗
  if (state.hp < state.maxHp) {
    items.push({
      id: uid('shop'),
      kind: 'heal',
      price: Math.floor(15 * discount),
    });
  }

  return items;
}

// ============= 创建 Store =============
export const useGameStore = create<GameStore>()((set, get) => ({
  ...createInitialState(),

  initGame: () => {
    set({ ...createInitialState() });
  },

  startNewRun: () => {
    const meta = useMetaStore.getState();
    const cfg = getStartConfig(meta);

    const state = createInitialState();
    // 天赋系统：同步已解锁的天赋到本局
    state.unlockedTalents = [...meta.unlockedTalents];
    // 天赋：生命印记（hp-boost）增加起始生命
    const hpBoostTalent = getTalentEffectSum(state.unlockedTalents, 'hp-boost' as TalentEffect);
    state.hp = cfg.startHp + hpBoostTalent;
    state.maxHp = cfg.startHp + hpBoostTalent;
    state.stardust = cfg.startStardust;
    state.availableElements = cfg.availableElements;
    state.currentElement = cfg.availableElements[0];
    state.rerollsLeft = cfg.startRerolls;
    state.startTime = performance.now();
    state.currentChallenge = null;  // 普通模式

    // 同步已装备的符文到本局 activeRunes
    state.activeRunes = useRuneStore.getState().getEquippedDefs();
    // 羁绊系统：开局清空激活的羁绊（之后由 tick 重算）
    state.activeBonds = [];

    // 起始遗物
    if (cfg.startRelic) {
      const startRelic = rollRelics(1, 1)[0];
      if (startRelic) {
        state.ownedRelics.push(startRelic);
        // 图鉴记录：获得起始遗物
        useCodexStore.getState().recordRelic(startRelic.id);
      }
    }

    // 开始第一波
    startWave(state, 1);
    set(state);

    // 图鉴记录：已解锁元素
    const codex = useCodexStore.getState();
    cfg.availableElements.forEach(el => codex.recordElement(el));
  },

  startDailyChallenge: () => {
    const challenge = getTodayChallenge();
    const meta = useMetaStore.getState();
    const cfg = getStartConfig(meta);

    const state = createInitialState();
    // 天赋系统：同步已解锁的天赋到本局
    state.unlockedTalents = [...meta.unlockedTalents];
    // 应用挑战起始条件（覆盖 meta 解锁）+ 天赋生命加成
    const hpBoostTalentDC = getTalentEffectSum(state.unlockedTalents, 'hp-boost' as TalentEffect);
    state.hp = challenge.startHp + hpBoostTalentDC;
    state.maxHp = challenge.startHp + hpBoostTalentDC;
    state.stardust = challenge.startStardust;
    state.availableElements = challenge.startElements;
    state.currentElement = challenge.startElements[0];
    state.rerollsLeft = cfg.startRerolls;
    state.startTime = performance.now();
    state.currentChallenge = challenge;
    state.energy = challenge.startEnergy;

    // 同步已装备的符文到本局 activeRunes
    state.activeRunes = useRuneStore.getState().getEquippedDefs();
    // 羁绊系统：开局清空激活的羁绊（之后由 tick 重算）
    state.activeBonds = [];

    // 起始遗物（保留 meta 解锁）
    if (cfg.startRelic) {
      const startRelic = rollRelics(1, 1)[0];
      if (startRelic) {
        state.ownedRelics.push(startRelic);
        // 图鉴记录：获得起始遗物
        useCodexStore.getState().recordRelic(startRelic.id);
      }
    }

    // 开始第一波
    startWave(state, 1);
    set(state);

    // 图鉴记录：挑战起始元素
    const codex = useCodexStore.getState();
    challenge.startElements.forEach(el => codex.recordElement(el));
  },

  dropOrb: (col) => {
    const state = get();
    if (state.status !== 'playing' && state.status !== 'wave-intro') return;
    if (state.deploymentCharge < 1) return;
    if (col < 0 || col >= GRID_WIDTH) return;

    // 找到该列最低空位
    let placeY = -1;
    for (let y = GRID_HEIGHT - 1; y >= 0; y--) {
      if (!state.grid[y][col]) {
        placeY = y;
        break;
      }
    }
    if (placeY < 0) return; // 列已满
    sfx.drop();

    const now = performance.now();
    const newOrb: Orb = {
      id: uid('orb'),
      element: state.currentElement,
      tier: 1,
      gridX: col,
      gridY: placeY,
      cooldown: 0,
      attackInterval: getOrbAttackInterval(state.currentElement, 1),
      lastAttack: now,
      spawnTime: now,
    };

    // 直接修改状态
    set((s) => {
      const newGrid = s.grid.map(row => [...row]);
      newGrid[placeY][col] = newOrb;
      const newState: GameState = {
        ...s,
        grid: newGrid,
        deploymentCharge: Math.max(0, s.deploymentCharge - 1),
      };

      // 处理融合
      const { particles } = processMerges(newState, now);
      newState.particles = [...newState.particles, ...particles];

      // 重新计算共鸣
      recomputeSynergies(newState);

      // 切换当前元素为随机
      if (s.availableElements.length > 1) {
        const others = s.availableElements.filter(e => e !== s.currentElement);
        newState.currentElement = others[Math.floor(Math.random() * others.length)];
      }

      return newState;
    });

    // 检查进化选择
    const after = get();
    if (after.status === 'evolution-select') return;
  },

  selectRelic: (relic) => {
    set((s) => {
      if (!s.relicChoices) return s;
      const newRelics = [...s.ownedRelics, relic];
      return {
        ...s,
        ownedRelics: newRelics,
        relicChoices: null,
        status: 'wave-intro',
        waveStartTime: performance.now(),
      };
    });
    sfx.relic();
    // 图鉴记录：获得遗物
    useCodexStore.getState().recordRelic(relic.id);
    // 0.1秒后调用 startNextWave（带剧情触发）
    setTimeout(() => {
      get().startNextWave();
    }, 100);
  },

  selectEvolution: (orbId, branchId) => {
    set((s) => {
      if (!s.pendingEvolution) return s;
      const branch = s.pendingEvolution.branches.find(b => b.id === branchId);
      if (!branch) return s;

      const hasCatalyst = s.ownedRelics.some(r => r.id === 'catalyst');

      const newGrid = s.grid.map(row =>
        row.map(orb => {
          if (orb && orb.id === orbId) {
            const newOrb = {
              ...orb,
              evolution: branchId,
              attackInterval: getOrbAttackInterval(orb.element, orb.tier, branchId),
            };
            // catalyst 遗物：进化后攻速额外 +25%
            if (hasCatalyst) {
              newOrb.attackInterval *= 0.75;
            }
            return newOrb;
          }
          return orb;
        })
      );

      return {
        ...s,
        grid: newGrid,
        pendingEvolution: null,
        status: s.prevStatus === 'shop' ? 'shop' : 'playing',
        prevStatus: null,
      };
    });
    sfx.evolve();
  },

  buyShopItem: (itemId) => {
    const state = get();
    const item = state.shopItems.find(i => i.id === itemId);
    if (!item || state.status !== 'shop') return;
    const availableColumns = Array.from({ length: GRID_WIDTH }, (_, col) => col)
      .filter(col => state.grid.some(row => !row[col]));
    if (item.kind === 'orb' && (!item.element || availableColumns.length === 0)) return;
    // 商店折扣遗物
    const discount = state.ownedRelics
      .filter(r => r.effects.some(e => e.type === 'shop-discount'))
      .reduce((sum, r) => sum + r.effects.find(e => e.type === 'shop-discount')!.value, 0);
    const finalPrice = Math.max(1, Math.floor(item.price * (1 - discount)));
    if (state.stardust < finalPrice) return;

    set((s) => {
      const newState = { ...s };
      newState.stardust -= finalPrice;
      newState.shopItems = s.shopItems.filter(i => i.id !== itemId);

      if (item.kind === 'relic' && item.relic) {
        newState.ownedRelics = [...s.ownedRelics, item.relic];
        // 图鉴记录：商店购买遗物
        useCodexStore.getState().recordRelic(item.relic.id);
      } else if (item.kind === 'heal') {
        newState.hp = Math.min(s.maxHp, s.hp + 1);
      } else if (item.kind === 'orb' && item.element) {
        const col = availableColumns[Math.floor(Math.random() * availableColumns.length)];
        let row = GRID_HEIGHT - 1;
        while (row >= 0 && s.grid[row][col]) row--;
        const now = performance.now();
        const tier = item.tier ?? 1;
        newState.grid = s.grid.map(cells => [...cells]);
        newState.grid[row][col] = {
          id: uid('orb'), element: item.element, tier, gridX: col, gridY: row,
          cooldown: 0, attackInterval: getOrbAttackInterval(item.element, tier),
          lastAttack: now, spawnTime: now,
        };
        const { particles } = processMerges(newState, now);
        newState.particles = [...newState.particles, ...particles];
        if (newState.status === 'evolution-select') newState.prevStatus = 'shop';
        recomputeSynergies(newState);
      }
      return newState;
    });
    sfx.buy();
  },

  rerollShop: () => {
    const state = get();
    if (state.rerollsLeft <= 0) return;
    if (state.stardust < 5) return;

    set((s) => ({
      ...s,
      stardust: s.stardust - 5,
      rerollsLeft: s.rerollsLeft - 1,
      shopItems: generateShopItems(s),
    }));
  },

  closeShop: () => {
    const state = get();
    if (state.status !== 'shop') return;

    // 进入遗物选择
    const relics = rollRelics(3, state.wave, state.ownedRelics.map(r => r.id));
    set((s) => ({
      ...s,
      relicChoices: relics,
      status: 'relic-select',
    }));
    sfx.shop();
  },

  startNextWave: () => {
    const state = get();
    const nextWave = state.wave + 1;

    // HP 回复遗物
    const regenRelic = state.ownedRelics.some(r => r.id === 'regen-field');
    const newHp = regenRelic ? Math.min(state.maxHp, state.hp + 1) : state.hp;

    set((s) => ({
      ...s,
      hp: newHp,
      rerollsLeft: 1 + (s.ownedRelics.some(r => r.id === 'extraReroll1') ? 1 : 0),
    }));

    // 检查剧情触发点（按优先级）
    // 1. 场景切换（Wave 5, 10, 15）
    const newScene = getSceneChangeWave(nextWave);
    if (newScene) {
      const oldSceneId = get().currentScene;
      set((s) => ({
        ...s,
        currentScene: newScene.id,
        pendingStory: { kind: 'scene-change', fromScene: oldSceneId, toScene: newScene.id, wave: nextWave },
        status: 'scene-change',
      }));
      sfx.relic();
      return;
    }

    // 2. 怪兽登场（Wave 5, 10, 15, 20 - Boss 波）
    const monster = getMonsterByWave(nextWave);
    if (monster) {
      set((s) => ({
        ...s,
        currentMonsterId: monster.id,
        pendingStory: { kind: 'monster-intro', monsterId: monster.id, wave: nextWave },
        status: 'monster-intro',
      }));
      sfx.bossKill();
      // 图鉴记录：遭遇怪兽
      useCodexStore.getState().recordMonster(monster.id);
      return;
    }

    // 3. 少女契约选择（Wave 3, 7, 12, 17）
    if (MAIDEN_PACT_WAVES.includes(nextWave)) {
      const maiden = pickMaidenByElements(get().availableElements);
      set((s) => ({
        ...s,
        currentMaidenId: maiden.id,
        pendingStory: { kind: 'maiden-pact', maidenId: maiden.id },
        status: 'maiden-pact',
      }));
      sfx.relic();
      return;
    }

    // 4. 少女登场对话（Wave 2, 4, 6, 8, 11, 13, 16, 18）
    if (MAIDEN_VISIT_WAVES.includes(nextWave)) {
      const maiden = pickMaidenByElements(get().availableElements);
      const isFirstTime = !get().seenMaidens.includes(maiden.id);
      set((s) => ({
        ...s,
        currentMaidenId: maiden.id,
        pendingStory: { kind: 'maiden-visit', maidenId: maiden.id, isFirstTime },
        status: 'maiden-visit',
      }));
      sfx.relic();
      return;
    }

    // 没有剧情，直接开始下一波
    const newState = { ...get() };
    startWave(newState, nextWave);
    set(newState);
  },

  // 推进剧情到下一阶段
  advanceStory: () => {
    const state = get();
    if (!state.pendingStory) return;

    const story = state.pendingStory;
    const nextWave = state.wave + 1;

    if (story.kind === 'scene-change') {
      // 场景切换后，检查是否还有怪兽登场
      const monster = getMonsterByWave(nextWave);
      if (monster) {
        set((s) => ({
          ...s,
          currentMonsterId: monster.id,
          pendingStory: { kind: 'monster-intro', monsterId: monster.id, wave: nextWave },
          status: 'monster-intro',
        }));
        sfx.bossKill();
        // 图鉴记录：遭遇怪兽（场景切换后）
        useCodexStore.getState().recordMonster(monster.id);
        return;
      }
      // 没有怪兽，开始下一波
      const newState = { ...get() };
      startWave(newState, nextWave);
      set(newState);
      return;
    }

    if (story.kind === 'maiden-visit') {
      // 标记为已见过
      const maidenId = story.maidenId;
      const seen = state.seenMaidens.includes(maidenId) ? state.seenMaidens : [...state.seenMaidens, maidenId];
      // 增加好感度（首次见面 +10，再次 +5）
      const gain = story.isFirstTime ? 10 : 5;
      const oldAff = state.maidenAffinity[maidenId] || 0;
      const newAff = Math.min(100, oldAff + gain);
      set((s) => ({
        ...s,
        seenMaidens: seen,
        maidenAffinity: { ...s.maidenAffinity, [maidenId]: newAff },
        pendingStory: null,
        currentMaidenId: null,
      }));
      // 成就追踪：少女首次见面
      const achM = useAchievementStore.getState();
      achM.recordSeenMaiden(maidenId);
      achM.checkAchievements({
        runKills: state.killCount,
        currentWave: state.wave,
        bestCombo: state.bestCombo,
        currentCombo: state.combo,
        runSkillsUsed: state.runSkillUses,
        energy: state.energy,
        hpLostInRun: state.hpLostInRun,
      });
      // 图鉴记录：见到少女
      useCodexStore.getState().recordMaiden(maidenId as MaidenId);
      // 开始下一波
      const newState = { ...get() };
      startWave(newState, nextWave);
      set(newState);
      return;
    }

    if (story.kind === 'maiden-pact') {
      // 少女契约：根据好感度激活对应 boon（永久遗物）
      const maidenId = story.maidenId;
      const aff = state.maidenAffinity[maidenId] || 0;
      const maiden = MAIDENS[maidenId as keyof typeof MAIDENS];

      if (maiden) {
        // 增加好感度（缔结契约 +20）
        const newAff = Math.min(100, aff + 20);
        set((s) => ({
          ...s,
          maidenAffinity: { ...s.maidenAffinity, [maidenId]: newAff },
        }));

        // 激活达到阈值的 boon（作为永久遗物）
        for (const boon of maiden.boons) {
          if (newAff >= boon.threshold) {
            const boonId = `${maidenId}-boon-${boon.threshold}`;
            const hasBoon = state.ownedRelics.some(r => r.id === boonId);
            if (!hasBoon) {
              const relic: Relic = {
                id: boonId,
                name: `${maiden.name} · ${boon.name}`,
                description: boon.description,
                rarity: 'epic',
                effects: [{ type: boon.effect, value: boon.value }],
                icon: maiden.emoji,
              };
              set((s) => ({ ...s, ownedRelics: [...s.ownedRelics, relic] }));
              // 图鉴记录：获得 boon 遗物（按 boon id 记录，便于追踪）
              useCodexStore.getState().recordRelic(boonId);
            }
          }
        }
        // 图鉴记录：见到少女（契约也是见面）
        useCodexStore.getState().recordMaiden(maidenId as MaidenId);
      }

      set((s) => ({
        ...s,
        pendingStory: null,
        currentMaidenId: null,
      }));
      sfx.relic();
      // 成就追踪：少女契约
      const achP = useAchievementStore.getState();
      achP.recordMaidenPact(maidenId);
      achP.checkAchievements({
        runKills: state.killCount,
        currentWave: state.wave,
        bestCombo: state.bestCombo,
        currentCombo: state.combo,
        runSkillsUsed: state.runSkillUses,
        energy: state.energy,
        hpLostInRun: state.hpLostInRun,
      });
      const newState = { ...get() };
      startWave(newState, nextWave);
      set(newState);
      return;
    }

    if (story.kind === 'monster-intro') {
      // 怪兽登场后，进入战斗
      set((s) => ({
        ...s,
        pendingStory: null,
      }));
      const newState = { ...get() };
      startWave(newState, nextWave);
      set(newState);
      return;
    }

    if (story.kind === 'monster-defeated') {
      if (state.wave >= FINAL_WAVE) {
        set((s) => ({
          ...s,
          pendingStory: null,
          currentMonsterId: null,
          status: 'victory',
        }));
        waveSpawnState = null;
        sfx.relic();
        return;
      }
      // 怪兽被击败，进入商店（normalWave 清算）
      set((s) => ({
        ...s,
        pendingStory: null,
        currentMonsterId: null,
        status: 'shop',
        shopItems: generateShopItems(s),
        rerollsLeft: 1 + (s.ownedRelics.some(r => r.id === 'extraReroll1') ? 1 : 0),
      }));
      waveSpawnState = null;
      sfx.waveClear();
      return;
    }
  },

  // 给少女礼物（消耗 20 星尘增加 15 好感度）
  giftMaiden: (maidenId: string) => {
    const state = get();
    if (state.stardust < 20) return;
    const oldAff = state.maidenAffinity[maidenId] || 0;
    const newAff = Math.min(100, oldAff + 15);
    set((s) => ({
      ...s,
      stardust: s.stardust - 20,
      maidenAffinity: { ...s.maidenAffinity, [maidenId]: newAff },
    }));
    sfx.buy();
  },

  // 接受怪兽契约
  acceptMonsterPact: () => {
    const state = get();
    if (!state.currentMonsterId) return;
    const monster = MONSTERS.find(m => m.id === state.currentMonsterId);
    if (!monster) return;

    // 应用代价
    if (monster.pact.cost.hp) {
      const hpCost = monster.pact.cost.hp === 99
        ? Math.floor(state.hp / 2)  // 50% 当前生命
        : monster.pact.cost.hp;
      set((s) => ({ ...s, hp: Math.max(1, s.hp - hpCost), hpLostInRun: s.hpLostInRun + hpCost }));
    }
    if (monster.pact.cost.stardust) {
      set((s) => ({ ...s, stardust: Math.max(0, s.stardust - monster.pact.cost.stardust!) }));
    }

    // 获得遗物
    const reward = RELICS.find(r => r.id === monster.pact.rewardRelicId);
    if (reward) {
      set((s) => ({ ...s, ownedRelics: [...s.ownedRelics, reward] }));
      // 图鉴记录：获得怪兽契约遗物
      useCodexStore.getState().recordRelic(reward.id);
    }
    // 图鉴记录：遭遇怪兽（即使拒绝也已遭遇，这里确保接受时记录）
    useCodexStore.getState().recordMonster(state.currentMonsterId as MonsterId);

    // 增加堕落值
    set((s) => ({ ...s, corruption: Math.min(100, s.corruption + monster.pact.corruption) }));

    // 成就追踪：接受怪兽契约
    const achMonster = useAchievementStore.getState();
    achMonster.recordMonsterPact();
    achMonster.checkAchievements({
      runKills: state.killCount,
      currentWave: state.wave,
      bestCombo: state.bestCombo,
      currentCombo: state.combo,
      runSkillsUsed: state.runSkillUses,
      energy: state.energy,
      hpLostInRun: state.hpLostInRun + (monster.pact.cost.hp === 99 ? Math.floor(state.hp / 2) : (monster.pact.cost.hp || 0)),
    });

    // 推进到下一波
    set((s) => ({
      ...s,
      pendingStory: null,
      currentMonsterId: null,
    }));
    sfx.relic();
    const newState = { ...get() };
    startWave(newState, state.wave + 1);
    set(newState);
  },

  // 拒绝怪兽契约
  rejectMonsterPact: () => {
    // 图鉴记录：拒绝也算遭遇怪兽
    const monId = get().currentMonsterId;
    if (monId) {
      useCodexStore.getState().recordMonster(monId as MonsterId);
    }
    set((s) => ({
      ...s,
      pendingStory: null,
      currentMonsterId: null,
    }));
    const state = get();
    const newState = { ...state };
    startWave(newState, state.wave + 1);
    set(newState);
  },

  tick: (dt, now) => {
    set((s) => {
      // 仅 playing / wave-intro / wave-clear 状态下推进
      if (s.status !== 'playing' && s.status !== 'wave-intro' && s.status !== 'wave-clear') {
        return s;
      }
      const newState: GameState = {
        ...s,
        grid: s.grid.map(row => [...row]),
        enemies: [...s.enemies],
        projectiles: [...s.projectiles],
        particles: [...s.particles],
        synergies: [...s.synergies],
      };

      // Placement charges refill only while the battle clock is running.
      if (s.status === 'playing') newState.deploymentCharge = Math.min(6, s.deploymentCharge + dt / 2);

      // 安全检查：如果状态是 playing 但波次生成器丢失，重新初始化当前波次
      if (s.status === 'playing' && !waveSpawnState && s.wave > 0) {
        startWave(newState, s.wave);
      }

      // 羁绊系统：每 500ms 重算一次激活的羁绊（基于网格星核分布）
      bondRecalcAccum += dt;
      if (bondRecalcAccum >= 0.5) {
        bondRecalcAccum = 0;
        newState.activeBonds = computeActiveBonds(newState.grid);
      }

      // 更新波次生成
      updateWaveSpawns(newState, now, dt);

      // 战斗
      const combatParticles = processCombat(newState, now, dt);
      newState.particles = [...newState.particles, ...combatParticles];

      // 波次事件效果（流星雨、星尘雨等）
      const eventParticles = processWaveEvent(newState, now, dt);
      newState.particles = [...newState.particles, ...eventParticles];

      // 粒子更新
      for (const p of newState.particles) {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        if (p.gravity) p.vy += p.gravity * dt;
        p.life -= dt;
      }
      newState.particles = newState.particles.filter(p => p.life > 0).slice(-200);

      // 检查波次清除
      if (newState.status === 'wave-clear') {
        // 首次进入 wave-clear，记录时间戳 + 天赋回复生命
        if (newState.waveClearTime === 0) {
          newState.waveClearTime = now;
          // 天赋：自愈印记（hp-regen）每波结束回复 1 HP
          const hpRegenTalent = getTalentEffectSum(newState.unlockedTalents, 'hp-regen' as TalentEffect);
          if (hpRegenTalent > 0) {
            newState.hp = Math.min(newState.maxHp, newState.hp + hpRegenTalent);
          }
        }
        // 1.5 秒后进入商店（让结算面板有时间显示）
        if (now - newState.waveClearTime > 1500) {
          // 挑战修饰符：no_shop 模式跳过商店，自动给遗物 + 进入下一波
          const flags = getChallengeFlagsSafe(newState);
          if (flags.noShop) {
            // 自动给一个随机遗物
            if (flags.autoRelicPerWave) {
              const autoRelics = rollRelics(3, 1);
              if (autoRelics.length > 0) {
                newState.relicChoices = autoRelics;
                newState.status = 'relic-select';
                newState.waveClearTime = 0;
                waveSpawnState = null;
                sfx.waveClear();
              } else {
                // 没有可选遗物，直接下一波
                startWave(newState, newState.wave + 1);
                newState.waveClearTime = 0;
              }
            } else {
              startWave(newState, newState.wave + 1);
              newState.waveClearTime = 0;
            }
          } else {
            newState.status = 'shop';
            newState.shopItems = generateShopItems(newState);
            const baseRerolls = 1 + (newState.ownedRelics.some(r => r.id === 'extraReroll1') ? 1 : 0);
            newState.rerollsLeft = baseRerolls;
            waveSpawnState = null;
            newState.waveClearTime = 0;
            sfx.waveClear();
          }
        }
      }

      return newState;
    });
  },

  setCurrentElement: (el) => {
    set((s) => ({ ...s, currentElement: el }));
  },

  togglePause: () => {
    set((s) => {
      // 只在 playing 状态下可暂停（剧情/商店/结算界面已自动暂停）
      if (s.status === 'playing') {
        return { ...s, status: 'paused', prevStatus: 'playing' };
      }
      if (s.status === 'paused' && s.prevStatus) {
        return { ...s, status: s.prevStatus, prevStatus: null };
      }
      return s;
    });
  },

  activateSkill: (skillId) => {
    set((s) => {
      // 只在 playing 状态可释放
      if (s.status !== 'playing') return s;
      const cfg = SKILLS[skillId];
      if (!cfg) return s;
      // 检查能量
      if (s.energy < cfg.cost) return s;
      // 检查冷却
      if (s.skillCooldowns[skillId] > 0) return s;

      const newState = { ...s };
      newState.energy -= cfg.cost;
      // 挑战：技能冷却倍率（energy_overflow -50%）
      const cdMult = getChallengeFlagsSafe(s).skillCooldownMult ?? 1;
      newState.skillCooldowns = { ...s.skillCooldowns, [skillId]: Math.floor(cfg.cooldown * cdMult) };
      newState.screenShake = 0.6;

      // 成就追踪：技能使用
      if (!newState.runSkillUses.includes(skillId)) {
        newState.runSkillUses = [...newState.runSkillUses, skillId];
      }
      const ach = useAchievementStore.getState();
      ach.recordSkillUse(skillId);

      // 应用技能效果
      if (skillId === 'meteor') {
        // 陨石爆破：对所有敌人造成伤害
        const dmg = (cfg.damage || 60) + (cfg.damagePerWave || 0) * newState.wave;
        for (const enemy of newState.enemies) {
          enemy.hp -= dmg;
          enemy.hitFlash = 300;
        }
        // 陨石特效粒子
        for (let i = 0; i < 40; i++) {
          const a = Math.random() * Math.PI * 2;
          const r = 100 + Math.random() * 150;
          newState.particles.push({
            id: uid('met'),
            x: 200 + Math.cos(a) * r * 0.3,
            y: 200 + Math.sin(a) * r * 0.3,
            vx: Math.cos(a) * (100 + Math.random() * 200),
            vy: Math.sin(a) * (100 + Math.random() * 200) + 80,
            life: 1.2,
            maxLife: 1.2,
            size: 4 + Math.random() * 3,
            color: ['#FF6B6B', '#FFD166', '#FF8E3C'][Math.floor(Math.random() * 3)],
            kind: 'explosion',
            gravity: 200,
          });
        }
      } else if (skillId === 'time-freeze') {
        // 时空冻结：所有敌人冻结 4 秒
        const dur = cfg.freezeDuration || 4000;
        for (const enemy of newState.enemies) {
          // 叠加替换已有 freeze 效果
          enemy.effects = enemy.effects.filter(e => e.type !== 'freeze' && e.type !== 'slow');
          enemy.effects.push({ type: 'freeze', duration: dur, value: 1, source: 'skill' });
        }
        // 冰晶特效粒子
        for (let i = 0; i < 30; i++) {
          const a = Math.random() * Math.PI * 2;
          newState.particles.push({
            id: uid('frz'),
            x: 200 + (Math.random() - 0.5) * 350,
            y: 200 + (Math.random() - 0.5) * 350,
            vx: Math.cos(a) * 40,
            vy: Math.sin(a) * 40,
            life: 1.5,
            maxLife: 1.5,
            size: 3 + Math.random() * 2,
            color: '#7FE5DD',
            kind: 'spark',
          });
        }
      } else if (skillId === 'elemental-storm') {
        // 元素风暴：当前元素全场连锁
        const baseDmg = (cfg.damage || 35) + (cfg.damagePerWave || 0) * newState.wave;
        const elemColor = ELEMENTS[newState.currentElement].color;
        const chain = cfg.chainCount || 3;
        // 对每个敌人造成 chain 次伤害
        for (const enemy of newState.enemies) {
          for (let i = 0; i < chain; i++) {
            enemy.hp -= baseDmg;
          }
          enemy.hitFlash = 400;
        }
        // 元素冲击特效粒子
        for (let i = 0; i < 60; i++) {
          const a = (Math.PI * 2 * i) / 60;
          newState.particles.push({
            id: uid('storm'),
            x: 200,
            y: 200,
            vx: Math.cos(a) * 250,
            vy: Math.sin(a) * 250,
            life: 1.0,
            maxLife: 1.0,
            size: 5,
            color: elemColor,
            kind: 'spark',
          });
        }
      }

      // 技能音效
      sfx.crit();

      // 成就检测：技能类
      ach.checkAchievements({
        runKills: newState.killCount,
        currentWave: newState.wave,
        bestCombo: newState.bestCombo,
        currentCombo: newState.combo,
        runSkillsUsed: newState.runSkillUses,
        energy: newState.energy,
        hpLostInRun: newState.hpLostInRun,
      });

      return newState;
    });
  },

  endRun: () => {
    const s = get();
    return {
      wave: s.wave,
      score: Math.floor(s.score),
      kills: s.killCount,
      stardust: Math.floor(s.score / 10) + s.killCount * 2 + s.wave * 5,
    };
  },
}));

// 重置波次状态（用于重开）
export function resetWaveSpawnState() {
  waveSpawnState = null;
}

// 开发模式下暴露 store 到 window，方便调试
if (import.meta.env.DEV && typeof window !== 'undefined') {
  (window as unknown as { __gameStore: typeof useGameStore }).__gameStore = useGameStore;
}

// 供引擎直接访问
export { startWave };
