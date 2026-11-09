(function (root) {
  'use strict';
  const STAGES = [
    { name: ['Training Ring', '训练轨道'], target: 4, packages: 6, hazards: false, gap: 2.8, speed: .72 },
    { name: ['Debris Watch', '碎片警戒'], target: 5, packages: 7, hazards: true, gap: 2.6, speed: .82 },
    { name: ['Coral Express', '珊瑚快线'], target: 6, packages: 8, hazards: true, gap: 2.4, speed: .92 },
    { name: ['Night Shift', '夜间航线'], target: 7, packages: 9, hazards: true, gap: 2.2, speed: 1.02 },
    { name: ['Homebound', '归航'], target: 8, packages: 10, hazards: true, gap: 2.0, speed: 1.12 },
  ];
  function eventsFor(index) {
    const cfg = STAGES[index];
    if (!cfg) throw new RangeError('Unknown stage');
    const events = []; let n = 0;
    for (let i = 0; i < cfg.packages; i++) {
      events.push({ at: 4 + n++ * cfg.gap, lane: (i + index) % 2, kind: 'parcel' });
      if (cfg.hazards && i % 2 === 1) events.push({ at: 4 + n++ * cfg.gap, lane: (i + index) % 2, kind: 'debris' });
    }
    return events;
  }
  function create(index) {
    const events = eventsFor(index);
    return { index, time: 0, lane: 0, hp: 3, delivered: 0, missed: 0, cursor: 0, events, end: events[events.length - 1].at + 1.2, status: 'playing', last: null, switches: 0 };
  }
  function switchLane(state) { if (state.status === 'playing') { state.lane = 1 - state.lane; state.switches++; return true; } return false; }
  function step(state, dt) {
    if (state.status !== 'playing' || !Number.isFinite(dt) || dt <= 0) return [];
    state.time = Math.min(state.end, state.time + dt);
    const results = [];
    while (state.cursor < state.events.length && state.events[state.cursor].at <= state.time) {
      const event = state.events[state.cursor++];
      let type = 'safe';
      if (event.kind === 'parcel') {
        if (event.lane === state.lane) { state.delivered++; type = 'delivered'; } else { state.missed++; type = 'missed'; }
      } else if (event.lane === state.lane) { state.hp--; type = 'hit'; }
      state.last = { type, at: state.time }; results.push(type);
      if (state.hp <= 0) { state.status = 'lost'; break; }
    }
    if (state.status === 'playing' && state.time >= state.end) state.status = state.delivered >= STAGES[state.index].target ? 'won' : 'lost';
    return results;
  }
  const api = { STAGES, eventsFor, create, switchLane, step };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.OrbitRules = api;
})(typeof window !== 'undefined' ? window : globalThis);
