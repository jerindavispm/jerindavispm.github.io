import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, Save, Trash2, Plus, X } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { useContent } from "../../lib/ContentContext";
import { Button, AddBtn, Toast, ConfirmDelete } from "./ui";

/**
 * Reusable CRUD list editor.
 *
 * Props:
 *   table         — Supabase table name
 *   items         — array of items (from useContent)
 *   getKey        — item -> string (for keying React lists; default: item.id)
 *   getTitle      — item -> string (for the collapsed row header)
 *   getSubtitle   — item -> string (for under-the-title meta)
 *   blank         — () -> blank draft for a new item
 *   toRow         — draft -> DB row (column names + values)
 *   renderForm    — (draft, set) -> JSX (the editable fields)
 *   afterSave     — optional callback after a successful save/delete
 */
export default function ListEditor({
  table,
  items,
  getKey = (i) => i.id,
  getTitle,
  getSubtitle,
  blank,
  toRow,
  renderForm,
}) {
  const { refresh } = useContent();
  const [openId, setOpenId] = useState(null);
  const [drafts, setDrafts] = useState({});
  const [newDraft, setNewDraft] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [toast, setToast] = useState(null);

  function startEdit(item) {
    setOpenId(openId === getKey(item) ? null : getKey(item));
    setDrafts((d) => ({ ...d, [getKey(item)]: d[getKey(item)] ?? structuredClone(item) }));
  }
  function setDraft(key, updater) {
    setDrafts((d) => ({ ...d, [key]: typeof updater === "function" ? updater(d[key]) : updater }));
  }
  function cancelEdit(key) {
    setOpenId(null);
    setDrafts((d) => { const c = { ...d }; delete c[key]; return c; });
  }

  async function saveExisting(item) {
    const key = getKey(item);
    const draft = drafts[key];
    setBusyId(key);
    const row = toRow(draft);
    const { error } = await supabase
      .from(table)
      .update(row)
      .eq("id", item.id);
    setBusyId(null);
    if (error) { setToast({ kind: "err", message: error.message }); return; }
    setToast({ kind: "ok", message: "Saved" });
    setOpenId(null);
    setDrafts((d) => { const c = { ...d }; delete c[key]; return c; });
    refresh();
  }

  async function saveNew() {
    setBusyId("new");
    const row = toRow(newDraft);
    const sort_order = (items?.length || 0) + 1;
    const { error } = await supabase.from(table).insert({ ...row, sort_order });
    setBusyId(null);
    if (error) { setToast({ kind: "err", message: error.message }); return; }
    setToast({ kind: "ok", message: "Added" });
    setNewDraft(null);
    refresh();
  }

  async function doDelete(item) {
    setBusyId(getKey(item));
    const { error } = await supabase.from(table).delete().eq("id", item.id);
    setBusyId(null);
    setConfirm(null);
    if (error) { setToast({ kind: "err", message: error.message }); return; }
    setToast({ kind: "ok", message: "Deleted" });
    refresh();
  }

  return (
    <div className="space-y-3">
      {/* New item form */}
      <AnimatePresence initial={false}>
        {newDraft !== null && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="rounded-2xl border border-violet-400/20 bg-violet-500/[0.04] p-5">
              <div className="flex items-center justify-between gap-2">
                <div className="text-[10.5px] font-mono uppercase tracking-[0.22em] text-violet-200">+ New entry</div>
                <button
                  type="button"
                  onClick={() => setNewDraft(null)}
                  className="text-zinc-500 hover:text-zinc-200"
                  aria-label="Cancel"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="mt-4">
                {renderForm(newDraft, (updater) => setNewDraft(typeof updater === "function" ? updater(newDraft) : updater))}
              </div>
              <div className="mt-5 flex justify-end gap-2">
                <Button variant="secondary" onClick={() => setNewDraft(null)}>Cancel</Button>
                <Button onClick={saveNew} busy={busyId === "new"}>
                  <Save size={14} strokeWidth={1.8} />
                  Save
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Existing items */}
      {items.map((item) => {
        const key = getKey(item);
        const isOpen = openId === key;
        const draft = drafts[key];
        return (
          <div key={key} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
            <button
              type="button"
              onClick={() => startEdit(item)}
              className="w-full px-5 py-4 flex items-center justify-between gap-4 hover:bg-white/[0.025] transition-colors text-left"
            >
              <div className="min-w-0">
                <div className="text-[15px] text-zinc-100 truncate">{getTitle(item)}</div>
                {getSubtitle && (
                  <div className="text-[12px] text-zinc-500 mt-0.5 truncate">{getSubtitle(item)}</div>
                )}
              </div>
              <ChevronDown
                size={16}
                className={`shrink-0 text-zinc-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
              />
            </button>

            <AnimatePresence initial={false}>
              {isOpen && draft && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden border-t border-white/5"
                >
                  <div className="p-5 bg-black/20">
                    {renderForm(draft, (updater) => setDraft(key, updater))}
                    <div className="mt-5 flex items-center justify-between gap-2">
                      <Button
                        variant="danger"
                        onClick={() => setConfirm({ item })}
                      >
                        <Trash2 size={14} strokeWidth={1.8} />
                        Delete
                      </Button>
                      <div className="flex gap-2">
                        <Button variant="secondary" onClick={() => cancelEdit(key)}>Cancel</Button>
                        <Button onClick={() => saveExisting(item)} busy={busyId === key}>
                          <Save size={14} strokeWidth={1.8} />
                          Save
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}

      {/* Add button */}
      {newDraft === null && (
        <AddBtn onClick={() => setNewDraft(blank())}>Add new</AddBtn>
      )}

      <ConfirmDelete
        open={!!confirm}
        onCancel={() => setConfirm(null)}
        onConfirm={() => confirm && doDelete(confirm.item)}
        label={confirm ? getTitle(confirm.item) : ""}
      />
      <Toast {...(toast || { message: null })} onDone={() => setToast(null)} />
    </div>
  );
}
