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
    <div className="mt-14 grid gap-4 sm:grid-cols-3">
      {stats.map((s) => (
        <div
          key={s.label}
          className="gradient-border-card relative overflow-hidden p-5 sm:p-6"
        >
          <p className="font-mono text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl">
            {s.value}
          </p>
          <p className="mt-2 text-sm text-slate-500">{s.label}</p>
        </div>
      ))}
    </div>
  );
}
