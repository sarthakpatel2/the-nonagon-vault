import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
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
  options: string[];
  answer: number;
  reveal: string; // emotional payoff shown after answering
};

const questions: Question[] = [
  {
    q: "Who is most likely to say 'bhai ek last sutta' at 3 AM?",
    options: ["Aditi", "Racheet", "Sarthak", "Madhav Sharma"],
    answer: 1,
    reveal: "Racheet. Always Racheet. And it was never the last one — that's how we got the best 3 AM conversations of our lives. Tapri uncle still asks about him.",
  },
  {
    q: "Whose stomach is the actual ninth member of the Nonagon?",
    options: ["Aman Saxena", "Shivendra", "Aman Singh", "Pragati"],
    answer: 2,
    reveal: "Aman Singh's stomach has a separate Aadhaar card. We've watched him finish a full biryani plate while crying about his life — and somehow that became our favourite memory.",
  },
  {
    q: "Who would calmly solve everyone's drama while staying completely out of it?",
    options: ["Aditi", "Pragati", "Madhav Khandelwal", "Sarthak"],
    answer: 0,
    reveal: "Aditi. The therapist we never paid. The one who listened without judging, then dropped one sentence that fixed everything. We don't say it enough — thank you.",
  },
  {
    q: "Who is the official keeper of every single group photo?",
    options: ["Pragati", "Shivendra", "Madhav Sharma", "Racheet"],
    answer: 0,
    reveal: "Pragati. Without her camera roll, this entire website wouldn't exist. She remembered the moments while we were too busy living them.",
  },
  {
    q: "Who would 100% miss the train and somehow still make it to the destination first?",
    options: ["Madhav Khandelwal", "Aman Saxena", "Sarthak", "Shivendra"],
    answer: 2,
    reveal: "Sarthak. Universe-bending logistics. He'd miss the train, hitchhike, befriend the driver, and be waiting at the platform with chai for us. Legend.",
  },
  {
    q: "Whose laugh is louder than the lecture hall?",
    options: ["Aman Singh", "Madhav Sharma", "Aditi", "Shivendra"],
    answer: 1,
    reveal: "Madhav Sharma. We heard that laugh through three walls and one closed door. Half the professors learned to pause for it. We'll miss it the most in quiet rooms.",
  },
  {
    q: "Who gave the most proxy attendances in 4 years?",
    options: ["All nine, collectively", "Aman Singh", "Racheet", "Madhav Khandelwal"],
    answer: 0,
    reveal: "All of us. Every. Single. One. We held each other's attendance the way we held each other's secrets — quietly, loyally, and without question.",
  },
  {
    q: "Who is most likely to remember a random Tuesday from second year vividly?",
    options: ["Pragati", "Aditi", "Madhav Khandelwal", "Aman Saxena"],
    answer: 2,
    reveal: "Madhav Khandelwal. The human archive. He remembers what you wore, what you said, what you ordered. Be nice to him — he's holding the receipts of our entire youth.",
  },
  {
    q: "Who would say 'aaj nhi yaar' and show up anyway?",
    options: ["Aman Saxena", "Shivendra", "Aman Singh", "All of them"],
    answer: 3,
    reveal: "All of them. Every single one. Because that's what this group is — nine people who complain about plans and then show up first. That's love in its rawest form.",
  },
  {
    q: "What's the one thing the Nonagon will never run out of?",
    options: ["Plans", "Chai", "Excuses", "Each other"],
    answer: 3,
    reveal: "Each other. Distances will stretch. Schedules will clash. Some weeks you won't text. But nine becomes nine again the second one of you says 'guys.' Always.",
  },
];

function QuizPage() {
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const q = questions[i];
  const progress = useMemo(() => ((i + (picked !== null ? 1 : 0)) / questions.length) * 100, [i, picked]);

  const pick = (idx: number) => {
    if (picked !== null) return;
    setPicked(idx);
    if (idx === q.answer) setScore((s) => s + 1);
  };

  const next = () => {
    if (i + 1 >= questions.length) {
      setDone(true);
    } else {
      setI(i + 1);
      setPicked(null);
    }
  };

  const restart = () => {
    setI(0);
    setPicked(null);
    setScore(0);
    setDone(false);
  };

  const verdict = (() => {
    const pct = score / questions.length;
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
          <p className="text-charcoal/70 text-sm">Ten questions. Tissues optional.</p>
        </header>

        {!done ? (
          <>
            {/* Progress bar */}
            <div className="mb-6">
              <div className="flex justify-between text-xs font-mono text-charcoal/60 mb-2">
                <span>Q{i + 1} / {questions.length}</span>
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
                    {i + 1 >= questions.length ? "See the verdict" : "Next question"}
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
              {score}<span className="text-charcoal/30 text-4xl">/{questions.length}</span>
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
