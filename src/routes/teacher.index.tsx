import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, Calendar, LineChart as LineIcon, TrendingUp, User, Users } from "lucide-react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, StatCard } from "@/components/portal/PortalShell";

export const Route = createFileRoute("/teacher/")({ component: Dashboard });

const trendData = [
  { w: "Wk 1", v: 45 },
  { w: "Wk 2", v: 52 },
  { w: "Wk 3", v: 58 },
  { w: "Wk 4", v: 61 },
  { w: "Wk 5", v: 67 },
  { w: "Wk 6", v: 72 },
];

const schedule = [
  { t: "10:00 AM", dot: "bg-blue-500", e: "HTML & CSS Module 5 (Batch A)" },
  { t: "12:00 PM", dot: "bg-amber-500", e: "Assessment review — Unit 3 results" },
  { t: "3:00 PM", dot: "bg-blue-500", e: "HTML & CSS Module 5 (Batch B)" },
  { t: "5:00 PM", dot: "bg-emerald-500", e: "Parent-teacher meeting (3 students)" },
];

function Dashboard() {
  return (
    <div className="space-y-3">
      <div>
        <div className="text-[15px] font-medium">Good morning, Rajesh Sir!</div>
        <div className="text-[12px] text-gray-500">
          IT & ITeS · Class 11 · GSSS Varanasi · 32 students
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        <StatCard icon={<Users className="h-3.5 w-3.5" />} label="Total students" value="32" valueColor="text-blue-600" sub="Class 11" />
        <StatCard icon={<LineIcon className="h-3.5 w-3.5" />} label="Avg progress" value="61%" valueColor="text-emerald-600" sub="+4% this week" />
        <StatCard icon={<Calendar className="h-3.5 w-3.5" />} label="Attendance today" value="28/32" valueColor="text-amber-600" sub="87.5%" />
        <StatCard icon={<AlertTriangle className="h-3.5 w-3.5" />} label="At-risk students" value="2" valueColor="text-red-600" sub="Need attention" />
      </div>

      <div className="rounded-xl border-2 border-red-300 bg-red-50 p-3">
        <div className="mb-2 flex items-center gap-1.5 text-[13px] font-medium text-red-700">
          <AlertTriangle className="h-4 w-4" /> Student alerts
        </div>
        <div className="space-y-2">
          {[
            { n: "Vikram Yadav", s: "32% progress — 3 weeks behind schedule · 65% attendance" },
            { n: "Rahul Gupta", s: "45% progress — needs extra support · 78% attendance" },
          ].map((a) => (
            <div key={a.n} className="flex items-center gap-2.5 rounded-lg bg-white p-2.5">
              <div className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-red-50">
                <User className="h-4 w-4 text-red-600" />
              </div>
              <div className="flex-1">
                <div className="text-[12px] font-medium">{a.n}</div>
                <div className="text-[11px] text-gray-500">{a.s}</div>
              </div>
              <Link
                to="/teacher/students"
                className="rounded-md border border-gray-200 px-2.5 py-1 text-[11px] font-medium hover:bg-gray-50"
              >
                View →
              </Link>
            </div>
          ))}
        </div>
      </div>

      <Card>
        <div className="mb-1 flex items-center gap-1.5 text-[13px] font-medium">
          <TrendingUp className="h-3.5 w-3.5 text-blue-500" /> Class average progress
        </div>
        <div className="h-[130px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="w" tick={{ fontSize: 10 }} stroke="#9CA3AF" />
              <YAxis tick={{ fontSize: 10 }} stroke="#9CA3AF" tickFormatter={(v) => `${v}%`} />
              <Tooltip formatter={(v: number) => [`${v}%`, "Avg"]} />
              <Line type="monotone" dataKey="v" stroke="#378ADD" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card>
        <div className="mb-2 text-[13px] font-medium">Today's schedule</div>
        <div className="space-y-1.5">
          {schedule.map((s, i) => (
            <div key={i} className="flex items-center gap-2 text-[12px]">
              <span className="w-[52px] text-[10px] text-gray-500">{s.t}</span>
              <span className={`h-[7px] w-[7px] rounded-full ${s.dot}`} />
              <span>{s.e}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
