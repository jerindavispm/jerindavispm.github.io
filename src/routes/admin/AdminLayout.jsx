import { useState } from "react";
import { motion } from "motion/react";
import {
  User, Briefcase, FolderKanban, GraduationCap, Award, Languages as LangIcon,
  Wrench, ListOrdered, LogOut, ExternalLink, RefreshCw, LayoutDashboard
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../lib/AuthContext";
import { useContent } from "../../lib/ContentContext";
import { Button } from "./ui";

import ProfileEditor        from "./ProfileEditor";
import HeroMetaEditor       from "./HeroMetaEditor";
import ExperienceEditor     from "./ExperienceEditor";
import ProjectsEditor       from "./ProjectsEditor";
import SkillsEditor         from "./SkillsEditor";
import CertificationsEditor from "./CertificationsEditor";
import EducationEditor      from "./EducationEditor";
import LanguagesEditor      from "./LanguagesEditor";
import NavEditor            from "./NavEditor";

const SECTIONS = [
  { id: "profile",        label: "Profile",        icon: User,            component: ProfileEditor },
  { id: "hero-meta",      label: "Hero strip",     icon: LayoutDashboard, component: HeroMetaEditor },
  { id: "projects",       label: "Projects",       icon: FolderKanban,    component: ProjectsEditor },
  { id: "experience",     label: "Experience",     icon: Briefcase,       component: ExperienceEditor },
  { id: "skills",         label: "Skills",         icon: Wrench,          component: SkillsEditor },
  { id: "education",      label: "Education",      icon: GraduationCap,   component: EducationEditor },
  { id: "certifications", label: "Certifications", icon: Award,           component: CertificationsEditor },
  { id: "languages",      label: "Languages",      icon: LangIcon,        component: LanguagesEditor },
  { id: "nav",            label: "Nav menu",       icon: ListOrdered,     component: NavEditor },
];

export default function AdminLayout() {
  const { user, signOut } = useAuth();
  const { refresh, loading } = useContent();
  const [activeId, setActiveId] = useState("profile");
  const Active = SECTIONS.find((s) => s.id === activeId)?.component || ProfileEditor;
  const activeLabel = SECTIONS.find((s) => s.id === activeId)?.label;

  return (
    <div className="relative min-h-screen bg-[#0a0a0c] text-zinc-100">
      {/* soft background ambience */}
      <div className="pointer-events-none fixed -top-40 -left-40 h-[420px] w-[420px] rounded-full bg-violet-600/10 blur-[120px]" />
      <div className="pointer-events-none fixed -bottom-40 -right-40 h-[420px] w-[420px] rounded-full bg-sky-600/10 blur-[120px]" />

      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-white/5 bg-[#0a0a0c]/85 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <span className="grid place-items-center h-9 w-9 rounded-2xl bg-gradient-to-br from-violet-500 via-indigo-500 to-sky-500 text-white text-[14px] font-semibold shadow-lg shadow-indigo-500/30">
              JD
            </span>
            <div className="min-w-0">
              <div className="text-[10.5px] font-mono uppercase tracking-[0.22em] text-zinc-500">Portfolio admin</div>
              <div className="text-[13.5px] text-zinc-200 truncate">{user?.email}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={refresh} busy={loading}>
              <RefreshCw size={14} strokeWidth={1.7} />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-xl bg-white/[0.04] border border-white/10 text-zinc-100 hover:bg-white/[0.08] px-3 py-2.5 text-[13.5px] font-medium transition-colors"
              target="_blank"
              rel="noreferrer"
            >
              <ExternalLink size={14} strokeWidth={1.7} />
              <span className="hidden sm:inline">View site</span>
            </Link>
            <Button variant="secondary" onClick={signOut}>
              <LogOut size={14} strokeWidth={1.7} />
              <span className="hidden sm:inline">Sign out</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-8 grid lg:grid-cols-12 gap-6">
        {/* Sidebar */}
        <aside className="lg:col-span-3">
          <nav className="lg:sticky lg:top-24 flex lg:flex-col gap-1.5 overflow-x-auto lg:overflow-visible -mx-5 px-5 lg:mx-0 lg:px-0 pb-2 lg:pb-0">
            {SECTIONS.map((s) => {
              const Icon = s.icon;
              const isActive = activeId === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setActiveId(s.id)}
                  className={`group relative inline-flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-[13.5px] whitespace-nowrap transition-colors ${
                    isActive
                      ? "text-zinc-50 bg-white/[0.06]"
                      : "text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.03]"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="adminTabIndicator"
                      className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-full bg-gradient-to-b from-violet-400 to-sky-400"
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    />
                  )}
                  <Icon size={15} strokeWidth={1.7} className={isActive ? "text-violet-200" : ""} />
                  {s.label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Active editor */}
        <main className="lg:col-span-9">
          <motion.div
            key={activeId}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-3xl border border-white/[0.06] bg-white/[0.02] p-6 sm:p-8"
          >
            <div className="flex items-center justify-between gap-3 mb-7">
              <h1 className="text-[22px] sm:text-[26px] tracking-tight text-zinc-50">{activeLabel}</h1>
              <span className="text-[10.5px] font-mono uppercase tracking-[0.22em] text-zinc-500">
                Edits go live instantly
              </span>
            </div>
            <Active />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
