import { AboutSection } from "@/components/AboutSection";
import { HeroProfileAvatar } from "@/components/HeroProfileAvatar";
import { HomeSkills } from "@/components/HomeSkills";
import { HeroTitle } from "@/components/HeroTitle";
import { ProjectCard } from "@/components/ProjectCard";
import { SectionEmptyState } from "@/components/SectionEmptyState";
import { SectionHeading } from "@/components/SectionHeading";
import { ServiceDescription } from "@/components/ServiceDescription";
import { ServiceIcon } from "@/components/ServiceIcon";
import { StatRow } from "@/components/StatRow";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import {
  getActiveCv,
  getOrCreateSiteSettings,
  getPublishedPosts,
  getPublishedProjects,
  getPublishedServices,
  getPublishedSkills,
  getPublishedTestimonials,
  hasPublishedPosts,
  hasPublishedTestimonials,
} from "@/lib/data";
import Link from "next/link";
import { BlogMeta } from "@/components/BlogMeta";
import { estimateReadMinutes } from "@/lib/read-time";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const showBlog = await hasPublishedPosts();
  const [settings, projects, posts, cv, services, skills, testimonials] =
    await Promise.all([
    getOrCreateSiteSettings(),
    getPublishedProjects(),
    showBlog ? getPublishedPosts() : Promise.resolve([]),
    getActiveCv(),
    getPublishedServices(),
    getPublishedSkills(),
    getPublishedTestimonials(),
  ]);
  const whatsappDigits = (settings.whatsappNumber ?? "").replace(/\D/g, "");
  const whatsappHref = whatsappDigits ? `https://wa.me/${whatsappDigits}` : null;

  return (
    <div className="mx-auto max-w-5xl px-4 pb-28 sm:px-6 lg:px-8">
      <section
        id="home"
        className="hero-section relative scroll-mt-36 py-16 md:min-h-[calc(100vh-8rem)] md:flex md:flex-col md:justify-center md:py-24"
      >
        <div className="relative z-10 flex flex-col gap-10 md:flex-row md:items-center md:gap-14">
          <div className="relative z-10 flex justify-center md:justify-start">
            <HeroProfileAvatar storageKey={settings.profileImage} />
          </div>
          <div className="relative flex min-w-0 flex-1 flex-col gap-5">
            <span className="hero-status-badge">
              <span className="hero-status-dot" aria-hidden />
              Open to opportunities
            </span>
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
          {projects.length === 0 ? (
            <div className="sm:col-span-2 lg:col-span-3">
              <SectionEmptyState
                icon="folder"
                title="No projects yet"
                description="Published work will appear here once you add projects in the admin."
              />
            </div>
          ) : (
            projects.map((p) => <ProjectCard key={p.id} project={p} />)
          )}
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
                className="service-card surface-card surface-card-hover relative p-5 sm:p-6"
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
          <p className="section-lead">
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
          <p className="section-lead">
            Notes, tutorials, and build logs.
          </p>
          <ul className="flex flex-col gap-3">
            {posts.map((post) => (
              <li key={post.id}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="blog-card-link surface-card surface-card-hover group block p-5 pr-12 sm:p-6 sm:pr-14"
                >
                  <span className="text-lg font-semibold tracking-tight text-[var(--text)] transition group-hover:text-[var(--accent-bright)]">
                    {post.title}
                  </span>
                  {post.excerpt ? (
                    <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                      {post.excerpt}
                    </p>
                  ) : null}
                  <BlogMeta
                    publishedAt={post.publishedAt}
                    readMinutes={estimateReadMinutes(post.content)}
                  />
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

      {testimonials.length > 0 ? (
        <TestimonialsSection testimonials={testimonials} />
      ) : null}

      <section
        id="contact"
        className="contact-section site-section-slice scroll-mt-36 mt-4 border-t-0 px-6 py-16 sm:px-10 sm:py-20"
      >
        <SectionHeading kicker="Let&apos;s talk" title="Contact" />
        <p className="section-lead">
          Available for freelance engagements and collaborations.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {settings.email ? (
            <a
              href={`mailto:${settings.email}`}
              className="contact-card surface-card surface-card-hover flex flex-col gap-3 p-5"
            >
              <span className="contact-card-icon" aria-hidden>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </span>
              <span className="kicker-sky opacity-90">Email</span>
              <span className="break-all text-sm font-medium text-[var(--text)]">
                {settings.email}
              </span>
            </a>
          ) : (
            <div className="contact-card surface-card flex flex-col gap-3 p-5 opacity-90">
              <span className="contact-card-icon" aria-hidden>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </span>
              <span className="kicker-sky opacity-90">Email</span>
              <span className="text-sm text-[var(--muted)]">Not configured</span>
            </div>
          )}
          {settings.linkedinUrl ? (
            <a
              href={settings.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-card surface-card surface-card-hover flex flex-col gap-3 p-5"
            >
              <span className="contact-card-icon" aria-hidden>
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </span>
              <span className="kicker-sky opacity-90">LinkedIn</span>
              <span className="text-sm font-medium text-[var(--text)]">Profile</span>
            </a>
          ) : null}
          {settings.githubUrl ? (
            <a
              href={settings.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-card surface-card surface-card-hover flex flex-col gap-3 p-5"
            >
              <span className="contact-card-icon" aria-hidden>
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </span>
              <span className="kicker-sky opacity-90">GitHub</span>
              <span className="text-sm font-medium text-[var(--text)]">Profile</span>
            </a>
          ) : null}
          {whatsappHref ? (
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-card surface-card surface-card-hover flex flex-col gap-3 p-5"
            >
              <span className="contact-card-icon" aria-hidden>
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </span>
              <span className="kicker-sky opacity-90">WhatsApp</span>
              <span className="text-sm font-medium text-[var(--text)]">Message</span>
            </a>
          ) : (
            <div className="contact-card surface-card flex flex-col gap-3 p-5 opacity-90">
              <span className="contact-card-icon" aria-hidden>
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </span>
              <span className="kicker-sky opacity-90">WhatsApp</span>
              <span className="text-sm text-[var(--muted)]">Not configured</span>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
