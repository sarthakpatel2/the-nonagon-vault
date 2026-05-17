import p0 from "@/assets/photos/p0.jpeg";
import p1 from "@/assets/photos/p1.jpeg";
import p2 from "@/assets/photos/p2.jpeg";
import p3 from "@/assets/photos/p3.jpeg";
import p4 from "@/assets/photos/p4.jpeg";
import p5 from "@/assets/photos/p5.jpeg";
import p6 from "@/assets/photos/p6.jpeg";
import p7 from "@/assets/photos/p7.jpeg";
import p8 from "@/assets/photos/p8.jpeg";
import p9 from "@/assets/photos/p9.jpeg";

export type Photo = {
  src: string;
  caption: string;
  date: string;
  rotate: string;
};

export const photos: Photo[] = [
  { src: p1, caption: "The whole crew. One frame, somehow.", date: "ROOFTOP", rotate: "-rotate-2" },
  { src: p0, caption: "Cafe selfie — six smiles, zero regrets.", date: "LATE NIGHT", rotate: "rotate-2" },
  { src: p3, caption: "Golden hour on the terrace.", date: "EVENING", rotate: "-rotate-1" },
  { src: p6, caption: "Same spot, same people, new memory.", date: "15 SEP 2024", rotate: "rotate-2" },
  { src: p5, caption: "Heart hands and the elephant statue.", date: "DAY OUT", rotate: "-rotate-3" },
  { src: p2, caption: "Concert lights. Wet hair. Pure chaos.", date: "FEST NIGHT", rotate: "rotate-3" },
  { src: p8, caption: "Front row for the headliner.", date: "CULFEST", rotate: "-rotate-2" },
  { src: p7, caption: "Brothers. Thumbs up. Say no more.", date: "FEST GROUND", rotate: "rotate-2" },
  { src: p9, caption: "Quiet moment in the loudest year.", date: "ROOFTOP", rotate: "-rotate-1" },
  { src: p4, caption: "Mirror selfie. Tilted. Iconic.", date: "POST-PARTY", rotate: "rotate-3" },
];

export const photoMap = { p0, p1, p2, p3, p4, p5, p6, p7, p8, p9 };
