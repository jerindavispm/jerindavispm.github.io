import { useEffect, useState } from "react";
import { Save, RotateCcw } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { useContent } from "../../lib/ContentContext";
import { Field, Input, Textarea, Button, Toast } from "./ui";

export default function ProfileEditor() {
  const { profile, refresh } = useContent();
  const [draft, setDraft] = useState(profile);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => { setDraft(profile); }, [profile]);

  const dirty = JSON.stringify(draft) !== JSON.stringify(profile);

  function set(key, value) { setDraft((d) => ({ ...d, [key]: value })); }

  async function save() {
    setBusy(true);
    const { error } = await supabase.from("profile").update({
      name:       draft.name,
      first_name: draft.firstName,
      last_name:  draft.lastName,
      role:       draft.role,
      location:   draft.location,
      status:     draft.status,
      blurb:      draft.blurb,
      email:      draft.email,
      phone:      draft.phone,
      github:     draft.github,
      linkedin:   draft.linkedin,
    }).eq("id", 1);
    setBusy(false);
    if (error) {
      setToast({ kind: "err", message: error.message });
      return;
    }
    setToast({ kind: "ok", message: "Profile saved" });
    refresh();
  }

  return (
    <div>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="First name"><Input value={draft.firstName} onChange={(e) => set("firstName", e.target.value)} /></Field>
        <Field label="Last name"><Input value={draft.lastName} onChange={(e) => set("lastName", e.target.value)} /></Field>
        <Field label="Display name"><Input value={draft.name} onChange={(e) => set("name", e.target.value)} /></Field>
        <Field label="Role / Title"><Input value={draft.role} onChange={(e) => set("role", e.target.value)} /></Field>
        <Field label="Location"><Input value={draft.location} onChange={(e) => set("location", e.target.value)} /></Field>
        <Field label="Status pill"><Input value={draft.status} onChange={(e) => set("status", e.target.value)} /></Field>
      </div>

      <div className="mt-4">
        <Field label="Blurb" hint="Long-form intro shown in the About section">
          <Textarea value={draft.blurb} onChange={(e) => set("blurb", e.target.value)} />
        </Field>
      </div>

      <div className="mt-4 grid sm:grid-cols-2 gap-4">
        <Field label="Email"><Input type="email" value={draft.email} onChange={(e) => set("email", e.target.value)} /></Field>
        <Field label="Phone"><Input value={draft.phone} onChange={(e) => set("phone", e.target.value)} /></Field>
        <Field label="GitHub URL"><Input value={draft.github} onChange={(e) => set("github", e.target.value)} /></Field>
        <Field label="LinkedIn URL"><Input value={draft.linkedin} onChange={(e) => set("linkedin", e.target.value)} /></Field>
      </div>

      <div className="mt-7 flex items-center justify-end gap-2">
        <Button variant="secondary" onClick={() => setDraft(profile)} disabled={!dirty || busy}>
          <RotateCcw size={14} strokeWidth={1.8} />
          Reset
        </Button>
        <Button onClick={save} busy={busy} disabled={!dirty}>
          <Save size={14} strokeWidth={1.8} />
          Save changes
        </Button>
      </div>

      <Toast {...(toast || { message: null })} onDone={() => setToast(null)} />
    </div>
  );
}
