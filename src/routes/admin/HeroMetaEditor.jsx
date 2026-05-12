import ListEditor from "./ListEditor";
import { useContent } from "../../lib/ContentContext";
import { Field, Input } from "./ui";

export default function HeroMetaEditor() {
  const { heroMeta } = useContent();
  return (
    <ListEditor
      table="hero_meta"
      items={heroMeta}
      getTitle={(m) => m.value || "Untitled"}
      getSubtitle={(m) => m.label}
      blank={() => ({ label: "", value: "" })}
      toRow={(d) => ({ label: d.label?.trim(), value: d.value?.trim() })}
      renderForm={(draft, set) => (
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Label" hint="Small uppercase label (e.g. Currently, Focus)">
            <Input value={draft.label} onChange={(e) => set({ ...draft, label: e.target.value })} placeholder="Currently" />
          </Field>
          <Field label="Value" hint="Larger text under the label">
            <Input value={draft.value} onChange={(e) => set({ ...draft, value: e.target.value })} placeholder="BCA · Year 3" />
          </Field>
        </div>
      )}
    />
  );
}
