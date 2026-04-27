import { AboutSection } from "@/components/AboutSection";
import { HeroProfileAvatar } from "@/components/HeroProfileAvatar";
import { HomeSkills } from "@/components/HomeSkills";
import { HeroTitle } from "@/components/HeroTitle";
import { ProjectCard } from "@/components/ProjectCard";
import { SectionHeading } from "@/components/SectionHeading";
import { ServiceDescription } from "@/components/ServiceDescription";
import { ServiceIcon } from "@/components/ServiceIcon";
import { StatRow } from "@/components/StatRow";
import {
  getActiveCv,
  getOrCreateSiteSettings,
  getPublishedPosts,
  getPublishedProjects,
  getPublishedServices,
  getPublishedSkills,
  hasPublishedPosts,
} from "@/lib/data";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const showBlog = await hasPublishedPosts();
  const [settings, projects, posts, cv, services, skills] = await Promise.all([
    getOrCreateSiteSettings(),
    getPublishedProjects(),
    showBlog ? getPublishedPosts() : Promise.resolve([]),
    getActiveCv(),
    getPublishedServices(),
    getPublishedSkills(),
  ]);
  const whatsappDigits = (settings.whatsappNumber ?? "").replace(/\D/g, "");
  const whatsappHref = whatsappDigits ? `https://wa.me/${whatsappDigits}` : null;

  return (
    <div className="mx-auto max-w-5xl px-4 pb-28 sm:px-6 lg:px-8">
      <section
        id="home"
        className="relative scroll-mt-36 py-16 md:min-h-[calc(100vh-8rem)] md:flex md:flex-col md:justify-center md:py-24"
      >
        <div className="relative z-10 flex flex-col gap-10 md:flex-row md:items-center md:gap-14">
          <div className="relative z-10 flex justify-center md:justify-start">
            <HeroProfileAvatar storageKey={settings.profileImage} />
          </div>
          <div className="relative flex min-w-0 flex-1 flex-col gap-5">
            <p className="kicker">Freelance · Software engineer</p>
            <HeroTitle title={settings.heroTitle} />
            <p className="max-w-xl text-base leading-relaxed text-[var(--muted)] sm:text-lg">
              {settings.heroSubtitle}
            </p>
            <div className="flex flex-wrap gap-3 pt-1">
              <a href="#projects" className="btn-hero-navy">
                View work
              </a>
              <a href="#contact" className="btn-hero-outline">
                Get in touch
              </a>
            </div>
          </div>
        </div>
        <div className="relative z-10 mt-14 md:mt-16">
          <StatRow projectCount={projects.length} />
        </div>
      </section>

      <section
        id="projects"
        className="site-section-slice scroll-mt-36 border-t border-[color:var(--site-section-border)] py-20 md:py-24"
      >
        <SectionHeading kicker="Portfolio" title="Projects" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.length === 0
            ? null
            : projects.map((p) => <ProjectCard key={p.id} project={p} />)}
        </div>
      </section>

      {services.length > 0 ? (
        <section
          id="services"
          className="site-section-slice scroll-mt-36 border-t border-[color:var(--site-section-border)] py-20 md:py-24"
        >
          <SectionHeading kicker="What I do" title="Services" />
          <div className="grid gap-4 md:grid-cols-3">
            {services.map((s) => (
              <div
                key={s.id}
                className="surface-card surface-card-hover relative p-5 sm:p-6"
              >
                <div className="service-icon-booth">
                  <ServiceIcon iconKey={s.iconKey} className="h-6 w-6 text-[color:var(--accent-bright)]" />
                </div>
                <h3 className="text-base font-semibold text-[var(--text)]">{s.title}</h3>
                <ServiceDescription text={s.description} />
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {skills.length > 0 ? (
        <section
          id="skills"
          className="site-section-slice scroll-mt-36 border-t border-[color:var(--site-section-border)] py-20 md:py-24"
        >
          <SectionHeading kicker="Stack" title="Skills" />
          <p className="-mt-4 mb-8 max-w-lg text-sm leading-relaxed text-[var(--muted)]">
            Tools and technologies I work with.
          </p>
          <HomeSkills skills={skills} />
        </section>
      ) : null}

      {showBlog ? (
        <section
          id="blog"
          className="site-section-slice scroll-mt-36 border-t border-[color:var(--site-section-border)] py-20 md:py-24"
        >
          <SectionHeading kicker="Writing" title="Blog" />
          <p className="-mt-4 mb-8 max-w-lg text-sm leading-relaxed text-[var(--muted)]">
            Notes, tutorials, and build logs.
          </p>
          <ul className="flex flex-col gap-3">
            {posts.map((post) => (
              <li key={post.id}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="surface-card surface-card-hover group block p-5 sm:p-6"
                >
                  <span className="text-lg font-semibold tracking-tight text-[var(--text)] transition group-hover:text-[var(--accent-bright)]">
                    {post.title}
                  </span>
                  {post.excerpt ? (
                    <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                      {post.excerpt}
                    </p>
                  ) : null}
                  {post.publishedAt ? (
                    <p className="mt-3 text-xs text-[var(--dim)]">
                      {post.publishedAt.toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <AboutSection
        settings={settings}
        skills={skills.map((s) => ({
          id: s.id,
          name: s.name,
          category: s.category ?? null,
        }))}
        cv={cv}
      />

      <section
        id="contact"
        className="contact-section site-section-slice scroll-mt-36 mt-4 border-t-0 px-6 py-16 sm:px-10 sm:py-20"
      >
        <SectionHeading kicker="Let&apos;s talk" title="Contact" />
        <p className="-mt-4 mb-8 max-w-lg text-sm leading-relaxed text-[var(--muted)]">
          Available for freelance engagements and collaborations.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {settings.email ? (
            <a
              href={`mailto:${settings.email}`}
              className="surface-card surface-card-hover flex flex-col gap-2 p-5"
            >
              <span className="kicker-sky opacity-90">Email</span>
              <span className="break-all text-sm font-medium text-[var(--text)]">
                {settings.email}
              </span>
            </a>
          ) : (
            <div className="surface-card flex flex-col gap-2 p-5 opacity-90">
              <span className="kicker-sky opacity-90">Email</span>
              <span className="text-sm text-[var(--muted)]">Not configured</span>
            </div>
          )}
          {settings.linkedinUrl ? (
            <a
              href={settings.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="surface-card surface-card-hover flex flex-col gap-2 p-5"
            >
              <span className="kicker-sky opacity-90">LinkedIn</span>
              <span className="text-sm font-medium text-[var(--text)]">Profile</span>
            </a>
          ) : null}
          {settings.githubUrl ? (
            <a
              href={settings.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="surface-card surface-card-hover flex flex-col gap-2 p-5"
            >
              <span className="kicker-sky opacity-90">GitHub</span>
              <span className="text-sm font-medium text-[var(--text)]">Profile</span>
            </a>
          ) : null}
          {whatsappHref ? (
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="surface-card surface-card-hover flex flex-col gap-2 p-5"
            >
              <span className="kicker-sky opacity-90">WhatsApp</span>
              <span className="text-sm font-medium text-[var(--text)]">Message</span>
            </a>
          ) : (
            <div className="surface-card flex flex-col gap-2 p-5 opacity-90">
              <span className="kicker-sky opacity-90">WhatsApp</span>
              <span className="text-sm text-[var(--muted)]">Not configured</span>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
