import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, CheckCircle2, ChevronLeft, Languages, Send, Shield } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge, Card } from "@/components/portal/PortalShell";

export const Route = createFileRoute("/teacher/assignment-review")({ component: AssignmentReview });

type Status = "approve" | "review" | "flagged";

interface Submission {
  id: string;
  name: string;
  roll: string;
  score: number;
  status: Status;
  flag?: string;
  rubric: { criterion: string; max: number; got: number; note: string }[];
  aiComment: string;
}

const NAMES = [
  "Ananya Singh","Rohan Verma","Priya Sharma","Aditya Kumar","Sneha Yadav","Karan Patel",
  "Meera Joshi","Vikram Yadav","Rahul Gupta","Pooja Mishra","Nikhil Tiwari","Anjali Devi",
  "Suresh Pal","Kavya Sahu","Manish Singh","Riya Chauhan","Aman Khan","Divya Rai",
  "Harsh Pandey","Neha Saxena","Ravi Maurya","Sakshi Dubey","Akash Shukla","Tanvi Nair",
  "Yash Bansal","Ishita Sharma","Deepak Kumar","Pallavi Tripathi","Mohit Rastogi","Sneha Agarwal",
  "Krishna Gupta","Aarti Tiwari",
];

function buildRubric(score: number) {
  const scale = score / 100;
  return [
    { criterion: "HTML structure & semantics", max: 25, got: Math.round(25 * scale), note: "Uses semantic tags appropriately" },
    { criterion: "CSS styling & responsiveness", max: 25, got: Math.round(25 * scale), note: "Mobile layout works well" },
    { criterion: "Code quality & comments", max: 20, got: Math.round(20 * scale), note: "Mostly clean, add more comments" },
    { criterion: "Functionality & completeness", max: 20, got: Math.round(20 * scale), note: "All required pages present" },
    { criterion: "Creativity & design polish", max: 10, got: Math.round(10 * scale), note: "Nice color choices" },
  ];
}

const SUBMISSIONS: Submission[] = NAMES.map((name, i) => {
  const score = [92, 88, 85, 90, 78, 82, 76, 41, 87, 80, 72, 86, 74, 88, 70, 84, 79, 81, 75, 83, 77, 89, 73, 86, 80, 91, 78, 84, 76, 82, 79, 85][i] ?? 75;
  const status: Status = name === "Vikram Yadav" ? "flagged" : score >= 85 ? "approve" : "review";
  return {
    id: `s${i + 1}`,
    name,
    roll: `2024-IT-${String(i + 1).padStart(2, "0")}`,
    score,
    status,
    flag: name === "Vikram Yadav" ? "89% code match with Rahul Gupta — possible plagiarism" : undefined,
    rubric: buildRubric(score),
    aiComment:
      score >= 85
        ? "Excellent work. Clean code, responsive layout, semantic HTML. Ready to approve."
        : score >= 70
          ? "Good attempt. Review CSS specificity & add ARIA labels for accessibility."
          : "Needs significant rework. CSS broken on mobile, missing form validation.",
  };
});

const STATUS_TONE: Record<Status, "green" | "blue" | "red"> = { approve: "green", review: "blue", flagged: "red" };
const STATUS_LABEL: Record<Status, string> = { approve: "Approve", review: "Review", flagged: "Flagged" };

function AssignmentReview() {
  const [list, setList] = useState(SUBMISSIONS);
  const [openId, setOpenId] = useState<string | null>(null);
  const open = useMemo(() => list.find((s) => s.id === openId) ?? null, [list, openId]);

  const counts = useMemo(
    () => ({
      approve: list.filter((l) => l.status === "approve").length,
      review: list.filter((l) => l.status === "review").length,
      flagged: list.filter((l) => l.status === "flagged").length,
    }),
    [list],
  );

  if (open) {
    return <Detail submission={open} onBack={() => setOpenId(null)} onUpdate={(s) => setList((l) => l.map((x) => (x.id === s.id ? s : x)))} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-rose-600 text-white shadow">
          <Shield className="h-4 w-4" />
        </div>
        <div>
          <div className="text-[15px] font-semibold">AI Assignment Review</div>
          <div className="text-[11px] text-gray-500">
            Web Dev Practical · 32 submissions · AI pre-scored & flagged
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <Stat tone="emerald" label="Auto-approve" value={counts.approve} />
        <Stat tone="blue" label="Needs review" value={counts.review} />
        <Stat tone="rose" label="Flagged" value={counts.flagged} />
      </div>

      <Card>
        <div className="mb-2 flex items-center justify-between">
          <div className="text-[12px] font-medium">Triage list</div>
          <button className="rounded-md bg-gradient-to-r from-emerald-600 to-green-600 px-2.5 py-1 text-[11px] font-semibold text-white hover:from-emerald-700 hover:to-green-700">
            Bulk approve {counts.approve} green
          </button>
        </div>
        <div className="space-y-1">
          {list.map((s) => (
            <button
              key={s.id}
              onClick={() => setOpenId(s.id)}
              className="flex w-full items-center gap-3 rounded-md border border-gray-100 px-2.5 py-2 text-left hover:bg-gray-50"
            >
              <div
                className={`h-8 w-8 shrink-0 rounded-full text-[11px] font-semibold leading-8 text-center text-white ${
                  s.status === "approve" ? "bg-emerald-500" : s.status === "review" ? "bg-blue-500" : "bg-rose-500"
                }`}
              >
                {s.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 text-[13px] font-medium">
                  {s.name}
                  {s.flag && <AlertTriangle className="h-3.5 w-3.5 text-rose-500" />}
                </div>
                <div className="truncate text-[11px] text-gray-500">{s.roll} · {s.aiComment}</div>
              </div>
              <div className="text-right">
                <div className={`text-[15px] font-semibold ${s.score >= 85 ? "text-emerald-600" : s.score >= 70 ? "text-blue-600" : "text-rose-600"}`}>
                  {s.score}
                </div>
                <Badge tone={STATUS_TONE[s.status]}>{STATUS_LABEL[s.status]}</Badge>
              </div>
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}

function Stat({ tone, label, value }: { tone: "emerald" | "blue" | "rose"; label: string; value: number }) {
  const map: Record<string, string> = {
    emerald: "border-emerald-200 bg-emerald-50 text-emerald-700",
    blue: "border-blue-200 bg-blue-50 text-blue-700",
    rose: "border-rose-200 bg-rose-50 text-rose-700",
  };
  return (
    <div className={`rounded-lg border p-3 ${map[tone]}`}>
      <div className="text-[10px] font-semibold uppercase">{label}</div>
      <div className="text-[24px] font-semibold leading-tight">{value}</div>
    </div>
  );
}

function Detail({
  submission,
  onBack,
  onUpdate,
}: {
  submission: Submission;
  onBack: () => void;
  onUpdate: (s: Submission) => void;
}) {
  const [override, setOverride] = useState(submission.score);
  const [comment, setComment] = useState("");
  const [hi, setHi] = useState(false);
  const [sent, setSent] = useState(false);

  const total = submission.rubric.reduce((s, r) => s + r.got, 0);
  const send = () => {
    setSent(true);
    onUpdate({ ...submission, score: override, status: override >= 85 ? "approve" : override >= 50 ? "review" : "flagged" });
    setTimeout(onBack, 900);
  };

  return (
    <div className="space-y-3">
      <button onClick={onBack} className="flex items-center gap-1 text-[12px] text-gray-600 hover:text-gray-900">
        <ChevronLeft className="h-3.5 w-3.5" /> Back to triage
      </button>

      <Card>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-[15px] font-semibold">{submission.name}</div>
            <div className="text-[11px] text-gray-500">{submission.roll} · Web Dev Practical</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-gray-500">AI score</div>
            <div className="text-[28px] font-semibold text-blue-600">{submission.score}</div>
          </div>
        </div>

        {submission.flag && (
          <div className="mt-2 flex items-start gap-2 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-[12px] text-rose-800">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <div>
              <div className="font-semibold">Plagiarism alert</div>
              <div>{submission.flag}</div>
            </div>
          </div>
        )}
      </Card>

      <Card>
        <div className="mb-2 text-[12px] font-medium">NSQF rubric breakdown</div>
        <div className="space-y-2">
          {submission.rubric.map((r) => (
            <div key={r.criterion}>
              <div className="flex items-center justify-between text-[12px]">
                <span>{r.criterion}</span>
                <span className="font-medium">{r.got}/{r.max}</span>
              </div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
                  style={{ width: `${(r.got / r.max) * 100}%` }}
                />
              </div>
              <div className="mt-0.5 text-[10px] text-gray-500">{r.note}</div>
            </div>
          ))}
          <div className="mt-1 flex items-center justify-between border-t border-gray-100 pt-2 text-[12px] font-semibold">
            <span>AI total</span><span>{total}/100</span>
          </div>
        </div>
      </Card>

      <Card>
        <div className="mb-2 text-[12px] font-medium">Teacher override & feedback</div>
        <div className="mb-2 flex items-center gap-2">
          <span className="text-[11px] text-gray-500">Final score</span>
          <input
            type="number"
            min={0}
            max={100}
            value={override}
            onChange={(e) => setOverride(parseInt(e.target.value || "0"))}
            className="w-20 rounded border border-gray-200 px-2 py-1 text-[13px]"
          />
          <span className="text-[11px] text-gray-500">/ 100</span>
          {override !== submission.score && <Badge tone="amber">Overridden</Badge>}
        </div>
        <textarea
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={hi ? "छात्र को टिप्पणी लिखें..." : "Write a comment for the student..."}
          className="w-full rounded border border-gray-200 px-2 py-1.5 text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
        <div className="mt-2 flex items-center justify-between">
          <button
            onClick={() => setHi((v) => !v)}
            className="flex items-center gap-1 rounded-md border border-gray-200 px-2 py-1 text-[11px] hover:bg-gray-50"
          >
            <Languages className="h-3 w-3" /> {hi ? "English" : "हिंदी"}
          </button>
          <button
            onClick={send}
            disabled={sent}
            className="flex items-center gap-1 rounded-md bg-gradient-to-r from-emerald-600 to-green-600 px-3 py-1.5 text-[12px] font-semibold text-white hover:from-emerald-700 hover:to-green-700 disabled:opacity-60"
          >
            {sent ? <><CheckCircle2 className="h-3.5 w-3.5" /> Sent</> : <><Send className="h-3.5 w-3.5" /> Send feedback</>}
          </button>
        </div>
      </Card>
    </div>
  );
}
