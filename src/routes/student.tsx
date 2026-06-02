import { createFileRoute, Outlet } from "@tanstack/react-router";
import {
  Award,
  BookOpen,
  Brain,
  Briefcase,
  Camera,
  ClipboardCheck,
  Home,
  Languages,
  Map,
  MessageCircle,
  PlayCircle,
  Sparkles,
  UserRound,
  Users,
  Video,
} from "lucide-react";
import { PortalShell, type NavItem } from "@/components/portal/PortalShell";
import { LangProvider } from "@/lib/i18n";

const ICON = "h-3.5 w-3.5";
const items: NavItem[] = [
  { to: "/student", label: "Home", labelHi: "होम", icon: <Home className={ICON} /> },
  { to: "/student/profile", label: "My Profile", labelHi: "मेरी प्रोफ़ाइल", icon: <UserRound className={ICON} /> },
  { to: "/student/courses", label: "My Courses", labelHi: "मेरे कोर्स", icon: <BookOpen className={ICON} /> },
  { to: "/student/course-player", label: "Course Player", labelHi: "कोर्स प्लेयर", icon: <PlayCircle className={ICON} /> },
  {
    to: "/student/live-class",
    label: "Live Class",
    labelHi: "लाइव क्लास",
    icon: <Video className={ICON} />,
    badge: { text: "LIVE", tone: "live" },
  },
  {
    to: "/student/assessments",
    label: "Assessments",
    labelHi: "मूल्यांकन",
    icon: <ClipboardCheck className={ICON} />,
    badge: { text: "2", tone: "count" },
  },
  {
    to: "/student/adaptive-quiz",
    label: "Adaptive Quiz",
    labelHi: "अनुकूली क्विज़",
    icon: <Brain className={ICON} />,
    badge: { text: "AI", tone: "ai-purple" },
  },
  {
    to: "/student/assignment-check",
    label: "Assignment Check",
    labelHi: "असाइनमेंट जाँच",
    icon: <Camera className={ICON} />,
    badge: { text: "AI", tone: "ai-teal" },
  },
  { to: "/student/ai-mentor", label: "AI Mentor", labelHi: "AI मेंटर", icon: <Sparkles className={ICON} /> },
  {
    to: "/student/hindi-mentor",
    label: "AI Hindi Helper",
    labelHi: "AI हिंदी सहायक",
    icon: <Languages className={ICON} />,
    badge: { text: "नया", tone: "new-orange" },
  },
  { to: "/student/career-plan", label: "Career Plan", labelHi: "करियर योजना", icon: <Map className={ICON} /> },
  { to: "/student/certificates", label: "Certificates", labelHi: "प्रमाण-पत्र", icon: <Award className={ICON} /> },
  { to: "/student/jobs", label: "Job Explorer", labelHi: "नौकरी खोज", icon: <Briefcase className={ICON} /> },
  { divider: "Family" },
  {
    to: "/student/parent-assistant",
    label: "Parent Assistant",
    labelHi: "अभिभावक सहायक",
    icon: <Users className={ICON} />,
    badge: { text: "नया", tone: "new-green" },
  },
];

export const Route = createFileRoute("/student")({
  head: () => ({ meta: [{ title: "VocAI Guru — Student Portal" }] }),
  component: () => (
    <LangProvider>
      <PortalShell persona="student" items={items}>
        <Outlet />
      </PortalShell>
    </LangProvider>
  ),
});
