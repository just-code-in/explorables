# Stage-4 QA — Against the Wind

Run: `node qa.mjs --shots` (needs Playwright; serve the repo root first, e.g.
`python3 -m http.server 8777`).

## Episode-specific checks

- Drag the wind.
- Steer through the no-go zone and confirm in irons. A boat carries her way; wait until she has actually stopped.
- Toggle the rig and confirm the no-go zone visibly widens.
- Trace the polar.
- Turn off auto-trim and stall the sail deliberately.
- Luff the sail and confirm it is still signalled.

Degeneracies: zero wind, heading spun rapidly, wind slammed between extremes, parameters changed mid-sweep. Nothing may NaN.

Assert the picture in world coordinates, on both tacks. On the square rig the bowsprit is the bow: it points at the heading, and the round end is the stern.

## Last recorded pass — 2026-10-18

`node qa.mjs --shots` against `http://localhost:8777/against-the-wind/`. Exit 0.

| Check | Result |
|---|---|
| Self-test (`?selftest=1`) | **Pass.** 19 / 19, including A18 (24 wind/heading combinations, both tacks, world coordinates) |
| Console + page errors | **Pass.** none, at every viewport, through every interaction |
| Viewports | **Pass.** phone 390×844, tablet 768×1024, desktop 1440×950. No horizontal overflow |
| Touch targets | **Pass.** harness flagged nothing under 24 px; buttons and sliders are drawn at 44 px |
| Wind drag | **Pass.** handle dragged from north to east; wind went to 90° at 30 kt |
| Rig toggle + polar | **Pass.** square rig traced at all three viewports (`*-square-traced.png`). No-go widened to ±69° |
| In irons | **Pass.** head to wind → 0.000 kt, state "In irons" |
| Over-sheet stall | **Pass.** beam reach 3.51 kt → 2.60 kt, state "Stalled — ease the sheet" |
| Luffing | **Pass.** tag "Luffing — sheet in" held across two frames; the course yards fluttered (magenta centroid shifted about 11 px) |
| Running downwind | **Pass.** A16: square rig δ = 90° at 6.18 kt. State "Running — sail as a drag device" |
| Degeneracies | **Pass.** zero wind, heading spun 240×, wind slammed 0.5↔30 kt, parameters changed mid-sweep. No NaN |
| Bow forward, both tacks | **Pass.** wind from north, headings 40° and 320°. Bowsprit extent forward of centre 153 px, stern 45 px aft, tip within 2 px of the centreline |

The frigate redraw replaced the curved sail belly with straight yards. A luffing sail no longer eases its camber into a curve. What still signals:

- **Stall.** The alarm tag, and the course yard on each mast turns magenta. The topsail yards stay ink.
- **Luffing.** The alarm tag "Luffing — sheet in", the same magenta course yards, and a small flutter of the yards. There is no separate curved luffing shape.

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
