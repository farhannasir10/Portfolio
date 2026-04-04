import { SiteSidebar } from "@/components/SiteSidebar";
import { SiteTopBar } from "@/components/SiteTopBar";
import {
  getOrCreateSiteSettings,
  hasPublishedPosts,
  hasPublishedServices,
  hasPublishedSkills,
} from "@/lib/data";
import type { ReactNode } from "react";

export const dynamic = "force-dynamic";

export default async function SiteLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [showBlog, showServices, showSkills, settings] = await Promise.all([
    hasPublishedPosts(),
    hasPublishedServices(),
    hasPublishedSkills(),
    getOrCreateSiteSettings(),
  ]);

  const brand =
    settings.heroTitle?.trim() || "Portfolio";

  return (
    <div className="site-cosmos relative min-h-full overflow-x-hidden text-zinc-300">
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
        />
        <div className="flex min-w-0 flex-1 flex-col">
          <SiteTopBar
            brandLabel={brand}
            linkedinUrl={settings.linkedinUrl}
            githubUrl={settings.githubUrl}
            showBlog={showBlog}
            showServices={showServices}
            showSkills={showSkills}
          />
          <div className="flex-1">{children}</div>
          <footer className="footer-glow border-t border-zinc-900 px-4 py-14 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl text-center">
              <p className="kicker-sky opacity-90">Portfolio</p>
              <p className="mt-3 text-xs text-zinc-500">
                © {new Date().getFullYear()} · Built with Next.js
              </p>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
