// Subtle audio + haptic feedback for the quiz.
// Uses WebAudio so no asset is needed. Safe no-ops on SSR / unsupported browsers.

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
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
  tone({ freq: 523.25, duration: 0.18, type: "sine", gain: 0.07 });            // C5
  tone({ freq: 783.99, duration: 0.28, type: "sine", gain: 0.06, delay: 0.12 }); // G5
  tone({ freq: 1046.5, duration: 0.5,  type: "sine", gain: 0.04, delay: 0.22 }); // C6 shimmer
  vibrate([12, 40, 18]);
}

// Soft, low descending thud — gentle, not punishing
export function playWrong() {
  tone({ freq: 220, duration: 0.32, type: "sine",   gain: 0.07, glide: 110 });
  tone({ freq: 165, duration: 0.42, type: "triangle", gain: 0.05, glide: 90, delay: 0.04 });
  vibrate([24, 30, 24]);
}
