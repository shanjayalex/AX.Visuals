"use client";

/**
 * Tiny synthesised sound kit (no audio files to download).
 * Off by default; toggled from the nav and remembered per visitor.
 */

let ctx: AudioContext | null = null;
let enabled = false;
const listeners = new Set<(on: boolean) => void>();

function ac() {
  if (!ctx) ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function noiseBurst(duration: number, freq: number, q: number, gain: number, when = 0) {
  const a = ac();
  const len = Math.floor(a.sampleRate * duration);
  const buf = a.createBuffer(1, len, a.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
  const src = a.createBufferSource();
  src.buffer = buf;
  const bp = a.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = freq;
  bp.Q.value = q;
  const g = a.createGain();
  g.gain.value = gain;
  src.connect(bp).connect(g).connect(a.destination);
  src.start(a.currentTime + when);
}

export const sound = {
  get on() {
    return enabled;
  },
  init() {
    try {
      enabled = localStorage.getItem("ax-sound") === "1";
    } catch {
      enabled = false;
    }
    listeners.forEach((l) => l(enabled));
  },
  set(on: boolean) {
    enabled = on;
    try {
      localStorage.setItem("ax-sound", on ? "1" : "0");
    } catch {}
    listeners.forEach((l) => l(on));
    if (on) this.shutter();
  },
  subscribe(fn: (on: boolean) => void) {
    listeners.add(fn);
    return () => void listeners.delete(fn);
  },
  shutter() {
    if (!enabled) return;
    noiseBurst(0.035, 3200, 1.2, 0.5);
    noiseBurst(0.05, 1800, 1.5, 0.4, 0.07);
  },
  clap() {
    if (!enabled) return;
    noiseBurst(0.09, 1400, 0.8, 0.9);
    noiseBurst(0.04, 4000, 2, 0.3, 0.01);
  },
  tick() {
    if (!enabled) return;
    noiseBurst(0.012, 5200, 3, 0.15);
  },
};
