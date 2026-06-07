// Lightweight canvas confetti. Respects prefers-reduced-motion.
// No external dependencies. Cleans up after itself.

type Piece = {
  x: number; y: number;
  vx: number; vy: number;
  size: number;
  rot: number; vr: number;
  color: string;
  shape: 0 | 1; // 0 rect, 1 circle
  life: number;
};

const COLORS = ["#E2725B", "#F4A261", "#E9C46A", "#2A9D8F", "#264653", "#F4E1C1"];

export function fireConfetti(opts: { particles?: number; duration?: number } = {}) {
  if (typeof window === "undefined") return;
  const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return;

  const count = opts.particles ?? 140;
  const duration = opts.duration ?? 2600;

  const canvas = document.createElement("canvas");
  canvas.style.cssText =
    "position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:9999;";
  canvas.setAttribute("aria-hidden", "true");
  document.body.appendChild(canvas);

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const resize = () => {
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
  };
  resize();
  window.addEventListener("resize", resize);

  const ctx = canvas.getContext("2d");
  if (!ctx) { canvas.remove(); return; }
  ctx.scale(dpr, dpr);

  const W = () => window.innerWidth;
  const H = () => window.innerHeight;
  const pieces: Piece[] = [];

  const spawn = (originX: number) => {
    for (let i = 0; i < count / 2; i++) {
      const angle = (-Math.PI / 2) + (Math.random() - 0.5) * 1.1;
      const speed = 6 + Math.random() * 8;
      pieces.push({
        x: originX,
        y: H() + 10,
        vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 2,
        vy: Math.sin(angle) * speed - 4 - Math.random() * 4,
        size: 5 + Math.random() * 6,
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.3,
        color: COLORS[(Math.random() * COLORS.length) | 0],
        shape: Math.random() < 0.4 ? 1 : 0,
        life: 1,
      });
    }
  };
  spawn(W() * 0.2);
  spawn(W() * 0.8);

  const start = performance.now();
  let raf = 0;

  const tick = (now: number) => {
    const elapsed = now - start;
    ctx.clearRect(0, 0, W(), H());
    for (const p of pieces) {
      p.vy += 0.18; // gravity
      p.vx *= 0.995;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      if (p.y > H() + 20) p.life = 0;
      if (p.life <= 0) continue;
      const alpha = elapsed > duration - 600 ? Math.max(0, (duration - elapsed) / 600) : 1;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      if (p.shape === 0) {
        ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.6);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
    ctx.globalAlpha = 1;
    if (elapsed < duration) {
      raf = requestAnimationFrame(tick);
    } else {
      cleanup();
    }
  };

  const cleanup = () => {
    cancelAnimationFrame(raf);
    window.removeEventListener("resize", resize);
    canvas.remove();
  };

  raf = requestAnimationFrame(tick);
}
