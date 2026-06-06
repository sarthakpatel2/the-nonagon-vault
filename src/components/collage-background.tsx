import { useEffect, useRef, useState } from "react";
import aditi from "@/assets/crew/aditi.jpeg";
import amanSax from "@/assets/crew/aman-saxena.jpeg";
import amanSingh from "@/assets/crew/aman-singh.jpeg";
import madhavK from "@/assets/crew/madhav-khandelwal.jpeg";
import madhavS from "@/assets/crew/madhav-sharma.jpeg";
import pragati from "@/assets/crew/pragati.jpeg";
import racheet from "@/assets/crew/racheet.jpeg";
import sarthak from "@/assets/crew/sarthak.jpeg";
import shivendra from "@/assets/crew/shivendra.jpeg";

// 9 tiles in a 3x3, each with its own parallax depth
const tiles = [
  { src: shivendra, depth: 18, pos: "50% 25%" },
  { src: sarthak, depth: 10, pos: "50% 20%" },
  { src: racheet, depth: 24, pos: "50% 22%" },
  { src: madhavK, depth: 14, pos: "50% 25%" },
  { src: aditi, depth: 8, pos: "50% 22%" },
  { src: madhavS, depth: 20, pos: "50% 25%" },
  { src: pragati, depth: 12, pos: "50% 22%" },
  { src: amanSax, depth: 22, pos: "50% 25%" },
  { src: amanSingh, depth: 16, pos: "50% 25%" },
];

export function CollageBackground() {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [touch, setTouch] = useState(false);

  useEffect(() => {
    setTouch(window.matchMedia("(hover: none)").matches);

    let raf = 0;
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const x = (e.clientX / window.innerWidth) * 100;
        const y = (e.clientY / window.innerHeight) * 100;
        setPos({ x, y });
        if (ref.current) {
          ref.current.style.setProperty("--mx", `${e.clientX - window.innerWidth / 2}px`);
          ref.current.style.setProperty("--my", `${e.clientY - window.innerHeight / 2}px`);
        }
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  const radius = touch ? "0px" : "200px";
  const mask = `radial-gradient(circle ${radius} at ${pos.x}% ${pos.y}%, #000 0%, #000 55%, transparent 100%)`;

  return (
    <div
      ref={ref}
      aria-hidden
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-paper"
      style={{ ["--mx" as never]: "0px", ["--my" as never]: "0px" }}
    >
      {/* dim parallaxing base */}
      <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-[3px] opacity-[0.22]">
        {tiles.map((t, i) => (
          <div key={i} className="relative overflow-hidden bg-charcoal">
            <img
              src={t.src}
              alt=""
              className="absolute inset-0 w-[108%] h-[108%] object-cover grayscale contrast-110"
              style={{
                transform: `translate3d(calc(var(--mx) / ${60 / t.depth} * -1), calc(var(--my) / ${60 / t.depth} * -1), 0)`,
                transition: "transform 400ms cubic-bezier(0.16,1,0.3,1)",
                willChange: "transform",
              }}
              draggable={false}
            />
          </div>
        ))}
      </div>

      {/* color reveal under cursor */}
      <div
        className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-[3px]"
        style={{
          WebkitMaskImage: mask,
          maskImage: mask,
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
        }}
      >
        {tiles.map((t, i) => (
          <div key={i} className="relative overflow-hidden bg-charcoal">
            <img
              src={t.src}
              alt=""
              className="absolute inset-0 w-[108%] h-[108%] object-cover saturate-125"
              style={{
                transform: `translate3d(calc(var(--mx) / ${60 / t.depth} * -1), calc(var(--my) / ${60 / t.depth} * -1), 0)`,
                transition: "transform 400ms cubic-bezier(0.16,1,0.3,1)",
                willChange: "transform",
              }}
              draggable={false}
            />
          </div>
        ))}
      </div>

      {/* paper veil so foreground text stays readable */}
      <div className="absolute inset-0 bg-paper/75 backdrop-blur-[1px]" />
    </div>
  );
}
