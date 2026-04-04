import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-zinc-50">Dashboard</h1>
      <p className="mt-2 text-sm text-zinc-400">
        Manage content for your public portfolio.
      </p>
      <ul className="mt-8 grid gap-3 sm:grid-cols-2">
        <DashboardCard
          href="/admin/site"
          title="Site & profile"
          desc="Profile photo (home), hero text, about, email & social links"
        />
        <DashboardCard
          href="/admin/projects"
          title="Projects"
          desc="Case studies, videos, screenshots, links"
        />
        <DashboardCard
          href="/admin/services"
          title="Services"
          desc="Home page cards (section hides when none published)"
        />
        <DashboardCard
          href="/admin/skills"
          title="Skills"
          desc="Tech pills on the home page (e.g. TypeScript)"
        />
        <DashboardCard
          href="/admin/blogs"
          title="Blog"
          desc="Posts (section hides when none published)"
        />
        <DashboardCard href="/admin/cv" title="CV" desc="PDF for visitors" />
      </ul>
    </div>
  );
}

function DashboardCard({
  href,
  title,
  desc,
}: {
  href: string;
  title: string;
  desc: string;
}) {
  return (
    <li>
      <Link
        href={href}
        className="block rounded-xl border border-zinc-800 bg-zinc-950/50 p-5 transition hover:border-orange-500/25"
      >
        <span className="font-medium text-zinc-100">{title}</span>
        <p className="mt-2 text-sm text-zinc-500">{desc}</p>
      </Link>
    </li>
  );
}
