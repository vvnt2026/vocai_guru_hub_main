import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, ClipboardList, Trophy, X } from "lucide-react";
import { useState } from "react";
import { Badge, Card } from "@/components/portal/PortalShell";

export const Route = createFileRoute("/student/assessments")({ component: Assessments });

interface Q {
  q: string;
  opts: string[];
  correct: number;
}
const QUIZ: Q[] = [
  { q: "What does HTML stand for?", opts: ["HyperText Markup Language", "High Tech Modern Language", "HyperText Modern Layout", "High Text Markup Language"], correct: 0 },
  { q: "Which tag creates a hyperlink in HTML?", opts: ["<link>", "<a>", "<href>", "<url>"], correct: 1 },
  { q: "What does CSS stand for?", opts: ["Computer Style Sheets", "Creative Style System", "Cascading Style Sheets", "Colorful Style Sheets"], correct: 2 },
  { q: "Which is a JavaScript framework?", opts: ["HTML5", "Python", "React", "MySQL"], correct: 2 },
  { q: "What does IDE stand for?", opts: ["Internal Dev Engine", "Integrated Development Environment", "Internet Data Exchange", "Integrated Debug Editor"], correct: 1 },
];

type View = "list" | "quiz" | "result";

function Assessments() {
  const [view, setView] = useState<View>("list");
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [correct, setCorrect] = useState(0);

  if (view === "list") {
    return (
      <div className="space-y-4">
        <div>
          <div className="mb-2 text-[11px] font-medium text-amber-600">PENDING</div>
          <div className="space-y-2">
            {[
              { t: "IT Fundamentals Quiz — Unit 4", s: "20 questions · 30 min · MCQ", b: "Due today" },
              { t: "Web Development Practical", s: "5 questions · 60 min · Practical", b: "Due tomorrow" },
            ].map((p, i) => (
              <Card key={i}>
                <div className="flex items-center gap-3">
                  <div className="flex h-[38px] w-[38px] items-center justify-center rounded-lg bg-amber-50">
                    <ClipboardList className="h-5 w-5 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-[13px] font-medium">{p.t}</div>
                    <div className="text-[11px] text-gray-500">{p.s}</div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <Badge tone="red">{p.b}</Badge>
                    <button
                      onClick={() => {
                        setView("quiz");
                        setIdx(0);
                        setPicked(null);
                        setCorrect(0);
                      }}
                      className="rounded-md bg-gradient-to-r from-emerald-600 to-green-600 px-3 py-1 text-[11px] font-semibold text-white shadow-sm hover:from-emerald-700 hover:to-green-700"
                    >
                      Start →
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-2 text-[11px] font-medium text-emerald-600">COMPLETED</div>
          <div className="space-y-1.5">
            {[
              { t: "Computer Hardware Test", s: "88%" },
              { t: "Internet Safety Assessment", s: "92%" },
            ].map((c) => (
              <div key={c.t} className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span className="flex-1 text-[12px]">{c.t}</span>
                <span className="text-[16px] font-medium text-emerald-600">{c.s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (view === "result") {
    const pct = Math.round((correct / QUIZ.length) * 100);
    return (
      <div className="flex flex-col items-center py-10">
        <Trophy className="h-[52px] w-[52px] text-amber-500" />
        <div className="mt-3 text-[18px] font-medium">Assessment complete!</div>
        <div className="mt-2 text-[34px] font-semibold text-emerald-600">{pct}%</div>
        <div className="mt-1 text-[13px] text-gray-500">
          You got {correct} of {QUIZ.length} correct. Excellent work!
        </div>
        <button
          onClick={() => setView("list")}
          className="mt-5 rounded-md border border-gray-200 px-4 py-1.5 text-[12px] font-medium hover:bg-gray-50"
        >
          Back to assessments
        </button>
      </div>
    );
  }

  const q = QUIZ[idx];
  const pick = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    const isRight = i === q.correct;
    if (isRight) setCorrect((c) => c + 1);
    setTimeout(() => {
      if (idx === QUIZ.length - 1) setView("result");
      else {
        setIdx(idx + 1);
        setPicked(null);
      }
    }, 1000);
  };

  return (
    <div className="mx-auto max-w-xl space-y-4">
      <div className="flex items-center justify-between text-[11px] text-gray-500">
        <span>Question {idx + 1} of {QUIZ.length}</span>
        <div className="flex gap-1">
          {QUIZ.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 w-1.5 rounded-full ${
                i < idx ? "bg-emerald-500" : i === idx ? "bg-blue-500" : "bg-gray-200"
              }`}
            />
          ))}
        </div>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
        <div className="h-full rounded-full bg-blue-500 transition-all" style={{ width: `${((idx + 1) / QUIZ.length) * 100}%` }} />
      </div>

      <div className="text-[15px] font-medium leading-relaxed">{q.q}</div>

      <div className="space-y-2">
        {q.opts.map((o, i) => {
          const isPicked = picked === i;
          const isCorrect = picked !== null && i === q.correct;
          const isWrong = isPicked && i !== q.correct;
          let cls = "border-gray-200 bg-white hover:bg-gray-50";
          if (isCorrect) cls = "border-emerald-400 bg-emerald-50";
          else if (isWrong) cls = "border-red-400 bg-red-50";
          return (
            <button
              key={i}
              disabled={picked !== null}
              onClick={() => pick(i)}
              className={`flex w-full items-center gap-3 rounded-md border px-3.5 py-2.5 text-left text-[13px] transition-colors ${cls}`}
            >
              <span className="flex h-[22px] w-[22px] items-center justify-center rounded bg-gray-100 text-[11px] font-medium">
                {String.fromCharCode(65 + i)}
              </span>
              <span className="flex-1">{o}</span>
              {isCorrect && <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
              {isWrong && <X className="h-4 w-4 text-red-600" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
