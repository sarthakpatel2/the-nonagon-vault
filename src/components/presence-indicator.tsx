import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const NAME_KEY = "nonagon-name";

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

  useEffect(() => {
    const me = clientId();
    const channel = supabase.channel("nonagon-presence", {
      config: { presence: { key: me } },
    });

    const sync = () => {
      const state = channel.presenceState<{ id: string; name: string; at?: string }>();
      const list: Who[] = Object.values(state)
        .map((entries) => entries[0])
        .filter(Boolean)
        .filter((e) => e.id !== me)
        .map((e) => ({
          id: e.id,
          name: e.name || "Someone",
          at: e.at ? Date.parse(e.at) : Date.now(),
        }));
      setPeople(list);
    };

    channel
      .on("presence", { event: "sync" }, sync)
      .subscribe(async (status) => {
        if (status !== "SUBSCRIBED") return;
        await channel.track({
          id: me,
          name: (typeof window !== "undefined" && localStorage.getItem(NAME_KEY)) || "Someone",
          at: new Date().toISOString(),
        });
      });

    // keep our own presence timestamp fresh
    const heartbeat = window.setInterval(() => {
      channel.track({
        id: me,
        name: (typeof window !== "undefined" && localStorage.getItem(NAME_KEY)) || "Someone",
        at: new Date().toISOString(),
      });
    }, 30000);

    return () => {
      window.clearInterval(heartbeat);
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
        <ul className="mt-2 w-60 max-h-56 overflow-y-auto rounded-md border border-charcoal/15 bg-paper/95 backdrop-blur-md p-2 shadow-lg">
          {people.length === 0 ? (
            <li className="px-2 py-1 font-hand text-lg text-charcoal/50">Just you for now</li>
          ) : (
            people.map((p) => (
              <li
                key={p.id}
                className="flex items-baseline justify-between gap-2 px-2 py-1 font-hand text-lg text-charcoal/80"
              >
                <span className="truncate">{p.name}</span>
                <span className="shrink-0 font-mono text-[9px] uppercase tracking-[0.15em] text-charcoal/50">
                  {ago(now - p.at)}
                </span>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
    </div>
  );
}
