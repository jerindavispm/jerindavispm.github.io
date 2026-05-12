import { motion } from "motion/react";
import SectionHeader from "./SectionHeader";
import SectionReveal from "./SectionReveal";
import Spotlight from "./Spotlight";
import { projects } from "../lib/data";
import { ArrowUpRight } from "lucide-react";

function ProjectCard({ project, index }) {
  return (
    <SectionReveal delay={index * 0.05}>
      <Spotlight className="rounded-3xl" size={480} color="rgba(167, 139, 250, 0.16)">
      <motion.article
        whileHover="hover"
        className="group relative isolate overflow-hidden rounded-3xl border border-white/[0.06] bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-7 sm:p-10 transition-all duration-500 hover:border-white/[0.12]"
      >
        {/* Hover spotlight */}
        <motion.div
          variants={{
            hover: { opacity: 1, scale: 1 },
          }}
          initial={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="absolute -top-32 -right-32 h-80 w-80 rounded-full bg-gradient-to-br from-violet-500/20 via-indigo-500/10 to-transparent blur-3xl pointer-events-none"
        />

        <div className="relative flex flex-col h-full min-h-[280px] sm:min-h-[320px]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-[11px] font-mono uppercase tracking-[0.22em] text-zinc-500">
                {project.tag} · {project.year}
              </div>
              <h3 className="mt-3 text-[26px] sm:text-[30px] leading-[1.05] tracking-[-0.025em] font-medium text-zinc-50">
                {project.name}
              </h3>
            </div>

            <motion.div
              variants={{ hover: { rotate: 45, x: 4, y: -4 } }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="grid place-items-center h-10 w-10 rounded-full border border-white/8 bg-white/[0.03] text-zinc-300 group-hover:text-white group-hover:border-white/20 transition-colors"
            >
              <ArrowUpRight size={16} strokeWidth={1.6} />
            </motion.div>
          </div>

          <p className="mt-5 text-[15px] leading-relaxed text-zinc-400 max-w-xl">
            {project.summary}
          </p>

          <div className="mt-auto pt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
            <div className="inline-flex items-center gap-1.5 text-[12px] font-mono text-zinc-500">
              <span className="h-1 w-1 rounded-full bg-zinc-600" />
              {project.role}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {project.stack.map((s) => (
                <span
                  key={s}
                  className="rounded-md border border-white/8 bg-white/[0.02] px-2.5 py-1 text-[11.5px] font-mono text-zinc-300"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.article>
      </Spotlight>
    </SectionReveal>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="relative py-28 sm:py-36 border-t border-white/5">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeader
          eyebrow="Selected projects"
          title="Things I've built, broken, and shipped."
          description="A small but growing collection of projects spanning ATS-focused machine learning, collaborative web platforms, and the occasional weekend experiment."
        />

        <div className="mt-14 grid md:grid-cols-2 gap-6">
          {projects.map((p, i) => (
            <ProjectCard key={p.name} project={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
