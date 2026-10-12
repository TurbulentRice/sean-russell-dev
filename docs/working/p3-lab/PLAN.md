# P3: Lab and Notes

**Status: in progress.** Drafted 2026-10-12, after P2's launch pass. Slice 1
in review.

Goal: the lab stops being empty, and Notes gets a steady second and third
post. The lab's first real tool is the résumé exporter, in the browser.

## Slices

### 1. Lab template polish (in review, 2026-10-12)

The lab index and entry page as built in P1 have only ever shown drafts. Give
them real content to settle against: the status key, how a full-width
experiment sits on the page, and what a lab entry's link-preview card says.
Retire `island-check` (plumbing, not an experiment); slice 4 proves islands
for real.

*Done when:* a published lab entry looks finished in both themes and at 375px.
(Nothing is published until slice 2, so this was settled on the design-system
draft in dev; slice 2 confirms it live.)

As built:
- `Stage` (`src/components/lab/Stage.astro`): the frame an experiment runs in,
  full width, labeled ("Interactive", "Specimen"), with an optional note and a
  "runs in your browser · nothing is uploaded" line for tools that take the
  visitor's data. A lab entry opens with its Stage, as a case study opens with
  its lead figure.
- An optional `updated` date beside the start date; the index shows the later.
- An automatic **Source ↗** link for any entry with code in `src/lab/<slug>/`,
  to that folder in the public repo (`site.repo`).
- The header-to-content gap matches case studies and notes, so the Stage lands
  in the first screen (522px down on a phone).
- `island-check` is gone.

### 2. "Signal", the design system, as a lab entry

The draft specimen (`/lab/design-system/`) becomes a published entry: the
tokens, type, components and the decisions behind them (why Verdigris, why
lists not cards, why one figure leads every case study). Status `live`: it
updates whenever the system does.

*Done when:* Sean approves and it publishes.

### 3. Notes: how this site is built, and CMS schemas as code

Two posts.

- **How this site is built.** The draft in `src/content/notes/`. Static by
  default and islands where they earn it, content as data (case studies,
  the résumé), link-preview cards at build, the footer build stamp, PR
  previews. The written version of the later `/inside/` page, which can grow
  out of it.
- **CMS schemas as code.** From the evidence export, case study 5: Storyblok
  schemas reviewed in pull requests and promoted by CI, sync that's additive
  by design, presets owned by editors in dev and by code in prod, and the
  frontend's road to production. Same rules as the case studies: bbb.org
  named, internal names generic, numbers from the export.

*Done when:* both publish.

### 4. The résumé tool, in the browser

A lab entry where anyone drops in their own `resume.yaml` (a template is
provided, matching `src/lib/resume.ts`), sees it validated against the same
schema, and downloads a .zip of exports: DOCX, Markdown, plain text and JSON
Resume, plus a print-ready page for PDF. It reuses P2 slice 7's renderers, so
the CLI and the tool can't drift. Everything runs in the browser; nothing is
uploaded, and the page says so. It never touches this site's own YAML.
The template is a real file to download (`resume-template.yaml`, commented,
with every field shown), not text to copy into a blank file (Sean,
2026-10-12).

*Done when:* a stranger's YAML produces a correct .zip, offline, on desktop and
phone.

### 5. The ingest simulation

The interactive piece the BRIEF promised the pipeline case study: legacy push
versus signal-and-pull, drop messages, watch one design lose data and the other
recover. A lab entry first; the case study links to it.

*Done when:* it publishes and the case study links to it.

## Not covered, on purpose

- The `/status` probe and the live trace (P4).
- The `/inside/` page (later; slice 3's note is its seed).
- Editing this site's résumé from a GUI: the YAML stays in git.
