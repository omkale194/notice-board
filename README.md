# Notice Board

A full CRUD Notice Board built with Next.js (Pages Router), Prisma, and a hosted
MySQL database, deployed on Vercel — built for the Reno Platforms Web
Development Assignment.

- **Live app:** _add your Vercel URL here_
- **Repo:** _add your GitHub URL here_

## Features

- List all notices as responsive cards (phone + desktop grid).
- Create and edit notices through one shared form (`components/NoticeForm.js`).
- Delete a notice with a confirmation step before it's removed.
- Fields: `title`, `body`, `category` (Exam / Event / General), `priority`
  (Normal / Urgent), `publishDate`, and an optional `image` (stored as a
  base64 data URI — no external file storage needed on the free tier).
- Urgent notices are always sorted above Normal notices, with a red "Urgent"
  badge. The ordering happens in the Prisma query (`orderBy`), with an
  explicit JS sort as a safety net — never in a client-side array sort.
- All writes (create/update/delete) go through API routes under `pages/api/`
  using the correct HTTP verb (`GET`, `POST`, `PUT`, `DELETE`) and status
  codes (`200`, `201`, `204`, `400`, `404`, `405`, `500`).
- Server-side validation lives in `lib/validateNotice.js` and runs inside the
  API routes — required fields and date validity are enforced there, not
  only in the browser.

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14, **Pages Router** (`pages/`) |
| ORM | Prisma |
| Database | Any free hosted MySQL (TiDB Cloud recommended) — Postgres (Neon/Supabase) also works with a one-line schema change |
| Hosting | Vercel (Hobby/free tier) |
| Styling | Tailwind CSS |

## Running locally

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Set up a free hosted database.** Recommended: [TiDB Cloud](https://tidbcloud.com)
   (MySQL-compatible, free Serverless tier, no credit card required).
   - Create a Serverless cluster.
   - Copy the connection string it gives you.

3. **Configure environment variables**

   ```bash
   cp .env.example .env
   ```

   Paste your connection string into `.env`:

   ```
   DATABASE_URL="mysql://<user>:<password>@<host>:4000/<database>?sslaccept=strict"
   ```

4. **Push the schema to your database**

   ```bash
   npx prisma db push
   ```

5. **(Optional) Seed a few sample notices**

   ```bash
   npx prisma db seed
   ```

6. **Run the dev server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Deploying to Vercel

1. Push this repo to a **public** GitHub repository.
2. Import the repo into [Vercel](https://vercel.com) (Hobby/free tier).
3. Add the `DATABASE_URL` environment variable in the Vercel project settings
   (same value as your local `.env`).
4. Deploy. Vercel runs `prisma generate` automatically via the `postinstall`
   script, and `prisma generate` again in `build` for safety.
5. Confirm the deployed URL opens **without logging in** and that
   creating/editing/deleting a notice persists after a refresh.

> A local SQLite file will **not** work on Vercel — its filesystem is reset
> on every deploy. This project uses a hosted MySQL database via Prisma so
> data survives redeploys, per the assignment's hard rules.

## Project structure

```
pages/
  index.js                 # Notice list (SSR via getServerSideProps)
  notices/new.js            # Create form
  notices/[id]/edit.js      # Edit form (pre-filled via getServerSideProps)
  api/notices/index.js      # GET (list), POST (create)
  api/notices/[id].js       # GET (one), PUT/PATCH (update), DELETE
components/
  NoticeCard.js              # Card with Edit/Delete + delete confirmation
  NoticeForm.js               # Shared create/edit form
lib/
  prisma.js                   # Prisma client singleton
  validateNotice.js            # Server-side validation used by both API routes
prisma/
  schema.prisma                 # Notice model + Category/Priority enums
  seed.js                        # Optional sample data
```

## One thing I'd improve with more time

Move image storage off base64-in-the-database and onto a proper object
store (e.g. Vercel Blob or Cloudflare R2, both of which have free tiers).
Base64 in a `LONGTEXT` column works for a small assignment but bloats the
database and slows down the list query as more notices with images are
added.

## Where and how AI was used

_Fill this in honestly before submitting — for example: which parts were
scaffolded with AI assistance, which parts you wrote or edited by hand, and
which parts you reviewed/tested yourself. The evaluation explicitly checks
for an honest, accurate description here, not just "AI was used."_
