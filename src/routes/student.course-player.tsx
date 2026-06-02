import { createFileRoute } from "@tanstack/react-router";
import {
  CheckCircle2,
  Circle,
  Download,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  Subtitles,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/portal/PortalShell";

export const Route = createFileRoute("/student/course-player")({ component: Player });

interface Module {
  t: string;
  d: string;
  seconds: number;
}

const initialModules: (Module & { done: boolean })[] = [
  { t: "Introduction to computers", d: "45 min", seconds: 45, done: true },
  { t: "Operating systems & software", d: "60 min", seconds: 60, done: true },
  { t: "Internet & email basics", d: "50 min", seconds: 50, done: true },
  { t: "MS Office essentials", d: "90 min", seconds: 90, done: true },
  { t: "Introduction to HTML & CSS", d: "75 min", seconds: 75, done: false },
  { t: "JavaScript fundamentals", d: "90 min", seconds: 90, done: false },
  { t: "Database basics", d: "60 min", seconds: 60, done: false },
  { t: "Networking concepts", d: "70 min", seconds: 70, done: false },
];

const AI_ANSWERS: Record<string, string> = {
  "What is the CSS box model?":
    "The CSS box model wraps every element with four layers: content → padding → border → margin. Padding adds space inside the border; margin pushes other elements away from the outside. Use box-sizing: border-box so width/height include padding & border.",
  "Explain flexbox with example":
    "Flexbox arranges items in a row or column. Example: a container with display:flex; justify-content:space-between; align-items:center; will place its children in a row, spread them apart, and vertically center them. Great for navbars and card layouts.",
  "Difference between id and class":
    "An id is unique on a page and styled with #header. A class can repeat and is styled with .btn. Use id for one-of-a-kind anchors (like #top), and classes for reusable styles applied to many elements.",
};

function Player() {
  const [modules, setModules] = useState(initialModules);
  const [active, setActive] = useState(4);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // 0..100
  const [subtitles, setSubtitles] = useState(false);
  const [notes, setNotes] = useState("");
  const [noteSaved, setNoteSaved] = useState(false);
  const [aiQ, setAiQ] = useState<string | null>(null);

  const current = modules[active];

  // load notes per module
  useEffect(() => {
    try {
      const stored = localStorage.getItem(`note:${active}`);
      setNotes(stored ?? "");
    } catch {
      setNotes("");
    }
    setProgress(current.done ? 100 : 0);
    setPlaying(false);
    setAiQ(null);
  }, [active]);

  // playback tick
  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setProgress((p) => {
        const next = Math.min(100, p + 100 / (current.seconds * 2)); // ~30s = full
        if (next >= 100) {
          setPlaying(false);
        }
        return next;
      });
    }, 500);
    return () => clearInterval(id);
  }, [playing, current.seconds]);

  const completedCount = modules.filter((m) => m.done).length;
  const overallPct = Math.round((completedCount / modules.length) * 100);

  const saveNotes = () => {
    try {
      localStorage.setItem(`note:${active}`, notes);
      setNoteSaved(true);
      setTimeout(() => setNoteSaved(false), 1500);
    } catch {
      /* ignore */
    }
  };

  const markComplete = () => {
    setModules((ms) => ms.map((m, i) => (i === active ? { ...m, done: true } : m)));
    if (active < modules.length - 1) {
      setActive(active + 1);
    }
  };

  const goPrev = () => active > 0 && setActive(active - 1);

  const elapsedLabel = `${Math.floor((progress / 100) * current.seconds)}:${
    Math.floor(((progress / 100) * current.seconds * 60) % 60)
      .toString()
      .padStart(2, "0")
  } / ${current.d}`;

  return (
    <div className="flex flex-col gap-3 md:flex-row">
      <aside className="w-full shrink-0 md:w-[230px]">
        <div className="text-[13px] font-medium">IT & ITeS Fundamentals</div>
        <div className="mt-1 flex items-center gap-2">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-green-600 transition-all"
              style={{ width: `${overallPct}%` }}
            />
          </div>
        </div>
        <div className="mb-2 text-[11px] text-gray-500">
          {overallPct}% · {completedCount}/{modules.length} modules
        </div>
        <div className="space-y-1">
          {modules.map((m, i) => {
            const isActive = i === active;
            return (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`flex w-full items-center gap-2 rounded-md border px-2 py-1.5 text-left text-[12px] transition-colors ${
                  isActive
                    ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                {m.done ? (
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                ) : isActive ? (
                  <Play className="h-3.5 w-3.5 shrink-0 fill-emerald-600 text-emerald-600" />
                ) : (
                  <Circle className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                )}
                <span className="flex-1 truncate">{m.t}</span>
                <span className="text-[10px] text-gray-500">{m.d}</span>
              </button>
            );
          })}
        </div>
      </aside>

      <div className="flex-1 space-y-2.5">
        {/* video stage */}
        <div className="relative flex h-[240px] flex-col items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(16,185,129,0.18),transparent_60%)]" />
          <button
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? "Pause" : "Play"}
            className="relative flex h-[56px] w-[56px] items-center justify-center rounded-full bg-emerald-500 shadow-lg transition-transform hover:scale-105 hover:bg-emerald-400"
          >
            {playing ? (
              <Pause className="h-6 w-6 fill-white text-white" />
            ) : (
              <Play className="h-6 w-6 fill-white text-white" />
            )}
          </button>
          <div className="relative mt-3 text-[14px] font-medium">{current.t}</div>
          <div className="relative text-[11px] text-white/70">{elapsedLabel} · HD Video Lecture</div>

          {subtitles && (
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 rounded bg-black/60 px-2 py-1 text-[11px]">
              "Now let's look at how the CSS box model works…"
            </div>
          )}

          {/* progress bar */}
          <div className="absolute inset-x-0 bottom-0 px-3 pb-2">
            <div className="h-1 overflow-hidden rounded-full bg-white/20">
              <div
                className="h-full rounded-full bg-emerald-400 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-1 flex gap-1.5">
              <button
                onClick={() => {
                  setProgress(0);
                  setPlaying(true);
                }}
                className="flex items-center gap-1 rounded bg-white/10 px-2 py-1 text-[10.5px] backdrop-blur-sm hover:bg-white/20"
              >
                <RotateCcw className="h-3 w-3" /> Replay
              </button>
              <button className="flex items-center gap-1 rounded bg-white/10 px-2 py-1 text-[10.5px] backdrop-blur-sm hover:bg-white/20">
                <Download className="h-3 w-3" /> Notes PDF
              </button>
              <button
                onClick={() => setSubtitles((s) => !s)}
                className={`flex items-center gap-1 rounded px-2 py-1 text-[10.5px] backdrop-blur-sm ${
                  subtitles ? "bg-emerald-500 text-white" : "bg-white/10 hover:bg-white/20"
                }`}
              >
                <Subtitles className="h-3 w-3" /> CC
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-2.5 md:grid-cols-2">
          <Card>
            <div className="mb-1.5 flex items-center justify-between">
              <div className="text-[12px] font-medium">My notes</div>
              {noteSaved && (
                <span className="text-[10px] text-emerald-600">Saved ✓</span>
              )}
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Take notes while watching..."
              className="h-[70px] w-full resize-none rounded-md bg-gray-50 p-2 text-[11px] focus:outline-none focus:ring-1 focus:ring-emerald-300"
            />
            <button
              onClick={saveNotes}
              className="mt-1.5 rounded-md bg-emerald-600 px-2.5 py-1 text-[10.5px] font-semibold text-white hover:bg-emerald-700"
            >
              Save notes
            </button>
          </Card>
          <Card>
            <div className="mb-1.5 flex items-center gap-1 text-[12px] font-medium text-emerald-700">
              <Sparkles className="h-3.5 w-3.5" /> Ask AI about this lesson
            </div>
            <div className="space-y-1">
              {Object.keys(AI_ANSWERS).map((q) => (
                <button
                  key={q}
                  onClick={() => setAiQ(q)}
                  className={`w-full rounded-md px-2 py-1.5 text-left text-[10.5px] transition-colors ${
                    aiQ === q ? "bg-emerald-50 text-emerald-800" : "bg-gray-50 hover:bg-gray-100"
                  }`}
                >
                  {q} →
                </button>
              ))}
            </div>
            {aiQ && (
              <div className="mt-2 rounded-md border border-emerald-100 bg-emerald-50/50 p-2 text-[11px] leading-relaxed text-gray-800">
                {AI_ANSWERS[aiQ]}
              </div>
            )}
          </Card>
        </div>

        <div className="flex justify-between gap-2">
          <button
            onClick={goPrev}
            disabled={active === 0}
            className="rounded-md border border-gray-200 px-3 py-1.5 text-[12px] hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            ← Previous module
          </button>
          <button
            onClick={markComplete}
            className="rounded-md bg-gradient-to-r from-emerald-600 to-green-600 px-3 py-1.5 text-[12px] font-semibold text-white shadow-sm hover:from-emerald-700 hover:to-green-700"
          >
            {current.done ? "Next module →" : "Mark complete & continue →"}
          </button>
        </div>
      </div>
    </div>
  );
}
