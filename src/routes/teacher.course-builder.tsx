import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, CheckCircle2, Clock, FileText, Loader2, Sparkles, Wand2 } from "lucide-react";
import { useState } from "react";
import { Badge, Card } from "@/components/portal/PortalShell";

export const Route = createFileRoute("/teacher/course-builder")({ component: CourseBuilder });

type ContentType = "Video" | "Reading" | "Practical" | "Project";
interface Module {
  n: number;
  title: string;
  hours: number;
  type: ContentType;
  assessments: number;
  published: boolean;
  generated: boolean;
  topics?: string[];
}

const SEED: Module[] = [
  { n: 1, title: "Introduction to IT & Career Pathways", hours: 4, type: "Video", assessments: 2, published: true, generated: true, topics: ["NSQF overview", "IT career map", "Soft skills"] },
  { n: 2, title: "Computer Fundamentals & Operating Systems", hours: 6, type: "Practical", assessments: 3, published: true, generated: true, topics: ["Hardware basics", "Windows/Linux", "File systems"] },
  { n: 3, title: "Internet, Email & Digital Safety", hours: 5, type: "Reading", assessments: 2, published: true, generated: true, topics: ["Browsing", "Email etiquette", "Cyber safety"] },
  { n: 4, title: "Word Processing with MS Word", hours: 6, type: "Practical", assessments: 3, published: false, generated: false },
  { n: 5, title: "Spreadsheets with MS Excel", hours: 8, type: "Practical", assessments: 4, published: false, generated: false },
  { n: 6, title: "Presentations with PowerPoint", hours: 4, type: "Project", assessments: 2, published: false, generated: false },
  { n: 7, title: "HTML & Web Page Basics", hours: 8, type: "Practical", assessments: 3, published: false, generated: false },
  { n: 8, title: "CSS & Responsive Design", hours: 8, type: "Practical", assessments: 3, published: false, generated: false },
  { n: 9, title: "JavaScript Fundamentals", hours: 10, type: "Practical", assessments: 4, published: false, generated: false },
  { n: 10, title: "Database Basics with MySQL", hours: 8, type: "Practical", assessments: 3, published: false, generated: false },
  { n: 11, title: "Capstone: Build a Small Website", hours: 12, type: "Project", assessments: 1, published: false, generated: false },
  { n: 12, title: "Career Readiness & Job Placement", hours: 6, type: "Reading", assessments: 2, published: false, generated: false },
];

const TOPIC_BANK: Record<number, string[]> = {
  4: ["Document formatting", "Tables & images", "Mail merge"],
  5: ["Formulas & functions", "Charts", "Pivot tables", "Data validation"],
  6: ["Slide design", "Animations", "Public speaking"],
  7: ["HTML structure", "Tags & attributes", "Forms"],
  8: ["Selectors", "Flexbox & Grid", "Mobile-first design"],
  9: ["Variables & functions", "DOM manipulation", "Events", "ES6 basics"],
  10: ["Tables & queries", "JOINs", "CRUD operations"],
  11: ["Project planning", "Build & deploy"],
  12: ["Resume building", "Interview prep"],
};

function CourseBuilder() {
  const [title, setTitle] = useState("");
  const [outcome, setOutcome] = useState("");
  const [classLevel, setClassLevel] = useState("Class 11");
  const [nsqf, setNsqf] = useState("Level 3");
  const [generating, setGenerating] = useState(false);
  const [modules, setModules] = useState<Module[] | null>(null);
  const [genIdx, setGenIdx] = useState<number | null>(null);

  const generate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || generating) return;
    setGenerating(true);
    setModules(null);
    setTimeout(() => {
      setModules(SEED);
      setGenerating(false);
    }, 1800);
  };

  const generateModule = (n: number) => {
    setGenIdx(n);
    setTimeout(() => {
      setModules((m) =>
        m!.map((x) =>
          x.n === n ? { ...x, generated: true, topics: TOPIC_BANK[n] ?? ["Generated content"] } : x,
        ),
      );
      setGenIdx(null);
    }, 1100);
  };

  const publishModule = (n: number) => {
    setModules((m) => m!.map((x) => (x.n === n ? { ...x, published: true } : x)));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow">
          <Sparkles className="h-4 w-4" />
        </div>
        <div>
          <div className="text-[15px] font-semibold">AI Course Builder</div>
          <div className="text-[11px] text-gray-500">
            NSQF-aligned 12-module course in seconds · PSSCIVE-compatible
          </div>
        </div>
      </div>

      <form onSubmit={generate} className="space-y-3 rounded-xl border border-gray-200 bg-white p-4">
        <Field label="Course title">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. IT & ITeS — Web Development Foundations"
            className="cb-input"
          />
        </Field>
        <Field label="Learning outcome">
          <textarea
            value={outcome}
            onChange={(e) => setOutcome(e.target.value)}
            placeholder="e.g. Student can build a basic responsive website and explain core IT job roles"
            rows={2}
            className="cb-input resize-none"
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Class">
            <select className="cb-input" value={classLevel} onChange={(e) => setClassLevel(e.target.value)}>
              {["Class 9", "Class 10", "Class 11", "Class 12"].map((c) => <option key={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="NSQF level">
            <select className="cb-input" value={nsqf} onChange={(e) => setNsqf(e.target.value)}>
              {["Level 1", "Level 2", "Level 3", "Level 4"].map((c) => <option key={c}>{c}</option>)}
            </select>
          </Field>
        </div>
        <button
          type="submit"
          disabled={generating || !title.trim()}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-gradient-to-r from-purple-600 to-indigo-600 py-2 text-[13px] font-semibold text-white shadow hover:from-purple-700 hover:to-indigo-700 disabled:opacity-60"
        >
          {generating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Generating 12 modules...
            </>
          ) : (
            <>
              <Wand2 className="h-4 w-4" /> Generate AI course structure
            </>
          )}
        </button>
      </form>

      {modules && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-[13px] font-medium">
              {title || "Generated course"} ·{" "}
              <span className="text-gray-500">{modules.reduce((s, m) => s + m.hours, 0)} hrs total</span>
            </div>
            <Badge tone="green">Generated in 8s</Badge>
          </div>

          {modules.map((m) => (
            <Card key={m.n}>
              <div className="flex items-start gap-3">
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[12px] font-semibold ${
                    m.published
                      ? "bg-emerald-100 text-emerald-700"
                      : m.generated
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-500"
                  }`}
                >
                  M{m.n}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[13px] font-medium">{m.title}</span>
                    {m.published && <Badge tone="green">Published</Badge>}
                    {!m.published && m.generated && <Badge tone="blue">Ready to publish</Badge>}
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-[11px] text-gray-500">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{m.hours}h</span>
                    <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" />{m.type}</span>
                    <span className="flex items-center gap-1"><FileText className="h-3 w-3" />{m.assessments} assessments</span>
                  </div>
                  {m.topics && (
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {m.topics.map((t) => (
                        <span key={t} className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-700">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="shrink-0">
                  {m.published ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  ) : !m.generated ? (
                    <button
                      disabled={genIdx === m.n}
                      onClick={() => generateModule(m.n)}
                      className="flex items-center gap-1 rounded-md bg-gradient-to-r from-purple-600 to-indigo-600 px-2.5 py-1 text-[11px] font-semibold text-white hover:from-purple-700 hover:to-indigo-700 disabled:opacity-60"
                    >
                      {genIdx === m.n ? <Loader2 className="h-3 w-3 animate-spin" /> : <Wand2 className="h-3 w-3" />}
                      {genIdx === m.n ? "Generating…" : "Generate →"}
                    </button>
                  ) : (
                    <button
                      onClick={() => publishModule(m.n)}
                      className="rounded-md bg-gradient-to-r from-emerald-600 to-green-600 px-2.5 py-1 text-[11px] font-semibold text-white hover:from-emerald-700 hover:to-green-700"
                    >
                      Publish
                    </button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <style>{`
        .cb-input { width:100%; border:1px solid #E5E7EB; border-radius:6px; padding:6px 10px; font-size:12px; background:white; }
        .cb-input:focus { outline:none; box-shadow:0 0 0 2px #C4B5FD; }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1 text-[11px] text-gray-500">{label}</div>
      {children}
    </div>
  );
}
