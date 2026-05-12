import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, X, Save, Trash2, Pencil, Check } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { useContent } from "../../lib/ContentContext";
import { Button, AddBtn, Input, Toast, ConfirmDelete } from "./ui";

export default function SkillsEditor() {
  const { skills, refresh } = useContent();
  const [newGroupName, setNewGroupName] = useState(null);
  const [editingName, setEditingName] = useState(null); // group id whose name we're editing
  const [editingDraft, setEditingDraft] = useState("");
  const [newItemDrafts, setNewItemDrafts] = useState({}); // groupId -> string
  const [busy, setBusy] = useState(false);
  const [confirm, setConfirm] = useState(null);
  const [toast, setToast] = useState(null);

  async function addGroup() {
    const v = (newGroupName || "").trim();
    if (!v) return;
    setBusy(true);
    const sort_order = skills.length + 1;
    const { error } = await supabase.from("skill_groups").insert({ name: v, sort_order });
    setBusy(false);
    if (error) { setToast({ kind: "err", message: error.message }); return; }
    setNewGroupName(null);
    refresh();
  }

  async function renameGroup(groupId) {
    const v = editingDraft.trim();
    if (!v) return;
    setBusy(true);
    const { error } = await supabase.from("skill_groups").update({ name: v }).eq("id", groupId);
    setBusy(false);
    if (error) { setToast({ kind: "err", message: error.message }); return; }
    setEditingName(null);
    setEditingDraft("");
    refresh();
  }

  async function deleteGroup(groupId) {
    setBusy(true);
    const { error } = await supabase.from("skill_groups").delete().eq("id", groupId);
    setBusy(false);
    setConfirm(null);
    if (error) { setToast({ kind: "err", message: error.message }); return; }
    refresh();
  }

  async function addItem(groupId) {
    const v = (newItemDrafts[groupId] || "").trim();
    if (!v) return;
    const bucket = skills.find((b) => b.id === groupId);
    if (bucket && bucket.items.includes(v)) {
      setToast({ kind: "err", message: "Already in this group" });
      return;
    }
    setBusy(true);
    const sort_order = (bucket?.items?.length || 0) + 1;
    const { error } = await supabase.from("skill_items").insert({ group_id: groupId, label: v, sort_order });
    setBusy(false);
    if (error) { setToast({ kind: "err", message: error.message }); return; }
    setNewItemDrafts((d) => ({ ...d, [groupId]: "" }));
    refresh();
  }

  async function deleteItem(groupId, label) {
    setBusy(true);
    const { error } = await supabase.from("skill_items").delete().eq("group_id", groupId).eq("label", label);
    setBusy(false);
    if (error) { setToast({ kind: "err", message: error.message }); return; }
    refresh();
  }

  return (
    <div className="space-y-4">
      <AnimatePresence initial={false}>
        {skills.map((bucket) => (
          <motion.div
            key={bucket.id || bucket.group}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5"
          >
            {/* Group header */}
            <div className="flex items-center justify-between gap-3">
              {editingName === bucket.id ? (
                <div className="flex items-center gap-2 flex-1 max-w-md">
                  <Input
                    autoFocus
                    value={editingDraft}
                    onChange={(e) => setEditingDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") renameGroup(bucket.id);
                      if (e.key === "Escape") { setEditingName(null); setEditingDraft(""); }
                    }}
                  />
                  <Button onClick={() => renameGroup(bucket.id)} busy={busy}>
                    <Check size={14} strokeWidth={1.8} />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="text-[16px] text-zinc-100">{bucket.group}</div>
                  <button
                    type="button"
                    onClick={() => { setEditingName(bucket.id); setEditingDraft(bucket.group); }}
                    className="text-zinc-500 hover:text-zinc-200"
                    aria-label="Rename group"
                  >
                    <Pencil size={13} strokeWidth={1.7} />
                  </button>
                </div>
              )}
              <button
                type="button"
                onClick={() => setConfirm({ kind: "group", id: bucket.id, name: bucket.group })}
                className="text-zinc-500 hover:text-red-300 transition-colors"
                aria-label="Delete group"
              >
                <Trash2 size={14} strokeWidth={1.7} />
              </button>
            </div>

            {/* Items */}
            <div className="mt-4 flex flex-wrap gap-2">
              <AnimatePresence initial={false}>
                {bucket.items.map((label) => (
                  <motion.span
                    key={label}
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.85 }}
                    transition={{ duration: 0.2 }}
                    className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-[12.5px] text-zinc-200"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-br from-violet-400 to-sky-400" />
                    {label}
                    <button
                      type="button"
                      onClick={() => deleteItem(bucket.id, label)}
                      className="text-zinc-500 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label={`Remove ${label}`}
                    >
                      <X size={11} />
                    </button>
                  </motion.span>
                ))}
              </AnimatePresence>
            </div>

            {/* Add item */}
            <div className="mt-4 flex items-center gap-2 max-w-sm">
              <Input
                value={newItemDrafts[bucket.id] || ""}
                onChange={(e) =>
                  setNewItemDrafts((d) => ({ ...d, [bucket.id]: e.target.value }))
                }
                onKeyDown={(e) => e.key === "Enter" && addItem(bucket.id)}
                placeholder="Add a skill…"
              />
              <Button onClick={() => addItem(bucket.id)} disabled={!((newItemDrafts[bucket.id] || "").trim())}>
                <Plus size={14} strokeWidth={1.8} />
              </Button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* New group form */}
      <AnimatePresence initial={false}>
        {newGroupName !== null && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="rounded-2xl border border-violet-400/20 bg-violet-500/[0.04] p-5">
              <div className="text-[10.5px] font-mono uppercase tracking-[0.22em] text-violet-200">+ New skill group</div>
              <div className="mt-3 flex items-center gap-2 max-w-md">
                <Input
                  autoFocus
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addGroup()}
                  placeholder="e.g. Cloud & DevOps"
                />
                <Button onClick={addGroup} busy={busy} disabled={!newGroupName.trim()}>
                  <Save size={14} strokeWidth={1.8} />
                </Button>
                <Button variant="secondary" onClick={() => setNewGroupName(null)}>Cancel</Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {newGroupName === null && (
        <AddBtn onClick={() => setNewGroupName("")}>Add new group</AddBtn>
      )}

      <ConfirmDelete
        open={!!confirm}
        onCancel={() => setConfirm(null)}
        onConfirm={() => confirm?.kind === "group" && deleteGroup(confirm.id)}
        label={confirm?.name || ""}
      />
      <Toast {...(toast || { message: null })} onDone={() => setToast(null)} />
    </div>
  );
}
