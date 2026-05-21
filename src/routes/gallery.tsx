import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { photos } from "@/lib/photos";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — The Polaroid Wall" },
      { name: "description", content: "A wall of polaroids from four years of college friendships, captured candidly." },
      { property: "og:title", content: "Gallery — The Polaroid Wall" },
      { property: "og:description", content: "A wall of polaroids from four years of college friendships." },
    ],
  }),
  component: GalleryPage,
});

function GalleryPage() {
  const [active, setActive] = useState<number | null>(null);

  const close = useCallback(() => setActive(null), []);
  const prev = useCallback(
    () => setActive((i) => (i === null ? i : (i - 1 + photos.length) % photos.length)),
    [],
  );
  const next = useCallback(
    () => setActive((i) => (i === null ? i : (i + 1) % photos.length)),
    [],
  );

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, close, prev, next]);

  return (
    <main className="min-h-screen">
      <SiteNav />

      <header className="px-6 md:px-10 pt-16 pb-10 max-w-7xl mx-auto">
        <p className="font-mono text-xs tracking-[0.3em] uppercase text-charcoal/50 mb-4">
          02 / The Gallery
        </p>
        <h1 className="font-serif font-bold leading-[0.9] tracking-tight text-[clamp(2.5rem,7vw,5.5rem)]">
          A wall of <span className="italic text-brand">polaroids</span>,
          <br />stuck on with tape.
        </h1>
        <p className="mt-6 max-w-xl text-charcoal/70">
          Hover, tilt, click. Each one a tiny rectangle of a much bigger feeling.
        </p>
      </header>

      <section className="px-4 md:px-10 pb-24 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-10 pt-12">
          {photos.map((p, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`group relative paper-card p-3 pb-12 ${p.rotate} hover:rotate-0 hover:scale-[1.04] hover:z-10 transition-all duration-500 ease-out text-left cursor-zoom-in`}
            >
              <span className="tape left-1/2 -translate-x-1/2 -top-3 w-20 h-5 rotate-[-3deg]" aria-hidden />
              <div className="w-full aspect-square overflow-hidden bg-charcoal/5">
                <img
                  src={p.src}
                  alt={p.caption}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="mt-4 px-1 flex justify-between items-end gap-2">
                <p className="font-hand text-xl leading-tight text-charcoal">{p.caption}</p>
                <span className="font-mono text-[9px] tracking-widest text-charcoal/40 shrink-0">{p.date}</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {active !== null && (
        <div
          onClick={close}
          className="fixed inset-0 z-[60] bg-charcoal/90 backdrop-blur-sm grid place-items-center p-4 md:p-6 animate-reveal"
          role="dialog"
          aria-modal="true"
          aria-label="Photo preview"
        >
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            aria-label="Previous photo"
            className="absolute left-3 md:left-8 top-1/2 -translate-y-1/2 z-10 grid place-items-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-paper/10 hover:bg-brand text-paper hover:text-paper transition-colors border border-paper/20"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <figure
            onClick={(e) => e.stopPropagation()}
            className="paper-card p-4 pb-16 max-w-3xl w-full"
          >
            <img
              src={photos[active].src}
              alt={photos[active].caption}
              className="w-full max-h-[72vh] object-contain bg-charcoal/5"
            />
            <figcaption className="mt-5 px-2 flex justify-between items-end gap-4">
              <p className="font-hand text-3xl">{photos[active].caption}</p>
              <span className="font-mono text-xs text-charcoal/40 shrink-0">
                {photos[active].date} · {active + 1}/{photos.length}
              </span>
            </figcaption>
          </figure>

          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            aria-label="Next photo"
            className="absolute right-3 md:right-8 top-1/2 -translate-y-1/2 z-10 grid place-items-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-paper/10 hover:bg-brand text-paper hover:text-paper transition-colors border border-paper/20"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <button
            onClick={close}
            aria-label="Close preview"
            className="absolute top-5 right-5 grid place-items-center w-10 h-10 rounded-full bg-paper/10 hover:bg-brand text-paper border border-paper/20 font-mono text-sm"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      <SiteFooter />
    </main>
  );
}
