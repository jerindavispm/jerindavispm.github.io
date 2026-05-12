import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, IdCard } from "lucide-react";
import { nav, profile } from "../lib/data";

export default function Nav({ onOpenCard }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -32, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8 pt-4">
        <div
          className={[
            "flex items-center justify-between rounded-full px-4 sm:px-6 py-3 transition-all duration-500",
            scrolled
              ? "glass-strong shadow-[0_8px_40px_-12px_rgba(0,0,0,0.6)]"
              : "border border-transparent",
          ].join(" ")}
        >
          <a href="#top" className="group flex items-center gap-2.5">
            <span className="relative grid place-items-center w-8 h-8 rounded-full bg-gradient-to-br from-violet-500/90 via-indigo-500/90 to-sky-500/90 text-white text-[13px] font-semibold tracking-tight">
              <span className="relative z-10">JD</span>
              <span className="absolute inset-0 rounded-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </span>
            <span className="hidden sm:flex flex-col leading-none">
              <span className="text-[13px] font-medium tracking-tight text-zinc-100">{profile.name}</span>
              <span className="text-[10.5px] font-mono uppercase tracking-[0.18em] text-zinc-500">portfolio · 2026</span>
            </span>
          </a>

          <nav className="hidden md:flex items-center gap-1">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="relative px-3.5 py-1.5 text-[13.5px] text-zinc-400 hover:text-zinc-100 transition-colors duration-300"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenCard}
              aria-label="Open business card"
              className="group inline-flex items-center gap-2 rounded-full glass-strong px-3.5 py-1.5 text-[13px] font-medium text-zinc-200 hover:text-white hover:bg-white/[0.08] transition-colors"
            >
              <IdCard size={14} strokeWidth={1.7} className="text-violet-300 group-hover:text-violet-200 transition-colors" />
              Card
            </button>
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex items-center gap-2 rounded-full bg-white text-zinc-950 px-4 py-1.5 text-[13px] font-medium hover:bg-zinc-200 transition-colors"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </span>
              Get in touch
            </a>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenCard}
              aria-label="Open business card"
              className="grid place-items-center w-9 h-9 rounded-full glass-strong text-violet-200"
            >
              <IdCard size={15} strokeWidth={1.7} />
            </button>
            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setOpen((v) => !v)}
              className="grid place-items-center w-9 h-9 rounded-full glass-strong text-zinc-200"
            >
              {open ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="md:hidden mx-auto max-w-6xl px-5 sm:px-8 mt-3"
          >
            <div className="glass-strong rounded-3xl p-3 flex flex-col">
              {nav.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="px-4 py-3 text-zinc-300 hover:text-white border-b border-white/5 last:border-b-0"
                >
                  {item.label}
                </a>
              ))}
              <a
                href={`mailto:${profile.email}`}
                onClick={() => setOpen(false)}
                className="mt-2 mx-1 mb-1 inline-flex items-center justify-center gap-2 rounded-full bg-white text-zinc-950 px-4 py-3 text-sm font-medium"
              >
                Get in touch
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
