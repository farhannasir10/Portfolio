"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type Item = { href: string; label: string; hash: string };

export function SiteSidebar({
  showBlog,
  showServices,
  showSkills,
  showTestimonials,
}: {
  showBlog: boolean;
  showServices: boolean;
  showSkills: boolean;
  showTestimonials: boolean;
}) {
  const pathname = usePathname();
  const [hash, setHash] = useState("");

  useEffect(() => {
    const read = () => setHash(window.location.hash || "#home");
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, []);

  const onHome = pathname === "/";

  const items: Item[] = [{ href: "/#home", label: "Overview", hash: "#home" }];
  items.push({ href: "/#projects", label: "Projects", hash: "#projects" });
  if (showServices) {
    items.push({ href: "/#services", label: "Services", hash: "#services" });
  }
  if (showSkills) {
    items.push({ href: "/#skills", label: "Skills", hash: "#skills" });
  }
  if (showBlog) items.push({ href: "/#blog", label: "Blog", hash: "#blog" });
  items.push({ href: "/#about", label: "About", hash: "#about" });
  if (showTestimonials) {
    items.push({ href: "/#testimonials", label: "Kind words", hash: "#testimonials" });
  }
  items.push({ href: "/#contact", label: "Contact", hash: "#contact" });

  const isActive = (item: Item) => {
    if (!onHome) return false;
    const h = hash || "#home";
    return h === item.hash;
  };

  return (
    <aside className="sidebar-shell hidden w-60 shrink-0 flex-col border-r border-[color:var(--site-sidebar-border)] bg-[var(--site-sidebar-bg)] py-9 pl-6 pr-4 lg:flex">
      <p className="kicker-sky mb-3 px-2">Navigate</p>
      <div className="sidebar-brand-rule" aria-hidden />
      <nav className="flex flex-col gap-1">
        {items.map((item) => (
          <a
            key={item.hash}
            href={item.href}
            className={`nav-pill ${isActive(item) ? "nav-pill-active" : ""}`}
          >
            {item.label}
          </a>
        ))}
        {showBlog ? (
          <Link
            href="/blog"
            className={`nav-pill mt-2 ${pathname.startsWith("/blog") ? "nav-pill-active" : ""}`}
          >
            All posts
          </Link>
        ) : null}
      </nav>
    </aside>
  );
}
