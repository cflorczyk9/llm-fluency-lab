# LLM Fluency Lab

A local-first web app for learning how large language models actually work, from
the ground up. You watch a short lesson, check that you understood it, then lock
it in with spaced repetition. Everything stays in your browser. There is no
account, no server, and no tracking.

The curriculum is written for a smart, curious person who is not necessarily
technical. Every card has a precise answer and a plain-English version with a
concrete analogy, so a motivated non-engineer can follow all of it. Jargon is
defined the first time it shows up, and the math lives only in the handful of
advanced cards (explained in words).

## The curriculum: 4 tiers, 24 modules, 500 cards

The deck is organized as a ladder. Each tier builds on the one before it, and
each module is a focused area with its own short lesson, a written breakdown, a
glossary, and a set of question cards.

**Tier 1: Foundations (how the machine works)**: 7 modules, 152 cards.
Build the core mental model: what a language model is, how text becomes tokens
and vectors, the transformer and attention that process them, and the
pretraining and post-training that give a model its knowledge and its manners.
Modules: What LLMs Are (A Short History), Tokenization and Embeddings,
Transformer Architecture, Attention Mechanism, Pretraining and Scaling,
Post-training and Alignment, Inference and Decoding.

**Tier 2: Working with models**: 6 modules, 126 cards.
Turn the mental model into skill: write prompts that work, manage the context
window, get structured output and tool calls, ground answers in your own data
with retrieval, adapt a model by fine-tuning, and measure whether any of it is
good. Modules: Prompting, Context Windows and Context Engineering, Structured
Output and Tool Calling, Retrieval-Augmented Generation (RAG), Fine-tuning and
Adaptation, Evaluation and Evals.

**Tier 3: Systems and agents**: 6 modules, 122 cards.
Move from one prompt to real systems: agents that take actions, multiple agents
working together, models that see and hear, and the serving, cost, and
reliability concerns that decide whether a deployment survives real users.
Modules: Agents (tools and MCP), Multi-agent Systems, Multimodal Models, Serving
(latency and throughput), Cost and Token Economics, Reliability (guardrails and
observability).

**Tier 4: Judgment and frontier**: 5 modules, 100 cards.
Develop the judgment to use these systems responsibly: where they fail, how they
reason, how to choose a model, how to handle data and privacy, and where the
technology is heading. Modules: Safety and Failure Modes, Reasoning and
Test-time Compute, The Model Landscape, Data and Privacy, Where It Is Heading
(Frontier).

Each module carries its tier, a few learning objectives ("by the end you will be
able to..."), and three to six breakdown sections with a glossary. Ten of the
modules also include a short, hand-picked explainer video from a reputable
channel. The newer modules have no video and lean on the written breakdown.

### Difficulty mix

Every module is roughly 45% core, 40% intermediate, and 15% advanced. Core cards
are the load-bearing ideas everyone should hold. Intermediate cards add nuance
and trade-offs. Advanced cards go one level deeper for the curious, and even
those explain the idea in words rather than equations.

## How it works (the five views)

- **Home** sets your "fluent by" target date and builds a study program around it.
- **Learn** is the library. Work an area top to bottom: watch the lesson, read
  the breakdown, answer the "check yourself" prompts, then peek at the cards.
  Modules are grouped under the four tiers so the path is easy to follow. The
  view runs full width, so an open module uses the whole screen instead of a
  narrow strip.
- **Study** runs your daily review session of due cards.
- **Dashboard** shows your fluency over time, a radar of mastery across the four
  tiers, a per-module breakdown, your weakest areas, and a calibration readout.
- **Diagnostic** is a short adaptive quiz that seeds what you already know so you
  do not waste reviews on cards you have already mastered.

Your progress is saved locally in the browser. Use Export to back it up to a
file and Import to restore it.

### The redesigned breakdown ("See how it works")

Inside an open module, the breakdown is diagram-led and reads visually first.
It starts with the module's interactive diagram as a full-width hero, then lays
out a responsive grid of concept tiles, one per breakdown section. Each tile
carries its own small schematic SVG, a one or two sentence caption in plain
language, the key terms as compact chips, a link to a curated YouTube explainer
for that exact concept, and a "Read more" toggle that reveals the full prose and
glossary on demand. The default view stays short and visual, so there are no
walls of text until you ask for them. The roughly one hundred inline SVGs share
one canvas size, palette, stroke weight, and label scale, so the whole set reads
as a single family. Each SVG carries a title for screen readers, every Watch
link opens in a new tab and names where it goes, and any motion is turned off
when the reader prefers reduced motion.

### Diagrams

Every module in the Learn library opens with a "See it" panel, a small
interactive diagram made for that one topic. The files live in
`public/diagrams`, one self-contained HTML file per module, named after the
module key. They all link a single shared stylesheet and helper
(`diagram.css` and `diagram.js`), so the whole set looks like one family with
the same warm palette, type scale, captions, and control styling as the rest of
the app. Each diagram teaches one true idea at a glance and adds a light
interaction such as a toggle, a slider, a step-through, or a click to reveal.

Five of the diagrams were ported from the original visual guide, the deeper
hand-built visuals: the token splitter and the embedding map (both in
Tokenization and Embeddings), self-attention (Attention Mechanism), next-token
sampling (Inference and Decoding), and backpropagation (Pretraining and
Scaling). The diagrams make no network calls, honor reduced-motion settings, and
fall back to a static labeled picture if scripting is turned off.

## The learning science

This app is built on a few well-supported ideas from how memory actually works.

- **Spaced repetition.** Reviews are scheduled by FSRS (Free Spaced Repetition
  Scheduler), a modern, evidence-based algorithm. After you grade a card, FSRS
  predicts when you are about to forget it and schedules the next review for just
  before that moment. Catching a memory right as it starts to fade is what makes
  it durable, and it is far more efficient than re-reading.
- **Retrieval practice.** You answer from memory before revealing the answer.
  The effort of recall is what strengthens the memory, much more than passive
  review. This is the "testing effect."
- **Elaboration and self-explanation.** Before the cards, each lesson asks you to
  explain ideas in your own words ("why does this matter?"). Connecting a new
  idea to what you already know makes it stick and surfaces gaps in your
  understanding.
- **Dual coding.** Every card pairs a precise answer with a plain-English version
  and a concrete analogy. Two routes to the same idea, an abstract one and a
  vivid one, are easier to recall than either alone.
- **Interleaving and prerequisite order.** The program walks a prerequisite-aware
  path so foundations come before the things that depend on them, while mixing
  review across areas rather than cramming one topic. Interleaving is harder in
  the moment but produces better long-term retention.
- **Calibration.** The diagnostic compares how confident you felt against how you
  actually did, then tells you whether you tend to over- or under-estimate your
  knowledge. Knowing the gap between feeling fluent and being fluent is itself a
  skill.

Fluency is scored 0 to 100 per card, per module, and overall. The score blends
long-term memory strength (how durable the memory is) with current recall (how
likely you are to remember it right now), so it reflects real mastery rather than
just how many cards you have seen.

## Running it

```bash
npm install
npm run dev        # local dev server
npm run build      # type-check and production build
npm run test       # unit tests (vitest)
npm run typecheck  # tsc --noEmit
```

Built with React, TypeScript, Vite, Zustand for state, ts-fsrs for scheduling,
and Recharts for the dashboard. No backend.
