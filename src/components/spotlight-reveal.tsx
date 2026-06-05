import { useRef, useState, useEffect } from "react";
import aditi from "@/assets/crew/aditi.jpeg";
import amanSax from "@/assets/crew/aman-saxena.jpeg";
import amanSingh from "@/assets/crew/aman-singh.jpeg";
import madhavK from "@/assets/crew/madhav-khandelwal.jpeg";
import madhavS from "@/assets/crew/madhav-sharma.jpeg";
import pragati from "@/assets/crew/pragati.jpeg";
import racheet from "@/assets/crew/racheet.jpeg";
import sarthak from "@/assets/crew/sarthak.jpeg";
import shivendra from "@/assets/crew/shivendra.jpeg";

const crew = [
  { src: shivendra, name: "Shivendra" },
  { src: sarthak, name: "Sarthak" },
  { src: racheet, name: "Racheet" },
  { src: madhavK, name: "Madhav K." },
  { src: aditi, name: "Aditi" },
  { src: madhavS, name: "Madhav S." },
  { src: pragati, name: "Pragati" },
  { src: amanSax, name: "Aman Sax." },
  { src: amanSingh, name: "Aman S." },
];

export function SpotlightReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [active, setActive] = useState(false);
  const [touch, setTouch] = useState(false);

  useEffect(() => {
    setTouch(window.matchMedia("(hover: none)").matches);
  }, []);

  function onMove(e: React.MouseEvent) {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    setPos({
      x: ((e.clientX - r.left) / r.width) * 100,
      y: ((e.clientY - r.top) / r.height) * 100,
    });
  }

  const radius = touch || !active ? "0px" : "180px";
  const mask = `radial-gradient(circle ${radius} at ${pos.x}% ${pos.y}%, #000 0%, #000 60%, transparent 100%)`;

  return (
    <section className="px-6 md:px-10 py-20 md:py-28 max-w-7xl mx-auto">
      <div className="mb-8 md:mb-12 flex items-end justify-between flex-wrap gap-4">
        <div>
          <p className="font-mono text-xs tracking-[0.3em] uppercase text-charcoal/50 mb-3">
            ✦ The Nonagon · 9 humans
          </p>
          <h2 className="font-serif text-3xl md:text-5xl tracking-tight">
            Move your cursor. <span className="italic text-brand">Find us.</span>
          </h2>
        </div>
        <p className="font-mono text-xs text-charcoal/50 max-w-xs">
          {touch ? "tap & drag" : "hover anywhere"} — the spotlight follows you across the grid.
        </p>
      </div>

      <div
        ref={ref}
        onMouseMove={onMove}
        onMouseEnter={() => setActive(true)}
        onMouseLeave={() => setActive(false)}
        onTouchStart={() => setActive(true)}
        onTouchMove={(e) => {
          const t = e.touches[0];
          const r = ref.current?.getBoundingClientRect();
          if (!r || !t) return;
          setPos({ x: ((t.clientX - r.left) / r.width) * 100, y: ((t.clientY - r.top) / r.height) * 100 });
        }}
        onTouchEnd={() => setActive(false)}
        className="relative aspect-[4/3] md:aspect-[16/10] rounded-3xl overflow-hidden bg-charcoal cursor-none select-none"
      >
        {/* base: dim/desaturated grid */}
        <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-[2px] opacity-30">
          {crew.map((p) => (
            <div key={p.name} className="relative overflow-hidden bg-charcoal">
              <img
                src={p.src}
                alt=""
                aria-hidden
                className="w-full h-full object-cover grayscale contrast-110"
                draggable={false}
              />
            </div>
          ))}
        </div>

        {/* revealed: full color grid behind the mask */}
        <div
          className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-[2px] transition-[mask-image] duration-100"
          style={{
            WebkitMaskImage: mask,
            maskImage: mask,
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
          }}
        >
          {crew.map((p) => (
            <div key={p.name} className="relative overflow-hidden bg-charcoal">
              <img
                src={p.src}
                alt={p.name}
                className="w-full h-full object-cover transition-transform duration-700"
                draggable={false}
              />
              <div className="absolute bottom-2 left-2 font-mono text-[10px] md:text-xs px-2 py-1 rounded-full bg-paper/90 text-charcoal">
                {p.name}
              </div>
            </div>
          ))}
        </div>

        {/* custom cursor ring */}
        {active && !touch && (
          <div
            className="pointer-events-none absolute w-[180px] h-[180px] -ml-[90px] -mt-[90px] rounded-full border-2 border-brand mix-blend-difference transition-transform duration-100"
            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
          />
        )}

        {/* idle hint */}
        {!active && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="font-mono text-xs md:text-sm tracking-[0.3em] uppercase text-paper/80 px-4 py-2 rounded-full border border-paper/30 backdrop-blur-sm">
              ✦ reveal the nonagon ✦
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
