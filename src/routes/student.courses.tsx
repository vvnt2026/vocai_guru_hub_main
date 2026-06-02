import { createFileRoute, Link } from "@tanstack/react-router";
import { Car, Globe, Heart, Laptop, Megaphone, Scissors } from "lucide-react";
import { Badge, Card } from "@/components/portal/PortalShell";

export const Route = createFileRoute("/student/courses")({ component: Courses });

function Bar({ pct, color }: { pct: number; color: string }) {
  return (
    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100">
      <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

function Courses() {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-[14px] font-medium">My enrolled courses</h2>
        <p className="mb-3 text-[12px] text-gray-500">2 active courses</p>

        <div className="space-y-2.5">
          <Card>
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                <Laptop className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-[13.5px] font-medium">IT & ITeS Fundamentals</div>
                    <div className="text-[11px] text-gray-500">Rajesh Kumar · 120 hrs · 12 modules</div>
                  </div>
                  <Badge tone="blue">NSQF 3</Badge>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <Bar pct={68} color="bg-blue-500" />
                  <span className="text-[12px] font-medium text-blue-600">68%</span>
                </div>
                <div className="mt-1.5 flex items-center justify-between">
                  <span className="text-[11px] text-gray-500">8/12 modules completed</span>
                  <Link
                    to="/student/course-player"
                    className="rounded-md bg-gradient-to-r from-emerald-600 to-green-600 px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm hover:from-emerald-700 hover:to-green-700"
                  >
                    Continue →
                  </Link>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50">
                <Globe className="h-5 w-5 text-amber-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-[13.5px] font-medium">Web Development Basics</div>
                    <div className="text-[11px] text-gray-500">Priya Singh · 80 hrs · 8 modules</div>
                  </div>
                  <Badge tone="amber">NSQF 3</Badge>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <Bar pct={34} color="bg-amber-500" />
                  <span className="text-[12px] font-medium text-amber-600">34%</span>
                </div>
                <div className="mt-1.5 flex items-center justify-between">
                  <span className="text-[11px] text-gray-500">3/8 modules completed</span>
                  <Link
                    to="/student/course-player"
                    className="rounded-md bg-gradient-to-r from-emerald-600 to-green-600 px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm hover:from-emerald-700 hover:to-green-700"
                  >
                    Continue →
                  </Link>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-[14px] font-medium">Explore more courses</h2>
        <div className="grid gap-2.5 md:grid-cols-2">
          {[
            { icon: <Megaphone className="h-5 w-5 text-gray-600" />, t: "Digital Marketing", s: "Anita Sharma · 10 modules · 90 hrs" },
            { icon: <Heart className="h-5 w-5 text-gray-600" />, t: "Healthcare Assistant", s: "Dr. Meera Verma · 14 modules · 150 hrs" },
            { icon: <Car className="h-5 w-5 text-gray-600" />, t: "Automotive Technology", s: "Suresh Yadav · 9 modules · 100 hrs" },
            { icon: <Scissors className="h-5 w-5 text-gray-600" />, t: "Beauty & Wellness", s: "Kiran Bedi · 8 modules · 80 hrs" },
          ].map((c) => (
            <Card key={c.t}>
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-50">{c.icon}</div>
                <div className="flex-1">
                  <div className="text-[13px] font-medium">{c.t}</div>
                  <div className="text-[11px] text-gray-500">{c.s}</div>
                  <button className="mt-2 rounded-md bg-gradient-to-r from-emerald-600 to-green-600 px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm hover:from-emerald-700 hover:to-green-700">
                    Enroll →
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
