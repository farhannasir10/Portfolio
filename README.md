# Portfolio — full-stack personal site with admin CMS

A Next.js portfolio template with a built-in admin area. The public site is content-driven; editors manage projects, blog posts, services, skills, site copy, and CV uploads without deploying code changes.

---

## Overview

| Area | What it does |
|------|----------------|
| **Public site** | Home, project detail pages, blog, about/contact. Empty sections stay hidden so navigation and layout stay clean. |
| **Admin** | Protected dashboard at `/admin` — CRUD for all content, file uploads, publish toggles, and sort ordering. |

---

## Features

### Public

- **Home** — Hero, highlights, project cards. Project cover images use the first **IMAGE** media item by lowest sort order. **Services** and **Skills** blocks appear only when at least one item is published.
- **Projects** — `/work/[slug]` pages with a horizontal image gallery, uploaded videos and external links (e.g. Loom, Drive, demos), plus long-form **Details** from Markdown.
- **Blog** — Markdown posts, optional cover image, draft vs published. Unpublished-only state hides blog from the main nav.
- **About & contact** — Profile image, hero text, about copy (Markdown), email and social URLs from site settings.
- **CV** — Active PDF exposed for download (configured in admin).
(`/admin/login`)

- **Projects** — Title, slug, summary, Markdown body, stack, sort order, published; media uploads (video, image, external URL), reorder, remove. UI documents how sort order affects the home card vs the detail gallery.
- **Services & skills** — Titles/descriptions/icons (services), skill names, ordering, publish flags.
- **Blog** — Create, edit, publish posts.
- **Site & contact** — Hero, about, profile photo, links.
- **CV** — Set active file, manage uploads.
- Save actions redirect with flash-style feedback and pending states on submit buttons.

---

## Tech stack

| Layer | Details |
|--------|---------|
| **Framework** | Next.js 16 (App Router, Server Actions, Turbopack in dev) |
| **UI** | React 19, Tailwind CSS 4, `@tailwindcss/typography` |
| **Database** | SQLite + Prisma (swap to PostgreSQL via `DATABASE_URL` + provider for production if needed) |
| **Auth** | Auth.js / NextAuth v5 (credentials) for admin |
| **Markdown** | `react-markdown`, `remark-gfm` |
| **Other** | TypeScript, Zod, bcryptjs |

Uploads are handled via API routes and stored on the local filesystem — suitable for development and small deployments; production at scale often moves storage to S3/R2 or similar.

---

## Requirements

- Node.js 18+ recommended  
- npm (or pnpm / yarn — adjust commands accordingly)

---

## Local setup

```bash
git clone <your-repo-url>
cd Portfolio
npm install
```

### Environment

Copy `.env.example` to `.env` and set:

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | e.g. `file:./dev.db` for SQLite |
| `AUTH_SECRET` | Random secret (e.g. `openssl rand -base64 32`) |
| `AUTH_URL` | App origin, e.g. `http://localhost:3000` |
| `ADMIN_PASSWORD` | Admin login password; optional `ADMIN_PASSWORD_HASH` for bcrypt hash in production |

### Database & dev server

```bash
npx prisma db push
npm run dev
```

- **Site:** [http://localhost:3000](http://localhost:3000)  
- **Admin:** [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

### npm scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Development server |
| `npm run build` | `prisma generate` + production build |
| `npm run start` | Production server |
| `npm run db:studio` | Prisma Studio |
| `npm run db:migrate` | Create/apply migrations after schema changes |
| `npm run db:push` | Push schema without migrations (early dev) |

---

## Deployment notes

- `npm run build` already runs Prisma client generation.  
- SQLite is a single file — many serverless hosts use ephemeral disks; **PostgreSQL** is a common upgrade for hosted deployments.  
- Mirror all required env vars on the hosting provider, including `AUTH_SECRET` and the public `AUTH_URL`.

---

## Repository structure

```
src/app/(site)/     # Public routes
src/app/admin/      # Admin UI
src/actions/        # Server actions (mutations)
src/components/     # Shared & admin components
prisma/schema.prisma
```

---

## Troubleshooting

After upgrading Prisma or Next.js, stop the dev server, run `npx prisma generate`, then start again. On Windows, if the Prisma query engine file is locked (`EPERM`), close the terminal and retry.

---

## License

Specify your license here (e.g. MIT) or mark the repository as private — this section is left for the repo owner to finalize.
