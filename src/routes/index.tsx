import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Backpack, Building2, GraduationCap, School, Sparkles } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "VocAI Guru — Samagra Shiksha" },
      {
        name: "description",
        content:
          "AI-powered vocational education platform for Class 9–12 under Samagra Shiksha, Ministry of Education, Government of India.",
      },
      { property: "og:title", content: "VocAI Guru — Samagra Shiksha" },
      {
        property: "og:description",
        content: "Student, teacher and district admin portals for NSQF-aligned vocational education.",
      },
    ],
  }),
  component: Landing,
});

function PersonaCard({
  to,
  gradient,
  iconRing,
  icon,
  title,
  subtitle,
  description,
  features,
  chipClass,
  accent,
}: {
  to: string;
  gradient: string;
  iconRing: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  chipClass: string;
  accent: string;
}) {
  return (
    <Link
      to={to}
      className="group relative block overflow-hidden rounded-2xl border border-white/40 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-xl"
    >
      <div className={`absolute inset-x-0 top-0 h-1.5 ${gradient}`} />
      <div className="flex items-start gap-4">
        <div
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-white shadow-lg ${gradient} ${iconRing}`}
        >
          {icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <div className="text-[16px] font-semibold leading-tight">{title}</div>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${accent}`}>
              Demo
            </span>
          </div>
          <div className="mt-0.5 text-[11.5px] text-gray-500">{subtitle}</div>
          <p className="mt-2 text-[12.5px] leading-relaxed text-gray-600">{description}</p>
          <div className="mt-2.5 flex flex-wrap gap-1">
            {features.map((f) => (
              <span key={f} className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${chipClass}`}>
                {f}
              </span>
            ))}
          </div>
        </div>
        <ArrowRight className="h-5 w-5 shrink-0 text-gray-400 transition-transform group-hover:translate-x-1 group-hover:text-gray-700" />
      </div>
    </Link>
  );
}

function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-amber-50">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 overflow-hidden">
        <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-emerald-200/40 blur-3xl" />
        <div className="absolute right-0 top-32 h-80 w-80 rounded-full bg-blue-200/40 blur-3xl" />
        <div className="absolute left-1/3 top-64 h-72 w-72 rounded-full bg-amber-200/40 blur-3xl" />
      </div>

      <header className="flex items-center justify-between border-b border-white/60 bg-white/70 px-5 py-3 backdrop-blur">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md">
            <School className="h-4 w-4" />
          </div>
          <div className="leading-tight">
            <div className="text-[13.5px] font-semibold">VocAI Guru</div>
            <div className="text-[11px] text-gray-500">
              Samagra Shiksha · Ministry of Education, Govt of India
            </div>
          </div>
        </div>
        <span className="flex items-center gap-1 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm">
          <Sparkles className="h-3 w-3" /> AI-Powered
        </span>
      </header>

      <main className="mx-auto max-w-[720px] px-5 py-12">
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50/80 px-3 py-1 text-[11px] font-medium text-emerald-700">
            🇮🇳 National Skills Qualifications Framework (NSQF)
          </span>
          <h1 className="mt-4 text-[34px] font-bold leading-tight tracking-tight">
            Empowering{" "}
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 bg-clip-text text-transparent">
              vocational education
            </span>
            <br />
            for every Indian student
          </h1>
          <p className="mx-auto mt-3 max-w-[520px] text-[13.5px] leading-relaxed text-gray-600">
            AI-driven learning, teaching and analytics for Class 9–12 vocational trades.
            Choose your persona to explore the platform.
          </p>
        </div>

        <div className="mt-9 space-y-3.5">
          <PersonaCard
            to="/student"
            gradient="bg-gradient-to-br from-emerald-500 to-teal-600"
            iconRing="ring-4 ring-emerald-100"
            icon={<Backpack className="h-7 w-7" />}
            title="Student"
            subtitle="Priya Sharma · Class 11 · IT & ITeS · GSSS Varanasi"
            description="Courses, live class, AI assessments, career planning, job explorer & AI mentor."
            features={["Home", "Courses", "Live class", "Assessments", "AI mentor", "Career plan", "Certificates", "Jobs"]}
            chipClass="bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
            accent="bg-emerald-100 text-emerald-700"
          />
          <PersonaCard
            to="/teacher"
            gradient="bg-gradient-to-br from-blue-500 to-indigo-600"
            iconRing="ring-4 ring-blue-100"
            icon={<GraduationCap className="h-7 w-7" />}
            title="Teacher"
            subtitle="Rajesh Kumar Sir · IT & ITeS · GSSS Varanasi · 32 students"
            description="Monitor students, track attendance, generate AI lesson plans, submit class reports."
            features={["Dashboard", "Student roster", "AI lesson planner", "Class reports"]}
            chipClass="bg-blue-50 text-blue-700 ring-1 ring-blue-100"
            accent="bg-blue-100 text-blue-700"
          />
          <PersonaCard
            to="/admin"
            gradient="bg-gradient-to-br from-amber-500 to-orange-600"
            iconRing="ring-4 ring-amber-100"
            icon={<Building2 className="h-7 w-7" />}
            title="Admin / District Officer"
            subtitle="District Education Office · Varanasi, Uttar Pradesh"
            description="District-level analytics, school performance rankings, Samagra Shiksha compliance reporting."
            features={["District overview", "School performance", "Gov. reports"]}
            chipClass="bg-amber-50 text-amber-700 ring-1 ring-amber-100"
            accent="bg-amber-100 text-amber-700"
          />
        </div>

        <div className="mt-10 flex items-center justify-center gap-6 text-[11px] text-gray-500">
          <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> PMKVY</span>
          <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-blue-500" /> NSDC</span>
          <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> Skill India</span>
        </div>
      </main>
    </div>
  );
}
