import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { crew } from "@/lib/crew";
import { useCrewAvatars, avatarImgStyle, defaultAvatarFor } from "@/lib/crew-avatars";
import { useCartoonMode } from "@/lib/cartoon-mode";


export const Route = createFileRoute("/friends/$slug")({
  head: ({ params }) => {
    const m = crew.find((c) => c.slug === params.slug);
    const title = m ? `${m.name} — ${m.role}` : "Friend not found";
    const desc = m ? m.bio.slice(0, 155) : "Profile not found.";
    return {
      meta: [
        { title: `${title} // the_nonagon` },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        ...(m ? [{ property: "og:image", content: m.photo }] : []),
      ],
    };
  },
  component: FriendProfile,
  errorComponent: ({ error }) => (
    <div className="min-h-screen grid place-items-center p-10 text-charcoal">
      <p>Something went wrong: {error.message}</p>
    </div>
  ),
  notFoundComponent: () => (
    <div className="min-h-screen grid place-items-center p-10 text-center">
      <div>
        <p className="font-mono text-xs tracking-[0.3em] uppercase text-charcoal/50 mb-3">404</p>
        <h1 className="font-serif text-3xl italic mb-4">Friend not found</h1>
        <Link to="/yearbook" className="text-brand hover-underline">← Back to the crew</Link>
      </div>
    </div>
  ),
});

function FriendProfile() {
  const { slug } = Route.useParams();
  const member = crew.find((c) => c.slug === slug);
  if (!member) throw notFound();

  const idx = crew.findIndex((c) => c.slug === slug);
  const prev = crew[(idx - 1 + crew.length) % crew.length];
  const next = crew[(idx + 1) % crew.length];
  const avatars = useCrewAvatars();
  const av = avatars[member.slug] ?? defaultAvatarFor(member);
  const [cartoon, , toggleCartoon] = useCartoonMode();

  return (
    <div className="min-h-screen bg-paper text-charcoal">
      <SiteNav />

      <section className="px-6 md:px-10 pt-12 pb-6 max-w-5xl mx-auto flex items-center justify-between gap-4">
        <Link
          to="/yearbook"
          className="font-mono text-[10px] tracking-[0.3em] uppercase text-charcoal/50 hover:text-brand"
        >
          ← Know the group
        </Link>
        <button
          type="button"
          onClick={toggleCartoon}
          aria-pressed={cartoon}
          className={`inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] uppercase px-3 py-1.5 rounded-full border transition ${
            cartoon
              ? "bg-brand text-white border-brand"
              : "border-charcoal/20 text-charcoal/60 hover:border-brand hover:text-brand"
          }`}
        >
          <span aria-hidden>{cartoon ? "🎨" : "📸"}</span>
          {cartoon ? "Cartoon" : "Photo"}
        </button>
      </section>

      {/* HERO */}
      <section className="px-6 md:px-10 pb-16 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8 md:gap-12 items-start">
          <div className="relative">
            <div className={`relative w-full aspect-square overflow-hidden rounded-2xl border border-charcoal/10 shadow-sm ${cartoon ? "bg-paper" : "bg-charcoal/5"}`}>
              <img
                src={cartoon ? member.cartoon : av.src}
                alt={member.name}
                style={cartoon ? { objectPosition: "50% 20%" } : avatarImgStyle(av)}
                className={`absolute inset-0 w-full h-full ${cartoon ? "object-contain p-2" : "object-cover"} transition-all duration-300`}
              />
            </div>
            <span className="absolute -bottom-3 -right-3 bg-brand text-white text-[10px] font-mono tracking-[0.2em] uppercase px-3 py-1.5 rounded-full shadow-md">
              {String(idx + 1).padStart(2, "0")} / {String(crew.length).padStart(2, "0")}
            </span>
          </div>


          <div>
            <p className="font-mono text-[10px] md:text-xs tracking-[0.3em] uppercase text-charcoal/50 mb-3">
              {member.role}
            </p>
            <h1 className="font-serif text-4xl md:text-6xl tracking-tight italic mb-4 text-balance">
              {member.name}
            </h1>
            <p className="font-serif text-xl md:text-2xl text-charcoal/80 italic leading-snug mb-6">
              &ldquo;{member.vibe}&rdquo;
            </p>
            <p className="text-charcoal/70 leading-relaxed max-w-prose">{member.bio}</p>

            {/* STAT STRIP */}
            <div className="mt-8 grid grid-cols-3 gap-3 max-w-md">
              <Stat label="Shared memories" value={member.sharedMemories} />
              <Stat label="Iconic moments" value={member.favoriteMemories.length} />
              <Stat label="Defining traits" value={member.details.length} />
            </div>
          </div>
        </div>
      </section>

      {/* BIO DETAILS */}
      <section className="px-6 md:px-10 py-12 max-w-5xl mx-auto border-t border-charcoal/10">
        <p className="font-mono text-xs tracking-[0.3em] uppercase text-charcoal/50 mb-3">Field notes</p>
        <h2 className="font-serif text-3xl md:text-4xl tracking-tight mb-8">
          Things we <span className="italic text-brand">know</span> for sure.
        </h2>
        <ul className="space-y-3 max-w-2xl">
          {member.details.map((d, i) => (
            <li key={i} className="flex gap-3 text-charcoal/80">
              <span className="text-brand mt-1">▸</span>
              <span>{d}</span>
            </li>
          ))}
        </ul>
        <p className="mt-10 font-hand text-2xl md:text-3xl italic text-brand max-w-2xl">
          &ldquo;{member.punchline}&rdquo;
        </p>
      </section>

      {/* FAVORITE MEMORIES */}
      <section className="px-6 md:px-10 py-12 max-w-5xl mx-auto border-t border-charcoal/10">
        <p className="font-mono text-xs tracking-[0.3em] uppercase text-charcoal/50 mb-3">Favorite memories</p>
        <h2 className="font-serif text-3xl md:text-4xl tracking-tight mb-8">
          The greatest <span className="italic text-brand">hits</span>.
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {member.favoriteMemories.map((m, i) => (
            <article
              key={i}
              className="border border-charcoal/15 rounded-xl p-6 hover:border-brand hover:-translate-y-0.5 transition-all bg-white"
            >
              {m.date && (
                <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-charcoal/40 mb-3">
                  {m.date}
                </p>
              )}
              <h3 className="font-serif text-xl italic mb-2 text-balance">{m.title}</h3>
              <p className="text-sm text-charcoal/70 leading-relaxed">{m.note}</p>
            </article>
          ))}
        </div>
      </section>

      {/* SHARED MEMORIES CALLOUT */}
      <section className="px-6 md:px-10 py-12 max-w-5xl mx-auto">
        <div className="bg-brand text-white rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/60 mb-2">
              Shared with the crew
            </p>
            <p className="font-serif text-5xl md:text-6xl italic mb-2">{member.sharedMemories}</p>
            <p className="text-white/80 max-w-md">
              Photos, plans, late-night chai stops and one-frame chaos — all logged in the archive.
            </p>
          </div>
          <Link
            to="/gallery"
            className="font-mono text-xs tracking-[0.2em] uppercase bg-white text-brand px-5 py-3 rounded-full hover:bg-paper transition"
          >
            Open the gallery →
          </Link>
        </div>
      </section>

      {/* PREV / NEXT */}
      <section className="px-6 md:px-10 py-12 max-w-5xl mx-auto border-t border-charcoal/10">
        <div className="grid grid-cols-2 gap-4">
          <Link
            to="/friends/$slug"
            params={{ slug: prev.slug }}
            className="group border border-charcoal/15 rounded-xl p-5 hover:border-brand transition-all"
          >
            <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-charcoal/40 mb-2">← Previous</p>
            <p className="font-serif text-lg italic group-hover:text-brand">{prev.name}</p>
          </Link>
          <Link
            to="/friends/$slug"
            params={{ slug: next.slug }}
            className="group border border-charcoal/15 rounded-xl p-5 text-right hover:border-brand transition-all"
          >
            <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-charcoal/40 mb-2">Next →</p>
            <p className="font-serif text-lg italic group-hover:text-brand">{next.name}</p>
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="border border-charcoal/15 rounded-xl px-4 py-3">
      <p className="font-serif text-2xl md:text-3xl italic text-brand">{value}</p>
      <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-charcoal/50 mt-1 leading-tight">
        {label}
      </p>
    </div>
  );
}
