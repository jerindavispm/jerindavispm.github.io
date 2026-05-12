import { useContent } from "../lib/ContentContext";

export default function Marquee() {
  const { marqueeWords } = useContent();
  const words = [...marqueeWords, ...marqueeWords];
  return (
    <section aria-hidden="true" className="relative py-10 border-y border-white/5 overflow-hidden">
      <div className="absolute inset-y-0 left-0 w-24 sm:w-40 bg-gradient-to-r from-[#0a0a0c] to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-24 sm:w-40 bg-gradient-to-l from-[#0a0a0c] to-transparent z-10 pointer-events-none" />
      <div className="flex whitespace-nowrap marquee-track">
        {words.map((w, i) => (
          <span
            key={i}
            className={[
              "px-6 text-[clamp(1.4rem,4vw,2.4rem)] font-medium tracking-tight",
              w === "✦" ? "text-violet-300/60" : "text-zinc-200/80",
              w === "✦" ? "" : "font-sans",
            ].join(" ")}
          >
            {w}
          </span>
        ))}
      </div>
    </section>
  );
}
