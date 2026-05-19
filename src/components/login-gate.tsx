import { useEffect, useState, type FormEvent } from "react";

const STORAGE_KEY = "nonagon-pass";
const USERNAME = "The Hangover";
const PASSWORD = "Kaleshi Nonagon";

export function LoginGate({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked] = useState(false);
  const [checked, setChecked] = useState(false);
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem(STORAGE_KEY) === "1") {
      setUnlocked(true);
    }
    setChecked(true);
  }, []);

  if (!checked) return null;
  if (unlocked) return <>{children}</>;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (user.trim() === USERNAME && pass === PASSWORD) {
      sessionStorage.setItem(STORAGE_KEY, "1");
      setUnlocked(true);
    } else {
      setError("Access denied. Try again, soberly.");
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-paper px-6 py-12 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)", backgroundSize: "20px 20px" }} aria-hidden />
      <div className={`relative w-full max-w-md ${shake ? "animate-[shake_0.4s]" : ""}`}>
        <div className="paper-card rounded-3xl p-8 md:p-10 relative">
          <span className="tape left-1/2 -translate-x-1/2 -top-4 w-32 h-6 rotate-[-2deg]" aria-hidden />

          <div className="text-center mb-8">
            <div className="inline-block text-4xl mb-3">🔒</div>
            <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-charcoal/50 mb-2">
              Members only · Est. 2022
            </p>
            <h1 className="font-serif text-3xl md:text-4xl italic leading-tight">
              The <span className="text-brand">Nonagon</span> Vault.
            </h1>
            <p className="mt-3 text-sm text-charcoal/60">
              If you weren&rsquo;t in the group chat, you weren&rsquo;t in the group.
              Whisper the password.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="font-mono text-[10px] tracking-[0.2em] uppercase text-charcoal/60 block mb-1.5">
                Squad name
              </label>
              <input
                type="text"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                placeholder="Two words. You know it."
                className="w-full bg-cream/60 border border-charcoal/15 rounded-xl px-4 py-3 font-serif text-base outline-none focus:border-brand transition-colors"
                autoFocus
              />
            </div>
            <div>
              <label className="font-mono text-[10px] tracking-[0.2em] uppercase text-charcoal/60 block mb-1.5">
                Secret phrase
              </label>
              <input
                type="password"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                placeholder="••••••••••••••"
                className="w-full bg-cream/60 border border-charcoal/15 rounded-xl px-4 py-3 font-serif text-base outline-none focus:border-brand transition-colors"
              />
            </div>

            {error && (
              <p className="font-mono text-xs text-brand text-center">{error}</p>
            )}

            <button
              type="submit"
              className="w-full bg-charcoal text-paper rounded-full py-3.5 font-medium text-sm hover:bg-brand transition-colors mt-2"
            >
              Unlock the scrapbook →
            </button>
          </form>

          <p className="text-center font-hand text-lg text-charcoal/50 mt-6">
            Hint: ask Aditi after her second drink.
          </p>
        </div>

        <p className="text-center font-mono text-[10px] tracking-[0.25em] uppercase text-charcoal/40 mt-6">
          Unauthorized access will be roasted in the group chat.
        </p>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }
      `}</style>
    </div>
  );
}
