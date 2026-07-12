# The Workshop

The pipeline that produces an episode. Six stages. It exists so that a future
session — human or model — can run the whole thing again without rediscovering
how.

## The three parties

Every episode is made by three, and the stages below say which is which:

| | Who | Owns |
|---|---|---|
| **Human** | Justin Simpson | Stage 1 (commission), every judgment call, and the final look. The eye that catches what the tests do not. |
| **Model** | Claude Code (Anthropic) | Stages 2 (consolidation), 3 (build), 5 (publish). The judgment-dense half. |
| **Fleet** | Hermes agents ([Nous Research](https://hermes-agent.nousresearch.com)) | Stage 2 (research verification), Stage 4 (browser QA), Stage 6 (promotion, on request). |

The organising principle is a division of labour:

> **Judgment stays with a strong-model session. Verification, testing and
> publishing go to the agent fleet. The fleet never originates content.**

And one more, learned the hard way on Episode 1:

> **A human still has to look at the thing.** The first published build passed
> nineteen checks and was still wrong in three ways, all of them found by a reader
> simply looking at the picture — including a mirrored tack convention that drew
> every force vector backwards and had the boat making leeway *to windward*. A
> harness that only asserts things about the *model* will happily bless a *picture*
> that is a mirror image of the truth. Budget for the human pass; it is not a
> formality.

That division is the anti-slop gate. An agent swarm asked to *invent* an
explorable produces plausible mush; an agent swarm asked to *check* one is a
research department. Keep them on the second job.

---

## Stage 1 — Commission

**Who:** a strong-model session, with the human. Never delegated.

Produce the episode's design spec: the experience, the physics model, the
accuracy anchors, the layout, the declared simplifications, and the explicit
non-goals. Argue about taste here, because it is very expensive to argue about
it later.

The spec is the contract. Everything downstream reads it and nothing downstream
gets to renegotiate it.

**Output:** a design spec, in the shape of the Episode 1 spec.

## Stage 2 — Research verification

**Who:** the agent fleet, commissioned by the orchestrator profile.

Split the spec's factual claims into **claim clusters** — one per body of
literature, so the workers don't collide. For Episode 1 they were:

- **A** — modern sloop calibration (published one-design polar diagrams)
- **B** — square-rigger weatherliness (age-of-sail literature)
- **C** — sail aerodynamics and hull hydrodynamics (coefficient curves)

Cut one worker card per cluster, each assigned to a different profile so they run
in parallel. Each card asks for a **sourced fact sheet**: every number carries a
citation, and any number that cannot be sourced must come back marked
`UNVERIFIED` rather than invented. That instruction is doing most of the work —
say it explicitly, in those words.

Two conventions that are easy to get wrong:

- Worker workspaces are **ephemeral**. The completion *summary* is the
  deliverable. Tell the worker to put the entire fact sheet in it.
- Card bodies carry the brief. Be specific about units and about what a good
  answer looks like, or you will get an essay.

The returning fact sheets are then **consolidated by the strong-model session**,
which resolves conflicts between sources and turns literature values into the
model's actual parameters. That consolidation is judgment, not clerical work —
it does not get delegated either.

**Output:** `FACTSHEET.md` in the episode directory. The builder treats it as
ground truth.

## Stage 3 — Build

**Who:** the strong-model session. The judgment-dense half.

One self-contained HTML file. Vanilla JS, canvas, inline CSS, zero dependencies,
zero build step.

**Write the selftest harness first.** Encode the accuracy anchors from the fact
sheet as runnable assertions behind `?selftest=1`, watch them fail, then build
the physics until they pass. The anchors are the specification of "correct", so
they should be the thing you are steering toward, not a thing you check
afterwards and rationalise.

**Output:** `index.html`, selftest green.

## Stage 4 — QA

**Who:** a browser-driving agent (Playwright).

The matrix:

1. **Selftest first.** `?selftest=1` must be clean before anything else is worth
   checking.
2. **Console.** Zero errors, at every viewport, during every interaction.
3. **Viewports.** 390px (phone), 768px (tablet), 1440px (desktop). Screenshot
   each. Nothing clipped, nothing overlapping, all drag targets ≥44px on touch.
4. **Every control.** Drag the wind. Steer through the no-go zone and confirm the
   in-irons state. Toggle the rig and confirm the no-go zone visibly widens.
   Trace the polar. Turn off auto-trim and stall the sail deliberately.
5. **Degeneracies.** Zero wind. Parameters changed mid-sweep. Heading spun
   rapidly. Nothing may NaN, and nothing may freeze.

File concrete defects back as cards. Loop Stage 3 ↔ Stage 4 until a clean pass.

If the sandbox fights Playwright, run QA from the build session directly — the
reusable asset here is the *checklist*, not the runner.

**Output:** a recorded clean pass — screenshots or a checklist, committed.

## Stage 5 — Publish

**Who:** the build session.

Push to `just-code-in/explorables`. Pages deploys from `main`. Add the episode's
card to the gallery index. Announce once in Slack `#olympus`.

## Stage 6 — Promote

**Who:** the fleet — **on human request only. Never automatic.**

The x-expert profile drafts the social post; the media profile renders a short
Manim teaser of the sim. A human decides whether either goes out.

---

## The checklist

- [ ] Spec written and approved by a human (Stage 1)
- [ ] Claim clusters cut as fleet cards; every number sourced or `UNVERIFIED` (Stage 2)
- [ ] `FACTSHEET.md` consolidated by the strong-model session (Stage 2)
- [ ] Selftest assertions written **before** the physics (Stage 3)
- [ ] Single file, zero dependencies, zero build step (Stage 3)
- [ ] Simplifications declared *in the page itself* (Stage 3)
- [ ] Selftest green, console clean, three viewports, every control, degeneracies (Stage 4)
- [ ] Gallery index updated; announced once in `#olympus` (Stage 5)
- [ ] Promotion left alone unless a human asks (Stage 6)
