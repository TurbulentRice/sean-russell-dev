# P2: Story

**Status: in progress.** Drafted 2026-10-09; decisions settled the same day
(below). Slices 1–2 under way. Slices 3–4 wait on Sean's work evidence
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

1. **The problem**: what was wrong, and for whom. Concrete, no jargon up front.
2. **Constraints**: what made it hard (legacy, scale, team, time).
3. **Decisions**: the two or three calls that mattered, the options weighed,
   and why. This is the core: it's what shows architectural judgement.
4. **What I built**: one architecture figure (self-numbering, site colors),
   and only as much detail as the decisions need.
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
training 124.8 s → 22.1 s on Metal, LrC 6–15 specimens, seeding, the
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

### 3. Synthetic monitoring

Needs the evidence export. Feature the decisions behind black-box probing of
critical journeys, alerting that catches slow-burn problems, the CI/CD and e2e
tie-in, and the debugging companion app. Results: dozens of tickets in month
one, most of them user-facing, systemic and silent (the cleared wording).

*Done when:* Sean approves and it publishes.

### 4. Event-driven ingest

Needs the evidence export. Before/after architecture figures (heavy
content-carrying messages vs. signals + fetch-from-source, consumer-side
coalescing, fan-out). The interactive simulation stays in P3 (the lab); this
slice gets static figures that the simulation can later replace or sit beside.

*Done when:* Sean approves and it publishes.

### 5. Résumé rewrite

Rewrite `resume.yaml` from the case studies outward: a summary that matches
the site's positioning, current-role bullets that lead with decisions and
outcomes, older roles condensed. Then the print stylesheet, checked as a real
PDF (Letter, one page if it can be, two at most), and `draft: false`, which
brings back the `/resume/` route and its links.

*Done when:* Sean approves the PDF and the page; `/resume/` is public.

### 6. Launch pass

All three case studies and the résumé live together. Home page order
(monitoring, AutoLight, ingest), link previews checked in iMessage / Slack /
LinkedIn, Lighthouse on every page type, and a last read of every page in
both themes on a phone.

*Done when:* Sean is happy to put the URL on the résumé and LinkedIn.

## Decisions

Settled 2026-10-09: Sean took every default, and gave the LinkedIn URL.

1. **Naming the employer in case studies.** The résumé names BBB. Case
   studies can name it ("at BBB") or stay general ("at a national
   nonprofit"). Naming it is more credible; general is safer if any detail is
   sensitive. Default: general in case studies, named on the résumé.
2. **Which numbers are cleared** for each work case study (after the export).
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

## Not covered, on purpose

- The ingest simulation, the lab template's polish, and new experiments (P3).
- The `/status` probe and the live trace (P4).
- Notes going live; the `/inside/` page (later).
- A photo on About (Sean: maybe eventually).
