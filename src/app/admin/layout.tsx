import { adminSignOut } from "@/actions/auth";
import { AdminProviders } from "@/components/AdminProviders";
import { auth } from "@/auth";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <AdminProviders>
      <div className="min-h-screen bg-black text-zinc-100">
        {session ? (
          <div className="flex min-h-screen">
            <aside className="hidden w-52 shrink-0 border-r border-zinc-900 bg-black/90 p-4 backdrop-blur-xl md:block">
              <p className="text-xs font-semibold uppercase tracking-wider text-orange-500/90">
                Portfolio
              </p>
              <nav className="mt-6 flex flex-col gap-1 text-sm">
                <AdminNavLink href="/admin">Dashboard</AdminNavLink>
                <AdminNavLink href="/admin/site">Site & profile</AdminNavLink>
                <AdminNavLink href="/admin/projects">Projects</AdminNavLink>
                <AdminNavLink href="/admin/services">Services</AdminNavLink>
                <AdminNavLink href="/admin/skills">Skills</AdminNavLink>
                <AdminNavLink href="/admin/blogs">Blog</AdminNavLink>
                <AdminNavLink href="/admin/blogs/new" className="pl-3 text-xs text-zinc-500">
                  + New blog post
                </AdminNavLink>
                <AdminNavLink href="/admin/cv">CV</AdminNavLink>
              </nav>
              <div className="mt-8 border-t border-zinc-900 pt-4">
                <Link
                  href="/"
                  className="text-xs text-zinc-500 hover:text-orange-400"
                >
                  ← View site
                </Link>
                <form action={adminSignOut} className="mt-3">
                  <button
                    type="submit"
                    className="text-xs text-zinc-500 hover:text-red-400"
                  >
                    Sign out
                  </button>
                </form>
              </div>
            </aside>
            <div className="min-h-screen flex-1 overflow-auto bg-black">
              <div className="flex flex-wrap gap-2 border-b border-zinc-900 p-3 text-xs md:hidden">
                <Link href="/admin" className="rounded bg-zinc-900/80 px-2 py-1">
                  Home
                </Link>
                <Link href="/admin/site" className="rounded bg-zinc-900/80 px-2 py-1">
                  Profile
                </Link>
                <Link
                  href="/admin/projects"
                  className="rounded bg-zinc-900/80 px-2 py-1"
                >
                  Projects
                </Link>
                <Link href="/admin/services" className="rounded bg-zinc-900/80 px-2 py-1">
                  Services
                </Link>
                <Link href="/admin/skills" className="rounded bg-zinc-900/80 px-2 py-1">
                  Skills
                </Link>
                <Link href="/admin/blogs" className="rounded bg-zinc-900/80 px-2 py-1">
                  Blog
                </Link>
                <Link
                  href="/admin/blogs/new"
                  className="rounded bg-zinc-900/80 px-2 py-1"
                >
                  Post
                </Link>
                <Link href="/admin/cv" className="rounded bg-zinc-900/80 px-2 py-1">
                  CV
                </Link>
                <form action={adminSignOut} className="inline">
                  <button
                    type="submit"
                    className="rounded bg-zinc-900/80 px-2 py-1 text-zinc-400"
                  >
                    Out
                  </button>
                </form>
              </div>
              <div className="mx-auto max-w-4xl p-6">{children}</div>
            </div>
          </div>
        ) : (
          children
        )}
      </div>
    </AdminProviders>
  );
}

function AdminNavLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`rounded-md px-2 py-1.5 text-zinc-300 hover:bg-zinc-900/80 hover:text-orange-400 ${className ?? ""}`}
    >
      {children}
    </Link>
  );
}
