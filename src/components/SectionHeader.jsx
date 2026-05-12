import SectionReveal from "./SectionReveal";

export default function SectionHeader({ eyebrow, title, description, align = "left" }) {
  return (
    <div className={align === "center" ? "text-center mx-auto max-w-2xl" : "max-w-3xl"}>
      <SectionReveal>
        <div className="inline-flex items-center gap-2 text-[10.5px] font-mono uppercase tracking-[0.22em] text-zinc-500">
          <span className="h-px w-6 bg-zinc-700" />
          {eyebrow}
        </div>
      </SectionReveal>
      <SectionReveal delay={0.05}>
        <h2 className="mt-4 text-[clamp(2rem,5vw,3.4rem)] leading-[1.02] tracking-[-0.025em] font-medium text-zinc-100">
          {title}
        </h2>
      </SectionReveal>
      {description && (
        <SectionReveal delay={0.1}>
          <p className="mt-5 text-[16px] sm:text-[17px] leading-relaxed text-zinc-400 text-balance">
            {description}
          </p>
        </SectionReveal>
      )}
    </div>
  );
}
