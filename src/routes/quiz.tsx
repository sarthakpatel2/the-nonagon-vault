import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/quiz")({
  head: () => ({
    meta: [
      { title: "How Well Do You Know The Nonagon? — Quiz" },
      { name: "description", content: "A trivia quiz about the nine. Every answer comes with a memory you forgot you missed." },
      { property: "og:title", content: "How Well Do You Know The Nonagon?" },
      { property: "og:description", content: "Trivia + emotional reveals. Tissues optional." },
    ],
  }),
  component: QuizPage,
});

type Question = {
  q: string;
  options: string[];   // correct answer is always options[0] — we shuffle at runtime
  reveal: string;      // emotional payoff shown after answering
};

// NOTE: options[0] is ALWAYS the correct answer. We shuffle options + question order per session.
const POOL: Question[] = [
  {
    q: "Who actually runs this group even though he pretends he doesn't?",
    options: ["Sarthak", "Madhav Khandelwal", "Aditi", "Aman Singh"],
    reveal: "Sarthak. The quiet captain. Threatens to leave the group every other week, then quietly plans the next trip. The glue we don't thank enough.",
  },
  {
    q: "Whose voice can be heard from the next hostel block?",
    options: ["Madhav Khandelwal", "Madhav Sharma", "Shivendra", "Racheet"],
    reveal: "Madhav Khandelwal. The original broadcast system. If he laughed in the canteen, the library knew. We'll miss that volume in every quiet room.",
  },
  {
    q: "Who's always late but somehow loves train journeys the most?",
    options: ["Aman Saxena", "Sarthak", "Madhav Sharma", "Aman Singh"],
    reveal: "Aman Saxena. Misses every deadline, never misses a train window seat. He'd talk to strangers like old friends by the time we reached the next station.",
  },
  {
    q: "Pick the official sutta circle of the Nonagon.",
    options: [
      "Sarthak, Aman Singh, Aman Saxena, Madhav Khandelwal & Shivendra",
      "Aditi, Pragati & Racheet",
      "Madhav Sharma & Racheet",
      "Just Sarthak, alone, dramatically",
    ],
    reveal: "The five. Behind the canteen, after every class, with that one specific lighter that kept getting lost. Tapri uncle knew the order by heart.",
  },
  {
    q: "Who is the undisputed chai person of the group?",
    options: ["Aditi", "Pragati", "Madhav Sharma", "Racheet"],
    reveal: "Aditi. Chai over everything. Chai before drama, chai during drama, chai to fix the drama. The therapist with a kulhad in her hand.",
  },
  {
    q: "Whose stomach is the actual ninth member of the Nonagon?",
    options: ["Aman Singh", "Shivendra", "Aman Saxena", "Pragati"],
    reveal: "Aman Singh. The biryani mercenary. We've watched him finish a full plate while crying about his life — and somehow that became our favourite memory.",
  },
  {
    q: "Who would calmly solve everyone's drama while staying completely out of it?",
    options: ["Aditi", "Pragati", "Madhav Khandelwal", "Sarthak"],
    reveal: "Aditi. The therapist we never paid. Listened without judging, dropped one sentence that fixed everything. Thank you — we don't say it enough.",
  },
  {
    q: "Who is the official keeper of every single group photo?",
    options: ["Pragati", "Aditi", "Madhav Sharma", "Racheet"],
    reveal: "Pragati. Without her camera roll, this entire website wouldn't exist. She remembered the moments while we were too busy living them.",
  },
  {
    q: "Who studies the most before exams and still scores the least?",
    options: ["Shivendra", "Madhav Sharma", "Racheet", "Aman Singh"],
    reveal: "Shivendra. The Hulk with a GPA. Reads the textbook cover to cover, swears the examiner checked it wrong. We believe him every single time.",
  },
  {
    q: "Who cancels plans with the consistency of a Japanese train schedule?",
    options: ["Madhav Sharma", "Aditi", "Aman Saxena", "Pragati"],
    reveal: "Madhav Sharma. 'Bhai body nhi bn rhi hai' = plan cancelled. We still invited him every time. That's love.",
  },
  {
    q: "Who's the baniya who'll definitely pay you back… kal?",
    options: ["Madhav Khandelwal", "Aman Saxena", "Racheet", "Sarthak"],
    reveal: "Madhav Khandelwal. 'Bhai paise kal de dunga, pakka.' That kal is now in its fourth year. We'll collect it at the reunion. Probably.",
  },
  {
    q: "Who randomly switches topics mid-sentence while eating raita?",
    options: ["Racheet", "Aman Saxena", "Madhav Sharma", "Aditi"],
    reveal: "Racheet. Started talking about gravity. Ended talking about his ex. Raita was involved. Somehow it all made sense at 2 AM.",
  },
  {
    q: "Whose mummy's phone call can freeze the entire group instantly?",
    options: ["Pragati", "Aditi", "Madhav Sharma", "Aman Singh"],
    reveal: "Pragati. Phone rings, room goes silent. She becomes a different person for 90 seconds. We've all witnessed it. We've all respected it.",
  },
  {
    q: "Who falls in love at least twice a semester?",
    options: ["Aman Saxena", "Racheet", "Madhav Khandelwal", "Sarthak"],
    reveal: "Aman Saxena. 'Bhai usne mujhe dekha tha, I swear.' She didn't. But his hope is the most consistent thing in this group.",
  },
  {
    q: "Who would say 'aaj nhi yaar' and show up anyway?",
    options: ["All nine of them", "Just Sarthak", "Just Aditi", "Nobody, ever"],
    reveal: "All of them. Every single one. Because that's what this group is — nine people who complain about plans and then show up first. That's love in its rawest form.",
  },
  {
    q: "What's the one thing the Nonagon will never run out of?",
    options: ["Each other", "Plans", "Chai", "Excuses"],
    reveal: "Each other. Distances will stretch. Schedules will clash. Some weeks you won't text. But nine becomes nine again the second one of you says 'guys.' Always.",
  },
  {
    q: "Who's the human alarm clock that wakes everyone up before exams?",
    options: ["Shivendra", "Sarthak", "Aditi", "Pragati"],
    reveal: "Shivendra. 4 AM calls, voice notes, threats. Half the group passed because he refused to sleep alone with anxiety.",
  },
  {
    q: "Whose hostel room secretly became everyone's second home?",
    options: ["Sarthak", "Madhav Khandelwal", "Aman Singh", "Racheet"],
    reveal: "Sarthak. Door never locked, fan always on, charger always missing. That room held more therapy sessions than any office ever will.",
  },
  {
    q: "Who'd start a fight in the group chat and then go offline for 12 hours?",
    options: ["Madhav Sharma", "Racheet", "Aman Saxena", "Madhav Khandelwal"],
    reveal: "Madhav Sharma. Drops one savage line. Vanishes. Returns next morning like nothing happened. Classic.",
  },
  {
    q: "Whose laugh has been certified as the official soundtrack of the Nonagon?",
    options: ["Madhav Khandelwal", "Pragati", "Aman Singh", "Racheet"],
    reveal: "Madhav Khandelwal. That laugh. Echoing through hostel corridors, photo backgrounds, every voice note. You can hear it just reading this.",
  },
  {
    q: "Who would 100% miss the train but make it the funniest story of the trip?",
    options: ["Aman Saxena", "Madhav Sharma", "Racheet", "Aman Singh"],
    reveal: "Aman Saxena. Misses the train, books another, somehow reaches before us. The chaos is the plot. The plot is the memory.",
  },
  {
    q: "Whose 'one chai' actually means a 90-minute tapri session?",
    options: ["Aditi", "Sarthak", "Madhav Khandelwal", "Shivendra"],
    reveal: "Aditi. 'Bas ek chai' is a lie we agreed to believe. Two cups in, the whole group's life had been decoded.",
  },
  {
    q: "Who is the unofficial photographer of every trip?",
    options: ["Pragati", "Racheet", "Aditi", "Sarthak"],
    reveal: "Pragati. Half-eaten, mid-laugh, eyes-closed candids — those are the ones we'll cry over in ten years. Thank you for pressing the button.",
  },
  {
    q: "Who's the philosopher at 2 AM and the menace at 2 PM?",
    options: ["Racheet", "Madhav Sharma", "Aman Singh", "Shivendra"],
    reveal: "Racheet. By night: 'bro what even is reality.' By day: stealing your fries. Both are equally real. Both are equally loved.",
  },
  {
    q: "Who quietly remembers everyone's birthdays without making a big deal of it?",
    options: ["Aditi", "Pragati", "Sarthak", "Shivendra"],
    reveal: "Aditi. First message at 12:00:01 AM. Every year. No reminder needed. That's a kind of love nobody talks about.",
  },
  {
    q: "Who would absolutely thrive if the Nonagon opened a tapri together?",
    options: ["All nine, obviously", "Just Aditi and Madhav K.", "Sarthak and Shivendra", "Aman Singh, alone, eating the stock"],
    reveal: "All nine. Aditi runs chai. Pragati handles socials. Sarthak manages money. Madhav K. yells the menu. Aman Singh eats the profits. Open soon, hopefully.",
  },
  {
    q: "Whose 'I'm coming in 5 minutes' is a full 45-minute commitment?",
    options: ["Aman Saxena", "Madhav Sharma", "Racheet", "Pragati"],
    reveal: "Aman Saxena. The man bends time. We've stopped asking. We've started planning around it.",
  },
  {
    q: "Who actually paid for everyone at least once and never asked for it back?",
    options: ["Sarthak", "Aditi", "Shivendra", "Pragati"],
    reveal: "Sarthak. Quietly. Multiple times. Never mentioned it. We noticed. We always notice.",
  },
];

const QUIZ_SIZE = 10;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type RuntimeQuestion = {
  q: string;
  options: string[];
  answer: number;
  reveal: string;
};

function buildQuiz(): RuntimeQuestion[] {
  return shuffle(POOL)
    .slice(0, QUIZ_SIZE)
    .map((item) => {
      const correct = item.options[0];
      const shuffled = shuffle(item.options);
      return {
        q: item.q,
        options: shuffled,
        answer: shuffled.indexOf(correct),
        reveal: item.reveal,
      };
    });
}

function QuizPage() {
  const [quiz, setQuiz] = useState<RuntimeQuestion[]>([]);
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  // Build on mount (client-only so SSR + client match cleanly)
  useEffect(() => {
    setQuiz(buildQuiz());
  }, []);

  const total = quiz.length || QUIZ_SIZE;
  const q = quiz[i];
  const progress = useMemo(
    () => ((i + (picked !== null ? 1 : 0)) / total) * 100,
    [i, picked, total],
  );

  const pick = (idx: number) => {
    if (picked !== null || !q) return;
    setPicked(idx);
    if (idx === q.answer) setScore((s) => s + 1);
  };

  const next = () => {
    if (i + 1 >= quiz.length) {
      setDone(true);
    } else {
      setI(i + 1);
      setPicked(null);
    }
  };

  const restart = () => {
    setQuiz(buildQuiz());
    setI(0);
    setPicked(null);
    setScore(0);
    setDone(false);
  };

  const verdict = (() => {
    const pct = score / total;
    if (pct === 1) return { title: "Honorary Tenth Member", line: "You know them like you lived it. Maybe you did." };
    if (pct >= 0.7) return { title: "Inner Circle Confirmed", line: "You've earned a spot at the back bench. Welcome." };
    if (pct >= 0.4) return { title: "Tapri Acquaintance", line: "You've seen the chaos from a respectful distance. Come closer." };
    return { title: "New Here?", line: "Don't worry. They'll adopt you by Tuesday." };
  })();

  return (
    <div className="min-h-screen flex flex-col">
      <SiteNav />
      <main className="flex-1 px-6 md:px-10 py-12 md:py-16 max-w-2xl mx-auto w-full">
        <header className="mb-8 text-center">
          <p className="font-mono text-xs text-brand uppercase tracking-widest mb-3">// the_nonagon_quiz.exe</p>
          <h1 className="text-4xl md:text-5xl font-serif italic text-charcoal mb-3">How well do you know us?</h1>
          <p className="text-charcoal/70 text-sm">Ten questions, shuffled fresh every time. Tissues optional.</p>
        </header>

        {!q && !done ? (
          <div className="text-center font-mono text-xs text-charcoal/50 py-20">// shuffling memories…</div>
        ) : !done && q ? (
          <>
            {/* Progress bar */}
            <div className="mb-6">
              <div className="flex justify-between text-xs font-mono text-charcoal/60 mb-2">
                <span>Q{i + 1} / {total}</span>
                <span>Score: {score}</span>
              </div>
              <div className="h-1.5 bg-charcoal/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Question card */}
            <div
              key={i}
              className="bg-paper/80 backdrop-blur-sm border border-charcoal/10 rounded-2xl p-6 md:p-8 shadow-sm animate-fade-in"
            >
              <h2 className="font-serif text-2xl md:text-3xl text-charcoal mb-6 leading-snug">
                {q.q}
              </h2>

              <div className="space-y-3">
                {q.options.map((opt, idx) => {
                  const isCorrect = idx === q.answer;
                  const isPicked = picked === idx;
                  const revealed = picked !== null;
                  const state = !revealed
                    ? "border-charcoal/15 hover:border-brand hover:bg-brand/5"
                    : isCorrect
                      ? "border-emerald-500/60 bg-emerald-500/10 text-charcoal"
                      : isPicked
                        ? "border-rose-400/60 bg-rose-400/10 text-charcoal/70"
                        : "border-charcoal/10 text-charcoal/40";
                  return (
                    <button
                      key={opt}
                      onClick={() => pick(idx)}
                      disabled={revealed}
                      className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all duration-300 flex items-center gap-3 ${state} ${revealed ? "cursor-default" : "cursor-pointer"}`}
                    >
                      <span className="font-mono text-xs text-charcoal/40 w-5">{String.fromCharCode(65 + idx)}</span>
                      <span className="flex-1">{opt}</span>
                      {revealed && isCorrect && <span className="text-lg">✓</span>}
                      {revealed && isPicked && !isCorrect && <span className="text-lg">✗</span>}
                    </button>
                  );
                })}
              </div>

              {/* Emotional reveal */}
              {picked !== null && (
                <div className="mt-6 pt-6 border-t border-dashed border-charcoal/15 animate-fade-in">
                  <p className="font-mono text-[10px] text-brand uppercase tracking-widest mb-2">
                    // the_real_answer
                  </p>
                  <p className="font-serif italic text-charcoal/85 text-lg leading-relaxed">
                    {q.reveal}
                  </p>
                  <button
                    onClick={next}
                    className="mt-6 inline-flex items-center gap-2 bg-charcoal text-paper px-5 py-2.5 rounded-full text-sm font-medium hover:bg-brand transition-colors group"
                  >
                    {i + 1 >= quiz.length ? "See the verdict" : "Next question"}
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="bg-paper/80 backdrop-blur-sm border border-charcoal/10 rounded-2xl p-8 md:p-10 text-center animate-fade-in">
            <p className="font-mono text-xs text-brand uppercase tracking-widest mb-4">// final_verdict</p>
            <div className="font-serif text-6xl md:text-7xl text-brand mb-3 tabular-nums">
              {score}<span className="text-charcoal/30 text-4xl">/{total}</span>
            </div>
            <h2 className="font-serif italic text-3xl md:text-4xl text-charcoal mb-3">{verdict.title}</h2>
            <p className="text-charcoal/70 max-w-md mx-auto mb-8">{verdict.line}</p>
            <p className="font-serif italic text-charcoal/60 text-sm max-w-md mx-auto mb-8">
              "The score doesn't matter. The fact that you cared enough to play does."
            </p>
            <button
              onClick={restart}
              className="bg-charcoal text-paper px-6 py-3 rounded-full text-sm font-medium hover:bg-brand transition-colors"
            >
              Take it again
            </button>
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
