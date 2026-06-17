import { useEffect, useRef } from "react";
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

export function Pranks() {
  const fired = useRef({ right: false, nudge: false });
  const typedRef = useRef("");

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
        // restore native menu after the first gag
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

    return () => {
      document.removeEventListener("visibilitychange", onVis);
      document.removeEventListener("contextmenu", onCtx);
      window.removeEventListener("keydown", onKey);
      if (nudgeTimer) clearTimeout(nudgeTimer);
      document.title = originalTitle;
    };
  }, []);

  return null;
}
