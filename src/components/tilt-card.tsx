import { useRef, type ReactNode, type CSSProperties } from "react";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  max?: number;
  glare?: boolean;
  style?: CSSProperties;
}

/**
 * 3D mouse-tracked tilt with a subtle moving glare.
 * Pure CSS variables + rAF — no library.
 *
 * Perf notes:
 *  - Skips on coarse pointers (touch) — no listeners attached.
 *  - Single rAF coalesces moves; latest pointer wins.
 *  - `will-change` only enabled while pointer is over the card.
 */
export function TiltCard({
  children,
  className = "",
  max = 8,
  glare = true,
  style,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  const latest = useRef({ rx: 0, ry: 0, gx: 50, gy: 50 });

  const isFinePointer =
    typeof window !== "undefined" &&
    window.matchMedia("(pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isFinePointer || e.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    latest.current.rx = (0.5 - py) * max;
    latest.current.ry = (px - 0.5) * max;
    latest.current.gx = px * 100;
    latest.current.gy = py * 100;
    if (frame.current) return;
    frame.current = requestAnimationFrame(() => {
      frame.current = 0;
      const { rx, ry, gx, gy } = latest.current;
      el.style.setProperty("--rx", `${rx}deg`);
      el.style.setProperty("--ry", `${ry}deg`);
      el.style.setProperty("--gx", `${gx}%`);
      el.style.setProperty("--gy", `${gy}%`);
    });
  };

  const handleEnter = () => {
    if (!isFinePointer) return;
    ref.current?.classList.add("is-active");
  };

  const handleLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.classList.remove("is-active");
    el.style.setProperty("--rx", `0deg`);
    el.style.setProperty("--ry", `0deg`);
  };

  return (
    <div
      ref={ref}
      onPointerEnter={handleEnter}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      className={`tilt-card ${className}`}
      style={style}
    >
      <div className="tilt-card__inner">
        {children}
        {glare && <span className="tilt-card__glare" aria-hidden />}
      </div>
    </div>
  );
}
