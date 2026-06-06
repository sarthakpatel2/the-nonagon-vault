import { useEffect, useRef, useState } from "react";

/**
 * Soft warm cursor halo that lerps toward the mouse for a buttery feel.
 * Grows on interactive elements. Hidden on touch / reduced-motion.
 */
export function CursorGlow() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: -100, y: -100 });
  const ring = useRef({ x: -100, y: -100 });
  const [hovering, setHovering] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!hasFinePointer || reduced) return;
    setEnabled(true);

    const onMove = (e: MouseEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
      const el = e.target as HTMLElement | null;
      setHovering(
        !!el?.closest("a, button, [role='button'], input, textarea, label, .hover-tilt, .group")
      );
    };

    let raf = 0;
    const loop = () => {
      ring.current.x += (target.current.x - ring.current.x) * 0.18;
      ring.current.y += (target.current.y - ring.current.y) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.current.x}px, ${ring.current.y}px, 0)`;
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
        className="pointer-events-none fixed left-0 top-0 z-[60] -ml-12 -mt-12 h-24 w-24 rounded-full mix-blend-multiply transition-[opacity,scale,filter] duration-300 will-change-transform"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, oklch(0.78 0.18 38 / 0.35), oklch(0.78 0.18 38 / 0) 70%)",
          filter: hovering ? "blur(6px)" : "blur(14px)",
          opacity: hovering ? 0.9 : 0.55,
          scale: hovering ? "1.25" : "1",
        }}
      />
      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[61] -ml-[3px] -mt-[3px] h-1.5 w-1.5 rounded-full bg-brand will-change-transform"
      />
    </>
  );
}
