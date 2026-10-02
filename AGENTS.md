# AGENTS

seanrusselldev.com: Sean Russell's professional dev site and laboratory. Case
studies up front, experiments in the lab, a résumé rendered from data. It's a
static Astro site with React islands, hosted as Cloudflare Workers static
assets.

## 1. Orient

1. [docs/STATUS.md](docs/STATUS.md): what's next, in a few lines.
2. [docs/BRIEF.md](docs/BRIEF.md): the direction and the decisions behind it.
3. The current epic's plan under [docs/working/](docs/working/).

## 2. Principles

- **Two jobs, kept apart.** The front (`/`, `/work`, `/about`, `/resume`) is
  curated and quiet. The lab is playful and every entry carries a status. Don't
  let lab energy leak into the front.
- **The site is a work sample.** Performance, accessibility, both colour
  schemes and zero layout shift are features, not polish.
- **Static by default; islands where they earn it.** A page ships no JS unless
  a component opts in with `client:*`.
- **The repo is public.** No street address, phone number or personal email.
  No employer-internal names, hosts or unshareable numbers (BRIEF, "Rules for
  case studies").
- **Claims trace to sources.** AutoLight numbers come from
  `autolight-lossless/docs`; work numbers come from Sean.
- **Maintenance is a feature.** Every dependency and service must justify itself.
  No third-party scripts without a reason written in STATUS or a plan.

## 3. Working agreements

- **Docs pattern.** `docs/STATUS.md` stays *short*. It points to the next
  slice and holds only brief, important notes. Real work lives in an epic
  folder under `docs/working/` (see its README). When a STATUS note grows
  past a few lines, it becomes a plan.
- Work in **slices**: one slice per session where possible. Mark it done in
  its plan, then update STATUS's pointer.
- `docs/working/` is history. It's accurate about its moment. When it
  disagrees with the code, the code wins.
- Match the surrounding code's density and idiom. Comment the *why*.
- Commit only when asked.

## 4. Commands

Node 24 (`.nvmrc`).

| | |
|---|---|
| `npm run dev` | Dev server at http://localhost:4321 (drafts visible) |
| `npm run build` | Static build to `dist/` (drafts excluded) |
| `npm run preview` | Serve `dist/` |
| `npm run check` | `astro check` (types + templates) |
| `npm run import-resume -- <file.docx>` | .docx → `src/content/resume/resume.yaml` via Claude. `--text` prints the extracted text with no API call; `--force` overwrites |
| `npx wrangler dev` | Serve `dist/` in the local Cloudflare runtime, with `_headers` applied (build first) |
| `npm run deploy` | Build and deploy by hand. Normally Workers Builds deploys `main` |

## 5. Layout

```
src/content.config.ts        collections: work, lab, notes, resume (schemas live here)
src/content/work/*.mdx       case studies; `order` sorts, `featured` puts one on the home page
src/content/lab/*.mdx        lab entries; `status`: live | wip | archived
src/lab/<slug>/              an experiment's components, imported by its MDX entry
src/content/notes/*.mdx      the blog (out of nav + sitemap until it has posts)
src/content/resume/resume.yaml  the résumé, the single source for /resume and its PDF
src/lib/resume.ts            résumé schema, shared by the collection and the import script
src/lib/content.ts           published(): drafts filtered (except in dev) and sorted
src/site.config.ts           site metadata + nav
src/layouts/Base.astro       every page's <head>, header and footer
src/styles/global.css        Signal/Verdigris tokens, base, prose, controls
src/components/              IndexList (rows), Status, SpecSheet, Trace (live readout)
src/lib/build.ts             commit + date for the footer stamp
src/lab/design-system/       the design-system specimen (lab entry `design-system`, draft)
scripts/import-resume.ts     .docx → YAML via Claude structured outputs
public/_headers              cache + security headers; workers.dev kept out of search
wrangler.jsonc               assets-only Worker
docs/                        STATUS, BRIEF, working/
```

## 6. Things the code knows that you don't

- **`draft: true` means dev-only.** `published()` drops drafts from production
  builds; dev shows them with a banner. The résumé is one entry, so a draft
  résumé is handled differently: in production `/resume/` redirects to About,
  every Résumé link hides (`resumeIsPublic()`), and the sitemap skips it.
- **Sitemap exclusions live in `astro.config.mjs`**: `/notes/` until it joins
  the nav, `/resume/` while `resume.yaml` says `draft: true` (read at config
  time).
- **`src/lib/resume.ts` runs under plain Node** (the import script uses type
  stripping). Keep it free of Astro imports and TS-only syntax such as enums,
  and import it with its `.ts` extension. It uses the `zod` package directly,
  which is the same Zod 4 copy `astro/zod` resolves to.
- **The importer is a bootstrap, not a sync.** After import, the YAML is the
  truth. It refuses to overwrite without `--force`, and always writes
  `draft: true`. The model is told to drop street address and phone; check
  anyway.
- **An island is an MDX import plus a `client:` directive.** Put the
  component under `src/lab/<slug>/` and use `client:visible` by default;
  `client:only="react"` for things that can't render on the server (canvas,
  WebGL, `window`).
- **Design rules (Signal, Verdigris).** Lists are `IndexList` rows, not cards.
  The accent is rationed: links, current nav, live readouts, status. Labels
  and numbers are mono (`.label`, `.num`). Colours come from tokens in
  `global.css` only; check both themes. `/lab/design-system/` in dev shows
  everything.
- **Theme:** auto by default. `ThemeToggle` sets `data-theme` on `<html>`
  (stored in localStorage); an inline script in `Base.astro` applies it before
  paint and after every view-transition swap. Dark tokens exist twice in
  `global.css` (system-dark and chosen-dark); change both together.
- **`Trace` never shows invented numbers on the front of the site.** It waits
  for real `/status` data (P4); the specimen passes `example`.
- **The footer stamp** reads `WORKERS_CI_COMMIT_SHA` (Workers Builds) or
  `git rev-parse HEAD` locally (`src/lib/build.ts`).
- **Vite warns `MODULE_LEVEL_DIRECTIVE` for each MDX file** at build. That's
  known Astro/MDX noise and harmless.
- **Hosting is an assets-only Cloudflare Worker** (`wrangler.jsonc`, no
  `main`). When an API is needed, add `main` and route only `/api/*` to it
  with `assets.run_worker_first`, so static pages never invoke the script.
- **This network intercepts DNS.** Check what the world sees with
  DNS-over-HTTPS (`curl -H 'accept: application/dns-json'
  'https://cloudflare-dns.com/dns-query?name=…&type=A'`), not `dig`.
