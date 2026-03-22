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
    <div className="bg-portfolio-mesh relative min-h-full text-slate-200">
      <div className="flex min-h-screen">
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
          <footer className="border-t border-sky-500/10 px-4 py-10 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl text-center">
              <p className="kicker-sky opacity-80">Portfolio</p>
              <p className="mt-2 text-xs text-slate-600">
                © {new Date().getFullYear()} · Built with Next.js
              </p>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
