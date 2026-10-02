# Cutover runbook: Route 53 → Cloudflare

> Slice 5 of [PLAN.md](PLAN.md). Status: **in progress.** Tick steps as they
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

- [ ] **Sean:** Cloudflare dashboard → **Add a domain** → `seanrusselldev.com`
  → **Free**. Choose "Connect a domain", not Transfer. The quick scan should
  find nothing; that's expected.
- [ ] **Sean:** AWS console → **Route 53 → Registered domains →
  seanrusselldev.com → Actions → Edit name servers**. Replace the four
  `awsdns` servers with Cloudflare's two.
- [ ] **Sean:** while there, confirm **auto-renew is on**.
- [ ] **Claude:** confirm the registry shows Cloudflare's nameservers (DoH
  and whois) and Cloudflare reports the zone **Active**.

## Phase 2: go live

- [ ] **Claude:** PR adding the custom domain to `wrangler.jsonc`:
  `"routes": [{ "pattern": "www.seanrusselldev.com", "custom_domain": true }]`.
  The deploy creates the DNS record and certificate. Wrangler then turns the
  `workers.dev` address off; PR previews stay on.
- [ ] **Sean:** DNS → `@` A `192.0.2.0`, **Proxied**; **Rules → Redirect
  Rules** → root → `https://www.seanrusselldev.com` (301, keep path and
  query). Check **Always Use HTTPS** is on.
- [ ] **Claude:** check every combination of `http`/`https` and bare/`www`
  ends at `https://www.…` with 301s, valid cert, sitemap, robots.txt, 404.

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
