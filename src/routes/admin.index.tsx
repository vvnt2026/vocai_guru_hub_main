import { createFileRoute } from "@tanstack/react-router";
import { Award, Briefcase, Building2, Users } from "lucide-react";
import { Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, StatCard } from "@/components/portal/PortalShell";

export const Route = createFileRoute("/admin/")({ component: Overview });

const enrollData = [
  { m: "Aug", v: 1240 },
  { m: "Sep", v: 1890 },
  { m: "Oct", v: 2340 },
  { m: "Nov", v: 2780 },
  { m: "Dec", v: 3120 },
  { m: "Jan", v: 3450 },
  { m: "Feb", v: 3890 },
  { m: "Mar", v: 4230 },
];

const tradeMix = [
  { name: "IT & ITeS", v: 34, c: "#378ADD" },
  { name: "Healthcare", v: 18, c: "#1D9E75" },
  { name: "Retail", v: 14, c: "#BA7517" },
  { name: "Automotive", v: 12, c: "#D85A30" },
  { name: "Agriculture", v: 10, c: "#639922" },
  { name: "Others", v: 12, c: "#888780" },
];

function Overview() {
  return (
    <div className="space-y-3">
      <div>
        <h2 className="text-[15px] font-medium">District overview — Varanasi, UP</h2>
        <p className="text-[12px] text-gray-500">Samagra Shiksha · Vocational Education · 2024–25</p>
      </div>

      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        <StatCard icon={<Building2 className="h-3.5 w-3.5" />} label="Schools (voc. ed.)" value="48" valueColor="text-blue-600" />
        <StatCard icon={<Users className="h-3.5 w-3.5" />} label="Students enrolled" value="4,230" valueColor="text-emerald-600" sub="+12% vs last yr" />
        <StatCard icon={<Briefcase className="h-3.5 w-3.5" />} label="Active trades" value="8" valueColor="text-amber-600" />
        <StatCard icon={<Award className="h-3.5 w-3.5" />} label="NSQF certified" value="1,842" valueColor="text-emerald-600" sub="43.5% pass rate" />
      </div>

      <div className="grid gap-3 md:grid-cols-[2fr_1fr]">
        <Card>
          <div className="mb-2 text-[13px] font-medium">Enrollment growth (2024–25)</div>
          <div className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={enrollData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="m" tick={{ fontSize: 10 }} stroke="#9CA3AF" />
                <YAxis tick={{ fontSize: 10 }} stroke="#9CA3AF" />
                <Tooltip />
                <Area type="monotone" dataKey="v" stroke="#1D9E75" strokeWidth={2} fill="#E1F5EE" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <div className="mb-2 text-[13px] font-medium">Trade mix</div>
          <div className="h-[120px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={tradeMix} dataKey="v" innerRadius={35} outerRadius={55} stroke="none">
                  {tradeMix.map((t) => (
                    <Cell key={t.name} fill={t.c} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => `${v}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 space-y-1">
            {tradeMix.map((t) => (
              <div key={t.name} className="flex items-center gap-2 text-[11px]">
                <span className="h-[7px] w-[7px] rounded-full" style={{ backgroundColor: t.c }} />
                <span className="flex-1">{t.name}</span>
                <span className="text-gray-500">{t.v}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
