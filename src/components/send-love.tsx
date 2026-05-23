import { useEffect, useState } from "react";
import { useLocation } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type LoveNote = {
  id: string;
  name: string;
  message: string;
  created_at: string;
};

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
      .select("id,name,message,created_at")
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
    const trimmed = message.trim();
    if (!trimmed) {
      toast.error("Write a little something first 💌");
      return;
    }
    if (trimmed.length > MAX_MSG) return;
    setSending(true);
    const { error } = await supabase.from("love_notes").insert({
      name: name.trim().slice(0, MAX_NAME),
      message: trimmed.slice(0, MAX_MSG),
      page: pathname,
    });
    setSending(false);
    if (error) {
      toast.error("Couldn't send love. Try again?");
      return;
    }
    toast.success("Love sent 💖");
    setMessage("");
    setName("");
    setBurst((b) => b + 1);
    fireConfetti();
    playChime();
    loadNotes();
  };

  return (
    <>
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
                  placeholder="Your name (or stay anonymous)"
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
                <button
                  type="submit"
                  disabled={sending || !message.trim()}
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
                    notes.map((n) => (
                      <div
                        key={n.id}
                        className="bg-paper rounded-xl px-4 py-3 border border-charcoal/5"
                      >
                        <p className="font-hand text-base text-charcoal leading-snug break-words">
                          {n.message}
                        </p>
                        <p className="font-mono text-[10px] tracking-wider uppercase text-charcoal/40 mt-1">
                          — {n.name?.trim() || "anonymous"} ·{" "}
                          {new Date(n.created_at).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    ))
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
