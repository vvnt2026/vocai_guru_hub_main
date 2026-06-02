import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, ClipboardCheck, Languages, Loader2, Sparkles, Wand2 } from "lucide-react";
import { useState } from "react";
import { Badge, Card } from "@/components/portal/PortalShell";

export const Route = createFileRoute("/teacher/assessment-creator")({ component: AssessmentCreator });

const MODULES = [
  "Module 1 — Introduction to IT",
  "Module 2 — Computer Fundamentals",
  "Module 7 — HTML Basics",
  "Module 8 — CSS & Responsive Design",
  "Module 9 — JavaScript Fundamentals",
];

interface MCQ {
  q: string;
  qHi: string;
  opts: string[];
  optsHi: string[];
  correct: number;
  marks: number;
  difficulty: "easy" | "medium" | "hard";
  explanation: string;
}

const BANK_HTML: MCQ[] = [
  { q: "Which tag is used for the largest heading in HTML?", qHi: "HTML में सबसे बड़े शीर्षक के लिए कौन-सा टैग है?", opts: ["<h1>","<heading>","<head>","<h6>"], optsHi: ["<h1>","<heading>","<head>","<h6>"], correct:0, marks:1, difficulty:"easy", explanation:"<h1> is the largest; <h6> is the smallest heading." },
  { q: "Which attribute provides alternative text for an image?", qHi: "छवि के लिए वैकल्पिक पाठ कौन-सा एट्रिब्यूट देता है?", opts: ["title","alt","src","desc"], optsHi: ["title","alt","src","desc"], correct:1, marks:1, difficulty:"easy", explanation:"`alt` is required for accessibility and SEO." },
  { q: "Which CSS selector has the highest specificity?", qHi: "किस CSS सिलेक्टर की विशिष्टता सबसे अधिक है?", opts: [".btn",".btn.primary","#submit","button"], optsHi: [".btn",".btn.primary","#submit","button"], correct:2, marks:2, difficulty:"hard", explanation:"ID selectors (#submit) outrank class and element selectors. Specificity: 100 vs 20 vs 1." },
  { q: "What does the `<a>` tag's `href` attribute specify?", qHi: "`<a>` टैग में `href` क्या निर्दिष्ट करता है?", opts: ["Image source","Link destination","Form action","Anchor name"], optsHi: ["चित्र स्रोत","लिंक गंतव्य","फॉर्म क्रिया","एंकर नाम"], correct:1, marks:1, difficulty:"easy", explanation:"`href` holds the target URL of the hyperlink." },
  { q: "Which CSS property creates space inside the border?", qHi: "बॉर्डर के अंदर खाली स्थान कौन-सा गुण बनाता है?", opts: ["margin","padding","gap","spacing"], optsHi: ["margin","padding","gap","spacing"], correct:1, marks:1, difficulty:"medium", explanation:"`padding` is inside the border; `margin` is outside." },
  { q: "Which display value enables flexbox layout?", qHi: "Flexbox लेआउट के लिए कौन-सा display मान है?", opts: ["block","grid","flex","inline"], optsHi: ["block","grid","flex","inline"], correct:2, marks:1, difficulty:"medium", explanation:"`display: flex` turns the element into a flex container." },
  { q: "Which HTML element is semantic for the main content?", qHi: "मुख्य सामग्री के लिए कौन-सा HTML तत्व सेमांटिक है?", opts: ["<div>","<section>","<main>","<body>"], optsHi: ["<div>","<section>","<main>","<body>"], correct:2, marks:2, difficulty:"medium", explanation:"`<main>` represents the dominant content of the document body." },
  { q: "Which unit is relative to the root font size in CSS?", qHi: "CSS में रूट फॉन्ट साइज़ के सापेक्ष कौन-सी इकाई है?", opts: ["px","em","rem","%"], optsHi: ["px","em","rem","%"], correct:2, marks:2, difficulty:"hard", explanation:"`rem` = root em; always relative to the root <html> font-size." },
];

function AssessmentCreator() {
  const [module, setModule] = useState(MODULES[2]);
  const [count, setCount] = useState(20);
  const [easy, setEasy] = useState(30);
  const [med, setMed] = useState(50);
  const [hard, setHard] = useState(20);
  const [hindi, setHindi] = useState(true);
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<MCQ[] | null>(null);
  const [showHi, setShowHi] = useState(false);

  const generate = (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setQuestions(null);
    setTimeout(() => {
      // expand bank by repeating to reach `count`
      const out: MCQ[] = [];
      let i = 0;
      while (out.length < count) {
        out.push(BANK_HTML[i % BANK_HTML.length]);
        i++;
      }
      setQuestions(out.slice(0, count));
      setLoading(false);
    }, 1600);
  };

  const total = questions?.reduce((s, q) => s + q.marks, 0) ?? 0;

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-teal-500 to-cyan-600 text-white shadow">
          <ClipboardCheck className="h-4 w-4" />
        </div>
        <div>
          <div className="text-[15px] font-semibold">AI Assessment Creator</div>
          <div className="text-[11px] text-gray-500">NSQF MCQs with answer keys, marking & Hindi translation</div>
        </div>
      </div>

      <form onSubmit={generate} className="space-y-3 rounded-xl border border-gray-200 bg-white p-4">
        <div className="grid gap-3 md:grid-cols-2">
          <Field label="Module">
            <select value={module} onChange={(e) => setModule(e.target.value)} className="ac-input">
              {MODULES.map((m) => <option key={m}>{m}</option>)}
            </select>
          </Field>
          <Field label="Number of questions">
            <input
              type="number"
              min={5}
              max={50}
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value || "20"))}
              className="ac-input"
            />
          </Field>
        </div>
        <div>
          <div className="mb-1 text-[11px] text-gray-500">Difficulty mix (must total 100%)</div>
          <div className="grid grid-cols-3 gap-2">
            <Mix label="Easy" color="emerald" value={easy} setValue={setEasy} />
            <Mix label="Medium" color="amber" value={med} setValue={setMed} />
            <Mix label="Hard" color="rose" value={hard} setValue={setHard} />
          </div>
          <div className={`mt-1 text-[10px] ${easy + med + hard === 100 ? "text-emerald-600" : "text-red-500"}`}>
            Total: {easy + med + hard}%
          </div>
        </div>
        <label className="flex items-center gap-2 text-[12px]">
          <input type="checkbox" checked={hindi} onChange={(e) => setHindi(e.target.checked)} />
          Include Hindi translation for every question
        </label>
        <button
          type="submit"
          disabled={loading || easy + med + hard !== 100}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-gradient-to-r from-teal-600 to-cyan-600 py-2 text-[13px] font-semibold text-white shadow hover:from-teal-700 hover:to-cyan-700 disabled:opacity-60"
        >
          {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Generating {count} NSQF questions...</> : <><Wand2 className="h-4 w-4" /> Generate assessment</>}
        </button>
      </form>

      {questions && (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-teal-200 bg-teal-50 px-3 py-2">
            <div className="text-[12px] text-teal-800">
              <span className="font-semibold">{questions.length} questions</span> · Total marks: <span className="font-semibold">{total}</span> · Time: ~{Math.round(questions.length * 1.5)} min
            </div>
            <div className="flex gap-1.5">
              {hindi && (
                <button
                  onClick={() => setShowHi((v) => !v)}
                  className="flex items-center gap-1 rounded-md border border-teal-300 bg-white px-2 py-1 text-[11px] font-medium text-teal-700 hover:bg-teal-100"
                >
                  <Languages className="h-3 w-3" /> {showHi ? "Show English" : "हिंदी देखें"}
                </button>
              )}
              <button className="rounded-md bg-gradient-to-r from-emerald-600 to-green-600 px-2.5 py-1 text-[11px] font-semibold text-white hover:from-emerald-700 hover:to-green-700">
                Publish to students
              </button>
            </div>
          </div>

          {questions.map((q, i) => (
            <Card key={i}>
              <div className="flex items-start justify-between gap-2">
                <div className="text-[13px] font-medium">
                  Q{i + 1}. {showHi ? q.qHi : q.q}
                </div>
                <div className="flex shrink-0 gap-1">
                  <Badge tone={q.difficulty === "easy" ? "green" : q.difficulty === "medium" ? "amber" : "red"}>
                    {q.difficulty}
                  </Badge>
                  <Badge tone="blue">{q.marks}m</Badge>
                </div>
              </div>
              <div className="mt-2 grid gap-1.5 sm:grid-cols-2">
                {(showHi ? q.optsHi : q.opts).map((o, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center gap-2 rounded-md border px-2 py-1.5 text-[12px] ${
                      idx === q.correct ? "border-emerald-300 bg-emerald-50 text-emerald-900" : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <span className="flex h-4 w-4 items-center justify-center rounded bg-white text-[10px] font-semibold">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="flex-1">{o}</span>
                    {idx === q.correct && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />}
                  </div>
                ))}
              </div>
              <div className="mt-2 rounded bg-blue-50 px-2.5 py-1.5 text-[11px] text-blue-800">
                <span className="font-semibold">Explanation:</span> {q.explanation}
              </div>
            </Card>
          ))}
        </div>
      )}

      <style>{`
        .ac-input { width:100%; border:1px solid #E5E7EB; border-radius:6px; padding:6px 10px; font-size:12px; background:white; }
        .ac-input:focus { outline:none; box-shadow:0 0 0 2px #99F6E4; }
      `}</style>
    </div>
  );
}

function Mix({ label, color, value, setValue }: { label: string; color: string; value: number; setValue: (v: number) => void }) {
  return (
    <div className={`rounded-md border border-${color}-200 bg-${color}-50 p-2`}>
      <div className={`text-[10px] font-semibold text-${color}-700`}>{label}</div>
      <div className="flex items-center gap-1">
        <input
          type="number"
          min={0}
          max={100}
          value={value}
          onChange={(e) => setValue(parseInt(e.target.value || "0"))}
          className="w-12 rounded border border-gray-200 bg-white px-1 py-0.5 text-[12px]"
        />
        <span className="text-[11px] text-gray-500">%</span>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1 text-[11px] text-gray-500">{label}</div>
      {children}
    </div>
  );
}
