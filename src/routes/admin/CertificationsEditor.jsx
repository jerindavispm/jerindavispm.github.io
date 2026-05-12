import ListEditor from "./ListEditor";
import { useContent } from "../../lib/ContentContext";
import { Field, Input } from "./ui";

export default function CertificationsEditor() {
  const { certifications } = useContent();
  return (
    <ListEditor
      table="certifications"
      items={certifications}
      getTitle={(c) => c.name || "Untitled certification"}
      getSubtitle={(c) => c.date || ""}
      blank={() => ({ name: "", date: "", isOngoing: false })}
      toRow={(d) => ({
        name:       d.name?.trim(),
        date_label: d.date?.trim(),
        is_ongoing: !!d.isOngoing,
      })}
      renderForm={(draft, set) => (
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <Field label="Name">
              <Input value={draft.name} onChange={(e) => set({ ...draft, name: e.target.value })} />
            </Field>
          </div>
          <Field label="Date label" hint='Free text — "Mar 2024", "Ongoing", "Q2 2025"…'>
            <Input value={draft.date} onChange={(e) => set({ ...draft, date: e.target.value })} />
          </Field>
          <Field label="Status">
            <label className="inline-flex items-center gap-2.5 mt-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={!!draft.isOngoing}
                onChange={(e) => set({ ...draft, isOngoing: e.target.checked })}
                className="accent-violet-400 h-4 w-4"
              />
              <span className="text-[13.5px] text-zinc-200">In progress (shows pulsing dot)</span>
            </label>
          </Field>
        </div>
      )}
    />
  );
}
