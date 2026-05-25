import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

type Reaction = {
  id: string;
  name: string;
  emoji: string;
  memory: string;
  created_at: string;
};

const EMOJIS = ["❤️", "🥹", "😭", "🤣", "🔥", "🫶", "🍻", "🙃", "🥲", "✨"];

function timeAgo(iso: string) {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

export function LetterReactions() {
  const [items, setItems] = useState<Reaction[]>([]);
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("❤️");
  const [memory, setMemory] = useState("");
  const [sending, setSending] = useState(false);

  const load = async () => {
    const { data } = await supabase
      .from("letter_reactions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);
    if (data) setItems(data as Reaction[]);
  };

  useEffect(() => {
    load();
    const channel = supabase
      .channel("letter_reactions")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "letter_reactions" },
        (payload) => setItems((prev) => [payload.new as Reaction, ...prev]),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const counts = EMOJIS.map((e) => ({
    emoji: e,
    count: items.filter((i) => i.emoji === e).length,
  }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emoji) return;
    setSending(true);
    const { error } = await supabase.from("letter_reactions").insert({
      name: name.trim().slice(0, 60),
      emoji,
      memory: memory.trim().slice(0, 200),
    });
    setSending(false);
    if (error) {
      toast.error("Couldn't send. Try again?");
      return;
    }
    setMemory("");
    setName((n) => n);
    toast.success("Reaction added 🫶");
  };

  return (
    <section className="px-6 md:px-10 pb-24 max-w-3xl mx-auto">
      <header className="mb-6">
        <p className="font-mono text-xs tracking-[0.3em] uppercase text-charcoal/50 mb-3">
          07 / Reactions
        </p>
        <h2 className="font-serif font-bold text-[clamp(1.75rem,4vw,2.75rem)] leading-tight">
          Drop an <span className="italic text-brand">emoji</span>. Leave a memory.
        </h2>
      </header>

      {/* live counts */}
      <div className="flex flex-wrap gap-2 mb-6">
        {counts.map((c) => (
          <span
            key={c.emoji}
            className="inline-flex items-center gap-1.5 bg-paper border border-charcoal/10 rounded-full px-3 py-1.5 text-sm"
          >
            <span>{c.emoji}</span>
            <span className="font-mono text-xs text-charcoal/60">{c.count}</span>
          </span>
        ))}
      </div>

      <form onSubmit={submit} className="paper-card p-6 md:p-8 rounded-2xl mb-10 space-y-4">
        <div>
          <label className="font-mono text-xs tracking-[0.2em] uppercase text-charcoal/60 mb-2 block">
            Pick a reaction
          </label>
          <div className="flex flex-wrap gap-2">
            {EMOJIS.map((e) => (
              <button
                key={e}
                type="button"
                onClick={() => setEmoji(e)}
                className={`text-xl w-11 h-11 rounded-full border transition-all ${
                  emoji === e
                    ? "border-brand bg-brand/10 scale-110"
                    : "border-charcoal/15 hover:border-charcoal/40"
                }`}
                aria-label={`React with ${e}`}
              >
                {e}
              </button>
            ))}
          </div>
        </div>

        <Input
          placeholder="Your name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={60}
        />

        <Textarea
          placeholder="A tiny memory… (optional, 200 chars)"
          value={memory}
          onChange={(e) => setMemory(e.target.value)}
          maxLength={200}
          rows={3}
        />

        <div className="flex items-center justify-between">
          <span className="font-mono text-xs text-charcoal/50">
            {memory.length}/200
          </span>
          <button
            type="submit"
            disabled={sending}
            className="bg-charcoal text-paper px-5 py-2.5 rounded-full font-medium text-sm hover:bg-brand transition-colors disabled:opacity-50"
          >
            {sending ? "Sending…" : "Send reaction →"}
          </button>
        </div>
      </form>

      {/* feed */}
      <div className="space-y-3">
        {items.length === 0 && (
          <p className="font-mono text-xs text-charcoal/50 text-center py-8">
            Be the first to react.
          </p>
        )}
        {items.map((r) => (
          <article
            key={r.id}
            className="flex gap-4 items-start paper-card p-4 md:p-5 rounded-xl"
          >
            <div className="text-3xl shrink-0 leading-none pt-0.5">{r.emoji}</div>
            <div className="flex-1 min-w-0">
              {r.memory && (
                <p className="font-serif text-base md:text-lg text-charcoal/85 leading-snug">
                  {r.memory}
                </p>
              )}
              <p className="mt-1 font-mono text-xs text-charcoal/50">
                — {r.name || "anon"} · {timeAgo(r.created_at)}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
