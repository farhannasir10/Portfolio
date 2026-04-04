export type SkillForAbout = {
  id: string;
  name: string;
  category: string | null;
};

const CATEGORY_ORDER = [
  "Frontend",
  "Backend",
  "DevOps",
  "Tools",
  "Mobile",
  "Data",
  "General",
];

/**
 * Groups skills for About section cards. Uncategorized skills are merged into
 * one “Technologies” card when nothing has a category; otherwise `General` bucket.
 */
export function groupSkillsForAbout(skills: SkillForAbout[]) {
  if (!skills.length) return [];

  const hasAnyCategory = skills.some((s) => s.category?.trim());
  if (!hasAnyCategory) {
    return [{ title: "Technologies", items: skills }];
  }

  const map = new Map<string, SkillForAbout[]>();
  for (const s of skills) {
    const key = s.category?.trim() || "General";
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(s);
  }

  const keys = [...map.keys()].sort((a, b) => {
    const ia = CATEGORY_ORDER.indexOf(a);
    const ib = CATEGORY_ORDER.indexOf(b);
    if (ia === -1 && ib === -1) return a.localeCompare(b);
    if (ia === -1) return 1;
    if (ib === -1) return -1;
    return ia - ib;
  });

  return keys.map((title) => ({ title, items: map.get(title)! }));
}
