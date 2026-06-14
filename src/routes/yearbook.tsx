import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";

import { crew } from "@/lib/crew";
import { supabase } from "@/integrations/supabase/client";
import dramaQueenAsset from "@/assets/drama-queen.mp3.asset.json";
import soniDeNakhreAsset from "@/assets/soni-de-nakhre.mp3.asset.json";

const DRAMA_QUEEN_SLUGS = new Set(["aditi", "pragati"]);
const trackForSlug = (slug: string) =>
  DRAMA_QUEEN_SLUGS.has(slug) ? dramaQueenAsset.url : soniDeNakhreAsset.url;

export const Route = createFileRoute("/yearbook")({
  head: () => ({
    meta: [
      { title: "Know the Group — The Real Crew" },
      { name: "description", content: "Tap a name to unlock the full, unfiltered, hilarious truth about every member of this legendary BTech squad." },
      { property: "og:title", content: "Know the Group — The Real Crew" },
      { property: "og:description", content: "The unfiltered yearbook of a BTech CSE friend group." },
    ],
  }),
  component: YearbookPage,
});

function YearbookPage() {
  const [open, setOpen] = useState<number | null>(null);
  const [thens, setThens] = useState<Record<string, string[]>>({});
  const [nows, setNows] = useState<Record<string, string[]>>({});

  useEffect(() => {
    let cancelled = false;
    supabase
      .from("freshers_photo_items" as never)
      .select("friend_slug,kind,image_url,sort_order")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true })
      .then(({ data, error }) => {
        if (cancelled || error || !data) return;
        const t: Record<string, string[]> = {};
        const n: Record<string, string[]> = {};
        (data as unknown as { friend_slug: string; kind: "then" | "now"; image_url: string }[]).forEach((r) => {
          const target = r.kind === "then" ? t : n;
          (target[r.friend_slug] ??= []).push(r.image_url);
        });
        setThens(t);
        setNows(n);
      });
    return () => {
      cancelled = true;
    };
  }, []);



  return (
    <main className="min-h-screen">
      <SiteNav />

      <header className="px-6 md:px-10 pt-16 pb-10 max-w-7xl mx-auto">
        <p className="font-mono text-xs tracking-[0.3em] uppercase text-charcoal/50 mb-4">
          04 / The Crew
        </p>
        <h1 className="font-serif font-bold leading-[0.9] tracking-tight text-[clamp(2.5rem,7vw,5.5rem)]">
          Know the <span className="italic text-brand">group</span>.
        </h1>
        <p className="mt-6 max-w-xl text-charcoal/70">
          Tap a card. Unlock the chaos. These are the real humans behind the inside jokes, the proxy logs, and the 2&nbsp;AM canteen bills.
        </p>
      </header>

      <section className="bg-charcoal text-paper py-20 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <h2 className="font-serif text-3xl md:text-5xl italic">Class of 2026</h2>
            <p className="font-mono text-[10px] md:text-xs text-paper/40 tracking-[0.2em] uppercase hidden sm:block">
              Tap to reveal
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {crew.map((p, i) => {
              const isOpen = open === i;
              return (
                <button
                  key={p.name}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className={`text-left border rounded-xl p-6 transition-all duration-300 group min-h-[260px] flex flex-col justify-between
                    ${isOpen ? "bg-brand border-brand text-white" : "border-paper/15 hover:bg-paper/5 hover:border-paper/40"}
                  `}
                >
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <img
                        src={p.photo}
                        alt={p.name}
                        loading="lazy"
                        className={`w-14 h-14 rounded-full object-cover border-2 ${isOpen ? "border-white/40" : "border-paper/30"}`}
                      />
                      <span className={`font-mono text-[10px] tracking-[0.2em] uppercase ${isOpen ? "text-white/70" : "text-paper/40"}`}>
                        {p.name} <span className={isOpen ? "text-white/40" : "text-brand"}>//</span> {p.role}
                      </span>
                    </div>
                    {!isOpen ? (
                      <div>
                        <p className="font-serif text-lg leading-snug mb-4">&ldquo;{p.vibe}&rdquo;</p>
                        <div className="flex flex-wrap gap-2">
                          {p.details.slice(0, 2).map((d, idx) => (
                            <span key={idx} className="text-[10px] font-mono uppercase tracking-wider px-2 py-1 rounded-full bg-paper/10 text-paper/70">
                              {d.split(" ").slice(0, 3).join(" ")}...
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2 text-sm">
                        {p.details.map((d, idx) => (
                          <p key={idx} className="flex gap-2">
                            <span className="text-white/50 mt-1">▸</span>
                            {d}
                          </p>
                        ))}
                        <p className="pt-3 font-hand text-xl italic text-white/90 border-t border-white/20 mt-3">
                          &ldquo;{p.punchline}&rdquo;
                        </p>
                      </div>
                    )}
                  </div>
                  <span className={`font-serif italic mt-6 ${isOpen ? "text-white" : "text-brand"}`}>
                    {isOpen ? "← close" : "Read more →"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* THEN vs NOW — drag to reveal */}
      <section className="px-6 md:px-10 py-24 max-w-7xl mx-auto">
        <p className="font-mono text-xs tracking-[0.3em] uppercase text-charcoal/50 mb-3">Then vs Now</p>
        <h2 className="font-serif text-3xl md:text-5xl tracking-tight mb-3">
          Freshers <span className="italic text-brand">→</span> Final year.
        </h2>
        <p className="text-charcoal/60 mb-12 max-w-xl">
          Drag the slider. Watch four years happen in one second.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {crew.map((p) => (
            <FriendBeforeAfter
              key={p.slug}
              slug={p.slug}
              name={p.name}
              role={p.role}
              fallback={p.photo}
              thens={thens[p.slug] ?? []}
              nows={nows[p.slug] ?? []}
            />
          ))}
        </div>


      </section>

      {/* SIGNATURE WALL */}
      <section className="px-6 md:px-10 py-24 max-w-7xl mx-auto">
        <p className="font-mono text-xs tracking-[0.3em] uppercase text-charcoal/50 mb-3">Signature wall</p>
        <h2 className="font-serif text-3xl md:text-5xl tracking-tight mb-12">
          Last-day <span className="italic text-brand">scribbles</span>.
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[
            { name: "— Aditi", note: "I was NOT drunk. Ask me anything." },
            { name: "— Aman S.", note: "Biryani first. Emotions second." },
            { name: "— Aman Sax.", note: "She looked at me. I swear." },
            { name: "— Pragati", note: "Mummy called. I have to go." },
            { name: "— Madhav Sh.", note: "Body nhi bani, plan nhi gya." },
            { name: "— Madhav Kh.", note: "Paise kal. Pakka. Pakka pakka." },
            { name: "— Racheet", note: "Raita spill = life spill." },
            { name: "— Sarthak", note: "Chill hai sab. Bas non-veg chahiye." },
            { name: "— Shivendra", note: "Examiner ne galat check kiya." },
          ].map((s, i) => (
            <div
              key={i}
              className={`relative paper-card p-6 ${i % 2 ? "rotate-1" : "-rotate-1"} hover:rotate-0 transition-transform`}
            >
              <span className="tape left-4 -top-3 w-14 h-4 rotate-[-6deg]" aria-hidden />
              <p className="font-hand text-2xl leading-snug text-charcoal/90">&ldquo;{s.note}&rdquo;</p>
              <p className="font-hand text-xl text-brand mt-4">{s.name}</p>
            </div>
          ))}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

function FriendBeforeAfter({
  slug,
  name,
  role,
  fallback,
  thens,
  nows,
}: {
  slug: string;
  name: string;
  role: string;
  fallback: string;
  thens: string[];
  nows: string[];
}) {
  // Single reel: all "then" frames first, then all "now" frames.
  const reel: { src: string; kind: "then" | "now" }[] = [
    ...thens.map((src) => ({ src, kind: "then" as const })),
    ...nows.map((src) => ({ src, kind: "now" as const })),
  ];
  const hasReal = reel.length > 0;
  if (reel.length === 0) reel.push({ src: fallback, kind: "now" });
  const count = reel.length;

  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const i = Math.min(idx, count - 1);
  const current = reel[i];
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const trackUrl = trackForSlug(slug);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      a.currentTime = 0;
      a.volume = 0.5;
      void a.play().catch(() => {});
    } else {
      a.pause();
    }
  }, [playing]);

  useEffect(() => {
    if (!playing || count <= 1) return;
    const t = setInterval(() => {
      setIdx((p) => {
        const next = p + 1;
        if (next >= count) {
          setPlaying(false);
          return count - 1;
        }
        return next;
      });
    }, 2500);
    return () => clearInterval(t);
  }, [playing, count]);

  const togglePlay = () => {
    if (playing) {
      setPlaying(false);
      return;
    }
    if (i >= count - 1) setIdx(0);
    setPlaying(true);
  };
  const goPrev = () => {
    setPlaying(false);
    setIdx((p) => (p - 1 + count) % count);
  };
  const goNext = () => {
    setPlaying(false);
    setIdx((p) => (p + 1) % count);
  };

  const closeModal = () => {
    setPlaying(false);
    setIdx(0);
  };

  useEffect(() => {
    if (!playing) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeModal();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        setIdx((p) => (p - 1 + count) % count);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        setIdx((p) => (p + 1) % count);
      } else if (e.key === " " || e.key === "Spacebar") {
        e.preventDefault();
        setPlaying((v) => !v);
      }
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [playing, count]);

  const thenTotal = thens.length;
  const nowTotal = nows.length || (hasReal ? 0 : 1);
  const localIndex = current.kind === "then" ? i + 1 : i - thenTotal + 1;
  const localTotal = current.kind === "then" ? thenTotal : nowTotal;
  const cover = { src: fallback, kind: "now" as const };

  return (
    <figure className="space-y-3">
      <audio ref={audioRef} src={trackUrl} loop preload="none" />

      {/* Cover card (collapsed state) */}
      <button
        type="button"
        onClick={togglePlay}
        aria-label={count > 1 ? `Play ${name}'s slideshow` : `${name}'s photo`}
        className="group relative block w-full aspect-[4/5] overflow-hidden rounded-xl bg-charcoal select-none outline-none focus-visible:ring-2 focus-visible:ring-brand/70"
      >
        <img
          src={cover.src}
          alt={`${name} — cover`}
          loading="lazy"
          draggable={false}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {count > 1 && (
          <span className="absolute inset-0 grid place-items-center bg-black/0 group-hover:bg-black/30 transition-colors">
            <span className="size-14 grid place-items-center rounded-full bg-brand text-white shadow-xl opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
            </span>
          </span>
        )}
      </button>

      <figcaption className="flex items-baseline justify-between">
        <span className="font-serif text-lg">{name}</span>
        <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-charcoal/50">
          {hasReal ? role : "placeholder — add via admin"}
        </span>
      </figcaption>

      {/* Modal overlay (playing state) */}
      {playing && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${name}'s Then vs Now slideshow`}
          className="fixed inset-0 z-50 grid place-items-center p-4 sm:p-8 bg-black/70 backdrop-blur-xl animate-fade-in"
          onClick={closeModal}
        >
          <div
            className="relative w-full max-w-[min(90vw,520px)] aspect-[4/5] rounded-2xl overflow-hidden bg-charcoal shadow-2xl animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {reel.map((frame, fi) => (
              <img
                key={fi}
                src={frame.src}
                alt={`${name} — ${frame.kind === "then" ? "Freshers" : "Final Year"}`}
                draggable={false}
                style={
                  !hasReal && frame.kind === "then"
                    ? { filter: "sepia(0.6) saturate(0.7) brightness(0.95) contrast(0.95) blur(0.3px)" }
                    : undefined
                }
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${fi === i ? "opacity-100" : "opacity-0"}`}
              />
            ))}

            <span className="absolute top-3 left-3 font-mono text-[10px] tracking-[0.2em] uppercase px-2 py-1 rounded bg-black/60 text-white">
              {current.kind === "then" ? "Freshers" : "Final Year"}
              {localTotal > 1 && (
                <span className="ml-2 text-white/60">
                  {localIndex}/{localTotal}
                </span>
              )}
            </span>

            <button
              type="button"
              onClick={closeModal}
              aria-label="Close"
              className="absolute right-3 top-3 z-10 size-9 grid place-items-center rounded-full bg-black/70 text-white hover:bg-black/90 focus-visible:ring-2 focus-visible:ring-white/90 focus-visible:outline-none"
            >
              ✕
            </button>

            {count > 1 && (
              <>
                <button
                  type="button"
                  onClick={togglePlay}
                  aria-label={playing ? "Pause" : "Play"}
                  className="absolute left-1/2 -translate-x-1/2 bottom-3 z-10 size-10 grid place-items-center rounded-full bg-brand text-white hover:bg-brand/90 focus-visible:ring-2 focus-visible:ring-white/90 focus-visible:outline-none shadow-lg"
                >
                  {playing ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                  )}
                </button>
                <button
                  type="button"
                  onClick={goPrev}
                  aria-label="Previous"
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-10 size-10 grid place-items-center rounded-full bg-black/60 text-white hover:bg-black/80 focus-visible:ring-2 focus-visible:ring-white/90 focus-visible:outline-none font-mono text-lg"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  aria-label="Next"
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-10 size-10 grid place-items-center rounded-full bg-black/60 text-white hover:bg-black/80 focus-visible:ring-2 focus-visible:ring-white/90 focus-visible:outline-none font-mono text-lg"
                >
                  ›
                </button>
                <span aria-hidden="true" className="absolute right-3 bottom-3 z-10 px-2 py-0.5 rounded bg-black/60 text-white font-mono text-[10px] tracking-widest">
                  {i + 1} / {count}
                </span>
              </>
            )}
          </div>
        </div>
      )}
    </figure>
  );
}

