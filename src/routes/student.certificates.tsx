import { createFileRoute } from "@tanstack/react-router";
import { Award, BookOpen, Lock } from "lucide-react";
import { Badge } from "@/components/portal/PortalShell";

export const Route = createFileRoute("/student/certificates")({ component: Certs });

const certs = [
  { t: "Computer Fundamentals", s: "NSQF Level 2 · Samagra Shiksha", state: "earned", date: "Earned · Jan 2025", color: "emerald" },
  { t: "Digital Literacy", s: "NSQF Level 2 · NSDC", state: "earned", date: "Earned · Mar 2025", color: "amber" },
  { t: "IT & ITeS Level 3", s: "NSQF Level 3 · Samagra Shiksha", state: "progress", progress: 68, color: "blue" },
  { t: "Web Development Pro", s: "NSQF Level 4 · NSDC", state: "locked", color: "gray" },
];

function Certs() {
  return (
    <div className="space-y-3">
      <h2 className="text-[14px] font-medium">Certificates & badges</h2>
      <div className="grid gap-2.5 md:grid-cols-2">
        {certs.map((c) => {
          const borderClass =
            c.state === "earned"
              ? "border-emerald-300"
              : c.state === "progress"
              ? "border-blue-300"
              : "border-gray-200";
          return (
            <div key={c.t} className={`rounded-xl border-2 bg-white p-4 ${borderClass}`}>
              {c.state === "locked" ? (
                <Lock className="h-7 w-7 text-gray-400" />
              ) : c.state === "progress" ? (
                <BookOpen className="h-7 w-7 text-blue-500" />
              ) : (
                <Award className={`h-7 w-7 ${c.color === "amber" ? "text-amber-500" : "text-emerald-500"}`} />
              )}
              <div className="mt-2 text-[13px] font-medium">{c.t}</div>
              <div className="text-[11px] text-gray-500">{c.s}</div>
              <div className="mt-2">
                {c.state === "earned" && <Badge tone="green">{c.date}</Badge>}
                {c.state === "progress" && (
                  <>
                    <Badge tone="blue">In progress</Badge>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-blue-500"
                        style={{ width: `${c.progress}%` }}
                      />
                    </div>
                  </>
                )}
                {c.state === "locked" && (
                  <span className="text-[11px] text-gray-400">Complete Level 3 first</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
