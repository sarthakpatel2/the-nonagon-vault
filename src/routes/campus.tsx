import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { X, MapPin, Plus } from "lucide-react";

export const Route = createFileRoute("/campus")({
  head: () => ({
    meta: [
      { title: "Campus Map — The Nonagon" },
      { name: "description", content: "An interactive campus map. Drop a memory on the places that made the four years what they were." },
      { property: "og:title", content: "Campus Map — The Nonagon" },
      { property: "og:description", content: "Pin a memory to the canteen, the library, the ground — every corner has a story." },
    ],
  }),
  component: CampusMapPage,
});

type Place = {
  id: string;
  name: string;
  emoji: string;
  // % of viewBox (0..100)
  x: number;
  y: number;
};

const PLACES: Place[] = [
  { id: "main-gate", name: "Main Gate", emoji: "🚪", x: 8, y: 82 },
  { id: "admin-block", name: "Admin Block", emoji: "🏛️", x: 22, y: 70 },
  { id: "library", name: "Library", emoji: "📚", x: 42, y: 28 },
  { id: "cs-block", name: "CSE Block", emoji: "💻", x: 62, y: 18 },
  { id: "auditorium", name: "Auditorium", emoji: "🎭", x: 80, y: 32 },
  { id: "canteen", name: "Canteen", emoji: "🍔", x: 32, y: 52 },
  { id: "chai-tapri", name: "Chai Tapri", emoji: "☕", x: 50, y: 60 },
  { id: "ground", name: "Sports Ground", emoji: "⚽", x: 70, y: 60 },
  { id: "amphi", name: "Amphitheatre", emoji: "🎤", x: 86, y: 70 },
  { id: "hostel", name: "Hostel", emoji: "🛏️", x: 18, y: 22 },
  { id: "garden", name: "Garden", emoji: "🌿", x: 58, y: 82 },
  { id: "parking", name: "Parking", emoji: "🛵", x: 90, y: 88 },
];

type Memory = {
  id: string;
  place_id: string;
  name: string;
  title: string;
  note: string;
  created_at: string;
};

const MAX_TITLE = 80;
const MAX_NOTE = 500;
const MAX_NAME = 60;

function CampusMapPage() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [active, setActive] = useState<Place | null>(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data, error } = await supabase
        .from("campus_memories")
        .select("*")
        .order("created_at", { ascending: false });
      if (!mounted) return;
      if (error) {
        toast.error("Could not load memories");
      } else if (data) {
        setMemories(data as Memory[]);
      }
      setLoading(false);
    })();

    const channel = supabase
      .channel("campus_memories_changes")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "campus_memories" },
        (payload) => {
          setMemories((prev) => [payload.new as Memory, ...prev]);
        },
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  const countByPlace = useMemo(() => {
    const m = new Map<string, number>();
    memories.forEach((mem) => m.set(mem.place_id, (m.get(mem.place_id) ?? 0) + 1));
    return m;
  }, [memories]);

  const activeMemories = useMemo(
    () => (active ? memories.filter((m) => m.place_id === active.id) : []),
    [active, memories],
  );

  const closeDrawer = () => {
    setActive(null);
    setAdding(false);
    setName("");
    setTitle("");
    setNote("");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!active) return;
    const trimmedTitle = title.trim();
    const trimmedNote = note.trim();
    const trimmedName = name.trim().slice(0, MAX_NAME) || "Anonymous";
    if (!trimmedTitle || !trimmedNote) {
      toast.error("Add a title and a note");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("campus_memories").insert({
      place_id: active.id,
      name: trimmedName,
      title: trimmedTitle.slice(0, MAX_TITLE),
      note: trimmedNote.slice(0, MAX_NOTE),
    });
    setSubmitting(false);
    if (error) {
      toast.error("Could not save memory");
      return;
    }
    toast.success(`Memory pinned at ${active.name} 📍`);
    setAdding(false);
    setTitle("");
    setNote("");
  };

  return (
    <main className="min-h-screen bg-paper">
      <SiteNav />

      <header className="px-6 md:px-10 max-w-6xl mx-auto pt-12 md:pt-16 pb-8">
        <p className="font-mono text-xs tracking-[0.3em] uppercase text-charcoal/50 mb-4">
          Campus · Memory Map
        </p>
        <h1 className="font-serif font-bold leading-[0.95] tracking-tight text-[clamp(2rem,6vw,4.5rem)] text-balance">
          Every corner has a story.
        </h1>
        <p className="mt-4 max-w-xl text-charcoal/70 text-base md:text-lg">
          Tap a place on the map to read the memories pinned there — or add your own.
        </p>
      </header>

      <section className="px-4 md:px-10 max-w-6xl mx-auto pb-16">
        <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden border border-charcoal/10 shadow-sm bg-gradient-to-br from-[#eef5e6] via-[#f5efe1] to-[#e9eef7]">
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="absolute inset-0 w-full h-full"
            aria-hidden="true"
          >
            {/* lawns */}
            <path d="M0,55 Q30,40 55,55 T100,50 L100,100 L0,100 Z" fill="#cfe3b6" opacity="0.55" />
            <circle cx="58" cy="80" r="9" fill="#bcd9a0" opacity="0.7" />
            <circle cx="14" cy="46" r="6" fill="#bcd9a0" opacity="0.6" />
            {/* paths */}
            <path d="M8,82 Q30,70 50,60 T92,30" stroke="#e6d7b2" strokeWidth="2.4" fill="none" strokeLinecap="round" />
            <path d="M22,70 Q40,40 60,18" stroke="#e6d7b2" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M50,60 L70,60" stroke="#e6d7b2" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M86,70 L90,88" stroke="#e6d7b2" strokeWidth="2" fill="none" strokeLinecap="round" />
            {/* building footprints */}
            <rect x="38" y="22" width="10" height="10" rx="1.2" fill="#d8cdb6" />
            <rect x="58" y="12" width="10" height="10" rx="1.2" fill="#d8cdb6" />
            <rect x="76" y="26" width="10" height="10" rx="1.2" fill="#d8cdb6" />
            <rect x="18" y="65" width="10" height="10" rx="1.2" fill="#d8cdb6" />
            <rect x="14" y="16" width="10" height="10" rx="1.2" fill="#d8cdb6" />
            <rect x="28" y="46" width="10" height="10" rx="1.2" fill="#d8cdb6" />
            {/* pond */}
            <ellipse cx="66" cy="62" rx="6" ry="3.5" fill="#aac9e6" opacity="0.7" />
          </svg>

          {/* compass */}
          <div className="absolute top-3 right-3 size-12 rounded-full bg-white/80 backdrop-blur grid place-items-center text-[10px] font-mono text-charcoal/70 shadow">
            <div className="flex flex-col items-center leading-none">
              <span className="text-brand">N</span>
              <span className="text-charcoal/30">·</span>
              <span>S</span>
            </div>
          </div>

          {/* legend */}
          <div className="absolute bottom-3 left-3 bg-white/85 backdrop-blur rounded-xl px-3 py-2 text-[11px] font-mono text-charcoal/70 shadow">
            <span className="inline-flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-brand" /> pinned memory
            </span>
          </div>

          {/* pins */}
          {PLACES.map((p) => {
            const count = countByPlace.get(p.id) ?? 0;
            const isActive = active?.id === p.id;
            return (
              <button
                key={p.id}
                onClick={() => {
                  setActive(p);
                  setAdding(false);
                }}
                style={{ left: `${p.x}%`, top: `${p.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-full group focus:outline-none"
                aria-label={`${p.name} — ${count} memor${count === 1 ? "y" : "ies"}`}
              >
                <div className="flex flex-col items-center">
                  <div
                    className={`relative px-2 py-1 rounded-full text-[10px] md:text-xs font-mono whitespace-nowrap mb-1 transition-all ${
                      isActive
                        ? "bg-brand text-white shadow-md"
                        : "bg-white/90 text-charcoal/80 group-hover:bg-charcoal group-hover:text-paper shadow-sm"
                    }`}
                  >
                    <span className="mr-1">{p.emoji}</span>
                    {p.name}
                    {count > 0 && (
                      <span
                        className={`ml-1.5 inline-flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full text-[9px] ${
                          isActive ? "bg-white/25 text-white" : "bg-brand/15 text-brand"
                        }`}
                      >
                        {count}
                      </span>
                    )}
                  </div>
                  <div
                    className={`size-3 rounded-full ring-2 ring-white shadow transition-all ${
                      isActive ? "bg-brand scale-125" : count > 0 ? "bg-brand" : "bg-charcoal/40 group-hover:bg-brand"
                    }`}
                  />
                  {count > 0 && (
                    <span
                      className="absolute -bottom-1 size-3 rounded-full bg-brand/30 animate-ping"
                      aria-hidden="true"
                    />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <p className="mt-4 text-xs font-mono text-charcoal/50 text-center">
          {loading ? "Loading memories…" : `${memories.length} memor${memories.length === 1 ? "y" : "ies"} pinned across campus`}
        </p>
      </section>

      {/* Drawer */}
      {active && (
        <>
          <div
            onClick={closeDrawer}
            className="fixed inset-0 bg-charcoal/40 backdrop-blur-sm z-40 animate-fade-in"
            aria-hidden="true"
          />
          <aside className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-paper shadow-2xl flex flex-col animate-slide-in-right">
            <div className="flex items-start justify-between p-6 border-b border-charcoal/10">
              <div>
                <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-charcoal/50 mb-1">
                  Memory pin
                </p>
                <h2 className="font-serif text-2xl md:text-3xl font-bold leading-tight flex items-center gap-2">
                  <span>{active.emoji}</span>
                  {active.name}
                </h2>
                <p className="mt-1 text-xs text-charcoal/60">
                  {activeMemories.length} memor{activeMemories.length === 1 ? "y" : "ies"}
                </p>
              </div>
              <button
                onClick={closeDrawer}
                className="size-9 grid place-items-center rounded-full hover:bg-charcoal/5"
                aria-label="Close"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {activeMemories.length === 0 && !adding && (
                <div className="text-center py-12">
                  <MapPin className="size-10 mx-auto text-charcoal/30 mb-3" />
                  <p className="text-charcoal/60 text-sm">
                    No memories here yet. Be the first to drop one.
                  </p>
                </div>
              )}

              {activeMemories.map((m) => (
                <article
                  key={m.id}
                  className="rounded-2xl bg-cream border border-charcoal/10 p-4 shadow-sm"
                >
                  <h3 className="font-serif font-semibold text-lg leading-snug">{m.title}</h3>
                  <p className="mt-2 text-sm text-charcoal/80 whitespace-pre-wrap leading-relaxed">
                    {m.note}
                  </p>
                  <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-charcoal/50">
                    <span>— {m.name}</span>
                    <time dateTime={m.created_at}>
                      {new Date(m.created_at).toLocaleDateString(undefined, {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </time>
                  </div>
                </article>
              ))}

              {adding && (
                <form onSubmit={handleSubmit} className="rounded-2xl bg-white border border-brand/30 p-4 shadow space-y-3">
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value.slice(0, MAX_NAME))}
                    placeholder="Your name (optional)"
                    className="w-full rounded-lg border border-charcoal/15 px-3 py-2 text-sm focus:outline-none focus:border-brand"
                  />
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value.slice(0, MAX_TITLE))}
                    placeholder="Memory title *"
                    required
                    className="w-full rounded-lg border border-charcoal/15 px-3 py-2 text-sm focus:outline-none focus:border-brand"
                  />
                  <div>
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value.slice(0, MAX_NOTE))}
                      placeholder={`What happened at ${active.name}?`}
                      required
                      rows={4}
                      className="w-full rounded-lg border border-charcoal/15 px-3 py-2 text-sm focus:outline-none focus:border-brand resize-none"
                    />
                    <p className="mt-1 text-right text-[10px] font-mono text-charcoal/40">
                      {note.length}/{MAX_NOTE}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setAdding(false)}
                      className="flex-1 rounded-lg border border-charcoal/15 px-3 py-2 text-sm hover:bg-charcoal/5"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 rounded-lg bg-brand text-white px-3 py-2 text-sm font-medium hover:bg-brand/90 disabled:opacity-60"
                    >
                      {submitting ? "Pinning…" : "Pin memory"}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {!adding && (
              <div className="p-4 border-t border-charcoal/10 bg-paper">
                <button
                  onClick={() => setAdding(true)}
                  className="w-full rounded-xl bg-charcoal text-paper px-4 py-3 text-sm font-medium hover:bg-brand transition-colors inline-flex items-center justify-center gap-2"
                >
                  <Plus className="size-4" />
                  Add a memory at {active.name}
                </button>
              </div>
            )}
          </aside>
        </>
      )}

      <SiteFooter />
    </main>
  );
}
