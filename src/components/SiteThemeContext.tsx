"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type SiteTheme = "dark" | "light";

const STORAGE_KEY = "portfolio-site-theme";

type SiteThemeContextValue = {
  theme: SiteTheme;
  setTheme: (t: SiteTheme) => void;
  toggleTheme: () => void;
};

const SiteThemeContext = createContext<SiteThemeContextValue | null>(null);

export function SiteThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<SiteTheme>("dark");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as SiteTheme | null;
      if (stored === "light" || stored === "dark") {
        setThemeState(stored);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const setTheme = useCallback((t: SiteTheme) => {
    setThemeState(t);
    try {
      localStorage.setItem(STORAGE_KEY, t);
    } catch {
      /* ignore */
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  return (
    <SiteThemeContext.Provider
      value={{ theme, setTheme, toggleTheme }}
    >
      <div className="site-theme-scope min-h-full" data-theme={theme}>
        {children}
      </div>
    </SiteThemeContext.Provider>
  );
}

export function useSiteTheme() {
  const ctx = useContext(SiteThemeContext);
  if (!ctx) {
    throw new Error("useSiteTheme must be used within SiteThemeProvider");
  }
  return ctx;
}
