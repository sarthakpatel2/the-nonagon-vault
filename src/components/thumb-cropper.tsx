import { useCallback, useRef } from "react";
import { Move, ZoomIn } from "lucide-react";
import type { CropState } from "@/lib/thumb-crop";

/**
 * Drag-to-reposition + zoom framing box for a video cover image (16:9).
 */
export function ThumbCropper({
  src,
  crop,
  onChange,
}: {
  src: string;
  crop: CropState;
  onChange: (next: CropState) => void;
}) {
  const boxRef = useRef<HTMLDivElement | null>(null);
  const drag = useRef<{ px: number; py: number; x: number; y: number } | null>(null);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      drag.current = { px: e.clientX, py: e.clientY, x: crop.x, y: crop.y };
    },
    [crop.x, crop.y],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      const d = drag.current;
      const box = boxRef.current;
      if (!d || !box) return;
      const rect = box.getBoundingClientRect();
      // Moving right should reveal the left of the image → position decreases.
      const nx = d.x - ((e.clientX - d.px) / rect.width) * 100;
      const ny = d.y - ((e.clientY - d.py) / rect.height) * 100;
      onChange({
        ...crop,
        x: Math.min(100, Math.max(0, nx)),
        y: Math.min(100, Math.max(0, ny)),
      });
    },
    [crop, onChange],
  );

  const endDrag = useCallback(() => {
    drag.current = null;
  }, []);

  return (
    <div>
      <div
        ref={boxRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        className="relative w-full aspect-video overflow-hidden rounded-sm bg-charcoal/90 cursor-grab active:cursor-grabbing touch-none select-none"
      >
        <img
          src={src}
          alt="Cover framing preview"
          draggable={false}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          style={{
            objectPosition: `${crop.x}% ${crop.y}%`,
            transform: `scale(${crop.scale})`,
            transformOrigin: `${crop.x}% ${crop.y}%`,
          }}
        />
        <span className="pointer-events-none absolute inset-0 border border-paper/30" aria-hidden />
        <span className="pointer-events-none absolute bottom-2 left-2 inline-flex items-center gap-1.5 bg-charcoal/70 text-paper px-2 py-1 font-mono text-[9px] tracking-widest uppercase">
          <Move className="w-3 h-3" /> Drag to frame
        </span>
      </div>

      <label className="mt-3 flex items-center gap-3">
        <ZoomIn className="w-4 h-4 text-charcoal/50 shrink-0" />
        <input
          type="range"
          min={1}
          max={3}
          step={0.01}
          value={crop.scale}
          onChange={(e) => onChange({ ...crop, scale: Number(e.target.value) })}
          aria-label="Zoom cover image"
          className="w-full accent-[hsl(var(--brand,0_0%_20%))]"
        />
        <span className="font-mono text-[10px] tabular-nums text-charcoal/50 w-10 text-right">
          {crop.scale.toFixed(2)}×
        </span>
      </label>
    </div>
  );
}
