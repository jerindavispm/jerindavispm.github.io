import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, X, Save } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { useContent } from "../../lib/ContentContext";
import { Button, Input, Toast, ConfirmDelete } from "./ui";

/**
 * Languages are simple strings — render as chip grid with inline add/delete.
 */
export default function LanguagesEditor() {
  const { languages, refresh } = useContent();
  const [adding, setAdding] = useState("");
  const [busy, setBusy] = useState(false);
  const [confirm, setConfirm] = useState(null);
  const [toast, setToast] = useState(null);

  async function addLanguage() {
    const v = adding.trim();
    if (!v) return;
    if (languages.includes(v)) {
      setToast({ kind: "err", message: "Already in the list" });
      return;
    }
    setBusy(true);
    const sort_order = (languages.length || 0) + 1;
    const { error } = await supabase.from("languages").insert({ name: v, sort_order });
    setBusy(false);
    if (error) { setToast({ kind: "err", message: error.message }); return; }
    setToast({ kind: "ok", message: "Added" });
    setAdding("");
    refresh();
  }

  async function deleteByName(name) {
    setBusy(true);
    const { error } = await supabase.from("languages").delete().eq("name", name);
    setBusy(false);
    setConfirm(null);
    if (error) { setToast({ kind: "err", message: error.message }); return; }
    setToast({ kind: "ok", message: "Removed" });
    refresh();
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <AnimatePresence initial={false}>
          {languages.map((lang) => (
            <motion.span
              key={lang}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.25 }}
              className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-[13px] text-zinc-100"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-br from-violet-400 to-sky-400" />
              {lang}
              <button
                type="button"
                onClick={() => setConfirm({ name: lang })}
                className="text-zinc-500 hover:text-red-300 transition-colors opacity-0 group-hover:opacity-100"
                aria-label={`Remove ${lang}`}
              >
                <X size={12} />
              </button>
            </motion.span>
          ))}
        </AnimatePresence>
      </div>

      <div className="mt-6 flex items-center gap-2 max-w-md">
        <Input
          value={adding}
          onChange={(e) => setAdding(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addLanguage()}
          placeholder="Add a language…"
        />
        <Button onClick={addLanguage} busy={busy && !confirm} disabled={!adding.trim()}>
          <Plus size={14} strokeWidth={1.8} />
          Add
        </Button>
      </div>

      <ConfirmDelete
        open={!!confirm}
        onCancel={() => setConfirm(null)}
        onConfirm={() => confirm && deleteByName(confirm.name)}
        label={confirm?.name || ""}
      />
      <Toast {...(toast || { message: null })} onDone={() => setToast(null)} />
    </div>
  );
}
