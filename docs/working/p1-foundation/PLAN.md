# P1: Foundation

**Status: in progress.** Slice 1 done 2026-10-02.

Goal: a small, polished site live at www.seanrusselldev.com, with the
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

### 2. Design system

Type scale, colour tokens (light/dark), spacing, components (card, tag,
banner, code blocks), a view-transition treatment, generated OG images. The
tokens in `src/styles/global.css` are placeholders shaped for this.

*Done when:* every placeholder page looks finished at phone and desktop
widths, in both themes, with no CLS.

### 3. Positioning and copy

Workshop the headline and the About page with Sean. Home page structure final.

*Done when:* Sean signs off on the home and About copy.

### 4. Repo and CI

Push to GitHub (after the legacy repo is renamed, archived or deleted), connect
Workers Builds, and set up PR previews.

*Done when:* a PR gets a preview URL and `main` deploys.

### 5. Cutover

1. Add seanrusselldev.com to Cloudflare; recreate any Route 53 records still
   needed (check MX/TXT first).
2. Point the registrar's nameservers at Cloudflare. Check propagation with DNS
   over HTTPS, not `dig` (sean-russell-photo AGENTS.md: this network
   intercepts DNS).
3. Add the `routes` custom domain in `wrangler.jsonc`; redirect the bare domain
   to `www` with a Redirect Rule.
4. Email Routing: `hello@` → Gmail. Web Analytics on.
5. Once stable, delete the Route 53 hosted zone.

sean-russell-photo's `docs/working/p1-portfolio/CUTOVER.md` is the playbook.

*Done when:* https://www.seanrusselldev.com serves this site and `hello@`
delivers.

## Not covered, on purpose

- Case-study content and the résumé rewrite (P2).
- Real lab experiments (P3); the API Worker (P4).
