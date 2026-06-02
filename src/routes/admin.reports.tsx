import { createFileRoute } from "@tanstack/react-router";
import { BarChart3, Building, CheckCircle2, FileText, School, Users } from "lucide-react";
import { Badge, Card } from "@/components/portal/PortalShell";

export const Route = createFileRoute("/admin/reports")({ component: Reports });

const reports = [
  { i: <Users className="h-5 w-5 text-gray-600" />, t: "Quarterly enrollment report — Q3", s: "Oct–Dec 2024", status: "submitted" as const },
  { i: <FileText className="h-5 w-5 text-gray-600" />, t: "NSQF certification progress report", s: "Annual 2024–25", status: "submitted" as const },
  { i: <BarChart3 className="h-5 w-5 text-gray-600" />, t: "Trade-wise performance report", s: "Oct–Dec 2024", status: "submitted" as const },
  { i: <School className="h-5 w-5 text-gray-600" />, t: "Teacher training compliance", s: "Academic year", status: "pending" as const },
  { i: <Building className="h-5 w-5 text-gray-600" />, t: "Infrastructure & lab utilisation", s: "Q3 2024–25", status: "draft" as const },
];

function Reports() {
  return (
    <div className="space-y-3">
      <div className="rounded-xl border-2 border-emerald-300 bg-emerald-50 p-3.5">
        <div className="mb-1 flex items-center gap-1.5 text-[13px] font-medium text-emerald-800">
          <CheckCircle2 className="h-4 w-4" /> Samagra Shiksha compliance — Q3 2024–25
        </div>
        <p className="text-[12px] text-emerald-700">
          All 8 required vocational reports submitted. NSQF Level reporting: compliant.
        </p>
      </div>

      <div className="space-y-2">
        {reports.map((r) => (
          <Card key={r.t}>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-50">{r.i}</div>
              <div className="flex-1">
                <div className="text-[13px] font-medium">{r.t}</div>
                <div className="text-[11px] text-gray-500">{r.s}</div>
              </div>
              {r.status === "submitted" && <Badge tone="green">Submitted</Badge>}
              {r.status === "pending" && <Badge tone="red">Pending</Badge>}
              {r.status === "draft" && <Badge tone="amber">Draft</Badge>}
              <button className="rounded-md border border-gray-200 px-2.5 py-1 text-[11px] font-medium hover:bg-gray-50">
                {r.status === "submitted" ? "View" : "Complete →"}
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
