import { SiteSidebar } from "@/components/SiteSidebar";
import { SiteThemeProvider } from "@/components/SiteThemeContext";
import { SiteTopBar } from "@/components/SiteTopBar";
import {
  getOrCreateSiteSettings,
  hasPublishedPosts,
  hasPublishedServices,
  hasPublishedSkills,
  hasPublishedTestimonials,
} from "@/lib/data";
import type { ReactNode } from "react";

export const dynamic = "force-dynamic";

export default async function SiteLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [showBlog, showServices, showSkills, showTestimonials, settings] =
    await Promise.all([
    hasPublishedPosts(),
    hasPublishedServices(),
    hasPublishedSkills(),
    hasPublishedTestimonials(),
    getOrCreateSiteSettings(),
  ]);

  const brand =
    settings.heroTitle?.trim() || "Portfolio";

  return (
    <SiteThemeProvider>
      <div className="site-cosmos relative min-h-full overflow-x-hidden">
        <div
          className="bg-portfolio-mesh pointer-events-none fixed inset-0 -z-20"
          aria-hidden
        />
        <div className="site-aurora pointer-events-none fixed inset-0 -z-10" aria-hidden />
        <div className="relative z-[1] flex min-h-screen">
          <SiteSidebar
            showBlog={showBlog}
            showServices={showServices}
            showSkills={showSkills}
            showTestimonials={showTestimonials}
          />
          <div className="flex min-w-0 flex-1 flex-col border-l border-[color:var(--site-sidebar-border)] bg-[var(--site-main-bg)] site-main-panel">
          <SiteTopBar
            brandLabel={brand}
            linkedinUrl={settings.linkedinUrl}
            githubUrl={settings.githubUrl}
            showBlog={showBlog}
            showServices={showServices}
            showSkills={showSkills}
            showTestimonials={showTestimonials}
          />
          <div className="flex-1">{children}</div>
          <footer className="footer-glow border-t border-[color:var(--site-section-border)] px-4 py-14 sm:px-6 lg:px-8">
            <div className="footer-inner mx-auto max-w-5xl">
              <p className="kicker-sky opacity-90">Portfolio</p>
              <p className="footer-tagline">
                Crafted with care — design, code, and delivery.
              </p>
              <p className="text-xs text-[var(--muted)]">
                © {new Date().getFullYear()} · Built with Next.js
              </p>
            </div>
          </footer>
        </div>
      </div>
    </div>
    </SiteThemeProvider>
  );
}
