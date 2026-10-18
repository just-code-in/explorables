# Why Hexagons? — fact sheet

Every number the simulation is allowed to treat as physics, and where it came from.
Compiled 2026-10-18. The claim clusters are the ones named in `SPEC.md`. The
sources below were read and consolidated in the build session. The Hermes fleet
was not dispatched for this pass; where a number was not in the sources, it is
`UNVERIFIED`, not invented.

---

## 1. Sourced — measured or proved, and load-bearing

### Three films meet at 120°

Plateau's laws, from experiment on soap films. A liquid edge carries at most
three films, and they meet at **120°**. Four edges meet at a point, at
**109°28′**, which is the tetrahedral angle arccos(−1/3) ≈ 109.47°. Anything
else is unstable and rearranges.

— **Joseph Plateau, *Statique expérimentale et théorique des liquides soumis aux
seules forces moléculaires*, Gauthier-Villars, Paris, 1873.** The laws, including
the 120° and the 109°28′, are stated from that work by the Museum of the History
of Science, Ghent (Plateau's own instrument collection): three films at a liquid
edge, four edges at a point.

Jean Taylor later proved the laws as the condition for a minimizing surface.
— **Jean E. Taylor, "The structure of singularities in soap-bubble-like and
soap-film-like minimal surfaces," *Annals of Mathematics* 103 (1976), 489–539.**

This episode uses only the two-dimensional law: three equal line tensions
balance when the unit tangents sum to zero, which is 120°. The tetrahedral angle
is not simulated. It is the three-dimensional sibling, and the page says so.

The model is not given the number 120. It is given equal tension on every film.

### The pressure jump in two dimensions

For a film with one finite radius of curvature (a circular arc, the 2D case):

- If **γ is the tension of the whole film**, ΔP = γ / R.
- If **γ is the surface tension of one air–liquid interface**, a soap film has
  two surfaces, and a quasi-2D cell wall obeys ΔP = 2γ / R.
  — stated for the PLAT simulator in **J. Winkelmann, F. F. Dunne, V. J. Langlois,
  M. E. Möbius, D. Weaire & S. Hutzler, *Philosophical Magazine* (2017),
  "Statistics and topological changes in 2D foam from the dry to the wet limit,"**
  where r = 2γ / (p_i − p_j) for a wall between two bubbles and r = γ / Δp for a
  single liquid–gas interface.
- A spherical soap bubble, two surfaces and two equal radii, is ΔP = 4γ / R.
  That factor is not used here.
- A 3D dry film is ΔP = 4γ κ with κ the mean curvature (γ one interface), which
  reduces to the quasi-2D wall when one radius is infinite.
  — **S. Cox, D. Weaire & K. Brakke, "Liquid Foams"** (their Laplace–Young
  statement).

**Convention in this model:** γ is the film tension, one number for every film,
and ΔP = γ / R. The factor of 2 that appears when γ means a single interface is
absorbed into that definition. γ is a timescale (see below), not a laboratory
surface tension, so there is no joule-per-square-metre to get wrong. Do not
"correct" the code to 2γ/R or 4γ/R without changing what γ means.

### von Neumann's (n − 6)

In a two-dimensional froth of circular arcs meeting at 120°, the gas a bubble
gains or loses is proportional to **n − 6** and does not otherwise depend on the
bubble's shape. Hexagons hold their gas. Pentagons all lose it at one rate.
Heptagons all gain it at that same rate.

— **John von Neumann, written discussion in *Metal Interfaces*, American Society
for Metals, Cleveland, 1952, pp. 108–110.** His coefficient "depends only on the
general properties of the froth and of its containing Flat Cell." He does not
give a universal number for it.

The same (n − 6) holds for curvature-driven grain boundaries, with a definite
prefactor. Each triple junction turns the tangent by 60°. The boundary then
moves toward its centre of curvature at speed M γ κ, and

dA/dt = (π/3) M γ (n − 6).

— **W. W. Mullins, "Two-dimensional motion of idealized grain boundaries,"
*Journal of Applied Physics* 27 (1956), 900–904.** The prefactor (π/3) M γ is
the isotropic grain-growth constant. It is not the permeability of a soap film.

`UNVERIFIED`: a physical value of the coarsening constant for the dry 2D soap
froth on this page (film permeability, thickness, gas). The page does not quote
one. κ on the coarsening control is a **rate the user sets**. The self-test
checks the sign, the zero at n = 6, the independence of area, and that the slope
equals that rate. It does not check a laboratory number.

### Six sides is Euler

On a torus, V − E + F = 0. Three films at every vertex means 2E = 3V. Counting
sides, 2E = ⟨n⟩ F. Substitute: ⟨n⟩ = 6, exactly, as soon as every vertex is
triple — including on the crooked first frame, before anything relaxes.

This is bookkeeping. The page says so. The relaxation is not credited with
discovering it.

A regular n-gon has interior angle ((n − 2)/n) × 180°. That equals 120° only
for n = 6. The side panel shows this arithmetic as geometry, beside the foam,
not as a second simulation.

### Topology of the rearrangements

- **T1.** An edge shrinks away. The two cells that shared it separate; the two
  that did not become neighbours. A four-fold vertex is the unstable midpoint
  and splits into two triple junctions.
- **T2.** A three-sided cell shrinks away and the three neighbours each lose a
  side.

— **D. Weaire & N. Rivier, "Soap, cells and statistics — random patterns in two
dimensions," *Contemporary Physics* 25 (1984), 59.**

The four-fold split in the code is that T1 midpoint: the new edge follows the
shorter diagonal of the four neighbours, and a symmetric square uses the vertex
index to break the tie so the split is not a frozen coin flip. The separation
at which the new edge is born is a numerical length, below.

### What this page refuses to settle

The honeycomb conjecture is a theorem about fences, not a result of the
simulation: any partition of the plane into equal areas has perimeter at least
that of the regular hexagonal honeycomb.

— **Thomas C. Hales, "The Honeycomb Conjecture," *Discrete & Computational
Geometry* 25 (2001), 1–22.**

Whether bees *make* hexagons by surface tension is disputed, and this model does
not take a side.

- **B. L. Karihaloo, K. Zhang & J. Wang, "Honeybee combs: how the circular cells
  transform into rounded hexagons," *J. R. Soc. Interface* 10 (2013), 20130299.**
  They argue circular cells become rounded hexagons as warm wax flows at the
  triple junction.
- **D. Bauer & K. Bienefeld, "Hexagonal comb cells of honeybees are not produced
  via a liquid equilibrium process," *Naturwissenschaften* 100 (2013), 45–49.**
  They watched bees shape the wax with antennae, mandibles and legs, and
  measured wax at **33.6–37.6°C**, below the **40°C** they say a liquid-equilibrium
  story needs. Those two temperatures are their measurements, quoted here so the
  dispute is real. **They are not parameters of this simulation.**
- **F. Nazzi, "The hexagonal shape of the honeycomb cells depends on the
  construction behavior of bees," *Scientific Reports* 6 (2016), 28341.** Cells
  can start round; Nazzi argues the hexagon still depends on what the bees do.

The standfirst does not mention bees.

---

## 2. The model's own numbers — timescales and cutoffs, not measurements

| Quantity | Value | What it is |
|---|---|---|
| γ | slider, 0 to 4, default 1 | Film tension as a **speed**. Equilibrium angle does not depend on it. At 0 the foam stops. |
| κ | slider, default 0.015 per second when coarsening is on | The von Neumann rate. `UNVERIFIED` as a physical constant. Honest as a clock. |
| ε | 0.15 × the median chord | Length below which an edge is collapsed (T1). A numerical stand-in for a film that has already reached zero. Not a measured length. |
| Split gap | 0.025 of the torus width | How far the two new triple junctions are pulled apart when a four-fold point splits. Above ε for a 7×7 grid (median chord 1/7), so the new edge is not immediately collapsed. |
| Domain | unit torus | No boundary, so no wall can pin an angle at 90°. |
| Default foam | 48 seeds, minimum separation 0.055, seed 20261018 | Poisson points → periodic Voronoi. Not a hexagonal lattice. |
| Squares | 7×7 cells | Four films at every vertex, until they split. |

Area targets are normalised so they sum to the area of the torus. With
coarsening off they are constant. With coarsening on, dA\*/dt = κ (n − 6). The
sum of (n − 6) over a triple foam is zero, so the targets stay a partition of
the torus without a separate correction.

---

## 3. `UNVERIFIED` — and what the page does about it

- The physical coarsening constant of a dry two-dimensional soap film. The
  control is a rate, labelled as a rate.
- A surface tension or a temperature for beeswax. Not shown, not used.
- Any claim that a bee intends a hexagon, or that wax flow is how combs are
  built. The sources disagree. The foam is not a bee.

---

## 4. The anchors, as tests

Run them from the page: `index.html?selftest=1`. They execute the same step the
animation uses. The pass criteria are the ones in `SPEC.md` (A1–A11).

A1 is the result. The code is given equal tension. It is not given 120°.

---

## 5. Declared simplifications

Stated on the page as well: two dimensions; dry films with no thickness; the
same tension on every film; no gravity, temperature or wax; overdamped
vertices; a torus instead of a wall; coarsening is only von Neumann's (n − 6);
ε is a numerical cutoff, not a measured length.
