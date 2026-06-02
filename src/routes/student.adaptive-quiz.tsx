import { createFileRoute } from "@tanstack/react-router";
import { Brain, CheckCircle2, X } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/student/adaptive-quiz")({ component: AdaptiveQuiz });

interface Q {
  level: number;
  q: string;
  options: string[];
  correct: number;
  fbRight: string;
  fbWrong: string;
}

const BANK: Q[] = [
  {
    level: 1,
    q: "HTML stands for?",
    options: ["HyperText Markup Language", "High Tech Modern Language", "Home Tool Markup Language", "Hyperlink Text Mode Language"],
    correct: 0,
    fbRight: "Correct! HTML is the skeleton of every webpage — it defines headings, paragraphs, images, and links.",
    fbWrong: "HTML = HyperText Markup Language. It's the code that builds the structure of every website.",
  },
  {
    level: 2,
    q: "CSS में text का colour बदलने के लिए कौन सी property use होती है?",
    options: ["font-color", "text-color", "color", "foreground"],
    correct: 2,
    fbRight: "Correct! In CSS, 'color' sets the text colour. Example: p { color: red; } makes paragraphs red.",
    fbWrong: "The correct CSS property is just 'color'. Example: h1 { color: blue; } — not 'text-color' or 'font-color'.",
  },
  {
    level: 2,
    q: "What does the <a> tag do in HTML?",
    options: ["Adds an image", "Creates a hyperlink", "Makes text bold", "Adds a table"],
    correct: 1,
    fbRight: "Correct! <a href='url'>Click here</a> creates a clickable link. 'a' stands for anchor.",
    fbWrong: "<a> creates hyperlinks. Example: <a href='google.com'>Go to Google</a>",
  },
  {
    level: 3,
    q: "What is the difference between CSS 'margin' and 'padding'?",
    options: ["They are the same", "Margin is outside the element, padding is inside", "Padding is outside, margin is inside", "Both are inside the element"],
    correct: 1,
    fbRight: "Correct! Margin = space OUTSIDE the element. Padding = space INSIDE (between content and border).",
    fbWrong: "Margin = OUTSIDE (pushes other elements away). Padding = INSIDE (between content and border).",
  },
  {
    level: 4,
    q: "What is the CSS 'box model'?",
    options: ["A 3D model tool", "Content + Padding + Border + Margin", "A JavaScript library", "An HTML5 feature"],
    correct: 1,
    fbRight: "Correct! Every element is a box: Content → Padding → Border → Margin. Fundamental to all CSS layouts.",
    fbWrong: "The CSS box model = Content + Padding + Border + Margin. Setting width: 200px sets only content width.",
  },
];

type State = "intro" | "quiz" | "result";

function AdaptiveQuiz() {
  const [state, setState] = useState<State>("intro");
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState<("right" | "wrong" | null)[]>([null, null, null, null, null]);
  const [picked, setPicked] = useState<number | null>(null);
  const [showFb, setShowFb] = useState(false);

  const current = BANK[qIdx];
  const correctCount = answers.filter((a) => a === "right").length;

  const pick = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    const ok = i === current.correct;
    const nextAnswers = [...answers];
    nextAnswers[qIdx] = ok ? "right" : "wrong";
    setAnswers(nextAnswers);
    setTimeout(() => setShowFb(true), 600);
    setTimeout(() => {
      if (qIdx >= BANK.length - 1) setState("result");
      else {
        setQIdx(qIdx + 1);
        setPicked(null);
        setShowFb(false);
      }
    }, 2400);
  };

  if (state === "intro")
    return (
      <div className="mx-auto max-w-3xl space-y-4">
        <div className="flex gap-2">
          {["HTML & CSS", "JavaScript", "Networking"].map((s, i) => (
            <button
              key={s}
              className={`rounded-full px-3 py-1 text-[12px] font-medium ${i === 0 ? "bg-purple-100 text-purple-800" : "bg-gray-100 text-gray-500"}`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            { label: "Questions answered", val: "47", color: "text-purple-700", sub: "This week" },
            { label: "Current accuracy", val: "74%", color: "text-emerald-600", sub: "Last 10 questions" },
            { label: "Current level", val: "Level 2", color: "text-amber-600", sub: "of 5 levels" },
          ].map((c) => (
            <div key={c.label} className="rounded-lg bg-gray-50 p-3">
              <div className="text-[11px] text-gray-500">{c.label}</div>
              <div className={`text-[22px] font-semibold ${c.color}`}>{c.val}</div>
              <div className="text-[11px] text-gray-400">{c.sub}</div>
            </div>
          ))}
        </div>

        <div className="rounded-lg border border-gray-100 bg-white p-4">
          <div className="mb-3 text-[12px] font-medium">Your current difficulty level — HTML & CSS</div>
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4, 5].map((n, idx) => (
              <div key={n} className="flex flex-1 flex-col items-center">
                <div className="flex w-full items-center">
                  {idx > 0 && <div className={`h-0.5 flex-1 ${n <= 2 ? "bg-purple-300" : "bg-gray-200"}`} />}
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-semibold ${
                      n === 1
                        ? "bg-emerald-500 text-white"
                        : n === 2
                        ? "bg-purple-600 text-white ring-4 ring-purple-200"
                        : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    {n}
                  </div>
                  {idx < 4 && <div className="h-0.5 flex-1 bg-gray-200" />}
                </div>
                <div className="mt-1 text-center text-[9.5px] text-gray-500">
                  {["Basic", "Elementary", "Intermediate", "Advanced", "Expert"][idx]}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg bg-gray-50 p-4">
          <div className="mb-2 text-[13px] font-medium">How adaptive quiz works</div>
          <div className="space-y-1.5 text-[12px]">
            <div className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-3.5 w-3.5 text-emerald-600" /> Answer correctly → AI gives a harder question next</div>
            <div className="flex items-start gap-2"><X className="mt-0.5 h-3.5 w-3.5 text-red-500" /> Answer wrong → AI gives an easier question + explains the concept</div>
            <div className="flex items-start gap-2"><Brain className="mt-0.5 h-3.5 w-3.5 text-purple-600" /> After all questions → AI generates your personalised study plan</div>
          </div>
        </div>

        <button
          onClick={() => setState("quiz")}
          className="w-full rounded-md bg-purple-600 px-4 py-2.5 text-[13px] font-semibold text-white hover:bg-purple-700"
        >
          Start adaptive quiz — HTML & CSS →
        </button>
      </div>
    );

  if (state === "quiz")
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <div className="flex items-center justify-between text-[11px] text-gray-500">
          <span>Question {qIdx + 1} of {BANK.length}</span>
          <div className="flex gap-1">
            {answers.map((a, i) => (
              <span
                key={i}
                className={`h-2 w-2 rounded-full ${
                  i === qIdx ? "bg-purple-600" : a === "right" ? "bg-emerald-500" : a === "wrong" ? "bg-red-500" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
          <span className="rounded bg-purple-100 px-2 py-0.5 font-medium text-purple-800">Level {current.level}</span>
        </div>

        <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
          <div className="h-full bg-purple-500 transition-all" style={{ width: `${((qIdx + 1) / BANK.length) * 100}%` }} />
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-4 text-[15px] font-medium leading-relaxed">{current.q}</div>
          <div className="space-y-2">
            {current.options.map((opt, i) => {
              const isPicked = picked === i;
              const isCorrect = current.correct === i;
              let cls = "border-gray-200 hover:bg-gray-50 bg-white";
              if (picked !== null) {
                if (isCorrect) cls = "border-emerald-400 bg-emerald-50";
                else if (isPicked) cls = "border-red-400 bg-red-50";
              }
              return (
                <button
                  key={i}
                  onClick={() => pick(i)}
                  disabled={picked !== null}
                  className={`flex w-full items-center justify-between rounded-lg border px-3 py-2.5 text-left text-[13px] transition ${cls}`}
                >
                  <span>{opt}</span>
                  {picked !== null && isCorrect && <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
                  {picked !== null && isPicked && !isCorrect && <X className="h-4 w-4 text-red-500" />}
                </button>
              );
            })}
          </div>
        </div>

        {showFb && picked !== null && (
          <div
            className={`rounded-lg border p-3 text-[12.5px] leading-relaxed ${
              picked === current.correct ? "border-emerald-400 bg-emerald-50 text-emerald-900" : "border-amber-400 bg-amber-50 text-amber-900"
            }`}
          >
            {picked === current.correct ? `✅ ${current.fbRight}` : `💡 ${current.fbWrong}`}
          </div>
        )}
      </div>
    );

  // result
  const total = BANK.length;
  const pct = Math.round((correctCount / total) * 100);
  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="flex items-center justify-between rounded-xl bg-purple-50 p-5">
        <div>
          <div className="text-[11px] text-gray-500">Final score</div>
          <div className="text-[36px] font-semibold text-purple-800">{correctCount}/{total}</div>
          <div className="text-[14px] text-emerald-600">{pct}% accuracy</div>
          <div className="mt-1 text-[12px] text-purple-700">Reached Level 3 — Intermediate 📈</div>
        </div>
        <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-purple-500 text-[18px] font-semibold text-purple-700">
          {pct}%
        </div>
      </div>

      <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
        <div className="mb-2 text-[13px] font-medium text-purple-900">AI analysis of your performance</div>
        <p className="text-[12.5px] leading-relaxed text-purple-900/90">
          You're strong on HTML structure but need practice with CSS properties. Recommended focus areas:
          <br /> → CSS selectors and specificity
          <br /> → Box model and layout properties
          <br /> → Practical: build a simple webpage
          <br />
          <br />
          Study time to reach Level 4: approximately 2–3 hours of focused practice.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[
          { when: "Today", task: "Re-watch Module 5: CSS Properties (22 min)", cta: "Start →" },
          { when: "Tomorrow", task: "Practice: Build a simple HTML page", cta: "Open task →" },
          { when: "This week", task: "Complete Module 6: JavaScript Basics", cta: "View module →" },
        ].map((c) => (
          <div key={c.when} className="rounded-lg border border-emerald-100 bg-emerald-50 p-3">
            <div className="text-[11px] font-semibold uppercase text-emerald-700">{c.when}</div>
            <div className="mt-1 text-[12.5px] text-emerald-900">{c.task}</div>
            <button className="mt-2 text-[11.5px] font-medium text-emerald-700 hover:underline">{c.cta}</button>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => {
            setState("intro");
            setQIdx(0);
            setAnswers([null, null, null, null, null]);
            setPicked(null);
            setShowFb(false);
          }}
          className="flex-1 rounded-md border border-gray-200 bg-white px-3 py-2 text-[12.5px] font-medium hover:bg-gray-50"
        >
          Retake quiz
        </button>
        <button className="flex-1 rounded-md bg-gradient-to-r from-emerald-600 to-green-600 px-3 py-2 text-[12.5px] font-semibold text-white hover:from-emerald-700 hover:to-green-700">
          Continue to next module →
        </button>
      </div>
    </div>
  );
}
