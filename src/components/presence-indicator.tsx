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

type Who = { id: string; name: string };

export function PresenceIndicator() {
  const [people, setPeople] = useState<Who[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const me = clientId();
    const channel = supabase.channel("nonagon-presence", {
      config: { presence: { key: me } },
    });

    const sync = () => {
      const state = channel.presenceState<{ id: string; name: string }>();
      const list: Who[] = Object.values(state)
        .map((entries) => entries[0])
        .filter(Boolean)
        .map((e) => ({ id: e.id, name: e.name || "Someone" }));
      setPeople(list);
    };

    channel
      .on("presence", { event: "sync" }, sync)
      .subscribe(async (status) => {
        if (status !== "SUBSCRIBED") return;
        await channel.track({
          id: me,
          name: (typeof window !== "undefined" && localStorage.getItem(NAME_KEY)) || "Someone",
        });
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const count = Math.max(people.length, 1);

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
        {count} here now
      </button>

      {open && (
        <ul className="mt-2 w-52 max-h-56 overflow-y-auto rounded-md border border-charcoal/15 bg-paper/95 backdrop-blur-md p-2 shadow-lg">
          {people.length === 0 ? (
            <li className="px-2 py-1 font-hand text-lg text-charcoal/50">Just you for now</li>
          ) : (
            people.map((p) => (
              <li key={p.id} className="px-2 py-1 font-hand text-lg text-charcoal/80">
                {p.name}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
