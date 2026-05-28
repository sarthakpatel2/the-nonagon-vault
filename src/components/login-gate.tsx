import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { Eye, EyeOff } from "lucide-react";

const STORAGE_KEY = "nonagon-pass";
const USERNAME = "The Hangover";
const PASSWORD = "Kaleshi Nonagon";
const VAULT_ROUTE = "/";

export function LoginGate({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked] = useState(false);
  const [checked, setChecked] = useState(false);
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const [errorFlash, setErrorFlash] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const navigate = useNavigate();
  const currentPath = useRouterState({ select: (s) => s.location.pathname });

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
      setError("");
      setCelebrating(true);
      setTimeout(() => {
        setUnlocked(true);
        if (currentPath !== VAULT_ROUTE) {
          navigate({ to: VAULT_ROUTE });
        }
      }, 1600);
    } else {
      setError("Nice try, impostor! 🚫");
      setShake(true);
      setErrorFlash(true);
      setTimeout(() => setShake(false), 700);
      setTimeout(() => setErrorFlash(false), 900);
    }
  };

  const floaters = ["💌", "✨", "🥂", "💕", "📸", "🌙", "⭐", "🍸", "💫", "🪩"];
  const confettiPieces = Array.from({ length: 36 });
  const heartPieces = ["❤️", "💖", "💘", "💝", "💕", "💗", "💞", "🥂", "✨"];

  return (
    <div className="min-h-screen grid place-items-center bg-paper px-6 py-12 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)", backgroundSize: "20px 20px" }} aria-hidden />

      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
        {floaters.map((emoji, i) => (
          <span
            key={i}
            className="absolute text-2xl md:text-3xl opacity-40 animate-float"
            style={{
              left: `${(i * 9.7 + 5) % 95}%`,
              top: `${(i * 13.3 + 8) % 90}%`,
              animationDelay: `${i * 0.6}s`,
              animationDuration: `${6 + (i % 4)}s`,
            }}
          >
            {emoji}
          </span>
        ))}
      </div>

      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-brand/20 blur-3xl animate-blob" aria-hidden />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-amber-300/20 blur-3xl animate-blob" style={{ animationDelay: "2s" }} aria-hidden />

      <div className={`relative w-full max-w-md ${shake ? "animate-[funny-shake_0.7s_ease-in-out]" : "animate-card-in"} ${errorFlash ? "animate-[error-flash_0.9s_ease-out]" : ""}`}>
        <div className="paper-card rounded-3xl p-8 md:p-10 relative">
          <span className="tape left-1/2 -translate-x-1/2 -top-4 w-32 h-6 rotate-[-2deg] animate-tape-sway" aria-hidden />

          <div className="text-center mb-8">
            <div className={`inline-block text-4xl mb-3 ${shake ? "animate-[lock-rattle_0.7s_ease-in-out]" : "animate-lock-bounce"}`}>🔒</div>
            <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-charcoal/50 mb-2">
              Members only · Est. 2022
            </p>
            <h1 className="font-serif text-3xl md:text-4xl italic leading-tight">
              The <span className="text-brand animate-shimmer">Nonagon</span> Vault.
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
                className="w-full bg-cream/60 border border-charcoal/15 rounded-xl px-4 py-3 font-serif text-base outline-none focus:border-brand focus:scale-[1.02] transition-all duration-300"
                autoFocus
              />
            </div>
            <div className="relative">
              <label className="font-mono text-[10px] tracking-[0.2em] uppercase text-charcoal/60 block mb-1.5">
                Secret phrase
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                placeholder="••••••••••••••"
                className={`w-full bg-cream/60 border rounded-xl px-4 py-3 pr-12 font-serif text-base outline-none focus:border-brand focus:scale-[1.02] transition-all duration-300 ${errorFlash ? "border-brand animate-[input-wobble_0.5s_ease-in-out]" : "border-charcoal/15"}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-[calc(50%+6px)] -translate-y-1/2 text-charcoal/40 hover:text-charcoal transition-colors duration-200 focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <span className="block transition-all duration-300" style={{ transform: showPassword ? "rotate(180deg) scale(1.1)" : "rotate(0deg) scale(1)", opacity: showPassword ? 1 : 0.7 }}>
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </span>
              </button>
            </div>

            {error && (
              <p className="font-mono text-xs text-brand text-center animate-[shake_0.4s]">{error}</p>
            )}

            <button
              type="submit"
              className="group relative w-full bg-charcoal text-paper rounded-full py-3.5 font-medium text-sm hover:bg-brand transition-all duration-300 mt-2 overflow-hidden hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg"
            >
              <span className="relative z-10">Unlock the scrapbook →</span>
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
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

      {celebrating && (
        <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-paper/40 animate-[celebrate-flash_1.6s_ease-out]" />
          {confettiPieces.map((_, i) => {
            const left = (i * 7.3 + 3) % 100;
            const delay = (i % 12) * 0.05;
            const duration = 1.2 + (i % 5) * 0.15;
            const isHeart = i % 3 === 0;
            const colors = ["#ef4444", "#f59e0b", "#ec4899", "#8b5cf6", "#10b981", "#3b82f6"];
            return isHeart ? (
              <span
                key={i}
                className="absolute text-2xl md:text-3xl animate-[confetti-fall_var(--dur)_cubic-bezier(0.4,0.7,0.6,1)_forwards]"
                style={{
                  left: `${left}%`,
                  top: "-10%",
                  animationDelay: `${delay}s`,
                  ["--dur" as never]: `${duration}s`,
                }}
              >
                {heartPieces[i % heartPieces.length]}
              </span>
            ) : (
              <span
                key={i}
                className="absolute w-2 h-3 rounded-sm animate-[confetti-fall_var(--dur)_cubic-bezier(0.4,0.7,0.6,1)_forwards]"
                style={{
                  left: `${left}%`,
                  top: "-10%",
                  background: colors[i % colors.length],
                  animationDelay: `${delay}s`,
                  ["--dur" as never]: `${duration}s`,
                  transform: `rotate(${(i * 37) % 360}deg)`,
                }}
              />
            );
          })}
          <div className="absolute inset-0 grid place-items-center">
            <div className="text-center animate-[welcome-pop_1.6s_cubic-bezier(0.22,1,0.36,1)]">
              <div className="text-6xl md:text-7xl mb-3">🥂</div>
              <p className="font-serif italic text-2xl md:text-3xl text-charcoal">
                Welcome back to the <span className="text-brand">Vault</span>.
              </p>
            </div>
          </div>
        </div>
      )}


      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(8deg); }
        }
        .animate-float { animation: float 7s ease-in-out infinite; }
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -20px) scale(1.1); }
          66% { transform: translate(-20px, 30px) scale(0.95); }
        }
        .animate-blob { animation: blob 12s ease-in-out infinite; }
        @keyframes card-in {
          0% { opacity: 0; transform: translateY(20px) scale(0.96); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-card-in { animation: card-in 0.7s cubic-bezier(0.22, 1, 0.36, 1); }
        @keyframes lock-bounce {
          0%, 100% { transform: translateY(0) rotate(0); }
          50% { transform: translateY(-6px) rotate(-6deg); }
        }
        .animate-lock-bounce { animation: lock-bounce 2.4s ease-in-out infinite; display: inline-block; }
        @keyframes tape-sway {
          0%, 100% { transform: translateX(-50%) rotate(-2deg); }
          50% { transform: translateX(-50%) rotate(1deg); }
        }
        .animate-tape-sway { animation: tape-sway 5s ease-in-out infinite; }
        @keyframes shimmer {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-shimmer {
          background: linear-gradient(90deg, currentColor 0%, #f59e0b 50%, currentColor 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 3s linear infinite;
        }
        @keyframes confetti-fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0.9; }
        }
        @keyframes welcome-pop {
          0% { opacity: 0; transform: scale(0.6); }
          30% { opacity: 1; transform: scale(1.08); }
          60% { transform: scale(1); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes celebrate-flash {
          0% { opacity: 0; }
          15% { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
