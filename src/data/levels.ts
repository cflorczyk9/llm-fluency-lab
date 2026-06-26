// Learning levels: three guided paths (beginner / intermediate / expert) layered
// over the existing spaced-repetition deck. Each level scopes a subset of the 24
// modules, sets a realistic week timeframe and a day-by-day schedule, and groups
// its modules into sections that each end in a multiple-choice section test drawn
// from the existing cards.
//
// This file holds the STATIC curriculum (generated from the design pass). Per-user
// progress (enrollment, test attempts) lives in the store and src/types.ts.

import type { Difficulty, LevelKey } from '../types';

export type { LevelKey };

export interface SectionTestSpec {
  questionCount: number;
  passThresholdPct: number;
  drawsFromModuleKeys: string[];
  includeDifficulties: Difficulty[];
}

export interface LevelSection {
  id: string;
  title: string;
  moduleKeys: string[];
  test: SectionTestSpec;
  remediation: string;
}

export interface ScheduleDay {
  day: number;
  label: string;
  activity: string;
  learnModuleKeys: string[];
  newCards: number;
  reviewTarget: string;
  sectionTestId?: string;
}

export interface ScheduleWeek {
  week: number;
  theme: string;
  days: ScheduleDay[];
}

export interface LevelPlan {
  level: LevelKey;
  title: string;
  blurb: string;
  targetAudience: string;
  assumedMinutesPerDay: number;
  daysPerWeek: number;
  totalWeeks: number;
  moduleKeys: string[];
  sections: LevelSection[];
  schedule: ScheduleWeek[];
  rationale: string;
}

export const LEVEL_ORDER: LevelKey[] = ['beginner', 'intermediate', 'expert'];

export const LEVELS: Record<LevelKey, LevelPlan> = {
  "beginner": {
    "level": "beginner",
    "title": "LLM Foundations: Your First Real Mental Model",
    "blurb": "A gentle, no-math introduction to how large language models actually work under the hood, plus the two skills you will use every single day: writing good prompts and managing the context window. Five weeks at about 15 to 20 minutes a day, built so you finish with a real working mental model instead of buzzwords.",
    "targetAudience": "A smart, curious, non-technical person who wants a solid working mental model of how LLMs actually work and the practical basics. No math or engineering background assumed.",
    "assumedMinutesPerDay": 18,
    "daysPerWeek": 5,
    "totalWeeks": 5,
    "moduleKeys": [
      "intro",
      "tokenization",
      "architecture",
      "attention",
      "pretraining",
      "posttraining",
      "inference",
      "prompting",
      "contexteng"
    ],
    "sections": [
      {
        "id": "sec-foundations-basics",
        "title": "What LLMs Are & How They Read Text",
        "moduleKeys": [
          "intro",
          "tokenization"
        ],
        "test": {
          "questionCount": 10,
          "passThresholdPct": 80,
          "drawsFromModuleKeys": [
            "intro",
            "tokenization"
          ],
          "includeDifficulties": [
            "core"
          ]
        },
        "remediation": "If you score below 80%, the gap is almost always one of two ideas. Either what an LLM really is (a next-word predictor, not a database and not a person), or how your text turns into tokens. Re-watch the 'What LLMs Are' and 'Tokenization & Embeddings' videos, skim those two modules again, and redo their cards before you retry. Pay extra attention to why you are billed per token and why models stumble on spelling and counting letters."
      },
      {
        "id": "sec-inside-the-model",
        "title": "Inside the Model",
        "moduleKeys": [
          "architecture",
          "attention"
        ],
        "test": {
          "questionCount": 10,
          "passThresholdPct": 75,
          "drawsFromModuleKeys": [
            "architecture",
            "attention"
          ],
          "includeDifficulties": [
            "core"
          ]
        },
        "remediation": "A dip here usually just means the 'transformer block' and 'attention' ideas have not clicked yet, which is completely normal because these are the most abstract topics in the whole path. Re-watch both videos, re-read the two modules, and restudy the architecture and attention cards. You only need the plain-English picture: a model is the same building block stacked many times over, and attention is how it decides which earlier words matter most for choosing the next one. Do not worry about any math."
      },
      {
        "id": "sec-training-and-answers",
        "title": "How Models Learn & Answer",
        "moduleKeys": [
          "pretraining",
          "posttraining",
          "inference"
        ],
        "test": {
          "questionCount": 12,
          "passThresholdPct": 75,
          "drawsFromModuleKeys": [
            "pretraining",
            "posttraining",
            "inference"
          ],
          "includeDifficulties": [
            "core"
          ]
        },
        "remediation": "This is the biggest section, so a miss is often spread across three topics rather than one. Look at which module your wrong answers came from. If it is pretraining or post-training, restudy how a model first reads enormous amounts of text, and then how human feedback shapes that raw model into a polite, helpful assistant. If it is inference, restudy how the model writes one word at a time and what the 'temperature' setting does to make answers more predictable or more creative. Re-watch just the relevant video and redo that one module's cards, then retry."
      },
      {
        "id": "sec-working-with-models",
        "title": "Working With Models",
        "moduleKeys": [
          "prompting",
          "contexteng"
        ],
        "test": {
          "questionCount": 10,
          "passThresholdPct": 80,
          "drawsFromModuleKeys": [
            "prompting",
            "contexteng"
          ],
          "includeDifficulties": [
            "core",
            "intermediate"
          ]
        },
        "remediation": "These are practical skills, so the fix is to re-practice rather than re-memorize. If prompting tripped you up, re-read the prompting module and then rewrite a few of your own real prompts using its tips, watching how the answers improve. If the context-window questions did, restudy what the context window is (think of it as the model's short-term memory for one conversation) and why cramming too much into it can actually hurt the answer. Redo both modules' cards, then retry the test."
      }
    ],
    "schedule": [
      {
        "week": 1,
        "theme": "Getting oriented: what LLMs are and how they read your words",
        "days": [
          {
            "day": 1,
            "label": "Mon",
            "activity": "Watch the short 'What LLMs Are' video, read the module, then study your first handful of cards. This is the lightest day because nothing is due for review yet.",
            "learnModuleKeys": [
              "intro"
            ],
            "newCards": 5,
            "reviewTarget": "No reviews due yet, about 10 minutes total."
          },
          {
            "day": 2,
            "label": "Tue",
            "activity": "Study the rest of the intro cards. A few review cards from yesterday will pop up, so clear those too and notice how quick repeats feel.",
            "learnModuleKeys": [],
            "newCards": 4,
            "reviewTarget": "Clear all due reviews (around 5 cards), about 12 minutes total."
          },
          {
            "day": 3,
            "label": "Wed",
            "activity": "Watch and read 'Tokenization & Embeddings' to learn how your words get chopped into tokens, then study its cards.",
            "learnModuleKeys": [
              "tokenization"
            ],
            "newCards": 5,
            "reviewTarget": "Clear all due reviews (around 6 cards), about 15 minutes."
          },
          {
            "day": 4,
            "label": "Thu",
            "activity": "Finish the tokenization cards and keep your review pile cleared so nothing snowballs.",
            "learnModuleKeys": [],
            "newCards": 4,
            "reviewTarget": "Clear all due reviews (around 8 cards), about 15 minutes."
          },
          {
            "day": 5,
            "label": "Fri",
            "activity": "No new cards today. Do a quick pass of anything due, then take the Section 1 test to lock in what 'an LLM' and 'a token' really mean.",
            "learnModuleKeys": [],
            "newCards": 0,
            "reviewTarget": "Quick clear of due reviews (about 5 minutes), then the test.",
            "sectionTestId": "sec-foundations-basics"
          }
        ]
      },
      {
        "week": 2,
        "theme": "Inside the model: the building block and the attention trick",
        "days": [
          {
            "day": 6,
            "label": "Mon",
            "activity": "Watch and read 'Transformer Architecture' to see the one repeating building block every LLM is made of, then study its cards.",
            "learnModuleKeys": [
              "architecture"
            ],
            "newCards": 5,
            "reviewTarget": "Clear all due reviews from last week, about 15 minutes."
          },
          {
            "day": 7,
            "label": "Tue",
            "activity": "Finish the architecture cards. Aim for the plain picture: the same block stacked over and over, not a pile of math.",
            "learnModuleKeys": [],
            "newCards": 5,
            "reviewTarget": "Clear all due reviews, about 15 minutes."
          },
          {
            "day": 8,
            "label": "Wed",
            "activity": "Watch and read 'Attention Mechanism', which is how the model decides which earlier words matter, then study its cards.",
            "learnModuleKeys": [
              "attention"
            ],
            "newCards": 5,
            "reviewTarget": "Clear all due reviews, about 15 minutes."
          },
          {
            "day": 9,
            "label": "Thu",
            "activity": "Finish the attention cards. Connect it back: attention is the engine that also makes very long inputs expensive.",
            "learnModuleKeys": [],
            "newCards": 5,
            "reviewTarget": "Clear all due reviews, about 15 minutes."
          },
          {
            "day": 10,
            "label": "Fri",
            "activity": "No new cards. Quick review of anything due, then take the Section 2 test on how the model is built and how attention works.",
            "learnModuleKeys": [],
            "newCards": 0,
            "reviewTarget": "Quick clear of due reviews (about 5 minutes), then the test.",
            "sectionTestId": "sec-inside-the-model"
          }
        ]
      },
      {
        "week": 3,
        "theme": "How models learn: reading the world, then learning manners",
        "days": [
          {
            "day": 11,
            "label": "Mon",
            "activity": "Watch and read 'Pretraining & Scaling' to see where a model gets its knowledge by predicting the next word across huge amounts of text, then study its cards.",
            "learnModuleKeys": [
              "pretraining"
            ],
            "newCards": 5,
            "reviewTarget": "Clear all due reviews, about 15 minutes."
          },
          {
            "day": 12,
            "label": "Tue",
            "activity": "Finish the pretraining cards. Hold onto the headline: bigger data and bigger models tend to mean smarter behavior.",
            "learnModuleKeys": [],
            "newCards": 5,
            "reviewTarget": "Clear all due reviews, about 15 minutes."
          },
          {
            "day": 13,
            "label": "Wed",
            "activity": "Watch and read 'Post-training & Alignment' to learn how a raw model is shaped into a polite, helpful assistant, then study its cards.",
            "learnModuleKeys": [
              "posttraining"
            ],
            "newCards": 5,
            "reviewTarget": "Clear all due reviews, about 15 minutes."
          },
          {
            "day": 14,
            "label": "Thu",
            "activity": "Finish the post-training cards. Notice why a model refuses some requests and uses good manners: that behavior was taught after the main reading.",
            "learnModuleKeys": [],
            "newCards": 5,
            "reviewTarget": "Clear all due reviews, about 15 minutes."
          },
          {
            "day": 15,
            "label": "Fri",
            "activity": "A pure consolidation day with no new cards and no test. Just clear reviews and let pretraining and post-training settle before the last training topic next week.",
            "learnModuleKeys": [],
            "newCards": 0,
            "reviewTarget": "Clear all due reviews, about 15 minutes."
          }
        ]
      },
      {
        "week": 4,
        "theme": "How models answer, then the big section test",
        "days": [
          {
            "day": 16,
            "label": "Mon",
            "activity": "Watch and read 'Inference & Decoding' to see how the model actually writes an answer one word at a time, then study its cards.",
            "learnModuleKeys": [
              "inference"
            ],
            "newCards": 5,
            "reviewTarget": "Clear all due reviews, about 15 minutes."
          },
          {
            "day": 17,
            "label": "Tue",
            "activity": "Finish the inference cards. Focus on the 'temperature' idea: lower for predictable answers, higher for more creative ones.",
            "learnModuleKeys": [],
            "newCards": 5,
            "reviewTarget": "Clear all due reviews, about 15 minutes."
          },
          {
            "day": 18,
            "label": "Wed",
            "activity": "No new cards. Consolidate the whole training-and-answering story: read huge text, learn manners, then answer word by word.",
            "learnModuleKeys": [],
            "newCards": 0,
            "reviewTarget": "Clear all due reviews, about 12 minutes."
          },
          {
            "day": 19,
            "label": "Thu",
            "activity": "A light review, then take the Section 3 test. This is the biggest test in the path because it covers three modules, so give yourself a calm few minutes.",
            "learnModuleKeys": [],
            "newCards": 0,
            "reviewTarget": "Quick clear of due reviews (about 5 minutes), then the test.",
            "sectionTestId": "sec-training-and-answers"
          },
          {
            "day": 20,
            "label": "Fri",
            "activity": "Rest and buffer day. If you fell behind, use it to catch up on reviews. If you are on track, take the day off and let it all sink in.",
            "learnModuleKeys": [],
            "newCards": 0,
            "reviewTarget": "Optional: clear anything due (about 10 minutes), or rest."
          }
        ]
      },
      {
        "week": 5,
        "theme": "Working with models: the two skills you will use every day",
        "days": [
          {
            "day": 21,
            "label": "Mon",
            "activity": "Watch and read 'Prompting', the single highest-leverage skill, since most 'dumb model' moments are really just unclear prompts. Then study its cards.",
            "learnModuleKeys": [
              "prompting"
            ],
            "newCards": 5,
            "reviewTarget": "Clear all due reviews, about 15 minutes."
          },
          {
            "day": 22,
            "label": "Tue",
            "activity": "Finish the prompting cards, then rewrite one of your own real prompts using a tip you just learned and see if the answer improves.",
            "learnModuleKeys": [],
            "newCards": 4,
            "reviewTarget": "Clear all due reviews, about 15 minutes."
          },
          {
            "day": 23,
            "label": "Wed",
            "activity": "Watch and read 'Context Windows & Context Engineering' to learn the model's short-term memory and what to put in it, then study its cards.",
            "learnModuleKeys": [
              "contexteng"
            ],
            "newCards": 5,
            "reviewTarget": "Clear all due reviews, about 15 minutes."
          },
          {
            "day": 24,
            "label": "Thu",
            "activity": "Finish the context-window cards. Hold onto the lesson that more pasted-in text is not always better, since clutter can crowd out what matters.",
            "learnModuleKeys": [],
            "newCards": 4,
            "reviewTarget": "Clear all due reviews, about 15 minutes."
          },
          {
            "day": 25,
            "label": "Fri",
            "activity": "A light review, then take the final Section 4 test. Afterward, take a minute to notice how much of an LLM you can now explain in your own words. You are done with the beginner path. Keep clearing your daily reviews to make it stick.",
            "learnModuleKeys": [],
            "newCards": 0,
            "reviewTarget": "Quick clear of due reviews (about 5 minutes), then the test.",
            "sectionTestId": "sec-working-with-models"
          }
        ]
      }
    ],
    "rationale": "SCOPE: This path covers all seven Tier 1 foundation modules (intro, tokenization, architecture, attention, pretraining, post-training, inference) plus the two most useful practical Tier 2 basics named in the scope guidance: prompting and context windows. That is nine of the 24 modules. I deliberately left out the more technical Tier 2 topics (tool calling, RAG, fine-tuning, evals) and all of Tiers 3 and 4, because a non-technical beginner does not need agents, serving, or compliance to have a genuine working mental model, and adding them would make the path feel like homework. The promise is narrow and achievable: by the end you can explain in plain English what an LLM is, how it reads and writes text, how it was trained, and how to get good answers out of it.\n\nCARD CHOICE: The deck stays the daily study tool, but the beginner only takes the core-difficulty cards from these nine modules (about 86 cards total). Core cards are the plain-English ones. Intermediate and advanced cards are skipped so nobody drowns in jargon, with one small exception: the final practical test (prompting and context) also allows intermediate cards, because those two modules are where a little extra practical depth genuinely pays off in daily use.\n\nPACING: At roughly 15 to 20 minutes a day, five days a week, the honest timeframe is five weeks. The daily load is deliberately gentle, never more than five new cards plus reviews, which keeps each session inside the time budget even on a learn day that also includes a short video. I built in review-only consolidation days, a rest and catch-up day, and test days with no new cards, so the path never feels rushed and the spaced-repetition reviews always have room to be cleared. Under-promising on speed is the right call for a confidence-building beginner course.\n\nSECTION STRUCTURE: The nine modules group naturally into four sections that each tell one small story: (1) what an LLM is and how text becomes tokens, (2) what is inside the model (the transformer block and attention), (3) how models learn and then answer (pretraining, post-training, inference), and (4) working with models in practice (prompting and context). Each section ends with a short test drawn only from that section's cards, so a pass really means that chunk stuck. I set the pass bar at 80 percent for the orientation and practical sections, but eased it to 75 percent for the two most abstract sections (inside the model, and how models learn and answer), because those are the hardest topics for a non-technical learner and a slightly lower bar keeps the experience encouraging rather than punishing. Each section's remediation points to the exact modules and ideas to re-watch and restudy before retrying, in plain language with no blame."
  },
  "intermediate": {
    "level": "intermediate",
    "title": "The Practitioner Path: Working With Models Day to Day",
    "blurb": "For people who want to actually build with LLMs, not just understand them. You'll get a fast but solid grounding in how models work, then go deep on the daily skills: writing prompts that hold up, managing the context window, getting clean JSON and tool calls, grounding answers in your own documents (RAG), fine-tuning, and measuring quality. You finish with the practical systems side: agents, serving speed, cost, and reliability. About 11 weeks at a steady 25-30 minutes a day.",
    "targetAudience": "Builders and product-minded people who will work with models hands-on: writing prompts, managing context, getting structured output and tool calls, grounding answers with retrieval, fine-tuning, evaluating quality, and standing up agents with sane serving/cost/reliability. Comfortable with the idea of code and JSON; not necessarily ML engineers.",
    "assumedMinutesPerDay": 28,
    "daysPerWeek": 6,
    "totalWeeks": 11,
    "moduleKeys": [
      "intro",
      "tokenization",
      "architecture",
      "attention",
      "pretraining",
      "posttraining",
      "inference",
      "prompting",
      "contexteng",
      "toolcalling",
      "rag",
      "finetuning",
      "eval",
      "agents",
      "multiagent",
      "multimodal",
      "serving",
      "economics",
      "reliability"
    ],
    "sections": [
      {
        "id": "sec1-foundations",
        "title": "How the Machine Works",
        "moduleKeys": [
          "intro",
          "tokenization",
          "architecture",
          "attention"
        ],
        "test": {
          "questionCount": 10,
          "passThresholdPct": 80,
          "drawsFromModuleKeys": [
            "intro",
            "tokenization",
            "architecture",
            "attention"
          ],
          "includeDifficulties": [
            "core",
            "intermediate"
          ]
        },
        "remediation": "If you miss questions here, restudy the basics of what the model actually is. Tokenization and attention are the two that bite people: re-watch the tokenization video and re-read why you're billed per token and why models fumble spelling, and re-watch the attention video to nail down that attention is just the model deciding which earlier tokens matter and why that makes long context expensive. Architecture and intro are lighter; skim those. Then re-run the failed cards before retaking."
      },
      {
        "id": "sec2-training-inference",
        "title": "Training and Answering",
        "moduleKeys": [
          "pretraining",
          "posttraining",
          "inference"
        ],
        "test": {
          "questionCount": 10,
          "passThresholdPct": 80,
          "drawsFromModuleKeys": [
            "pretraining",
            "posttraining",
            "inference"
          ],
          "includeDifficulties": [
            "core",
            "intermediate"
          ]
        },
        "remediation": "Most misses here are confusing the three stages. Re-anchor it: pretraining is where the model reads huge text and gets its raw knowledge, post-training (instruction tuning + human feedback) is what makes it a polite, refusing assistant, and inference is what happens every time it answers one token at a time. If the inference questions tripped you, re-study temperature, top-p, and the KV cache in the inference module, since those decide an answer's quality, cost, and speed. Redo the missed cards, then retake."
      },
      {
        "id": "sec3-prompting-context-tools",
        "title": "Talking to Models",
        "moduleKeys": [
          "prompting",
          "contexteng",
          "toolcalling"
        ],
        "test": {
          "questionCount": 12,
          "passThresholdPct": 80,
          "drawsFromModuleKeys": [
            "prompting",
            "contexteng",
            "toolcalling"
          ],
          "includeDifficulties": [
            "core",
            "intermediate",
            "advanced"
          ]
        },
        "remediation": "This is the highest-leverage section, so the bar is real. If prompting questions failed, re-read the module on why most 'dumb model' moments are actually prompt problems and redo those cards. If context questions failed, re-study the idea that the context window is the model's working memory and that the skill is deciding what to put in and what to leave out. If tool-calling failed, re-watch the structured-output/JSON and tool-calling video until the loop is clear: the model proposes an action, your code runs it. Since this test includes advanced cards, don't retake until the missed advanced cards feel easy."
      },
      {
        "id": "sec4-rag-finetune-eval",
        "title": "Grounding, Adapting, and Measuring",
        "moduleKeys": [
          "rag",
          "finetuning",
          "eval"
        ],
        "test": {
          "questionCount": 12,
          "passThresholdPct": 78,
          "drawsFromModuleKeys": [
            "rag",
            "finetuning",
            "eval"
          ],
          "includeDifficulties": [
            "core",
            "intermediate",
            "advanced"
          ]
        },
        "remediation": "The classic mix-up here is RAG vs fine-tuning. If you missed those, restudy the one-line rule: RAG feeds the model the right documents at question time to ground and cite answers, while fine-tuning changes behavior or format and cannot reliably add fresh facts. Use RAG for 'know this', fine-tune for 'act like this'. If the eval questions failed, re-read the module on telling a model that sounds smart from one that's actually right: benchmarks, your own eval set, human review, and model-as-judge. Redo the missed cards across all three modules before retaking, since these three are easy to half-remember."
      },
      {
        "id": "sec5-agents-systems",
        "title": "Agents and Systems",
        "moduleKeys": [
          "agents",
          "multiagent",
          "multimodal"
        ],
        "test": {
          "questionCount": 10,
          "passThresholdPct": 78,
          "drawsFromModuleKeys": [
            "agents",
            "multiagent",
            "multimodal"
          ],
          "includeDifficulties": [
            "core",
            "intermediate"
          ]
        },
        "remediation": "If agent questions failed, re-watch the agents video and lock in the agent loop: the model takes actions through tool calls in a loop instead of just emitting text, and MCP is the plumbing that connects it to tools. For multi-agent misses, re-read that splitting work across specialized agents buys you power but costs you money and latency, so it's a tradeoff, not a default. Multimodal is lighter: just re-skim how images and audio get turned into tokens and where that breaks. Redo failed cards, then retake."
      },
      {
        "id": "sec6-production",
        "title": "Running It in Production",
        "moduleKeys": [
          "serving",
          "economics",
          "reliability"
        ],
        "test": {
          "questionCount": 10,
          "passThresholdPct": 78,
          "drawsFromModuleKeys": [
            "serving",
            "economics",
            "reliability"
          ],
          "includeDifficulties": [
            "core",
            "intermediate"
          ]
        },
        "remediation": "If serving questions failed, re-study why a model feels fast or slow: time-to-first-token, streaming, the prefill vs decode split, and batching. If cost questions failed, re-read input vs output token pricing and the levers that cut the bill (caching and retrieval), and practice estimating a request's cost. If reliability failed, re-read how to design around non-determinism with guardrails, retries, fallbacks, and logging. These are practical, so think through a real feature you'd ship as you redo the missed cards, then retake."
      }
    ],
    "schedule": [
      {
        "week": 1,
        "theme": "What an LLM is, and how text becomes tokens",
        "days": [
          {
            "day": 1,
            "label": "Mon",
            "activity": "Watch the intro video, read the module, and study your first batch of cards. This is orientation: what LLMs are and aren't, from rule-based systems to the 2017 transformer.",
            "learnModuleKeys": [
              "intro"
            ],
            "newCards": 9,
            "reviewTarget": "No reviews due yet, just take the new cards (~25 min total)."
          },
          {
            "day": 2,
            "label": "Tue",
            "activity": "Finish the rest of the intro cards and let yesterday's cards come back for their first review.",
            "learnModuleKeys": [],
            "newCards": 8,
            "reviewTarget": "Clear all due reviews (~5 min)."
          },
          {
            "day": 3,
            "label": "Wed",
            "activity": "Watch the tokenization video and read the module, then study the first cards. This is where you learn why you're billed per token.",
            "learnModuleKeys": [
              "tokenization"
            ],
            "newCards": 10,
            "reviewTarget": "Clear all due reviews (~6 min)."
          },
          {
            "day": 4,
            "label": "Thu",
            "activity": "Finish the tokenization cards and keep up with reviews.",
            "learnModuleKeys": [],
            "newCards": 9,
            "reviewTarget": "Clear all due reviews (~8 min)."
          },
          {
            "day": 5,
            "label": "Fri",
            "activity": "No new cards. Review day: redo anything you rated 'again' on intro and tokenization, and re-skim the two module summaries.",
            "learnModuleKeys": [],
            "newCards": 0,
            "reviewTarget": "Clear all due reviews (~12 min)."
          },
          {
            "day": 6,
            "label": "Sat",
            "activity": "Light catch-up. Clear any due reviews and re-watch a video if a concept still feels fuzzy.",
            "learnModuleKeys": [],
            "newCards": 0,
            "reviewTarget": "Clear all due reviews (~10 min)."
          },
          {
            "day": 7,
            "label": "Sun",
            "activity": "Rest day. Optional: clear due reviews if you have a couple of minutes, otherwise skip.",
            "learnModuleKeys": [],
            "newCards": 0,
            "reviewTarget": "Optional: clear due reviews if any."
          }
        ]
      },
      {
        "week": 2,
        "theme": "Inside the transformer: architecture + attention",
        "days": [
          {
            "day": 1,
            "label": "Mon",
            "activity": "Watch the architecture video and read the module. The transformer block is the repeating unit every LLM is built from; study the first cards.",
            "learnModuleKeys": [
              "architecture"
            ],
            "newCards": 9,
            "reviewTarget": "Clear all due reviews (~10 min)."
          },
          {
            "day": 2,
            "label": "Tue",
            "activity": "Finish the architecture cards and keep up with reviews.",
            "learnModuleKeys": [],
            "newCards": 9,
            "reviewTarget": "Clear all due reviews (~10 min)."
          },
          {
            "day": 3,
            "label": "Wed",
            "activity": "Watch the attention video and read the module. Attention is the engine that decides which tokens matter; study the first cards.",
            "learnModuleKeys": [
              "attention"
            ],
            "newCards": 10,
            "reviewTarget": "Clear all due reviews (~10 min)."
          },
          {
            "day": 4,
            "label": "Thu",
            "activity": "Finish the attention cards and keep up with reviews.",
            "learnModuleKeys": [],
            "newCards": 9,
            "reviewTarget": "Clear all due reviews (~10 min)."
          },
          {
            "day": 5,
            "label": "Fri",
            "activity": "No new cards. Consolidation day across all four foundations modules; skim each summary so the whole mental model holds together before the test.",
            "learnModuleKeys": [],
            "newCards": 0,
            "reviewTarget": "Clear all due reviews and skim summaries (~20 min)."
          },
          {
            "day": 6,
            "label": "Sat",
            "activity": "Section 1 test. Ten questions drawn from intro, tokenization, architecture, and attention. Pass mark is 80%.",
            "learnModuleKeys": [],
            "newCards": 0,
            "reviewTarget": "Clear all due reviews after the test (~10 min).",
            "sectionTestId": "sec1-foundations"
          },
          {
            "day": 7,
            "label": "Sun",
            "activity": "Rest day. If you didn't pass, this is your remediation window: use the Section 1 guidance and redo the weak cards.",
            "learnModuleKeys": [],
            "newCards": 0,
            "reviewTarget": "Optional: clear due reviews or remediate."
          }
        ]
      },
      {
        "week": 3,
        "theme": "How models are trained: pretraining + post-training",
        "days": [
          {
            "day": 1,
            "label": "Mon",
            "activity": "Watch the pretraining video and read the module. This is where the model reads huge text and gets its knowledge; study the first cards.",
            "learnModuleKeys": [
              "pretraining"
            ],
            "newCards": 9,
            "reviewTarget": "Clear all due reviews (~12 min)."
          },
          {
            "day": 2,
            "label": "Tue",
            "activity": "Finish the pretraining cards and keep up with reviews.",
            "learnModuleKeys": [],
            "newCards": 9,
            "reviewTarget": "Clear all due reviews (~12 min)."
          },
          {
            "day": 3,
            "label": "Wed",
            "activity": "Watch the post-training video and read the module. This is the step that turns a raw model into a helpful, polite assistant with refusals; study the first cards.",
            "learnModuleKeys": [
              "posttraining"
            ],
            "newCards": 10,
            "reviewTarget": "Clear all due reviews (~12 min)."
          },
          {
            "day": 4,
            "label": "Thu",
            "activity": "Finish the post-training cards and keep up with reviews.",
            "learnModuleKeys": [],
            "newCards": 9,
            "reviewTarget": "Clear all due reviews (~12 min)."
          },
          {
            "day": 5,
            "label": "Fri",
            "activity": "No new cards. Review day: redo missed pretraining and post-training cards and make sure you can tell the two stages apart.",
            "learnModuleKeys": [],
            "newCards": 0,
            "reviewTarget": "Clear all due reviews (~15 min)."
          },
          {
            "day": 6,
            "label": "Sat",
            "activity": "Light catch-up and reviews. Re-watch a video if pretraining vs post-training still blurs together.",
            "learnModuleKeys": [],
            "newCards": 0,
            "reviewTarget": "Clear all due reviews (~12 min)."
          },
          {
            "day": 7,
            "label": "Sun",
            "activity": "Rest day.",
            "learnModuleKeys": [],
            "newCards": 0,
            "reviewTarget": "Optional: clear due reviews if any."
          }
        ]
      },
      {
        "week": 4,
        "theme": "How models answer: inference, then the Section 2 test",
        "days": [
          {
            "day": 1,
            "label": "Mon",
            "activity": "Watch the inference video and read the module. This covers predicting one token at a time, plus temperature, top-p, and the KV cache; study the first cards.",
            "learnModuleKeys": [
              "inference"
            ],
            "newCards": 10,
            "reviewTarget": "Clear all due reviews (~12 min)."
          },
          {
            "day": 2,
            "label": "Tue",
            "activity": "Finish the inference cards and keep up with reviews.",
            "learnModuleKeys": [],
            "newCards": 9,
            "reviewTarget": "Clear all due reviews (~12 min)."
          },
          {
            "day": 3,
            "label": "Wed",
            "activity": "No new cards. Consolidation day across pretraining, post-training, and inference before the test.",
            "learnModuleKeys": [],
            "newCards": 0,
            "reviewTarget": "Clear all due reviews and skim summaries (~20 min)."
          },
          {
            "day": 4,
            "label": "Thu",
            "activity": "Section 2 test. Ten questions drawn from pretraining, post-training, and inference. Pass mark is 80%.",
            "learnModuleKeys": [],
            "newCards": 0,
            "reviewTarget": "Clear all due reviews after the test (~12 min).",
            "sectionTestId": "sec2-training-inference"
          },
          {
            "day": 5,
            "label": "Fri",
            "activity": "Buffer and remediation day. If you passed, just clear reviews; if not, use the Section 2 guidance and redo weak cards. This light day also lets your review pile settle before Tier 2.",
            "learnModuleKeys": [],
            "newCards": 0,
            "reviewTarget": "Clear all due reviews (~15 min)."
          },
          {
            "day": 6,
            "label": "Sat",
            "activity": "Rest day. You just finished the foundations half; take the breather.",
            "learnModuleKeys": [],
            "newCards": 0,
            "reviewTarget": "Optional: clear due reviews if any."
          },
          {
            "day": 7,
            "label": "Sun",
            "activity": "Rest day.",
            "learnModuleKeys": [],
            "newCards": 0,
            "reviewTarget": "Optional: clear due reviews if any."
          }
        ]
      },
      {
        "week": 5,
        "theme": "Talking to models, part 1: prompting + context",
        "days": [
          {
            "day": 1,
            "label": "Mon",
            "activity": "Watch the prompting video and read the module. This is the single highest-leverage skill in the whole course; study the first cards.",
            "learnModuleKeys": [
              "prompting"
            ],
            "newCards": 10,
            "reviewTarget": "Clear all due reviews (~12 min)."
          },
          {
            "day": 2,
            "label": "Tue",
            "activity": "Finish the prompting cards and keep up with reviews. Try rewriting a real prompt of yours as you go.",
            "learnModuleKeys": [],
            "newCards": 10,
            "reviewTarget": "Clear all due reviews (~12 min)."
          },
          {
            "day": 3,
            "label": "Wed",
            "activity": "Watch the context-engineering video and read the module. The context window is the model's working memory; study the first cards.",
            "learnModuleKeys": [
              "contexteng"
            ],
            "newCards": 10,
            "reviewTarget": "Clear all due reviews (~12 min)."
          },
          {
            "day": 4,
            "label": "Thu",
            "activity": "Finish the context cards and keep up with reviews.",
            "learnModuleKeys": [],
            "newCards": 10,
            "reviewTarget": "Clear all due reviews (~12 min)."
          },
          {
            "day": 5,
            "label": "Fri",
            "activity": "No new cards. Review day for prompting and context; redo anything you missed.",
            "learnModuleKeys": [],
            "newCards": 0,
            "reviewTarget": "Clear all due reviews (~15 min)."
          },
          {
            "day": 6,
            "label": "Sat",
            "activity": "Light catch-up and reviews.",
            "learnModuleKeys": [],
            "newCards": 0,
            "reviewTarget": "Clear all due reviews (~12 min)."
          },
          {
            "day": 7,
            "label": "Sun",
            "activity": "Rest day.",
            "learnModuleKeys": [],
            "newCards": 0,
            "reviewTarget": "Optional: clear due reviews if any."
          }
        ]
      },
      {
        "week": 6,
        "theme": "Talking to models, part 2: structured output + tools, then the Section 3 test",
        "days": [
          {
            "day": 1,
            "label": "Mon",
            "activity": "Watch the structured-output and tool-calling video and read the module. This is the bridge from chatbot to software: the model proposes JSON or an action, your code runs it. Study the first cards.",
            "learnModuleKeys": [
              "toolcalling"
            ],
            "newCards": 10,
            "reviewTarget": "Clear all due reviews (~12 min)."
          },
          {
            "day": 2,
            "label": "Tue",
            "activity": "Finish the tool-calling cards and keep up with reviews.",
            "learnModuleKeys": [],
            "newCards": 10,
            "reviewTarget": "Clear all due reviews (~12 min)."
          },
          {
            "day": 3,
            "label": "Wed",
            "activity": "No new cards. Consolidation across prompting, context, and tool calling, including the advanced cards, since the test will include them.",
            "learnModuleKeys": [],
            "newCards": 0,
            "reviewTarget": "Clear all due reviews and skim summaries (~20 min)."
          },
          {
            "day": 4,
            "label": "Thu",
            "activity": "Section 3 test. Twelve questions drawn from prompting, context, and tool calling, including some advanced. Pass mark is 80%.",
            "learnModuleKeys": [],
            "newCards": 0,
            "reviewTarget": "Clear all due reviews after the test (~12 min).",
            "sectionTestId": "sec3-prompting-context-tools"
          },
          {
            "day": 5,
            "label": "Fri",
            "activity": "Buffer and remediation day. If you didn't pass, use the Section 3 guidance and redo the missed advanced cards specifically.",
            "learnModuleKeys": [],
            "newCards": 0,
            "reviewTarget": "Clear all due reviews (~15 min)."
          },
          {
            "day": 6,
            "label": "Sat",
            "activity": "Rest day.",
            "learnModuleKeys": [],
            "newCards": 0,
            "reviewTarget": "Optional: clear due reviews if any."
          },
          {
            "day": 7,
            "label": "Sun",
            "activity": "Rest day.",
            "learnModuleKeys": [],
            "newCards": 0,
            "reviewTarget": "Optional: clear due reviews if any."
          }
        ]
      },
      {
        "week": 7,
        "theme": "Grounding and adapting: RAG + fine-tuning",
        "days": [
          {
            "day": 1,
            "label": "Mon",
            "activity": "Watch the RAG video and read the module. RAG feeds the model relevant documents at question time so answers are grounded and cited without retraining. Study the first cards.",
            "learnModuleKeys": [
              "rag"
            ],
            "newCards": 9,
            "reviewTarget": "Clear all due reviews (~14 min)."
          },
          {
            "day": 2,
            "label": "Tue",
            "activity": "Continue the RAG cards and keep up with reviews.",
            "learnModuleKeys": [],
            "newCards": 8,
            "reviewTarget": "Clear all due reviews (~14 min)."
          },
          {
            "day": 3,
            "label": "Wed",
            "activity": "Finish the RAG cards and keep up with reviews.",
            "learnModuleKeys": [],
            "newCards": 5,
            "reviewTarget": "Clear all due reviews (~14 min)."
          },
          {
            "day": 4,
            "label": "Thu",
            "activity": "Watch the fine-tuning video and read the module. Fine-tuning changes behavior or format but can't reliably add fresh facts; that contrast with RAG is the key takeaway. Study the first cards.",
            "learnModuleKeys": [
              "finetuning"
            ],
            "newCards": 9,
            "reviewTarget": "Clear all due reviews (~14 min)."
          },
          {
            "day": 5,
            "label": "Fri",
            "activity": "Continue the fine-tuning cards and keep up with reviews.",
            "learnModuleKeys": [],
            "newCards": 8,
            "reviewTarget": "Clear all due reviews (~14 min)."
          },
          {
            "day": 6,
            "label": "Sat",
            "activity": "Finish the fine-tuning cards. Quick gut-check: can you say in one line when you'd reach for RAG vs fine-tuning?",
            "learnModuleKeys": [],
            "newCards": 5,
            "reviewTarget": "Clear all due reviews (~12 min)."
          },
          {
            "day": 7,
            "label": "Sun",
            "activity": "Rest day.",
            "learnModuleKeys": [],
            "newCards": 0,
            "reviewTarget": "Optional: clear due reviews if any."
          }
        ]
      },
      {
        "week": 8,
        "theme": "Measuring quality: evaluation, then the Section 4 test",
        "days": [
          {
            "day": 1,
            "label": "Mon",
            "activity": "Watch the evaluation video and read the module. This is how you tell a model that sounds smart from one that's actually right: benchmarks, eval sets, human review, model-as-judge. Study the first cards.",
            "learnModuleKeys": [
              "eval"
            ],
            "newCards": 9,
            "reviewTarget": "Clear all due reviews (~14 min)."
          },
          {
            "day": 2,
            "label": "Tue",
            "activity": "Continue the evaluation cards and keep up with reviews.",
            "learnModuleKeys": [],
            "newCards": 8,
            "reviewTarget": "Clear all due reviews (~14 min)."
          },
          {
            "day": 3,
            "label": "Wed",
            "activity": "Finish the evaluation cards and keep up with reviews.",
            "learnModuleKeys": [],
            "newCards": 5,
            "reviewTarget": "Clear all due reviews (~14 min)."
          },
          {
            "day": 4,
            "label": "Thu",
            "activity": "No new cards. Consolidation across RAG, fine-tuning, and evaluation, including advanced cards, ahead of the test.",
            "learnModuleKeys": [],
            "newCards": 0,
            "reviewTarget": "Clear all due reviews and skim summaries (~20 min)."
          },
          {
            "day": 5,
            "label": "Fri",
            "activity": "Section 4 test. Twelve questions drawn from RAG, fine-tuning, and evaluation, including some advanced. Pass mark is 78%.",
            "learnModuleKeys": [],
            "newCards": 0,
            "reviewTarget": "Clear all due reviews after the test (~14 min).",
            "sectionTestId": "sec4-rag-finetune-eval"
          },
          {
            "day": 6,
            "label": "Sat",
            "activity": "Buffer and remediation day. If you didn't pass, the most common fix is re-locking the RAG vs fine-tuning distinction; redo those cards.",
            "learnModuleKeys": [],
            "newCards": 0,
            "reviewTarget": "Clear all due reviews (~15 min)."
          },
          {
            "day": 7,
            "label": "Sun",
            "activity": "Rest day. That's all of Tier 2 done; the daily-driver skills are now in your deck.",
            "learnModuleKeys": [],
            "newCards": 0,
            "reviewTarget": "Optional: clear due reviews if any."
          }
        ]
      },
      {
        "week": 9,
        "theme": "Agents: tools, loops, and MCP",
        "days": [
          {
            "day": 1,
            "label": "Mon",
            "activity": "Watch the agents video and read the module. This is where a model stops generating text and starts taking actions in a loop; MCP is the plumbing. Study the first cards.",
            "learnModuleKeys": [
              "agents"
            ],
            "newCards": 10,
            "reviewTarget": "Clear all due reviews (~14 min)."
          },
          {
            "day": 2,
            "label": "Tue",
            "activity": "Finish the agents cards (including a couple of the advanced ones, since agents matter for this audience) and keep up with reviews.",
            "learnModuleKeys": [],
            "newCards": 9,
            "reviewTarget": "Clear all due reviews (~14 min)."
          },
          {
            "day": 3,
            "label": "Wed",
            "activity": "Watch the multi-agent video and read the module. Several specialized agents can divide, hand off, debate, or check work, at the cost of money and latency. Study the first cards.",
            "learnModuleKeys": [
              "multiagent"
            ],
            "newCards": 9,
            "reviewTarget": "Clear all due reviews (~14 min)."
          },
          {
            "day": 4,
            "label": "Thu",
            "activity": "Finish the multi-agent cards and keep up with reviews.",
            "learnModuleKeys": [],
            "newCards": 8,
            "reviewTarget": "Clear all due reviews (~14 min)."
          },
          {
            "day": 5,
            "label": "Fri",
            "activity": "No new cards. Review day for agents and multi-agent; make sure the agent loop and the cost/latency tradeoff are both solid.",
            "learnModuleKeys": [],
            "newCards": 0,
            "reviewTarget": "Clear all due reviews (~15 min)."
          },
          {
            "day": 6,
            "label": "Sat",
            "activity": "Light catch-up and reviews.",
            "learnModuleKeys": [],
            "newCards": 0,
            "reviewTarget": "Clear all due reviews (~12 min)."
          },
          {
            "day": 7,
            "label": "Sun",
            "activity": "Rest day.",
            "learnModuleKeys": [],
            "newCards": 0,
            "reviewTarget": "Optional: clear due reviews if any."
          }
        ]
      },
      {
        "week": 10,
        "theme": "Multimodal + serving, then the Section 5 test",
        "days": [
          {
            "day": 1,
            "label": "Mon",
            "activity": "Watch the multimodal video and read the module. Learn how images and audio become tokens and where those models break. Study the first cards.",
            "learnModuleKeys": [
              "multimodal"
            ],
            "newCards": 9,
            "reviewTarget": "Clear all due reviews (~14 min)."
          },
          {
            "day": 2,
            "label": "Tue",
            "activity": "Finish the multimodal cards and keep up with reviews.",
            "learnModuleKeys": [],
            "newCards": 8,
            "reviewTarget": "Clear all due reviews (~14 min)."
          },
          {
            "day": 3,
            "label": "Wed",
            "activity": "No new cards. Consolidation across agents, multi-agent, and multimodal ahead of the test.",
            "learnModuleKeys": [],
            "newCards": 0,
            "reviewTarget": "Clear all due reviews and skim summaries (~18 min)."
          },
          {
            "day": 4,
            "label": "Thu",
            "activity": "Section 5 test. Ten questions drawn from agents, multi-agent, and multimodal. Pass mark is 78%.",
            "learnModuleKeys": [],
            "newCards": 0,
            "reviewTarget": "Clear all due reviews after the test (~14 min).",
            "sectionTestId": "sec5-agents-systems"
          },
          {
            "day": 5,
            "label": "Fri",
            "activity": "Start the production stretch. Watch the serving video and read the module: why a model feels fast or slow, time-to-first-token, streaming, prefill vs decode, batching. Study the first cards.",
            "learnModuleKeys": [
              "serving"
            ],
            "newCards": 9,
            "reviewTarget": "Clear all due reviews (~14 min)."
          },
          {
            "day": 6,
            "label": "Sat",
            "activity": "Finish the serving cards and keep up with reviews.",
            "learnModuleKeys": [],
            "newCards": 8,
            "reviewTarget": "Clear all due reviews (~14 min)."
          },
          {
            "day": 7,
            "label": "Sun",
            "activity": "Rest day.",
            "learnModuleKeys": [],
            "newCards": 0,
            "reviewTarget": "Optional: clear due reviews if any."
          }
        ]
      },
      {
        "week": 11,
        "theme": "Production: cost + reliability, the Section 6 test, and course wrap",
        "days": [
          {
            "day": 1,
            "label": "Mon",
            "activity": "Watch the cost video and read the module. Input vs output token pricing, how to estimate what a request costs, and levers like caching and retrieval. Study the first cards.",
            "learnModuleKeys": [
              "economics"
            ],
            "newCards": 9,
            "reviewTarget": "Clear all due reviews (~14 min)."
          },
          {
            "day": 2,
            "label": "Tue",
            "activity": "Finish the cost cards and keep up with reviews. Try estimating the cost of a real prompt you use.",
            "learnModuleKeys": [],
            "newCards": 8,
            "reviewTarget": "Clear all due reviews (~14 min)."
          },
          {
            "day": 3,
            "label": "Wed",
            "activity": "Watch the reliability video and read the module. Designing around non-determinism: guardrails, retries, fallbacks, logging, and monitoring. Study the first cards.",
            "learnModuleKeys": [
              "reliability"
            ],
            "newCards": 9,
            "reviewTarget": "Clear all due reviews (~14 min)."
          },
          {
            "day": 4,
            "label": "Thu",
            "activity": "Finish the reliability cards and keep up with reviews.",
            "learnModuleKeys": [],
            "newCards": 8,
            "reviewTarget": "Clear all due reviews (~14 min)."
          },
          {
            "day": 5,
            "label": "Fri",
            "activity": "No new cards. Consolidation across serving, cost, and reliability ahead of the final section test.",
            "learnModuleKeys": [],
            "newCards": 0,
            "reviewTarget": "Clear all due reviews and skim summaries (~18 min)."
          },
          {
            "day": 6,
            "label": "Sat",
            "activity": "Section 6 test. Ten questions drawn from serving, cost, and reliability. Pass mark is 78%.",
            "learnModuleKeys": [],
            "newCards": 0,
            "reviewTarget": "Clear all due reviews after the test (~14 min).",
            "sectionTestId": "sec6-production"
          },
          {
            "day": 7,
            "label": "Sun",
            "activity": "Course wrap. Clear all due reviews and set your ongoing plan: keep doing daily spaced-repetition reviews to hold everything, and consider the Expert path (Tier 4) when you're ready.",
            "learnModuleKeys": [],
            "newCards": 0,
            "reviewTarget": "Clear all due reviews (~15 min), then maintenance only going forward."
          }
        ]
      }
    ],
    "rationale": "Scope: the audience wants to build with models, so the path covers Tiers 1-3 (19 of the 24 modules) and deliberately leaves Tier 4 (safety, reasoning, landscape, privacy, frontier) for an Expert path. Tier 1 is included but run lean (core + intermediate cards, skipping most advanced internals) because a practitioner needs the mental model of tokens, attention, training, and inference to debug real behavior, but doesn't need to derive the math. Tier 2 is the heart of the course and gets full depth, including advanced cards, because prompting, context, tool calling, RAG, fine-tuning, and evaluation are the literal day-to-day job. Tier 3 covers the practical systems reality (agents, multi-agent, multimodal, serving, cost, reliability) at core + intermediate depth so they can ship something that survives real users without drowning in GPU internals.\n\nPacing: at 28 minutes a day, six days a week, the honest constraint is that spaced-repetition reviews grow as the deck grows, so new-card capacity has to shrink over time. The plan front-loads ~10 new cards a day when the deck is small and tapers to ~8 on the dense Tier 2/3 modules, with frequent review-only and rest days so reviews never blow the time budget. That lands the full ~359-card practitioner deck in 11 weeks. I chose to under-promise: an 8-week version exists on paper but only by cramming three-module sections into single weeks, which collides with test prep and review load. Eleven weeks keeps every learn day under 30 minutes and every section test preceded by a real consolidation day.\n\nSection structure: six sections of 3-4 modules each, every one ending in a test drawn only from that section's cards. The split follows the natural seams: how the machine works, how it's trained and answers, talking to models, grounding/adapting/measuring, agents and systems, and production. Tests for the two Tier 2 depth sections include advanced cards and the others stay at core+intermediate, matching where this audience needs rigor. Pass thresholds sit at 78-80%: high enough to mean something, not so high that one fuzzy card blocks progress. Each section's remediation names the exact modules and the specific confusions that trip people (tokenization/attention, the three training stages, RAG vs fine-tuning, the agent loop), so a failed test points straight at what to restudy rather than 'review everything'."
  },
  "expert": {
    "level": "expert",
    "title": "The Complete Path: Mastering How LLMs Work",
    "blurb": "The full 24-module curriculum across all four tiers: foundations, working with models, systems and agents, and judgment plus frontier. Built for genuine mastery, so you reason about tradeoffs, failure modes, and model choice instead of just recalling facts. Ten weeks at about 45 minutes a day, six days a week.",
    "targetAudience": "Someone pursuing genuine mastery: comfortable with the full deck including advanced cards, the systems and agents tier, and the Tier 4 judgment and frontier material, who wants to reason about tradeoffs, failure modes, and model choice, not just recall definitions.",
    "assumedMinutesPerDay": 45,
    "daysPerWeek": 6,
    "totalWeeks": 10,
    "moduleKeys": [
      "intro",
      "tokenization",
      "architecture",
      "attention",
      "pretraining",
      "posttraining",
      "inference",
      "prompting",
      "contexteng",
      "toolcalling",
      "rag",
      "finetuning",
      "eval",
      "agents",
      "multiagent",
      "multimodal",
      "serving",
      "economics",
      "reliability",
      "safety",
      "reasoning",
      "landscape",
      "privacy",
      "frontier"
    ],
    "sections": [
      {
        "id": "sec1",
        "title": "Foundations A: Representation & Architecture",
        "moduleKeys": [
          "intro",
          "tokenization",
          "architecture",
          "attention"
        ],
        "test": {
          "questionCount": 12,
          "passThresholdPct": 80,
          "drawsFromModuleKeys": [
            "intro",
            "tokenization",
            "architecture",
            "attention"
          ],
          "includeDifficulties": [
            "core",
            "intermediate",
            "advanced"
          ]
        },
        "remediation": "If you fall short, the usual culprits are the transformer block (architecture) and attention. Re-watch those two videos, redraw the block from memory, and restudy why long context gets expensive. If tokenization questions tripped you up, re-drill why models are billed per token and stumble on spelling."
      },
      {
        "id": "sec2",
        "title": "Foundations B: Training & Inference",
        "moduleKeys": [
          "pretraining",
          "posttraining",
          "inference"
        ],
        "test": {
          "questionCount": 12,
          "passThresholdPct": 80,
          "drawsFromModuleKeys": [
            "pretraining",
            "posttraining",
            "inference"
          ],
          "includeDifficulties": [
            "core",
            "intermediate",
            "advanced"
          ]
        },
        "remediation": "Restudy whichever stage you missed: pretraining (where knowledge and scale come from), post-training (instruction tuning and human feedback), or inference (temperature, top-p, KV cache). The decoding controls are the most common miss, so re-drill what temperature and top-p actually change."
      },
      {
        "id": "sec3",
        "title": "Working With Models",
        "moduleKeys": [
          "prompting",
          "contexteng",
          "toolcalling",
          "rag",
          "finetuning",
          "eval"
        ],
        "test": {
          "questionCount": 15,
          "passThresholdPct": 80,
          "drawsFromModuleKeys": [
            "prompting",
            "contexteng",
            "toolcalling",
            "rag",
            "finetuning",
            "eval"
          ],
          "includeDifficulties": [
            "core",
            "intermediate",
            "advanced"
          ]
        },
        "remediation": "This section is six modules, so check which topics you missed. The two highest-value re-drills are prompting (most failures are prompt problems) and RAG (grounding answers in retrieved documents). If you mixed up fine-tuning and RAG, restudy the line: fine-tuning changes behavior and format, RAG adds fresh facts. Re-watch the eval module if you couldn't judge whether a model is actually right."
      },
      {
        "id": "sec4",
        "title": "Systems & Agents",
        "moduleKeys": [
          "agents",
          "multiagent",
          "multimodal",
          "serving",
          "economics",
          "reliability"
        ],
        "test": {
          "questionCount": 15,
          "passThresholdPct": 80,
          "drawsFromModuleKeys": [
            "agents",
            "multiagent",
            "multimodal",
            "serving",
            "economics",
            "reliability"
          ],
          "includeDifficulties": [
            "core",
            "intermediate",
            "advanced"
          ]
        },
        "remediation": "Re-trace an agent loop step by step if the agents and MCP questions tripped you. For serving and economics, redo the cost and latency math by hand until it's automatic. If reliability slipped, restudy the patterns for designing around non-determinism: retries, fallbacks, guardrails, and logging."
      },
      {
        "id": "sec5",
        "title": "Judgment & Frontier",
        "moduleKeys": [
          "safety",
          "reasoning",
          "landscape",
          "privacy",
          "frontier"
        ],
        "test": {
          "questionCount": 13,
          "passThresholdPct": 82,
          "drawsFromModuleKeys": [
            "safety",
            "reasoning",
            "landscape",
            "privacy",
            "frontier"
          ],
          "includeDifficulties": [
            "core",
            "intermediate",
            "advanced"
          ]
        },
        "remediation": "For safety, pair each failure mode with its defense and re-drill until you can name both. For reasoning, make sure you can separate chain-of-thought prompting from trained reasoning and state the cost. If landscape or privacy questions slipped, restudy how to pick a model on cost, speed, and context, and what actually happens to your data when it leaves your control."
      }
    ],
    "schedule": [
      {
        "week": 1,
        "theme": "Foundations A: from text to vectors to the transformer block",
        "days": [
          {
            "day": 1,
            "label": "Mon",
            "activity": "Watch the intro video, read the module, then study all of its cards. It's plain-English orientation, so it moves fast.",
            "learnModuleKeys": [
              "intro"
            ],
            "newCards": 20,
            "reviewTarget": "No reviews due yet, just the new cards, ~30 min."
          },
          {
            "day": 2,
            "label": "Tue",
            "activity": "Clear any due reviews, then learn tokenization and embeddings: why you're billed per token and why models stumble on spelling.",
            "learnModuleKeys": [
              "tokenization"
            ],
            "newCards": 22,
            "reviewTarget": "Clear all due first, ~8 min."
          },
          {
            "day": 3,
            "label": "Wed",
            "activity": "Review-only day. No new module, so let yesterday's cards settle and reread any tokenization cards you missed.",
            "learnModuleKeys": [],
            "newCards": 0,
            "reviewTarget": "Clear all due, ~15 min."
          },
          {
            "day": 4,
            "label": "Thu",
            "activity": "Learn the transformer block, the repeating unit every LLM is built from. This is dense, so go slow and study every card.",
            "learnModuleKeys": [
              "architecture"
            ],
            "newCards": 22,
            "reviewTarget": "Clear all due first, ~12 min."
          },
          {
            "day": 5,
            "label": "Fri",
            "activity": "Review-only. Redraw the transformer block from memory and check it against the cards.",
            "learnModuleKeys": [],
            "newCards": 0,
            "reviewTarget": "Clear all due, ~15 min."
          },
          {
            "day": 6,
            "label": "Sat",
            "activity": "Light catch-up. No new cards, so clear reviews and rest if you're caught up.",
            "learnModuleKeys": [],
            "newCards": 0,
            "reviewTarget": "Clear all due, ~12 min."
          }
        ]
      },
      {
        "week": 2,
        "theme": "Foundations A: attention + Section 1 checkpoint",
        "days": [
          {
            "day": 7,
            "label": "Mon",
            "activity": "Learn the attention mechanism: how the model decides which tokens matter and why long context gets expensive.",
            "learnModuleKeys": [
              "attention"
            ],
            "newCards": 22,
            "reviewTarget": "Clear all due first, ~15 min."
          },
          {
            "day": 8,
            "label": "Tue",
            "activity": "Review-only. Restudy the attention cards and the intuition behind queries, keys, and values.",
            "learnModuleKeys": [],
            "newCards": 0,
            "reviewTarget": "Clear all due, ~18 min."
          },
          {
            "day": 9,
            "label": "Wed",
            "activity": "Review-only across all of Section 1.",
            "learnModuleKeys": [],
            "newCards": 0,
            "reviewTarget": "Clear all due, ~18 min."
          },
          {
            "day": 10,
            "label": "Thu",
            "activity": "Test prep. Drill core and intermediate cards from intro through attention, then hit the advanced ones.",
            "learnModuleKeys": [],
            "newCards": 0,
            "reviewTarget": "Clear all due plus extra drill, ~25 min."
          },
          {
            "day": 11,
            "label": "Fri",
            "activity": "Take the Section 1 test, covering tokenization through attention.",
            "learnModuleKeys": [],
            "newCards": 0,
            "reviewTarget": "Clear all due, ~10 min.",
            "sectionTestId": "sec1"
          },
          {
            "day": 12,
            "label": "Sat",
            "activity": "Remediate. Restudy any topics you missed on the test.",
            "learnModuleKeys": [],
            "newCards": 0,
            "reviewTarget": "Clear all due plus failed-topic restudy, ~20 min."
          }
        ]
      },
      {
        "week": 3,
        "theme": "Foundations B: how models are trained and how they answer",
        "days": [
          {
            "day": 13,
            "label": "Mon",
            "activity": "Learn pretraining and scaling: where the model's knowledge comes from and what scaling laws predict.",
            "learnModuleKeys": [
              "pretraining"
            ],
            "newCards": 22,
            "reviewTarget": "Clear all due first, ~15 min."
          },
          {
            "day": 14,
            "label": "Tue",
            "activity": "Review-only. Restudy scaling laws and the data-and-compute picture.",
            "learnModuleKeys": [],
            "newCards": 0,
            "reviewTarget": "Clear all due, ~18 min."
          },
          {
            "day": 15,
            "label": "Wed",
            "activity": "Learn post-training and alignment: the instruction tuning and human feedback that turn a raw model into a helpful assistant.",
            "learnModuleKeys": [
              "posttraining"
            ],
            "newCards": 22,
            "reviewTarget": "Clear all due first, ~15 min."
          },
          {
            "day": 16,
            "label": "Thu",
            "activity": "Learn inference and decoding: temperature, top-p, and the KV cache that decide quality, cost, and speed.",
            "learnModuleKeys": [
              "inference"
            ],
            "newCards": 22,
            "reviewTarget": "Clear all due first, ~15 min."
          },
          {
            "day": 17,
            "label": "Fri",
            "activity": "Review-only. Drill temperature and top-p behavior and what the KV cache actually buys you.",
            "learnModuleKeys": [],
            "newCards": 0,
            "reviewTarget": "Clear all due plus drill, ~22 min."
          },
          {
            "day": 18,
            "label": "Sat",
            "activity": "Take the Section 2 test, covering pretraining, post-training, and inference.",
            "learnModuleKeys": [],
            "newCards": 0,
            "reviewTarget": "Clear all due, ~12 min.",
            "sectionTestId": "sec2"
          }
        ]
      },
      {
        "week": 4,
        "theme": "Working with models: prompting, context, tool calling",
        "days": [
          {
            "day": 19,
            "label": "Mon",
            "activity": "Remediate any Section 2 gaps, then learn prompting, the highest-leverage skill, since most 'dumb model' moments are prompt problems.",
            "learnModuleKeys": [
              "prompting"
            ],
            "newCards": 20,
            "reviewTarget": "Clear all due first, ~18 min."
          },
          {
            "day": 20,
            "label": "Tue",
            "activity": "Review-only. Drill the prompting patterns until they're automatic.",
            "learnModuleKeys": [],
            "newCards": 0,
            "reviewTarget": "Clear all due, ~20 min."
          },
          {
            "day": 21,
            "label": "Wed",
            "activity": "Learn context windows and context engineering: deciding what goes in the model's working memory and what to leave out.",
            "learnModuleKeys": [
              "contexteng"
            ],
            "newCards": 20,
            "reviewTarget": "Clear all due first, ~18 min."
          },
          {
            "day": 22,
            "label": "Thu",
            "activity": "Review-only across prompting and context.",
            "learnModuleKeys": [],
            "newCards": 0,
            "reviewTarget": "Clear all due, ~20 min."
          },
          {
            "day": 23,
            "label": "Fri",
            "activity": "Learn structured output and tool calling: how the model proposes an action in JSON and your code executes it.",
            "learnModuleKeys": [
              "toolcalling"
            ],
            "newCards": 20,
            "reviewTarget": "Clear all due first, ~18 min."
          },
          {
            "day": 24,
            "label": "Sat",
            "activity": "Review-only across the week.",
            "learnModuleKeys": [],
            "newCards": 0,
            "reviewTarget": "Clear all due, ~20 min."
          }
        ]
      },
      {
        "week": 5,
        "theme": "Working with models: RAG, fine-tuning, evals + Section 3 checkpoint",
        "days": [
          {
            "day": 25,
            "label": "Mon",
            "activity": "Learn retrieval-augmented generation: feeding the model relevant documents at question time so answers are grounded and cited.",
            "learnModuleKeys": [
              "rag"
            ],
            "newCards": 22,
            "reviewTarget": "Clear all due first, ~18 min."
          },
          {
            "day": 26,
            "label": "Tue",
            "activity": "Review-only. Trace a full RAG pipeline end to end from the cards.",
            "learnModuleKeys": [],
            "newCards": 0,
            "reviewTarget": "Clear all due, ~20 min."
          },
          {
            "day": 27,
            "label": "Wed",
            "activity": "Learn fine-tuning and adaptation: changing behavior or format with examples, and why it can't reliably add fresh facts.",
            "learnModuleKeys": [
              "finetuning"
            ],
            "newCards": 22,
            "reviewTarget": "Clear all due first, ~18 min."
          },
          {
            "day": 28,
            "label": "Thu",
            "activity": "Learn evaluation and evals: telling a model that sounds smart from one that's right, using benchmarks, eval sets, human review, and model-as-judge.",
            "learnModuleKeys": [
              "eval"
            ],
            "newCards": 22,
            "reviewTarget": "Clear all due first, ~18 min."
          },
          {
            "day": 29,
            "label": "Fri",
            "activity": "Review-only. Drill across all six Section 3 modules, including the advanced cards.",
            "learnModuleKeys": [],
            "newCards": 0,
            "reviewTarget": "Clear all due plus drill, ~25 min."
          },
          {
            "day": 30,
            "label": "Sat",
            "activity": "Take the Section 3 test, covering prompting through evals.",
            "learnModuleKeys": [],
            "newCards": 0,
            "reviewTarget": "Clear all due, ~12 min.",
            "sectionTestId": "sec3"
          }
        ]
      },
      {
        "week": 6,
        "theme": "Systems & agents: agents, multi-agent, multimodal",
        "days": [
          {
            "day": 31,
            "label": "Mon",
            "activity": "Remediate any Section 3 gaps, then learn agents, tools, and MCP: where a model stops generating text and takes actions in a loop.",
            "learnModuleKeys": [
              "agents"
            ],
            "newCards": 22,
            "reviewTarget": "Clear all due first, ~18 min."
          },
          {
            "day": 32,
            "label": "Tue",
            "activity": "Review-only. Trace an agent loop step by step.",
            "learnModuleKeys": [],
            "newCards": 0,
            "reviewTarget": "Clear all due, ~20 min."
          },
          {
            "day": 33,
            "label": "Wed",
            "activity": "Learn multi-agent systems: several specialized agents that divide, hand off, debate, or check each other, and the cost and latency they add.",
            "learnModuleKeys": [
              "multiagent"
            ],
            "newCards": 20,
            "reviewTarget": "Clear all due first, ~18 min."
          },
          {
            "day": 34,
            "label": "Thu",
            "activity": "Review-only across agents and multi-agent.",
            "learnModuleKeys": [],
            "newCards": 0,
            "reviewTarget": "Clear all due, ~20 min."
          },
          {
            "day": 35,
            "label": "Fri",
            "activity": "Learn multimodal models: how pixels and sound become tokens, and where vision and audio break.",
            "learnModuleKeys": [
              "multimodal"
            ],
            "newCards": 20,
            "reviewTarget": "Clear all due first, ~18 min."
          },
          {
            "day": 36,
            "label": "Sat",
            "activity": "Review-only across the week.",
            "learnModuleKeys": [],
            "newCards": 0,
            "reviewTarget": "Clear all due, ~20 min."
          }
        ]
      },
      {
        "week": 7,
        "theme": "Systems & agents: serving, economics, reliability + Section 4 checkpoint",
        "days": [
          {
            "day": 37,
            "label": "Mon",
            "activity": "Learn latency, throughput, and serving: time-to-first-token, streaming, prefill versus decode, and the GPU realities behind every call.",
            "learnModuleKeys": [
              "serving"
            ],
            "newCards": 20,
            "reviewTarget": "Clear all due first, ~18 min."
          },
          {
            "day": 38,
            "label": "Tue",
            "activity": "Learn cost and token economics: input and output pricing, estimating spend, and levers like caching and retrieval.",
            "learnModuleKeys": [
              "economics"
            ],
            "newCards": 20,
            "reviewTarget": "Clear all due first, ~18 min."
          },
          {
            "day": 39,
            "label": "Wed",
            "activity": "Review-only. Work the cost math and the serving tradeoffs by hand.",
            "learnModuleKeys": [],
            "newCards": 0,
            "reviewTarget": "Clear all due, ~22 min."
          },
          {
            "day": 40,
            "label": "Thu",
            "activity": "Learn reliability, guardrails, and observability: designing around non-determinism with retries, fallbacks, logging, and monitoring.",
            "learnModuleKeys": [
              "reliability"
            ],
            "newCards": 20,
            "reviewTarget": "Clear all due first, ~18 min."
          },
          {
            "day": 41,
            "label": "Fri",
            "activity": "Review-only. Drill across all six Section 4 modules.",
            "learnModuleKeys": [],
            "newCards": 0,
            "reviewTarget": "Clear all due plus drill, ~25 min."
          },
          {
            "day": 42,
            "label": "Sat",
            "activity": "Take the Section 4 test, covering agents through reliability.",
            "learnModuleKeys": [],
            "newCards": 0,
            "reviewTarget": "Clear all due, ~12 min.",
            "sectionTestId": "sec4"
          }
        ]
      },
      {
        "week": 8,
        "theme": "Judgment & frontier: safety, reasoning, landscape",
        "days": [
          {
            "day": 43,
            "label": "Mon",
            "activity": "Remediate any Section 4 gaps, then learn safety and failure modes: hallucination, hidden malicious instructions, jailbreaks, bias, and practical defenses.",
            "learnModuleKeys": [
              "safety"
            ],
            "newCards": 20,
            "reviewTarget": "Clear all due first, ~18 min."
          },
          {
            "day": 44,
            "label": "Tue",
            "activity": "Review-only. Drill each failure mode against its defense.",
            "learnModuleKeys": [],
            "newCards": 0,
            "reviewTarget": "Clear all due, ~20 min."
          },
          {
            "day": 45,
            "label": "Wed",
            "activity": "Learn reasoning and test-time compute: models that think before answering, chain-of-thought versus trained reasoning, and what it costs.",
            "learnModuleKeys": [
              "reasoning"
            ],
            "newCards": 20,
            "reviewTarget": "Clear all due first, ~18 min."
          },
          {
            "day": 46,
            "label": "Thu",
            "activity": "Review-only across safety and reasoning.",
            "learnModuleKeys": [],
            "newCards": 0,
            "reviewTarget": "Clear all due, ~20 min."
          },
          {
            "day": 47,
            "label": "Fri",
            "activity": "Learn the model landscape: open versus closed, size, cost, speed, context, and how to actually pick one.",
            "learnModuleKeys": [
              "landscape"
            ],
            "newCards": 20,
            "reviewTarget": "Clear all due first, ~18 min."
          },
          {
            "day": 48,
            "label": "Sat",
            "activity": "Review-only across the week.",
            "learnModuleKeys": [],
            "newCards": 0,
            "reviewTarget": "Clear all due, ~20 min."
          }
        ]
      },
      {
        "week": 9,
        "theme": "Judgment & frontier: privacy, frontier + Section 5 checkpoint",
        "days": [
          {
            "day": 49,
            "label": "Mon",
            "activity": "Learn data, privacy, and compliance: whether inputs train the model, retention, the real risks, and safeguards like redaction.",
            "learnModuleKeys": [
              "privacy"
            ],
            "newCards": 20,
            "reviewTarget": "Clear all due first, ~18 min."
          },
          {
            "day": 50,
            "label": "Tue",
            "activity": "Learn where it's heading: longer context, stronger reasoning, more senses, cheaper models, and how to separate trend from hype.",
            "learnModuleKeys": [
              "frontier"
            ],
            "newCards": 20,
            "reviewTarget": "Clear all due first, ~18 min."
          },
          {
            "day": 51,
            "label": "Wed",
            "activity": "Review-only. Drill privacy safeguards and trend-versus-hype judgment.",
            "learnModuleKeys": [],
            "newCards": 0,
            "reviewTarget": "Clear all due, ~22 min."
          },
          {
            "day": 52,
            "label": "Thu",
            "activity": "Review-only. Drill across all five Section 5 modules, including advanced cards.",
            "learnModuleKeys": [],
            "newCards": 0,
            "reviewTarget": "Clear all due plus drill, ~25 min."
          },
          {
            "day": 53,
            "label": "Fri",
            "activity": "Take the Section 5 test, covering safety through frontier.",
            "learnModuleKeys": [],
            "newCards": 0,
            "reviewTarget": "Clear all due, ~12 min.",
            "sectionTestId": "sec5"
          },
          {
            "day": 54,
            "label": "Sat",
            "activity": "Remediate. Restudy any Section 5 topics you missed.",
            "learnModuleKeys": [],
            "newCards": 0,
            "reviewTarget": "Clear all due plus failed-topic restudy, ~20 min."
          }
        ]
      },
      {
        "week": 10,
        "theme": "Mastery consolidation: cross-tier synthesis and retakes",
        "days": [
          {
            "day": 55,
            "label": "Mon",
            "activity": "Full-deck review weighted toward advanced-difficulty cards across every tier.",
            "learnModuleKeys": [],
            "newCards": 0,
            "reviewTarget": "Clear all due plus advanced-card drill, ~30 min."
          },
          {
            "day": 56,
            "label": "Tue",
            "activity": "Cross-tier synthesis. Reason through model choice and the cost, latency, and quality tradeoff using economics, serving, landscape, and reasoning.",
            "learnModuleKeys": [],
            "newCards": 0,
            "reviewTarget": "Clear all due plus scenario drill, ~30 min."
          },
          {
            "day": 57,
            "label": "Wed",
            "activity": "Retake the Section 1 test. The oldest material decays most, so prove the foundations still hold.",
            "learnModuleKeys": [],
            "newCards": 0,
            "reviewTarget": "Clear all due, ~15 min.",
            "sectionTestId": "sec1"
          },
          {
            "day": 58,
            "label": "Thu",
            "activity": "Failure-mode and judgment synthesis. Reason through real scenarios using safety, reliability, and privacy together.",
            "learnModuleKeys": [],
            "newCards": 0,
            "reviewTarget": "Clear all due plus scenario drill, ~30 min."
          },
          {
            "day": 59,
            "label": "Fri",
            "activity": "Retake the Section 4 test. Confirm the systems-and-agents tier is solid under time pressure.",
            "learnModuleKeys": [],
            "newCards": 0,
            "reviewTarget": "Clear all due, ~15 min.",
            "sectionTestId": "sec4"
          },
          {
            "day": 60,
            "label": "Sat",
            "activity": "Capstone review. Light session, clear remaining reviews, and confirm the whole deck is in steady-state spaced repetition.",
            "learnModuleKeys": [],
            "newCards": 0,
            "reviewTarget": "Clear all due, ~20 min."
          }
        ]
      }
    ],
    "rationale": "Scope: expert means the whole curriculum, so all 24 modules across the four tiers are included, and every section test includes advanced-difficulty cards, not just core and intermediate. Nothing is skipped.\n\nPace: 500 cards is a lot to move into long-term memory, and spaced-repetition reviews grow as the deck grows, so the schedule alternates a 'learn a new module' day with a review-only day. That keeps each session near 45 minutes even in later weeks, when reviews alone run past 20 minutes. New cards are never taken every single day; the off days exist to absorb the rising review load and let dense ideas settle. Ten weeks is the honest number at six days a week. Promising faster would mean either cramming new cards on top of heavy reviews or letting reviews lapse, and both break retention.\n\nSection structure: the five sections mirror the deck's four tiers, with Tier 1 split into two sections (representation and architecture, then training and inference) because it is the largest and conceptually hardest tier and deserves two checkpoints rather than one. That puts a test roughly every week and a half, often enough to catch gaps before they compound. The hardest material, the transformer block and attention, gets a full two weeks up front, while the lighter Tier 3 and Tier 4 modules move a little faster because they build on everything before them.\n\nTests and bar: the pass bar is 80 percent, and 82 on the judgment section, because expert means reasoning rather than partial recall. Each section's remediation names the specific modules and the specific confusions that usually cause a miss. The final week is consolidation: cross-tier synthesis on the judgment calls that matter (model choice; cost, latency, and quality; failure-mode defenses) plus retakes of the oldest section tests, since that material has had the longest to decay."
  }
};

// A schedule day with its absolute 1-based index across the whole plan, so the
// per-level `day` numbering differences do not matter at runtime.
export interface FlatDay extends ScheduleDay {
  index: number; // 1-based across all weeks
  week: number;
  weekTheme: string;
}

export function flattenSchedule(plan: LevelPlan): FlatDay[] {
  const out: FlatDay[] = [];
  let i = 1;
  for (const w of plan.schedule) {
    for (const d of w.days) {
      out.push({ ...d, index: i, week: w.week, weekTheme: w.theme });
      i += 1;
    }
  }
  return out;
}

export function totalStudyDays(plan: LevelPlan): number {
  return plan.schedule.reduce((n, w) => n + w.days.length, 0);
}

export function sectionById(plan: LevelPlan, id: string): LevelSection | undefined {
  return plan.sections.find((s) => s.id === id);
}

// The section a given module belongs to in this plan (first match).
export function sectionForModule(plan: LevelPlan, moduleKey: string): LevelSection | undefined {
  return plan.sections.find((s) => s.moduleKeys.includes(moduleKey));
}
