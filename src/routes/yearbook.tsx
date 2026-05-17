import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/yearbook")({
  head: () => ({
    meta: [
      { title: "Yearbook — The Crew" },
      { name: "description", content: "An interactive digital yearbook for the eight friends who made these four years count." },
      { property: "og:title", content: "Yearbook — The Crew" },
      { property: "og:description", content: "An interactive digital yearbook of the crew." },
    ],
  }),
  component: YearbookPage,
});

type Person = {
  name: string;
  role: string;
  quote: string;
  superpower: string;
  catchphrase: string;
  futureSeenIn: string;
};

const crew: Person[] = [
  { name: "S. Rahul", role: "The Architect", quote: "I still have the drive with everyone's proxy records.", superpower: "Drawing UML at 3 AM", catchphrase: "Bhai, ek diagram bana le.", futureSeenIn: "Building startups in Bangalore" },
  { name: "Priya K.", role: "The Debugger", quote: "Will miss the maggi more than the lectures.", superpower: "Spotting a missing semicolon", catchphrase: "It works on my machine.", futureSeenIn: "Leading an SRE team" },
  { name: "Aman V.", role: "The Backbencher", quote: "CSE was a side quest. Gaming was the main game.", superpower: "Sleeping with eyes open", catchphrase: "Ek game aur, promise.", futureSeenIn: "Twitch at 50k followers" },
  { name: "Sara T.", role: "The Topper", quote: "Finally free from 8 AM lectures. Now for 9 AM standups.", superpower: "Notes nobody else made", catchphrase: "I haven't studied at all, guys.", futureSeenIn: "On a stage doing a TEDx" },
  { name: "Karan M.", role: "The Connector", quote: "Knew someone in every department. Knew nothing in OS.", superpower: "Organising trips out of thin air", catchphrase: "Mai dekh leta hoon.", futureSeenIn: "Running an events agency" },
  { name: "Neha R.", role: "The Designer", quote: "Made every project PPT look like Apple's launch.", superpower: "Aligning to the 4px grid", catchphrase: "The Figma file is sacred.", futureSeenIn: "Design lead at a quiet, cool studio" },
  { name: "Vikram S.", role: "The Philosopher", quote: "Every viva turned into an existential discussion.", superpower: "Long walks, longer monologues", catchphrase: "But what is, really, a process?", futureSeenIn: "Writing a blog nobody reads but loves" },
  { name: "Ananya P.", role: "The Glue", quote: "Held this group together through every fight.", superpower: "Remembering everyone's birthday", catchphrase: "We're going. Get up.", futureSeenIn: "Hosting our 10-year reunion" },
];

function YearbookPage() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <main className="min-h-screen">
      <SiteNav />

      <header className="px-6 md:px-10 pt-16 pb-10 max-w-7xl mx-auto">
        <p className="font-mono text-xs tracking-[0.3em] uppercase text-charcoal/50 mb-4">
          04 / The Crew
        </p>
        <h1 className="font-serif font-bold leading-[0.9] tracking-tight text-[clamp(2.5rem,7vw,5.5rem)]">
          The digital <span className="italic text-brand">yearbook</span>.
        </h1>
        <p className="mt-6 max-w-xl text-charcoal/70">
          Tap a name. Reveal the inside joke. These are the people who made the syllabus survivable.
        </p>
      </header>

      <section className="bg-charcoal text-paper py-20 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <h2 className="font-serif text-3xl md:text-5xl italic">Class of 2026</h2>
            <p className="font-mono text-[10px] md:text-xs text-paper/40 tracking-[0.2em] uppercase hidden sm:block">
              Tap to reveal
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {crew.map((p, i) => {
              const isOpen = open === i;
              return (
                <button
                  key={p.name}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className={`text-left border rounded-xl p-6 transition-all duration-300 group min-h-[220px] flex flex-col justify-between
                    ${isOpen ? "bg-brand border-brand text-white" : "border-paper/15 hover:bg-paper/5 hover:border-paper/40"}
                  `}
                >
                  <div>
                    <span className={`font-mono text-[10px] tracking-[0.2em] uppercase block mb-4 ${isOpen ? "text-white/70" : "text-paper/40"}`}>
                      {p.name} <span className={isOpen ? "text-white/40" : "text-brand"}>//</span> {p.role}
                    </span>
                    {!isOpen ? (
                      <p className="font-serif text-lg leading-snug">&ldquo;{p.quote}&rdquo;</p>
                    ) : (
                      <div className="space-y-3 text-sm">
                        <p><span className="opacity-60">Superpower —</span> {p.superpower}</p>
                        <p><span className="opacity-60">Catchphrase —</span> &ldquo;{p.catchphrase}&rdquo;</p>
                        <p><span className="opacity-60">Future spotted at —</span> {p.futureSeenIn}</p>
                      </div>
                    )}
                  </div>
                  <span className={`font-serif italic mt-6 ${isOpen ? "text-white" : "text-brand"}`}>
                    {isOpen ? "← close" : "Read more →"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* SIGNATURE WALL */}
      <section className="px-6 md:px-10 py-24 max-w-7xl mx-auto">
        <p className="font-mono text-xs tracking-[0.3em] uppercase text-charcoal/50 mb-3">Signature wall</p>
        <h2 className="font-serif text-3xl md:text-5xl tracking-tight mb-12">
          Last-day <span className="italic text-brand">scribbles</span>.
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[
            { name: "— Rahul", note: "Reunion in 5. Don't ghost." },
            { name: "— Priya", note: "Push to prod and call me." },
            { name: "— Aman", note: "GG, well played, mates." },
            { name: "— Sara", note: "Stay curious, stay sleepy." },
            { name: "— Karan", note: "I'll plan the trip. As always." },
            { name: "— Neha", note: "Keep the kerning tight." },
            { name: "— Vikram", note: "Life is just a `while true`." },
            { name: "— Ananya", note: "I love you idiots." },
            { name: "— Arjun", note: "Thank you for everything." },
          ].map((s, i) => (
            <div
              key={i}
              className={`relative paper-card p-6 ${i % 2 ? "rotate-1" : "-rotate-1"} hover:rotate-0 transition-transform`}
            >
              <span className="tape left-4 -top-3 w-14 h-4 rotate-[-6deg]" aria-hidden />
              <p className="font-hand text-2xl leading-snug text-charcoal/90">&ldquo;{s.note}&rdquo;</p>
              <p className="font-hand text-xl text-brand mt-4">{s.name}</p>
            </div>
          ))}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
