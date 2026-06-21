"use client";

import Link from "next/link";
import { useState } from "react";

export function ProjectDetailLink({ href }: { href: string }) {
  const [loading, setLoading] = useState(false);

  return (
    <Link
      href={href}
      prefetch
      onClick={() => setLoading(true)}
      aria-busy={loading}
      className={`btn-project-cta w-full text-center sm:w-auto sm:self-start ${loading ? "btn-project-cta--loading" : ""}`}
    >
      {loading ? (
        <span className="btn-project-cta-inner">
          <span className="btn-spinner" aria-hidden />
          Opening project…
        </span>
      ) : (
        "View project details"
      )}
    </Link>
  );
}
