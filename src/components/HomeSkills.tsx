/** Same visual language as hero stat cards: gradient-border-card grid, 2 then 3 columns. */
export function HomeSkills({
  skills,
}: {
  skills: Array<{ id: string; name: string }>;
}) {
  if (!skills.length) return null;
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
      {skills.map((s) => (
        <div
          key={s.id}
          className="gradient-border-card home-skill-tile relative overflow-hidden p-5 sm:p-6"
        >
          <p className="text-base font-bold leading-snug tracking-tight text-[var(--text)] sm:text-lg">
            {s.name}
          </p>
        </div>
      ))}
    </div>
  );
}
