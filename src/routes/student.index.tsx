import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Award,
  CheckCircle2,
  ClipboardCheck,
  Flame,
  LineChart as LineIcon,
  Sparkles,
  UserRound,
  Video,
} from "lucide-react";
import { Card, StatCard } from "@/components/portal/PortalShell";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/student/")({
  component: StudentHome,
});

function StudentHome() {
  const { t } = useLang();
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 p-3">
        <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-blue-500" />
        <p className="text-[13px] leading-[1.65] text-blue-800">
          {t(
            "Good morning, Priya! You have 2 pending assessments and your IT Fundamentals course is 68% complete. You're on track for NSQF Level 3 certification!",
            "सुप्रभात, प्रिया! आपके 2 मूल्यांकन बाकी हैं और IT फंडामेंटल्स कोर्स 68% पूर्ण है। आप NSQF स्तर 3 प्रमाणन के लिए सही राह पर हैं!",
          )}{" "}
          <Link to="/student/ai-mentor" className="font-medium underline">
            {t("Ask your AI Mentor →", "AI मेंटर से पूछें →")}
          </Link>
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-emerald-200 bg-gradient-to-r from-emerald-50 via-white to-teal-50 p-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-sm">
          <UserRound className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <div className="text-[13px] font-semibold text-emerald-900">
            {t("New here? Find your best vocational trade", "नए हैं? अपना सर्वोत्तम व्यावसायिक ट्रेड खोजें")}
          </div>
          <div className="text-[11.5px] text-emerald-800/80">
            {t(
              "AI-matched to your interests, class, and India's job market.",
              "आपकी रुचि, कक्षा और भारत के नौकरी बाज़ार के अनुसार AI-मिलान।",
            )}
          </div>
        </div>
        <Link
          to="/student/profile"
          className="rounded-md bg-gradient-to-r from-emerald-600 to-teal-600 px-3 py-1.5 text-[11.5px] font-semibold text-white shadow-sm hover:from-emerald-700 hover:to-teal-700"
        >
          {t("Find my trade →", "मेरा ट्रेड खोजें →")}
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        <StatCard
          icon={<LineIcon className="h-3.5 w-3.5" />}
          label={t("Course progress", "कोर्स प्रगति")}
          value="68%"
          valueColor="text-emerald-600"
          sub={t("IT Fundamentals", "IT फंडामेंटल्स")}
        />
        <StatCard
          icon={<ClipboardCheck className="h-3.5 w-3.5" />}
          label={t("Assessments done", "पूर्ण मूल्यांकन")}
          value="4 / 6"
          valueColor="text-blue-600"
          sub={t("2 pending", "2 बाकी")}
        />
        <StatCard
          icon={<Flame className="h-3.5 w-3.5" />}
          label={t("Study streak", "अध्ययन सिलसिला")}
          value={t("12 days", "12 दिन")}
          valueColor="text-amber-600"
          sub={t("Personal best!", "व्यक्तिगत सर्वश्रेष्ठ!")}
        />
        <StatCard
          icon={<Award className="h-3.5 w-3.5" />}
          label={t("NSQF level", "NSQF स्तर")}
          value={t("Level 3", "स्तर 3")}
          valueColor="text-emerald-600"
          sub={t("In progress", "प्रगति में")}
        />
      </div>

      <div className="grid gap-2.5 md:grid-cols-2">
        <Card>
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-red-600">
            <span className="h-2 w-2 rounded-full bg-red-500" /> {t("LIVE NOW", "अभी लाइव")}
          </div>
          <div className="mt-1 text-[14px] font-medium">{t("HTML & CSS — Module 5", "HTML व CSS — मॉड्यूल 5")}</div>
          <div className="mb-2 text-[12px] text-gray-500">{t("Today 3:00 PM · Rajesh Kumar Sir", "आज 3:00 बजे · राजेश कुमार सर")}</div>
          <Link
            to="/student/live-class"
            className="block w-full rounded-md bg-gradient-to-r from-emerald-600 to-green-600 py-1.5 text-center text-[12px] font-semibold text-white shadow-sm hover:from-emerald-700 hover:to-green-700"
          >
            {t("Join live class →", "लाइव क्लास में शामिल हों →")}
          </Link>
        </Card>
        <Card>
          <span className="inline-block rounded bg-red-50 px-2 py-0.5 text-[11px] font-medium text-red-600">
            {t("Due today", "आज नियत")}
          </span>
          <div className="mt-1.5 text-[14px] font-medium">{t("IT Fundamentals Quiz — Unit 4", "IT फंडामेंटल्स क्विज़ — यूनिट 4")}</div>
          <div className="mb-2 text-[12px] text-gray-500">{t("20 questions · 30 min · MCQ", "20 प्रश्न · 30 मिनट · MCQ")}</div>
          <Link
            to="/student/assessments"
            className="block w-full rounded-md bg-gradient-to-r from-emerald-600 to-green-600 py-1.5 text-center text-[12px] font-semibold text-white shadow-sm hover:from-emerald-700 hover:to-green-700"
          >
            {t("Start assessment →", "मूल्यांकन शुरू करें →")}
          </Link>
        </Card>
      </div>

      <Card>
        <div className="mb-2 text-[13px] font-medium">{t("Recent activity", "हाल की गतिविधि")}</div>
        <div className="divide-y divide-gray-100">
          {[
            { icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" />, t: t("Completed Module 4: MS Office Essentials", "मॉड्यूल 4 पूर्ण: MS Office आवश्यकताएँ"), w: t("2 hrs ago", "2 घंटे पहले") },
            { icon: <Award className="h-4 w-4 text-amber-500" />, t: t("Earned badge: Digital Literacy Level 2", "बैज अर्जित: डिजिटल साक्षरता स्तर 2"), w: t("Yesterday", "कल") },
            { icon: <Video className="h-4 w-4 text-blue-500" />, t: t("Watched: Introduction to HTML — 45 min", "देखा: HTML का परिचय — 45 मिनट"), w: t("Yesterday", "कल") },
            { icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" />, t: t("Scored 92% in Internet Safety Assessment", "इंटरनेट सुरक्षा मूल्यांकन में 92% अंक"), w: t("3 days ago", "3 दिन पहले") },
          ].map((r, i) => (
            <div key={i} className="flex items-center gap-2 py-2 text-[12px]">
              {r.icon}
              <span className="flex-1">{r.t}</span>
              <span className="text-[11px] text-gray-500">{r.w}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
