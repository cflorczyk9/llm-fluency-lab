# LLM Fluency Lab

A local-first web app for learning how large language models actually work, from
the ground up. You watch a short lesson, check that you understood it, then lock
it in with spaced repetition. By default everything stays in your browser with no
account and no tracking. If you want your progress to follow you across devices,
you can optionally sign in with an email link and it syncs to the cloud (see
[Cloud sync](#cloud-sync-optional)).

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
able to..."), and three to six breakdown sections with a glossary. Every module
now pairs its written breakdown with short, hand-picked explainer videos from
reputable channels, curated per section.

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
and Recharts for the dashboard. The app runs with no backend; cloud sync is an
optional add-on (below).

## Cloud sync (optional)

By default the app is fully local: your progress lives in the browser under
`localStorage` and never leaves the device. Cloud sync is opt-in and adds the
ability to sign in with an email link so your progress follows you across
devices. It is backed by [Supabase](https://supabase.com) (auth + a single
`progress` table). When the env vars below are absent, none of this code runs and
there is no account UI at all.

How sign-in reconciles data, so you never lose progress: when you sign in, the
app pulls your cloud snapshot, merges it with whatever is already on the device
(per card it keeps the more recently reviewed state, never a blind overwrite),
saves the merged result, and pushes it back so the device and cloud agree. After
that, changes push up automatically, debounced. Signing out leaves your local
data untouched.

To turn it on:

1. Create a free Supabase project.
2. In the project's SQL editor, run `supabase/migrations/0001_progress.sql`. It
   creates the `progress` table with Row Level Security so each user can only
   ever read or write their own row.
3. Under Authentication, make sure email sign-in is enabled, and add your site
   URL (e.g. `http://localhost:5173` for dev and your production URL) to the
   allowed redirect URLs.
4. Copy `.env.example` to `.env` and fill in `VITE_SUPABASE_URL` and
   `VITE_SUPABASE_ANON_KEY` from Project Settings → API. Both are public,
   browser-safe values; RLS is what protects the data.

### Usage analytics

When cloud sync is on, the app also records lightweight usage events **for
signed-in users only** — there is no anonymous tracking. Each event is one row
in an `events` table (migration `0002_events.sql`), tied to the user and guarded
by the same Row Level Security: a user can insert and read only their own
events. The tracked events are: tab/view opened, module opened, card graded
(with the rating), video opened, and diagnostic completed.

You (the project owner) aggregate across all users from the Supabase SQL editor
with the service role, which bypasses RLS. The migration file includes ready-to-
run example queries (most-opened modules, hardest cards, most-visited tabs).

## Deploying

The app is a static Vite build (`npm run build` → `dist/`), so any static host
works. A `netlify.toml` is included: point Netlify at the repo, and it builds
with `npm run build`, publishes `dist`, and serves `index.html` for any path (so
deep links and the email sign-in redirect resolve). For cloud sync in
production, set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in the host's
environment variables.
