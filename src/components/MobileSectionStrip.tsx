"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type LinkItem = { href: string; label: string; hash: string };

export function MobileSectionStrip({
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
  const activeHash = hash || "#home";

  const links: LinkItem[] = [{ href: "/#home", label: "Home", hash: "#home" }];
  links.push({ href: "/#projects", label: "Projects", hash: "#projects" });
  if (showServices) links.push({ href: "/#services", label: "Services", hash: "#services" });
  if (showSkills) links.push({ href: "/#skills", label: "Skills", hash: "#skills" });
  if (showBlog) links.push({ href: "/#blog", label: "Blog", hash: "#blog" });
  links.push({ href: "/#about", label: "About", hash: "#about" });
  if (showTestimonials) {
    links.push({ href: "/#testimonials", label: "Kind words", hash: "#testimonials" });
  }
  links.push({ href: "/#contact", label: "Contact", hash: "#contact" });

  return (
    <div className="mobile-nav-strip flex gap-2 overflow-x-auto border-t border-[color:var(--site-section-border)] px-4 py-2.5 lg:hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {links.map((l) => {
        const isActive = (() => {
          if (pathname.startsWith("/blog")) return l.hash === "#blog";
          if (pathname.startsWith("/work")) return l.hash === "#projects";
          if (!onHome) return false;
          return activeHash === l.hash;
        })();

        return (
          <Link
            key={l.href}
            href={l.href}
            className={`mobile-nav-pill shrink-0 ${isActive ? "mobile-nav-pill-active" : ""}`}
          >
            {l.label}
          </Link>
        );
      })}
    </div>
  );
}
