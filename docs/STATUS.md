# STATUS

> Last updated **2026-10-09**. Keep this short: point to the next slice and
> keep only notes that matter. The work lives in [working/](working/).

**Epic:** [P2: Story](working/p2-story/PLAN.md) (planned). P1 is done.
**Next:** Sean answers P2's five decisions; slices 1–2 (template, AutoLight)
can start now. Work evidence lands in `private/` (git-ignored) the week of
2026-10-12.
**Deployed:** `main` → https://seanrusselldev.com (Workers Builds). Public repo: TurbulentRice/sean-russell-dev.

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
