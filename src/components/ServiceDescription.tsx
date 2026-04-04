"use client";

import { useLayoutEffect, useRef, useState } from "react";

export function ServiceDescription({ text }: { text: string }) {
  const trimmed = text.trim();
  if (!trimmed) return null;

  const [expanded, setExpanded] = useState(false);
  const [showToggle, setShowToggle] = useState(false);
  const pRef = useRef<HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    const el = pRef.current;
    if (!el) return;
    if (expanded) return;

    const measure = () => {
      const isTruncated = el.scrollHeight > el.clientHeight + 1;
      setShowToggle(isTruncated);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [trimmed, expanded]);

  return (
    <div className="mt-2">
      <p
        ref={pRef}
        className={`text-sm leading-relaxed text-[var(--muted)] ${expanded ? "" : "line-clamp-2"}`}
      >
        {trimmed}
      </p>
      {showToggle ? (
        <button
          type="button"
          className="mt-1 text-sm font-medium text-[var(--accent-bright)] hover:text-[var(--link-hover-subtle)]"
          aria-expanded={expanded}
          aria-label={expanded ? "Collapse description" : "Expand description"}
          onClick={() => setExpanded((e) => !e)}
        >
          ...
        </button>
      ) : null}
    </div>
  );
}
