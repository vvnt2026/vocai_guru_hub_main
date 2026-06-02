import { createFileRoute, Outlet } from "@tanstack/react-router";
import { BarChart3, BookOpen, ClipboardCheck, LayoutDashboard, MessageSquare, Shield, Users, Wand2 } from "lucide-react";
import { PortalShell, type NavItem } from "@/components/portal/PortalShell";

const ICON = "h-3.5 w-3.5";
const items: NavItem[] = [
  { to: "/teacher", label: "Dashboard", icon: <LayoutDashboard className={ICON} /> },
  { to: "/teacher/students", label: "My Students", icon: <Users className={ICON} /> },
  { to: "/teacher/reports", label: "Class Reports", icon: <BarChart3 className={ICON} /> },
  { divider: "AI Studio" },
  { to: "/teacher/course-builder", label: "AI Course Builder", icon: <BookOpen className={ICON} /> },
  { to: "/teacher/lesson-planner", label: "AI Lesson Planner", icon: <Wand2 className={ICON} /> },
  { to: "/teacher/assessment-creator", label: "AI Assessment Creator", icon: <ClipboardCheck className={ICON} /> },
  { to: "/teacher/assignment-review", label: "AI Assignment Review", icon: <Shield className={ICON} /> },
  { to: "/teacher/communications", label: "Communications", icon: <MessageSquare className={ICON} /> },
];

export const Route = createFileRoute("/teacher")({
  head: () => ({ meta: [{ title: "VocAI Guru — Teacher Portal" }] }),
  component: () => (
    <PortalShell persona="teacher" items={items}>
      <Outlet />
    </PortalShell>
  ),
});
