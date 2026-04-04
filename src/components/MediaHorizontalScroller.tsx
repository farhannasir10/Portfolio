"use client";

import { useCallback, useEffect, useRef, useState } from "react";

function ChevronLeft({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

const scrollbarHidden =
  "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden";

/** Horizontal snap track only (no full-bleed — outer wrapper handles that). */
const trackClass = `flex snap-x snap-mandatory gap-4 overflow-x-auto ${scrollbarHidden}`;

/** Pull row to section edges; padding includes space for side chevrons. */
const outerBleed = "-mx-4 px-4 pb-2 sm:-mx-6 sm:px-6";

/**
 * Hides default scrollbars and adds orange chevrons in side rails (not over media).
 */
export function MediaHorizontalScroller({
  children,
  className,
}: {
  children: React.ReactNode;
  /** Extra classes on the scrolling strip (e.g. spacing). */
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [scrollable, setScrollable] = useState(false);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    const overflow = scrollWidth > clientWidth + 2;
    setScrollable(overflow);
    setCanLeft(overflow && scrollLeft > 2);
    setCanRight(overflow && scrollLeft < scrollWidth - clientWidth - 2);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, [update, scrollable]);

  const scrollByDir = (dir: -1 | 1) => {
    const el = ref.current;
    if (!el) return;
    const delta = Math.max(180, Math.floor(el.clientWidth * 0.72));
    el.scrollBy({ left: dir * delta, behavior: "smooth" });
  };

  const btnClass =
    "flex h-9 w-9 shrink-0 items-center justify-center rounded-full sm:h-10 sm:w-10 " +
    "border border-orange-500/35 bg-zinc-950/90 text-orange-400 shadow-[0_8px_24px_-8px_rgba(0,0,0,0.85)] backdrop-blur-sm " +
    "transition-[opacity,transform,color,background-color] duration-200 " +
    "hover:border-orange-400/55 hover:bg-zinc-900/95 hover:text-orange-300 " +
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500/60 " +
    "disabled:pointer-events-none disabled:opacity-25";

  const trackCn = `${trackClass} ${className ?? ""}`.trim();

  if (!scrollable) {
    return (
      <div ref={ref} className={`${outerBleed} ${trackCn}`.trim()}>
        {children}
      </div>
    );
  }

  return (
    <div
      className={`${outerBleed} flex items-stretch gap-1.5 sm:gap-2`.trim()}
    >
      <div className="flex w-7 shrink-0 items-center justify-end sm:w-8">
        <button
          type="button"
          className={btnClass}
          aria-label="Scroll media left"
          disabled={!canLeft}
          onClick={() => scrollByDir(-1)}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      </div>
      <div ref={ref} className={`min-w-0 flex-1 ${trackCn}`.trim()}>
        {children}
      </div>
      <div className="flex w-7 shrink-0 items-center justify-start sm:w-8">
        <button
          type="button"
          className={btnClass}
          aria-label="Scroll media right"
          disabled={!canRight}
          onClick={() => scrollByDir(1)}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
