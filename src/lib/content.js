import { supabase } from "./supabase";

/**
 * Single source of truth for "all portfolio content".
 * Fetches every table in parallel and shapes the result into the same structure
 * the components used to import from `data.js` (so component changes are minimal).
 */
export async function fetchAllContent() {
  const [
    profileRes,
    navRes,
    experienceRes,
    projectsRes,
    skillGroupsRes,
    skillItemsRes,
    certsRes,
    languagesRes,
    educationRes,
    heroMetaRes,
  ] = await Promise.all([
    supabase.from("profile").select("*").eq("id", 1).single(),
    supabase.from("nav_items").select("*").order("sort_order"),
    supabase.from("experience").select("*").order("sort_order"),
    supabase.from("projects").select("*").order("sort_order"),
    supabase.from("skill_groups").select("*").order("sort_order"),
    supabase.from("skill_items").select("*").order("sort_order"),
    supabase.from("certifications").select("*").order("sort_order"),
    supabase.from("languages").select("*").order("sort_order"),
    supabase.from("education").select("*").order("sort_order"),
    supabase.from("hero_meta").select("*").order("sort_order"),
  ]);

  // hero_meta may not exist yet on older deployments — treat as soft-fail.
  const heroMetaSoftError =
    heroMetaRes.error && /relation .* does not exist|not found/i.test(heroMetaRes.error.message || "");
  const firstError = [
    profileRes, navRes, experienceRes, projectsRes,
    skillGroupsRes, skillItemsRes, certsRes, languagesRes, educationRes,
  ].find((r) => r.error)?.error || (heroMetaRes.error && !heroMetaSoftError ? heroMetaRes.error : null);
  if (firstError) throw firstError;

  const profileRow = profileRes.data;
  const skillGroups = skillGroupsRes.data || [];
  const skillItems = skillItemsRes.data || [];

  // Re-shape to match the original data.js structure
  return {
    profile: {
      name:        profileRow.name,
      firstName:   profileRow.first_name,
      lastName:    profileRow.last_name,
      role:        profileRow.role,
      location:    profileRow.location,
      status:      profileRow.status,
      blurb:       profileRow.blurb,
      email:       profileRow.email,
      phone:       profileRow.phone,
      github:      profileRow.github,
      linkedin:    profileRow.linkedin,
    },
    nav: (navRes.data || []).map((n) => ({ id: n.id, label: n.label, href: n.href })),
    experience: (experienceRes.data || []).map((e) => ({
      id:         e.id,
      role:       e.role,
      company:    e.company,
      type:       e.type,
      duration:   e.duration,
      summary:    e.summary,
      highlights: e.highlights || [],
      tools:      e.tools || [],
    })),
    projects: (projectsRes.data || []).map((p) => ({
      id:      p.id,
      name:    p.name,
      tag:     p.tag,
      year:    p.year,
      summary: p.summary,
      role:    p.role,
      stack:   p.stack || [],
      link:    p.link,
    })),
    skills: skillGroups.map((g) => ({
      id:    g.id,
      group: g.name,
      items: skillItems.filter((i) => i.group_id === g.id).map((i) => i.label),
    })),
    education: (educationRes.data || []).map((ed) => ({
      id:       ed.id,
      school:   ed.school,
      degree:   ed.degree,
      location: ed.location || "",
      period:   ed.period || "",
    })),
    certifications: (certsRes.data || []).map((c) => ({
      id:        c.id,
      name:      c.name,
      date:      c.date_label,
      isOngoing: c.is_ongoing,
    })),
    languages: (languagesRes.data || []).map((l) => l.name),
    heroMeta: (heroMetaRes.data || []).map((m) => ({
      id: m.id,
      label: m.label,
      value: m.value,
    })),
    marqueeWords: [
      "ERP", "✦", "Business Process", "✦", "SQL", "✦",
      "Python", "✦", "Coordination", "✦", "Workflow", "✦",
      "Available for work", "✦",
    ],
  };
}
