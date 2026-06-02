import { createFileRoute } from "@tanstack/react-router";
import { Award, BarChart3, Star } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, StatCard } from "@/components/portal/PortalShell";

export const Route = createFileRoute("/teacher/reports")({ component: Reports });

const att = [
  { d: "Mon", Present: 28, Absent: 4 },
  { d: "Tue", Present: 30, Absent: 2 },
  { d: "Wed", Present: 25, Absent: 7 },
  { d: "Thu", Present: 29, Absent: 3 },
  { d: "Fri", Present: 27, Absent: 5 },
];

function Reports() {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
        <StatCard icon={<Star className="h-3.5 w-3.5" />} label="Class avg score" value="72%" valueColor="text-emerald-600" />
        <StatCard icon={<Award className="h-3.5 w-3.5" />} label="NSQF on track" value="26/32" valueColor="text-blue-600" sub="81%" />
        <StatCard icon={<BarChart3 className="h-3.5 w-3.5" />} label="Completion rate" value="88%" valueColor="text-emerald-600" />
      </div>

      <Card>
        <div className="mb-2 text-[13px] font-medium">Weekly attendance</div>
        <div className="h-[160px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={att} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="d" tick={{ fontSize: 10 }} stroke="#9CA3AF" />
              <YAxis tick={{ fontSize: 10 }} stroke="#9CA3AF" />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="Present" fill="#1D9E75" radius={[3, 3, 0, 0]} />
              <Bar dataKey="Absent" fill="#D85A30" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <button className="w-full rounded-md border border-gray-200 bg-blue-50 py-2 text-[13px] font-medium text-blue-700 hover:bg-blue-100">
        Generate Samagra Shiksha report →
      </button>
    </div>
  );
}
