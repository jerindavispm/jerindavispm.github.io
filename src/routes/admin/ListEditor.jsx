import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, Save, Trash2, Plus, X, ChevronUp, ArrowDown } from "lucide-react";
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

  async function move(item, direction) {
    const i = items.findIndex((it) => getKey(it) === getKey(item));
    const j = direction === "up" ? i - 1 : i + 1;
    if (j < 0 || j >= items.length) return;
    const neighbor = items[j];
    setBusyId(getKey(item));
    // Swap sort_orders by index-based reassignment. Two-step write avoids
    // unique-constraint conflicts even though we don't have one today.
    const { error: e1 } = await supabase
      .from(table)
      .update({ sort_order: -1 })
      .eq("id", item.id);
    if (e1) { setBusyId(null); setToast({ kind: "err", message: e1.message }); return; }
    const { error: e2 } = await supabase
      .from(table)
      .update({ sort_order: i + 1 })
      .eq("id", neighbor.id);
    if (e2) { setBusyId(null); setToast({ kind: "err", message: e2.message }); return; }
    const { error: e3 } = await supabase
      .from(table)
      .update({ sort_order: j + 1 })
      .eq("id", item.id);
    setBusyId(null);
    if (e3) { setToast({ kind: "err", message: e3.message }); return; }
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
      {items.map((item, idx) => {
        const key = getKey(item);
        const isOpen = openId === key;
        const draft = drafts[key];
        const canUp = idx > 0;
        const canDown = idx < items.length - 1;
        return (
          <div key={key} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
            <div className="flex items-center hover:bg-white/[0.025] transition-colors">
              {/* Reorder controls */}
              <div className="flex flex-col items-center justify-center gap-px pl-2 pr-1 py-2 shrink-0">
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); move(item, "up"); }}
                  disabled={!canUp || busyId === key}
                  title="Move up"
                  className="grid place-items-center h-6 w-6 rounded-md text-zinc-500 hover:text-zinc-100 hover:bg-white/[0.05] disabled:opacity-25 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronUp size={14} strokeWidth={1.8} />
                </button>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); move(item, "down"); }}
                  disabled={!canDown || busyId === key}
                  title="Move down"
                  className="grid place-items-center h-6 w-6 rounded-md text-zinc-500 hover:text-zinc-100 hover:bg-white/[0.05] disabled:opacity-25 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors"
                >
                  <ArrowDown size={14} strokeWidth={1.8} />
                </button>
              </div>
              <button
                type="button"
                onClick={() => startEdit(item)}
                className="flex-1 min-w-0 px-3 py-4 flex items-center justify-between gap-4 text-left"
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
            </div>

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
