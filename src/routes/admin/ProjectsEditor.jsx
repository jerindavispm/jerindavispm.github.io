import ListEditor from "./ListEditor";
import { useContent } from "../../lib/ContentContext";
import { Field, Input, Textarea, TagsField } from "./ui";

export default function ProjectsEditor() {
  const { projects } = useContent();

  return (
    <ListEditor
      table="projects"
      items={projects}
      getTitle={(p) => p.name || "Untitled project"}
      getSubtitle={(p) => [p.tag, p.year, p.role].filter(Boolean).join(" · ")}
      blank={() => ({ name: "", tag: "", year: "", summary: "", role: "", stack: [], link: "" })}
      toRow={(d) => ({
        name:    d.name?.trim(),
        tag:     d.tag?.trim(),
        year:    d.year?.trim(),
        summary: d.summary?.trim(),
        role:    d.role?.trim(),
        stack:   d.stack || [],
        link:    d.link?.trim() || null,
      })}
      renderForm={(draft, set) => (
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Project name">
            <Input value={draft.name} onChange={(e) => set({ ...draft, name: e.target.value })} placeholder="ScanGenius.ai" />
          </Field>
          <Field label="Tag / Category">
            <Input value={draft.tag} onChange={(e) => set({ ...draft, tag: e.target.value })} placeholder="ATS Resume Scoring" />
          </Field>
          <Field label="Year">
            <Input value={draft.year} onChange={(e) => set({ ...draft, year: e.target.value })} placeholder="2025" />
          </Field>
          <Field label="Your role">
            <Input value={draft.role} onChange={(e) => set({ ...draft, role: e.target.value })} placeholder="Contributor / Team Lead" />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Summary" hint="1–2 sentences shown on the project card">
              <Textarea value={draft.summary} onChange={(e) => set({ ...draft, summary: e.target.value })} />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="Stack" hint="Press Enter or comma to add. Click × to remove.">
              <TagsField value={draft.stack || []} onChange={(arr) => set({ ...draft, stack: arr })} />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="Live URL (optional)">
              <Input value={draft.link || ""} onChange={(e) => set({ ...draft, link: e.target.value })} placeholder="https://..." />
            </Field>
          </div>
        </div>
      )}
    />
  );
}
