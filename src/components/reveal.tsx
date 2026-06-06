import { useEffect, useRef, useState, type ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: "div" | "section" | "article" | "header" | "li";
}

/**
 * Scroll-triggered reveal using IntersectionObserver.
 * Animates a CSS variable so it composites cheaply.
 */
export function Reveal({
  children,
  className = "",
  delay = 0,
  y = 28,
  as: Tag = "div",
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Comp = Tag as "div";
  return (
    <Comp
      ref={ref as never}
      className={`reveal-on-scroll ${shown ? "is-shown" : ""} ${className}`}
      style={{
        // @ts-expect-error css custom props
        "--reveal-y": `${y}px`,
        "--reveal-delay": `${delay}ms`,
      }}
    >
      {children}
    </Comp>
  );
}
