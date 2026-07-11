import aditiImg from "@/assets/crew/aditi.jpeg";
import amanSinghImg from "@/assets/crew/aman-singh.jpeg";
import amanSaxenaImg from "@/assets/crew/aman-saxena.jpeg";
import pragatiImg from "@/assets/crew/pragati.jpeg";
import madhavSharmaImg from "@/assets/crew/madhav-sharma.jpeg";
import madhavKhandelwalImg from "@/assets/crew/madhav-khandelwal.jpeg";
import racheetImg from "@/assets/crew/racheet.jpeg";
import sarthakImg from "@/assets/crew/sarthak.jpeg";
import shivendraImg from "@/assets/crew/shivendra.jpeg";

import aditiToon from "@/assets/crew/cartoon/aditi.png";
import amanSinghToon from "@/assets/crew/cartoon/aman-singh.png";
import amanSaxenaToon from "@/assets/crew/cartoon/aman-saxena.png";
import pragatiToon from "@/assets/crew/cartoon/pragati.png";
import madhavSharmaToon from "@/assets/crew/cartoon/madhav-sharma.png";
import madhavKhandelwalToon from "@/assets/crew/cartoon/madhav-khandelwal.png";
import racheetToon from "@/assets/crew/cartoon/racheet.png";
import sarthakToon from "@/assets/crew/cartoon/sarthak.png";
import shivendraToon from "@/assets/crew/cartoon/shivendra.png";

export type FavoriteMemory = {
  title: string;
  note: string;
  date?: string;
};

export type CrewMember = {
  slug: string;
  name: string;
  role: string;
  vibe: string;
  details: string[];
  punchline: string;
  photo: string;
  cartoon: string;
  bio: string;
  favoriteMemories: FavoriteMemory[];
  sharedMemories: number;
};

const CARTOONS: Record<string, string> = {
  aditi: aditiToon,
  "aman-singh": amanSinghToon,
  "aman-saxena": amanSaxenaToon,
  pragati: pragatiToon,
  "madhav-sharma": madhavSharmaToon,
  "madhav-khandelwal": madhavKhandelwalToon,
  racheet: racheetToon,
  sarthak: sarthakToon,
  shivendra: shivendraToon,
};

const crewBase: Omit<CrewMember, "cartoon">[] = [
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
    bio: "The calm in every storm — Aditi is the friend who watches the chaos unfold with a small smile and a sharper one-liner. She is the human laugh-track of the group; quiet until she isn't, and then nobody else gets a word in.",
    favoriteMemories: [
      { title: "The chicken platter night", note: "She ordered for six. Ate for nine. Said she was 'just trying it'.", date: "DINNER NIGHT" },
      { title: "Two drinks in", note: "The exact moment her truth serum kicked in and we learned everyone's secrets.", date: "AFTER PARTY" },
      { title: "Rooftop sit-down", note: "Said nothing for an hour. Somehow comforted everyone.", date: "QUIET CORNER" },
    ],
    sharedMemories: 42,
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
    bio: "Aman is the friend who will drop everything for you — right after he finishes his biryani. Loud, loyal, and powered entirely by carbs and curfews he ignores, he is the heart that beats slightly slower because of all the rice.",
    favoriteMemories: [
      { title: "The 3 AM biryani run", note: "Walked 4 km in slippers because the hostel mess closed. Worth it.", date: "LATE NIGHT" },
      { title: "Choti Advance, big mystery", note: "Said the words. Refused to explain. We still don't know.", date: "ROOM 204" },
      { title: "14-hour nap club", note: "Slept through three lectures and one earthquake drill.", date: "AFTERNOON" },
    ],
    sharedMemories: 51,
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
    bio: "Aman knows everyone on campus. Not figuratively — literally. The guard, the canteen aunty, the topper, the dropout. He runs on charm, gossip, and the unwavering belief that every girl he passed today definitely noticed him.",
    favoriteMemories: [
      { title: "The 45-minute ritual", note: "Made us all late for the bus because the shirt 'wasn't sitting right'.", date: "DAY OUT" },
      { title: "The lecture crush #7", note: "Fell in love during attendance. Was over it by lunch.", date: "CAMPUS" },
      { title: "Canteen mayor", note: "Knew everyone by name. Got us free chai for a week.", date: "BRUNCH" },
    ],
    sharedMemories: 48,
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
    bio: "Pragati is the softest soul in the loudest group. Half angel, half buffer screen — she means every kind word she says and absolutely none of the things she does when she's overthinking. Don't be loud near her. She will cry.",
    favoriteMemories: [
      { title: "Kurkure dinner phase", note: "Ate Kurkure as a meal for two weeks straight. Called it 'crunchy soup'.", date: "ROOM 204" },
      { title: "Mummy ka call", note: "Phone rang. She vanished. Reappeared three hours later, slightly damp.", date: "EVENING" },
      { title: "Brain buffering moment", note: "Asked if the sun rises in the south. Then defended the question for ten minutes.", date: "BRUNCH" },
    ],
    sharedMemories: 39,
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
    bio: "Madhav is the friend who said yes to every plan and showed up to none. He studies more than anyone, panics about it twice as much, and somehow ends every chat with the gym, the body, and a sigh.",
    favoriteMemories: [
      { title: "The 18 cancelled plans", note: "Said 'haan bhai pakka' to a movie. Cancelled at the popcorn counter.", date: "AFTERNOON" },
      { title: "Kadhi chawal devotion", note: "Skipped a class to make sure he got the last plate. No regrets.", date: "BRUNCH" },
      { title: "Body nhi bn rhi", note: "Said it 47 times in one week. We started counting on the wall.", date: "ROOM 204" },
    ],
    sharedMemories: 36,
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
    bio: "Madhav K. is the loudest line in every group chat and the longest 'bas 2 minute' you'll ever wait. He owes everyone money, somehow nobody is angry — that's the talent. The negotiation, the volume, the vibes.",
    favoriteMemories: [
      { title: "Bas 2 minute me aaya", note: "Two hours later, he still hadn't left his room. Wore the wrong shirt anyway.", date: "DEPARTURE" },
      { title: "Udhaar ka king", note: "Owed money to five different friends. Treated us with their money. Iconic.", date: "FOOD COURT" },
      { title: "The smooth lie", note: "Convinced the canteen wala chai was on the house. For a month.", date: "BRUNCH" },
    ],
    sharedMemories: 44,
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
    bio: "Racheet talks like he's been waiting his whole life to tell you this one thing — and it's usually about raita, or galaxies, or a girl who never replied. Equal parts deep thinker and dramatic narrator of his own life.",
    favoriteMemories: [
      { title: "Raita spillage tragedy", note: "Dropped his raita and stared at it for five minutes like it was his ex.", date: "DINNER NIGHT" },
      { title: "Conspiracy mode", note: "Explained why the moon is fake while we waited for chai.", date: "EVENING" },
      { title: "Horror film night", note: "Watched the movie through his fingers. Slept with the light on for a week.", date: "ROOM SELFIE" },
    ],
    sharedMemories: 41,
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
    bio: "Sarthak is the quiet brain behind half the plans you thought just 'happened'. Acts indifferent, secretly cares the most. The kind of friend who 'doesn't want to come' and then somehow ends up booking the cab.",
    favoriteMemories: [
      { title: "Threatening to leave (again)", note: "Said he was done with the group chat. Was back in 4 minutes. Without explanation.", date: "ROOM 204" },
      { title: "The silent organiser", note: "Pretended he didn't plan the trip. Had the entire itinerary saved in Notes.", date: "ROAD TRIP" },
      { title: "Caught blushing", note: "Refused to admit she was smiling at him. We have photographic evidence.", date: "CULFEST" },
    ],
    sharedMemories: 53,
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
    bio: "Shivendra runs on rage and rice. He fights, sulks, eats, returns. The Hulk of the group — green with hunger more often than anger. He genuinely studied. The marks just disagree.",
    favoriteMemories: [
      { title: "Cake on the face", note: "Result day revenge. The cake hit. The gussa shaant ho gaya.", date: "RESULT NIGHT" },
      { title: "Padhai ki thi yaar", note: "His official anthem after every semester result. Examiner blamed in 4 languages.", date: "POST RESULT" },
      { title: "Hungry while eating", note: "Ordered a second plate before finishing the first. Said he was 'mentally hungry'.", date: "LATE DINNER" },
    ],
    sharedMemories: 47,
  },
];

export const crew: CrewMember[] = crewBase.map((m) => ({
  ...m,
  cartoon: CARTOONS[m.slug] ?? m.photo,
}));
