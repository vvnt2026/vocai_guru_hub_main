import { createFileRoute } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Badge, Card } from "@/components/portal/PortalShell";

export const Route = createFileRoute("/student/career-plan")({ component: CareerPlan });

const stages = [
  { label: "Now", title: "Class 11 — IT & ITeS", desc: "NSQF Level 3 training underway", badge: "Training", tone: "green" as const, state: "active" },
  { label: "6 months", title: "Industry Internship", desc: "PMKVY placement partner", badge: "₹5,000–8,000/mo", tone: "blue" as const, state: "next" },
  { label: "1 year", title: "Junior IT Technician", desc: "Entry-level certification role", badge: "₹15,000–20,000/mo", tone: "gray" as const, state: "future" },
  { label: "3 years", title: "IT Support Engineer", desc: "Experienced & upskilled", badge: "₹25,000–40,000/mo", tone: "gray" as const, state: "future" },
  { label: "5 years", title: "IT Team Lead / Freelancer", desc: "Senior or independent", badge: "₹50,000+/mo", tone: "gray" as const, state: "future" },
];

const skills = [
  { name: "HTML/CSS", current: 60, target: 90 },
  { name: "JavaScript", current: 20, target: 80 },
  { name: "Networking", current: 40, target: 70 },
  { name: "Problem solving", current: 55, target: 85 },
  { name: "Communication", current: 75, target: 90 },
];

const salaryData = [
  { y: "Y1", v: 15 },
  { y: "Y2", v: 20 },
  { y: "Y3", v: 28 },
  { y: "Y4", v: 38 },
  { y: "Y5", v: 52 },
];

function CareerPlan() {
  return (
    <div className="space-y-3">
      <Card>
        <div className="mb-3 text-[13px] font-medium">IT & ITeS Career Pathway</div>
        <div className="relative">
          <div className="absolute left-[13px] top-3 bottom-3 w-0.5 bg-gray-200" />
          <div className="space-y-3">
            {stages.map((s, i) => (
              <div key={i} className="relative flex items-start gap-3 pl-0">
                <div
                  className={`relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 ${
                    s.state === "active"
                      ? "border-emerald-400 bg-emerald-50"
                      : s.state === "next"
                      ? "border-blue-400 bg-blue-50"
                      : "border-gray-200 bg-gray-100"
                  }`}
                >
                  {s.state === "active" ? (
                    <Star className="h-3 w-3 fill-emerald-600 text-emerald-600" />
                  ) : (
                    <span
                      className={`text-[11px] font-medium ${
                        s.state === "next" ? "text-blue-600" : "text-gray-400"
                      }`}
                    >
                      {i + 1}
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <div className="text-[10px] uppercase text-gray-400">{s.label}</div>
                  <div className="text-[13px] font-medium">{s.title}</div>
                  <div className="text-[11px] text-gray-500">{s.desc}</div>
                  <div className="mt-1">
                    <Badge tone={s.tone}>{s.badge}</Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card>
        <div className="mb-3 text-[13px] font-medium">Skill gap analysis</div>
        <div className="space-y-2.5">
          {skills.map((s) => (
            <div key={s.name}>
              <div className="mb-1 flex justify-between text-[11px]">
                <span>{s.name}</span>
                <span className="text-gray-500">
                  {s.current}% current / {s.target}% target
                </span>
              </div>
              <div className="relative h-[7px] overflow-hidden rounded bg-gray-100">
                <div className="h-full rounded bg-blue-500" style={{ width: `${s.current}%` }} />
                <div
                  className="absolute top-0 h-full w-0.5 bg-amber-500"
                  style={{ left: `${s.target}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div className="mb-2 text-[13px] font-medium">Projected salary growth</div>
        <div className="h-[140px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={salaryData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="y" tick={{ fontSize: 10 }} stroke="#9CA3AF" />
              <YAxis
                tick={{ fontSize: 10 }}
                stroke="#9CA3AF"
                tickFormatter={(v) => `₹${v}k`}
              />
              <Tooltip formatter={(v: number) => [`₹${v},000/mo`, "Salary"]} />
              <Area type="monotone" dataKey="v" stroke="#378ADD" strokeWidth={2} fill="#E6F1FB" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
