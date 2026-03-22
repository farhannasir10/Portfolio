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

**File uploads:** If a Supabase API URL is set (full URL or `NEXT_PUBLIC_SUPABASE_PROJECT_REF`), plus `SUPABASE_SERVICE_ROLE_KEY` and `SUPABASE_STORAGE_BUCKET`, admin uploads go to **Supabase Storage**. If those variables are omitted, uploads fall back to the local `uploads/` folder (local dev only).

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
| `NEXT_PUBLIC_SUPABASE_URL` *or* `NEXT_PUBLIC_SUPABASE_PROJECT_REF` | Set **one**: full `https://xxxxx.supabase.co` **or** ref-only `xxxxx` (from dashboard URL `/project/xxxxx`). Ref-only helps when an env UI rejects URL-like values. |
| `SUPABASE_URL` *or* `SUPABASE_PROJECT_REF` | Optional server-only copy for API routes. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | **anon public** key — needed so the admin UI can upload files straight to Storage (required on Vercel) |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (server-only) — mints signed upload URLs |
| `SUPABASE_STORAGE_BUCKET` | Storage bucket name (create under Storage; mark **Public** for portfolio assets) |

### Supabase Storage (production)

1. In the Supabase dashboard: **Storage → New bucket** — use the same name as `SUPABASE_STORAGE_BUCKET` (e.g. `portfolio`).  
2. Turn on **Public bucket** so images, videos, and CV PDFs load via public URLs.  
3. Admin uploads: the server uses the **service role** to create a **signed upload URL**; the browser sends the file **directly to Supabase** (see **Vercel + admin uploads** above).

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
- Mirror all required env vars on the hosting provider, including `DATABASE_URL`, `AUTH_SECRET`, and the public `AUTH_URL` (must be your real production URL, e.g. `https://your-domain.vercel.app`).

### Vercel + admin uploads

Vercel serverless functions have a **small request body limit** (often ~4.5 MB on Hobby) and **no persistent disk**, so sending whole videos/images through `POST /api/admin/upload` fails or is unreliable.

This project uses **direct uploads to Supabase Storage** when these are set in the Vercel project **Environment Variables** (Production + Preview as needed):

| Variable | Notes |
|----------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` *or* `NEXT_PUBLIC_SUPABASE_PROJECT_REF` | Same project as local: full URL **or** ref-only `xxxxx` if Vercel won’t accept a URL in the value field |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | **Required for uploads** — Supabase → Settings → API → `anon` `public` key (safe to expose; it only works with your signed URLs + RLS) |
| `SUPABASE_SERVICE_ROLE_KEY` | **Secret** — server only; used to mint signed upload URLs |
| `SUPABASE_STORAGE_BUCKET` | Bucket name; must be **public** for portfolio assets |

Redeploy after adding `NEXT_PUBLIC_*` vars so the client bundle picks them up.

If Storage isn’t configured on Vercel, the API returns a clear error instead of writing to disk.

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

### `Can't reach database server` (Supabase pooler / Prisma)

Prisma cannot open a TCP connection to Postgres. Common cases:

1. **Wrong URL for where you run the app** — On your laptop, use **Direct connection** (host `db.<project-ref>.supabase.co`, port **5432**) from **Supabase → Settings → Database**. The **pooler** host (`aws-*.pooler.supabase.com`) often fails from home/office networks or needs port **6543** + `pgbouncer` options; it’s aimed at **serverless** hosts.
2. **Project paused** — Free Supabase projects pause after inactivity; open the dashboard and resume.
3. **IPv4** — Some networks only route IPv4; if Supabase shows an **IPv4** or **Pooler** compatibility note, follow it.
4. **Password** — Special characters in the password must be **URL-encoded** in `DATABASE_URL`.

After changing `DATABASE_URL`, restart `next dev`.

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
