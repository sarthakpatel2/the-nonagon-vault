import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const ORIGINAL_TITLE_FALLBACK = "The Nonagon — Nine humans, one infinite loop";
const AWAY_TITLES = [
  "👀 BHAI WAPAS AAJA",
  "📵 Mummy ka phone uthao",
  "🥲 Tu chala gaya?",
  "🔔 Proxy nahi lagi tujhse",
  "💤 Tab khol ke so gaya kya?",
];
const PROXY_LINES = [
  "✓ Proxy marked. Attendance: 75.01%",
  "✓ Sir ne 'present' bola. Heroic save.",
  "✓ Roll number 23 — yes sir!",
  "✓ Bench ke peeche se haath uthaya. Counted.",
];
const RANDOM_NUDGES = [
  { title: "📞 Mummy calling…", description: "Pick up. It's been 4 days." },
  { title: "🍜 Maggi ready in 2 min", description: "(it's been 47 minutes)" },
  { title: "🔋 Laptop battery: 7%", description: "Charger dhundh, jaldi." },
  { title: "📚 Exam in 14 hours", description: "Unit 1 bhi nahi padha. All the best." },
  { title: "💸 Paytm: ₹37 debited", description: "Chai + samosa @ canteen." },
];
const INTERNAL_MARKS = [
  { subject: "Compiler Design", marks: "14/50", comment: "Parser bana diya, grades nahi." },
  { subject: "Operating Systems", marks: "22/50", comment: "Deadlock me hi reh gaya." },
  { subject: "Computer Networks", marks: "18/50", comment: "3-way handshake fail ho gaya." },
  { subject: "DBMS", marks: "11/50", comment: "Query sahi thi, life nahi." },
  { subject: "Machine Learning", marks: "8/50", comment: "Model overfit kiya, marks underfit." },
];
const KONAMI_SEQUENCE = [
  "arrowup", "arrowup", "arrowdown", "arrowdown",
  "arrowleft", "arrowright", "arrowleft", "arrowright", "b", "a",
];

export function Pranks() {
  const fired = useRef({ right: false, nudge: false, konami: false, marks: false });
  const typedRef = useRef("");
  const konamiRef = useRef<string[]>([]);
  const clickTimesRef = useRef<number[]>([]);
  const [backbencherMode, setBackbencherMode] = useState(false);
  const trailRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const originalTitle = document.title || ORIGINAL_TITLE_FALLBACK;

    // 1) Console ASCII art + hiring joke
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

    // 2) Tab-away title prank
    const onVis = () => {
      if (document.hidden) {
        document.title = AWAY_TITLES[Math.floor(Math.random() * AWAY_TITLES.length)];
      } else {
        document.title = originalTitle;
      }
    };
    document.addEventListener("visibilitychange", onVis);

    // 3) First right-click prank
    const onCtx = (e: MouseEvent) => {
      if (fired.current.right) return;
      fired.current.right = true;
      e.preventDefault();
      toast("🕵️ Inspect element se kya milega?", {
        description: "Saare secrets toh group chat me hain.",
      });
      setTimeout(() => {
        document.removeEventListener("contextmenu", onCtx);
      }, 0);
    };
    document.addEventListener("contextmenu", onCtx);

    // 4) Type "proxy" anywhere → fake attendance toast
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (!/^[a-zA-Z]$/.test(e.key)) return;
      typedRef.current = (typedRef.current + e.key.toLowerCase()).slice(-5);
      if (typedRef.current === "proxy") {
        typedRef.current = "";
        const line = PROXY_LINES[Math.floor(Math.random() * PROXY_LINES.length)];
        toast.success(line, { description: "Bench ke peeche se, hamesha ki tarah." });
      }
    };
    window.addEventListener("keydown", onKey);

    // 5) One random nudge per session, 40–90s in
    const nudgeKey = "nonagon_nudge_done";
    let nudgeTimer: number | undefined;
    if (!sessionStorage.getItem(nudgeKey)) {
      const delay = 40000 + Math.random() * 50000;
      nudgeTimer = window.setTimeout(() => {
        if (document.hidden) return;
        const n = RANDOM_NUDGES[Math.floor(Math.random() * RANDOM_NUDGES.length)];
        toast(n.title, { description: n.description });
        sessionStorage.setItem(nudgeKey, "1");
        fired.current.nudge = true;
      }, delay);
    }

    // 6) Konami code → Backbencher Mode
    const onKonamiKey = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const seq = konamiRef.current;
      seq.push(key);
      if (seq.length > KONAMI_SEQUENCE.length) seq.shift();
      if (seq.length === KONAMI_SEQUENCE.length &&
          seq.every((k, i) => k === KONAMI_SEQUENCE[i])) {
        if (fired.current.konami) return;
        fired.current.konami = true;
        setBackbencherMode(true);
        toast.success("🎮 Backbencher Mode Activated!", {
          description: "Cheats enabled. Exam answers loading... (just kidding)",
          duration: 6000,
        });
        // brief screen tilt
        document.body.style.transform = "rotate(1deg) scale(0.99)";
        document.body.style.transition = "transform 0.4s ease";
        setTimeout(() => {
          document.body.style.transform = "";
          setTimeout(() => {
            document.body.style.transition = "";
            setBackbencherMode(false);
          }, 400);
        }, 600);
        konamiRef.current = [];
      }
    };
    window.addEventListener("keydown", onKonamiKey);

    // 7) Internal marks fake notification (once per session, 25-50s)
    const marksKey = "nonagon_marks_done";
    let marksTimer: number | undefined;
    if (!sessionStorage.getItem(marksKey)) {
      const delay = 25000 + Math.random() * 25000;
      marksTimer = window.setTimeout(() => {
        if (document.hidden) return;
        const m = INTERNAL_MARKS[Math.floor(Math.random() * INTERNAL_MARKS.length)];
        toast.error(`📊 Internal Marks: ${m.marks}`, {
          description: `${m.subject}. ${m.comment}`,
          duration: 7000,
        });
        sessionStorage.setItem(marksKey, "1");
        fired.current.marks = true;
      }, delay);
    }

    // 8) Click rage detector — 8 clicks within 3 seconds
    const onClick = () => {
      const now = Date.now();
      clickTimesRef.current = clickTimesRef.current.filter(t => now - t < 3000);
      clickTimesRef.current.push(now);
      if (clickTimesRef.current.length >= 8) {
        clickTimesRef.current = [];
        toast("🔥 Rage quit detected!", {
          description: "Bhai calm down. Site crash nahi hogi.",
          duration: 4000,
        });
        // tiny screen shake
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
      }
    };
    document.addEventListener("click", onClick);

    // 9) Cursor emoji trail
    const emojis = ["🎓", "📚", "✏️", "☕", "💤", "📝", "🍜"];
    let emojiIdx = 0;
    const onMouseMove = (e: MouseEvent) => {
      if (Math.random() > 0.92) {
        const el = document.createElement("div");
        el.textContent = emojis[emojiIdx % emojis.length];
        el.style.position = "fixed";
        el.style.left = `${e.clientX}px`;
        el.style.top = `${e.clientY}px`;
        el.style.pointerEvents = "none";
        el.style.fontSize = "16px";
        el.style.zIndex = "9999";
        el.style.opacity = "1";
        el.style.transition = "opacity 0.7s ease, transform 0.7s ease";
        document.body.appendChild(el);
        emojiIdx++;
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            el.style.opacity = "0";
            el.style.transform = "translateY(20px) scale(0.5)";
          });
        });
        setTimeout(() => el.remove(), 700);
      }
    };
    document.addEventListener("mousemove", onMouseMove);

    return () => {
      document.removeEventListener("visibilitychange", onVis);
      document.removeEventListener("contextmenu", onCtx);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keydown", onKonamiKey);
      document.removeEventListener("click", onClick);
      document.removeEventListener("mousemove", onMouseMove);
      if (nudgeTimer) clearTimeout(nudgeTimer);
      if (marksTimer) clearTimeout(marksTimer);
      document.title = originalTitle;
      document.body.style.transform = "";
      document.body.style.transition = "";
    };
  }, []);

  return (
    backbencherMode ? (
      <div
        ref={trailRef}
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 9998,
          boxShadow: "inset 0 0 80px rgba(233,69,96,0.15)",
          transition: "box-shadow 0.4s ease",
        }}
      />
    ) : null
  );
}
