import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { photoMap } from "@/lib/photos";
import firstDayImg from "@/assets/timeline/first-2.jpeg";
import gradMorning from "@/assets/timeline/grad-morning.jpeg";
import year3Concert from "@/assets/timeline/year3-concert.jpeg";

const firstDay = firstDayImg;
const dorm = photoMap.p4;
const graduation = gradMorning;

export const Route = createFileRoute("/timeline")({
  head: () => ({
    meta: [
      { title: "Timeline — Four-year stack trace" },
      { name: "description", content: "Year by year, the things we learned, broke and laughed at across four years of B.Tech CSE." },
      { property: "og:title", content: "Timeline — Four-year stack trace" },
      { property: "og:description", content: "Year by year, the things we learned, broke and laughed at." },
    ],
  }),
  component: TimelinePage,
});

const years = [
  {
    year: "2022 — 23",
    label: "Year 01",
    title: "fresh_install.exe",
    body: "New laptops, new ID cards, and the awkward classroom where nobody knew anyone's name. Then one random lecture, someone said cheese — and accidentally, our very first group photo happened. Nine strangers, one frame, no idea what was coming.",
    img: firstDay,
    moments: ["Our first-ever picture together (this one!)", "Learning each other's names mid-attendance", "First mess fight over the last piece of paneer"],
  },
  {
    year: "2023 — 24",
    label: "Year 02",
    title: "infinite_recursion()",
    body: "The hostel became home. DSA became a personality trait. We discovered the 2 AM Maggi stall and the joy of bunking together — solidarity above syllabus.",
    img: dorm,
    moments: ["Switched to dark mode forever", "Built our first ugly little website", "Cried, laughed, bonded over OOP labs"],
  },
  {
    year: "2024 — 25",
    label: "Year 03",
    title: "culfest_overdrive.sh",
    body: "Lights, bass, and that one fest night the entire campus showed up for. We didn't win a hackathon — we showed up for the headliner instead, hands on hips, jaws on the floor, pretending we understood the DJ's setlist.",
    img: year3Concert,
    moments: ["Front row for the culfest headliner", "Coordinated 'casual' pose, zero coordination", "Lost each other in the crowd 4 times, found each other at the chai stall"],
  },
  {
    year: "2025 — 26",
    label: "Year 04",
    title: "graduation_commit",
    body: "Placements, projects, the slow goodbye disguised as routine. This photo? Morning after graduation — eyes half-open, hearts fully wrecked, standing in the same spot we'd walked past a thousand times, suddenly knowing we wouldn't again. We pushed the final commit and watched the build pass.",
    img: graduation,
    moments: ["The morning-after-graduation photo (this one)", "Final farewell night under string lights", "Throwing caps. Throwing tears."],
  },
];

function TimelinePage() {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const itemRefs = useRef<Array<HTMLLIElement | null>>([]);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setActive((a) => {
        const next = (a + 1) % years.length;
        itemRefs.current[next]?.scrollIntoView({ behavior: "smooth", block: "center" });
        return next;
      });
    }, 3500);
    return () => clearInterval(id);
  }, [playing]);

  const go = (i: number) => {
    const next = Math.max(0, Math.min(years.length - 1, i));
    setActive(next);
    itemRefs.current[next]?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); go(active + 1); }
      else if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); go(active - 1); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

  const onTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 50) go(active + (dx < 0 ? 1 : -1));
    touchStartX.current = null;
  };

  return (
    <main className="min-h-screen" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <SiteNav />

      <header className="px-6 md:px-10 pt-16 pb-12 max-w-7xl mx-auto">
        <p className="font-mono text-xs tracking-[0.3em] uppercase text-charcoal/50 mb-4">
          03 / Stack Trace
        </p>
        <h1 className="font-serif font-bold leading-[0.9] tracking-tight text-[clamp(2.5rem,7vw,5.5rem)]">
          The four-year <span className="italic text-brand">stack&nbsp;trace</span>.
        </h1>
        <p className="mt-6 max-w-xl text-charcoal/70">
          Read it top to bottom, or swipe / use arrow keys to jump between years.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-2">
          {years.map((y, i) => (
            <button
              key={y.label}
              onClick={() => { setPlaying(false); go(i); }}
              className={`font-mono text-xs px-3 py-1.5 rounded-full border transition ${
                active === i
                  ? "bg-brand text-paper border-brand"
                  : "border-charcoal/20 text-charcoal/60 hover:border-charcoal/40"
              }`}
            >
              {y.label}
            </button>
          ))}
          <button
            onClick={() => setPlaying((p) => !p)}
            aria-pressed={playing}
            className={`ml-1 font-mono text-xs px-3 py-1.5 rounded-full border transition inline-flex items-center gap-1.5 ${
              playing ? "bg-charcoal text-paper border-charcoal" : "border-charcoal/30 text-charcoal/70 hover:border-brand hover:text-brand"
            }`}
          >
            {playing ? (
              <><span aria-hidden>❚❚</span> pause autoplay</>
            ) : (
              <><span aria-hidden>▶</span> autoplay</>
            )}
          </button>
        </div>
      </header>

      <section className="px-6 md:px-10 pb-24 max-w-6xl mx-auto">
        <ol className="relative border-l-2 border-dashed border-charcoal/20 pl-6 md:pl-12 space-y-20">
          {years.map((y, i) => (
            <li
              key={y.year}
              ref={(el) => { itemRefs.current[i] = el; }}
              className={`relative transition-opacity duration-500 ${active === i ? "opacity-100" : "opacity-60"}`}
            >
              <span
                className={`absolute -left-[34px] md:-left-[58px] top-2 size-4 rounded-full ring-4 ring-paper shadow-md transition ${
                  active === i ? "bg-brand scale-125" : "bg-charcoal/30"
                }`}
                aria-hidden
              />
              <div className="grid md:grid-cols-2 gap-8 items-start">
                <div>
                  <p className="font-mono text-xs tracking-[0.25em] uppercase text-brand mb-2">{y.label} · {y.year}</p>
                  <h2 className="font-serif text-3xl md:text-5xl tracking-tight mb-4">{y.title}</h2>
                  <p className="text-charcoal/75 leading-relaxed mb-5">{y.body}</p>
                  <ul className="space-y-1.5 font-mono text-sm text-charcoal/60">
                    {y.moments.map((m) => (
                      <li key={m} className="flex gap-3">
                        <span className="text-brand">›</span>{m}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={`relative overflow-hidden rounded-2xl bg-charcoal/5 aspect-[4/3] ${i % 2 ? "md:order-first" : ""}`}>
                  <img
                    src={y.img}
                    alt={y.title}
                    loading="lazy"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-12 flex items-center justify-between font-mono text-xs text-charcoal/50">
          <button onClick={() => go(active - 1)} disabled={active === 0} className="disabled:opacity-30 hover:text-brand">← prev year</button>
          <span>{active + 1} / {years.length} · swipe or use ← →</span>
          <button onClick={() => go(active + 1)} disabled={active === years.length - 1} className="disabled:opacity-30 hover:text-brand">next year →</button>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
