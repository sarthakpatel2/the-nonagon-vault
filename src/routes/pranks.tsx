import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useState, useRef, useEffect } from "react";

const PRANKS = [
  {
    id: "tab-away",
    title: "Tab-Away Title Prank",
    description:
      "Switch to another tab and watch the page title panic. Hindi messages like “BHAI WAPAS AAJA” take over.",
    icon: "👀",
    trigger: () => {
      toast.info("Switch to another tab to see the panic!", {
        description: "The title will beg you to come back.",
      });
    },
  },
  {
    id: "right-click",
    title: "First Right-Click Gag",
    description:
      "Your very first right-click is hijacked with a roast: “Inspect element se kya milega? Saare secrets toh group chat me hain.”",
    icon: "🕵️",
    trigger: () => {
      toast("🕵️ Inspect element se kya milega?", {
        description: "Saare secrets toh group chat me hain.",
      });
    },
  },
  {
    id: "proxy",
    title: "Type “proxy” Anywhere",
    description:
      "Type “proxy” on your keyboard (not in an input) and get a random attendance confirmation toast. Bench ke peeche se, hamesha ki tarah.",
    icon: "✓",
    trigger: () => {
      const lines = [
        "✓ Proxy marked. Attendance: 75.01%",
        "✓ Sir ne 'present' bola. Heroic save.",
        "✓ Roll number 23 — yes sir!",
        "✓ Bench ke peeche se haath uthaya. Counted.",
      ];
      toast.success(lines[Math.floor(Math.random() * lines.length)], {
        description: "Bench ke peeche se, hamesha ki tarah.",
      });
    },
  },
  {
    id: "nudge",
    title: "Random Session Nudge",
    description:
      "40–90 seconds into your visit, a fake notification sneaks in. Mummy calling, Maggi ready, or laptop dying — all lies, all fun.",
    icon: "🔔",
    trigger: () => {
      const nudges = [
        { title: "📞 Mummy calling…", description: "Pick up. It's been 4 days." },
        { title: "🍜 Maggi ready in 2 min", description: "(it's been 47 minutes)" },
        { title: "🔋 Laptop battery: 7%", description: "Charger dhundh, jaldi." },
        { title: "📚 Exam in 14 hours", description: "Unit 1 bhi nahi padha. All the best." },
        { title: "💸 Paytm: ₹37 debited", description: "Chai + samosa @ canteen." },
      ];
      const n = nudges[Math.floor(Math.random() * nudges.length)];
      toast(n.title, { description: n.description });
    },
  },
  {
    id: "console",
    title: "Console Easter Egg",
    description:
      "Open DevTools → Console. A styled “the nonagon” badge appears with a hiring joke. (No salary, only chai.)",
    icon: "🖥️",
    trigger: () => {
      try {
        console.log(
          "%c the nonagon ",
          "background:#e94560;color:#fff;font-size:14px;padding:6px 10px;border-radius:6px;font-weight:700",
        );
        console.log(
          "%cBhai inspector ban gaya? 🕵️  We're hiring (no salary, only chai).",
          "color:#888;font-style:italic",
        );
      } catch {}
      toast.success("Check your browser console!", {
        description: "DevTools → Console tab.",
      });
    },
  },
  {
    id: "konami",
    title: "Konami Code — Backbencher Mode",
    description:
      "↑ ↑ ↓ ↓ ← → ← → B A. Activates “Backbencher Mode” with a screen tilt and a cheeky toast. Cheats enabled (not really).",
    icon: "🎮",
    trigger: () => {
      toast.success("🎮 Backbencher Mode Activated!", {
        description: "Cheats enabled. Exam answers loading... (just kidding)",
        duration: 5000,
      });
      // brief tilt
      document.body.style.transform = "rotate(1deg) scale(0.99)";
      document.body.style.transition = "transform 0.4s ease";
      setTimeout(() => {
        document.body.style.transform = "";
        setTimeout(() => {
          document.body.style.transition = "";
        }, 400);
      }, 600);
    },
  },
  {
    id: "marks",
    title: "Fake Internal Marks",
    description:
      "A realistic notification drops with hilariously low internal marks and a subject-specific roast. Happens once per session, 25–50s in.",
    icon: "📊",
    trigger: () => {
      const marks = [
        { subject: "Compiler Design", marks: "14/50", comment: "Parser bana diya, grades nahi." },
        { subject: "Operating Systems", marks: "22/50", comment: "Deadlock me hi reh gaya." },
        { subject: "Computer Networks", marks: "18/50", comment: "3-way handshake fail ho gaya." },
        { subject: "DBMS", marks: "11/50", comment: "Query sahi thi, life nahi." },
        { subject: "Machine Learning", marks: "8/50", comment: "Model overfit kiya, marks underfit." },
      ];
      const m = marks[Math.floor(Math.random() * marks.length)];
      toast.error(`📊 Internal Marks: ${m.marks}`, {
        description: `${m.subject}. ${m.comment}`,
        duration: 6000,
      });
    },
  },
  {
    id: "rage",
    title: "Rage Click Detector",
    description:
      "Click 8 times within 3 seconds and the site calls you out: “Rage quit detected!” with a screen shake. Stay calm, bhai.",
    icon: "🔥",
    trigger: () => {
      toast("🔥 Rage quit detected!", {
        description: "Bhai calm down. Site crash nahi hogi.",
        duration: 4000,
      });
      const originalTransform = document.body.style.transform;
      document.body.style.transition = "transform 0.05s";
      let shakes = 0;
      const shake = setInterval(() => {
        document.body.style.transform = `translateX(${(shakes % 2 === 0 ? 4 : -4)}px)`;
        shakes++;
        if (shakes >= 6) {
          clearInterval(shake);
          document.body.style.transform = originalTransform;
          document.body.style.transition = "";
        }
      }, 50);
    },
  },
  {
    id: "trail",
    title: "Cursor Emoji Trail",
    description:
      "Move your mouse around and watch graduation caps, books, coffee, and sleep emojis gently fade behind your cursor.",
    icon: "🎓",
    trigger: () => {
      const emojis = ["🎓", "📚", "✏️", "☕", "💤", "📝", "🍜"];
      let count = 0;
      const handler = (e: MouseEvent) => {
        if (Math.random() > 0.5) return;
        const el = document.createElement("div");
        el.textContent = emojis[count % emojis.length];
        el.style.position = "fixed";
        el.style.left = `${e.clientX}px`;
        el.style.top = `${e.clientY}px`;
        el.style.pointerEvents = "none";
        el.style.fontSize = "16px";
        el.style.zIndex = "9999";
        el.style.opacity = "1";
        el.style.transition = "opacity 0.7s ease, transform 0.7s ease";
        document.body.appendChild(el);
        count++;
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            el.style.opacity = "0";
            el.style.transform = "translateY(20px) scale(0.5)";
          });
        });
        setTimeout(() => el.remove(), 700);
        if (count >= 15) {
          document.removeEventListener("mousemove", handler);
          toast.info("Cursor trail demo complete!", {
            description: "It triggers randomly as you browse the site normally.",
          });
        }
      };
      document.addEventListener("mousemove", handler);
      toast.info("Move your mouse around!", {
        description: "Emojis will trail behind your cursor for a few seconds.",
      });
    },
  },
];

export const Route = createFileRoute("/pranks")({
  head: () => ({
    meta: [
      { title: "Pranks — The Nonagon" },
      { name: "description", content: "A catalogue of every prank hidden across The Nonagon yearbook. Try them all." },
      { property: "og:title", content: "Pranks — The Nonagon" },
      { property: "og:description", content: "A catalogue of every prank hidden across The Nonagon yearbook. Try them all." },
    ],
  }),
  component: PranksPage,
});

function PranksPage() {
  const [triggered, setTriggered] = useState<Set<string>>(new Set());
  const clickTimes = useRef<number[]>([]);
  const [rageProgress, setRageProgress] = useState(0);

  useEffect(() => {
    const onClick = () => {
      const now = Date.now();
      clickTimes.current = clickTimes.current.filter((t) => now - t < 3000);
      clickTimes.current.push(now);
      setRageProgress(clickTimes.current.length);
      if (clickTimes.current.length >= 8) {
        clickTimes.current = [];
        setRageProgress(0);
        toast("🔥 Rage quit detected!", {
          description: "Bhai calm down. Site crash nahi hogi.",
          duration: 4000,
        });
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const tryPrank = (id: string) => {
    const prank = PRANKS.find((p) => p.id === id);
    if (prank) {
      prank.trigger();
      setTriggered((prev) => new Set(prev).add(id));
    }
  };

  return (
    <div className="min-h-screen px-6 py-16 md:px-12 lg:px-20">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            🎭 The Prank Vault
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            Nine pranks. Zero regrets. Click “Try It” to experience each one right here — or stumble into them naturally as you browse the yearbook.
          </p>
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
            {triggered.size} / {PRANKS.length} tried
          </div>

          {/* Rage click meter */}
          <div className="mx-auto mt-6 flex max-w-xs flex-col items-center gap-1">
            <span className="text-xs text-muted-foreground">Rage Click Meter (click anywhere fast)</span>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <motion.div
                className="h-full rounded-full bg-primary"
                animate={{ width: `${(rageProgress / 8) * 100}%` }}
                transition={{ duration: 0.2 }}
              />
            </div>
          </div>
        </motion.div>

        {/* Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PRANKS.map((prank, i) => (
            <motion.div
              key={prank.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.45,
                delay: i * 0.06,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="group relative flex flex-col rounded-2xl border border-border/60 bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-4 flex items-start justify-between">
                <span className="text-3xl" aria-hidden>
                  {prank.icon}
                </span>
                {triggered.has(prank.id) && (
                  <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    Tried
                  </span>
                )}
              </div>

              <h2 className="text-lg font-semibold">{prank.title}</h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                {prank.description}
              </p>

              <button
                onClick={() => tryPrank(prank.id)}
                className="mt-5 inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Try It →
              </button>
            </motion.div>
          ))}
        </div>

        {/* Footer hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-16 text-center text-sm text-muted-foreground"
        >
          💡 Pro tip: Some pranks only fire once per session or need you to be on another page. Explore the yearbook to catch them all.
        </motion.p>
      </div>
    </div>
  );
}
