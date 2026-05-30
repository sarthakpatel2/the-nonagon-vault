import { useEffect, useState } from "react";

type Mood = "dawn" | "day" | "dusk" | "night";

export function AuroraBackground() {
  const [mood, setMood] = useState<Mood>("day");

  useEffect(() => {
    const update = () => {
      const h = new Date().getHours();
      setMood(h < 6 ? "night" : h < 10 ? "dawn" : h < 17 ? "day" : h < 20 ? "dusk" : "night");
    };
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, []);

  const isNight = mood === "night";
  const tint: Record<Mood, string> = {
    dawn: "from-rose-200/30 via-amber-100/20 to-sky-200/30",
    day: "from-sky-100/30 via-transparent to-amber-100/30",
    dusk: "from-orange-200/40 via-rose-200/20 to-indigo-300/30",
    night: "from-indigo-900/50 via-slate-900/40 to-purple-900/50",
  };

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden>
      <div className={`absolute inset-0 bg-gradient-to-br ${tint[mood]} transition-opacity duration-1000`} />
      <div
        className="absolute -top-1/3 -left-1/4 w-[60vw] h-[60vw] rounded-full blur-3xl opacity-40 animate-aurora-1"
        style={{ background: isNight ? "radial-gradient(circle, #6366f1, transparent 70%)" : "radial-gradient(circle, #fbbf24, transparent 70%)" }}
      />
      <div
        className="absolute top-1/4 -right-1/4 w-[55vw] h-[55vw] rounded-full blur-3xl opacity-40 animate-aurora-2"
        style={{ background: isNight ? "radial-gradient(circle, #a855f7, transparent 70%)" : "radial-gradient(circle, #f472b6, transparent 70%)" }}
      />
      <div
        className="absolute -bottom-1/4 left-1/4 w-[60vw] h-[60vw] rounded-full blur-3xl opacity-40 animate-aurora-3"
        style={{ background: isNight ? "radial-gradient(circle, #06b6d4, transparent 70%)" : "radial-gradient(circle, #60a5fa, transparent 70%)" }}
      />
      <style>{`
        @keyframes aurora-1 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(15vw,10vh) scale(1.15); } }
        .animate-aurora-1 { animation: aurora-1 18s ease-in-out infinite; }
        @keyframes aurora-2 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(-12vw,8vh) scale(0.9); } }
        .animate-aurora-2 { animation: aurora-2 22s ease-in-out infinite; }
        @keyframes aurora-3 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(8vw,-12vh) scale(1.1); } }
        .animate-aurora-3 { animation: aurora-3 26s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
