import { useEffect, useState } from "react";
import { Calendar, Pencil, Check, X } from "lucide-react";

const GRAD_DATE = new Date("2026-05-17T00:00:00"); // graduation day
const DEFAULT_REUNION = "2027-05-17"; // one year later
const STORAGE_KEY = "nonagon_reunion_date";

function daysBetween(a: Date, b: Date): number {
  const ms = b.getTime() - a.getTime();
  return Math.max(1, Math.floor(ms / (1000 * 60 * 60 * 24)));
}

export function ReunionCountdown() {
  const [reunionStr, setReunionStr] = useState<string>(DEFAULT_REUNION);
  const [editing, setEditing] = useState(false);
  const [input, setInput] = useState(DEFAULT_REUNION);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setReunionStr(saved);
      setInput(saved);
    }
  }, []);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60000); // refresh every minute
    return () => clearInterval(id);
  }, []);

  const reunionDate = new Date(reunionStr + "T00:00:00");
  const since = daysBetween(GRAD_DATE, now);
  const until = daysBetween(now, reunionDate);

  const save = () => {
    setReunionStr(input);
    localStorage.setItem(STORAGE_KEY, input);
    setEditing(false);
  };

  const cancel = () => {
    setInput(reunionStr);
    setEditing(false);
  };

  return (
    <div className="relative paper-card p-8 md:p-10 max-w-3xl mx-auto">
      <span className="tape left-12 -top-3 w-24 h-5 rotate-[-2deg] bg-brand/30" aria-hidden />

      <div className="flex items-center gap-3 mb-6">
        <Calendar className="w-5 h-5 text-brand" />
        <p className="font-mono text-xs tracking-[0.3em] uppercase text-charcoal/50">
          The infinite loop continues
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-10">
        {/* Days since */}
        <div className="text-center sm:text-left">
          <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-charcoal/40 mb-1">
            Days since graduation
          </p>
          <p className="font-serif text-5xl md:text-6xl font-bold text-charcoal leading-none">
            {since.toLocaleString()}
          </p>
          <p className="font-hand text-xl text-brand mt-2">
            and counting
          </p>
        </div>

        {/* Days until */}
        <div className="text-center sm:text-left">
          <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-charcoal/40 mb-1">
            Next reunion
          </p>
          <p className="font-serif text-5xl md:text-6xl font-bold text-charcoal leading-none">
            {until}
          </p>
          <div className="mt-2 flex items-center justify-center sm:justify-start gap-2">
            {editing ? (
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="font-mono text-xs bg-cream border border-charcoal/20 rounded-md px-2 py-1"
                />
                <button onClick={save} className="text-brand hover:text-charcoal transition-colors" aria-label="Save">
                  <Check className="w-4 h-4" />
                </button>
                <button onClick={cancel} className="text-charcoal/40 hover:text-charcoal transition-colors" aria-label="Cancel">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <p className="font-hand text-xl text-brand">
                  {new Date(reunionStr).toLocaleDateString(undefined, {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
                <button
                  onClick={() => setEditing(true)}
                  className="text-charcoal/30 hover:text-brand transition-colors"
                  aria-label="Edit reunion date"
                  title="Edit reunion date"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-dashed border-charcoal/10 flex items-center justify-between">
        <p className="font-mono text-[10px] tracking-wider text-charcoal/40">
          Graduation · 17 May 2026
        </p>
        <p className="font-hand text-base text-charcoal/60">
          Until we&apos;re all in the same room again.
        </p>
      </div>
    </div>
  );
}
