import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { crew } from "@/lib/crew";

const norm = (s: string) => s.toLowerCase().replace(/[^a-z]/g, "");

/** Best-effort match of a presence display name to a crew profile slug. */
function matchSlug(name: string): string | null {
  const n = norm(name);
  if (!n) return null;
  const exact = crew.find((m) => norm(m.name) === n);
  if (exact) return exact.slug;
  const partial = crew.filter((m) => norm(m.name).includes(n) || n.includes(norm(m.name)));
  return partial.length === 1 ? partial[0].slug : null;
}

export const NAME_KEY = "nonagon-name";
export const NAME_EVENT = "nonagon-name-change";

export function getStoredName() {
  if (typeof window === "undefined") return "";
  return (localStorage.getItem(NAME_KEY) || "").trim();
}

/** Save the visitor's display name and let presence know about it. */
export function setStoredName(name: string) {
  if (typeof window === "undefined") return;
  const clean = name.trim().slice(0, 60);
  if (!clean) return;
  localStorage.setItem(NAME_KEY, clean);
  window.dispatchEvent(new CustomEvent(NAME_EVENT, { detail: clean }));
}

function clientId() {
  if (typeof window === "undefined") return "server";
  let id = localStorage.getItem("nonagon-client-id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("nonagon-client-id", id);
  }
  return id;
}

type Who = { id: string; name: string; at: number };

function ago(ms: number) {
  const s = Math.max(0, Math.round(ms / 1000));
  if (s < 10) return "just now";
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  return `${h}h ago`;
}

export function PresenceIndicator() {
  const [people, setPeople] = useState<Who[]>([]);
  const [open, setOpen] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const [myName, setMyName] = useState("");
  const [draft, setDraft] = useState("");
  const trackRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    setMyName(getStoredName());
  }, []);

  useEffect(() => {
    const me = clientId();
    const channel = supabase.channel("nonagon-presence", {
      config: { presence: { key: me } },
    });

    const track = () => {
      const name = getStoredName();
      channel.track({
        id: me,
        name: name || "Someone",
        named: Boolean(name),
        at: new Date().toISOString(),
      });
    };
    trackRef.current = track;

    const sync = () => {
      const state = channel.presenceState<{ id: string; name: string; named?: boolean; at?: string }>();
      const list: Who[] = Object.values(state)
        .map((entries) => entries[0])
        .filter(Boolean)
        .filter((e) => e.id !== me)
        .map((e) => ({
          id: e.id,
          name: (e.named === false ? "" : e.name) || "Someone",
          at: e.at ? Date.parse(e.at) : Date.now(),
        }));
      setPeople(list);
    };

    channel.on("presence", { event: "sync" }, sync).subscribe((status) => {
      if (status !== "SUBSCRIBED") return;
      track();
    });

    // keep our own presence timestamp fresh
    const heartbeat = window.setInterval(track, 30000);

    const onName = () => {
      setMyName(getStoredName());
      track();
    };
    window.addEventListener(NAME_EVENT, onName);
    window.addEventListener("storage", onName);

    return () => {
      window.clearInterval(heartbeat);
      window.removeEventListener(NAME_EVENT, onName);
      window.removeEventListener("storage", onName);
      trackRef.current = null;
      supabase.removeChannel(channel);
    };
  }, []);

  // tick the "last active" labels only while the dropdown is open
  useEffect(() => {
    if (!open) return;
    setNow(Date.now());
    const t = window.setInterval(() => setNow(Date.now()), 5000);
    return () => window.clearInterval(t);
  }, [open]);

  const count = people.length;

  if (count === 0) return null;

  return (
    <div className="fixed bottom-20 left-5 z-40">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="inline-flex items-center gap-2 rounded-full border border-charcoal/15 bg-paper/85 backdrop-blur-md px-3.5 py-2 font-mono text-[10px] tracking-[0.2em] uppercase text-charcoal/70 shadow-sm hover:text-brand hover:border-brand transition-colors"
      >
        <span className="relative flex size-2">
          <span className="absolute inline-flex h-full w-full rounded-full bg-brand/60 animate-ping" />
          <span className="relative inline-flex size-2 rounded-full bg-brand" />
        </span>
        {count} {count === 1 ? "other here now" : "others here now"}
      </button>

      {open && (
        <div className="mt-2 w-60 rounded-md border border-charcoal/15 bg-paper/95 backdrop-blur-md p-2 shadow-lg">
          <ul className="max-h-56 overflow-y-auto">
            {people.map((p) => {
              const slug = matchSlug(p.name);
              return (
                <li
                  key={p.id}
                  className="flex items-baseline justify-between gap-2 px-2 py-1 font-hand text-lg text-charcoal/80"
                >
                  {slug ? (
                    <Link
                      to="/friends/$slug"
                      params={{ slug }}
                      onClick={() => setOpen(false)}
                      className="truncate underline decoration-brand/40 underline-offset-4 hover:text-brand transition-colors"
                    >
                      {p.name}
                    </Link>
                  ) : (
                    <span className="truncate">{p.name}</span>
                  )}
                  <span className="shrink-0 font-mono text-[9px] uppercase tracking-[0.15em] text-charcoal/50">
                    {ago(now - p.at)}
                  </span>
                </li>
              );
            })}
          </ul>

          {!myName && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setStoredName(draft);
                setDraft("");
              }}
              className="mt-2 border-t border-charcoal/10 pt-2"
            >
              <label className="block px-2 font-mono text-[9px] uppercase tracking-[0.15em] text-charcoal/50">
                Show your name to others
              </label>
              <div className="mt-1 flex gap-1 px-2 pb-1">
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  maxLength={60}
                  placeholder="Your name"
                  className="min-w-0 flex-1 rounded border border-charcoal/15 bg-paper px-2 py-1 font-hand text-base text-charcoal/80 outline-none focus:border-brand"
                />
                <button
                  type="submit"
                  disabled={!draft.trim()}
                  className="rounded border border-charcoal/15 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.15em] text-charcoal/70 hover:border-brand hover:text-brand disabled:opacity-40 transition-colors"
                >
                  Save
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
