# Why Hexagons? — design spec

Approved by Justin Simpson on 2026-10-18. This is the contract. The fact sheet and the page may not renegotiate it.

The gallery line this has to honour:

> surface tension relaxes a honeycomb until 120° junctions happen on their own.

## The experience

You are looking down on a two-dimensional dry foam. The first frame is crooked. Films meet at ugly angles. Nothing on the canvas is a honeycomb.

Then it relaxes. Vertices creep. Corners tighten. The junctions settle at 120°, and they were not told to.

What you can do:

- **Watch.** A histogram of junction angles fills in at 120°. A state tag says whether the foam is still moving.
- **Drag a vertex** and let go. The three films pull it back, and the three angles return to 120°. While you hold it, the angles are wrong on purpose and the readout says so.
- **Change the tension.** The foam relaxes faster or slower. The angle it relaxes *to* does not move.
- **Start from squares.** Four films meet at a point. That point will not hold: it splits, and the pieces go to 120°.
- **Give the cells different areas.** Edges, which were straight, bow into arcs. Give them equal areas again and the arcs straighten.
- **Let them breathe** (off by default). Cells with more than six sides grow, cells with fewer shrink, six-sided cells hold their area. This is a second act. The opening act is the angle, not the coarsening.

The page is Episode 2 in the same house as Against the Wind: paper, serif headline, mono readouts, magenta `#a83266` used sparingly. Eyebrow, title, standfirst, then the stage. Simplifications are written on the page, not only here.

Proposed standfirst, to be revised when the fact sheet exists:

> A honeycomb is not drawn. It is what a foam does when every junction is pulled equally from three sides. Drag a corner out of place and watch the films haul it back to 120° — an angle the simulation is never given.

## What must emerge

These are the results. They are not inputs.

| Result | What is allowed to be an input |
|---|---|
| Junctions at 120° | A line tension γ, the same on every film |
| The angle does not care about γ | γ may set the speed |
| A four-fold point falls apart | The rule that an edge shorter than ε suffers a T1 |
| Only a hexagon is a regular cell with 120° corners | The polygon angle formula, shown as geometry, not as a stamp |
| Cells with n ≠ 6 change area when gas can cross a film | The rate κ, as a timescale, once Stage 2 has sourced it or marked it `UNVERIFIED` |
| Mean number of sides is 6 | Nothing. This is Euler on a torus of triple junctions. It is true of the crooked first frame. The page must say it is bookkeeping, not a discovery |

Forbidden as inputs, seeds, or drawing tricks:

- Coordinates of a regular hexagonal lattice, including a "slightly noisy honeycomb" that is already the answer.
- A lookup that says a relaxed cell is drawn as a hexagon.
- A decorative belly on a film. The stroke is the model's edge, arc or straight. If the model says straight, the picture is straight.
- Painting magenta on whatever has six sides. Magenta marks the junction under the finger, and a junction whose angle is still far from 120°. It does not mark the moral.
- Deleting pentagons to tidy the picture. A 5 next to a 7 is a scar a T1 left behind. It stays until the physics removes it.

⟨n⟩ = 6 will be true as soon as every vertex has three films, by Euler, on a torus (χ = 0, 2E = 3V, 2E = ⟨n⟩F). The selftest checks it as an identity. The prose does not pretend the relaxation found it. The thing the relaxation finds is the angle. The hexagon is what you get when that angle and six sides land on the same cell, and the pressures match so the sides are straight.

A regular n-gon has interior angle ((n − 2)/n)·180°. Set that equal to 120° and n = 6 falls out. The side panel may show this arithmetic — it is geometry, a ruler next to the foam, not a second simulation. It does not excuse a foam that was hexagonal at frame zero.

## The physics model

A **two-dimensional dry foam**. Films have no thickness. The domain is a torus, so every junction is a bulk junction and the walls do not pin an angle at 90°. One copy of the domain is drawn; edges that wrap are drawn wrapping, not clipped into a lie.

### State

- Vertices on the torus.
- Edges. Each edge is shared by two cells. An edge is a circular arc, which includes a straight line as the arc of infinite radius.
- Cells, each with a target area A*. With coarsening off, A* is constant.
- Every film carries the same line tension γ. Tension is a force, not a spring. It does not grow with length and it does not vanish when the film is short.

About 40 to 60 cells. Few enough to read on a phone, enough that one defect does not dominate the picture. The default seed is fixed, so the selftest is reproducible. Reshuffle draws a new seed.

### Two clocks

They stay separate. One slider must not silently turn the other on.

1. **Mechanical relaxation**, the opening act. Overdamped vertices move downhill in total film length, at fixed cell areas. Equilibrium is a minimum of Σ γ · length subject to area(cell) = A*. At that minimum, three unit tangents at a vertex sum to zero, and each film is an arc whose curvature is set by the pressure jump across it.
2. **Coarsening**, off until the user asks. Target areas then change by von Neumann's law, dA*/dt = κ (n − 6). Topology changes only as a consequence: a T1 when an edge collapses, a T2 when a three-sided cell vanishes. Nothing in the coarsening path is allowed to delete a cell for having the wrong number of sides.

γ and κ are timescales. Raising γ speeds the creep. It must not shift the equilibrium angle. κ, if Stage 2 cannot source a physical value, is a rate the user sets and the page calls it a rate.

### Forces, so the builder does not substitute springs

At a vertex, each film contributes γ along the outward unit tangent of that film. Three equal forces balance only at 120°.

A Hookean spring (force proportional to extension, or to length) is the wrong object. It balances at 120° only when the three forces happen to be equal, which is a special case, and it pulls harder on a longer film. The selftest's tension sweep exists to catch that substitution.

Pressure is the Lagrange multiplier that holds each area at A*. Across a film between cells a and b the model uses

ΔP = P_a − P_b = γ / R

with R the signed radius of the arc. Stage 2 has to confirm this factor for a **2D** foam. The 3D soap bubble's 2γ/R or 4γ/R must not be imported. If the literature splits on how γ is defined, the fact sheet records the convention and the builder follows the fact sheet.

Straight edges are the equal-pressure case, R → ∞, not a separate drawing mode.

### Topology

- **T1.** An edge shorter than ε is removed. The two cells that shared it stop being neighbours; the two that were not become neighbours. Four cells, one neighbour switch. ε is a small fraction of the mean edge length, declared in the fact sheet, not tuned until the picture looks hexagonal.
- **Four-fold split.** A vertex with four films is not an equilibrium. A small push — one percent of the mean edge length, or the noise already in the squares seed — runs a T1 and leaves two triple junctions. The split direction may follow the shorter diagonal so the symmetric case is not a frozen coin flip. The anchor is the outcome, not the coin.
- **T2.** A three-sided cell whose area falls below ε is removed and the three neighbours meet at a new triple junction. Used by coarsening. Not used as a cleanup pass in the opening act.

### Initial conditions

Both are required, and neither is a honeycomb.

- **Disordered**, the default. Voronoi of Poisson points on the torus. Angles are not 120°. Areas differ until the user asks for equal areas.
- **Squares.** A square lattice, four films at each vertex. This is the picture that makes the instability obvious.

Equal-area mode rescales or reassigns A* so every cell carries the same area. It does not move vertices onto a hexagonal lattice.

A global perfect honeycomb is not a pass condition. Defects may survive. The pass condition is the angle, the arcs, and this: a cell whose edges are equal, within a few percent, has six of them.

### Integration

Overdamped. No inertia, no momentum to NaN. Explicit integration is fine if it is stable when γ is at the top of the slider and when a T1 storm fires. While the user is not dragging and coarsening is off, total film length does not increase, and each area stays at its A* within a tight tolerance. Dragging is a constraint on one vertex, released on pointer-up.

## Accuracy anchors

Encoded in `?selftest=1` before the physics is written, against the same step the animation uses. Tolerances below are the contract; Stage 2 may tighten a tolerance if a source gives one, and may not loosen these to make a wrong model pass.

| # | Assertion |
|---|---|
| **A1** | After relaxation, every three-fold junction is 120° within 1°, in the model. |
| **A2** | A four-fold vertex, pushed by 1% of the mean edge, splits into two three-fold junctions and does not return. Both end within 1° of 120°. |
| **A3** | The equilibrium angle at low γ and at high γ agrees within 0.5°. The time to get within 1° of 120° scales as 1/γ, within a factor of two over a decade of γ. |
| **A4** | With coarsening on and mechanical equilibrium maintained, dA/dt has the sign of (n − 6), is ~0 at n = 6, and does not depend on the cell's area. The slope is κ. No asserted numerical κ until the fact sheet has one. |
| **A5** | From both initial conditions, with equal areas and coarsening off: the foam was not seeded with hexagon coordinates; after relaxation, any cell with equal edge lengths (few percent) has n = 6; a leftover 5–7 pair is allowed and must still have 120° corners. |
| **A6** | No NaN and no freeze: γ = 0, γ at the slider maximum, equal areas, one cell given almost all the area, a vertex dragged off the canvas, reshuffle mid-relax, a run of T1s. Areas stay non-negative. |
| **A7** | The **picture** matches the model. At a relaxed junction and at a junction held askew by the pointer, the angle measured from the drawn tangents, in screen pixels, matches the model's angle within 2°, in all four quadrants of the canvas. The sagitta of a drawn arc matches the model's R. A straight edge is drawn straight. |
| **A8** | Young–Laplace on the picture: for a bowed film, R measured from the stroke equals γ / \|ΔP\| within a few percent. |
| **A9** | Free relaxation (no drag, coarsening off): total film length is non-increasing, and every area stays at its A*. |
| **A10** | Release a dragged vertex. Its three angles return to within 1° of 120°. |
| **A11** | On the torus, once every vertex is three-fold, ⟨n⟩ = 6 exactly, including on the crooked frame before any relaxation. |

A1 is the result the way six points was the result in Episode 1. The code is given equal tension. It is not given 120°.

A7 is here because Episode 1's harness blessed a mirror-image chart. Measuring the model's angle and not the pixels is not a pass.

## Layout

One file, `why-hexagons/index.html`. Vanilla JS, canvas, inline CSS, no dependencies, no build. Same tokens as Episode 1.

**Masthead.** Eyebrow `Explorables / Episode 2`. Title `Why Hexagons?`. The standfirst above.

**The stage**, one column on a phone, canvas beside the controls from 768px up.

- The canvas is the foam. Hint under it: drag a vertex; the other controls are named in the side panel.
- State tag, text, not colour alone: `Relaxing`, `At 120°`, `Held — angles wrong`, `Four-fold — unstable`, `Coarsening`.
- Side panel, mono readouts:
  - the three angles at the selected junction
  - mean junction angle, and the share of junctions within 2° of 120°
  - ⟨n⟩, with a one-line caption that this is Euler
  - selected cell: n, area, and dA/dt when coarsening is on
  - angle histogram
- Controls, each a real control with a 44px touch target:
  - tension, a slider
  - areas: mixed / equal
  - coarsening: off / on
  - start: disordered / squares
  - reshuffle
- Legend. Ink is a film. Magenta is the junction you are holding, or one that has not reached 120°. A bowed film is a pressure difference. A straight film is not.
- Prose under the stage, short. The 120° argument, the n = 6 arithmetic, and why a 5 beside a 7 is allowed to remain. Then the simplifications, in the page.
- Selftest table appears for `?selftest=1`, as in Episode 1.
- Sources and credits wait for the fact sheet. The draft page does not invent a citation.

**Colour and motion.** Paper background, ink films. No honeycomb texture, no bees, no wax photo. Reduced motion: relax in jumps the user steps, or settle immediately and still report the angles. The equilibrium must be inspectable without the animation.

**Selection.** Pointer-down on a vertex selects it and, past a small movement threshold, drags it. Pointer-down on a cell selects the cell. The selected junction's angles are visible as numbers, so the page is not colour-only.

## Checks the QA note will have to list

Stage 4's harness does not exist yet. When it does, `qa/README.md` lists at least:

- Drag a vertex out and release it. The tag goes to `Held` and back, and A10's return to 120° is visible.
- Tension slider at both ends. Same resting angle, different speed.
- Squares, then wait. Four-fold points are gone.
- Equal areas. Arcs flatten. Mixed areas. They bow.
- Coarsening on, long enough for a five-sided cell to lose area and a seven-sided cell to gain it.
- Reshuffle during a relax.
- Viewports 390×844, 768×1024, 1440×950. Screenshot the disordered start, the relaxed equal-area foam, and the squares start after it has split. Names: `{phone|tablet|desktop}-{disordered|relaxed|squares}.png`.
- Degeneracies in A6. Nothing NaNs, nothing freezes, the histogram does not get stuck.
- Picture check in A7, on the pixels, including a junction in each quadrant.

## Declared simplifications

Said on the page, in this spirit:

- Two dimensions. Real foams are three-dimensional, and four films meet along an edge at the tetrahedral angle. That angle is a footnote, not a mode.
- Dry films, zero thickness. A wet foam has fat borders and slightly different angles. This one does not.
- The same tension on every film, no gravity, no temperature, no wax.
- Overdamped. Vertices have no mass. The creep is a relaxation, not a splash.
- A torus. The boundary of a real sample pins films and spoils the angle, so this sample has no boundary.
- Coarsening uses von Neumann's (n − 6) and nothing else. No liquid drainage, no film rupture except the T2 that follows a vanishing cell.
- ε, the length that triggers a T1, is a numerical stand-in for a film that has already reached zero. It is not a measured length.

## Non-goals

- Not a 3D foam, and not a toggle that switches to one.
- Not a bee, a hive, or a claim about what an insect intends. The circular-cell story is context for Stage 2. It goes on the page only if a source survives, and then as a sentence, not as a second model.
- Not a proof of the honeycomb conjecture. Hales is a theorem about the shortest fence around equal areas. The foam is a dynamical system that minimizes film length. The page may say they are related. It may not say the simulation proved it.
- Not wax rheology, a hive temperature, or a surface-tension value for beeswax, unless a later revision of this spec adds them after Stage 2.
- Not Surface Evolver. No arbitrary surface energies, no 3D meshes.
- Not a game about drawing the best tiling.

## Claim clusters for Stage 2

One card per cluster. Each card asks for a sourced fact sheet. Any number that cannot be sourced comes back `UNVERIFIED`. The worker's whole fact sheet goes in the completion summary.

The strong-model session consolidates. That consolidation is the only thing allowed to turn these claims into parameters.

**A — Plateau, two dimensions.** Three films of equal tension meet at 120°. Primary source, not a textbook paraphrase: Plateau, *Statique expérimentale et théorique des liquides soumis aux seules forces moléculaires* (1873), and one modern statement (Weaire & Hutzler, or better if the card finds one) that says the 2D law cleanly. Record the tetrahedral angle arccos(−1/3) as the 3D sibling, with its citation, and stop. We will not simulate it.

**B — Young–Laplace in two dimensions.** Confirm ΔP = γ / R for a 2D foam, and write down what γ is (line tension). Explicitly reject, with the formulae written out, the 3D single-surface 2γ/R and the soap-bubble 4γ/R, so nobody "corrects" the factor later. Units.

**C — von Neumann and Mullins.** von Neumann 1952 and Mullins 1956. The exact prefactor, the assumptions (constant tension, 120° junctions, circular arcs), and whether the law in a dry 2D soap froth is gas diffusion or curvature-driven boundary motion. If the prefactor is not something this page should quote, say so, and κ stays a user timescale marked `UNVERIFIED` as physics and honest as a clock. The (n − 6) and the zero at n = 6 are the part the episode needs.

**D — Topology.** Euler's theorem giving ⟨n⟩ = 6 for a large 2D foam and exactly 6 on a torus of triple junctions. Definitions of T1 and T2 that a programmer can implement without inventing a variant. Standard references (Weaire, Glazier) are fine if the primary statement is quoted.

**E — The honeycomb story, as context only.** Karihaloo, Zhang & Wang, *J. R. Soc. Interface* (2013), on circular cells becoming rounded hexagons, and the replies that disagree. Hales, the honeycomb conjecture (proved 1999, published 2001). The card returns what is actually claimed and what was disputed. No wax temperature, no surface tension of wax, unless it arrives with a source and this spec is revised to use it. Default is that the page does not quote one.

No cluster asks the fleet to design the page, name the controls, or pick a seed. That work stays here.

## What this spec refuses to decide

- The numerical value of κ, of γ, and of ε. Timescales and a cutoff. Stage 2 or, failing that, an honest `UNVERIFIED`.
- Whether a square lattice anneals all the way to a defect-free honeycomb. If it stops with 5–7 pairs at 120°, that is a result and the page should show it. Do not add a later pass to finish the job.
- Copy that depends on cluster E. The standfirst above does not mention bees, and it should not grow a bee until the fact sheet has earned one.
