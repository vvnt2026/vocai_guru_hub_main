import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2, Circle } from "lucide-react";
import { useState } from "react";
import { Badge, Card, StatCard } from "@/components/portal/PortalShell";

export const Route = createFileRoute("/teacher/students")({ component: Roster });

type Status = "excellent" | "good" | "warning" | "at-risk";
interface Student {
  name: string;
  initials: string;
  prog: number;
  att: number;
  score: number;
  status: Status;
  last: string;
}

const students: Student[] = [
  { name: "Priya Sharma", initials: "PS", prog: 78, att: 92, score: 85, status: "good", last: "1 hour ago" },
  { name: "Rahul Gupta", initials: "RG", prog: 45, att: 78, score: 62, status: "warning", last: "2 days ago" },
  { name: "Ananya Singh", initials: "AS", prog: 91, att: 98, score: 94, status: "excellent", last: "30 min ago" },
  { name: "Vikram Yadav", initials: "VY", prog: 32, att: 65, score: 41, status: "at-risk", last: "1 week ago" },
  { name: "Kavya Patel", initials: "KP", prog: 65, att: 88, score: 72, status: "good", last: "Yesterday" },
  { name: "Amit Kumar", initials: "AK", prog: 55, att: 82, score: 68, status: "good", last: "Today" },
];

const STATUS_COLORS: Record<Status, { bg: string; text: string; badge: "green" | "blue" | "amber" | "red" }> = {
  excellent: { bg: "bg-emerald-100", text: "text-emerald-700", badge: "green" },
  good: { bg: "bg-blue-100", text: "text-blue-700", badge: "blue" },
  warning: { bg: "bg-amber-100", text: "text-amber-700", badge: "amber" },
  "at-risk": { bg: "bg-red-100", text: "text-red-700", badge: "red" },
};

const MODULES = [
  "Introduction to computers",
  "Operating systems & software",
  "Internet & email basics",
  "MS Office essentials",
  "HTML & CSS",
  "JavaScript fundamentals",
];

function Roster() {
  const [selected, setSelected] = useState<Student | null>(null);
  const [q, setQ] = useState("");

  if (selected) {
    const sc = STATUS_COLORS[selected.status];
    const completed = Math.floor(selected.prog / 16);
    return (
      <div className="space-y-3">
        <button
          onClick={() => setSelected(null)}
          className="flex items-center gap-1 text-[11px] text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="h-3 w-3" /> Back to roster
        </button>
        <div className="flex items-center gap-3">
          <div className={`flex h-12 w-12 items-center justify-center rounded-full ${sc.bg} ${sc.text} text-[14px] font-medium`}>
            {selected.initials}
          </div>
          <div className="flex-1">
            <div className="text-[16px] font-medium">{selected.name}</div>
            <div className="text-[12px] text-gray-500">
              Class 11 · IT & ITeS · Last active: {selected.last}
            </div>
          </div>
          <Badge tone={sc.badge}>{selected.status}</Badge>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <StatCard icon={null} label="Course progress" value={`${selected.prog}%`} valueColor="text-blue-600" />
          <StatCard icon={null} label="Avg score" value={`${selected.score}%`} valueColor="text-emerald-600" />
          <StatCard icon={null} label="Attendance" value={`${selected.att}%`} valueColor="text-amber-600" />
        </div>
        <Card>
          <div className="mb-2 text-[13px] font-medium">Module progress</div>
          <div className="divide-y divide-gray-100">
            {MODULES.map((m, i) => {
              const done = i < completed;
              return (
                <div key={m} className="flex items-center gap-2 py-2 text-[12px]">
                  {done ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <Circle className="h-4 w-4 text-gray-300" />}
                  <span className="flex-1">{m}</span>
                  {done && <Badge tone="green">Done</Badge>}
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    );
  }

  const filtered = students.filter((s) => s.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-[14px] font-medium">Student roster — Class 11 IT & ITeS</h2>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search students..."
          className="w-full max-w-[280px] rounded-md border border-gray-200 px-2.5 py-1.5 text-[12px] focus:outline-none focus:ring-1 focus:ring-blue-300"
        />
      </div>
      <div className="space-y-2">
        {filtered.map((s) => {
          const sc = STATUS_COLORS[s.status];
          return (
            <button
              key={s.name}
              onClick={() => setSelected(s)}
              className="flex w-full items-center gap-3 rounded-xl border border-gray-200 bg-white p-3 text-left hover:bg-gray-50"
            >
              <div className={`flex h-[34px] w-[34px] items-center justify-center rounded-full ${sc.bg} ${sc.text} text-[12px] font-medium`}>
                {s.initials}
              </div>
              <div className="w-[120px] text-[13px] font-medium">{s.name}</div>
              <div className="flex-1">
                <div className="flex justify-between text-[10px] text-gray-500">
                  <span>Progress {s.prog}%</span>
                  <span>Att {s.att}%</span>
                </div>
                <div className="mt-1 h-1 overflow-hidden rounded-full bg-gray-100">
                  <div className="h-full rounded-full bg-blue-500" style={{ width: `${s.prog}%` }} />
                </div>
              </div>
              <Badge tone={sc.badge}>{s.status}</Badge>
              <div className="w-12 text-right text-[13px] font-medium">{s.score}%</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
