import { HeroProfileAvatar } from "@/components/HeroProfileAvatar";
import { HomeSkills } from "@/components/HomeSkills";
import { HeroTitle } from "@/components/HeroTitle";
import { MarkdownBody } from "@/components/MarkdownBody";
import { ProjectCard } from "@/components/ProjectCard";
import { SectionHeading } from "@/components/SectionHeading";
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
import { publicFileUrl } from "@/lib/public-file-url";
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

  return (
    <div className="mx-auto max-w-5xl px-4 pb-24 sm:px-6 lg:px-8">
      <section
        id="home"
        className="flex scroll-mt-36 flex-col justify-center gap-10 py-16 md:min-h-[calc(100vh-8rem)] md:flex-row md:items-center md:gap-12 md:py-20"
      >
        <HeroProfileAvatar storageKey={settings.profileImage} />
        <div className="flex min-w-0 flex-1 flex-col gap-6">
          <p className="kicker-sky">Freelance · Software engineer</p>
          <HeroTitle title={settings.heroTitle} />
          <p className="max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg">
            {settings.heroSubtitle}
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="#projects" className="btn-primary">
              View work
            </a>
            <a href="#contact" className="btn-secondary">
              Get in touch
            </a>
          </div>
          <StatRow projectCount={projects.length} />
        </div>
      </section>

      <section id="projects" className="scroll-mt-36 border-t border-sky-500/10 py-16 md:py-20">
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
          className="scroll-mt-36 border-t border-sky-500/10 py-16 md:py-20"
        >
          <SectionHeading kicker="What I do" title="Services" />
          <div className="grid gap-4 md:grid-cols-3">
            {services.map((s) => (
              <div
                key={s.id}
                className="surface-card surface-card-hover relative p-5 sm:p-6"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-sky-500/10 ring-1 ring-sky-500/20">
                  <ServiceIcon iconKey={s.iconKey} />
                </div>
                <h3 className="text-base font-semibold text-slate-100">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  {s.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {skills.length > 0 ? (
        <section id="skills" className="scroll-mt-36 border-t border-sky-500/10 py-16 md:py-20">
          <SectionHeading kicker="Stack" title="Skills" />
          <p className="-mt-4 mb-8 max-w-lg text-sm leading-relaxed text-slate-500">
            Tools and technologies I work with.
          </p>
          <HomeSkills skills={skills} />
        </section>
      ) : null}

      {showBlog ? (
        <section
          id="blog"
          className="scroll-mt-36 border-t border-sky-500/10 py-16 md:py-20"
        >
          <SectionHeading kicker="Writing" title="Blog" />
          <p className="-mt-4 mb-8 max-w-lg text-sm leading-relaxed text-slate-500">
            Notes, tutorials, and build logs.
          </p>
          <ul className="flex flex-col gap-3">
            {posts.map((post) => (
              <li key={post.id}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="surface-card surface-card-hover group block p-5 sm:p-6"
                >
                  <span className="text-lg font-semibold tracking-tight text-slate-100 transition group-hover:text-sky-200">
                    {post.title}
                  </span>
                  {post.excerpt ? (
                    <p className="mt-2 text-sm leading-relaxed text-slate-500">
                      {post.excerpt}
                    </p>
                  ) : null}
                  {post.publishedAt ? (
                    <p className="mt-3 text-xs text-slate-600">
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

      <section
        id="about"
        className="scroll-mt-36 border-t border-sky-500/10 py-16 md:py-20"
      >
        <SectionHeading kicker="Background" title="About" />
        <div className="max-w-3xl">
          <MarkdownBody content={settings.aboutMarkdown} />
        </div>
        {cv ? (
          <p className="mt-10">
            <a
              href={publicFileUrl(cv.storageKey) ?? "#"}
              download={cv.originalName}
              className="btn-secondary inline-flex"
            >
              Download CV
            </a>
          </p>
        ) : null}
      </section>

      <section
        id="contact"
        className="scroll-mt-36 border-t border-sky-500/10 py-16 md:py-20"
      >
        <SectionHeading kicker="Let&apos;s talk" title="Contact" />
        <p className="-mt-4 mb-8 max-w-lg text-sm leading-relaxed text-slate-500">
          Available for freelance engagements and collaborations.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {settings.email ? (
            <a
              href={`mailto:${settings.email}`}
              className="surface-card surface-card-hover flex flex-col gap-2 p-5"
            >
              <span className="kicker-sky opacity-90">Email</span>
              <span className="break-all text-sm font-medium text-slate-200">
                {settings.email}
              </span>
            </a>
          ) : (
            <div className="surface-card flex flex-col gap-2 p-5 opacity-70">
              <span className="kicker-sky opacity-90">Email</span>
              <span className="text-sm text-slate-500">Not configured</span>
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
              <span className="text-sm font-medium text-slate-200">Profile</span>
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
              <span className="text-sm font-medium text-slate-200">Profile</span>
            </a>
          ) : null}
        </div>
      </section>
    </div>
  );
}
