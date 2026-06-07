import { useEffect, useRef, useState } from "react";

/**
 * Soft warm cursor halo that lerps toward the mouse for a buttery feel.
 * Grows on interactive elements. Hidden on touch / reduced-motion.
 *
 * Perf notes:
 *  - No React state per mousemove — hover is toggled via classList.
 *  - Single rAF loop drives both ring lerp + dot position.
 *  - No filter transitions (blur animations trigger paint every frame).
 */
export function CursorGlow() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: -100, y: -100 });
  const ring = useRef({ x: -100, y: -100 });
  const hovering = useRef(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!hasFinePointer || reduced) return;
    setEnabled(true);

    let pendingHoverCheck = false;
    const onMove = (e: MouseEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
      // Hover detection is cheap but DOM-touching — coalesce to one per frame.
      if (!pendingHoverCheck) {
        pendingHoverCheck = true;
        const el = e.target as HTMLElement | null;
        requestAnimationFrame(() => {
          pendingHoverCheck = false;
          const isHover = !!el?.closest(
            "a, button, [role='button'], input, textarea, label, .hover-tilt, .tilt-card"
          );
          if (isHover !== hovering.current) {
            hovering.current = isHover;
            ringRef.current?.classList.toggle("is-hover", isHover);
          }
        });
      }
    };

    let raf = 0;
    let last = 0;
    const loop = (t: number) => {
      // Skip frame if browser is already busy (>32ms since last) to avoid jank cascade.
      const dt = Math.min(32, t - last) || 16;
      last = t;
      const k = 1 - Math.pow(1 - 0.18, dt / 16);
      ring.current.x += (target.current.x - ring.current.x) * k;
      ring.current.y += (target.current.y - ring.current.y) * k;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.current.x}px, ${ring.current.y}px, 0)`;
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${target.current.x}px, ${target.current.y}px, 0)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden
        className="cursor-glow-ring pointer-events-none fixed left-0 top-0 z-[60] -ml-12 -mt-12 h-24 w-24 rounded-full mix-blend-multiply will-change-transform"
      />
      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[61] -ml-[3px] -mt-[3px] h-1.5 w-1.5 rounded-full bg-brand will-change-transform"
      />
    </>
  );
}
