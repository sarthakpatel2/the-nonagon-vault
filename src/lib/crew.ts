import aditiImg from "@/assets/crew/aditi.jpeg";
import amanSinghImg from "@/assets/crew/aman-singh.jpeg";
import amanSaxenaImg from "@/assets/crew/aman-saxena.jpeg";
import pragatiImg from "@/assets/crew/pragati.jpeg";
import madhavSharmaImg from "@/assets/crew/madhav-sharma.jpeg";
import madhavKhandelwalImg from "@/assets/crew/madhav-khandelwal.jpeg";
import racheetImg from "@/assets/crew/racheet.jpeg";
import sarthakImg from "@/assets/crew/sarthak.jpeg";
import shivendraImg from "@/assets/crew/shivendra.jpeg";

export type CrewMember = {
  slug: string;
  name: string;
  role: string;
  vibe: string;
  details: string[];
  punchline: string;
  photo: string;
};

export const crew: CrewMember[] = [
  {
    slug: "aditi",
    name: "Aditi Singh",
    role: "The Zen Comedian",
    vibe: "Calm, funny, and friendly — until the non-veg platter arrives.",
    details: [
      "Has a PhD in staying chill during chaos.",
      "Loves non-veg more than she loves her own health.",
      "After two drinks her truth serum activates.",
    ],
    punchline: "Mai nashe me nhi hu, mujhse koi sawal pucho.",
    photo: aditiImg,
  },
  {
    slug: "aman-singh",
    name: "Aman Singh",
    role: "The Biryani Mercenary",
    vibe: "Will literally do anything for friends. Emotions run on biryani fuel.",
    details: [
      "Choti Advance enthusiast — nobody knows what that means either.",
      "Always late because biryani > punctuality.",
      "Sleeps 14 hours a day. The other 10 are for eating.",
      "Drinks → vomits → repeats. It's a lifestyle.",
    ],
    punchline: "Bhai bas ek plate biryani aur 2 ghante neend.",
    photo: amanSinghImg,
  },
  {
    slug: "aman-saxena",
    name: "Aman Saxena",
    role: "The Serial Crasher",
    vibe: "Knows everyone, loves everyone (especially random girls he just met).",
    details: [
      "Good connections in every department, canteen, and bus stop.",
      "Falls in love at least twice a semester.",
      "Non-veg is religion. Getting dressed is a 45-minute ritual.",
    ],
    punchline: "Bhai usne mujhe dekha tha, I swear.",
    photo: amanSaxenaImg,
  },
  {
    slug: "pragati",
    name: "Pragati Srivastava",
    role: "The Kurkure Goddess",
    vibe: "Kind-hearted angel who occasionally forgets how the world works.",
    details: [
      "Eats Kurkure for dinner and calls it a balanced diet.",
      "Cries if you look at her wrong. Also cries if you look at her right.",
      "Family fear is real — her phone rings and she freezes.",
      "Dumb moments are just her brain buffering.",
    ],
    punchline: "Mummy ne phone kiya hai, main ghar jaa rahi hoon.",
    photo: pragatiImg,
  },
  {
    slug: "madhav-sharma",
    name: "Madhav Sharma",
    role: "The Plan Canceller",
    vibe: "Studious, scared, and convinced his body is a conspiracy.",
    details: [
      "Actually studies. Still confused. It's a talent.",
      "Cancels plans with the consistency of a Japanese train schedule.",
      "Loves kadhi chawal more than passing grades.",
      "Every conversation ends with: Bhai body nhi bn rhi hai.",
    ],
    punchline: "Bhai body nhi bn rhi hai, aur plan bhi nhi ja rha.",
    photo: madhavSharmaImg,
  },
  {
    slug: "madhav-khandelwal",
    name: "Madhav Khandelwal",
    role: "The Baniya Broadcast",
    vibe: "Loud, funny, and permanently in debt — but always ordering more.",
    details: [
      "Chatterbox with a voice that reaches the next hostel block.",
      "Makes everyone wait because he was 'bas 2 minute me aaya'.",
      "Baniya by birth, debtor by choice. Udhaar ka raja.",
      "Lies so smoothly you almost believe him. Almost.",
      "Kadhi-chawal runs in his veins.",
    ],
    punchline: "Bhai paise kal de dunga, pakka.",
    photo: madhavKhandelwalImg,
  },
  {
    slug: "racheet",
    name: "Racheet Saraswat",
    role: "The Raita Philosopher",
    vibe: "Speaks in riddles nobody asked for. Scared of his own shadow.",
    details: [
      "Random topic generator — currently speaking about space while eating raita.",
      "One-sided love artist. The other side never showed up.",
      "Raita is life. Raita is love. Raita is everything.",
      "Watches horror movies through fingers, then sleeps with lights on.",
    ],
    punchline: "Bhai raita fenk diya maine toh... zindagi fenk di.",
    photo: racheetImg,
  },
  {
    slug: "sarthak",
    name: "Sarthak Patel",
    role: "The Glue & The Enigma",
    vibe: "Chill, mysterious, threatens to leave the group at first (but never does).",
    details: [
      "Loves his friends but won't admit it. Acts too cool for emotions.",
      "Mysterious personality — even he doesn't know what he's doing next.",
      "Non-veg warrior. Kind of runs things, but don't say that out loud.",
      "The glue that holds this chaotic squad together.",
      "Girls look at him, like him, but he won't admit. (still blushing)",
    ],
    punchline: "Bhai sab theek hai, chill. Bas non-veg mile toh bata dio.",
    photo: sarthakImg,
  },
  {
    slug: "shivendra",
    name: "Shivendra Pandey",
    role: "The Hulk with a GPA",
    vibe: "Anger issues, hunger issues, and a tragic relationship with marks.",
    details: [
      "Anger management? Never heard of her.",
      "Fights, stops talking, then comes back hungrier than before.",
      "Always hungry. Even while eating.",
      "Studies the most during exams. Scores less than the guy who slept.",
      "Biryani and rice are his emotional support foods.",
    ],
    punchline: "Padhai ki thi yaar, examiner ne galat check kiya hoga.",
    photo: shivendraImg,
  },
];
