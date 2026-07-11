# Stage-4 QA — Against the Wind

Run: `node qa.mjs --shots` (needs Playwright; serve the repo root first, e.g.
`python3 -m http.server 8777`).

## Last recorded pass — 2026-07-11

| Check | Result |
|---|---|
| Self-test (`?selftest=1`) | **19 / 19 assertions green** |
| Console + page errors | **none**, at every viewport, through every interaction |
| Viewports | 390 (phone), 768 (tablet), 1440 (desktop) — no horizontal overflow, no clipping |
| Touch targets | all controls ≥ 44 px |
| Every control | wind drag, steer through the no-go zone, rig toggle, trace polar, manual-trim stall |
| Degeneracies | zero wind · heading spun 240× · wind slammed 0.5↔30 kt · parameters changed mid-sweep — **no NaN** |
| In irons | head to wind → **0.000 kt**, state reports "In irons" |
| Over-sheet stall | beam reach 3.51 kt → 2.60 kt over-sheeted, state reports "Stalled — ease the sheet" |
| Running downwind | 5.42 kt, boom out at 90°, state "Running — sail as a drag device" |

The in-irons check is deliberately slow: a boat carries her way for a long time
after the sails stop pulling, which is exactly why irons was dangerous. An early
version of this harness failed her for "not stopping" after 2.5 seconds. She had
simply not finished stopping.

## What a pair of human eyes caught that this harness did not

The first published version passed every check above and was still wrong in three
ways, all of them found by a reader simply looking at the picture. Each is now an
assertion (A16–A18); the detail is in [FACTSHEET.md](../FACTSHEET.md).

1. **The "net thrust" arrow was meaningless.** It drew driving force *minus*
   resistance — which is zero at any steady speed, so it collapsed and flickered
   backwards. The overlay now draws the forces themselves.
2. **The boat ran downwind with her sail hauled in tight**, because angle of
   attack was clamped at 90° and auto-trim could not tell one sheeting angle from
   another.
3. **The tack-side convention was inverted**, mirroring every force vector and
   making the boat drift to *windward*.

The lesson for the pipeline: a QA harness that only asserts things about the
*model* will happily bless a *picture* that is a mirror image of the truth. Assert
the picture too, in world coordinates, on both tacks.

Screenshots in this directory are from the passing run.
