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

const fullLetter = `Dear nine of you,

If you're reading this, the hostel WiFi has finally been kind to us. Or someone is using their phone hotspot and pretending it's fine. Either way — hi. I love you. Don't make it weird.

Four years ago we showed up with new laptops, oversized hoodies, and louder anxieties than any of us would admit. We didn't know what a linked list was. We didn't know what each other's laughs sounded like. We didn't know that "bhai ek minute" actually meant forty. Today, all three of those things feel like the easiest knowledge in the world.

I keep trying to write this letter like it's a goodbye. But it's not. It's a thank-you note for nine people who turned a degree into the loudest, dumbest, most ridiculous family I've ever had.

Thank you for the notes shared at 2 AM with the threat "delete after reading". Thank you for the proxies that should never have worked — and for never asking why I needed three on the same day. Thank you for the long walks after bad results, where nobody said anything useful but somehow everything felt lighter by the end. Thank you for the canteen chai that tasted like therapy and the Maggi that tasted like home.

Thank you for fighting with me. For making up over biryani. For the silent room when one of us cried, and the loud room when one of us tried to sing. For showing up when I didn't know how to ask. For knowing me before I knew myself, and somehow staying anyway.

To Aditi — for being the calm in every storm, and the loudest after every drink.
To both Amans — for being equally insane in completely different fonts.
To Pragati — for crying at the smallest things and meaning the biggest ones.
To both Madhavs — for the cancelled plans, the udhaar, the chaos, the love.
To Racheet — for every raita-coded life lesson nobody asked for.
To Sarthak — for being the glue, even when you pretended you weren't.
To Shivendra — for the anger, the hunger, and the heart bigger than both.

College is going to keep being remembered as a degree. Quietly, between us, it'll always be you. The nine. The reason "going home" for four years actually meant going to be near you.

We're scattering now — to companies and cities and timezones we can't pronounce. That's okay. We'll text. We'll call. We'll be the WhatsApp group that goes silent for weeks and then erupts at 1 AM over one stupid meme. We'll meet at weddings and complain about traffic instead of professors. We'll grow up. We'll stay the same in the only ways that matter.

So this is not goodbye. This is me, holding the door open. Walk through it whenever you need. The chai is on me.

Keep pushing to main. Keep failing builds. Keep showing up for each other.

I love you nine, more than I will ever know how to say out loud.

— The Nonagon.`;

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
              <p className="font-hand text-4xl text-brand">— the nonagon.</p>
              <Link
                to="/yearbook"
                className="inline-flex items-center gap-2 bg-charcoal text-paper px-5 py-3 rounded-full font-medium text-sm hover:bg-brand transition-colors"
              >
                Know the group →
              </Link>
            </div>
          )}
        </article>
      </section>

      <SiteFooter />
    </main>
  );
}
