import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Building2, FileText, PieChart as PieIcon } from "lucide-react";
import { PortalShell, type NavItem } from "@/components/portal/PortalShell";

const ICON = "h-3.5 w-3.5";
const items: NavItem[] = [
  { to: "/admin", label: "District Overview", icon: <PieIcon className={ICON} /> },
  { to: "/admin/schools", label: "School Performance", icon: <Building2 className={ICON} /> },
  { to: "/admin/reports", label: "Gov. Reports", icon: <FileText className={ICON} /> },
];

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "VocAI Guru — Admin Portal" }] }),
  component: () => (
    <PortalShell persona="admin" items={items}>
      <Outlet />
    </PortalShell>
  ),
});
