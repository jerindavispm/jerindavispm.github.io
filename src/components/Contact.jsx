import { motion } from "motion/react";
import SectionReveal from "./SectionReveal";
import Spotlight from "./Spotlight";
import { useContent } from "../lib/ContentContext";
import { Mail, Phone, ArrowUpRight } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./BrandIcons";

const easeOut = [0.22, 1, 0.36, 1];

function ghHandleFromUrl(url) {
  const m = (url || "").match(/github\.com\/([^/?#]+)/i);
  return m ? `@${m[1]}` : "GitHub";
}
function liHandleFromUrl(url) {
  const m = (url || "").match(/linkedin\.com\/in\/([^/?#]+)/i);
  return m ? `/in/${m[1]}` : "LinkedIn";
}

export default function Contact() {
  const { profile } = useContent();
  const items = [
    { icon: Mail,         label: "Email",    value: profile.email, href: `mailto:${profile.email}` },
    { icon: Phone,        label: "Phone",    value: profile.phone, href: `tel:${profile.phone.replace(/\s/g, "")}` },
    { icon: GithubIcon,   label: "GitHub",   value: ghHandleFromUrl(profile.github),   href: profile.github,   external: true },
    { icon: LinkedinIcon, label: "LinkedIn", value: liHandleFromUrl(profile.linkedin), href: profile.linkedin, external: true },
  ];
  return (
    <section id="contact" className="relative py-28 sm:py-40 border-t border-white/5 overflow-hidden">
      {/* Subtle glow */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[60%] rounded-full bg-gradient-to-br from-violet-600/20 via-indigo-600/10 to-sky-500/10 blur-[120px] pointer-events-none" />

      <div className="relative mx-auto max-w-5xl px-5 sm:px-8 text-center">
        <SectionReveal>
          <div className="inline-flex items-center gap-2 text-[10.5px] font-mono uppercase tracking-[0.22em] text-zinc-500">
            <span className="h-px w-6 bg-zinc-700" />
            Contact
            <span className="h-px w-6 bg-zinc-700" />
          </div>
        </SectionReveal>

        <SectionReveal delay={0.05}>
          <h2
            className="mt-6 text-[clamp(2.4rem,7vw,5.6rem)] leading-[0.98] tracking-[-0.035em] font-medium"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            <span className="text-zinc-100">Let's build </span>
            <span className="text-gradient" style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}>
              something
            </span>
            <span className="text-zinc-100"> meaningful.</span>
          </h2>
        </SectionReveal>

        <SectionReveal delay={0.1}>
          <p className="mt-7 mx-auto max-w-xl text-[16px] sm:text-[17px] leading-relaxed text-zinc-400">
            Open to internships, junior roles, and conversations around ERP, business process, and software craft. Reach out — I'm friendly.
          </p>
        </SectionReveal>

        <SectionReveal delay={0.15}>
          <motion.a
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            href={`mailto:${profile.email}`}
            className="shimmer mt-10 inline-flex items-center gap-3 rounded-full bg-white text-zinc-950 px-7 py-4 text-[15px] font-medium hover:bg-zinc-100 transition-colors"
          >
            Email me
            <ArrowUpRight size={18} strokeWidth={1.8} />
          </motion.a>
        </SectionReveal>

        <SectionReveal delay={0.2}>
          <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-left">
            {items.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.a
                  key={item.label}
                  href={item.href}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noreferrer noopener" : undefined}
                  initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
                  whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  viewport={{ once: true, margin: "-5% 0px" }}
                  transition={{ delay: 0.05 + i * 0.08, duration: 0.6, ease: easeOut }}
                  whileHover={{ y: -3 }}
                  className="block"
                >
                  <Spotlight className="rounded-2xl h-full block" size={300} color="rgba(167, 139, 250, 0.2)">
                    <div className="group relative h-full rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 hover:border-white/[0.14] hover:bg-white/[0.04] transition-all duration-300 overflow-hidden">
                      <div className="flex items-center justify-between">
                        <span className="grid place-items-center h-9 w-9 rounded-xl bg-white/[0.04] border border-white/8 text-zinc-300 group-hover:text-violet-200 group-hover:border-violet-300/30 transition-colors">
                          <Icon size={15} strokeWidth={1.7} />
                        </span>
                        <ArrowUpRight size={14} className="text-zinc-600 group-hover:text-zinc-200 group-hover:rotate-12 transition-all" />
                      </div>
                      <div className="mt-7">
                        <div className="text-[10.5px] font-mono uppercase tracking-[0.22em] text-zinc-500">{item.label}</div>
                        <div className="mt-1.5 text-[14.5px] text-zinc-100 break-all">{item.value}</div>
                      </div>
                    </div>
                  </Spotlight>
                </motion.a>
              );
            })}
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
