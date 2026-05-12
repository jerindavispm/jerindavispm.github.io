import { useState, useRef, useEffect } from "react";
import { X, Plus, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function Field({ label, hint, children }) {
  return (
    <label className="block">
      <span className="text-[10.5px] font-mono uppercase tracking-[0.22em] text-zinc-500">{label}</span>
      <div className="mt-1.5">{children}</div>
      {hint && <div className="mt-1 text-[11.5px] text-zinc-600">{hint}</div>}
    </label>
  );
}

const inputBase =
  "w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5 text-[14px] text-zinc-100 placeholder-zinc-600 outline-none focus:border-violet-400/40 focus:bg-white/[0.06] transition-colors";

export function Input(props) {
  return <input {...props} className={`${inputBase} ${props.className || ""}`} />;
}

export function Textarea(props) {
  return (
    <textarea
      {...props}
      className={`${inputBase} min-h-[88px] leading-relaxed resize-y ${props.className || ""}`}
    />
  );
}

export function Button({ variant = "primary", busy, children, className = "", ...rest }) {
  const styles = {
    primary:
      "bg-white text-zinc-950 hover:bg-zinc-100 disabled:opacity-60 disabled:cursor-not-allowed",
    secondary:
      "bg-white/[0.04] border border-white/10 text-zinc-100 hover:bg-white/[0.08] hover:border-white/20",
    ghost:
      "text-zinc-400 hover:text-zinc-100",
    danger:
      "bg-red-500/15 border border-red-500/25 text-red-200 hover:bg-red-500/25",
  };
  return (
    <button
      {...rest}
      disabled={busy || rest.disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-[13.5px] font-medium transition-colors ${styles[variant]} ${className}`}
    >
      {busy && <Loader2 size={14} className="animate-spin" />}
      {children}
    </button>
  );
}

export function TagsField({ value = [], onChange, placeholder = "Type and press Enter" }) {
  const [draft, setDraft] = useState("");
  const inputRef = useRef(null);

  function commit() {
    const v = draft.trim();
    if (!v) return;
    if (value.includes(v)) {
      setDraft("");
      return;
    }
    onChange([...value, v]);
    setDraft("");
  }

  function onKey(e) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      commit();
    } else if (e.key === "Backspace" && !draft && value.length) {
      onChange(value.slice(0, -1));
    }
  }

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className="bg-white/[0.04] border border-white/10 rounded-xl px-2 py-2 flex flex-wrap gap-1.5 cursor-text focus-within:border-violet-400/40 focus-within:bg-white/[0.06] transition-colors"
    >
      {value.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/[0.05] px-2 py-1 text-[12px] text-zinc-200"
        >
          {tag}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onChange(value.filter((v) => v !== tag));
            }}
            className="text-zinc-500 hover:text-red-300"
            aria-label={`Remove ${tag}`}
          >
            <X size={11} />
          </button>
        </span>
      ))}
      <input
        ref={inputRef}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={onKey}
        onBlur={commit}
        placeholder={value.length ? "" : placeholder}
        className="flex-1 min-w-[120px] bg-transparent text-[13.5px] text-zinc-100 placeholder-zinc-600 outline-none px-1 py-0.5"
      />
    </div>
  );
}

export function Toast({ message, kind = "ok", onDone }) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onDone, 2400);
    return () => clearTimeout(t);
  }, [message, onDone]);

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.97 }}
          transition={{ duration: 0.25 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200]"
        >
          <div
            className={`glass-strong rounded-full px-5 py-2.5 text-[13px] font-mono uppercase tracking-[0.18em] ${
              kind === "err" ? "text-red-200" : "text-emerald-200"
            }`}
          >
            {message}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function AddBtn({ children = "Add new", ...rest }) {
  return (
    <button
      type="button"
      {...rest}
      className="inline-flex items-center gap-2 rounded-xl border border-dashed border-white/15 bg-white/[0.02] px-4 py-2.5 text-[13.5px] text-zinc-300 hover:text-zinc-50 hover:border-violet-300/40 hover:bg-white/[0.04] transition-colors"
    >
      <Plus size={14} strokeWidth={1.8} />
      {children}
    </button>
  );
}

export function ConfirmDelete({ open, onCancel, onConfirm, label = "this item" }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[150] grid place-items-center px-5"
          onClick={onCancel}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-sm glass-strong rounded-3xl p-6"
          >
            <div className="text-[10.5px] font-mono uppercase tracking-[0.22em] text-zinc-500">
              Delete
            </div>
            <p className="mt-3 text-[15px] text-zinc-100">
              Delete <span className="text-red-200">{label}</span>? This can't be undone.
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="secondary" onClick={onCancel}>
                Cancel
              </Button>
              <Button variant="danger" onClick={onConfirm}>
                Delete
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
