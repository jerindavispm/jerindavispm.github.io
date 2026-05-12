import ListEditor from "./ListEditor";
import { useContent } from "../../lib/ContentContext";
import { Field, Input } from "./ui";

export default function NavEditor() {
  const { nav } = useContent();
  return (
    <ListEditor
      table="nav_items"
      items={nav}
      getTitle={(n) => n.label}
      getSubtitle={(n) => n.href}
      blank={() => ({ label: "", href: "" })}
      toRow={(d) => ({ label: d.label?.trim(), href: d.href?.trim() })}
      renderForm={(draft, set) => (
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Label">
            <Input value={draft.label} onChange={(e) => set({ ...draft, label: e.target.value })} placeholder="Projects" />
          </Field>
          <Field label="Anchor / URL" hint="Use a # anchor like #projects to scroll within the page">
            <Input value={draft.href} onChange={(e) => set({ ...draft, href: e.target.value })} placeholder="#projects" />
          </Field>
        </div>
      )}
    />
  );
}
