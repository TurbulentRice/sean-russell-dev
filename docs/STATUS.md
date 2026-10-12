# STATUS

> Last updated **2026-10-12**. Keep this short: point to the next slice and
> keep only notes that matter. The work lives in [working/](working/).

**Epic:** [P3: Lab and Notes](working/p3-lab/PLAN.md) (in progress). P1 and P2 are done.
**Next:** slice 2, the design system ("Signal") as the first published lab entry.
**Deployed:** `main` → https://seanrusselldev.com (Workers Builds); changes
arrive by PR (AGENTS §3). Public repo: TurbulentRice/sean-russell-dev.

## Notes

- **Legacy loose ends:** Sean revokes the old OpenAI key (from the legacy
  `.env`, never committed). S3 resources deleted 2026-10-02. Old repo archived
  as `sean-russell-dev-legacy`. Route 53 zone deleted 2026-10-09.
- `npm audit` reports 9 findings (2026-10-09), all in build-time tools
  (wrangler, satori, mammoth, sharp). Nothing ships to browsers; update with
  normal dependency bumps, don't `--force`.
