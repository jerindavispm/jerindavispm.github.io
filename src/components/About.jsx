import { useRef } from "react";
import { motion } from "motion/react";
import { GraduationCap, Languages as LangIcon, Compass } from "lucide-react";
import SectionHeader from "./SectionHeader";
import SectionReveal from "./SectionReveal";
import Spotlight from "./Spotlight";
import { profile, education, languages } from "../lib/data";

const easeOut = [0.22, 1, 0.36, 1];

function LanguageChip({ label, index }) {
  const ref = useRef(null);

  function onMove(e) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--cx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--cy", `${e.clientY - rect.top}px`);
  }

  return (
    <motion.span
      ref={ref}
      onMouseMove={onMove}
      initial={{ opacity: 0, y: 12, scale: 0.95, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ delay: 0.1 + index * 0.07, duration: 0.55, ease: easeOut }}
      whileHover={{ scale: 1.06, y: -2 }}
      className="group/lang relative inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-[13px] text-zinc-100 cursor-default overflow-hidden"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-full opacity-0 group-hover/lang:opacity-100 transition-opacity duration-300"
        style={{
          background:
            "radial-gradient(80px circle at var(--cx,50%) var(--cy,50%), rgba(56,189,248,0.35), transparent 60%)",
        }}
      />
      <motion.span
        className="relative h-1.5 w-1.5 rounded-full bg-gradient-to-br from-violet-400 to-sky-400 shadow-[0_0_8px_rgba(167,139,250,0.6)]"
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 2 + index * 0.4, repeat: Infinity, ease: "easeInOut" }}
      />
      <span className="relative">{label}</span>
    </motion.span>
  );
}

function EducationItem({ ed, index, total }) {
  return (
    <motion.li
      initial={{ opacity: 0, x: -16, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-15% 0px" }}
      transition={{ delay: index * 0.12, duration: 0.7, ease: easeOut }}
      className="relative pl-7 pb-7 last:pb-0"
    >
      {/* Timeline dot */}
      <span className="absolute left-0 top-1.5 grid place-items-center h-3 w-3 rounded-full bg-gradient-to-br from-violet-400 to-sky-400 shadow-[0_0_12px_rgba(167,139,250,0.8)]">
        <span className="h-1 w-1 rounded-full bg-zinc-950" />
      </span>
      {/* Timeline line */}
      {index < total - 1 && (
        <motion.span
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25 + index * 0.12, duration: 0.8, ease: easeOut }}
          style={{ transformOrigin: "top" }}
          className="absolute left-[5px] top-5 bottom-0 w-px bg-gradient-to-b from-white/15 to-transparent"
        />
      )}

      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1.5">
        <div>
          <div className="text-[16.5px] text-zinc-100 font-medium leading-tight">
            {ed.degree}
          </div>
          <div className="text-[13.5px] text-zinc-400 mt-1">
            {ed.school}
            {ed.location ? <span className="text-zinc-600"> · {ed.location}</span> : null}
          </div>
        </div>
        {ed.period && (
          <div className="text-[11.5px] font-mono uppercase tracking-[0.18em] text-zinc-500 shrink-0">
            {ed.period}
          </div>
        )}
      </div>
    </motion.li>
  );
}

export default function About() {
  return (
    <section id="about" className="relative py-28 sm:py-36 overflow-hidden">
      {/* Soft background glow */}
      <div className="pointer-events-none absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-[60%] h-[40%] rounded-full bg-violet-500/5 blur-[120px]" />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeader
          eyebrow="About"
          title="Curious about the systems running quietly behind everything."
          description={profile.blurb}
        />

        <div className="mt-16 grid lg:grid-cols-12 gap-6">
          {/* Education with timeline */}
          <SectionReveal className="lg:col-span-7">
            <Spotlight className="rounded-3xl h-full" size={520} color="rgba(167, 139, 250, 0.13)">
              <div className="relative glass rounded-3xl p-6 sm:p-8 h-full overflow-hidden">
                <div className="flex items-center gap-2.5">
                  <GraduationCap size={14} className="text-violet-300" strokeWidth={1.7} />
                  <div className="text-[10.5px] font-mono uppercase tracking-[0.22em] text-zinc-500">
                    Education
                  </div>
                </div>
                <ul className="mt-7">
                  {education.map((ed, i) => (
                    <EducationItem key={i} ed={ed} index={i} total={education.length} />
                  ))}
                </ul>
              </div>
            </Spotlight>
          </SectionReveal>

          {/* Languages + What I'm chasing */}
          <div className="lg:col-span-5 grid gap-6">
            <SectionReveal delay={0.05}>
              <Spotlight className="rounded-3xl" size={420} color="rgba(56, 189, 248, 0.16)">
                <div className="relative glass rounded-3xl p-6 sm:p-8 overflow-hidden">
                  <div className="flex items-center gap-2.5">
                    <LangIcon size={14} className="text-sky-300" strokeWidth={1.7} />
                    <div className="text-[10.5px] font-mono uppercase tracking-[0.22em] text-zinc-500">
                      Languages
                    </div>
                  </div>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {languages.map((lang, i) => (
                      <LanguageChip key={lang} label={lang} index={i} />
                    ))}
                  </div>
                  <div className="mt-5 flex items-center gap-2 text-[12px] text-zinc-500">
                    <span className="h-px w-6 bg-zinc-700" />
                    All fluent · comfortable in client communication
                  </div>
                </div>
              </Spotlight>
            </SectionReveal>

            <SectionReveal delay={0.1}>
              <Spotlight className="rounded-3xl" size={380} color="rgba(167, 139, 250, 0.14)">
                <div className="relative glass rounded-3xl p-6 sm:p-8 overflow-hidden">
                  <div className="flex items-center gap-2.5">
                    <Compass size={14} className="text-violet-300" strokeWidth={1.7} />
                    <div className="text-[10.5px] font-mono uppercase tracking-[0.22em] text-zinc-500">
                      What I'm chasing
                    </div>
                  </div>
                  <p className="mt-5 text-[15.5px] leading-relaxed text-zinc-300">
                    A career in ERP consulting, implementation, or business process optimization — where understanding people and systems matters as much as the code.
                  </p>
                </div>
              </Spotlight>
            </SectionReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
