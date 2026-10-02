# P1: Foundation

**Status: in progress.** Slices 1, 2 and 4 done 2026-10-02.

Goal: a small, polished site live at seanrusselldev.com, with the
structure every later epic fills in.

## Slices

### 1. Scaffold ✅ (2026-10-02)

Astro 7 + React + MDX + sitemap, Workers static assets config, content
collections (`work`, `lab`, `notes`, `resume`), base layout, placeholder pages,
résumé schema + `npm run import-resume`, draft case studies capturing Sean's
own descriptions, an island smoke test (`/lab/island-check/`, draft).

*Done when:* `npm run check` and `npm run build` pass; the island hydrates in
dev. ✅ Verified in the browser.

**Where the code disagreed with the plan:**
- Drafts render in `npm run dev` only (`src/lib/content.ts`), with a banner.
  Draft résumé and Notes build but stay out of the sitemap (`astro.config.mjs`).
- The résumé YAML was hand-converted from the 2025 .docx rather than run
  through the importer, which is untested against the live API (no spend
  without Sean's say-so). `--text` mode is tested.
- Vite prints `MODULE_LEVEL_DIRECTIVE` warnings for every MDX file at build.
  Known Astro/MDX noise; harmless.

### 2. Design system ✅ (2026-10-02)

**Direction decided 2026-10-02: "Signal".** The site reads like a
well-instrumented system: quiet type, generous space, work as an index (lists,
not cards). The interest is in the details, chief among them a small live
latency/uptime trace in the hero fed by the `/status` probe (P4); until then
it's omitted or static. Sean's words: understated, "showing off a bit", never
on the nose. Considered and set aside: "Contact sheet" (monochrome, film-edge
metadata) and "Schematic" (dot grid, node graph). Borrow from them: frame
numbering for case-study screenshots, the diagram style for architecture
figures. Type: Schibsted Grotesk + IBM Plex Mono (self-hosted via Fontsource).
**Palette: Verdigris** (oxidised-copper green; neutrals tinted toward it),
chosen over Oxblood, Phosphor and International orange.

Type scale, colour tokens (light/dark), spacing, components (card, tag,
banner, code blocks), a view-transition treatment, generated OG images. The
tokens in `src/styles/global.css` are placeholders shaped for this.

*Done when:* every placeholder page looks finished at phone and desktop
widths, in both themes, with no CLS. ✅ Checked in the browser: light, dark,
375px (no horizontal scroll on any page).

What exists: tokens and prose styles (`global.css`), `IndexList` (numbered
rows, the site's main list form), `Status` (live / wip / archived as shape and
word), `SpecSheet`, `Trace` (the live readout, waiting on P4), self-numbering
figures (CSS counters), Vitesse code themes following the system theme, and a
footer build stamp linking to the deployed commit. The draft lab entry
`/lab/design-system/` shows every piece (dev only).

**Where the code disagreed with the plan:**
- Generated OG images moved to slice 3: they need final copy to be worth
  generating.
- Theme toggle added on request: auto (default, follows the system) → light →
  dark, in the footer (`ThemeToggle.astro`).
- Work entries gained an `area` field (reliability / data / product) for the
  list tag; the first stack item read badly (".net").

### 3. Positioning and copy

Workshop the headline and the About page with Sean. Home page structure final.
Headline decided 2026-10-02: "I build things that work and fix things that
break." Work order: monitoring, AutoLight, ingest.

Also: generated OG images per page (moved from slice 2).

*Done when:* Sean signs off on the home and About copy.

### 4. Repo and CI ✅ (2026-10-02)

Push to GitHub (after the legacy repo is renamed, archived or deleted), connect
Workers Builds, and set up PR previews.

*Done when:* a PR gets a preview URL and `main` deploys. ✅ `main` deploys to
https://sean-russell-dev.seanlawrencerussell.workers.dev; drafts 404 there,
workers.dev sends `X-Robots-Tag: noindex`, `/about` → `/about/` (307).
PR previews are configured but not yet exercised.

**Where the code disagreed with the plan:**
- The repo is public (TurbulentRice/sean-russell-dev). The old one is
  archived as `sean-russell-dev-legacy`.
- Workers Builds was connected in the dashboard by Sean; the local wrangler
  isn't logged in, so check deploys in the dashboard or by curl.

### 5. Cutover

1. Add seanrusselldev.com to Cloudflare; recreate any Route 53 records still
   needed (check MX/TXT first).
2. Point the registrar's nameservers at Cloudflare. Check propagation with DNS
   over HTTPS, not `dig` (sean-russell-photo AGENTS.md: this network
   intercepts DNS).
3. Add the `routes` custom domain in `wrangler.jsonc`; redirect `www` to the
   bare domain with a Redirect Rule (canonical host decided 2026-10-02).
4. Email Routing: `hello@` → Gmail. Web Analytics on.
5. Once stable, delete the Route 53 hosted zone.

sean-russell-photo's `docs/working/p1-portfolio/CUTOVER.md` is the playbook.

*Done when:* https://seanrusselldev.com serves this site and `hello@`
delivers.

## Not covered, on purpose

- Case-study content and the résumé rewrite (P2).
- Real lab experiments (P3); the API Worker (P4).
