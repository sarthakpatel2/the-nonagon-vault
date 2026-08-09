import { useEffect, useState } from "react";
import { useLocation } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type LoveNote = {
  id: string;
  name: string;
  message: string;
  mood: string;
  created_at: string;
};

export const MOODS = [
  { id: "love", emoji: "💌", label: "Love", bg: "bg-pink-100", tape: "bg-pink-300/50" },
  { id: "funny", emoji: "😂", label: "Funny", bg: "bg-yellow-100", tape: "bg-yellow-300/60" },
  { id: "sentimental", emoji: "🥹", label: "Sentimental", bg: "bg-blue-50", tape: "bg-blue-300/50" },
  { id: "roast", emoji: "🔥", label: "Roast", bg: "bg-orange-100", tape: "bg-orange-300/60" },
  { id: "hype", emoji: "✨", label: "Hype", bg: "bg-purple-100", tape: "bg-purple-300/50" },
] as const;

export const MOOD_MAP = Object.fromEntries(MOODS.map((m) => [m.id, m]));

type Confetti = {
  id: number;
  left: number;
  delay: number;
  duration: number;
  emoji: string;
  rotate: number;
  drift: number;
};

const MAX_MSG = 280;
const MAX_NAME = 60;
const EMOJIS = ["💖", "💗", "💕", "💞", "✨", "🌸", "💘", "💝", "🫶"];

function playChime() {
  try {
    const AC =
      typeof window !== "undefined"
        ? window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
        : null;
    if (!AC) return;
    const ctx = new AC();
    const now = ctx.currentTime;
    // Bright major arpeggio: A5, C#6, E6
    [880, 1108.73, 1318.51].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      const start = now + i * 0.08;
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.18, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.6);
      osc.connect(gain).connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.65);
    });
    setTimeout(() => ctx.close(), 1200);
  } catch {
    /* no-op */
  }
}

export function SendLove() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [notes, setNotes] = useState<LoveNote[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [burst, setBurst] = useState(0);
  const [confetti, setConfetti] = useState<Confetti[]>([]);
  const [mood, setMood] = useState<string>("love");
  const [trail, setTrail] = useState<{ id: number; x: number; y: number; emoji: string }[]>([]);

  useEffect(() => {
    if (burst === 0) return;
    const stopAt = Date.now() + 2000;
    let last = 0;
    const onMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now > stopAt || now - last < 40) return;
      last = now;
      const emoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
      const id = now + Math.random();
      setTrail((t) => [...t, { id, x: e.clientX, y: e.clientY, emoji }]);
      setTimeout(() => setTrail((t) => t.filter((p) => p.id !== id)), 900);
    };
    window.addEventListener("mousemove", onMove);
    const timeout = setTimeout(() => {
      window.removeEventListener("mousemove", onMove);
    }, 2000);
    return () => {
      window.removeEventListener("mousemove", onMove);
      clearTimeout(timeout);
    };
  }, [burst]);


  const fireConfetti = () => {
    const pieces: Confetti[] = Array.from({ length: 32 }, (_, i) => ({
      id: Date.now() + i,
      left: Math.random() * 100,
      delay: Math.random() * 0.25,
      duration: 1.6 + Math.random() * 1.4,
      emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
      rotate: Math.random() * 720 - 360,
      drift: Math.random() * 80 - 40,
    }));
    setConfetti(pieces);
    setTimeout(() => setConfetti([]), 3200);
  };

  const loadNotes = async () => {
    const { data, error } = await supabase
      .from("love_notes")
      .select("id,name,message,mood,created_at")
      .eq("page", pathname)
      .order("created_at", { ascending: false })
      .limit(50);
    if (!error && data) setNotes(data as LoveNote[]);
    setLoaded(true);
  };

  useEffect(() => {
    if (open && !loaded) loadNotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedMsg = message.trim();
    if (!trimmedName) {
      toast.error("Add your name so we know who sent the love 💌");
      return;
    }
    if (!trimmedMsg) {
      toast.error("Write a little something first 💌");
      return;
    }
    if (trimmedName.length > MAX_NAME) return;
    if (trimmedMsg.length > MAX_MSG) return;
    setSending(true);
    const { error } = await supabase.from("love_notes").insert({
      name: trimmedName.slice(0, MAX_NAME),
      message: trimmedMsg.slice(0, MAX_MSG),
      page: pathname,
      mood,
    });
    setSending(false);
    if (error) {
      toast.error("Couldn't send love. Try again?");
      return;
    }
    setStoredName(trimmedName);
    toast.success("Love sent 💖");
    setMessage("");
    setBurst((b) => b + 1);
    fireConfetti();
    playChime();
    loadNotes();
  };

  return (
    <>
      {/* Heart trail cursor */}
      {trail.length > 0 && (
        <div className="pointer-events-none fixed inset-0 z-[70]">
          {trail.map((p) => (
            <span
              key={p.id}
              className="absolute text-2xl will-change-transform"
              style={{
                left: p.x,
                top: p.y,
                transform: "translate(-50%, -50%)",
                animation: "heart-trail 0.9s ease-out forwards",
              }}
            >
              {p.emoji}
            </span>
          ))}
          <style>{`
            @keyframes heart-trail {
              0% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
              100% { opacity: 0; transform: translate(-50%, -140%) scale(0.5); }
            }
          `}</style>
        </div>
      )}


      {confetti.length > 0 && (
        <div className="pointer-events-none fixed inset-0 z-[60] overflow-hidden">
          {confetti.map((p) => (
            <span
              key={p.id}
              className="absolute -top-10 text-2xl will-change-transform"
              style={{
                left: `${p.left}%`,
                animation: `love-fall ${p.duration}s ${p.delay}s cubic-bezier(0.25,0.46,0.45,0.94) forwards`,
                ["--drift" as string]: `${p.drift}px`,
                ["--rot" as string]: `${p.rotate}deg`,
              } as React.CSSProperties}
            >
              {p.emoji}
            </span>
          ))}
          <style>{`
            @keyframes love-fall {
              0% { transform: translate3d(0,-10vh,0) rotate(0deg); opacity: 1; }
              100% { transform: translate3d(var(--drift), 110vh, 0) rotate(var(--rot)); opacity: 0; }
            }
          `}</style>
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Send Love"
        className="fixed bottom-6 right-6 z-40 group inline-flex items-center gap-2 bg-brand text-white px-5 py-3 rounded-full font-medium text-sm shadow-[0_10px_30px_oklch(0.68_0.21_38/0.4)] hover:scale-105 active:scale-95 transition-transform"
      >
        <span className="text-lg group-hover:animate-pulse">💖</span>
        <span className="font-serif italic">Send Love</span>
      </button>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 grid place-items-center p-4 bg-charcoal/60 backdrop-blur-sm animate-in fade-in"
          onClick={() => setOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg bg-cream rounded-3xl shadow-2xl overflow-hidden border border-charcoal/10"
          >
            {/* Heart burst */}
            {burst > 0 && (
              <div
                key={burst}
                className="pointer-events-none absolute inset-0 grid place-items-center text-6xl animate-ping"
              >
                💖
              </div>
            )}

            <div className="p-6 md:p-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-charcoal/50">
                    Leave a note
                  </p>
                  <h3 className="font-serif italic text-3xl mt-1">Send Love 💌</h3>
                  <p className="text-sm text-charcoal/60 mt-1">
                    A line, a memory, a feeling — pinned to this page forever.
                  </p>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="text-charcoal/50 hover:text-charcoal text-xl leading-none"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={submit} className="space-y-3">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={MAX_NAME}
                  placeholder="Your name *"
                  required
                  className="w-full bg-paper border border-charcoal/15 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand transition-colors"
                />
                <div className="relative">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value.slice(0, MAX_MSG))}
                    maxLength={MAX_MSG}
                    rows={4}
                    placeholder="Pour your heart out…"
                    className="w-full bg-paper border border-charcoal/15 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand transition-colors resize-none font-hand text-base"
                    required
                  />
                  <span className="absolute bottom-2 right-3 font-mono text-[10px] text-charcoal/40">
                    {message.length}/{MAX_MSG}
                  </span>
                </div>
                <div>
                  <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-charcoal/50 mb-2">
                    Mood
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {MOODS.map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setMood(m.id)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                          mood === m.id
                            ? "bg-charcoal text-paper border-charcoal scale-105"
                            : "bg-paper text-charcoal/70 border-charcoal/15 hover:border-brand"
                        }`}
                      >
                        <span className="mr-1">{m.emoji}</span>
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={sending || !message.trim() || !name.trim()}
                  className="w-full bg-charcoal text-paper py-3 rounded-full font-medium text-sm hover:bg-brand transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sending ? "Sending…" : "Send love 💖"}
                </button>
              </form>

              {/* Wall of love */}
              <div className="mt-6 pt-5 border-t border-charcoal/10">
                <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-charcoal/50 mb-3">
                  Love on this page ({notes.length})
                </p>
                <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
                  {!loaded ? (
                    <p className="text-xs text-charcoal/40 font-mono">loading…</p>
                  ) : notes.length === 0 ? (
                    <p className="text-sm text-charcoal/50 italic font-serif">
                      Be the first to send love here.
                    </p>
                  ) : (
                    notes.map((n) => {
                      const m = MOOD_MAP[n.mood] ?? MOOD_MAP.love;
                      return (
                        <div
                          key={n.id}
                          className={`${m.bg} rounded-xl px-4 py-3 border border-charcoal/5`}
                        >
                          <p className="font-hand text-base text-charcoal leading-snug break-words">
                            <span className="mr-1">{m.emoji}</span>
                            {n.message}
                          </p>
                          <p className="font-mono text-[10px] tracking-wider uppercase text-charcoal/40 mt-1">
                            — {n.name?.trim() || "anonymous"} ·{" "}
                            {new Date(n.created_at).toLocaleDateString(undefined, {
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                          <NoteReactions noteId={n.id} />
                        </div>
                      );
                    })
                  )}

                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const REACTION_EMOJIS = ["❤️", "😂", "🥲"] as const;

function NoteReactions({ noteId }: { noteId: string }) {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [mine, setMine] = useState<Set<string>>(() => {
    if (typeof window === "undefined") return new Set();
    try {
      const raw = sessionStorage.getItem(`note-reacts:${noteId}`);
      return new Set(raw ? (JSON.parse(raw) as string[]) : []);
    } catch {
      return new Set();
    }
  });
  const [bounceEmoji, setBounceEmoji] = useState<string | null>(null);
  const [flashEmoji, setFlashEmoji] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("note_reactions")
        .select("emoji")
        .eq("note_id", noteId);
      if (cancelled || !data) return;
      const next: Record<string, number> = {};
      for (const row of data as { emoji: string }[]) {
        next[row.emoji] = (next[row.emoji] ?? 0) + 1;
      }
      setCounts(next);
    })();
    return () => {
      cancelled = true;
    };
  }, [noteId]);

  const react = async (emoji: string) => {
    if (mine.has(emoji)) return;
    setBounceEmoji(emoji);
    setTimeout(() => setBounceEmoji(null), 400);
    setCounts((c) => ({ ...c, [emoji]: (c[emoji] ?? 0) + 1 }));
    const nextMine = new Set(mine);
    nextMine.add(emoji);
    setMine(nextMine);
    try {
      sessionStorage.setItem(
        `note-reacts:${noteId}`,
        JSON.stringify([...nextMine]),
      );
    } catch {
      /* ignore */
    }
    const { error } = await supabase
      .from("note_reactions")
      .insert({ note_id: noteId, emoji });
    if (error) {
      setCounts((c) => ({ ...c, [emoji]: Math.max(0, (c[emoji] ?? 1) - 1) }));
      nextMine.delete(emoji);
      setMine(new Set(nextMine));
    }
  };

  return (
    <div className="mt-2 flex gap-1.5">
      {REACTION_EMOJIS.map((e) => {
        const count = counts[e] ?? 0;
        const reacted = mine.has(e);
        const isBouncing = bounceEmoji === e;
        return (
          <button
            key={e}
            type="button"
            onClick={() => react(e)}
            disabled={reacted}
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs transition-all ${
              reacted
                ? "bg-charcoal/10 border-charcoal/30 cursor-default"
                : "bg-white/60 border-charcoal/10 hover:border-brand hover:scale-105"
            } ${isBouncing ? "react-bounce" : ""}`}
            aria-label={`React with ${e}`}
          >
            <span className="text-sm leading-none">{e}</span>
            {count > 0 && (
              <span
                key={count}
                className="font-mono text-[10px] text-charcoal/60 react-flash"
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
      <style>{`
        @keyframes reactBounce {
          0%   { transform: scale(1); }
          30%  { transform: scale(1.35); }
          50%  { transform: scale(0.92); }
          70%  { transform: scale(1.08); }
          100% { transform: scale(1); }
        }
        .react-bounce {
          animation: reactBounce 0.4s ease-out;
        }
        @keyframes reactFlash {
          0%   { opacity: 0.3; transform: scale(0.7) translateY(2px); }
          40%  { opacity: 1; transform: scale(1.3) translateY(-1px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        .react-flash {
          animation: reactFlash 0.35s ease-out;
          display: inline-block;
        }
      `}</style>
    </div>
  );
}

