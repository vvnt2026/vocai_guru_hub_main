import { Link, useRouterState } from "@tanstack/react-router";
import { ArrowLeft, School, Languages, Menu, X } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { useLang } from "@/lib/i18n";

export type Persona = "student" | "teacher" | "admin";

export type BadgeTone = "live" | "count" | "ai-purple" | "ai-teal" | "new-orange" | "new-green";

export interface NavItem {
  to?: string;
  label?: string;
  labelHi?: string;
  icon?: ReactNode;
  badge?: { text: string; tone: BadgeTone };
  /** Render a section divider with a small label instead of a link */
  divider?: string;
}

const PERSONA_STYLES: Record<
  Persona,
  {
    name: string;
    sidebarBg: string;
    iconBg: string;
    activeBorder: string;
    activeBg: string;
    activeText: string;
    hoverText: string;
    bannerGradient: string;
    bannerText: string;
  }
> = {
  student: {
    name: "Student portal",
    sidebarBg: "bg-gradient-to-b from-emerald-900 via-emerald-950 to-teal-950 text-emerald-50",
    iconBg: "bg-gradient-to-br from-emerald-400 to-teal-500 text-emerald-950 shadow-md",
    activeBorder: "border-l-emerald-300",
    activeBg: "bg-emerald-800/60 shadow-inner",
    activeText: "text-white",
    hoverText: "hover:text-white hover:bg-white/10",
    bannerGradient: "bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700",
    bannerText: "text-emerald-50",
  },
  teacher: {
    name: "Teacher portal",
    sidebarBg: "bg-gradient-to-b from-indigo-900 via-blue-950 to-slate-950 text-blue-50",
    iconBg: "bg-gradient-to-br from-blue-400 to-indigo-500 text-blue-950 shadow-md",
    activeBorder: "border-l-blue-300",
    activeBg: "bg-blue-800/60 shadow-inner",
    activeText: "text-white",
    hoverText: "hover:text-white hover:bg-white/10",
    bannerGradient: "bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700",
    bannerText: "text-blue-50",
  },
  admin: {
    name: "Admin portal",
    sidebarBg: "bg-gradient-to-b from-amber-900 via-orange-950 to-stone-950 text-amber-50",
    iconBg: "bg-gradient-to-br from-amber-400 to-orange-500 text-amber-950 shadow-md",
    activeBorder: "border-l-amber-300",
    activeBg: "bg-amber-800/60 shadow-inner",
    activeText: "text-white",
    hoverText: "hover:text-white hover:bg-white/10",
    bannerGradient: "bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700",
    bannerText: "text-amber-50",
  },
};

const BADGE_STYLES: Record<BadgeTone, string> = {
  live: "bg-red-500 text-white animate-pulse",
  count: "bg-amber-500 text-white",
  "ai-purple": "bg-purple-200 text-purple-900",
  "ai-teal": "bg-teal-200 text-teal-900",
  "new-orange": "bg-orange-200 text-orange-900",
  "new-green": "bg-green-200 text-green-900",
};

export function PortalShell({
  persona,
  items,
  children,
}: {
  persona: Persona;
  items: NavItem[];
  children: ReactNode;
}) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const styles = PERSONA_STYLES[persona];
  const { lang, setLang, t } = useLang();
  const showLang = persona === "student";
  const [open, setOpen] = useState(false);

  // Close drawer when route changes
  useEffect(() => {
    setOpen(false);
  }, [path]);

  const sidebar = (
    <>
      <div className="border-b border-white/10 p-3">
        <div className="mb-2 flex items-center gap-2">
          <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${styles.iconBg}`}>
            <School className="h-4 w-4" />
          </div>
          <div className="leading-tight">
            <div className="text-[12.5px] font-semibold text-white">VocAI Guru</div>
            <div className="text-[10px] text-white/60">{styles.name}</div>
          </div>
        </div>
        <Link
          to="/"
          className="flex items-center gap-1 rounded-md bg-white/10 px-2 py-1 text-[11px] text-white/80 hover:bg-white/20 hover:text-white"
        >
          <ArrowLeft className="h-3 w-3" /> {showLang ? t("Switch persona", "पर्सोना बदलें") : "Switch persona"}
        </Link>
      </div>
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-1.5 py-2">
        {items.map((item, idx) => {
          if (item.divider) {
            return (
              <div key={`d-${idx}`} className="mt-3 border-t border-white/10 px-2.5 pb-1 pt-2 text-[9.5px] font-semibold uppercase tracking-wider text-white/40">
                {item.divider}
              </div>
            );
          }
          const to = item.to!;
          const label = item.label!;
          const active = path === to || (to !== `/${persona}` && path.startsWith(to));
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-2 rounded-md border-l-2 px-2.5 py-2 text-[12.5px] transition-all ${
                active
                  ? `${styles.activeBorder} ${styles.activeBg} ${styles.activeText} font-semibold`
                  : `border-l-transparent text-white/70 ${styles.hoverText}`
              }`}
            >
              <span className="flex h-4 w-4 items-center justify-center">{item.icon}</span>
              <span className="flex-1">{showLang && item.labelHi && lang === "hi" ? item.labelHi : label}</span>
              {item.badge && (
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${BADGE_STYLES[item.badge.tone]}`}
                >
                  {item.badge.text}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-white/10 p-3 text-[10px] text-white/60">
        🇮🇳 Samagra Shiksha · MoE, GoI
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      {/* Desktop sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-30 hidden w-[210px] flex-col border-r border-black/30 md:flex ${styles.sidebarBg}`}>
        {sidebar}
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-40 md:hidden">
          <button
            aria-label="Close menu"
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpen(false)}
          />
          <aside className={`relative flex h-full w-[260px] flex-col border-r border-black/30 ${styles.sidebarBg}`}>
            <button
              onClick={() => setOpen(false)}
              className="absolute right-2 top-2 z-10 rounded-md bg-white/10 p-1 text-white/80 hover:bg-white/20"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
            {sidebar}
          </aside>
        </div>
      )}

      <main className="flex-1 md:ml-[210px]">
        <div className={`flex items-center justify-between gap-3 px-4 py-2.5 text-[11px] ${styles.bannerGradient} ${styles.bannerText}`}>
          <div className="flex min-w-0 items-center gap-2">
            <button
              onClick={() => setOpen(true)}
              className="rounded-md bg-white/15 p-1 text-white hover:bg-white/25 md:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-4 w-4" />
            </button>
            <span className="truncate">
              <span className="font-semibold">{showLang ? t("Samagra Shiksha", "समग्र शिक्षा") : "Samagra Shiksha"}</span>
              <span className="hidden sm:inline">
                {" · "}
                {showLang ? t("Ministry of Education, Government of India", "शिक्षा मंत्रालय, भारत सरकार") : "Ministry of Education, Government of India"}
              </span>
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {showLang && (
              <div className="flex items-center gap-1 rounded-full bg-white/15 p-0.5 text-[10px] font-medium">
                <Languages className="ml-1.5 h-3 w-3" />
                <button
                  onClick={() => setLang("en")}
                  className={`rounded-full px-2 py-0.5 transition ${lang === "en" ? "bg-white text-emerald-700" : "text-white/90 hover:text-white"}`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLang("hi")}
                  className={`rounded-full px-2 py-0.5 transition ${lang === "hi" ? "bg-white text-emerald-700" : "text-white/90 hover:text-white"}`}
                >
                  हिं
                </button>
              </div>
            )}
            <span className="hidden rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-medium md:inline-block">NSQF {showLang ? t("Aligned", "संरेखित") : "Aligned"}</span>
          </div>
        </div>
        <div className="p-4 sm:p-5">{children}</div>
      </main>
    </div>
  );
}

export function StatCard({
  icon,
  label,
  value,
  valueColor = "text-gray-900",
  sub,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  valueColor?: string;
  sub?: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-gray-100 bg-white p-3 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div className={`absolute inset-x-0 top-0 h-0.5 bg-current opacity-70 ${valueColor}`} />
      <div className="mb-1 flex items-center gap-1.5 text-[12px] text-gray-500">
        <span className={valueColor}>{icon}</span>
        {label}
      </div>
      <div className={`text-[22px] font-semibold leading-tight ${valueColor}`}>{value}</div>
      {sub && <div className="mt-0.5 text-[11px] text-gray-500">{sub}</div>}
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-gray-100 bg-white p-4 shadow-sm ${className}`}>{children}</div>
  );
}

export function Badge({
  children,
  tone = "gray",
}: {
  children: ReactNode;
  tone?: "gray" | "green" | "blue" | "amber" | "red";
}) {
  const tones: Record<string, string> = {
    gray: "bg-gray-100 text-gray-700",
    green: "bg-emerald-50 text-emerald-700",
    blue: "bg-blue-50 text-blue-700",
    amber: "bg-amber-50 text-amber-700",
    red: "bg-red-50 text-red-600",
  };
  return (
    <span className={`inline-block rounded px-2 py-0.5 text-[11px] font-medium ${tones[tone]}`}>
      {children}
    </span>
  );
}
