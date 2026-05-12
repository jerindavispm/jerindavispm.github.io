import ListEditor from "./ListEditor";
import { useContent } from "../../lib/ContentContext";
import { Field, Input } from "./ui";

export default function EducationEditor() {
  const { education } = useContent();
  return (
    <ListEditor
      table="education"
      items={education}
      getTitle={(e) => e.degree || "Untitled"}
      getSubtitle={(e) => [e.school, e.period].filter(Boolean).join(" · ")}
      blank={() => ({ school: "", degree: "", location: "", period: "" })}
      toRow={(d) => ({
        school:   d.school?.trim(),
        degree:   d.degree?.trim(),
        location: d.location?.trim() || null,
        period:   d.period?.trim() || null,
      })}
      renderForm={(draft, set) => (
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Degree / Program">
            <Input value={draft.degree} onChange={(e) => set({ ...draft, degree: e.target.value })} placeholder="Bachelor of Computer Applications" />
          </Field>
          <Field label="School">
            <Input value={draft.school} onChange={(e) => set({ ...draft, school: e.target.value })} placeholder="CMR University" />
          </Field>
          <Field label="Location">
            <Input value={draft.location || ""} onChange={(e) => set({ ...draft, location: e.target.value })} placeholder="Bangalore, Karnataka" />
          </Field>
          <Field label="Period">
            <Input value={draft.period || ""} onChange={(e) => set({ ...draft, period: e.target.value })} placeholder="2023 – 2026" />
          </Field>
        </div>
      )}
    />
  );
}
