import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { photoMap } from "@/lib/photos";
import firstDayImg from "@/assets/timeline/first-2.jpeg";
import gradMorning from "@/assets/timeline/grad-morning.jpeg";

const firstDay = firstDayImg;
const dorm = photoMap.p4;
const hackathon = photoMap.p2;
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
    moments: ["Our first-ever picture together (this one!)", "Learning each other's names mid-attendance", "Got destroyed by the first MAT-101 paper"],
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
    title: "hack_the_night.sh",
    body: "Hackathons, internships, that one Smart India semi-final we still talk about. We learned what burnout means — and what showing up for each other looks like.",
    img: hackathon,
    moments: ["First on-campus hackathon win (kinda)", "All-nighter for the OS lab record", "Bombay trip with the entire batch"],
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
  return (
    <main className="min-h-screen">
      <SiteNav />

      <header className="px-6 md:px-10 pt-16 pb-12 max-w-7xl mx-auto">
        <p className="font-mono text-xs tracking-[0.3em] uppercase text-charcoal/50 mb-4">
          03 / Stack Trace
        </p>
        <h1 className="font-serif font-bold leading-[0.9] tracking-tight text-[clamp(2.5rem,7vw,5.5rem)]">
          The four-year <span className="italic text-brand">stack&nbsp;trace</span>.
        </h1>
        <p className="mt-6 max-w-xl text-charcoal/70">
          Read it top to bottom, like a debugger walking back through everything that brought us here.
        </p>
      </header>

      <section className="px-6 md:px-10 pb-24 max-w-6xl mx-auto">
        <ol className="relative border-l-2 border-dashed border-charcoal/20 pl-6 md:pl-12 space-y-20">
          {years.map((y, i) => (
            <li key={y.year} className="relative">
              <span
                className="absolute -left-[34px] md:-left-[58px] top-2 size-4 rounded-full bg-brand ring-4 ring-paper shadow-md"
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
      </section>

      <SiteFooter />
    </main>
  );
}
