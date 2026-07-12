# Against the Wind — fact sheet

Every number in the simulation, and where it came from.

Compiled 2026-07-11 in **Stage 2** of the [Workshop](../WORKSHOP.md): five research
cards, run in parallel by five agent profiles of a
[**Hermes**](https://github.com/NousResearch/hermes-agent) fleet (Nous Research),
each working a separate body of literature under one standing instruction —

> **If you cannot source a number, write `UNVERIFIED`. An honest gap is far more
> useful than a plausible invention.**

They took that instruction seriously, and it is the reason this document is
worth reading. Two of the five clusters came back almost entirely empty, and one
of them was the cluster we most expected to succeed. What follows separates what
is **measured**, what is **fitted**, and what is **missing** — because a
simulation that blurs those three is just a very confident opinion.

---

## 1. Sourced — measured, cited, load-bearing

### The square rig's bracing limit — the pivot of the whole model

> *"In most ships the sails make with the keel an angle … of **40 degrees, or
> thereabouts** … when close-hauled."*
> — **David Steel, _Seamanship, Both in Theory and Practice_ (London, 1795), p. 53, §25–26.**
> [scan](https://archive.org/details/bim_eighteenth-century_seamanship-both-in-theo_steel-david_1795)

A square sail's chord lies **along its yard**, so this *is* the minimum sheeting
angle the sail can achieve: **δ_min = 40°** (equivalently, the yard braced to 50°
from square).

Steel also gives the sharp extreme — **30° to the keel (60° from square)** — but
says it was attainable only by suppressing the two foremost lower shrouds of each
mast, and his own footnote records that the officers of the King's Yards judged
this *"could not be advantageously altered or safely diminished"*, and that casting
the shrouds off was *"highly dangerous"* if the ship were suddenly taken aback. So
40° is the defensible figure for a c.1800 warship, and 30° is not.

Corroborated, though not independently, by **Blunt, _Theory and Practice of
Seamanship_, 2nd ed. (New York, 1824), pp. 46–47** — which transmits Steel's text
substantially verbatim.

**The limiting obstruction is the forward lower shrouds**, by Steel's own account
(the proposal to reach 30° is a proposal to *remove them*). Later naval
corroboration: **Nares, _Seamanship_, 5th ed. (1877), p. 204** — *"The topsail
yards cannot be braced sharp up on account of the lee rigging."*

`UNVERIFIED`: a period source giving a separate numerical *hard stop* for a lower
yard, as distinct from the sail-to-keel angle above. We use the sail-to-keel
angle, which is what the physics needs anyway.

### The square rig's sail curve — real wind-tunnel data

Wind-tunnel tests on models of the sail training ship **Nippon Maru**:

- **Six-sail square foremast array**, aggregate aspect ratio **2.22**: maximum lift
  coefficient **CL ≈ 1.0 at α = 30°**; maximum drag coefficient **CD ≈ 0.8–0.85**;
  flow stays attached to about 20°, separation begins near 30°.
  — **Amemiya, Shiota, Fukui, Tatano & Yoshimura (1992)**, *On the Aerodynamic
  Characteristics of the Sail Training Ship NIPPON MARU*, J. Japan Inst. Navigation
  **87**, 189–195. [DOI](https://doi.org/10.9749/jin.87.189) ·
  [PDF](https://www.jstage.jst.go.jp/article/jin/87/0/87_KJ00004721517/_pdf)
- **Isolated square sail**, AR 0.289: **CL_max ≈ 1.31 at α = 40–48°**, and
  notably *"even for … larger angles, there are no stall"* — the low aspect ratio
  sheds strong tip vortices whose downwash suppresses separation.
  — **Tatano, Ohsugi, Amemiya & Yoshimura (1991)**, *On the Aerodynamic
  Characteristics and Flow Fields of Square Sails*, J. Japan Inst. Navigation
  **84**, 11–17. [DOI](https://doi.org/10.9749/jin.84.11) ·
  [PDF](https://www.jstage.jst.go.jp/article/jin/84/0/84_KJ00004841427/_pdf)

The model uses the **six-sail array** figures — `CLmax 1.00`, `alphaStall 30°`,
`sailAR 2.22` — because an aggregate rig is what we are simulating.

A useful bonus from the same programme: the ship's **jigger** — a *fore-and-aft*
sail, AR 4.1 — stalls at **15°** with **CL_max ≈ 1.1**. So a fore-and-aft sail is
not dramatically better at *making lift* than a square sail. It is better at
*pointing*. That is the whole argument of this episode, and it arrived from the
wind tunnel rather than from us.

### What a square-rigger could actually do

- **Close-hauled limit: six points.** *"A square rigged ship … can lie no nearer to
  the wind than six points."* — **Darcy Lever, _The Young Sea Officer's Sheet
  Anchor_, p. 75.** [scan](https://archive.org/details/youngseaofficers00leve)
  Six points × 11.25° = **67.5°**. Corroborated by **Blunt (1824), p. 14** ("by the
  wind … generally within six points"), and **Smyth, _The Sailor's Word-Book_
  (1867)**, which notes fore-and-aft rigged cutters and luggers sail nearer.
- **Leeway falls as speed rises.** For a fine-sailing vessel trimmed sharp,
  increasing speed to **6–9 kn** reduces leeway to **5–6°**. — **Blunt (1824),
  pp. 63–64.** Blunt is explicit that this is speed-dependent, not a constant.
- **Made good.** 67.5° heading + 5–6° leeway ⇒ roughly **72.5–73.5° made good** to
  windward. (Blunt's own arithmetic.)
- **In irons.** A ship that comes up into the wind and loses way *"must box off on
  the former tack or fall off on the other, and cannot cast without bracing in the
  yards."* — **Smyth**, entry *IRONS*. A failed tack ("missing stays") was a real
  and common hazard — **Lever, pp. 77, 93**.
- **The cost of the alternative.** In Lever's worked example, tacking turns the ship
  through **12 points (135°)**; wearing ship — turning away downwind instead —
  costs **20 points (225°)** and a great deal of ground. — **Lever, pp. 79–80.**

### The boat

**J/24** one-design keelboat. [Class data](https://en.wikipedia.org/wiki/J/24)

| | |
|---|---|
| LOA | 7.32 m (24.0 ft) |
| **LWL** | **6.10 m (20.0 ft)** |
| Hull weight | 1,406 kg (3,100 lb) |
| Mainsail | 12.68 m² |
| Jib | 11.58 m² |
| **Upwind sail area** | **24.26 m²** (sum of the two above) |
| Draft | 1.22 m |

`UNVERIFIED`: fully-rigged sailing **displacement** (the 1,406 kg figure is
explicitly *hull weight*), and **keel lateral area** (no published figure found —
do not infer it from draft).

### Fluids and governing relations

- **Air density 1.225 kg/m³** — dry air, 15 °C, 101,325 Pa. ISO 2533:1975 standard
  atmosphere.
- **Seawater density 1026 kg/m³** — EOS-80 gives **1025.972 kg/m³** at practical
  salinity 35, 15 °C, 0 dbar (verified by executing the UNESCO/EOS-80 equation of
  state); TEOS-10 gives 1025.974. Reference:
  [TEOS-10 Manual](https://www.teos-10.org/pubs/TEOS-10_Manual.pdf) (IOC/SCOR/IAPSO, 2010).
- **Skin friction: the ITTC 1957 line**, `Cf = 0.075 / (log₁₀Re − 2)²`, with
  `Re = V·L/ν`. — ITTC Recommended Procedure 7.5-02-07-01.4.
  [PDF](https://www.ittc.info/media/7953/75-02-07-014.pdf)
  Note this means total resistance is **not** exactly ∝ v²; it is only
  approximately so, if Cf is treated as locally constant.
- **Induced drag: `CDi = CL² / (π·AR·e)`** — standard finite-wing lifting-line result.
- **Wave-making keyed to Froude number**, `Fn = V/√(g·L_WL)`. The customary "hull
  speed" `1.34·√(L_WL in ft)` knots corresponds to **Fn ≈ 0.40**. It is a heuristic
  reference, *not* a physical barrier — and the model treats it as one, letting the
  boat push past it at a steeply rising cost rather than hitting a wall.

---

## 2. Fitted — the model's free parameters

These are **not** sourced. They are chosen so the simulation reproduces the sourced
anchors above, which is what a velocity-prediction program does — and the anchors
are then encoded as [runnable assertions](index.html?selftest=1) so the fitting
cannot quietly drift away from them.

| Parameter | Value | Why |
|---|---|---|
| **Square-rig windage** | **250 m² @ CD 0.90** | **The one load-bearing fit.** No accessible source apportions the drag of a square-rigger's masts, yards and standing rigging (see gap 3 below). It is tuned so the six-point wall comes out. This makes it a **prediction**: for the ship to be as unweatherly as Lever says she is, her rigging must drag like ~250 m² of flat plate. |
| Sloop sail curve | CLmax 1.50, stall 20°, AR 3.0, CD0 0.05 | No public soft-sail polar was reachable (gap 1). See the robustness note below. |
| Square CD0 | 0.08 | Baggy sails, poor shape. The measured source gives CL and a CD *maximum*, not a zero-lift CD. |
| Post-stall model | flat-plate `CN = CN_max·sin α` | Standard. `CN_max` 1.9 (sloop) / 1.6 (square — a square sail past stall behaves like a bag, not a plate). |
| Keel/hull | sloop 2.2 m² @ AR 0.68; frigate 190 m² @ AR 0.16 | Geometric estimates. The frigate's hull is a dreadful foil — very low aspect ratio — which is *why* she makes so much leeway. |
| Wetted area, form factor, Cr0 | sloop 19 m², 1.15, 0.0030; frigate 600 m², 1.20, 0.0030 | Estimates typical of the type. |
| Frigate hull | LWL 40 m, 1,000 t, 1,800 m² plain sail | A *generic* c.1800 fifth-rate. Not any specific ship, and the page says so. |

### The robustness check that makes the fitting safe

The sloop's sail curve is the largest un-sourced quantity in the model, so the
result must not depend on it. Assertion **A15** in the self-test therefore strips
the sloop of it: the sloop is handed **the square rig's own measured, inferior
wind-tunnel curve** (CL_max 1.0, stall 30°) and must *still* point far higher.

She does — **52° against the square rig's 69°**. The modern rig's advantage is
**not** the fitted lift curve. It is that she can sheet to 7° off the centreline
while the frigate cannot get inside 40°.

---

## 3. `UNVERIFIED` — what the fleet could not source, and what we did about it

These gaps are real, and the page states them rather than papering over them.

1. **No published polar diagram for any one-design keelboat.**
   The ORC certificate database — which computes and publishes a VPP polar table
   for every certificated boat, and would have settled this instantly — turns out
   to require a **login**; its public endpoint (`data.orc.org/public/WPub.dll`)
   returns an aggregate XML stub, not certificates. ORR, class-association tables,
   and the qtVlm/OpenCPN polar repositories were also searched. Nothing citable.
   *Two separate research cards refused to fabricate the table rather than fill it
   in, which is the correct behaviour and cost us a calibration target.*
   **Consequence:** the sloop's speeds are a model *prediction*, not a fit. They
   land plausibly (beat 49°, max 5.94 kt vs a 6.01 kt hull speed) — treat that as a
   check passed, not a target hit. **The model's beat angle is a few degrees wider
   than a real J/24's (~42–45°), most likely because the model has no heel.**

2. **No CL/CD curve for a modern Bermudan main + jib.**
   Marchaj, Larsson & Eliasson and Fossati are the right references; all are
   copyright and none was reachable. The accessible peer-reviewed sail-aerodynamics
   literature (Viola et al. 2012, 2013) is CFD-validation work whose PDFs sat behind
   Cloudflare/HAL anti-bot gates. **Consequence:** fitted (see §2), and
   stress-tested by A15.

3. **No windage apportionment for a square rig.**
   The one modern source found (Day 2017, dinghy VPP) gives a bare mast CD of 0.8
   but no standing-rigging figure and nothing transferable to a square-rigger.
   **Consequence:** it is the model's one free parameter (see §2).

4. **No type-specific spread of close-hauled angles** (sharp frigate vs bluff
   merchantman vs ship-of-the-line). The sources give "six points" for a
   square-rigged ship generally. We do not invent a spread; we model one
   representative ship and say so.

5. **A page-citable Harland.** *Seamanship in the Age of Sail* (1984) is the
   standard modern reference and would likely settle several of the above. Every
   route to its text — Internet Archive, Google Books, HathiTrust — was
   unavailable or rate-limited. Its bibliographic identity is confirmed
   (ISBN 0-85177-179-3); **no claim in this document is attributed to it.**

---

## 4. The anchors, as tests

Run them yourself: **[index.html?selftest=1](index.html?selftest=1)** — 19
assertions, in the page, executing the same physics the animation uses.

The ones that matter:

| # | Assertion | Result |
|---|---|---|
| **A5** | Square rig lies no nearer the wind than ~6 points | **69°** (six points = 67.5°) |
| **A6** | …and makes good 70–78° after leeway | **73.3°** (Blunt: 72.5–73.5°) |
| A7 | Square-rig leeway *falls* as she gains speed (Blunt) | 3.4° @ 2.2 kt → 3.1° @ 9.1 kt |
| A1 | Sloop beats at 35–50° | 49° |
| A3 | Sloop does not exceed 1.15 × hull speed | 5.94 kt vs 6.01 kt |
| A2 | Sloop is fastest on a reach, not a run | max at 91° |
| A13 | Square rig is fastest with the wind *free* | max at 118° |
| A8 | Head to wind, both rigs stop — in irons | 0.000 kt |
| A12 | No NaN anywhere in the parameter space | 3,705 states swept, 0 bad |
| **A15** | Sloop's advantage survives losing its fitted sail curve | 52° vs 69° |
| A16 | Running downwind, the boom goes all the way out | δ = 90°, both rigs |
| A17 | Driving force is forward, and balances resistance at steady speed | within 0.0% |
| **A18** | The *picture* does not lie, in world coordinates, on both tacks | 24 wind/heading combinations |

**A5 and A6 are the result.** Nothing in the code is told about six points. The
model is given Steel's 40° bracing limit — written down in 1795 by a man with no
notion of a lift coefficient — and the six-point wall, and Blunt's made-good
angle, both fall out of the force balance on their own.

**A16 to A18 exist because a reader caught things by eye that no test was
watching for**, and each one turned out to be a real defect:

- **A16.** Angle of attack was clamped at 90°, which made every sheeting angle
  compute *identically* when running dead downwind. Auto-trim had nothing to
  choose between and picked one at random, so the boat ran downwind with her sail
  hauled in tight. Unclamping it lets her discover that running means the boom
  goes all the way out.
- **A17.** The overlay drew a single "net thrust" arrow — the sail's forward force
  *minus* hull resistance. At any steady speed those are equal, so the arrow
  collapsed to nothing and flickered to whichever side the arithmetic noise fell
  on; running downwind at four and a half knots it would sometimes point *astern*.
  Now the forces are drawn, not the residual. Writing the assertion also exposed
  that the steady-state solver was **integrating forward in time for only 250
  simulated seconds** — nowhere near enough for a thousand-tonne frigate, whose
  entire polar was consequently understated. It now solves the force balance
  exactly, by bisection, and does not care what the ship weighs.
- **A18.** The tack-side convention was **inverted**: a boat heading 075° with the
  wind out of the north was treated as having it on her starboard bow when it was
  plainly on her port. Every force vector on the chart was drawn as a mirror
  image, and the boat made leeway *to windward*. The physics was right and the
  picture was wrong, which no assertion about forces alone could ever have caught
  — so A18 asserts the picture, in world coordinates, on both tacks. Chasing it
  also revealed that leeway was hard-coded to *always* be to leeward; it is now
  signed, and follows the sail's side force wherever it actually points.

---

## 5. Declared simplifications

Stated on the page itself, because honesty about a model includes honesty about
its edges: **no heel** (a real boat lays over, spilling wind — this is the most
significant omission, and the likeliest reason the sloop's beat angle runs a few
degrees wide); no waves, current or tide; flat water; quasi-static forces (no
sail momentum, no dynamic stall); one aggregate sail per rig rather than a real
multi-sail trim problem; no rudder drag.

This is a model built to get the *reasons* right. It is not a VPP you should race
with.
