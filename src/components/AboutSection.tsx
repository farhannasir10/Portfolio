import { AboutCategoryIcon } from "@/components/AboutCategoryIcon";
import { MarkdownBody } from "@/components/MarkdownBody";
import { groupSkillsForAbout, type SkillForAbout } from "@/lib/about-expertise";
import { publicFileUrl } from "@/lib/public-file-url";
import type { CvAsset, SiteSettings } from "@prisma/client";

function TaglineWithHighlight({ text }: { text: string }) {
  const t = text.trim();
  if (!t) return null;
  const space = t.indexOf(" ");
  if (space === -1) {
    return (
      <p className="about-tagline mx-auto mt-4 max-w-2xl text-center text-base leading-relaxed text-[var(--muted)] sm:text-lg">
        <span className="about-tagline-highlight">{t}</span>
      </p>
    );
  }
  const first = t.slice(0, space);
  const rest = t.slice(space);
  return (
    <p className="about-tagline mx-auto mt-4 max-w-2xl text-center text-base leading-relaxed text-[var(--muted)] sm:text-lg">
      <span className="about-tagline-highlight">{first}</span>
      {rest}
    </p>
  );
}

export function AboutSection({
  settings,
  skills,
  cv,
}: {
  settings: SiteSettings;
  skills: SkillForAbout[];
  cv: CvAsset | null;
}) {
  const accent = settings.aboutAccentWord?.trim() || "Me";
  const tagline = settings.aboutTagline?.trim() || settings.heroSubtitle?.trim() || "";
  const role = settings.aboutRole?.trim() || "Full stack developer";
  const groups = groupSkillsForAbout(skills);

  return (
    <section
      id="about"
      className="site-section-slice scroll-mt-36 border-t border-[color:var(--site-section-border)] py-20 md:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="about-section-title text-center text-3xl font-bold tracking-tight text-[var(--text)] sm:text-4xl md:text-5xl">
          About{" "}
          <span className="gradient-text-sky" lang="en">
            {accent}
          </span>
        </h2>
        {tagline ? <TaglineWithHighlight text={tagline} /> : null}

        <div
          className={`mt-14 grid gap-12 lg:mt-16 ${groups.length > 0 ? "lg:grid-cols-2 lg:items-start" : ""}`}
        >
          <div className="min-w-0">
            <h3 className="text-lg font-semibold tracking-tight text-[var(--text)] sm:text-xl">
              {role}
            </h3>
            <div className="mt-8 flex flex-col gap-6 rounded-2xl border border-[color:var(--border)] bg-[var(--card)] px-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-8">
              <div className="flex-1 text-center">
                <p className="text-2xl font-bold tracking-tight text-[color:var(--accent-bright)] sm:text-3xl">
                  10+
                </p>
                <p className="mt-1 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                  Projects completed
                </p>
              </div>
              <div
                className="hidden h-12 w-px shrink-0 bg-[color:var(--border)] sm:block"
                aria-hidden
              />
              <div className="flex-1 text-center">
                <p className="text-2xl font-bold tracking-tight text-[color:var(--accent-bright)] sm:text-3xl">
                  8+
                </p>
                <p className="mt-1 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                  Happy clients
                </p>
              </div>
              <div
                className="hidden h-12 w-px shrink-0 bg-[color:var(--border)] sm:block"
                aria-hidden
              />
              <div className="flex-1 text-center">
                <p className="text-2xl font-bold tracking-tight text-[color:var(--accent-bright)] sm:text-3xl">
                  10+
                </p>
                <p className="mt-1 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                  Technologies
                </p>
              </div>
            </div>

            <div className="mt-10 max-w-xl lg:max-w-none">
              <MarkdownBody content={settings.aboutMarkdown} brighterBody />
            </div>

            {cv ? (
              <p className="mt-10">
                <a
                  href={publicFileUrl(cv.storageKey) ?? "#"}
                  download={cv.originalName}
                  className="btn-secondary btn-cv-download inline-flex"
                >
                  Download CV
                </a>
              </p>
            ) : null}
          </div>

          {groups.length > 0 ? (
            <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
              {groups.map((g) => (
                <div key={g.title} className="surface-card p-5 sm:p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[color:var(--accent-muted)]">
                      <AboutCategoryIcon categoryTitle={g.title} />
                    </div>
                    <h4 className="text-base font-semibold tracking-tight text-[var(--text)]">
                      {g.title}
                    </h4>
                  </div>
                  <p className="text-sm leading-relaxed text-[var(--muted)]">
                    {g.items.map((s) => s.name).join(", ")}
                  </p>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
