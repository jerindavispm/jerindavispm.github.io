import { motion } from "motion/react";
import SectionHeader from "./SectionHeader";
import SectionReveal from "./SectionReveal";
import Spotlight from "./Spotlight";
import { useContent } from "../lib/ContentContext";
import { Briefcase, Award } from "lucide-react";

const easeOut = [0.22, 1, 0.36, 1];

export default function Experience() {
  const { experience, certifications } = useContent();
  return (
    <section id="work" className="relative py-28 sm:py-36 border-t border-white/5">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeader
          eyebrow="Experience"
          title="Coordinating people, projects, and the messy middle in between."
        />

        <div className="mt-16 grid lg:grid-cols-12 gap-6">
          {/* Internship card */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {experience.map((job, i) => (
              <SectionReveal key={job.id || i}>
                <Spotlight className="rounded-3xl" size={520} color="rgba(167, 139, 250, 0.14)">
                <article className="group relative overflow-hidden rounded-3xl glass p-7 sm:p-9 hover:bg-white/[0.04] transition-colors duration-500">
                  <div
                    className="absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(120deg, transparent 30%, rgba(167,139,250,0.25) 50%, transparent 70%)",
                      mask: "linear-gradient(#000, #000) content-box, linear-gradient(#000, #000)",
                      WebkitMask: "linear-gradient(#000, #000) content-box, linear-gradient(#000, #000)",
                      maskComposite: "exclude",
                      WebkitMaskComposite: "xor",
                      padding: "1px",
                    }}
                  />
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="grid place-items-center h-10 w-10 rounded-xl bg-white/5 border border-white/8 text-violet-200">
                        <Briefcase size={16} strokeWidth={1.7} />
                      </div>
                      <div>
                        <div className="text-[11px] font-mono uppercase tracking-[0.22em] text-zinc-500">
                          {job.type} · {job.duration}
                        </div>
                        <h3 className="text-[20px] sm:text-[22px] tracking-tight text-zinc-100 mt-1">
                          {job.role}{" "}
                          <span className="text-zinc-500 font-normal">at</span>{" "}
                          <span className="text-gradient">{job.company}</span>
                        </h3>
                      </div>
                    </div>
                  </div>

                  <p className="mt-6 text-[15.5px] leading-relaxed text-zinc-300 max-w-2xl">
                    {job.summary}
                  </p>

                  <ul className="mt-6 space-y-2.5">
                    {job.highlights.map((h, idx) => (
                      <li key={idx} className="flex gap-3 text-[14.5px] text-zinc-400">
                        <span className="mt-2 h-[3px] w-[3px] rounded-full bg-violet-400/80 shrink-0" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-7 flex flex-wrap gap-2">
                    {job.tools.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-white/8 bg-white/[0.02] px-3 py-1.5 text-[12px] text-zinc-300 font-mono"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </article>
                </Spotlight>
              </SectionReveal>
            ))}
          </div>

          {/* Certifications card */}
          <div className="lg:col-span-4">
            <SectionReveal delay={0.1}>
              <Spotlight className="rounded-3xl h-full" size={420} color="rgba(56, 189, 248, 0.14)">
                <div className="relative glass rounded-3xl p-7 sm:p-8 h-full overflow-hidden">
                  <div className="flex items-center gap-2.5">
                    <Award size={14} className="text-sky-300/80" strokeWidth={1.7} />
                    <div className="text-[10.5px] font-mono uppercase tracking-[0.22em] text-zinc-500">
                      Certifications
                    </div>
                  </div>
                  <ul className="mt-7 space-y-0">
                    {certifications.map((c, i) => (
                      <motion.li
                        key={c.id || i}
                        initial={{ opacity: 0, x: -12, filter: "blur(6px)" }}
                        whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                        viewport={{ once: true, margin: "-10% 0px" }}
                        transition={{ delay: 0.1 + i * 0.1, duration: 0.6, ease: easeOut }}
                        className="relative pl-6 pb-6 last:pb-0"
                      >
                        <span className="absolute left-0 top-2 h-1.5 w-1.5 rounded-full bg-gradient-to-br from-sky-400 to-violet-400 shadow-[0_0_8px_rgba(56,189,248,0.7)]" />
                        {i < certifications.length - 1 && (
                          <motion.span
                            initial={{ scaleY: 0 }}
                            whileInView={{ scaleY: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 + i * 0.1, duration: 0.7, ease: easeOut }}
                            style={{ transformOrigin: "top" }}
                            className="absolute left-[3px] top-4 bottom-0 w-px bg-gradient-to-b from-white/15 to-transparent"
                          />
                        )}
                        <div className="text-[14.5px] text-zinc-100 leading-snug">{c.name}</div>
                        <div className="mt-1.5 inline-flex items-center gap-2 text-[10.5px] font-mono uppercase tracking-[0.2em] text-zinc-500">
                          {c.isOngoing && (
                            <span className="relative flex h-1.5 w-1.5">
                              <span className="absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75 animate-ping" />
                              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-amber-400" />
                            </span>
                          )}
                          {c.date}
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </Spotlight>
            </SectionReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
