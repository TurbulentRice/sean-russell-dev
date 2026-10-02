# BRIEF

> The direction, and the decisions behind it. Settled 2026-10-02. Change it
> deliberately: it's the thing future work is measured against.

## Why

seanrusselldev.com used to be a 2021-era Elastic Beanstalk app (CRA + Express)
built while Sean was learning to program: dogs, music, an uploader, an OpenAI
toy, and old projects mounted under `/pages`. The EB environment is gone; the
Route 53 hosted zone survives. The old repo
([TurbulentRice/sean-russell-dev](https://github.com/TurbulentRice/sean-russell-dev))
is abandoned, kept locally at `~/Dev/sean-russell-dev.BAK`.

The new site is a **professional personal dev site** that belongs on a résumé,
and also Sean's **laboratory** and the home for future side projects.

## Two jobs, kept apart

| | The front | The lab |
|---|---|---|
| For | A hiring manager with 30–90 seconds | Sean, and the curious visitor who stays |
| Tone | Curated, fast, quiet | Playful, labelled, allowed to be rough |
| Lives at | `/`, `/work`, `/about`, `/resume` | `/lab`, and subdomains for anything big |

The old site's failure was mixing them. Every lab entry carries a **status**
(`live` / `wip` / `archived`) and a date, so a rough edge reads as a choice.

## Positioning

**AI-empowered full-stack engineer.** The career path through application
frontend, backend, data engineering, and lately SRE / DevOps / CI/CD is **owning
the whole lifecycle**, not a detour.

Headline (decided 2026-10-02): *"I build things that work and fix things that
break."* Short and light, so the opening doesn't overcommit; the common thread
of every role. The lede carries the specifics.

Voice: the subtext is "gets things done", shown through outcomes and never said
outright. Lead with outcomes and decisions, not technology lists.

## The three pillars

Listed in this order. Each case study covers the problem, constraints, decisions, result, and what
Sean would change. Together they span the whole lifecycle.

| Case study | Proves | Draft |
|---|---|---|
| **Synthetic monitoring** for critical user journeys: probes, alerting, CI/CD + e2e integration, a debugging companion app. ~20 tickets in month one, ~90% user-facing, systemic, silent and unreproducible in dev. On the site: "dozens" (Sean's call). | Reliability, CI/CD, observability | `src/content/work/synthetic-monitoring.mdx` |
| **AutoLight** ([autolight.ai](https://autolight.ai), linked): a Mac app that learns a photographer's editing style from Lightroom catalogs. Sean's largest solo work. | Product, ML, desktop + web, perseverance | `src/content/work/autolight.mdx` |
| **Event-driven ingest rewrite** (internally "Blue Data Connector"): heavy, lossy content-carrying messages → lightweight signals, consumer-side coalescing for true FIFO, atomic fan-out, data pulled from the source. Cheaper, faster, recoverable; support can trigger updates themselves. | Backend + data architecture | `src/content/work/event-driven-ingest.mdx` |

### Rules for case studies

- **Employer work is generalized.** No internal names, hostnames, screenshots
  of internal tools, or numbers Sean isn't free to share. "Blue Data Connector"
  never appears on the site.
- **AutoLight's repo is private.** Tell it through architecture, decisions and
  screenshots (`autolight-lossless/docs/screens/`). Every AutoLight number must
  trace to `autolight-lossless/docs/BUSINESS.md` or `STATUS.md`, the same
  claims policy autolight-web follows.

### Show, don't tell

Two ideas that turn claims into evidence:

1. **A live `/status` page.** A Cloudflare Cron Trigger Worker runs synthetic
   probes against this site, autolight.ai and seanrussellphoto.com, stores
   results in D1, and the page renders uptime and an incident timeline. It's
   the synthetic-monitoring case study, running.
2. **An ingest simulation island** in the event-driven case study. Toggle
   legacy vs. signals, drop messages, and watch one design lose data and the
   other recover. Backend thinking, shown with frontend skill.

## Structure

| Route | Purpose |
|---|---|
| `/` | Positioning line, featured work, latest lab entries |
| `/work/` | Case studies (`work` collection) |
| `/lab/` | Experiments (`lab` collection); each a self-contained page |
| `/notes/` | The blog (`notes` collection). Built from day one, **out of the nav and sitemap until it has 2–3 posts** |
| `/about/` | Bio, links, photography cross-link |
| `/resume/` | Rendered from `src/content/resume/resume.yaml`; print stylesheet = the PDF |
| `/status/` | Later: the live probe (above) |
| `/inside/` (working name) | Later: **a look inside this site.** Its architecture and inner workings as an explorable page: the build pipeline, the islands, the résumé-as-data flow, the probe behind the uptime trace, live build metadata. Fun and informational; rewards the curious visitor, and shows the craft rather than claiming it. Replaces the plain colophon idea (Sean, 2026-10-02). |

## How, and why that way

| Piece | Choice | Why |
|---|---|---|
| Framework | **Astro 7**, static output | Same toolchain as sean-russell-photo. Content pages ship ~zero JS. |
| Interactivity | **React islands** (`client:visible`, `client:only`) | Full React where it earns its place, nothing elsewhere. An island can be an entire app. Other frameworks can be added per experiment if one calls for it. |
| Content | MDX content collections with Zod schemas | Typed frontmatter; a case study can embed a live component. |
| Hosting | **Cloudflare Workers static assets**, built by Workers Builds | Same setup as the photo site. Pages is being folded into Workers. Free, PR previews. |
| Dynamic bits | One Worker for `/api/*` only (`assets.run_worker_first`), added when first needed; D1/KV for state | Static pages never invoke or bill a script. |
| AI experiments | Workers AI or the Anthropic API, behind rate limiting + Turnstile | Cost protection on anything that spends money per call. |
| Side projects | Own repo, own Worker, `name.seanrusselldev.com` | Keeps this site lean; each project picks its own stack. Project page here links out. |
| Résumé | YAML in the repo, schema in `src/lib/resume.ts`, bootstrapped from .docx by `npm run import-resume` (Claude, structured outputs) | One source of truth for site and PDF. Writing the case studies sharpens the bullets. |
| Analytics | Cloudflare Web Analytics (edge-injected) | No cookies, no banner. |
| DNS | Move seanrusselldev.com from Route 53 to Cloudflare | Workers custom domains need the zone on Cloudflare. |
| Canonical host | **The bare domain**, `seanrusselldev.com`; `www` 301s to it (decided 2026-10-02) | No legacy URLs to keep (unlike the photo site), shorter on a résumé, matches autolight.ai. On Cloudflare the old reasons for www (apex CNAMEs, cookie scoping) don't apply. |

## Principles

- **The repo is public.** No street address, phone number, or personal email in
  it. The résumé uses `hello@seanrusselldev.com` (Email Routing → Gmail).
  Source résumés (`*.docx`) are git-ignored.
- **Quality is the portfolio.** Lighthouse 100s, real accessibility, dark mode,
  no layout shift. The site is itself a work sample.
- **Maintenance is a feature.** Static by default. Every dependency and service
  justifies itself against "untouched for six months and still works".
- **No third-party scripts** without a reason written in STATUS or a plan.

## Not doing (for now)

- A monorepo with the side projects. Revisit if real shared code appears (e.g.
  design tokens).
- Comments, newsletters, CMSs. MDX in git is the CMS.
- Porting the old site's apps one-to-one. Some may return as `archived` lab
  entries, honestly dated.

## Roadmap

| Epic | What |
|---|---|
| **P1 Foundation** | Scaffold, design system, home/about copy, cutover to seanrusselldev.com. [Plan](working/p1-foundation/PLAN.md) |
| **P2 Story** | The three case studies, and the résumé rewrite that comes out of writing them. Print-to-PDF. |
| **P3 Lab** | Lab template polish, 2–3 experiments, the ingest simulation. |
| **P4 Live** | The `/api` Worker and the `/status` synthetic probe. |
| **Later** | Notes goes live; the `/inside/` page; side-project subdomains. |
