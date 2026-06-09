import { Link } from "@tanstack/react-router";
import { useState } from "react";

export function SiteFooter() {
  const [tapped, setTapped] = useState(0);
  const [pushed, setPushed] = useState(false);

  const stats = [
    { label: "Members", value: "9" },
    { label: "Group chats", value: "1 (chaotic)" },
    { label: "Plans cancelled", value: "∞" },
    { label: "Biryani orders", value: "2,184" },
    { label: "Proxies pulled", value: "Classified" },
    { label: "All-nighters", value: "Lost count" },
  ];

  const links = [
    { to: "/", label: "Home" },
    { to: "/gallery", label: "Gallery" },
    { to: "/timeline", label: "Timeline" },
    { to: "/yearbook", label: "Know the Group" },
    { to: "/letter", label: "Letter" },
    { to: "/from-prags", label: "From Prags" },
    { to: "/love", label: "Wall of Love" },
  ] as const;

  return (
    <footer className="relative pt-20 pb-10 px-6 md:px-10 border-t border-charcoal/10 bg-cream/40 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Top: brand + tagline */}
        <div className="flex flex-col items-center text-center mb-14">
          <button
            onClick={() => setTapped((t) => t + 1)}
            className="size-20 bg-brand rounded-2xl mb-6 grid place-items-center text-white shadow-[0_10px_30px_oklch(0.68_0.21_38/0.35)] hover-sticker press-down"
            aria-label="The Nonagon"
          >
            <span className="font-serif text-3xl italic">9</span>
          </button>
          {tapped > 0 && (
            <p className="font-hand text-xl text-brand mb-2 animate-reveal">
              {tapped < 5
                ? `${tapped} tap${tapped > 1 ? "s" : ""}. Keep going.`
                : tapped < 9
                ? "Almost there… nine for nine."
                : "🎉 You found the secret. Nothing happens. We're broke."}
            </p>
          )}
          <h4 className="font-serif text-3xl md:text-5xl italic leading-tight max-w-2xl hover-sweep cursor-default">
            Nine humans. One groupchat. Zero chill.
          </h4>
          <p className="text-charcoal/50 font-mono text-xs md:text-sm mt-4">
            $ git commit -m &quot;final year, final memories&quot;
          </p>
        </div>

        {/* Stats strip — rising-fill reveal on hover */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-px bg-charcoal/10 rounded-2xl overflow-hidden mb-14">
          {stats.map((s) => (
            <div
              key={s.label}
              className="reveal-overlay bg-cream/60 p-5 text-center group cursor-default transition-colors hover:text-white"
            >
              <p className="font-serif text-xl md:text-2xl font-bold">{s.value}</p>
              <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-charcoal/50 group-hover:text-white/80 mt-1 transition-colors">
                {s.label}
              </p>
            </div>
          ))}
        </div>

        {/* Sitemap + send-off */}
        <div className="grid md:grid-cols-3 gap-10 mb-14 pb-10 border-b border-charcoal/10">
          <div>
            <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-charcoal/50 mb-4">
              The map
            </p>
            <ul className="space-y-2">
              {links.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="slide-arrow font-serif text-lg hover:text-brand transition-colors"
                  >
                    <span>{l.label}</span>
                    <span className="arrow text-brand">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-charcoal/50 mb-4">
              The vibe
            </p>
            <p className="font-serif italic text-lg leading-relaxed text-charcoal/80">
              &ldquo;We were terrible at attendance and worse at goodbyes, so this
              site is both — a permanent proxy for the people we&rsquo;ll miss
              the most.&rdquo;
            </p>
            <p className="font-hand text-xl text-brand mt-3">— the nonagon</p>
          </div>

          <div>
            <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-charcoal/50 mb-4">
              Push to main
            </p>
            <p className="text-sm text-charcoal/70 mb-4">
              Hit the button. It does literally nothing but it feels like
              shipping something one last time.
            </p>
            <button
              onClick={() => setPushed(true)}
              disabled={pushed}
              className="inline-flex items-center gap-2 bg-charcoal text-paper px-5 py-3 rounded-full font-medium text-sm hover:bg-brand press-down transition-colors disabled:opacity-70"
            >
              {pushed ? "✓ Deployed to memory" : "git push origin nostalgia"}
            </button>
          </div>
        </div>

        {/* Looping marquee strip */}
        <div className="loop-marquee-pausable mb-10 overflow-hidden border-y border-charcoal/10 py-3">
          <div className="loop-marquee font-serif italic text-2xl md:text-3xl text-charcoal/80">
            {Array.from({ length: 2 }).map((_, i) => (
              <span key={i} className="flex items-center gap-8 pr-8">
                <span>nine humans</span><span className="text-brand">✦</span>
                <span>one groupchat</span><span className="text-brand">✦</span>
                <span>zero chill</span><span className="text-brand">✦</span>
                <span>built with chai &amp; trauma</span><span className="text-brand">✦</span>
                <span>plans cancelled, friendships intact</span><span className="text-brand">✦</span>
                <span>since 2022</span><span className="text-brand">✦</span>
              </span>
            ))}
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 font-mono text-[10px] tracking-[0.2em] uppercase text-charcoal/40">
          <p>© 2022 — 2026 · The Nonagon, Inc. (Not actually incorporated)</p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 items-center">
            <span className="hover:text-brand transition-colors cursor-default">Built with chai &amp; trauma</span>
            <span className="hidden md:inline">·</span>
            <span className="hover:text-brand transition-colors cursor-default">Powered by 9 group admins</span>
            <span className="hidden md:inline">·</span>
            <span className="hover:text-brand transition-colors cursor-default">Bugs are features</span>
            <span className="hidden md:inline">·</span>
            <Link
              to="/admin/freshers"
              className="hover:text-brand transition-colors inline-flex items-center gap-1"
              title="Admin"
            >
              <span aria-hidden>🔒</span> admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
