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
import g1 from "@/assets/photos/g1.jpeg";
import g2 from "@/assets/photos/g2.jpeg";
import g3 from "@/assets/photos/g3.jpeg";
import g4 from "@/assets/photos/g4.jpeg";
import g5 from "@/assets/photos/g5.jpeg";
import g6 from "@/assets/photos/g6.jpeg";
import g7 from "@/assets/photos/g7.jpeg";
import g8 from "@/assets/photos/g8.jpeg";
import g9 from "@/assets/photos/g9.jpeg";
import g10 from "@/assets/photos/g10.jpeg";
import g11 from "@/assets/photos/g11.jpeg";
import g12 from "@/assets/photos/g12.jpeg";
import g13 from "@/assets/photos/g13.jpeg";
import g14 from "@/assets/photos/g14.jpeg";
import g15 from "@/assets/photos/g15.jpeg";
import g16 from "@/assets/photos/g16.jpeg";
import g17 from "@/assets/photos/g17.jpeg";
import g18 from "@/assets/photos/g18.jpeg";

export type Photo = {
  src: string;
  caption: string;
  date: string;
  rotate: string;
};

export const photos: Photo[] = [
  { src: p1, caption: "The whole crew. One frame, somehow.", date: "ROOFTOP", rotate: "-rotate-2" },
  { src: g3, caption: "Lads on the lawn. Crossed arms, zero plans.", date: "FEST NIGHT", rotate: "rotate-2" },
  { src: g5, caption: "Spotlights above, nine of us below.", date: "CONCERT", rotate: "-rotate-2" },
  { src: g10, caption: "Rooftop cafe. Sunlight through the slats.", date: "BRUNCH", rotate: "rotate-1" },
  { src: p0, caption: "Cafe selfie — six smiles, zero regrets.", date: "LATE NIGHT", rotate: "rotate-2" },
  { src: g6, caption: "Under the tree. Two rows, one gang.", date: "CAMPUS", rotate: "-rotate-1" },
  { src: g12, caption: "Thumbs up from the back row.", date: "DINNER", rotate: "rotate-3" },
  { src: g2, caption: "Family + friends. The full guest list.", date: "FAREWELL", rotate: "-rotate-2" },
  { src: p3, caption: "Golden hour on the terrace.", date: "EVENING", rotate: "-rotate-1" },
  { src: g11, caption: "Piggyback in the parking lot.", date: "AFTERNOON", rotate: "rotate-2" },
  { src: g7, caption: "Rooftop lineup. Everyone present, accounted for.", date: "DAY OUT", rotate: "rotate-2" },
  { src: g13, caption: "Concert ground selfie. Five-wide.", date: "CULFEST", rotate: "-rotate-3" },
  { src: g1, caption: "Peace sign, blurry lens, perfect night.", date: "AFTER PARTY", rotate: "rotate-3" },
  { src: g14, caption: "Three on a stool. Don't ask how.", date: "ROOFTOP BAR", rotate: "-rotate-2" },
  { src: g8, caption: "Piggyback on an empty village road.", date: "ROAD TRIP", rotate: "-rotate-2" },
  { src: g15, caption: "Mall squad. Hand on the face.", date: "DAY OUT", rotate: "rotate-1" },
  { src: p6, caption: "Same spot, same people, new memory.", date: "15 SEP 2024", rotate: "rotate-2" },
  { src: g16, caption: "Two-man army. Stadium lights behind.", date: "FEST NIGHT", rotate: "-rotate-1" },
  { src: g9, caption: "Sunlit staircase, two best friends.", date: "BRUNCH", rotate: "rotate-1" },
  { src: g17, caption: "Three-man mirror selfie. Iconic.", date: "GET-TOGETHER", rotate: "rotate-2" },
  { src: g4, caption: "Sat on the grass. Said nothing. Said everything.", date: "QUIET CORNER", rotate: "-rotate-3" },
  { src: g18, caption: "Three of us, one loud night.", date: "CULFEST", rotate: "-rotate-2" },
  { src: p5, caption: "Heart hands and the elephant statue.", date: "DAY OUT", rotate: "-rotate-3" },
  { src: p2, caption: "Concert lights. Wet hair. Pure chaos.", date: "FEST NIGHT", rotate: "rotate-3" },
  { src: p8, caption: "Front row for the headliner.", date: "CULFEST", rotate: "-rotate-2" },
  { src: p7, caption: "Brothers. Thumbs up. Say no more.", date: "FEST GROUND", rotate: "rotate-2" },
  { src: p9, caption: "Quiet moment in the loudest year.", date: "ROOFTOP", rotate: "-rotate-1" },
  { src: p4, caption: "Mirror selfie. Tilted. Iconic.", date: "POST-PARTY", rotate: "rotate-3" },
];

export const photoMap = { p0, p1, p2, p3, p4, p5, p6, p7, p8, p9, g1, g2, g3, g4, g5, g6, g7, g8, g9, g10, g11, g12, g13, g14, g15, g16, g17, g18 };
