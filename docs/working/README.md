# docs/working: the record, by epic

Each folder is an epic: the plan, its slices, and where the code turned out
to disagree with the plan. These docs are **accurate about their moment, not
necessarily about now.** For now, read [../STATUS.md](../STATUS.md).

| Epic | State |
|---|---|
| [p1-foundation/](p1-foundation/PLAN.md) | Scaffold, design system, copy, cutover. **DONE**: live 2026-10-04, closed 2026-10-09. Cutover record: [CUTOVER.md](p1-foundation/CUTOVER.md) |
| [p2-story/](p2-story/PLAN.md) | The three case studies, the first note, the résumé rewrite and exporter. **DONE** 2026-10-12. |
| [p3-lab/](p3-lab/PLAN.md) | Lab and Notes: the design system entry, two notes, the résumé tool, the ingest simulation. **In progress.** |

## Starting an epic

1. Give it a folder (`pN-name/`) with a `PLAN.md` that has a status line at the
   top: **planned / in progress / DONE**.
2. Break it into **slices**, each roughly one session's work, with a
   "done when" line.
3. Record where the code disagreed with the plan as you go.
4. End with **"Not covered, on purpose."**
5. On close, move loose ends into STATUS and add a row here.
