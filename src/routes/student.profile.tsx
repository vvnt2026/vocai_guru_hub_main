import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Award, Briefcase, IndianRupee, Loader2, Sparkles, UserRound, Wand2 } from "lucide-react";
import { useState } from "react";
import { Card } from "@/components/portal/PortalShell";
import { recommendTrades, type TradeRecommendation } from "@/lib/ai.functions";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/student/profile")({ component: Profile });

const CLASSES = ["Class 9", "Class 10", "Class 11", "Class 12"];
const STATES = [
  "Uttar Pradesh",
  "Bihar",
  "Maharashtra",
  "Madhya Pradesh",
  "Rajasthan",
  "Karnataka",
  "Tamil Nadu",
  "West Bengal",
  "Gujarat",
  "Punjab",
  "Delhi",
  "Kerala",
];
const INTERESTS_EN = [
  "Technology",
  "People skills",
  "Healthcare",
  "Design & art",
  "Business",
  "Vehicles & machines",
  "Farming & nature",
  "Hospitality",
  "Sports",
];
const INTERESTS_HI = [
  "तकनीक",
  "लोगों से व्यवहार",
  "स्वास्थ्य सेवा",
  "डिज़ाइन व कला",
  "व्यवसाय",
  "वाहन व मशीन",
  "कृषि व प्रकृति",
  "आतिथ्य",
  "खेल",
];
const STYLES_EN = ["Hands-on / practical", "Visual / videos", "Reading / theory", "Group discussion"];
const STYLES_HI = ["प्रायोगिक / हाथों से", "दृश्य / वीडियो", "पढ़ना / सिद्धांत", "समूह चर्चा"];

function Profile() {
  const { t, lang } = useLang();
  const recommend = useServerFn(recommendTrades);

  const [name, setName] = useState("Priya");
  const [classLevel, setClassLevel] = useState("Class 10");
  const [state, setState] = useState("Uttar Pradesh");
  const [interests, setInterests] = useState<string[]>(["Technology", "People skills"]);
  const [learningStyle, setLearningStyle] = useState("Hands-on / practical");
  const [loading, setLoading] = useState(false);
  const [trades, setTrades] = useState<TradeRecommendation[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const toggleInterest = (i: string) => {
    setInterests((prev) => (prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || interests.length === 0 || loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await recommend({
        data: { name: name.trim(), classLevel, state, interests, learningStyle, lang },
      });
      if (res.error) setError(res.error);
      setTrades(res.trades);
    } catch {
      setError("Connection issue. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const interestsList = lang === "hi" ? INTERESTS_HI : INTERESTS_EN;
  const stylesList = lang === "hi" ? STYLES_HI : STYLES_EN;

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 p-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-sm">
          <UserRound className="h-5 w-5" />
        </div>
        <div>
          <div className="text-[14px] font-semibold text-emerald-900">
            {t("Find your vocational trade", "अपना व्यावसायिक ट्रेड खोजें")}
          </div>
          <div className="text-[12px] text-emerald-800/80">
            {t(
              "Fill in your details — our AI will recommend the top 3 NSQF trades matched to India's job market.",
              "अपना विवरण भरें — हमारा AI भारत के नौकरी बाज़ार के अनुसार आपके लिए शीर्ष 3 NSQF ट्रेड सुझाएगा।",
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        <Card className="md:col-span-2">
          <form onSubmit={submit} className="space-y-3">
            <Field label={t("Full name", "पूरा नाम")}>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-md border border-gray-200 px-2.5 py-1.5 text-[12.5px] focus:border-emerald-400 focus:outline-none"
                maxLength={80}
              />
            </Field>

            <div className="grid grid-cols-2 gap-2">
              <Field label={t("Class", "कक्षा")}>
                <select
                  value={classLevel}
                  onChange={(e) => setClassLevel(e.target.value)}
                  className="w-full rounded-md border border-gray-200 px-2 py-1.5 text-[12.5px] focus:border-emerald-400 focus:outline-none"
                >
                  {CLASSES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </Field>
              <Field label={t("State", "राज्य")}>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full rounded-md border border-gray-200 px-2 py-1.5 text-[12.5px] focus:border-emerald-400 focus:outline-none"
                >
                  {STATES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </Field>
            </div>

            <Field label={t("Interests (pick any)", "रुचियाँ (कोई भी चुनें)")}>
              <div className="flex flex-wrap gap-1.5">
                {INTERESTS_EN.map((i, idx) => {
                  const active = interests.includes(i);
                  return (
                    <button
                      type="button"
                      key={i}
                      onClick={() => toggleInterest(i)}
                      className={`rounded-full border px-2.5 py-1 text-[11px] transition ${
                        active
                          ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                          : "border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {interestsList[idx]}
                    </button>
                  );
                })}
              </div>
            </Field>

            <Field label={t("Learning style", "सीखने का तरीका")}>
              <div className="grid grid-cols-2 gap-1.5">
                {STYLES_EN.map((s, idx) => {
                  const active = learningStyle === s;
                  return (
                    <button
                      type="button"
                      key={s}
                      onClick={() => setLearningStyle(s)}
                      className={`rounded-md border px-2 py-1.5 text-[11.5px] transition ${
                        active
                          ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                          : "border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {stylesList[idx]}
                    </button>
                  );
                })}
              </div>
            </Field>

            <button
              type="submit"
              disabled={loading || !name.trim() || interests.length === 0}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-gradient-to-r from-emerald-600 to-teal-600 px-3 py-2 text-[12.5px] font-semibold text-white shadow-sm transition hover:from-emerald-700 hover:to-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t("Analyzing your fit…", "आपके लिए विश्लेषण किया जा रहा है…")}
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4" />
                  {t("Find my vocational trade", "मेरा व्यावसायिक ट्रेड खोजें")}
                </>
              )}
            </button>
            {error && (
              <div className="rounded-md border border-red-200 bg-red-50 px-2.5 py-1.5 text-[11.5px] text-red-700">
                {error}
              </div>
            )}
          </form>
        </Card>

        <div className="space-y-3 md:col-span-3">
          {!trades && !loading && (
            <Card className="flex h-full items-center justify-center text-center">
              <div className="py-10">
                <Sparkles className="mx-auto mb-2 h-7 w-7 text-emerald-500" />
                <div className="text-[13px] font-medium text-gray-800">
                  {t("Your AI-matched trades will appear here", "आपके AI-मिलान किए गए ट्रेड यहाँ दिखेंगे")}
                </div>
                <div className="mt-1 text-[11.5px] text-gray-500">
                  {t(
                    "Powered by AI · NSQF aligned · India job market",
                    "AI द्वारा · NSQF संरेखित · भारतीय नौकरी बाज़ार",
                  )}
                </div>
              </div>
            </Card>
          )}

          {loading && (
            <Card>
              <div className="flex items-center gap-2 text-[12.5px] text-gray-600">
                <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
                {t(
                  "AI is matching trades to your profile…",
                  "AI आपके प्रोफ़ाइल के अनुसार ट्रेड मिला रहा है…",
                )}
              </div>
            </Card>
          )}

          {trades?.map((tr, i) => (
            <Card key={tr.name + i}>
              <div className="flex items-start gap-3">
                <div
                  className={`flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg text-white shadow-sm ${
                    i === 0
                      ? "bg-gradient-to-br from-emerald-500 to-teal-600"
                      : i === 1
                        ? "bg-gradient-to-br from-blue-500 to-indigo-600"
                        : "bg-gradient-to-br from-amber-500 to-orange-600"
                  }`}
                >
                  <span className="text-[14px] font-bold leading-none">{tr.match}%</span>
                  <span className="text-[8.5px] leading-tight opacity-90">match</span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <div className="text-[14px] font-semibold">{tr.name}</div>
                    {i === 0 && (
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                        {t("Best fit", "सबसे उपयुक्त")}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-[12px] leading-[1.65] text-gray-700">{tr.reason}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px]">
                    <span className="inline-flex items-center gap-1 rounded bg-amber-50 px-2 py-0.5 text-amber-700">
                      <IndianRupee className="h-3 w-3" />
                      {tr.avgSalary}
                    </span>
                    {tr.sampleJobs?.slice(0, 3).map((j) => (
                      <span
                        key={j}
                        className="inline-flex items-center gap-1 rounded bg-gray-100 px-2 py-0.5 text-gray-700"
                      >
                        <Briefcase className="h-3 w-3" />
                        {j}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              {i === 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  <Link
                    to="/student/ai-mentor"
                    className="inline-flex items-center gap-1.5 rounded-md bg-blue-50 px-3 py-1.5 text-[11.5px] font-medium text-blue-700 hover:bg-blue-100"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    {t(`Talk to AI Mentor for ${tr.name}`, `${tr.name} के लिए AI मेंटर से बात करें`)}
                  </Link>
                  <Link
                    to="/student/courses"
                    className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-[11.5px] font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <Award className="h-3.5 w-3.5" />
                    {t("Explore courses", "कोर्स देखें")}
                  </Link>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-gray-500">{label}</span>
      {children}
    </label>
  );
}
