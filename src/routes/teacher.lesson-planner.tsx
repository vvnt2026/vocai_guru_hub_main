import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { FileText, Loader2, Wand2 } from "lucide-react";
import { useState } from "react";
import { generateLessonPlan } from "@/lib/ai.functions";

export const Route = createFileRoute("/teacher/lesson-planner")({ component: Planner });

const TRADES = ["IT & ITeS", "Healthcare", "Retail Management", "Automotive", "Agriculture"];
const CLASSES = ["Class 9", "Class 10", "Class 11", "Class 12"];
const DURATIONS = ["30 minutes", "45 minutes", "60 minutes", "90 minutes"];

function Planner() {
  const gen = useServerFn(generateLessonPlan);
  const [trade, setTrade] = useState(TRADES[0]);
  const [classLevel, setClassLevel] = useState(CLASSES[2]);
  const [topic, setTopic] = useState("");
  const [duration, setDuration] = useState(DURATIONS[1]);
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await gen({ data: { trade, classLevel, topic: topic.trim(), duration } });
      if (res.error) setError(res.error);
      else setPlan(res.plan);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Wand2 className="h-5 w-5 text-blue-500" />
        <div>
          <div className="text-[14px] font-medium">AI lesson planner</div>
          <div className="text-[11px] text-gray-500">
            Generate NSQF-aligned lesson plans in seconds
          </div>
        </div>
      </div>

      <form onSubmit={submit} className="space-y-3 rounded-xl border border-gray-200 bg-white p-4">
        <div className="grid gap-3 md:grid-cols-2">
          <Field label="Vocational trade">
            <select value={trade} onChange={(e) => setTrade(e.target.value)} className="select">
              {TRADES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Class">
            <select value={classLevel} onChange={(e) => setClassLevel(e.target.value)} className="select">
              {CLASSES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </Field>
        </div>
        <Field label="Lesson topic">
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Introduction to HTML & CSS, Vehicle maintenance basics"
            className="select"
          />
        </Field>
        <div className="max-w-[200px]">
          <Field label="Duration">
            <select value={duration} onChange={(e) => setDuration(e.target.value)} className="select">
              {DURATIONS.map((d) => <option key={d}>{d}</option>)}
            </select>
          </Field>
        </div>
        <button
          type="submit"
          disabled={loading || !topic.trim()}
          className="flex w-full items-center justify-center gap-2 rounded-md border border-gray-200 bg-blue-50 py-2 text-[13px] font-medium text-blue-700 hover:bg-blue-100 disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Generating...
            </>
          ) : (
            "Generate AI lesson plan →"
          )}
        </button>
      </form>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-2 text-[12px] text-red-700">
          {error}
        </div>
      )}

      {plan && (
        <div className="rounded-xl border-2 border-blue-300 bg-blue-50 p-4">
          <div className="mb-3 flex items-start justify-between gap-2">
            <div className="flex items-center gap-1.5 text-[13px] font-medium text-blue-800">
              <FileText className="h-4 w-4" /> Lesson plan — {topic}
            </div>
            <div className="flex gap-1.5">
              <button className="rounded-md border border-gray-200 bg-white px-2.5 py-1 text-[11px] hover:bg-gray-50">Save</button>
              <button onClick={() => window.print()} className="rounded-md border border-gray-200 bg-white px-2.5 py-1 text-[11px] hover:bg-gray-50">Print</button>
            </div>
          </div>
          <pre className="whitespace-pre-wrap font-sans text-[12px] leading-[1.75] text-gray-700">
            {plan}
          </pre>
        </div>
      )}

      <style>{`
        .select { width: 100%; border: 1px solid #E5E7EB; border-radius: 6px; padding: 6px 10px; font-size: 12px; background: white; }
        .select:focus { outline: none; box-shadow: 0 0 0 2px #BFDBFE; }
      `}</style>
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
