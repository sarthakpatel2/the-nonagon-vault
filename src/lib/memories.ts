export type MemoryKind = "photo" | "quote" | "moment";

export type Memory =
  | { kind: "photo"; index: number; caption: string; date: string }
  | { kind: "quote"; text: string; by: string; context: string }
  | { kind: "moment"; title: string; body: string; label: string };

export const curatedQuotes: Memory[] = [
  { kind: "quote", text: "Mai nashe me nhi hu, mujhse koi sawal pucho.", by: "Aditi Singh", context: "The Zen Comedian" },
  { kind: "quote", text: "Bhai bas ek plate biryani aur 2 ghante neend.", by: "Aman Singh", context: "The Biryani Mercenary" },
  { kind: "quote", text: "Bhai usne mujhe dekha tha, I swear.", by: "Aman Saxena", context: "The Serial Crasher" },
  { kind: "quote", text: "Mummy ne phone kiya hai, main ghar jaa rahi hoon.", by: "Pragati Srivastava", context: "The Kurkure Goddess" },
  { kind: "quote", text: "Bhai body nhi bn rhi hai, aur plan bhi nhi ja rha.", by: "Madhav Sharma", context: "The Plan Canceller" },
  { kind: "quote", text: "Bhai paise kal de dunga, pakka.", by: "Madhav Khandelwal", context: "The Baniya Broadcast" },
  { kind: "quote", text: "Bhai raita fenk diya maine toh... zindagi fenk di.", by: "Racheet Saraswat", context: "The Raita Philosopher" },
  { kind: "quote", text: "Bhai sab theek hai, chill. Bas non-veg mile toh bata dio.", by: "Sarthak Patel", context: "The Glue & The Enigma" },
  { kind: "quote", text: "Padhai ki thi yaar, examiner ne galat check kiya hoga.", by: "Shivendra Pandey", context: "The Hulk with a GPA" },
  { kind: "quote", text: "We didn't realise we were making memories. We thought we were just trying to pass Data Structures.", by: "The Backbencher's Manifesto", context: "Home page" },
  { kind: "quote", text: "I love you nine, more than I will ever know how to say out loud.", by: "The Nonagon", context: "The Letter" },
  { kind: "quote", text: "Some people get good college life, some get memories. Hum logon ko dono mil gaye.", by: "Pragati", context: "From Prags" },
  { kind: "quote", text: "Keep pushing to main. Keep failing builds. Keep showing up for each other.", by: "The Nonagon", context: "The Letter" },
  { kind: "quote", text: "The nine idiots who somehow turned a college into a lifetime.", by: "Pragati", context: "From Prags" },
  { kind: "quote", text: "Door khula hai. Aa jaana.", by: "Pragati", context: "From Prags" },
  { kind: "quote", text: "Hum logon ne kuch zyada hi khatarnaak cheezein ki hain saath.", by: "Pragati", context: "From Prags" },
  { kind: "quote", text: "Bhai bas 2 minute me aa rahe.", by: "Everyone", context: "Eternal lie" },
  { kind: "quote", text: "One last Maggi, I swear.", by: "The Marquee", context: "Home page" },
  { kind: "quote", text: "Proxy laga dena.", by: "The Marquee", context: "Home page" },
  { kind: "quote", text: "Sleep is a skill issue.", by: "The Marquee", context: "Home page" },
];

export const curatedMoments: Memory[] = [
  { kind: "moment", title: "fresh_install.exe", body: "New laptops, new ID cards, and the awkward classroom where nobody knew anyone's name. Then one random lecture, someone said cheese — and accidentally, our very first group photo happened.", label: "Year 01 · 2022" },
  { kind: "moment", title: "infinite_recursion()", body: "The hostel became home. DSA became a personality trait. We discovered the 2 AM Maggi stall and the joy of bunking together.", label: "Year 02 · 2023" },
  { kind: "moment", title: "culfest_overdrive.sh", body: "Lights, bass, and that one fest night the entire campus showed up for. We didn't win a hackathon — we showed up for the headliner instead.", label: "Year 03 · 2024" },
  { kind: "moment", title: "graduation_commit", body: "Placements, projects, the slow goodbye disguised as routine. Morning after graduation — eyes half-open, hearts fully wrecked.", label: "Year 04 · 2025" },
  { kind: "moment", title: "The first picture", body: "Section J. Nine people. Not all on the same day. Not even the same story. But somehow the same ending.", label: "From Prags" },
  { kind: "moment", title: "Room 109", body: "109. Two boys. One room. The beginning of everything. Sarthak and Madhav — roommates before they were brothers.", label: "From Prags" },
  { kind: "moment", title: "The Kaveri Run", body: "Maggi, chai, and bad decisions at 2 AM. The Kaveri run that started as hunger and ended as history.", label: "From Prags" },
  { kind: "moment", title: "The Farewell Night", body: "String lights. Slow songs. Hands held. Tears hidden. The night we pretended wasn't the last.", label: "From Prags" },
  { kind: "moment", title: "The Revenge Cake", body: "Shivendra ne padhai ki thi yaar — examiner ne galat check kiya hoga. Revenge: cake on the face.", label: "Gallery" },
  { kind: "moment", title: "The Trunk Cafe", body: "Rooftop, elephant statue, and the whole gang. The cafe that saw more of us than our classrooms.", label: "Gallery" },
];

export const photoMemoryIndices = [
  { index: 0, caption: "The whole crew. One frame, somehow.", date: "ROOFTOP" },
  { index: 2, caption: "Spotlights above, nine of us below.", date: "CONCERT" },
  { index: 5, caption: "Cafe selfie — six smiles, zero regrets.", date: "LATE NIGHT" },
  { index: 15, caption: "Rooftop lineup. Everyone present, accounted for.", date: "DAY OUT" },
  { index: 20, caption: "Three in the crowd. Purple sky above.", date: "FEST NIGHT" },
  { index: 30, caption: "Shivendra ne padhai ki thi yaar — examiner ne galat check kiya hoga. Revenge: cake on the face.", date: "RESULT NIGHT" },
  { index: 34, caption: "Aakrosh tha — bhukha tha. Cake mila, gussa shaant hua.", date: "POST RESULT" },
  { index: 37, caption: "The Trunk cafe. Five-strong, elephant approves.", date: "ROOFTOP CAFE" },
  { index: 47, caption: "Snore-cap. Caught mid-dream, no escape.", date: "HOSTEL NIGHT" },
  { index: 52, caption: "Sister hug. Words not needed.", date: "CAFE CORNER" },
  { index: 56, caption: "Shirt-signing ritual. 'Prayagraj you LES' — NIT forever.", date: "FAREWELL" },
  { index: 66, caption: "Signing off batch 2026 — Btech khtm.", date: "DEPARTURE" },
  { index: 73, caption: "Rooftop cafe, arm around the bhai. Panda tee approved.", date: "5 APR 2026" },
  { index: 76, caption: "Seven-man huddle. Arms tangled, smiles locked in.", date: "5 APR 2026" },
  { index: 11, caption: "Piggyback in the parking lot.", date: "AFTERNOON" },
  { index: 22, caption: "Two boys, one red rabbit.", date: "ROOFTOP CAFE" },
  { index: 49, caption: "Bridal carry, round two. Trunk cafe edition.", date: "15 SEP 2024" },
  { index: 43, caption: "Riverbank stroll. Sun in everyone's eyes.", date: "WINTER WALK" },
];
