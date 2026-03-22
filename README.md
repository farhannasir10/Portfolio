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

### Admin

- Sign in at `/admin/login`.
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
| **Database** | PostgreSQL (Supabase) + Prisma |
| **Auth** | Auth.js / NextAuth v5 (credentials) for admin |
| **Markdown** | `react-markdown`, `remark-gfm` |
| **Other** | TypeScript, Zod, bcryptjs, `@supabase/supabase-js` |

**File uploads:** If `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and `SUPABASE_STORAGE_BUCKET` are set, admin uploads go to **Supabase Storage** (public bucket) and the app stores the public HTTPS URL in the database. If those variables are omitted, uploads fall back to the local `uploads/` folder and `/api/files/…` (fine for local dev only).

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
| `DATABASE_URL` | PostgreSQL connection string (this project targets Supabase; include `?sslmode=require`) |
| `AUTH_SECRET` | Random secret (e.g. `openssl rand -base64 32`) |
| `AUTH_URL` | App origin, e.g. `http://localhost:3000` |
| `ADMIN_PASSWORD` | Admin login password; optional `ADMIN_PASSWORD_HASH` for bcrypt hash in production |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL (Settings → API) |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (server-only; never commit or expose to the browser) |
| `SUPABASE_STORAGE_BUCKET` | Storage bucket name (create under Storage; mark **Public** for portfolio assets) |

### Supabase Storage (production)

1. In the Supabase dashboard: **Storage → New bucket** — use the same name as `SUPABASE_STORAGE_BUCKET` (e.g. `portfolio`).  
2. Turn on **Public bucket** so images, videos, and CV PDFs load via public URLs.  
3. Uploads use the **service role** key on the server only (`POST /api/admin/upload`).

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
- Mirror all required env vars on the hosting provider, including `DATABASE_URL`, `AUTH_SECRET`, and the public `AUTH_URL`.

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

### `the URL must start with the protocol file:` (or SQLite vs Postgres mismatch)

The **generated** Prisma client under `node_modules/.prisma` is out of date: it still thinks the database is SQLite while `DATABASE_URL` is PostgreSQL.

1. **Stop** `next dev` (and any other Node process using this folder).
2. Run **`npx prisma generate`** (or **`npm run db:regenerate`**).
3. Delete **`.next`** and start dev again (`npm run dev` — a **`predev`** step runs `prisma generate` first).

On Windows, if `prisma generate` fails with **`EPERM`** on `query_engine-windows.dll.node`, the engine file is locked — fully stop the dev server and terminal, then run `npx prisma generate` again (or close Cursor/VS Code and retry).

### `The table public.Skill (or Service) does not exist`

The Postgres database is empty or outdated vs `schema.prisma`. With `DATABASE_URL` set, run:

```bash
npx prisma db push
```

That creates/updates tables (including `Skill` and `Service` from `@@map`). Use `npx prisma migrate dev` instead if you rely on migration history.

### General

After upgrading Prisma or Next.js, stop the dev server, run `npx prisma generate`, then start again.

---

## License

[MIT](LICENSE).
