import { Link } from "@tanstack/react-router";
import { Lock, ImageIcon, Images } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function AdminFab() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  return (
    <div ref={ref} className="fixed bottom-5 left-5 z-40">
      {open && (
        <div className="mb-2 flex flex-col gap-1 rounded-2xl bg-charcoal/95 text-paper backdrop-blur p-1.5 shadow-xl min-w-[190px]">
          <Link
            to="/admin/avatars"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-brand transition-colors font-mono text-[10px] tracking-[0.2em] uppercase"
          >
            <ImageIcon className="w-3.5 h-3.5" /> Avatars
          </Link>
          <Link
            to="/admin/freshers"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-brand transition-colors font-mono text-[10px] tracking-[0.2em] uppercase"
          >
            <Images className="w-3.5 h-3.5" /> Then / Now
          </Link>
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="Open admin menu"
        title="Admin"
        className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-charcoal/90 text-paper backdrop-blur shadow-lg hover:bg-brand transition-colors font-mono text-[10px] tracking-[0.2em] uppercase"
      >
        <Lock className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">admin</span>
      </button>
    </div>
  );
}
