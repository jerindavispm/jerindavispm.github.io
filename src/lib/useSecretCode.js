import { useEffect, useRef } from "react";

/**
 * Watches for a typed letter sequence anywhere on the page and fires `onMatch`
 * when the user types the full string in order, with no more than `timeout`ms
 * between keystrokes. Ignores keystrokes while focus is in inputs/textareas/
 * contenteditable.
 */
export function useSecretCode(sequence, onMatch, { timeout = 1500 } = {}) {
  const cbRef = useRef(onMatch);
  useEffect(() => { cbRef.current = onMatch; }, [onMatch]);

  useEffect(() => {
    const target = (sequence || "").toLowerCase();
    if (!target) return;
    let idx = 0;
    let timer = null;

    const reset = () => {
      idx = 0;
      if (timer) { clearTimeout(timer); timer = null; }
    };

    const onKey = (e) => {
      // Don't intercept typing inside inputs / textareas / editable fields
      const t = e.target;
      const tag = t?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea" || t?.isContentEditable) return;
      // Ignore modifier-driven shortcuts (cmd/ctrl/alt)
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      // Ignore non-character keys (arrow keys, F-keys, etc.)
      if (!e.key || e.key.length !== 1) return;

      const k = e.key.toLowerCase();

      if (k === target[idx]) {
        idx++;
        if (idx === target.length) {
          reset();
          cbRef.current?.();
          return;
        }
      } else if (k === target[0]) {
        // Wrong letter, but it matches the start — count it as restart
        idx = 1;
      } else {
        idx = 0;
      }

      if (timer) clearTimeout(timer);
      timer = setTimeout(reset, timeout);
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      reset();
    };
  }, [sequence, timeout]);
}
