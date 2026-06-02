import { createFileRoute } from "@tanstack/react-router";
import { Building } from "lucide-react";
import { useState } from "react";
import { Badge, Card } from "@/components/portal/PortalShell";

export const Route = createFileRoute("/student/jobs")({ component: Jobs });

const FILTERS = ["All", "IT & ITeS", "Healthcare", "Automotive"];

const jobs = [
  { t: "Junior Web Developer", c: "TechSoft Pvt Ltd · Lucknow, UP", pay: "₹18,000/mo", match: 85 },
  { t: "IT Support Executive", c: "Wipro BPO · Noida, UP", pay: "₹15,000/mo", match: 92 },
  { t: "Data Entry Operator", c: "State Bank of India · Agra, UP", pay: "₹12,000/mo", match: 78 },
  { t: "Computer Lab Instructor", c: "Govt School UP · Varanasi, UP", pay: "₹20,000/mo", match: 88 },
];

function Jobs() {
  const [active, setActive] = useState("All");
  return (
    <div className="space-y-3">
      <h2 className="text-[14px] font-medium">Job explorer</h2>
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setActive(f)}
            className={`rounded-full border px-3 py-1 text-[11px] ${
              active === f
                ? "border-blue-400 bg-blue-50 text-blue-700"
                : "border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {f}
          </button>
        ))}
      </div>
      <div className="space-y-2">
        {jobs.map((j) => (
          <Card key={j.t}>
            <div className="flex items-center gap-3">
              <div className="flex h-[38px] w-[38px] items-center justify-center rounded-lg bg-gray-50">
                <Building className="h-5 w-5 text-gray-500" />
              </div>
              <div className="flex-1">
                <div className="text-[13px] font-medium">{j.t}</div>
                <div className="text-[11px] text-gray-500">{j.c}</div>
                <div className="mt-1 flex gap-1.5">
                  <Badge tone="green">{j.pay}</Badge>
                  <Badge tone="gray">Full-time</Badge>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <div className="leading-none">
                  <span className="text-[18px] font-semibold text-emerald-600">{j.match}%</span>
                  <div className="text-[10px] text-gray-400">match</div>
                </div>
                <button className="rounded-md border border-gray-200 px-2.5 py-1 text-[11px] font-medium hover:bg-gray-50">
                  Apply →
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
