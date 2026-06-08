import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { BeforeAfter } from "@/components/before-after";
import aditiImg from "@/assets/crew/aditi.jpeg";
import amanSinghImg from "@/assets/crew/aman-singh.jpeg";
import amanSaxenaImg from "@/assets/crew/aman-saxena.jpeg";
import pragatiImg from "@/assets/crew/pragati.jpeg";
import madhavSharmaImg from "@/assets/crew/madhav-sharma.jpeg";
import madhavKhandelwalImg from "@/assets/crew/madhav-khandelwal.jpeg";
import racheetImg from "@/assets/crew/racheet.jpeg";
import sarthakImg from "@/assets/crew/sarthak.jpeg";
import shivendraImg from "@/assets/crew/shivendra.jpeg";

export const Route = createFileRoute("/yearbook")({
  head: () => ({
    meta: [
      { title: "Know the Group — The Real Crew" },
      { name: "description", content: "Tap a name to unlock the full, unfiltered, hilarious truth about every member of this legendary BTech squad." },
      { property: "og:title", content: "Know the Group — The Real Crew" },
      { property: "og:description", content: "The unfiltered yearbook of a BTech CSE friend group." },
    ],
  }),
  component: YearbookPage,
});

type Friend = {
  name: string;
  role: string;
  vibe: string;
  details: string[];
  punchline: string;
  photo: string;
};

const crew: Friend[] = [
  {
    name: "Aditi Singh",
    role: "The Zen Comedian",
    vibe: "Calm, funny, and friendly — until the non-veg platter arrives.",
    details: [
      "Has a PhD in staying chill during chaos.",
      "Loves non-veg more than she loves her own health.",
      "After two drinks her truth serum activates.",
    ],
    punchline: "Mai nashe me nhi hu, mujhse koi sawal pucho.",
    photo: aditiImg,
  },
  {
    name: "Aman Singh",
    role: "The Biryani Mercenary",
    vibe: "Will literally do anything for friends. Emotions run on biryani fuel.",
    details: [
      "Choti Advance enthusiast — nobody knows what that means either.",
      "Always late because biryani > punctuality.",
      "Sleeps 14 hours a day. The other 10 are for eating.",
      "Drinks → vomits → repeats. It's a lifestyle.",
    ],
    punchline: "Bhai bas ek plate biryani aur 2 ghante neend.",
    photo: amanSinghImg,
  },
  {
    name: "Aman Saxena",
    role: "The Serial Crasher",
    vibe: "Knows everyone, loves everyone (especially random girls he just met).",
    details: [
      "Good connections in every department, canteen, and bus stop.",
      "Falls in love at least twice a semester.",
      "Non-veg is religion. Getting dressed is a 45-minute ritual.",
    ],
    punchline: "Bhai usne mujhe dekha tha, I swear.",
    photo: amanSaxenaImg,
  },
  {
    name: "Pragati Srivastava",
    role: "The Kurkure Goddess",
    vibe: "Kind-hearted angel who occasionally forgets how the world works.",
    details: [
      "Eats Kurkure for dinner and calls it a balanced diet.",
      "Cries if you look at her wrong. Also cries if you look at her right.",
      "Family fear is real — her phone rings and she freezes.",
      "Dumb moments are just her brain buffering.",
    ],
    punchline: "Mummy ne phone kiya hai, main ghar jaa rahi hoon.",
    photo: pragatiImg,
  },
  {
    name: "Madhav Sharma",
    role: "The Plan Canceller",
    vibe: "Studious, scared, and convinced his body is a conspiracy.",
    details: [
      "Actually studies. Still confused. It's a talent.",
      "Cancels plans with the consistency of a Japanese train schedule.",
      "Loves kadhi chawal more than passing grades.",
      "Every conversation ends with: Bhai body nhi bn rhi hai.",
    ],
    punchline: "Bhai body nhi bn rhi hai, aur plan bhi nhi ja rha.",
    photo: madhavSharmaImg,
  },
  {
    name: "Madhav Khandelwal",
    role: "The Baniya Broadcast",
    vibe: "Loud, funny, and permanently in debt — but always ordering more.",
    details: [
      "Chatterbox with a voice that reaches the next hostel block.",
      "Makes everyone wait because he was 'bas 2 minute me aaya'.",
      "Baniya by birth, debtor by choice. Udhaar ka raja.",
      "Lies so smoothly you almost believe him. Almost.",
      "Kadhi-chawal runs in his veins.",
    ],
    punchline: "Bhai paise kal de dunga, pakka.",
    photo: madhavKhandelwalImg,
  },
  {
    name: "Racheet Saraswat",
    role: "The Raita Philosopher",
    vibe: "Speaks in riddles nobody asked for. Scared of his own shadow.",
    details: [
      "Random topic generator — currently speaking about space while eating raita.",
      "One-sided love artist. The other side never showed up.",
      "Raita is life. Raita is love. Raita is everything.",
      "Watches horror movies through fingers, then sleeps with lights on.",
    ],
    punchline: "Bhai raita fenk diya maine toh... zindagi fenk di.",
    photo: racheetImg,
  },
  {
    name: "Sarthak Patel",
    role: "The Glue & The Enigma",
    vibe: "Chill, mysterious, threatens to leave the group at first (but never does).",

    details: [
      "Loves his friends but won't admit it. Acts too cool for emotions.",
      "Mysterious personality — even he doesn't know what he's doing next.",
      "Non-veg warrior. Kind of runs things, but don't say that out loud.",
      "The glue that holds this chaotic squad together.",
      "Girls look at him, like him, but he won't admit. (still blushing)",
    ],
    punchline: "Bhai sab theek hai, chill. Bas non-veg mile toh bata dio.",
    photo: sarthakImg,
  },
  {
    name: "Shivendra Pandey",
    role: "The Hulk with a GPA",
    vibe: "Anger issues, hunger issues, and a tragic relationship with marks.",
    details: [
      "Anger management? Never heard of her.",
      "Fights, stops talking, then comes back hungrier than before.",
      "Always hungry. Even while eating.",
      "Studies the most during exams. Scores less than the guy who slept.",
      "Biryani and rice are his emotional support foods.",
    ],
    punchline: "Padhai ki thi yaar, examiner ne galat check kiya hoga.",
    photo: shivendraImg,
  },
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
          Know the <span className="italic text-brand">group</span>.
        </h1>
        <p className="mt-6 max-w-xl text-charcoal/70">
          Tap a card. Unlock the chaos. These are the real humans behind the inside jokes, the proxy logs, and the 2&nbsp;AM canteen bills.
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {crew.map((p, i) => {
              const isOpen = open === i;
              return (
                <button
                  key={p.name}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className={`text-left border rounded-xl p-6 transition-all duration-300 group min-h-[260px] flex flex-col justify-between
                    ${isOpen ? "bg-brand border-brand text-white" : "border-paper/15 hover:bg-paper/5 hover:border-paper/40"}
                  `}
                >
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <img
                        src={p.photo}
                        alt={p.name}
                        loading="lazy"
                        className={`w-14 h-14 rounded-full object-cover border-2 ${isOpen ? "border-white/40" : "border-paper/30"}`}
                      />
                      <span className={`font-mono text-[10px] tracking-[0.2em] uppercase ${isOpen ? "text-white/70" : "text-paper/40"}`}>
                        {p.name} <span className={isOpen ? "text-white/40" : "text-brand"}>//</span> {p.role}
                      </span>
                    </div>
                    {!isOpen ? (
                      <div>
                        <p className="font-serif text-lg leading-snug mb-4">&ldquo;{p.vibe}&rdquo;</p>
                        <div className="flex flex-wrap gap-2">
                          {p.details.slice(0, 2).map((d, idx) => (
                            <span key={idx} className="text-[10px] font-mono uppercase tracking-wider px-2 py-1 rounded-full bg-paper/10 text-paper/70">
                              {d.split(" ").slice(0, 3).join(" ")}...
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2 text-sm">
                        {p.details.map((d, idx) => (
                          <p key={idx} className="flex gap-2">
                            <span className="text-white/50 mt-1">▸</span>
                            {d}
                          </p>
                        ))}
                        <p className="pt-3 font-hand text-xl italic text-white/90 border-t border-white/20 mt-3">
                          &ldquo;{p.punchline}&rdquo;
                        </p>
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

      {/* THEN vs NOW — drag to reveal */}
      <section className="px-6 md:px-10 py-24 max-w-7xl mx-auto">
        <p className="font-mono text-xs tracking-[0.3em] uppercase text-charcoal/50 mb-3">Then vs Now</p>
        <h2 className="font-serif text-3xl md:text-5xl tracking-tight mb-3">
          Freshers <span className="italic text-brand">→</span> Final year.
        </h2>
        <p className="text-charcoal/60 mb-12 max-w-xl">
          Drag the slider. Watch four years happen in one second. (Freshers pics are placeholder-tinted — drop the real ones in <code className="font-mono text-xs bg-charcoal/5 px-1 py-0.5 rounded">src/assets/crew/freshers/</code> and swap them in.)
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {crew.map((p) => (
            <figure key={p.name} className="space-y-3">
              <BeforeAfter
                alt={p.name}
                beforeSrc={p.photo}
                afterSrc={p.photo}
                beforeFilter="sepia(0.6) saturate(0.7) brightness(0.95) contrast(0.95) blur(0.3px)"
              />
              <figcaption className="flex items-baseline justify-between">
                <span className="font-serif text-lg">{p.name}</span>
                <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-charcoal/50">{p.role}</span>
              </figcaption>
            </figure>
          ))}
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
            { name: "— Aditi", note: "I was NOT drunk. Ask me anything." },
            { name: "— Aman S.", note: "Biryani first. Emotions second." },
            { name: "— Aman Sax.", note: "She looked at me. I swear." },
            { name: "— Pragati", note: "Mummy called. I have to go." },
            { name: "— Madhav Sh.", note: "Body nhi bani, plan nhi gya." },
            { name: "— Madhav Kh.", note: "Paise kal. Pakka. Pakka pakka." },
            { name: "— Racheet", note: "Raita spill = life spill." },
            { name: "— Sarthak", note: "Chill hai sab. Bas non-veg chahiye." },
            { name: "— Shivendra", note: "Examiner ne galat check kiya." },
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
