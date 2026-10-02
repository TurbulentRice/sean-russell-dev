# Cutover runbook: Route 53 → Cloudflare

> Slice 5 of [PLAN.md](PLAN.md). Status: **in progress** (phase 2). Tick steps as they
> happen and note anything that surprised us. Modelled on
> sean-russell-photo's `docs/working/p1-portfolio/CUTOVER.md`.
>
> **Sean** = Cloudflare dashboard, AWS console, Gmail. **Claude** = repo
> changes and checking each step from outside.

## Before (snapshot 2026-10-02, public DNS over HTTPS)

- **Registrar:** Amazon Registrar (Route 53 Domains), expires **2027-08-18**.
  Registration stays there; only the nameservers move.
- **Nameservers:** Route 53 (`ns-25.awsdns-03.com`, `ns-705.awsdns-24.net`,
  `ns-1140.awsdns-14.org`, `ns-1825.awsdns-36.co.uk`).
- **Records:** none that resolve. No A/AAAA at the apex or `www` (the EB alias
  died with the environment), no MX, TXT or CAA. Nothing to carry over, and
  nothing is live, so **this cutover has no downtime risk**.
- **DNSSEC:** off (no DS record at the registry). Safe to switch nameservers.

The hosted zone itself wasn't read (the AWS connector isn't authenticated).
Leftovers such as ACM validation CNAMEs don't matter: none get recreated.

## Phase 1: move DNS to Cloudflare

- [x] **Sean:** Cloudflare dashboard → **Add a domain** → `seanrusselldev.com`
  → **Free**. Choose "Connect a domain", not Transfer. The quick scan should
  find nothing; that's expected.
- [x] **Sean:** AWS console → **Route 53 → Registered domains →
  seanrusselldev.com → Actions → Edit name servers**. Replace the four
  `awsdns` servers with Cloudflare's two.
- [x] **Sean:** while there, confirm **auto-renew is on**. (On.)
- [x] **Claude:** confirm the registry shows Cloudflare's nameservers (DoH
  and whois) and Cloudflare reports the zone **Active**. Active 2026-10-02
  (Sean); Cloudflare's resolver caught up the same day. Earlier: registry
  (whois) and Google DNS show `coen` / `deborah.ns.cloudflare.com`; Cloudflare's
  resolver still had the cached `awsdns` set (Route 53's NS TTL is 2 days).

## Phase 2: go live

- [x] **Claude:** custom domain `www.seanrusselldev.com` in `wrangler.jsonc`,
  pushed straight to `main` (nothing was live, so no PR). Served build
  `793161b`. *Surprise:* this network's DNS cached the "doesn't exist" answer;
  checked with DoH + `curl --resolve` instead.
- [x] **Sean:** added `@` A `192.0.2.0` (Proxied) for a root → www redirect;
  **Always Use HTTPS** on.
- [x] **Decision (2026-10-02): the bare domain is canonical, not www.** No
  legacy URLs, shorter, matches autolight.ai. Sean deleted the `@` A record
  so the Worker could claim the apex.
- [x] **Claude:** `routes` → `seanrusselldev.com`; `site`/`url`, robots.txt
  and `_headers` follow.
- [x] **Claude:** apex live with build `3bf52a5`: Let's Encrypt cert, all
  pages 200, `/about` → `/about/` (307), 404 page, `http` → `https` (301),
  canonical links on the bare domain, `workers.dev` now 404. The deploy also
  removed the `www` custom domain and its record, so there was nothing to
  clean up by hand.
- [ ] **Sean:** DNS → `www` A
  `192.0.2.0`, **Proxied**; **Rules → Redirect Rules** → template "Redirect
  from WWW to root" (301, keep path and query).
- [ ] **Claude:** check every combination of `http`/`https` and bare/`www`
  ends at `https://seanrusselldev.com` with 301s in at most 2 hops, valid cert,
  sitemap, robots.txt, 404.

## Phase 3: email and analytics

- [ ] **Sean:** **Email Routing** → `hello@seanrusselldev.com` → Gmail.
  Send a test, and check Gmail's Spam folder (the photo site's first tests
  landed there).
- [ ] **Sean:** **Web Analytics** → automatic setup. **Claude** confirms a
  real browser visit reports.
- [ ] Optional: DMARC `p=none`; Google Search Console + submit the sitemap.

## Phase 4: retire Route 53

- [ ] **Sean:** after a week stable, delete the `seanrusselldev.com` hosted
  zone ($0.50/month). The domain registration stays in Route 53 Domains.
