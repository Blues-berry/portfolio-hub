import { WaveConfig, WaveSpawn } from '@/types/game';

// The twentieth wave closes the main run with the final maiden encounter.
export const FINAL_WAVE = 20;

// 程序化生成波次配置
export function generateWave(wave: number): WaveConfig {
  // 终极 Boss 波：每 20 波一个终极 Boss（堕落少女）
  if (wave === FINAL_WAVE) {
    return {
      wave,
      isBoss: true,
      reward: 200,
      spawns: [
        { type: 'maiden', count: 1, interval: 0, delay: 2000 },
        { type: 'rift', count: 4, interval: 1500, delay: 5000 },
      ],
    };
  }

  // Boss 波：每 5 波一个 Boss
  if (wave % 5 === 0) {
    const spawns: WaveSpawn[] = [
      { type: 'boss', count: 1, interval: 0, delay: 1500 },
      { type: 'grunt', count: 4 + Math.floor(wave / 5), interval: 800, delay: 3000 },
    ];
    if (wave >= 10) {
      spawns.push({ type: 'rift', count: 2, interval: 1200, delay: 5000 });
    }
    if (wave >= 15) {
      spawns.push({ type: 'corrupt', count: 2, interval: 2000, delay: 6000 });
    }
    return {
      wave,
      isBoss: true,
      reward: 40 + wave * 3,
      spawns,
    };
  }

  // 精英波：每 3 波混入精英
  if (wave % 3 === 0) {
    const spawns: WaveSpawn[] = [
      { type: 'grunt', count: 6 + wave, interval: 700, delay: 0 },
      { type: 'elite', count: 1 + Math.floor(wave / 6), interval: 2000, delay: 2000 },
    ];
    if (wave >= 9) {
      spawns.push({ type: 'reaper', count: 2 + Math.floor(wave / 6), interval: 800, delay: 4000 });
    }
    return { wave, reward: 18 + wave * 2, spawns };
  }

  // 混合波：4 波之后开始复杂
  if (wave >= 4) {
    const spawns: WaveSpawn[] = [
      { type: 'grunt', count: 5 + wave, interval: 600, delay: 0 },
    ];

    if (wave >= 5) {
      spawns.push({ type: 'fast', count: 3 + Math.floor(wave / 3), interval: 500, delay: 1500 });
    }
    if (wave >= 6) {
      spawns.push({ type: 'armored', count: 2 + Math.floor(wave / 4), interval: 1000, delay: 2500 });
    }
    if (wave >= 7) {
      spawns.push({ type: 'swarm', count: 6 + Math.floor(wave / 2), interval: 250, delay: 1800 });
    }
    if (wave >= 8) {
      spawns.push({ type: 'flyer', count: 2 + Math.floor(wave / 5), interval: 700, delay: 3500 });
    }
    if (wave >= 9) {
      spawns.push({ type: 'healer', count: 1 + Math.floor(wave / 8), interval: 1500, delay: 4000 });
    }
    if (wave >= 10) {
      spawns.push({ type: 'rift', count: 1 + Math.floor(wave / 8), interval: 1500, delay: 5000 });
    }
    if (wave >= 11) {
      spawns.push({ type: 'reaper', count: 1 + Math.floor(wave / 10), interval: 1000, delay: 4500 });
    }
    if (wave >= 12) {
      spawns.push({ type: 'corrupt', count: 1 + Math.floor(wave / 12), interval: 2500, delay: 6000 });
    }

    return { wave, reward: 10 + wave * 2, spawns };
  }

  // 早期教学波
  if (wave === 1) {
    return {
      wave,
      reward: 8,
      spawns: [
        { type: 'grunt', count: 3, interval: 1400, delay: 1500 },
      ],
    };
  }
  if (wave === 2) {
    return {
      wave,
      reward: 10,
      spawns: [
        { type: 'grunt', count: 5, interval: 1100, delay: 1200 },
      ],
    };
  }
  if (wave === 3) {
    return {
      wave,
      reward: 12,
      spawns: [
        { type: 'grunt', count: 5, interval: 900, delay: 800 },
        { type: 'fast', count: 2, interval: 700, delay: 2500 },
      ],
    };
  }

  // 默认
  return {
    wave,
    reward: 10 + wave,
    spawns: [{ type: 'grunt', count: 5 + wave, interval: 700, delay: 500 }],
  };
}
