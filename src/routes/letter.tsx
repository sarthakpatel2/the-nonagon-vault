import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/letter")({
  head: () => ({
    meta: [
      { title: "The Letter — To my college friends" },
      { name: "description", content: "A final, honest letter from a B.Tech CSE graduate to the friends who made the four years matter." },
      { property: "og:title", content: "The Letter — To my college friends" },
      { property: "og:description", content: "A final, honest letter from a graduate to the friends who made it count." },
    ],
  }),
  component: LetterPage,
});

const fullLetter = `Dear all of you,

If you're reading this, the hostel WiFi has finally been kind to us.

Four years ago we showed up with new laptops and louder anxieties. We didn't know what a linked list was. We didn't know what each other's laugh sounded like. Today both of those things feel like the easiest knowledge in the world.

I want to thank you. For the notes shared at 2 AM. For the proxies that should never have worked but somehow did. For the long walks after bad results. For the canteen chai that tasted like therapy. For showing up when I didn't know how to ask.

College is going to keep being remembered as a degree. Quietly, between us, it'll always be you. The crew. The reason 'going home' for four years actually meant going to be near you.

We're scattering now — to companies and cities and timezones. That's okay. We'll text. We'll call. We'll be the WhatsApp group that goes silent for weeks and then erupts at 1 AM over one stupid meme.

Keep pushing to main. Keep failing builds. Keep showing up for each other.

I love you guys.

— Arjun.`;

function LetterPage() {
  const [typed, setTyped] = useState("");
  const [done, setDone] = useState(false);
  const [skip, setSkip] = useState(false);

  useEffect(() => {
    if (skip) {
      setTyped(fullLetter);
      setDone(true);
      return;
    }
    let i = 0;
    const id = window.setInterval(() => {
      i += 2;
      setTyped(fullLetter.slice(0, i));
      if (i >= fullLetter.length) {
        window.clearInterval(id);
        setDone(true);
      }
    }, 18);
    return () => window.clearInterval(id);
  }, [skip]);

  return (
    <main className="min-h-screen">
      <SiteNav />

      <header className="px-6 md:px-10 pt-16 pb-8 max-w-3xl mx-auto">
        <p className="font-mono text-xs tracking-[0.3em] uppercase text-charcoal/50 mb-4">
          05 / Epilogue
        </p>
        <h1 className="font-serif font-bold leading-[0.95] tracking-tight text-[clamp(2.25rem,6vw,4.5rem)]">
          One last <span className="italic text-brand">commit</span>.
        </h1>
      </header>

      <section className="px-6 md:px-10 pb-24 max-w-3xl mx-auto">
        <article className="relative paper-card p-8 md:p-14 rounded-3xl">
          <span className="tape left-12 -top-4 w-28 h-6 rotate-[-3deg]" aria-hidden />
          <span className="tape right-12 -top-4 w-28 h-6 rotate-[4deg]" aria-hidden />

          <pre className="font-serif whitespace-pre-wrap text-lg md:text-xl leading-relaxed text-charcoal/85 [font-feature-settings:'ss01']">
            {typed}
            {!done && <span className="inline-block w-[2px] h-[1.1em] bg-brand align-[-2px] ml-0.5 animate-blink" />}
          </pre>

          {!done && (
            <button
              onClick={() => setSkip(true)}
              className="mt-8 font-mono text-xs tracking-[0.2em] uppercase text-charcoal/50 hover:text-brand transition-colors"
            >
              Skip typing →
            </button>
          )}

          {done && (
            <div className="mt-10 pt-8 border-t border-charcoal/10 flex flex-wrap items-end justify-between gap-6">
              <p className="font-hand text-4xl text-brand">— Arjun.</p>
              <Link
                to="/yearbook"
                className="inline-flex items-center gap-2 bg-charcoal text-paper px-5 py-3 rounded-full font-medium text-sm hover:bg-brand transition-colors"
              >
                Sign the yearbook →
              </Link>
            </div>
          )}
        </article>
      </section>

      <SiteFooter />
    </main>
  );
}
