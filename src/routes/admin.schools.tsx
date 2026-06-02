import { createFileRoute } from "@tanstack/react-router";
import { Building2 } from "lucide-react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card } from "@/components/portal/PortalShell";

export const Route = createFileRoute("/admin/schools")({ component: Schools });

const nsqfTrend = [
  { m: "Oct", v: 78 },
  { m: "Nov", v: 81 },
  { m: "Dec", v: 83 },
  { m: "Jan", v: 85 },
  { m: "Feb", v: 88 },
  { m: "Mar", v: 91 },
];

const schools = [
  { name: "GGIC Lucknow", students: 423, trades: 5, perf: 88, nsqf: 92 },
  { name: "GGHIC Agra", students: 387, trades: 4, perf: 76, nsqf: 81 },
  { name: "GSSS Varanasi", students: 312, trades: 3, perf: 91, nsqf: 95 },
  { name: "GGHIC Kanpur", students: 456, trades: 6, perf: 72, nsqf: 78 },
];

function perfColor(p: number) {
  if (p >= 85) return { bg: "bg-emerald-50", text: "text-emerald-600" };
  if (p >= 75) return { bg: "bg-amber-50", text: "text-amber-600" };
  return { bg: "bg-red-50", text: "text-red-600" };
}

function Schools() {
  return (
    <div className="space-y-3">
      <Card>
        <div className="mb-2 text-[13px] font-medium">NSQF pass rate trend (district avg)</div>
        <div className="h-[130px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={nsqfTrend} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="m" tick={{ fontSize: 10 }} stroke="#9CA3AF" />
              <YAxis tick={{ fontSize: 10 }} stroke="#9CA3AF" tickFormatter={(v) => `${v}%`} />
              <Tooltip formatter={(v: number) => `${v}%`} />
              <Line type="monotone" dataKey="v" stroke="#1D9E75" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="space-y-2">
        {schools.map((s) => {
          const c = perfColor(s.perf);
          return (
            <Card key={s.name}>
              <div className="flex items-center gap-3">
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${c.bg}`}>
                  <Building2 className={`h-5 w-5 ${c.text}`} />
                </div>
                <div className="flex-1">
                  <div className="text-[13px] font-medium">{s.name}</div>
                  <div className="text-[11px] text-gray-500">
                    {s.students} students · {s.trades} trades
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-[16px] font-semibold ${c.text}`}>{s.perf}%</div>
                  <div className="text-[10px] text-gray-500">{s.nsqf}% NSQF</div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
