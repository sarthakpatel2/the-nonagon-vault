import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { photoMap } from "@/lib/photos";

const graduation = photoMap.p1;
const dorm = photoMap.p6;
const rainy = photoMap.p5;
const bug = photoMap.p0;
const sunrise = photoMap.p3;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Arjun & Co. — Four years, one infinite loop" },
      { name: "description", content: "A scrapbook of memories from a B.Tech CSE graduate and the friends who made it all unforgettable." },
      { property: "og:title", content: "Arjun & Co. — Four years, one infinite loop" },
      { property: "og:description", content: "A scrapbook of memories from a B.Tech CSE graduate and the friends who made it all unforgettable." },
    ],
  }),
  component: Home,
});

const jokes = [
  "PROXY LAGA DENA",
  "WHO HAS THE SEM 5 NOTES?",
  "TEA AT 2 AM",
  "SEGMENTATION FAULT",
  "NULL POINTER EXCEPTION",
  "ATTENDANCE 74.9%",
  "LAST DAY VIVA",
  "BHAI CODE CHALA",
  "ONE LAST MAGGI",
  "PLACEMENT SEASON",
];

function Home() {
  return (
    <main className="min-h-screen">
      <SiteNav />

      {/* HERO */}
      <header className="relative px-6 md:px-10 pt-16 md:pt-24 pb-24 md:pb-32 max-w-7xl mx-auto">
        <p className="font-mono text-xs tracking-[0.3em] uppercase text-charcoal/50 mb-6 animate-reveal">
          A memory archive · 2022 → 2026
        </p>
        <h1 className="font-serif font-bold leading-[0.88] tracking-tight text-[clamp(3rem,11vw,9.5rem)] animate-reveal [animation-delay:120ms]">
          Four years.<br />
          One <span className="italic text-brand">infinite</span> loop.
        </h1>
        <div className="mt-10 grid md:grid-cols-2 gap-8 items-end animate-reveal [animation-delay:240ms]">
          <p className="max-w-md text-base md:text-lg leading-relaxed text-charcoal/70">
            From debugging 2&nbsp;AM segmentation faults to watching the sunrise from the
            hostel terrace — this is our version control of memories. Pull, push, and
            never forget.
          </p>
          <div className="flex md:justify-end gap-3">
            <Link
              to="/gallery"
              className="group inline-flex items-center gap-2 bg-charcoal text-paper px-5 py-3 rounded-full font-medium text-sm hover:bg-brand transition-colors"
            >
              Open the scrapbook
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
            <Link
              to="/letter"
              className="inline-flex items-center gap-2 border border-charcoal/15 px-5 py-3 rounded-full font-medium text-sm hover:border-brand hover:text-brand transition-colors"
            >
              Read the letter
            </Link>
          </div>
        </div>
      </header>

      {/* MARQUEE */}
      <div className="py-4 border-y border-charcoal/10 bg-cream/60 overflow-hidden">
        <div className="flex gap-12 font-mono text-sm text-charcoal/60 whitespace-nowrap animate-marquee w-max">
          {[...jokes, ...jokes, ...jokes].map((j, i) => (
            <span key={i} className="flex items-center gap-12">
              {j}
              <span className="text-brand">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* MASONRY MEMORIES */}
      <section className="px-6 md:px-10 py-20 md:py-28 max-w-7xl mx-auto">
        <div className="grid grid-cols-12 gap-4 md:gap-6">
          <div className="col-span-12 md:col-span-8 group">
            <div className="relative w-full aspect-[16/10] overflow-hidden rounded-2xl bg-charcoal/5">
              <img
                src={graduation}
                alt="Graduation morning with friends throwing caps in the air"
                width={1280}
                height={800}
                className="w-full h-full object-cover transition-transform duration-[1.2s] group-hover:scale-105"
              />
            </div>
            <div className="flex justify-between items-start mt-4">
              <h3 className="font-serif text-xl md:text-2xl">The Graduation Morning</h3>
              <span className="font-mono text-xs text-charcoal/40">05.24.2026</span>
            </div>
          </div>

          <div className="col-span-12 md:col-span-4 flex flex-col gap-4 md:gap-6">
            <div className="relative bg-brand text-white p-6 md:p-8 rounded-2xl flex-1 flex flex-col justify-between overflow-hidden grain">
              <pre className="font-mono text-xs md:text-sm leading-relaxed opacity-95">{`while (alive) {
  eat();
  code();
  hangout(friends);
  sleep(false);
}`}</pre>
              <p className="font-serif text-2xl md:text-3xl leading-tight mt-6">
                The lab sessions that became life sessions.
              </p>
            </div>
            <div className="group">
              <div className="relative w-full aspect-square overflow-hidden rounded-2xl bg-charcoal/5">
                <img
                  src={dorm}
                  alt="Messy hostel desk with laptop and energy drinks"
                  width={800}
                  height={800}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04] group-hover:rotate-[0.5deg]"
                />
              </div>
              <h3 className="font-serif text-lg md:text-xl mt-3">Final Year Project Hell</h3>
            </div>
          </div>

          <div className="col-span-6 md:col-span-3 mt-6 md:mt-12 group">
            <div className="relative w-full aspect-[4/5] overflow-hidden rounded-2xl bg-charcoal/5">
              <img
                src={rainy}
                alt="Rainy canteen view"
                width={640}
                height={800}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <p className="text-sm text-charcoal/60 mt-3">
              Remember when one shower turned into four hours of canteen chai?
            </p>
          </div>

          <div className="col-span-12 md:col-span-6 mt-6 md:mt-24 md:px-6 self-center">
            <blockquote className="font-serif text-2xl md:text-4xl italic leading-snug text-balance">
              &ldquo;We didn&rsquo;t realise we were making memories. We thought we were just
              trying to pass Data Structures.&rdquo;
            </blockquote>
            <cite className="block mt-6 font-mono text-[10px] md:text-xs uppercase tracking-[0.25em] text-brand not-italic">
              — The Backbencher&rsquo;s Manifesto
            </cite>
          </div>

          <div className="col-span-6 md:col-span-3 mt-6 md:mt-12 group">
            <div className="relative w-full aspect-[4/5] overflow-hidden rounded-2xl bg-charcoal/5">
              <img
                src={bug}
                alt="Two friends high-fiving after fixing a bug"
                width={640}
                height={800}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <p className="text-sm text-charcoal/60 mt-3">
              The moment <span className="font-mono">printf(&quot;hello&quot;)</span> finally worked after 20 errors.
            </p>
          </div>

          <div className="col-span-12 mt-6 group">
            <div className="relative w-full aspect-[21/9] overflow-hidden rounded-2xl bg-charcoal/5">
              <img
                src={sunrise}
                alt="Friends watching the sunrise from the hostel terrace"
                width={1600}
                height={686}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-[1.2s] group-hover:scale-105"
              />
            </div>
            <div className="flex justify-between items-baseline mt-4">
              <h3 className="font-serif text-xl md:text-2xl">5:42 AM, hostel terrace</h3>
              <span className="font-mono text-xs text-charcoal/40">After-viva sunrise</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA STRIPS */}
      <section className="px-6 md:px-10 pb-24 max-w-7xl mx-auto grid md:grid-cols-3 gap-4">
        <Link to="/timeline" className="group p-8 rounded-2xl bg-charcoal text-paper hover:bg-brand transition-colors">
          <p className="font-mono text-[10px] tracking-[0.25em] uppercase opacity-60 mb-6">01 / The arc</p>
          <h3 className="font-serif text-3xl mb-10 leading-tight">From freshers to final-year zombies.</h3>
          <span className="font-serif italic group-hover:translate-x-1 inline-block transition-transform">View timeline →</span>
        </Link>
        <Link to="/yearbook" className="group p-8 rounded-2xl bg-cream hover:bg-brand hover:text-white transition-colors">
          <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-charcoal/60 group-hover:text-white/70 mb-6">02 / The crew</p>
          <h3 className="font-serif text-3xl mb-10 leading-tight">Eight characters that ran this season.</h3>
          <span className="font-serif italic group-hover:translate-x-1 inline-block transition-transform">Open yearbook →</span>
        </Link>
        <Link to="/letter" className="group p-8 rounded-2xl border border-charcoal/15 hover:bg-brand hover:text-white hover:border-brand transition-colors">
          <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-charcoal/60 group-hover:text-white/70 mb-6">03 / The goodbye</p>
          <h3 className="font-serif text-3xl mb-10 leading-tight">A letter to the friends I won&rsquo;t see daily.</h3>
          <span className="font-serif italic group-hover:translate-x-1 inline-block transition-transform">Read letter →</span>
        </Link>
      </section>

      <SiteFooter />
    </main>
  );
}
