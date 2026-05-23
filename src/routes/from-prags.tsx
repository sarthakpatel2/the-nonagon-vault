import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/from-prags")({
  head: () => ({
    meta: [
      { title: "From Prags — A chaotic love letter to the nine" },
      { name: "description", content: "Prags spills the tea — a chaotic, dramatic, lovingly unhinged retelling of the nonagon saga." },
      { property: "og:title", content: "From Prags — A chaotic love letter to the nine" },
      { property: "og:description", content: "Prags spills the tea — a chaotic, dramatic, lovingly unhinged retelling of the nonagon saga." },
    ],
  }),
  component: FromPragsPage,
});

const fullLetter = `Hey guys if you are reading this... what's if... Padho shanti se...hn to I love you guys bhut dher sara idc if you guys don't love back.

Once upon a time (4 saal pehle), people from different state cities came to a jhatu college and led to the foundation of gayLesbianRelu.

They met each other, but you won't believe what happened when they truly got to know one another — the love and fun began. ❤️

The boy who hated him actually loved him. Among the 9... two boys were in love. They both never agreed and neither let anybody know about them....

Dhumtana nana 🎶

They are 🤞🏻 Sharma and Racheet.

Pyaar tha pr darar thi.
Tu tha to kahi mai thi.
Kahi maa thi to kahi behen... kahi raita tha to kahi kadhi-chawal.

They both loved each other but always used to fight, as they had someone else in their life.

Dhoomtana naa dhoomtana 🎶

Madhav..., Racheet ki side chick raita se jalta tha kyoki vo usse zada gori thi, or Racheet kadhi-chawal se jalti thi kyoki vo Madhav ki side hot chick thi.

Raat raat ko Madhav ghar nai aata tha or kadhi-chawal ke sath raat guzarta tha.

Din raat ladai-jagde ke baad bhi vo dono nai sudhre... and they separated... as we say, pyaar hai pr darar hai.

Now comes the chaotic three — Buddy # Sarthak # Shivendra.

Absolute disaster.

Buddy and Shivendra each had a wife.

Pr vhi baat hai na... sabse zada dukh dene vali cheez kon — aurat. Or sabse zada sukh dene vali cheez kon — aurat. To ek aurat se itna sukh utha liya, to dusri aurat se sukh uthao na...

But they only had dukh dene vali aurat, not sukh vali... they had sukh vala... # Sarthak.

So Buddy and Sarthak were the gay bf-bf, and Shivendra-Sarthak were the gay husband-husband, AND Buddy-Shivendra were the gay bf-bf.

Whenever Buddy and Shivendra messed up in their relationship (which they do frequently), they turned to the 3rd guy — Sarthak. He was their comfort zone, their emotional support....

Sarthak was also bisexual but never had the guts to talk to other girls... He was always left alone when Buddy and Shivendra got back with their gfs... So being married with Shivendra, they both adopted a kid and named him Sexena.

Cute little adorable gol kid — they both cherished him so that he never felt the need of a mother. But... Sexena was their child... he had keen interest in girls... pr ladkiya usse dekhti nahi thi.

Buddy, after seeing the child of Sarthak and Shivendra, got upset and felt lonely... went back to his GFs Advance and Aditi... Aditi came with a solution — "hum Shivendra ki gf ko hi adopt kr lete hai." They adopted Shivendra's gf Pragati. Now Pragati with her step-mother Aditi (gf of Buddy) is in a lesbian relationship... adoption to ek bahana tha, maqsad to kuch or tha hehehe.

But Pragati always wanted a child but wasn't able to accept Sexena (Shivendra-Sarthak's adopted kid) as her own, so she insisted on having her own child with him... so they adopted Pinnu. Lovely kid — keval chillata, sota, pita, ulti krta.

Last but not least — beauty with brains, the Lebanese girls. They were different from everybody. They both were calm, sweet, peaceful girls, most understanding in the group. Vrna kya koi apne bf ko kisi dusre mard ke sath dekh skta hai... They were beauty with brains; they silently loved and cared for everyone that nobody ever noticed... but they both noticed each other, and somehow in that in-between friendship they found love in each other.

But nobody took them seriously.

It hurt them deeply — far more than they ever let anyone see — because despite being the most understanding, caring, beauty-with-brains kind of people, their love was never given the respect it deserved. So one day, without any drama, arguments, or big emotional speeches, they simply left — quietly, silently, choosing peace over explanation.

Years later, news spread that the two had settled in the beautiful hills of Kullu-Manali after a massive glow-up, and had opened a cozy little bakery together — filled with the smell of warm cinnamon, fresh bread, mountain air, handwritten menus, and the peaceful life they had once dreamed of.

And somehow, life had its own poetic way of balancing things — the same people who once laughed at them and never took them seriously now worked there, some as chefs, some as waiters, serving coffee with awkward smiles while the two owners simply looked at each other knowingly; not out of revenge, but because destiny sometimes writes the best endings on its own.

— Prags 💌`;

function FromPragsPage() {
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
      i += 3;
      setTyped(fullLetter.slice(0, i));
      if (i >= fullLetter.length) {
        window.clearInterval(id);
        setDone(true);
      }
    }, 15);
    return () => window.clearInterval(id);
  }, [skip]);

  return (
    <main className="min-h-screen">
      <SiteNav />

      <header className="px-6 md:px-10 pt-16 pb-8 max-w-3xl mx-auto">
        <p className="font-mono text-xs tracking-[0.3em] uppercase text-charcoal/50 mb-4">
          06 / The tea
        </p>
        <h1 className="font-serif font-bold leading-[0.95] tracking-tight text-[clamp(2.25rem,6vw,4.5rem)]">
          From <span className="italic text-brand">Prags</span>.
        </h1>
        <p className="mt-4 font-mono text-xs text-charcoal/50">
          ⚠ Padho shanti se. Sab fictional hai. Mostly.
        </p>
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
              <p className="font-hand text-4xl text-brand">— prags.</p>
              <Link
                to="/letter"
                className="inline-flex items-center gap-2 bg-charcoal text-paper px-5 py-3 rounded-full font-medium text-sm hover:bg-brand transition-colors"
              >
                Read the letter →
              </Link>
            </div>
          )}
        </article>
      </section>

      <SiteFooter />
    </main>
  );
}
