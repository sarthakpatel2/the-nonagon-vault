import { Link } from "@tanstack/react-router";

const links = [
  { to: "/", label: "Home" },
  { to: "/gallery", label: "Gallery" },
  { to: "/memories", label: "Memories" },
  { to: "/timeline", label: "Timeline" },
  { to: "/yearbook", label: "Know the Group" },
  { to: "/quiz", label: "Quiz" },
  { to: "/letter", label: "Letter" },
  { to: "/from-prags", label: "From Prags" },
  { to: "/love", label: "Wall of Love" },
] as const;

export function SiteNav() {
  return (
    <nav className="sticky top-0 z-50 px-6 md:px-10 py-4 flex justify-between items-center bg-paper/75 backdrop-blur-md border-b border-charcoal/5">
      <Link to="/" className="font-mono text-xs md:text-sm tracking-tight inline-flex items-center gap-2 group">
        <span className="size-6 rounded-md bg-brand text-white font-serif italic grid place-items-center text-sm shadow-sm group-hover:rotate-12 transition-transform">9</span>
        <span><span className="text-brand">//</span> the_nonagon</span>
      </Link>
      <div className="flex gap-4 md:gap-7 text-xs md:text-sm font-medium overflow-x-auto scrollbar-hide -mr-2 pr-2">
        {links.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className="text-charcoal/70 hover:text-brand transition-colors whitespace-nowrap"
            activeProps={{ className: "text-brand" }}
            activeOptions={{ exact: true }}
          >
            {l.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
