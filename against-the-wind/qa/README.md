# Stage-4 QA — Against the Wind

Run: `node qa.mjs --shots` (needs Playwright; serve the repo root first, e.g.
`python3 -m http.server 8777`).

## Last recorded pass — 2026-07-11

| Check | Result |
|---|---|
| Self-test (`?selftest=1`) | **16 / 16 assertions green** |
| Console + page errors | **none**, at every viewport, through every interaction |
| Viewports | 390 (phone), 768 (tablet), 1440 (desktop) — no horizontal overflow, no clipping |
| Touch targets | all controls ≥ 44 px |
| Every control | wind drag, steer through the no-go zone, rig toggle, trace polar, manual-trim stall |
| Degeneracies | zero wind · heading spun 240× · wind slammed 0.5↔30 kt · parameters changed mid-sweep — **no NaN** |
| In irons | head to wind → **0.000 kt**, state reports "In irons" |
| Over-sheet stall | beam reach 3.51 kt → 2.60 kt over-sheeted, state reports "Sail stalled" |

The in-irons check is deliberately slow: a boat carries her way for a long time
after the sails stop pulling, which is exactly why irons was dangerous. An early
version of this harness failed her for "not stopping" after 2.5 seconds. She had
simply not finished stopping.

Screenshots in this directory are from that pass.
