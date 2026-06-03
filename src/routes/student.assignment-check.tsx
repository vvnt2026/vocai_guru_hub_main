import { createFileRoute } from "@tanstack/react-router";
import { Camera, CheckCircle2, FileImage, Upload } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/student/assignment-check")({ component: AssignmentCheck });

type State = "upload" | "processing" | "result";

const STEPS = [
  "Assignment scan हो गया",
  "HTML structure पहचाना",
  "NSQF rubric से compare किया",
  "Feedback तैयार है",
];

function AssignmentCheck() {
  const [state, setState] = useState<State>("upload");
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (state !== "processing") return;
    setStep(0);
    const timers: ReturnType<typeof setTimeout>[] = [];
    STEPS.forEach((_, i) => {
      timers.push(setTimeout(() => setStep(i + 1), 600 * (i + 1)));
    });
    timers.push(setTimeout(() => setState("result"), 600 * (STEPS.length + 1)));
    return () => timers.forEach(clearTimeout);
  }, [state]);

  if (state === "upload")
    return (
      <div className="mx-auto max-w-3xl space-y-4">
        <div className="flex items-start gap-2 rounded-lg border border-teal-200 bg-teal-50 p-3">
          <Camera className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />
          <div>
            <div className="text-[13px] font-medium text-teal-900">अपना assignment photo लें या upload करें — AI तुरंत check करेगा</div>
            <div className="text-[11px] text-teal-700">NSQF Level 3 rubric के अनुसार evaluate किया जाएगा</div>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto">
          {["Practical 1: HTML webpage", "Practical 2: CSS styling", "Practical 3: Form design"].map((s, i) => (
            <button
              key={s}
              className={`shrink-0 rounded-full px-3 py-1 text-[12px] ${i === 0 ? "border-2 border-teal-500 bg-teal-50 text-teal-800" : "border border-gray-200 bg-white text-gray-600"}`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[14px] font-medium">Practical Assignment 1 — HTML Webpage</div>
              <div className="text-[11px] text-red-600">Due: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
              <div className="text-[11px] text-gray-500">IT & ITeS — Module 5: HTML & CSS</div>
            </div>
            <span className="rounded bg-teal-100 px-2 py-0.5 text-[10px] font-semibold text-teal-800">NSQF Level 3</span>
          </div>
          <div className="mt-2 text-[12px] text-gray-700">Total marks: <span className="font-semibold">25</span></div>

          <div className="mt-3 rounded-md bg-gray-50 p-2.5">
            <div className="mb-1 text-[11px] font-semibold text-gray-600">Evaluation criteria (NSQF rubric)</div>
            <div className="space-y-1 text-[12px]">
              {[
                ["HTML structure", "8 marks"],
                ["CSS styling", "7 marks"],
                ["Content accuracy", "6 marks"],
                ["Presentation", "4 marks"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between"><span>{k}</span><span className="text-gray-500">{v}</span></div>
              ))}
              <div className="flex justify-between border-t border-gray-200 pt-1 font-semibold"><span>Total</span><span>25 marks</span></div>
            </div>
          </div>
        </div>

        <button
          onClick={() => setState("processing")}
          className="flex w-full flex-col items-center gap-2 rounded-lg border-2 border-dashed border-teal-300 bg-teal-50/40 p-6 transition hover:bg-teal-50"
        >
          <Camera className="h-10 w-10 text-teal-400" />
          <div className="text-[14px] font-medium text-gray-700">Assignment की photo खींचें</div>
          <div className="text-[12px] text-gray-400">या file drag करें — JPG, PNG, PDF</div>
          <div className="mt-2 flex gap-2">
            <span className="rounded-md bg-teal-600 px-3 py-1.5 text-[12px] font-medium text-white">📸 Camera से photo लें</span>
            <span className="rounded-md border border-teal-300 px-3 py-1.5 text-[12px] font-medium text-teal-700">📁 File upload करें</span>
          </div>
        </button>

        <div>
          <div className="mb-1.5 text-[11px] text-gray-500">Sample submissions →</div>
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex h-20 w-20 items-center justify-center rounded-md bg-gray-100 text-gray-400">
                <FileImage className="h-6 w-6" />
              </div>
            ))}
          </div>
          <div className="mt-1 text-[10.5px] text-gray-400">इन जैसी photo लेने से best results मिलते हैं</div>
        </div>
      </div>
    );

  if (state === "processing")
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 rounded-xl bg-gray-50 p-8">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-teal-200 border-t-teal-600" />
        <div className="text-[15px] font-medium">AI आपका assignment check कर रहा है...</div>
        <div className="w-full space-y-1.5">
          {STEPS.map((s, i) => (
            <div key={s} className={`flex items-center gap-2 text-[12.5px] transition ${i < step ? "text-emerald-700" : "text-gray-300"}`}>
              <CheckCircle2 className="h-4 w-4" /> {s} {i < step && "✓"}
            </div>
          ))}
        </div>
      </div>
    );

  // result
  const rubric = [
    { name: "HTML structure", score: 6, max: 8, chip: "अच्छा", chipColor: "bg-emerald-50 text-emerald-700", detail: "Basic tags सही हैं। <div> और <section> का और use करें।" },
    { name: "CSS styling", score: 5, max: 7, chip: "ठीक है", chipColor: "bg-amber-50 text-amber-700", detail: "Colors और fonts अच्छे हैं। Margin और padding improve करें।" },
    { name: "Content accuracy", score: 5, max: 6, chip: "बहुत अच्छा", chipColor: "bg-emerald-50 text-emerald-700", detail: "Content meaningful है। एक और section add करें।" },
    { name: "Presentation", score: 3, max: 4, chip: "अच्छा", chipColor: "bg-emerald-50 text-emerald-700", detail: "Handwriting neat है। Headings underline करें।" },
  ];

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div className="rounded-md bg-emerald-50 px-3 py-2 text-[12.5px] text-emerald-800">
        📈 पिछली बार से 4 marks ज्यादा! (15/25 → 19/25)
      </div>

      <div className="flex items-center justify-between rounded-xl bg-teal-50 p-5">
        <div>
          <div className="text-[11px] text-gray-500">AI Score</div>
          <div className="text-[36px] font-semibold text-teal-800">19 / 25</div>
          <div className="text-[14px] text-teal-700">76% — अच्छा काम! 👍</div>
        </div>
        <div className="relative flex h-20 w-20 items-center justify-center rounded-full border-[6px] border-teal-500 text-[16px] font-semibold text-teal-700">
          76%
        </div>
      </div>

      <div className="space-y-2">
        {rubric.map((r) => (
          <div key={r.name} className="rounded-lg border border-gray-100 bg-white p-3">
            <div className="flex items-center justify-between">
              <div className="text-[13px] font-medium">{r.name}</div>
              <div className="flex items-center gap-2">
                <span className="text-[12.5px] font-semibold text-gray-700">{r.score}/{r.max}</span>
                <span className={`rounded px-1.5 py-0.5 text-[10.5px] font-medium ${r.chipColor}`}>{r.chip}</span>
              </div>
            </div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-gray-100">
              <div className="h-full bg-teal-500" style={{ width: `${(r.score / r.max) * 100}%` }} />
            </div>
            <div className="mt-1.5 text-[11.5px] text-gray-600">{r.detail}</div>
          </div>
        ))}
      </div>

      <div className="rounded-lg border-l-[3px] border-teal-500 bg-white p-4 shadow-sm">
        <div className="mb-1.5 text-[13px] font-medium text-teal-800">AI का विस्तृत feedback</div>
        <p className="whitespace-pre-line text-[12.5px] leading-relaxed text-gray-700">
{`प्रिया, आपने बहुत अच्छा काम किया है!

क्या अच्छा था:
→ HTML की basic structure बिल्कुल सही है — <html>, <head>, <body> tags properly used हैं
→ Heading tags (h1, h2) और paragraph <p> tags सही use किए हैं
→ Content meaningful और topic-related है

क्या improve करना है:
→ CSS में 'margin' और 'padding' का proper use सीखें
→ एक navigation menu add करें (<nav> tag use करें)
→ Images के लिए alt text जरूर लिखें — accessibility के लिए जरूरी है

अगले assignment के लिए tip:
Module 6 में CSS Flexbox सीखें — इससे आपका layout बहुत professional दिखेगा।

Overall: आप Level 2 से Level 3 की तरफ बढ़ रही हैं। Keep it up! 🌟`}
        </p>
      </div>

      <div className="rounded-lg bg-gray-50 p-3">
        <div className="mb-1 text-[12.5px] font-medium">Teacher को submit करें</div>
        <div className="mb-2 text-[11.5px] text-gray-600">Rajesh Kumar Sir को यह evaluation भेजें?</div>
        <button className="w-full rounded-md bg-teal-600 px-3 py-2 text-[12.5px] font-semibold text-white hover:bg-teal-700">
          Submit to teacher
        </button>
        <div className="mt-1 text-[10.5px] text-gray-400">Teacher को automatically notification मिलेगी</div>
      </div>

      <button
        onClick={() => setState("upload")}
        className="flex w-full items-center justify-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-[12.5px] font-medium hover:bg-gray-50"
      >
        <Upload className="h-4 w-4" /> दूसरा assignment upload करें
      </button>
    </div>
  );
}
