# P2: Story

**Status: in progress.** Drafted 2026-10-09; decisions settled the same day
(below). Slices 1-2 under way. Slices 3-4 wait on Sean's work evidence
(expected the week of 2026-10-12).

Goal: the three case studies published, and a rewritten résumé that comes out
of writing them. Together they should show the level Sean works at now:
making architectural and design calls and taking on large, hard pieces of
work, not just the title on his badge. Positioning lives in
[BRIEF.md](../../BRIEF.md#positioning).

## Evidence

The repo is public, so raw evidence never enters it.

- **Exports, metrics, tickets, notes from work go in `private/`** at the repo
  root. It's git-ignored; nothing there is ever committed or published.
- A case study cites only what has been **generalized** (no internal system
  names, hostnames, colleagues, or screenshots of internal tools) and
  **cleared** by Sean ("I'm free to share this number").
- Each case study ends its slice with a short **sources** note in this plan:
  which claims rest on which evidence, without repeating anything private.
- AutoLight claims trace to `autolight-lossless/docs/BUSINESS.md` and
  `STATUS.md`, as autolight-web does.

## What a case study is

About a five-minute read. The order:

0. **The lead figure**, right under the spec sheet: the study's most telling
   picture (a screenshot, the system's shape, the before and after), with a
   caption that stands on its own. A picture should land in the first screen
   (Sean, 2026-10-12). Later sections refer back to it as Fig. 01.
1. **The problem**: what was wrong, and for whom. Concrete, no jargon up front.
2. **Constraints**: what made it hard (legacy, scale, team, time).
3. **Decisions**: the two or three calls that mattered, the options weighed,
   and why. This is the core: it's what shows architectural judgement.
4. **What I built**: further figures as needed (self-numbering, site
   colors), and only as much detail as the decisions need.
5. **Results**: numbers where cleared, observed effects where not.
6. **What I'd do differently**: one or two honest lines.

Plus the spec sheet (role, period, stack), already in the layout.

## Slices

### 1. Case-study template and figures ✅ (2026-10-12, with slice 2)

The pieces every case study needs: an MDX `Figure` component for diagrams
(inline SVG in the site's tokens, light and dark) and screenshots (`<picture>`
with light/dark sources, frame-numbered captions from the design system), a
pull-quote/metric treatment for a headline number, and a "sources" footnote
style. Prove them on AutoLight.

*Done when:* the AutoLight draft uses each piece, in both themes and at 375px.
✅ Checked in the browser.

As built, in `src/components/case/`: `Figure` (numbered caption; `wide` uses
the page width, `scroll` keeps a dense diagram legible on phones by scrolling
it in its own frame), `Shot` (light and dark screenshots as optimized
AVIF/WebP; CSS shows the one matching the theme, and the hidden one is never
fetched), `Metrics` (headline readouts), `Notes` (the fine print). A case
study's own assets live in `src/work/<slug>/`, as lab assets do in
`src/lab/<slug>/`. The "sources footnote" became `Notes`: public readers get
where numbers come from and under what conditions; the private trail stays in
this plan.

### 2. AutoLight (in review, 2026-10-12)

No dependency on work evidence. The repo is private, so tell it through
architecture, decisions and the existing screenshots
(`autolight-lossless/docs/screens/`, light and dark). Likely decisions to
feature: learning from existing catalogs instead of presets; working out which
photos were *edited* when no catalog field says so; delivering as virtual
copies so the photographer reviews in Lightroom; the Python → Node boundary;
one-time license as a product decision.

*Done when:* Sean approves the draft and it publishes (`draft: false`). The PR
sets `draft: false`, so its preview URL shows the page and merging publishes it.

**Sources** (all `autolight-lossless`, private): README (what it is, the
three nouns, Commit-with-backup, the Python/Node rule), `docs/STATUS.md`
2026-09-23/25 (test counts, 1.38 GB / 4,249 frames vs ~28 GB extrapolated,
training 124.8 s → 22.1 s on Metal, LrC 6-15 specimens, seeding, the
leave-one-shoot-out finding), `working/redesign/P0_SPIKE.md` (133 tables,
~17 per virtual copy), `CLOSEOUT.md` (renderer vs catalog-write bet),
`working/migrations/ARCHITECTURE_BOUNDARIES.md` (~900 duplicated lines).
autolight.ai's live page (early access, waitlist) bounds launch claims.

**Where it disagreed with the plan:**
- The home screenshot is out: it shows real clients' names and wedding
  photos. Only the Style page (a test style, no client data) is used.
  Retake the home screen with demo catalogs if we want it.
- No benchmark numbers. The cross-shoot result is told qualitatively, as
  "the hard part, and where the work is now", per decision 5.
- The one-time license isn't mentioned: pricing isn't on autolight.ai yet.

### 3. Synthetic monitoring (in review, 2026-10-12)

Needs the evidence export. Feature the decisions behind black-box probing of
critical journeys, alerting that catches slow-burn problems, the CI/CD and e2e
tie-in, and the debugging companion app. Results: dozens of tickets in month
one, most of them user-facing, systemic and silent (the cleared wording).

*Done when:* Sean approves and it publishes.

**Sources:** the evidence export, case studies 2 and 4 (observability folded in
as "When the dashboards are wrong"). Every figure in the page is from it.

**Where it disagreed with the plan:**
- "Dozens of tickets" was wrong: 19 tickets, about 12 distinct user-facing
  defects. The page uses those numbers.
- Role is "Primary engineer": the initiative belonged to an engineering lead,
  and an SRE teammate built five journeys, the alert diagnostics and the
  scheduler. Both are credited.
- Two diagrams, not one: the probe pipeline, and the slow-render fallback.
- "What I'd do differently" is drawn from Sean's own "not yet measured" note
  (business impact); Sean to confirm it's his view.
- Prose tables dropped `tabular-nums`: Schibsted Grotesk widens commas with it.

### 4. Retiring a legacy data pipeline (in review, 2026-10-12)

Was "Event-driven ingest"; renamed to match the evidence. URL:
`/work/legacy-data-pipeline/`.

Needs the evidence export. Before/after architecture figures (heavy
content-carrying messages vs. signals + fetch-from-source, consumer-side
coalescing, fan-out). The interactive simulation stays in P3 (the lab); this
slice gets static figures that the simulation can later replace or sit beside.

*Done when:* Sean approves and it publishes.

**Sources:** the evidence export, case study 1. "~66.5M messages" is per 30
days (Sean, 2026-10-12).

**Where it disagreed with the plan:**
- Two stages, not one: the Solr exit (Sean owned the epic) came first and is
  half the story.
- The signal-and-pull pattern was a team decision; the page says so. Sean's
  decisions are the rollout ones, shown as a table (decision, instead of, why).
- No "cheaper, faster": neither was measured. The old listener isn't switched
  off yet, and the page says that too.
- "What I'd do differently" is drawn from Sean's "not yet measured" note
  (freshness, incident counts); Sean to confirm.

### 4b. Notes: the request-scoped cache (in review, 2026-10-12)

Decision 6 made this the first Notes post, so Notes joined the nav and the
sitemap with it (`site.config.ts`, `astro.config.mjs`). "One cache call per key,
per request" at `/notes/one-cache-call-per-key/`.

**Sources:** the evidence export, case study 3. The per-page call counts were
read off its chart (exact labels; saved in `private/`).

**Where it disagreed with the plan:**
- The lead figure is a dumbbell chart in HTML, not SVG, so labels stay legible
  on phones (`src/notes/request-scoped-cache/CallsChart.astro`).
- The C# block is an illustrative sketch, labeled as such; the production code
  stays private.
- The aside that a longer-lived in-memory cache "brings invalidation with it" is
  framing, not evidence; Sean to confirm it's his reasoning.

### 5. Résumé rewrite (in review, 2026-10-12)

Rewrite `resume.yaml` from the case studies outward: a summary that matches
the site's positioning, current-role bullets that lead with decisions and
outcomes, older roles condensed. Then the print stylesheet, checked as a real
PDF (Letter, one page if it can be, two at most), and `draft: false`, which
brings back the `/resume/` route and its links.

*Done when:* Sean approves the PDF and the page; `/resume/` is public. The PR
sets `draft: false`, so its preview shows the page and merging publishes it
(the sitemap and every Résumé link follow automatically).

As built: the title stays Full Stack Developer (decision 7); the summary and
bullets carry the level. bbb.org bullets lead with outcomes, all traced to the
evidence export. Comcast is condensed to four bullets, photography to one line
that points at AutoLight, Assembly and GCOM to an "Earlier" line. New schema
fields: `projects` (AutoLight) and `earlier`. Skills regrouped by domain, not
language. Prints to **two Letter pages** (checked with headless Chrome).

**Where it disagreed with the plan / for Sean to check:**
- The old "decreasing server request latency by 50%" claim is gone: the
  evidence shows 490 → 330 ms on category search (about a third), so that's
  what the résumé says.
- RPI (Electronic Arts, 2011-2012) and the Geneseo GPA/Dean's List line were
  cut for space. Easy to restore.
- Vendor integrations (Zendesk, Meraki, Five9) and QA bullets at Comcast were
  cut for space.

### 6. Launch pass

All three case studies and the résumé live together. Home page order
(monitoring, AutoLight, ingest), link previews checked in iMessage / Slack /
LinkedIn, Lighthouse on every page type, and a last read of every page in
both themes on a phone.

*Done when:* Sean is happy to put the URL on the résumé and LinkedIn.

## Decisions

Settled 2026-10-09: Sean took every default, and gave the LinkedIn URL.

1. **Naming the employer in case studies.** ~~Default: general.~~ **Changed
   2026-10-12: name bbb.org.** The evidence (complaints, reviews, seals)
   identifies it anyway, so a vague label would read as coy. Internal system
   names stay generic ("the main application", "the system of record", "the
   legacy listener service"); public technologies are named.
2. **Which numbers are cleared** for each work case study. The evidence export
   arrived 2026-10-12 (`private/engineering-case-studies-2026-10-12.txt`,
   git-ignored). Its figures are cleared, with Sean's caveats carried into each
   study's Notes. Commit and PR totals are cleared but used lightly: they show
   that Sean measures and ships, not much else. "About 66.5M messages … a day"
   is ambiguous (per day or per 30 days?) and stays out until confirmed. Never
   published: the query parameter that forces the configuration fallback, and
   how the probes' anti-automation exemption works.
3. **Résumé scope:** keep the photography business and the Assembly role as
   full entries, or condense pre-2021 roles into one "Earlier" line? Default:
   photography stays (it explains AutoLight), the rest condenses.
4. **LinkedIn URL** for the résumé and footer:
   `linkedin.com/in/sean-russell-professional` (in `site.config.ts`).
5. **AutoLight's public status:** what can the case study say about launch,
   pricing and platforms today? Default: link to autolight.ai and say only
   what that site already says. Context from Sean: the app is mid-way through
   extensive validation on editing *across shoots* (the project's hardest
   problem), and an autolight-web PR adding more detail waits on those
   results. So the case study is about the engineering, not a launch, and
   makes no claim about cross-shoot accuracy until autolight.ai does.
6. **What's featured.** Three case studies (monitoring with the
   observability work folded in, AutoLight, the legacy pipeline). The
   request-scoped cache becomes the first Notes post, which brings Notes live.
   The CMS-as-code work goes on the résumé.
7. **Title.** Sean's title is Full Stack Developer; the work is a senior
   engineer's, and that's the title he's aiming for next. The résumé keeps the
   real title and lets the bullets show the level.

## Not covered, on purpose

- The ingest simulation, the lab template's polish, and new experiments (P3).
- The `/status` probe and the live trace (P4).
- Notes going live; the `/inside/` page (later).
- A photo on About (Sean: maybe eventually).
