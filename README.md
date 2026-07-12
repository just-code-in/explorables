# Explorables

Interactive explanations built on real physics.

**Live:** <https://just-code-in.github.io/explorables>

Each episode is a single, self-contained HTML file — vanilla JavaScript and a
canvas, no dependencies, no build step. It loads instantly on a phone, works
offline, and will still run in ten years.

The rule that makes them worth reading: **the simulation is honest.** Every
constant traces to a published source, and the interesting results *emerge* from
the physics rather than being drawn because they ought to look that way. Where
the model is simplified, the page says so.

## Episodes

| # | Episode | What it shows |
|---|---------|---------------|
| 1 | [Against the Wind](against-the-wind/) | Why a sailboat can sail *toward* the wind — and why a Napoleonic square-rigger mostly couldn't. |

## How they're made

Episodes are produced by a repeatable six-stage process — research is verified
by a fleet of agents *before* any code is written, and the built page is driven
through browser QA before it ships. See [WORKSHOP.md](WORKSHOP.md).

## Who makes them

A three-way collaboration, and all three parties do load-bearing work:

- **Justin Simpson** — direction, judgment, and the human eye. On Episode 1 he
  caught three real defects by simply looking at the picture, none of which any
  passing test had noticed. The most serious had every force vector on the chart
  drawn as a mirror image.
- **Claude Code** (Anthropic) — design and build; the judgment-dense half.
- **A fleet of Hermes agents** ([Nous Research](https://hermes-agent.nousresearch.com))
  — Stage 2 research verification and Stage 4 browser QA. The fleet checks, tests
  and publishes. It never originates content: that division is the anti-slop gate.

[WORKSHOP.md](WORKSHOP.md) says which stage belongs to whom.

## Running locally

No build step. Open the file, or serve the directory:

```sh
python3 -m http.server 8000
# → http://localhost:8000/against-the-wind/
```

Append `?selftest=1` to any episode URL to run its physics assertions and print
the results to the browser console.
