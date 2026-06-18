import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { MOODS, MOOD_MAP } from "@/components/send-love";

export const Route = createFileRoute("/love")({
  head: () => ({
    meta: [
      { title: "Wall of Love — The Nonagon" },
      {
        name: "description",
        content:
          "Every love note ever sent to the nonagon. A living guestbook of friends, strangers, and one-liners that hit hard.",
      },
      { property: "og:title", content: "Wall of Love — The Nonagon" },
      {
        property: "og:description",
        content:
          "Every love note ever sent to the nonagon. A living guestbook of friends, strangers, and one-liners that hit hard.",
      },
    ],
  }),
  component: LovePage,
});

type LoveNote = {
  id: string;
  name: string;
  message: string;
  page: string;
  mood: string;
  created_at: string;
};

const PAGE_LABELS: Record<string, string> = {
  "/": "Home",
  "/gallery": "Gallery",
  "/timeline": "Timeline",
  "/yearbook": "Know the Group",
  "/letter": "Letter",
  "/from-prags": "From Prags",
  "/love": "Wall of Love",
};

const ROTATIONS = [
  "-rotate-2",
  "rotate-1",
  "-rotate-1",
  "rotate-2",
  "rotate-0",
  "-rotate-3",
  "rotate-3",
];

const TAPE_COLORS = [
  "bg-brand/30",
  "bg-yellow-300/40",
  "bg-pink-300/40",
  "bg-blue-300/40",
];

function LovePage() {
  const [notes, setNotes] = useState<LoveNote[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [moodFilter, setMoodFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("love_notes")
        .select("id,name,message,page,mood,created_at")
        .order("created_at", { ascending: false })
        .limit(500);
      if (data) setNotes(data as LoveNote[]);
      setLoading(false);
    })();
  }, []);

  const pages = Array.from(new Set(notes.map((n) => n.page)));
  const visible = notes.filter(
    (n) =>
      (filter === "all" || n.page === filter) &&
      (moodFilter === "all" || (n.mood ?? "love") === moodFilter),
  );

  return (
    <div className="min-h-screen relative">
      <SiteNav />

      {/* Hero */}
      <section className="px-6 md:px-10 pt-16 md:pt-24 pb-10 max-w-6xl mx-auto text-center">
        <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-charcoal/50 mb-4">
          The guestbook · {notes.length} note{notes.length === 1 ? "" : "s"}
        </p>
        <h1 className="font-serif italic text-4xl md:text-7xl leading-[0.95] text-balance">
          Wall of <span className="text-brand">Love</span> 💖
        </h1>
        <p className="text-charcoal/70 mt-5 max-w-xl mx-auto text-base md:text-lg">
          Every line, memory and feeling people pinned to this corner of the
          internet. Sorted newest first. Add yours from the 💖 button on any
          page.
        </p>
      </section>

      {/* Filter chips */}
      {pages.length > 0 && (
        <div className="px-6 md:px-10 max-w-6xl mx-auto mb-8 flex flex-wrap gap-2 justify-center">
          <FilterChip active={filter === "all"} onClick={() => setFilter("all")}>
            All ({notes.length})
          </FilterChip>
          {pages.map((p) => (
            <FilterChip
              key={p}
              active={filter === p}
              onClick={() => setFilter(p)}
            >
              {PAGE_LABELS[p] ?? p} ({notes.filter((n) => n.page === p).length})
            </FilterChip>
          ))}
        </div>
      )}

      {/* Mood filter chips */}
      <div className="px-6 md:px-10 max-w-6xl mx-auto mb-10 flex flex-wrap gap-2 justify-center">
        <FilterChip active={moodFilter === "all"} onClick={() => setMoodFilter("all")}>
          All moods
        </FilterChip>
        {MOODS.map((m) => {
          const count = notes.filter((n) => (n.mood ?? "love") === m.id).length;
          if (count === 0) return null;
          return (
            <FilterChip
              key={m.id}
              active={moodFilter === m.id}
              onClick={() => setMoodFilter(m.id)}
            >
              {m.emoji} {m.label} ({count})
            </FilterChip>
          );
        })}
      </div>

      {/* Wall */}
      <section className="px-6 md:px-10 pb-24 max-w-6xl mx-auto">
        {loading ? (
          <p className="text-center font-mono text-xs text-charcoal/40">
            loading the love…
          </p>
        ) : visible.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-serif italic text-2xl text-charcoal/60 mb-4">
              No notes here yet.
            </p>
            <Link
              to="/"
              className="inline-block bg-charcoal text-paper px-6 py-3 rounded-full text-sm font-medium hover:bg-brand transition-colors"
            >
              Be the first → tap 💖 anywhere
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {visible.map((n, i) => (
              <NoteCard key={n.id} note={n} index={i} />
            ))}
          </div>
        )}
      </section>

      <SiteFooter />
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`font-mono text-[10px] tracking-[0.2em] uppercase px-3 py-2 rounded-full border transition-colors ${
        active
          ? "bg-charcoal text-paper border-charcoal"
          : "bg-cream/60 text-charcoal/70 border-charcoal/15 hover:border-brand hover:text-brand"
      }`}
    >
      {children}
    </button>
  );
}

function NoteCard({ note, index }: { note: LoveNote; index: number }) {
  const rotate = ROTATIONS[index % ROTATIONS.length];
  const mood = MOOD_MAP[note.mood] ?? MOOD_MAP.love;
  const tape = mood.tape ?? TAPE_COLORS[index % TAPE_COLORS.length];
  const label = PAGE_LABELS[note.page] ?? note.page;

  return (
    <div
      className={`relative ${mood.bg} rounded-sm p-6 pt-8 shadow-[0_8px_24px_oklch(0_0_0/0.08)] hover:shadow-[0_14px_36px_oklch(0_0_0/0.14)] transition-all duration-300 ${rotate} hover:rotate-0 hover:-translate-y-1 animate-fade-in`}
      style={{ animationDelay: `${(index % 12) * 40}ms` }}
    >
      {/* Tape */}
      <span
        className={`absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-5 ${tape} rotate-[-2deg] shadow-sm`}
        aria-hidden
      />

      <div className="flex items-start gap-2">
        <span className="text-2xl leading-none" title={mood.label}>{mood.emoji}</span>
        <p className="font-hand text-xl md:text-2xl text-charcoal leading-snug break-words flex-1">
          {note.message}
        </p>
      </div>

      <div className="mt-5 pt-4 border-t border-dashed border-charcoal/15 flex items-center justify-between gap-2">
        <p className="font-mono text-[10px] tracking-wider uppercase text-charcoal/50 truncate">
          — {note.name?.trim() || "anonymous"}
        </p>
        <Link
          to={note.page as "/"}
          className="font-mono text-[9px] tracking-widest uppercase bg-charcoal/5 hover:bg-brand hover:text-white px-2 py-1 rounded-full text-charcoal/60 transition-colors whitespace-nowrap"
        >
          {label}
        </Link>
      </div>

      <p className="font-mono text-[9px] text-charcoal/30 mt-2">
        {new Date(note.created_at).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </p>
    </div>
  );
}
