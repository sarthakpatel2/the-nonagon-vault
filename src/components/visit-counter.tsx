import { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const SESSION_KEY = "nonagon_visit_logged";

export function VisitCounter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      // Log this visit once per browser session
      if (!sessionStorage.getItem(SESSION_KEY)) {
        sessionStorage.setItem(SESSION_KEY, "1");
        await supabase.from("site_visits").insert({});
      }
      const { count: c } = await supabase
        .from("site_visits")
        .select("*", { count: "exact", head: true });
      if (!cancelled) setCount(c ?? 0);
    }
    run();

    const channel = supabase
      .channel("site_visits")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "site_visits" },
        () => setCount((prev) => (prev ?? 0) + 1),
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-cream/70 border border-charcoal/10 backdrop-blur">
      <Eye className="w-4 h-4 text-brand" />
      <span className="font-mono text-[11px] tracking-[0.25em] uppercase text-charcoal/50">
        Visits
      </span>
      <span className="font-serif text-xl font-bold text-charcoal tabular-nums">
        {count === null ? "—" : count.toLocaleString()}
      </span>
    </div>
  );
}
