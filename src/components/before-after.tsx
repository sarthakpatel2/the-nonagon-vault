import { useCallback, useEffect, useRef, useState } from "react";

type Props = {
  beforeSrc: string;
  afterSrc: string;
  beforeLabel?: string;
  afterLabel?: string;
  alt: string;
  beforeFilter?: string; // CSS filter applied to before image (for placeholder fallbacks)
  className?: string;
};

export function BeforeAfter({
  beforeSrc,
  afterSrc,
  beforeLabel = "Freshers",
  afterLabel = "Final Year",
  alt,
  beforeFilter,
  className = "",
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(50);
  const draggingRef = useRef(false);

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(0, Math.min(100, x)));
  }, []);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!draggingRef.current) return;
      e.preventDefault();
      updateFromClientX(e.clientX);
    };
    const onUp = () => {
      draggingRef.current = false;
    };
    window.addEventListener("pointermove", onMove, { passive: false });
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [updateFromClientX]);

  const onPointerDown = (e: React.PointerEvent) => {
    draggingRef.current = true;
    updateFromClientX(e.clientX);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") setPos((p) => Math.max(0, p - 4));
    if (e.key === "ArrowRight") setPos((p) => Math.min(100, p + 4));
    if (e.key === "Home") setPos(0);
    if (e.key === "End") setPos(100);
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={onPointerDown}
      className={`relative w-full aspect-[4/5] overflow-hidden rounded-xl select-none touch-none cursor-ew-resize bg-charcoal ${className}`}
    >
      {/* AFTER (full) */}
      <img
        src={afterSrc}
        alt={`${alt} — ${afterLabel}`}
        draggable={false}
        className="absolute inset-0 w-full h-full object-contain bg-charcoal pointer-events-none"
      />
      {/* BEFORE (clipped) */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      >
        <img
          src={beforeSrc}
          alt={`${alt} — ${beforeLabel}`}
          draggable={false}
          style={beforeFilter ? { filter: beforeFilter } : undefined}
          className="absolute inset-0 w-full h-full object-contain bg-charcoal"
        />
      </div>

      {/* Labels */}
      <span className="absolute top-3 left-3 font-mono text-[10px] tracking-[0.2em] uppercase px-2 py-1 rounded bg-black/50 text-white backdrop-blur-sm">
        {beforeLabel}
      </span>
      <span className="absolute top-3 right-3 font-mono text-[10px] tracking-[0.2em] uppercase px-2 py-1 rounded bg-black/50 text-white backdrop-blur-sm">
        {afterLabel}
      </span>

      {/* Handle */}
      <div
        role="slider"
        tabIndex={0}
        aria-label={`${alt} before/after slider`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pos)}
        onKeyDown={onKeyDown}
        className="absolute top-0 bottom-0 w-[2px] bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.25)] outline-none"
        style={{ left: `${pos}%`, transform: "translateX(-50%)" }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-charcoal">
            <polyline points="15 18 9 12 15 6" />
            <polyline points="9 6 15 12 9 18" />
          </svg>
        </div>
      </div>
    </div>
  );
}
