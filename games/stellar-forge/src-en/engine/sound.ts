// 简易音效系统 - 使用 Web Audio API 合成，无需外部资源
let ctx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let enabled = true;

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    try {
      const AC = window.AudioContext || (window as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      masterGain = ctx.createGain();
      masterGain.gain.value = 0.18;
      masterGain.connect(ctx.destination);
    } catch {
      return null;
    }
  }
  // 浏览器需要用户交互后才能播放
  if (ctx && ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }
  return ctx;
}

export function setSoundEnabled(v: boolean) {
  enabled = v;
  if (masterGain) masterGain.gain.value = v ? 0.18 : 0;
}

export function isSoundEnabled() {
  return enabled;
}

// 播放单音
function tone(
  freq: number,
  duration: number,
  type: OscillatorType = 'sine',
  vol = 0.5,
  delay = 0,
  freqEnd?: number
) {
  const c = getCtx();
  if (!c || !masterGain || !enabled) return;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  if (freqEnd !== undefined) {
    osc.frequency.exponentialRampToValueAtTime(Math.max(20, freqEnd), c.currentTime + duration);
  }
  const t0 = c.currentTime + delay;
  gain.gain.setValueAtTime(0, t0);
  gain.gain.linearRampToValueAtTime(vol, t0 + 0.005);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  osc.connect(gain);
  gain.connect(masterGain);
  osc.start(t0);
  osc.stop(t0 + duration + 0.05);
}

// 噪声（爆炸用）
function noise(duration: number, vol = 0.4, delay = 0) {
  const c = getCtx();
  if (!c || !masterGain || !enabled) return;
  const bufferSize = Math.floor(c.sampleRate * duration);
  const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2);
  }
  const src = c.createBufferSource();
  src.buffer = buffer;
  const gain = c.createGain();
  gain.gain.value = vol;
  const filter = c.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 1500;
  src.connect(filter);
  filter.connect(gain);
  gain.connect(masterGain);
  const t0 = c.currentTime + delay;
  src.start(t0);
}

// ============= 游戏音效 =============
export const sfx = {
  drop: () => tone(440, 0.08, 'triangle', 0.3, 0, 660),
  merge: () => {
    tone(523, 0.1, 'sine', 0.4, 0, 784);
    tone(784, 0.12, 'sine', 0.3, 0.06, 1047);
  },
  shoot: (element: string) => {
    const f = element === 'fire' ? 660 : element === 'water' ? 440 : element === 'earth' ? 330 : element === 'air' ? 880 : 550;
    tone(f, 0.05, 'square', 0.15, 0, f * 1.2);
  },
  hit: () => tone(220, 0.06, 'sawtooth', 0.25, 0, 110),
  crit: () => {
    tone(880, 0.08, 'square', 0.35, 0, 1320);
    tone(1320, 0.1, 'sine', 0.25, 0.04);
  },
  kill: () => {
    noise(0.12, 0.3);
    tone(330, 0.15, 'sawtooth', 0.3, 0, 110);
  },
  bossKill: () => {
    noise(0.4, 0.5);
    tone(110, 0.5, 'sawtooth', 0.4, 0, 55);
    tone(220, 0.5, 'square', 0.3, 0.1, 110);
  },
  evolve: () => {
    tone(523, 0.1, 'sine', 0.4, 0, 659);
    tone(659, 0.1, 'sine', 0.4, 0.08, 784);
    tone(784, 0.15, 'sine', 0.5, 0.16, 1047);
    tone(1047, 0.2, 'sine', 0.4, 0.24);
  },
  shop: () => {
    tone(659, 0.1, 'triangle', 0.3, 0, 880);
    tone(880, 0.12, 'triangle', 0.3, 0.08);
  },
  relic: () => {
    tone(523, 0.15, 'sine', 0.4, 0, 784);
    tone(784, 0.2, 'sine', 0.4, 0.1, 1047);
    tone(1047, 0.25, 'sine', 0.3, 0.2);
  },
  buy: () => tone(880, 0.1, 'square', 0.3, 0, 1100),
  hurt: () => {
    tone(110, 0.2, 'sawtooth', 0.5, 0, 80);
    noise(0.15, 0.3);
  },
  waveClear: () => {
    tone(523, 0.12, 'sine', 0.3, 0, 659);
    tone(659, 0.12, 'sine', 0.3, 0.1, 784);
    tone(784, 0.15, 'sine', 0.4, 0.2, 1047);
    tone(1047, 0.25, 'sine', 0.4, 0.3);
  },
  gameOver: () => {
    tone(440, 0.3, 'sawtooth', 0.4, 0, 220);
    tone(220, 0.4, 'sawtooth', 0.4, 0.2, 110);
    tone(110, 0.6, 'sine', 0.5, 0.4, 55);
  },
  waveStart: () => tone(330, 0.15, 'triangle', 0.3, 0, 440),
};
