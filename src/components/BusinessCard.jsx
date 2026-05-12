import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "motion/react";
import { X, MapPin, Mail, Phone, Copy, Check } from "lucide-react";
import { useContent } from "../lib/ContentContext";
import { GithubIcon, LinkedinIcon } from "./BrandIcons";

function ghHandleFromUrl(url) {
  const m = (url || "").match(/github\.com\/([^/?#]+)/i);
  return m ? `@${m[1]}` : "GitHub";
}
function liHandleFromUrl(url) {
  const m = (url || "").match(/linkedin\.com\/in\/([^/?#]+)/i);
  return m ? `/in/${m[1]}` : "LinkedIn";
}

function CopyChip({ value, label }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async (e) => {
        e.stopPropagation();
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 1400);
        } catch (_) {
          /* clipboard not available */
        }
      }}
      className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 text-[10.5px] font-mono uppercase tracking-[0.18em] text-zinc-400 hover:text-zinc-100 hover:border-white/20 transition-colors"
      aria-label={`Copy ${label}`}
    >
      {copied ? <Check size={11} strokeWidth={2.2} /> : <Copy size={11} strokeWidth={2.2} />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function Row({ icon: Icon, label, value, href, external, copyValue }) {
  return (
    <div className="group flex items-center justify-between gap-3 py-3.5 border-b border-white/5 last:border-b-0">
      <div className="flex items-center gap-3 min-w-0">
        <span className="grid place-items-center h-8 w-8 rounded-lg bg-white/[0.04] border border-white/8 text-zinc-300 shrink-0">
          <Icon size={14} strokeWidth={1.7} />
        </span>
        <div className="min-w-0">
          <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-zinc-500">{label}</div>
          {href ? (
            <a
              href={href}
              target={external ? "_blank" : undefined}
              rel={external ? "noreferrer noopener" : undefined}
              className="block text-[14px] text-zinc-100 hover:text-violet-200 transition-colors truncate"
            >
              {value}
            </a>
          ) : (
            <div className="text-[14px] text-zinc-100 truncate">{value}</div>
          )}
        </div>
      </div>
      {copyValue && <CopyChip value={copyValue} label={label} />}
    </div>
  );
}

export default function BusinessCard({ open, onClose }) {
  const { profile } = useContent();
  const cardRef = useRef(null);
  const rotX = useMotionValue(0);
  const rotY = useMotionValue(0);
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const sRotX = useSpring(rotX, { stiffness: 220, damping: 22, mass: 0.4 });
  const sRotY = useSpring(rotY, { stiffness: 220, damping: 22, mass: 0.4 });

  const sheenX = useTransform(mouseX, (v) => `${v * 100}%`);
  const sheenY = useTransform(mouseY, (v) => `${v * 100}%`);
  const sheenBg = useTransform(
    [sheenX, sheenY],
    ([x, y]) =>
      `radial-gradient(circle at ${x} ${y}, rgba(255,255,255,0.5), transparent 45%)`
  );

  function onMove(e) {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    mouseX.set(x);
    mouseY.set(y);
    rotY.set((x - 0.5) * 14);
    rotX.set((0.5 - y) * 12);
  }

  function onLeave() {
    rotX.set(0);
    rotY.set(0);
  }

  // Close on ESC, lock body scroll while open
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] grid place-items-center px-5"
          aria-modal="true"
          role="dialog"
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

          {/* Card wrapper */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 12 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            style={{ perspective: 1200 }}
            className="relative w-full max-w-md"
          >
            <motion.div
              ref={cardRef}
              onMouseMove={onMove}
              onMouseLeave={onLeave}
              style={{
                rotateX: sRotX,
                rotateY: sRotY,
                transformStyle: "preserve-3d",
              }}
              className="relative rounded-3xl overflow-hidden shadow-[0_30px_120px_-20px_rgba(99,102,241,0.55)] will-change-transform"
            >
              {/* Card background — deep gradient */}
              <div className="relative bg-gradient-to-br from-zinc-900 via-zinc-950 to-black p-7 sm:p-8">
                {/* Cursor-tracking sheen */}
                <motion.div
                  className="pointer-events-none absolute inset-0 opacity-70 mix-blend-soft-light"
                  style={{ background: sheenBg }}
                />
                {/* Aurora glow inside card */}
                <div className="pointer-events-none absolute -top-24 -right-16 h-48 w-48 rounded-full bg-violet-500/40 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-24 -left-10 h-48 w-48 rounded-full bg-sky-500/30 blur-3xl" />
                {/* Subtle border highlight */}
                <div className="pointer-events-none absolute inset-0 rounded-3xl border border-white/10" />
                {/* Hairline grid */}
                <div className="pointer-events-none absolute inset-0 hairline-grid opacity-30" />

                <div className="relative">
                  {/* Top row: logo + close */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="grid place-items-center h-9 w-9 rounded-full bg-gradient-to-br from-violet-500 via-indigo-500 to-sky-500 text-white text-[14px] font-semibold tracking-tight shadow-lg shadow-indigo-500/40">
                        JD
                      </span>
                      <div className="flex flex-col leading-tight">
                        <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-zinc-500">
                          Business card
                        </span>
                        <span className="text-[11px] font-mono uppercase tracking-[0.22em] text-zinc-400">
                          v 1 · 2026
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={onClose}
                      aria-label="Close card"
                      className="grid place-items-center h-9 w-9 rounded-full border border-white/10 bg-white/[0.04] text-zinc-300 hover:text-white hover:bg-white/[0.08] transition-colors"
                    >
                      <X size={15} />
                    </button>
                  </div>

                  {/* Name + role */}
                  <div className="mt-9">
                    <div className="text-[10.5px] font-mono uppercase tracking-[0.22em] text-zinc-500">
                      {profile.location}
                    </div>
                    <h3 className="mt-2 text-[34px] sm:text-[40px] leading-[0.98] tracking-[-0.03em] font-medium text-zinc-50">
                      {profile.firstName}{" "}
                      <span className="text-gradient">{profile.lastName}.</span>
                    </h3>
                    <p className="mt-2 text-[13.5px] text-zinc-400">{profile.role}</p>
                  </div>

                  {/* Contact rows */}
                  <div className="mt-7">
                    <Row
                      icon={Mail}
                      label="Email"
                      value={profile.email}
                      href={`mailto:${profile.email}`}
                      copyValue={profile.email}
                    />
                    <Row
                      icon={Phone}
                      label="Phone"
                      value={profile.phone}
                      href={`tel:${profile.phone.replace(/\s/g, "")}`}
                      copyValue={profile.phone}
                    />
                    <Row
                      icon={GithubIcon}
                      label="GitHub"
                      value={ghHandleFromUrl(profile.github)}
                      href={profile.github}
                      external
                    />
                    <Row
                      icon={LinkedinIcon}
                      label="LinkedIn"
                      value={liHandleFromUrl(profile.linkedin)}
                      href={profile.linkedin}
                      external
                    />
                  </div>

                  {/* Footer pill */}
                  <div className="mt-7 flex items-center justify-between">
                    <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-[11px] font-mono uppercase tracking-[0.18em] text-emerald-200">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      </span>
                      Available
                    </div>
                    <div className="inline-flex items-center gap-1.5 text-[11px] text-zinc-500 font-mono">
                      <MapPin size={11} strokeWidth={1.6} />
                      IN · UTC+5:30
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Hint */}
            <div className="mt-4 text-center text-[11px] font-mono uppercase tracking-[0.22em] text-zinc-500">
              Move your cursor over the card · press <span className="text-zinc-300">esc</span> to close
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
