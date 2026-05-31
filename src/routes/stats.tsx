import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/stats")({
  head: () => ({
    meta: [
      { title: "Friendship Stats — The Nonagon Wrapped" },
      { name: "description", content: "The official, completely unscientific stats of the Nonagon. Plans cancelled, chai consumed, attendance proxied." },
      { property: "og:title", content: "Friendship Stats — The Nonagon Wrapped" },
      { property: "og:description", content: "Spotify Wrapped but for nine chaotic engineers." },
    ],
  }),
  component: StatsPage,
});

type Stat = {
  label: string;
  value: string;
  sub: string;
  emoji: string;
  tilt: string;
};

const stats: Stat[] = [
  { label: "Total chai consumed", value: "∞", emoji: "☕", sub: "Tapri uncle bought a flat. From us.", tilt: "-rotate-1" },
  { label: "Plans cancelled", value: "847", emoji: "❌", sub: "Out of 851 plans made. Math checks out.", tilt: "rotate-1" },
  { label: "Proxy attendance given", value: "2,341", emoji: "✋", sub: "Yes ma'am, present. — Someone else, probably.", tilt: "-rotate-2" },
  { label: "Nights before exam started studying", value: "1", emoji: "📚", sub: "Per subject. We are consistent.", tilt: "rotate-2" },
  { label: "Times 'last sutta' was said", value: "1,209", emoji: "🚬", sub: "It is never the last one. Never.", tilt: "-rotate-1" },
  { label: "Biryani plates ordered (Aman)", value: "612", emoji: "🍛", sub: "Solo. Not for the group.", tilt: "rotate-1" },
  { label: "Group photos taken", value: "4,127", emoji: "📸", sub: "Usable ones: 3. Eyes closed: 4,124.", tilt: "-rotate-2" },
  { label: "Times someone said 'bhai aaj nhi'", value: "∞+1", emoji: "😴", sub: "And then showed up anyway.", tilt: "rotate-2" },
  { label: "Assignments copied last-minute", value: "98%", emoji: "📝", sub: "The other 2% were also copied, just earlier.", tilt: "-rotate-1" },
  { label: "Inside jokes nobody outside understands", value: "∞", emoji: "🤝", sub: "Try to explain 'choti advance'. We dare you.", tilt: "rotate-1" },
  { label: "Fights that lasted >24 hours", value: "0", emoji: "💚", sub: "Maximum recorded: 47 minutes.", tilt: "-rotate-2" },
  { label: "Years of friendship", value: "4+", emoji: "♾️", sub: "And counting. Apparently you're stuck with us.", tilt: "rotate-2" },
];

// Animated counter for numeric values
function Counter({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value.match(/^\d+$/) ? "0" : value);

  useEffect(() => {
    const num = Number(value.replace(/[^\d]/g, ""));
    if (!Number.isFinite(num) || num === 0 || !value.match(/^[\d,.]+$/)) {
      setDisplay(value);
      return;
    }
    const el = ref.current;
    if (!el) return;
    let started = false;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && !started) {
          started = true;
          const duration = 1400;
          const start = performance.now();
          const tick = (now: number) => {
            const t = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - t, 3);
            const current = Math.floor(num * eased);
            setDisplay(current.toLocaleString());
            if (t < 1) requestAnimationFrame(tick);
            else setDisplay(value);
          };
          requestAnimationFrame(tick);
        }
      });
    }, { threshold: 0.4 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [value]);

  return <span ref={ref}>{display}</span>;
}

function StatsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteNav />
      <main className="flex-1 px-6 md:px-10 py-12 md:py-16 max-w-6xl mx-auto w-full">
        <header className="mb-12 text-center">
          <p className="font-mono text-xs text-brand uppercase tracking-widest mb-3">// nonagon_wrapped.exe</p>
          <h1 className="text-4xl md:text-6xl font-serif italic text-charcoal mb-4">Friendship Stats</h1>
          <p className="text-charcoal/70 max-w-xl mx-auto">
            Four years of data. Zero scientific accuracy. One legendary group.
          </p>
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {stats.map((s, i) => (
            <article
              key={s.label}
              className={`group relative bg-paper/80 backdrop-blur-sm border border-charcoal/10 rounded-xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${s.tilt} hover:rotate-0`}
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="text-3xl mb-3 group-hover:scale-125 group-hover:rotate-12 transition-transform duration-300 inline-block">
                {s.emoji}
              </div>
              <div className="font-serif text-5xl md:text-6xl text-brand leading-none mb-3 tabular-nums">
                <Counter value={s.value} />
              </div>
              <h3 className="font-medium text-charcoal mb-1.5">{s.label}</h3>
              <p className="text-xs text-charcoal/60 italic">{s.sub}</p>
            </article>
          ))}
        </section>

        <section className="mt-16 bg-paper/80 backdrop-blur-sm border border-charcoal/10 rounded-2xl p-8 md:p-10 text-center">
          <p className="font-mono text-xs text-brand uppercase tracking-widest mb-3">// final_verdict</p>
          <p className="font-serif italic text-2xl md:text-3xl text-charcoal leading-relaxed max-w-2xl mx-auto">
            "If friendship had a CGPA, ours would be a solid 9.0 — one for each of us, rounded up out of love."
          </p>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
