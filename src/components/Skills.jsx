import { useRef } from "react";
import { motion } from "motion/react";
import SectionHeader from "./SectionHeader";
import SectionReveal from "./SectionReveal";
import { useContent } from "../lib/ContentContext";

const easeOut = [0.22, 1, 0.36, 1];

function Chip({ label, index }) {
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
      initial={{ opacity: 0, y: 14, scale: 0.96, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{
        delay: index * 0.035,
        duration: 0.55,
        ease: easeOut,
      }}
      whileHover={{ scale: 1.06, y: -2 }}
      className="group/chip relative inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/[0.03] px-3.5 py-1.5 text-[13px] text-zinc-200 cursor-default overflow-hidden"
    >
      {/* Cursor-following highlight inside chip */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-full opacity-0 group-hover/chip:opacity-100 transition-opacity duration-300"
        style={{
          background:
            "radial-gradient(80px circle at var(--cx,50%) var(--cy,50%), rgba(167,139,250,0.35), transparent 60%)",
        }}
      />
      {/* Accent dot */}
      <span className="relative h-1.5 w-1.5 rounded-full bg-gradient-to-br from-violet-400 to-sky-400 shadow-[0_0_8px_rgba(167,139,250,0.6)]" />
      <span className="relative">{label}</span>
    </motion.span>
  );
}

export default function Skills() {
  const { skills } = useContent();
  const total = skills.reduce((acc, b) => acc + b.items.length, 0);

  return (
    <section id="skills" className="relative py-28 sm:py-36 border-t border-white/5 overflow-hidden">
      {/* Background subtle gradient blob */}
      <div className="pointer-events-none absolute -top-32 left-1/4 h-80 w-80 rounded-full bg-violet-500/10 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-32 right-1/4 h-80 w-80 rounded-full bg-sky-500/10 blur-[120px]" />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <SectionHeader
            eyebrow="Stack"
            title="The tools I reach for."
          />
          <SectionReveal delay={0.1}>
            <div className="inline-flex items-center gap-3 rounded-2xl glass px-4 py-3">
              <div className="text-[10.5px] font-mono uppercase tracking-[0.22em] text-zinc-500">Total</div>
              <div className="text-[24px] leading-none tracking-tight font-medium text-zinc-50 tabular-nums">
                {total}
              </div>
              <div className="text-[11.5px] text-zinc-400 leading-tight">
                tools across<br/>{skills.length} categories
              </div>
            </div>
          </SectionReveal>
        </div>

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {skills.map((bucket, bi) => (
            <SectionReveal key={bucket.id || bucket.group} delay={bi * 0.06}>
              <div className="group/bucket relative h-full rounded-3xl glass p-7 sm:p-8 hover:bg-white/[0.04] transition-colors duration-500">
                {/* Bucket header */}
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="grid place-items-center h-9 w-9 rounded-xl bg-white/[0.04] border border-white/8 font-mono text-[12px] text-violet-200 tabular-nums">
                      0{bi + 1}
                    </div>
                    <div>
                      <div className="text-[10.5px] font-mono uppercase tracking-[0.22em] text-zinc-500">
                        Category
                      </div>
                      <div className="text-[16px] sm:text-[17px] text-zinc-100 mt-0.5">
                        {bucket.group}
                      </div>
                    </div>
                  </div>
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: 56 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, delay: bi * 0.06, ease: easeOut }}
                    className="h-px bg-gradient-to-r from-violet-400/60 via-indigo-400/40 to-transparent"
                  />
                </div>

                {/* Chips */}
                <div className="mt-7 flex flex-wrap gap-2">
                  {bucket.items.map((item, idx) => (
                    <Chip key={item} label={item} index={bi * 4 + idx} />
                  ))}
                </div>

                {/* Count badge bottom-right */}
                <div className="mt-7 flex items-center gap-2 text-[11px] font-mono text-zinc-500">
                  <span className="tabular-nums">
                    {String(bucket.items.length).padStart(2, "0")}
                  </span>
                  <span className="h-px w-6 bg-zinc-700" />
                  <span className="uppercase tracking-[0.18em]">items</span>
                </div>
              </div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
