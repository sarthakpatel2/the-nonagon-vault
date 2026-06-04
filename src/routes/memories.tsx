import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, X, Filter, Sparkles } from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { photos as allPhotos, type Photo } from "@/lib/photos";

export const Route = createFileRoute("/memories")({
  head: () => ({
    meta: [
      { title: "Memories — Interactive Gallery of the Nonagon" },
      { name: "description", content: "Filter by event or friend. Tap a card to open the story behind the moment." },
      { property: "og:title", content: "Memories — The Nonagon" },
      { property: "og:description", content: "An interactive memories gallery. Filter, tap, remember." },
    ],
  }),
  component: MemoriesPage,
});

// Friends we look for inside captions (case-insensitive)
const FRIENDS = [
  "Sarthak",
  "Aditi",
  "Pragati",
  "Shivendra",
  "Racheet",
  "Aman Singh",
  "Aman Saxena",
  "Madhav Khandelwal",
  "Madhav Sharma",
] as const;

type Friend = (typeof FRIENDS)[number];

// Group raw `date` labels into broader event buckets so the chip row stays usable
function bucketEvent(date: string): string {
  const d = date.toUpperCase();
  if (d.includes("CULFEST") || d.includes("FEST") || d.includes("CONCERT")) return "Fests & Concerts";
  if (d.includes("FAREWELL") || d.includes("DEPARTURE") || d.includes("SHIRT") || d.includes("LAST DAY")) return "Farewell";
  if (d.includes("RESULT") || d.includes("BIRTHDAY") || d.includes("CAKE")) return "Cake & Celebrations";
  if (d.includes("ROAD") || d.includes("TRIP") || d.includes("STOP") || d.includes("WALK") || d.includes("WINTER")) return "Road Trips & Walks";
  if (d.includes("CAFE") || d.includes("BRUNCH") || d.includes("KFC") || d.includes("FOOD") || d.includes("DINNER") || d.includes("LUNCH")) return "Cafe & Food";
  if (d.includes("ROOM") || d.includes("HOSTEL") || d.includes("204")) return "Hostel Life";
  if (d.includes("ROOFTOP") || d.includes("TERRACE") || d.includes("EVENING") || d.includes("NIGHT") || d.includes("AFTER PARTY") || d.includes("PARTY")) return "Rooftops & Nights";
  if (d.includes("CAMPUS") || d.includes("LAWN") || d.includes("CLASS") || d.includes("GROUND") || d.includes("MALL") || d.includes("DAY OUT") || d.includes("AFTERNOON") || d.includes("GET-TOGETHER")) return "Campus & Day Outs";
  return "Other Moments";
}

type EnrichedPhoto = Photo & { id: number; event: string; friends: Friend[] };

function tagFriends(caption: string): Friend[] {
  const lower = caption.toLowerCase();
  return FRIENDS.filter((f) => lower.includes(f.toLowerCase()));
}

const ENRICHED: EnrichedPhoto[] = allPhotos.map((p, i) => ({
  ...p,
  id: i,
  event: bucketEvent(p.date),
  friends: tagFriends(p.caption),
}));

const ALL_EVENTS = Array.from(new Set(ENRICHED.map((p) => p.event))).sort();

function MemoriesPage() {
  const [eventFilter, setEventFilter] = useState<string | null>(null);
  const [friendFilter, setFriendFilter] = useState<Friend | null>(null);
  const [active, setActive] = useState<number | null>(null);

  const filtered = useMemo(() => {
    return ENRICHED.filter((p) => {
      if (eventFilter && p.event !== eventFilter) return false;
      if (friendFilter && !p.friends.includes(friendFilter)) return false;
      return true;
    });
  }, [eventFilter, friendFilter]);

  const close = useCallback(() => setActive(null), []);
  const prev = useCallback(
    () => setActive((i) => (i === null ? i : (i - 1 + filtered.length) % filtered.length)),
    [filtered.length],
  );
  const next = useCallback(
    () => setActive((i) => (i === null ? i : (i + 1) % filtered.length)),
    [filtered.length],
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

  // Reset active index if filter changes and current index is out of range
  useEffect(() => {
    if (active !== null && active >= filtered.length) setActive(null);
  }, [filtered.length, active]);

  const clearFilters = () => {
    setEventFilter(null);
    setFriendFilter(null);
  };

  const activePhoto = active !== null ? filtered[active] : null;

  return (
    <main className="min-h-screen">
      <SiteNav />

      <header className="px-6 md:px-10 pt-16 pb-6 max-w-7xl mx-auto">
        <p className="font-mono text-xs tracking-[0.3em] uppercase text-charcoal/50 mb-4">
          09 / Memories
        </p>
        <h1 className="font-serif font-bold leading-[0.9] tracking-tight text-[clamp(2.5rem,7vw,5rem)]">
          Every memory has a <span className="italic text-brand">story</span>.
          <br />Filter, tap, relive.
        </h1>
        <p className="mt-6 max-w-xl text-charcoal/70">
          Pick an event. Pick a friend. Open the card to read the story behind the still.
        </p>
      </header>

      {/* Filter bar */}
      <section className="px-6 md:px-10 max-w-7xl mx-auto sticky top-[60px] z-30 bg-paper/85 backdrop-blur-md py-4 border-y border-charcoal/10">
        <div className="space-y-3">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.25em] uppercase text-charcoal/60">
              <Filter className="w-3 h-3" /> Event
            </span>
            <FilterChip label="All" active={!eventFilter} onClick={() => setEventFilter(null)} />
            {ALL_EVENTS.map((e) => (
              <FilterChip
                key={e}
                label={e}
                active={eventFilter === e}
                onClick={() => setEventFilter(eventFilter === e ? null : e)}
              />
            ))}
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.25em] uppercase text-charcoal/60">
              <Sparkles className="w-3 h-3" /> Friend
            </span>
            <FilterChip label="Everyone" active={!friendFilter} onClick={() => setFriendFilter(null)} />
            {FRIENDS.map((f) => (
              <FilterChip
                key={f}
                label={f}
                active={friendFilter === f}
                onClick={() => setFriendFilter(friendFilter === f ? null : f)}
              />
            ))}
          </div>
          <div className="flex items-center justify-between pt-1">
            <p className="font-mono text-[10px] tracking-widest uppercase text-charcoal/50">
              {filtered.length} memor{filtered.length === 1 ? "y" : "ies"} found
            </p>
            {(eventFilter || friendFilter) && (
              <button
                onClick={clearFilters}
                className="font-mono text-[10px] tracking-widest uppercase text-brand hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="px-4 md:px-10 pt-10 pb-24 max-w-7xl mx-auto">
        {filtered.length === 0 ? (
          <div className="paper-card p-12 text-center max-w-md mx-auto">
            <p className="font-hand text-2xl mb-2">No memories match that combo.</p>
            <p className="font-mono text-xs text-charcoal/60 tracking-wider">
              Try a different friend or event.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {filtered.map((p, idx) => (
              <button
                key={p.id}
                onClick={() => setActive(idx)}
                className={`group relative paper-card p-3 pb-10 ${p.rotate} hover:rotate-0 hover:scale-[1.04] hover:z-10 transition-all duration-500 ease-out text-left cursor-zoom-in`}
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
                <div className="mt-3 px-1 flex justify-between items-end gap-2">
                  <p className="font-hand text-lg leading-tight text-charcoal line-clamp-2">{p.caption}</p>
                  <span className="font-mono text-[9px] tracking-widest text-charcoal/40 shrink-0">{p.date}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Story Modal */}
      {activePhoto && (
        <div
          onClick={close}
          className="fixed inset-0 z-[60] bg-charcoal/90 backdrop-blur-sm grid place-items-center p-4 md:p-6 animate-reveal"
          role="dialog"
          aria-modal="true"
          aria-label="Memory story viewer"
        >
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            aria-label="Previous memory"
            className="absolute left-3 md:left-8 top-1/2 -translate-y-1/2 z-10 grid place-items-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-paper/10 hover:bg-brand text-paper transition-colors border border-paper/20"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <figure
            onClick={(e) => e.stopPropagation()}
            className="paper-card p-4 pb-6 max-w-4xl w-full grid md:grid-cols-[1.2fr_1fr] gap-4 md:gap-6 max-h-[88vh] overflow-hidden animate-scale-in"
          >
            <div className="bg-charcoal/5 overflow-hidden">
              <img
                src={activePhoto.src}
                alt={activePhoto.caption}
                className="w-full h-full object-contain max-h-[78vh]"
              />
            </div>
            <figcaption className="flex flex-col py-2 md:py-4 md:pr-2 overflow-y-auto">
              <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-brand mb-2">
                {activePhoto.event}
              </span>
              <p className="font-serif text-2xl md:text-3xl font-bold leading-tight text-charcoal">
                {activePhoto.caption}
              </p>
              <span className="mt-3 font-mono text-xs tracking-widest text-charcoal/50">
                {activePhoto.date} · {active! + 1}/{filtered.length}
              </span>

              {activePhoto.friends.length > 0 && (
                <div className="mt-5">
                  <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-charcoal/50 mb-2">
                    In the frame
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {activePhoto.friends.map((f) => (
                      <button
                        key={f}
                        onClick={() => { setFriendFilter(f); close(); }}
                        className="text-xs font-mono px-2.5 py-1 rounded-full bg-brand/10 text-brand hover:bg-brand hover:text-paper transition-colors"
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <p className="mt-6 font-hand text-lg text-charcoal/70 leading-relaxed border-t border-charcoal/10 pt-4">
                A frozen second from four years that went by too fast. Tap a name to see every memory that has them in it.
              </p>

              <div className="mt-auto pt-6 flex items-center gap-3">
                <button
                  onClick={prev}
                  className="font-mono text-[10px] tracking-widest uppercase text-charcoal/60 hover:text-brand"
                >
                  ← Prev
                </button>
                <button
                  onClick={next}
                  className="font-mono text-[10px] tracking-widest uppercase text-charcoal/60 hover:text-brand"
                >
                  Next →
                </button>
                <Link
                  to="/gallery"
                  className="ml-auto font-mono text-[10px] tracking-widest uppercase text-brand hover:underline"
                >
                  Polaroid wall ↗
                </Link>
              </div>
            </figcaption>
          </figure>

          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            aria-label="Next memory"
            className="absolute right-3 md:right-8 top-1/2 -translate-y-1/2 z-10 grid place-items-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-paper/10 hover:bg-brand text-paper transition-colors border border-paper/20"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <button
            onClick={close}
            aria-label="Close"
            className="absolute top-5 right-5 grid place-items-center w-10 h-10 rounded-full bg-paper/10 hover:bg-brand text-paper border border-paper/20"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      <SiteFooter />
    </main>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`font-mono text-[11px] tracking-wider uppercase px-3 py-1.5 rounded-full border transition-all ${
        active
          ? "bg-brand text-paper border-brand shadow-sm"
          : "bg-paper text-charcoal/70 border-charcoal/15 hover:border-brand hover:text-brand"
      }`}
    >
      {label}
    </button>
  );
}
