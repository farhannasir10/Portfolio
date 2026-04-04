"use client";

import { useSiteTheme } from "@/components/SiteThemeContext";

export function SiteThemeToggle() {
  const { theme, toggleTheme } = useSiteTheme();
  const isLight = theme === "light";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isLight}
      aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
      onClick={toggleTheme}
      className="site-theme-toggle relative h-6 w-11 shrink-0 rounded-full border border-[color:var(--toggle-track-border)] bg-[color:var(--toggle-track-bg)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--accent)]"
    >
      <span
        className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-[color:var(--toggle-thumb-bg)] shadow-sm ring-1 ring-[color:var(--toggle-thumb-ring)] transition-transform duration-200 ${
          isLight ? "translate-x-5" : "translate-x-0"
        }`}
        aria-hidden
      />
    </button>
  );
}
