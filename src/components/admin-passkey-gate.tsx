import { useEffect, useState, type ReactNode } from "react";
import { Lock } from "lucide-react";

// 🔑 Change this to whatever passkey you want.
const PASSKEY = "nonagon9";
const STORAGE_KEY = "nonagon.admin.unlocked";

export function AdminPasskeyGate({ children }: { children: ReactNode }) {
  const [unlocked, setUnlocked] = useState(false);
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem(STORAGE_KEY) === "1") {
      setUnlocked(true);
    }
  }, []);

  if (unlocked) return <>{children}</>;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() === PASSKEY) {
      sessionStorage.setItem(STORAGE_KEY, "1");
      setUnlocked(true);
    } else {
      setError(true);
      setValue("");
      setTimeout(() => setError(false), 600);
    }
  };

  return (
    <main className="min-h-screen grid place-items-center px-6 bg-paper">
      <form
        onSubmit={submit}
        className={`w-full max-w-sm border border-charcoal/15 rounded-2xl p-8 bg-cream/40 ${error ? "animate-shake" : ""}`}
      >
        <div className="size-12 grid place-items-center rounded-xl bg-brand text-white mb-5">
          <Lock className="w-5 h-5" />
        </div>
        <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-charcoal/50 mb-2">
          Restricted // admin only
        </p>
        <h1 className="font-serif text-3xl tracking-tight mb-2">
          Passkey, <span className="italic text-brand">please</span>.
        </h1>
        <p className="text-sm text-charcoal/60 mb-6">
          If you know, you know. Otherwise — turn around, friend.
        </p>
        <input
          type="password"
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="enter passkey"
          className={`w-full px-4 py-3 rounded-md border bg-paper font-mono text-sm tracking-widest outline-none transition-colors ${
            error ? "border-red-500 text-red-600" : "border-charcoal/20 focus:border-brand"
          }`}
        />
        {error && (
          <p className="mt-2 text-xs text-red-600 font-mono">wrong passkey. try again.</p>
        )}
        <button
          type="submit"
          className="mt-5 w-full bg-charcoal text-paper py-3 rounded-md font-mono text-xs tracking-[0.2em] uppercase hover:bg-brand transition-colors"
        >
          unlock admin
        </button>
      </form>
    </main>
  );
}
