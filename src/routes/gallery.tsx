import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import graduation from "@/assets/graduation-day.jpg";
import dorm from "@/assets/dorm-desk.jpg";
import rainy from "@/assets/rainy-canteen.jpg";
import bug from "@/assets/first-bug.jpg";
import sunrise from "@/assets/sunrise-terrace.jpg";
import hackathon from "@/assets/hackathon.jpg";
import firstDay from "@/assets/first-day.jpg";

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

type Polaroid = {
  src: string;
  caption: string;
  date: string;
  rotate: string;
};

const polaroids: Polaroid[] = [
  { src: firstDay, caption: "Day one. Nobody knew anybody.", date: "AUG 2022", rotate: "-rotate-3" },
  { src: dorm, caption: "Room 302. The headquarters.", date: "OCT 2022", rotate: "rotate-2" },
  { src: bug, caption: "When Hello World finally compiled.", date: "NOV 2022", rotate: "-rotate-2" },
  { src: rainy, caption: "Monsoon canteen runs.", date: "JUL 2023", rotate: "rotate-3" },
  { src: hackathon, caption: "36-hour hackathon. We placed nothing.", date: "FEB 2024", rotate: "-rotate-1" },
  { src: sunrise, caption: "The morning after the last viva.", date: "APR 2026", rotate: "rotate-2" },
  { src: graduation, caption: "Caps in the air. Hearts on the floor.", date: "MAY 2026", rotate: "-rotate-2" },
];

function GalleryPage() {
  const [active, setActive] = useState<number | null>(null);

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
          {polaroids.map((p, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`group relative paper-card p-3 pb-12 ${p.rotate} hover:rotate-0 hover:scale-[1.04] hover:z-10 transition-all duration-500 ease-out text-left`}
            >
              <span className="tape left-1/2 -translate-x-1/2 -top-3 w-20 h-5 rotate-[-3deg]" aria-hidden />
              <div className="w-full aspect-square overflow-hidden bg-charcoal/5">
                <img
                  src={p.src}
                  alt={p.caption}
                  loading="lazy"
                  className="w-full h-full object-cover grayscale-[35%] group-hover:grayscale-0 transition-all duration-700"
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

      {/* Lightbox */}
      {active !== null && (
        <div
          onClick={() => setActive(null)}
          className="fixed inset-0 z-[60] bg-charcoal/85 backdrop-blur-sm grid place-items-center p-6 animate-reveal"
        >
          <figure
            onClick={(e) => e.stopPropagation()}
            className="paper-card p-4 pb-16 max-w-2xl w-full"
          >
            <img
              src={polaroids[active].src}
              alt={polaroids[active].caption}
              className="w-full aspect-square object-cover"
            />
            <figcaption className="mt-5 px-2 flex justify-between items-end">
              <p className="font-hand text-3xl">{polaroids[active].caption}</p>
              <span className="font-mono text-xs text-charcoal/40">{polaroids[active].date}</span>
            </figcaption>
          </figure>
          <button
            onClick={() => setActive(null)}
            className="absolute top-6 right-6 text-paper font-mono text-sm hover:text-brand"
          >
            CLOSE ✕
          </button>
        </div>
      )}

      <SiteFooter />
    </main>
  );
}
