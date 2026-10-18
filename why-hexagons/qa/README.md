# Stage-4 QA — Why Hexagons?

Run: `node qa.mjs --shots` (needs Playwright; serve the repo root first, e.g.
`python3 -m http.server 8777`).

## Episode-specific checks

- The first frame is a crooked Voronoi foam, not a hexagon lattice. Junctions far from 120° are magenta.
- Free relaxation, coarsening off, brings every triple junction to within 1° of 120°. The angle is not an input.
- A square grid is four-fold. Those vertices split and do not return.
- Drag a vertex: the tag goes to Held, and the films haul it back.
- Tension only changes the clock. A decade of γ changes the time to within 30° by about 10×.
- Equal areas versus the Voronoi areas. Coarsening on: cells with more than six sides grow, cells with fewer shrink.
- Reshuffle mid-relax returns a crooked foam.
- γ = 0, γ at the top of the slider, and a vertex shoved off the canvas do not NaN.

Mean sides stay 6 on the torus, including the crooked frame. That is Euler, and the page says so.

## Last recorded pass — 2026-10-18

`node qa.mjs --shots` against `http://127.0.0.1:8777/why-hexagons/`. Exit 0. About 13 seconds.

| Check | Result |
|---|---|
| Self-test (`?selftest=1`) | **Pass.** 12 / 12. Worst junction 0.92° after relaxation. Screen wedges match the model to 0.00°. γ = 0.5 vs γ = 5 time ratio 10.0 |
| Console + page errors | **Pass.** none |
| Viewports | **Pass.** phone 390×844, tablet 768×1024, desktop 1440×950. No horizontal overflow |
| Touch targets | **Pass.** nothing under 24 px |
| Picture | **Pass.** crooked start is magenta and irregular; after relax the tag is "At 120°" and the films are a honeycomb with 5–7 scars still in it. The square seed is tagged "Four-fold — unstable" |
| Drag | **Pass.** tag "Held — angles wrong" |
| Coarsening | **Pass.** 15 cells with n>6 grew, 18 with n<6 shrank |
| Equal areas, reshuffle, γ = 0 and γ = 4 | **Pass.** no NaN |

Shots: `{phone,tablet,desktop}-{disordered,relaxed,squares}.png`.
