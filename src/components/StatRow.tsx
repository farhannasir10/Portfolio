export function StatRow({ projectCount }: { projectCount: number }) {
  const stats = [
    { value: "5+", label: "Years focus" },
    {
      value: `${Math.max(projectCount, 0)}+`,
      label: "Projects showcased",
    },
    { value: "100%", label: "Commitment" },
  ];
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {stats.map((s) => (
        <div
          key={s.label}
          className="surface-card stat-card-glow relative overflow-hidden p-5 sm:p-6"
        >
          <p className="stat-value font-sans text-3xl tracking-tight sm:text-4xl">
            {s.value}
          </p>
          <p className="mt-2 text-sm text-zinc-400">{s.label}</p>
        </div>
      ))}
    </div>
  );
}
