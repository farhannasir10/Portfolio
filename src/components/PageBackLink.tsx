"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";

export function PageBackLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  const [loading, setLoading] = useState(false);

  return (
    <Link
      href={href}
      prefetch
      onClick={() => setLoading(true)}
      aria-busy={loading}
      className={`page-back-link ${loading ? "page-back-link--loading" : ""}`}
    >
      {loading ? (
        <span className="page-back-link-inner">
          <span className="btn-spinner" aria-hidden />
          Loading…
        </span>
      ) : (
        children
      )}
    </Link>
  );
}
