import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, MapPin, Sparkles, ChevronDown } from "lucide-react";
import { useContent } from "../lib/ContentContext";

const easeOut = [0.22, 1, 0.36, 1];

const ROTATING_WORDS = [
  "elegant software",
  "resilient workflows",
  "scalable systems",
  "useful products",
];

const PARTICLES = [
  { left: "8%",  size: 4, dur: 14, delay: 0,   anim: "drift1" },
  { left: "22%", size: 3, dur: 16, delay: 3,   anim: "drift2" },
  { left: "38%", size: 5, dur: 18, delay: 6,   anim: "drift1" },
  { left: "52%", size: 3, dur: 13, delay: 1.5, anim: "drift3" },
  { left: "68%", size: 4, dur: 17, delay: 4,   anim: "drift2" },
  { left: "82%", size: 3, dur: 15, delay: 7,   anim: "drift1" },
  { left: "92%", size: 5, dur: 19, delay: 2,   anim: "drift3" },
];

function AnimatedWord({ children, delay = 0 }) {
  return (
    <span className="inline-block overflow-hidden align-baseline">
      <motion.span
        initial={{ y: "115%" }}
        animate={{ y: "0%" }}
        transition={{ delay, duration: 1.05, ease: easeOut }}
        className="inline-block"
      >
        {children}
      </motion.span>
    </span>
  );
}

export default function Hero() {
  const { profile } = useContent();
  const sectionRef = useRef(null);
  const dotsRef = useRef(null);

  // word rotation
  const [wordIndex, setWordIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(
      () => setWordIndex((p) => (p + 1) % ROTATING_WORDS.length),
      2600
    );
    return () => clearInterval(id);
  }, []);

  function onMove(e) {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect || !dotsRef.current) return;
    dotsRef.current.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    dotsRef.current.style.setProperty("--my", `${e.clientY - rect.top}px`);
  }

  return (
    <section
      id="top"
      ref={sectionRef}
      onMouseMove={onMove}
      className="relative pt-40 pb-32 sm:pt-48 sm:pb-40 overflow-hidden noise"
    >
      {/* Aurora gradient orbs (self-floating) */}
      <div className="aurora" />

      {/* Interactive dot grid — base + cursor-lit overlays */}
      <div ref={dotsRef} className="absolute inset-0">
        <div className="absolute inset-0 dot-base" />
        <div className="absolute inset-0 dot-spot-soft" />
        <div className="absolute inset-0 dot-spot" />
      </div>

      {/* Floating particles */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        {PARTICLES.map((p, i) => (
          <span
            key={i}
            className="particle"
            style={{
              left: p.left,
              bottom: "12%",
              width: `${p.size}px`,
              height: `${p.size}px`,
              animation: `${p.anim} ${p.dur}s ease-in-out ${p.delay}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0a0c] pointer-events-none" />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        {/* Status pill */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.7, ease: easeOut }}
          className="inline-flex items-center gap-2 rounded-full glass-strong px-3.5 py-1.5 text-[11.5px] font-mono uppercase tracking-[0.2em] text-zinc-300"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
          </span>
          {profile.status}
        </motion.div>

        {/* Display name */}
        <h1 className="mt-6 sm:mt-8 font-sans font-medium tracking-[-0.04em] leading-[0.92] text-[clamp(3.6rem,11vw,9.5rem)]">
          <div className="text-zinc-100">
            <AnimatedWord delay={0.15}>{profile.firstName}</AnimatedWord>
          </div>
          <div className="mt-1 sm:mt-2 flex items-end gap-3 sm:gap-5">
            <span className="text-gradient-sweep">
              <AnimatedWord delay={0.3}>{profile.lastName}.</AnimatedWord>
            </span>
            <motion.span
              initial={{ opacity: 0, scale: 0.6, rotate: -20 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ delay: 1.1, duration: 0.8, ease: easeOut }}
              className="hidden sm:block translate-y-[-0.4em] text-violet-300/80"
            >
              <Sparkles className="w-7 h-7 lg:w-9 lg:h-9" strokeWidth={1.4} />
            </motion.span>
          </div>
        </h1>

        {/* Tagline with rotating word */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.9, ease: easeOut }}
          className="mt-8 sm:mt-10 max-w-2xl text-balance text-[17px] sm:text-[19px] leading-relaxed text-zinc-400"
        >
          BCA student in Bangalore building bridges between{" "}
          <span className="text-zinc-100">business processes</span> and{" "}
          <span className="relative inline-flex items-baseline align-baseline overflow-hidden whitespace-nowrap text-zinc-100 min-w-[14ch]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={ROTATING_WORDS[wordIndex]}
                initial={{ y: "115%", opacity: 0, filter: "blur(6px)" }}
                animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
                exit={{ y: "-115%", opacity: 0, filter: "blur(6px)" }}
                transition={{ duration: 0.55, ease: easeOut }}
                className="inline-block text-gradient-sweep"
                style={{
                  fontFamily: "var(--font-serif)",
                  fontStyle: "italic",
                  fontWeight: 400,
                  paddingRight: "0.15em",
                }}
              >
                {ROTATING_WORDS[wordIndex]}
              </motion.span>
            </AnimatePresence>
          </span>
          . Curious about ERP systems, workflow design, and the quiet craft of making organizations run smoothly.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.9, ease: easeOut }}
          className="mt-10 flex flex-wrap items-center gap-3"
        >
          <a
            href="#projects"
            className="group shimmer inline-flex items-center gap-2 rounded-full bg-white text-zinc-950 px-5 py-3 text-[14px] font-medium hover:bg-zinc-100 transition-colors"
          >
            View work
            <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5" />
          </a>
          <a
            href="#contact"
            className="group inline-flex items-center gap-2 rounded-full glass-strong px-5 py-3 text-[14px] font-medium text-zinc-100 hover:bg-white/[0.06] transition-colors"
          >
            Get in touch
          </a>
          <div className="ml-1 inline-flex items-center gap-1.5 text-[12.5px] text-zinc-500 font-mono">
            <MapPin size={12} strokeWidth={1.6} />
            {profile.location}
          </div>
        </motion.div>

        {/* Meta strip */}
        <div className="mt-20 sm:mt-28 grid grid-cols-2 sm:grid-cols-4 gap-px overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02]">
          {[
            { k: "Currently",   v: "BCA · Year 3" },
            { k: "Focus",       v: "ERP & process" },
            { k: "Internship",  v: "UPDOT" },
            { k: "Based in",    v: "Bangalore" },
          ].map((cell, i) => (
            <motion.div
              key={cell.k}
              initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: 1.2 + i * 0.08, duration: 0.65, ease: easeOut }}
              whileHover={{ y: -2 }}
              className="group bg-[#0a0a0c]/80 px-4 sm:px-5 py-4 hover:bg-white/[0.025] transition-colors cursor-default relative overflow-hidden"
            >
              <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/0 to-transparent group-hover:via-violet-400/60 transition-colors" />
              <div className="text-[10.5px] font-mono uppercase tracking-[0.18em] text-zinc-500">{cell.k}</div>
              <div className="mt-1 text-[14px] text-zinc-100">{cell.v}</div>
            </motion.div>
          ))}
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 1 }}
          className="hidden sm:flex flex-col items-center gap-2 mt-14 text-zinc-500"
        >
          <span className="text-[10.5px] font-mono uppercase tracking-[0.22em]">Scroll</span>
          <ChevronDown size={14} strokeWidth={1.6} className="scroll-hint" />
        </motion.div>
      </div>
    </section>
  );
}
