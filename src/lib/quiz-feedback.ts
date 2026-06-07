// Subtle audio + haptic feedback for the quiz.
// Uses WebAudio so no asset is needed. Safe no-ops on SSR / unsupported browsers.

let ctx: AudioContext | null = null;
const MUTE_KEY = "quiz:muted";

export function isMuted(): boolean {
  if (typeof window === "undefined") return false;
  try { return window.localStorage.getItem(MUTE_KEY) === "1"; } catch { return false; }
}

export function setMuted(v: boolean) {
  if (typeof window === "undefined") return;
  try { window.localStorage.setItem(MUTE_KEY, v ? "1" : "0"); } catch {}
}

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (isMuted()) return null;
  const AC = window.AudioContext || (window as any).webkitAudioContext;
  if (!AC) return null;
  if (!ctx) ctx = new AC();
  if (ctx.state === "suspended") ctx.resume().catch(() => {});
  return ctx;
}

type ToneOpts = {
  freq: number;
  duration: number;
  type?: OscillatorType;
  gain?: number;
  glide?: number; // target freq
  delay?: number;
};

function tone({ freq, duration, type = "sine", gain = 0.06, glide, delay = 0 }: ToneOpts) {
  const c = getCtx();
  if (!c) return;
  const t0 = c.currentTime + delay;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (glide !== undefined) osc.frequency.exponentialRampToValueAtTime(Math.max(1, glide), t0 + duration);
  g.gain.setValueAtTime(0, t0);
  g.gain.linearRampToValueAtTime(gain, t0 + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  osc.connect(g).connect(c.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.02);
}

function vibrate(pattern: number | number[]) {
  if (typeof navigator === "undefined") return;
  if (isMuted()) return;
  if (typeof navigator.vibrate === "function") {
    try { navigator.vibrate(pattern); } catch {}
  }
}

// Soft tick when an option is tapped
export function playTap() {
  tone({ freq: 320, duration: 0.05, type: "triangle", gain: 0.04 });
  vibrate(8);
}

// Warm two-note chime synced to the stamp drop
export function playCorrect() {
  tone({ freq: 523.25, duration: 0.18, type: "sine", gain: 0.07 });
  tone({ freq: 783.99, duration: 0.28, type: "sine", gain: 0.06, delay: 0.12 });
  tone({ freq: 1046.5, duration: 0.5,  type: "sine", gain: 0.04, delay: 0.22 });
  vibrate([12, 40, 18]);
}

// Soft, low descending thud — gentle, not punishing
export function playWrong() {
  tone({ freq: 220, duration: 0.32, type: "sine",   gain: 0.07, glide: 110 });
  tone({ freq: 165, duration: 0.42, type: "triangle", gain: 0.05, glide: 90, delay: 0.04 });
  vibrate([24, 30, 24]);
}

// Warm celebratory arpeggio for quiz completion
export function playFinale() {
  // C major rising arpeggio with shimmer
  tone({ freq: 523.25, duration: 0.30, type: "triangle", gain: 0.07 });
  tone({ freq: 659.25, duration: 0.30, type: "triangle", gain: 0.07, delay: 0.10 });
  tone({ freq: 783.99, duration: 0.32, type: "triangle", gain: 0.07, delay: 0.20 });
  tone({ freq: 1046.5, duration: 0.60, type: "sine",     gain: 0.06, delay: 0.32 });
  tone({ freq: 1567.98, duration: 0.55, type: "sine",    gain: 0.035, delay: 0.45 });
  vibrate([18, 50, 24, 60, 30]);
}
