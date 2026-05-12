import { motion } from "motion/react";

export default function SectionReveal({
  children,
  delay = 0,
  y = 24,
  duration = 0.9,
  className = "",
  as: Component = "div",
}) {
  const MotionTag = motion[Component] || motion.div;
  return (
    <MotionTag
      initial={{ opacity: 0, y, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      className={className}
    >
      {children}
    </MotionTag>
  );
}
