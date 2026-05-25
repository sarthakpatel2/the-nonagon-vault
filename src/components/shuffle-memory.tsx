import { useCallback, useEffect, useState } from "react";
import { Shuffle, X, ChevronRight } from "lucide-react";
import { photos } from "@/lib/photos";
import {
  curatedQuotes,
  curatedMoments,
  photoMemoryIndices,
  type Memory,
} from "@/lib/memories";

const ALL_MEMORIES: Memory[] = [
  ...curatedQuotes,
  ...curatedMoments,
  ...photoMemoryIndices.map((p) => ({
    kind: "photo" as const,
    index: p.index,
    caption: p.caption,
    date: p.date,
  })),
];

function pickRandom(exclude?: Memory): Memory {
  if (ALL_MEMORIES.length <= 1) return ALL_MEMORIES[0];
  let choice: Memory;
  let attempts = 0;
  do {
    choice = ALL_MEMORIES[Math.floor(Math.random() * ALL_MEMORIES.length)];
    attempts++;
  } while (exclude && choice === exclude && attempts < 10);
  return choice;
}

export function ShuffleMemory() {
  const [open, setOpen] = useState(false);
  const [memory, setMemory] = useState<Memory | null>(null);
  const [enter, setEnter] = useState(false);

  const show = useCallback(() => {
    const m = pickRandom(memory ?? undefined);
    setMemory(m);
    setOpen(true);
    setTimeout(() => setEnter(true), 30);
  }, [memory]);

  const next = useCallback(() => {
    setEnter(false);
    setTimeout(() => {
      const m = pickRandom(memory ?? undefined);
      setMemory(m);
      setEnter(true);
    }, 200);
  }, [memory]);

  const close = useCallback(() => {
    setEnter(false);
    setTimeout(() => setOpen(false), 200);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        next();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close, next]);

  return (
    <>
      {/* Floating button */}
      <button
        onClick={show}
        aria-label="Shuffle a random memory"
        title="Shuffle a random memory"
        className="fixed bottom-6 right-6 z-[55] w-12 h-12 rounded-full bg-charcoal text-paper shadow-lg hover:bg-brand hover:scale-110 transition-all duration-300 grid place-items-center"
      >
        <Shuffle className="w-5 h-5" />
      </button>

      {open && memory && (
        <div
          onClick={close}
          className="fixed inset-0 z-[60] bg-charcoal/90 backdrop-blur-sm grid place-items-center p-4 md:p-6 animate-reveal"
          role="dialog"
          aria-modal="true"
          aria-label="Random memory"
        >
          <button
            onClick={close}
            aria-label="Close"
            className="absolute top-5 right-5 grid place-items-center w-10 h-10 rounded-full bg-paper/10 hover:bg-brand text-paper border border-paper/20 font-mono text-sm transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div
            onClick={(e) => e.stopPropagation()}
            className={`paper-card p-6 md:p-10 max-w-xl w-full relative transition-all duration-500 ${
              enter ? "opacity-100 translate-y-1 scale-100" : "opacity-0 translate-y-4 scale-[0.98]"
            }`}
          >
            <span className="tape left-1/2 -translate-x-1/2 -top-3 w-24 h-5 rotate-[-2deg] bg-brand/40" aria-hidden />

            <MemoryCard memory={memory} />

            <div className="mt-8 flex items-center justify-between">
              <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-charcoal/40">
                Memory {ALL_MEMORIES.indexOf(memory) + 1} / {ALL_MEMORIES.length}
              </p>
              <button
                onClick={next}
                className="inline-flex items-center gap-2 bg-charcoal text-paper px-5 py-2.5 rounded-full font-medium text-sm hover:bg-brand transition-colors"
              >
                Next memory
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function MemoryCard({ memory }: { memory: Memory }) {
  if (memory.kind === "photo") {
    const photo = photos[memory.index];
    if (!photo) return null;
    return (
      <figure>
        <div className="relative w-full aspect-square overflow-hidden rounded-xl bg-charcoal/5 mb-4">
          <img
            src={photo.src}
            alt={memory.caption}
            className="w-full h-full object-cover"
          />
        </div>
        <figcaption>
          <p className="font-hand text-2xl text-charcoal leading-snug">
            {memory.caption}
          </p>
          <p className="font-mono text-xs text-charcoal/40 mt-2 tracking-widest uppercase">
            {memory.date}
          </p>
        </figcaption>
      </figure>
    );
  }

  if (memory.kind === "quote") {
    return (
      <div className="text-center py-4">
        <blockquote className="font-serif text-2xl md:text-3xl italic leading-snug text-charcoal">
          &ldquo;{memory.text}&rdquo;
        </blockquote>
        <div className="mt-6">
          <p className="font-hand text-xl text-brand">{memory.by}</p>
          <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-charcoal/40 mt-1">
            {memory.context}
          </p>
        </div>
      </div>
    );
  }

  if (memory.kind === "moment") {
    return (
      <div className="py-2">
        <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-brand mb-3">
          {memory.label}
        </p>
        <h3 className="font-serif text-2xl md:text-3xl font-bold tracking-tight mb-4">
          {memory.title}
        </h3>
        <p className="text-charcoal/75 leading-relaxed text-base md:text-lg">
          {memory.body}
        </p>
      </div>
    );
  }

  return null;
}
