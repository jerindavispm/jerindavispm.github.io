import ListEditor from "./ListEditor";
import { useContent } from "../../lib/ContentContext";
import { Field, Input, Textarea, TagsField } from "./ui";

export default function ExperienceEditor() {
  const { experience } = useContent();

  return (
    <ListEditor
      table="experience"
      items={experience}
      getTitle={(e) => `${e.role || "Untitled"}${e.company ? ` · ${e.company}` : ""}`}
      getSubtitle={(e) => [e.type, e.duration].filter(Boolean).join(" · ")}
      blank={() => ({ role: "", company: "", type: "Internship", duration: "", summary: "", highlights: [], tools: [] })}
      toRow={(d) => ({
        role:       d.role?.trim(),
        company:    d.company?.trim(),
        type:       d.type?.trim(),
        duration:   d.duration?.trim(),
        summary:    d.summary?.trim(),
        highlights: d.highlights || [],
        tools:      d.tools || [],
      })}
      renderForm={(draft, set) => (
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Role">
            <Input value={draft.role} onChange={(e) => set({ ...draft, role: e.target.value })} placeholder="Project Coordinator" />
          </Field>
          <Field label="Company">
            <Input value={draft.company} onChange={(e) => set({ ...draft, company: e.target.value })} placeholder="UPDOT" />
          </Field>
          <Field label="Type">
            <Input value={draft.type} onChange={(e) => set({ ...draft, type: e.target.value })} placeholder="Internship / Full-time / Contract" />
          </Field>
          <Field label="Duration">
            <Input value={draft.duration} onChange={(e) => set({ ...draft, duration: e.target.value })} placeholder="2 months · Jun – Aug 2024" />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Summary">
              <Textarea value={draft.summary} onChange={(e) => set({ ...draft, summary: e.target.value })} />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="Highlights" hint="One per chip. Press Enter to add.">
              <TagsField value={draft.highlights || []} onChange={(arr) => set({ ...draft, highlights: arr })} placeholder="Owned project documentation end-to-end…" />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="Tools" hint="ProofHub, Asana, etc.">
              <TagsField value={draft.tools || []} onChange={(arr) => set({ ...draft, tools: arr })} />
            </Field>
          </div>
        </div>
      )}
    />
  );
}
