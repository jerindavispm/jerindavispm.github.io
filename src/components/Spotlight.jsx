import { useRef } from "react";

/**
 * Wraps children with a cursor-tracking radial gradient overlay.
 * Set CSS vars --mx / --my on mousemove; CSS does the rest.
 */
export default function Spotlight({
  children,
  className = "",
  size = 360,
  color = "rgba(167, 139, 250, 0.18)",
  as: Component = "div",
}) {
  const ref = useRef(null);

  function onMove(e) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  }

  return (
    <Component
      ref={ref}
      onMouseMove={onMove}
      className={`group/spot relative ${className}`}
      style={{
        "--spot-size": `${size}px`,
        "--spot-color": color,
      }}
    >
      {children}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover/spot:opacity-100"
        style={{
          background:
            "radial-gradient(var(--spot-size) circle at var(--mx,50%) var(--my,50%), var(--spot-color), transparent 65%)",
        }}
      />
    </Component>
  );
}
