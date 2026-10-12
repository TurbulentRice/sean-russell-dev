# STATUS

> Last updated **2026-10-09**. Keep this short: point to the next slice and
> keep only notes that matter. The work lives in [working/](working/).

**Epic:** [P2: Story](working/p2-story/PLAN.md) (in progress). P1 is done.
**Next:** slices 1-2 (case-study template, AutoLight) on `feat/autolight-case-study`.
Work evidence lands in `private/` (git-ignored) the week of 2026-10-12.
**Deployed:** `main` → https://seanrusselldev.com (Workers Builds); changes
arrive by PR (AGENTS §3). Public repo: TurbulentRice/sean-russell-dev.

## Notes

- **Legacy loose ends:** Sean revokes the old OpenAI key (from the legacy
  `.env`, never committed). S3 resources deleted 2026-10-02. Old repo archived
  as `sean-russell-dev-legacy`. Route 53 zone deleted 2026-10-09.
- **The résumé is a draft** (`draft: true`), hand-converted from the 2025 .docx
  as context only. The rewrite belongs to P2.
- Case-study roles and periods are `TBD`: Sean to fill in.
- `npm audit` reports 9 findings (2026-10-09), all in build-time tools
  (wrangler, satori, mammoth, sharp). Nothing ships to browsers; update with
  normal dependency bumps, don't `--force`.
