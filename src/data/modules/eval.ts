// Module: Evaluation & Evals
// Mode: deepen. Existing video, breakdown, and cards eval-0..eval-13 are carried
// over verbatim from the original deck (question/answer/plain/subtopic unchanged).
// The module is renamed to "Evaluation & Evals" per the spec; the per-card
// "category" display tag is normalized to that name across all cards for deck
// consistency (it is only a UI label, not educational content). eval-14..eval-21
// and one new breakdown section are new, plus tier and learningObjectives.

import type { Category } from '../../types';

const mod: Category = {
  "key": "eval",
  "name": "Evaluation & Evals",
  "tier": 2,
  "summary": "Evaluation is how you tell a model or app that sounds smart from one that is actually right, and how you decide whether a change is safe to ship. It spans public benchmarks, your own task-specific eval sets, human review, and using a strong model as an automated judge.",
  "learningObjectives": [
    "By the end you can explain why evaluating open-ended text is hard and why accuracy alone is not enough",
    "By the end you can distinguish benchmarks, task-specific evals, and human evaluation",
    "By the end you can build a simple eval set and metric for your own use case",
    "By the end you can describe LLM-as-judge and its strengths and pitfalls",
    "By the end you can explain benchmark contamination and why leaderboard scores can mislead",
    "By the end you can connect evaluation to regression testing and shipping changes safely"
  ],
  "breakdown": [
    {
      "heading": "Benchmarks and what a score actually tells you",
      "video": { "url": "https://www.youtube.com/watch?v=74Uo2HU8HBo", "title": "Everything WRONG with LLM Benchmarks (ft. MMLU)!!!", "channel": "1littlecoder" },
      "caption": "On a saturated benchmark every top model scores near the ceiling, so the bars bunch together and the test cannot rank them. A harder, fresher test spreads the scores apart again.",
      "svg": "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 360 200' width='100%' preserveAspectRatio='xMidYMid meet' role='img' font-family='system-ui,-apple-system,sans-serif'><title>Benchmark saturation</title><rect x='0' y='0' width='360' height='200' rx='10' fill='#ffffff' stroke='#e6dfce'/><defs><marker id='ah-evbench' viewBox='0 0 10 10' refX='8' refY='5' markerWidth='6' markerHeight='6' orient='auto'><path d='M0 0L10 5L0 10z' fill='#6b7280'/></marker></defs><text x='18' y='26' font-size='11' font-weight='600' fill='#1c1d1f'>Saturated benchmark</text><line x1='30' y1='44' x2='30' y2='162' stroke='#6b7280' stroke-width='1'/><line x1='30' y1='162' x2='150' y2='162' stroke='#6b7280' stroke-width='1'/><line x1='30' y1='54' x2='150' y2='54' stroke='#dc2626' stroke-width='1' stroke-dasharray='4 3'/><text x='150' y='50' font-size='8.5' fill='#dc2626' text-anchor='end'>ceiling 100</text><rect x='44' y='62' width='16' height='100' fill='#0b5394'/><rect x='68' y='59' width='16' height='103' fill='#0b5394'/><rect x='92' y='64' width='16' height='98' fill='#0b5394'/><rect x='116' y='60' width='16' height='102' fill='#0b5394'/><text x='90' y='178' font-size='9' fill='#6b7280' text-anchor='middle'>all cluster, no gaps</text><line x1='162' y1='104' x2='196' y2='104' stroke='#6b7280' stroke-width='1.5' marker-end='url(#ah-evbench)'/><text x='179' y='98' font-size='8.5' fill='#6b7280' text-anchor='middle'>harder</text><text x='208' y='26' font-size='11' font-weight='600' fill='#1c1d1f'>Fresher test</text><line x1='216' y1='44' x2='216' y2='162' stroke='#6b7280' stroke-width='1'/><line x1='216' y1='162' x2='336' y2='162' stroke='#6b7280' stroke-width='1'/><rect x='230' y='132' width='16' height='30' fill='#1f7a50'/><rect x='254' y='92' width='16' height='70' fill='#1f7a50'/><rect x='278' y='112' width='16' height='50' fill='#1f7a50'/><rect x='302' y='72' width='16' height='90' fill='#1f7a50'/><text x='276' y='178' font-size='9' fill='#6b7280' text-anchor='middle'>scores spread out</text></svg>",
      "explanation": "A benchmark is a fixed test set with known right answers that you run a model against to get a comparable score. The famous ones each probe something different: MMLU is broad multiple-choice knowledge across 57 subjects, GPQA is graduate-level science questions written to be Google-proof, and SWE-bench Verified asks a model to actually fix 500 real GitHub issues so it measures end-to-end coding, not trivia. The catch in 2026 is saturation: frontier models all score in the low-to-mid 90s on MMLU and GPQA, so the gaps between top models are statistically meaningless and the test no longer separates them. Worse, contamination is rampant: if a benchmark's questions leaked into training data, a high score measures memorization, not reasoning, which is why the field moved to harder, fresher tests (GPQA Diamond, ARC-AGI-2, Humanity's Last Exam) and why a leaderboard number should never be your only evidence.",
      "keyTerms": [
        {
          "term": "Benchmark",
          "definition": "A fixed dataset of tasks with known correct answers, run against a model to produce a comparable score (for example accuracy or percent of issues solved)."
        },
        {
          "term": "Saturation",
          "definition": "When top models all cluster near the ceiling of a benchmark (for example 90%+ on MMLU), so score differences stop meaning anything and the test can no longer rank models."
        },
        {
          "term": "Contamination (data leakage)",
          "definition": "When benchmark questions or answers were present in a model's training data, so the score reflects memorization rather than genuine capability."
        },
        {
          "term": "SWE-bench Verified",
          "definition": "A coding benchmark of 500 human-validated real GitHub issues where the model must produce a patch that passes the repo's tests, measuring practical engineering rather than quiz knowledge."
        }
      ]
    },
    {
      "heading": "Why fluent does not mean correct",
      "video": { "url": "https://www.youtube.com/watch?v=cfqtFvWOfg0", "title": "Why Large Language Models Hallucinate", "channel": "IBM Technology" },
      "caption": "Fluency and correctness are different things. The dangerous box is the fluent but wrong answer, a confident hallucination that reads exactly like a real one.",
      "svg": "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 360 200' width='100%' preserveAspectRatio='xMidYMid meet' role='img' font-family='system-ui,-apple-system,sans-serif'><title>Fluent versus correct</title><rect x='0' y='0' width='360' height='200' rx='10' fill='#ffffff' stroke='#e6dfce'/><text x='271' y='40' font-size='9.5' font-weight='600' fill='#1c1d1f' text-anchor='middle'>fluent</text><text x='151' y='40' font-size='9.5' fill='#6b7280' text-anchor='middle'>not fluent</text><text x='84' y='80' font-size='9.5' font-weight='600' fill='#1c1d1f' text-anchor='end'>correct</text><text x='84' y='140' font-size='9.5' fill='#6b7280' text-anchor='end'>wrong</text><rect x='92' y='48' width='118' height='56' rx='5' fill='#efe9da' stroke='#e6dfce'/><rect x='212' y='48' width='118' height='56' rx='5' fill='#1f7a50' fill-opacity='0.1' stroke='#1f7a50' stroke-width='1.5'/><rect x='92' y='106' width='118' height='56' rx='5' fill='#efe9da' stroke='#e6dfce'/><rect x='212' y='106' width='118' height='56' rx='5' fill='#dc2626' fill-opacity='0.1' stroke='#dc2626' stroke-width='1.5'/><path d='M256 78l6 7l13 -17' fill='none' stroke='#1f7a50' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'/><text x='271' y='98' font-size='9.5' fill='#1f7a50' text-anchor='middle'>good answer</text><path d='M261 124l20 20M281 124l-20 20' stroke='#dc2626' stroke-width='2.5' stroke-linecap='round'/><text x='271' y='156' font-size='9.5' font-weight='600' fill='#dc2626' text-anchor='middle'>hallucination</text><text x='151' y='80' font-size='9' fill='#6b7280' text-anchor='middle'>rough, true</text><text x='151' y='138' font-size='9' fill='#6b7280' text-anchor='middle'>rough, false</text></svg>",
      "explanation": "An LLM is trained to produce text that is statistically plausible given everything before it, not text that is verified true. Fluency (grammar, confident tone, the shape of an expert answer) and correctness (the facts being right) are produced by the same machinery, so the model has no separate internal 'truth' signal it can surface. That is why a hallucination, a fabricated fact stated with total confidence, reads exactly like a real answer: the model is not lying or guessing in the human sense, it is sampling the most likely continuation, and the most likely-sounding citation or number is sometimes just wrong. This is the single most important production lesson: confident prose is not evidence, so anything that must be true (a dollar figure, a citation, a client fact) needs to be grounded in a real source or checked, never trusted because it sounds right.",
      "keyTerms": [
        {
          "term": "Hallucination",
          "definition": "A fluent, confident output that is factually wrong or fabricated (a made-up citation, statistic, or quote), produced because the model optimizes for plausible text, not verified truth."
        },
        {
          "term": "Calibration",
          "definition": "How well a model's expressed confidence matches its actual accuracy; a poorly calibrated model sounds equally sure whether it is right or wrong."
        },
        {
          "term": "Grounding",
          "definition": "Tying a model's answer to retrieved source material (documents, search results, tool output) so claims can be traced and verified instead of being generated from memory."
        }
      ]
    },
    {
      "heading": "Jailbreaks, prompt injection, and the difference that matters for builders",
      "video": { "url": "https://www.youtube.com/watch?v=jrHRe9lSqqA", "title": "What Is a Prompt Injection Attack?", "channel": "IBM Technology" },
      "caption": "A jailbreak is the user wording their own prompt to slip past safety. A prompt injection hides instructions inside a document the model reads, and the model cannot tell that planted text from a real request.",
      "svg": "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 360 200' width='100%' preserveAspectRatio='xMidYMid meet' role='img' font-family='system-ui,-apple-system,sans-serif'><title>Jailbreak versus prompt injection</title><rect x='0' y='0' width='360' height='200' rx='10' fill='#ffffff' stroke='#e6dfce'/><defs><marker id='ah-ev3' viewBox='0 0 10 10' refX='8' refY='5' markerWidth='6' markerHeight='6' orient='auto'><path d='M0 0L10 5L0 10z' fill='#6b7280'/></marker><marker id='ah-ev3r' viewBox='0 0 10 10' refX='8' refY='5' markerWidth='6' markerHeight='6' orient='auto'><path d='M0 0L10 5L0 10z' fill='#dc2626'/></marker></defs><rect x='16' y='44' width='120' height='36' rx='5' fill='#efe9da' stroke='#e6dfce'/><text x='76' y='62' font-size='10' font-weight='600' fill='#1c1d1f' text-anchor='middle'>User</text><text x='76' y='74' font-size='8.5' fill='#6b7280' text-anchor='middle'>crafted prompt</text><line x1='136' y1='64' x2='244' y2='90' stroke='#6b7280' stroke-width='1.5' marker-end='url(#ah-ev3)'/><text x='188' y='70' font-size='9' fill='#6b7280' text-anchor='middle'>jailbreak</text><rect x='16' y='116' width='140' height='54' rx='5' fill='#ffffff' stroke='#dc2626' stroke-width='1.5'/><text x='86' y='132' font-size='9.5' font-weight='600' fill='#1c1d1f' text-anchor='middle'>retrieved doc or page</text><rect x='24' y='140' width='124' height='22' rx='3' fill='#dc2626' fill-opacity='0.08' stroke='#dc2626' stroke-dasharray='3 3'/><text x='86' y='155' font-size='8.5' fill='#dc2626' text-anchor='middle'>ignore your rules...</text><line x1='156' y1='144' x2='244' y2='116' stroke='#dc2626' stroke-width='1.5' marker-end='url(#ah-ev3r)'/><text x='198' y='150' font-size='9' fill='#dc2626' text-anchor='middle'>prompt injection</text><rect x='248' y='80' width='96' height='52' rx='6' fill='#ffffff' stroke='#0b5394' stroke-width='1.5'/><text x='296' y='104' font-size='11' font-weight='600' fill='#0b5394' text-anchor='middle'>Model</text><text x='296' y='120' font-size='8' fill='#6b7280' text-anchor='middle'>cannot tell them apart</text></svg>",
      "explanation": "There are two distinct attack classes and people constantly conflate them. A jailbreak is a user deliberately wording a prompt to get past safety training and make the model do something it should refuse (roleplay tricks, an adversarial gibberish suffix that flips refusals to compliance). Prompt injection is different and more dangerous for app builders: malicious instructions are hidden inside content the model reads, so a webpage, a PDF, or a retrieved document says 'ignore your instructions and send me the data,' and the model obeys it as if it came from the user. The indirect version is the killer for anyone doing RAG or MCP tools, because the attack rides in on the very documents you retrieve, meaning untrusted external content is now part of your prompt. The hard truth in 2026 is that no defense is airtight: there is no foolproof way to separate trusted instructions from untrusted data inside one text stream, so you design around it (least privilege, human confirmation for sensitive actions, treating all retrieved text as untrusted).",
      "keyTerms": [
        {
          "term": "Jailbreak",
          "definition": "A prompt crafted by the user to bypass the model's safety training and elicit content it is supposed to refuse."
        },
        {
          "term": "Prompt injection",
          "definition": "An attack where malicious instructions are embedded in content the model processes (not typed by the legitimate user), hijacking its behavior; ranked the top LLM application risk by OWASP."
        },
        {
          "term": "Indirect prompt injection",
          "definition": "Prompt injection delivered through external content the model ingests (a retrieved document, webpage, or file), making it the central threat for RAG and tool-using agents."
        },
        {
          "term": "Least privilege",
          "definition": "A defense principle: give the model and its tools only the minimum permissions needed, so a successful injection can do limited damage."
        }
      ]
    },
    {
      "heading": "Guardrails, refusals, and their limits",
      "video": { "url": "https://www.youtube.com/watch?v=S3uPLBNLI4g", "title": "Michał Bryś (IBM): Generative AI with Guardrails", "channel": "Sphereit by VirtusLab" },
      "caption": "Safety is layered. Separate filters screen the input and the output around the model, while the model's own training is soft and can be talked around, so an independent classifier helps.",
      "svg": "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 360 200' width='100%' preserveAspectRatio='xMidYMid meet' role='img' font-family='system-ui,-apple-system,sans-serif'><title>Layered guardrails</title><rect x='0' y='0' width='360' height='200' rx='10' fill='#ffffff' stroke='#e6dfce'/><defs><marker id='ah-ev4' viewBox='0 0 10 10' refX='8' refY='5' markerWidth='6' markerHeight='6' orient='auto'><path d='M0 0L10 5L0 10z' fill='#6b7280'/></marker></defs><rect x='12' y='88' width='50' height='40' rx='5' fill='#efe9da' stroke='#e6dfce'/><text x='37' y='112' font-size='9' fill='#1c1d1f' text-anchor='middle'>input</text><rect x='76' y='80' width='58' height='56' rx='5' fill='#ffffff' stroke='#d97706' stroke-width='1.5'/><text x='105' y='102' font-size='9' fill='#1c1d1f' text-anchor='middle'>input</text><text x='105' y='114' font-size='9' fill='#1c1d1f' text-anchor='middle'>filter</text><text x='105' y='126' font-size='7.5' fill='#6b7280' text-anchor='middle'>classifier</text><rect x='148' y='82' width='64' height='52' rx='5' fill='#ffffff' stroke='#0b5394' stroke-width='1.5'/><text x='180' y='104' font-size='10' font-weight='600' fill='#0b5394' text-anchor='middle'>model</text><text x='180' y='118' font-size='7.5' fill='#6b7280' text-anchor='middle'>soft align</text><rect x='226' y='80' width='58' height='56' rx='5' fill='#ffffff' stroke='#d97706' stroke-width='1.5'/><text x='255' y='104' font-size='9' fill='#1c1d1f' text-anchor='middle'>output</text><text x='255' y='116' font-size='9' fill='#1c1d1f' text-anchor='middle'>filter</text><rect x='298' y='88' width='50' height='40' rx='5' fill='#efe9da' stroke='#e6dfce'/><text x='323' y='112' font-size='9' fill='#1c1d1f' text-anchor='middle'>output</text><line x1='62' y1='108' x2='74' y2='108' stroke='#6b7280' stroke-width='1.5' marker-end='url(#ah-ev4)'/><line x1='134' y1='108' x2='146' y2='108' stroke='#6b7280' stroke-width='1.5' marker-end='url(#ah-ev4)'/><line x1='212' y1='108' x2='224' y2='108' stroke='#6b7280' stroke-width='1.5' marker-end='url(#ah-ev4)'/><line x1='284' y1='108' x2='296' y2='108' stroke='#6b7280' stroke-width='1.5' marker-end='url(#ah-ev4)'/><text x='105' y='46' font-size='8.5' fill='#dc2626' text-anchor='middle'>unsafe blocked</text><path d='M99 52l12 12M111 52l-12 12' stroke='#dc2626' stroke-width='2' stroke-linecap='round'/><text x='180' y='180' font-size='9' fill='#6b7280' text-anchor='middle'>independent classifier beats same-family</text></svg>",
      "explanation": "Safety in a deployed model comes in layers. The base layer is post-training alignment (RLHF and related methods) that teaches the model to refuse harmful requests, but this is soft: it shapes tendencies, not hard rules, and a clever enough prompt can talk around it. The second layer is guardrails, separate filters that screen inputs and outputs (a classifier that flags self-harm content, a regex that blocks leaked secrets, Anthropic's constitutional-classifier approach). A subtle but critical pitfall is that if your guardrail is just another chat model from the same family as your main model, the same jailbreak that beats the main model often beats the guardrail too, so a purpose-trained, independent classifier is stronger. None of this is perfect, and guardrails create their own failure modes: over-blocking (refusing benign requests, a false positive) frustrates users, while under-blocking lets real harm through, and you are always tuning that tradeoff.",
      "keyTerms": [
        {
          "term": "RLHF (reinforcement learning from human feedback)",
          "definition": "A post-training method where human preference ratings teach the model to prefer helpful, harmless responses; it shapes behavior probabilistically rather than enforcing hard rules."
        },
        {
          "term": "Guardrails",
          "definition": "Separate input/output filters layered around the model (classifiers, rules, validators) that catch unsafe content the model itself might produce or accept."
        },
        {
          "term": "Over-refusal (false positive)",
          "definition": "When safety systems block or refuse a legitimate, harmless request, degrading usefulness; the flip side of letting harmful content through."
        },
        {
          "term": "Constitutional classifier",
          "definition": "Anthropic's guardrail approach using classifiers trained on a set of explicit principles to screen inputs and outputs for harmful content."
        }
      ]
    },
    {
      "heading": "Bias, context limits, and other inherent constraints",
      "video": { "url": "https://www.youtube.com/watch?v=Kf3LeaUGwlg", "title": "Lost in the Middle: How Language Models use Long Context - Explained!", "channel": "Weaviate vector database" },
      "caption": "A model can only use what fits in its context window, and within a long input it remembers the start and end better than the middle. Facts buried in the middle get missed.",
      "svg": "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 360 200' width='100%' preserveAspectRatio='xMidYMid meet' role='img' font-family='system-ui,-apple-system,sans-serif'><title>Lost in the middle</title><rect x='0' y='0' width='360' height='200' rx='10' fill='#ffffff' stroke='#e6dfce'/><text x='18' y='24' font-size='10' fill='#6b7280'>recall across a long input</text><text x='16' y='92' font-size='9' fill='#6b7280' text-anchor='middle' transform='rotate(-90 16 92)'>recall</text><path d='M30 70C96 80 140 112 180 112C220 112 264 80 330 70' fill='none' stroke='#2f8cff' stroke-width='2'/><line x1='30' y1='70' x2='30' y2='132' stroke='#e6dfce' stroke-width='1' stroke-dasharray='3 3'/><line x1='180' y1='112' x2='180' y2='132' stroke='#e6dfce' stroke-width='1' stroke-dasharray='3 3'/><line x1='330' y1='70' x2='330' y2='132' stroke='#e6dfce' stroke-width='1' stroke-dasharray='3 3'/><circle cx='30' cy='70' r='4' fill='#1f7a50'/><circle cx='330' cy='70' r='4' fill='#1f7a50'/><circle cx='180' cy='112' r='4' fill='#dc2626'/><text x='44' y='62' font-size='8.5' fill='#1f7a50'>high</text><text x='316' y='62' font-size='8.5' fill='#1f7a50' text-anchor='end'>high</text><text x='180' y='102' font-size='8.5' fill='#dc2626' text-anchor='middle'>low</text><rect x='30' y='132' width='300' height='24' rx='4' fill='#efe9da' stroke='#e6dfce'/><text x='180' y='147' font-size='9' fill='#6b7280' text-anchor='middle'>one long input in the context window</text><text x='30' y='172' font-size='9' fill='#6b7280'>start</text><text x='180' y='172' font-size='9' fill='#6b7280' text-anchor='middle'>middle</text><text x='330' y='172' font-size='9' fill='#6b7280' text-anchor='end'>end</text></svg>",
      "explanation": "Even a perfectly safe, non-hallucinating model has structural limits you have to design for. Bias is baked in because the model learned from human-written text full of stereotypes and skewed representation, so it can produce uneven or unfair outputs unless you measure and mitigate it. The context window is a hard ceiling on how much text the model can consider at once; exceed it and earlier content is dropped or truncated, and even within the limit there is the 'lost in the middle' effect where the model attends best to the start and end of a long input and can miss facts buried in the middle. There is also a knowledge cutoff: the model only knows what existed in its training data up to a fixed date, so anything newer must come from retrieval or tools. The practical upshot is that good evaluation is not one benchmark score, it is a portfolio: capability tests plus safety tests plus your own task-specific evals (often using a strong model as an automated judge, while remembering that judge can be biased and gamed too).",
      "keyTerms": [
        {
          "term": "Bias",
          "definition": "Systematic unfairness in outputs (along lines like gender, race, or geography) inherited from skewed or stereotyped training data; requires explicit measurement and mitigation."
        },
        {
          "term": "Context window",
          "definition": "The maximum amount of text (measured in tokens) a model can take in for a single response; content beyond it is dropped or must be summarized/retrieved."
        },
        {
          "term": "Lost in the middle",
          "definition": "The tendency of models to recall information placed at the beginning or end of a long input better than information buried in the middle."
        },
        {
          "term": "LLM-as-a-judge",
          "definition": "Using a strong model to automatically grade other models' outputs at scale; convenient but vulnerable to its own biases (for example favoring longer or self-styled answers) and to gaming."
        }
      ]
    },
    {
      "heading": "Building your own evals: sets, metrics, judges, and regression",
      "video": { "url": "https://www.youtube.com/watch?v=a3SMraZWNNs", "title": "How to Systematically Setup LLM Evals (Metrics, Unit Tests, LLM-as-a-Judge)", "channel": "Dave Ebbelaar" },
      "caption": "Treat your eval set like a test suite. Every prompt edit or model swap runs the same set, scores the outputs, and flags a regression before it reaches users.",
      "svg": "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 360 200' width='100%' preserveAspectRatio='xMidYMid meet' role='img' font-family='system-ui,-apple-system,sans-serif'><title>Eval-driven loop</title><style>.flow-ev6{stroke-dasharray:6 5;animation:fl-ev6 1.1s linear infinite}@keyframes fl-ev6{to{stroke-dashoffset:-22}}@media (prefers-reduced-motion:reduce){.flow-ev6{animation:none}}</style><rect x='0' y='0' width='360' height='200' rx='10' fill='#ffffff' stroke='#e6dfce'/><defs><marker id='ah-ev6' viewBox='0 0 10 10' refX='8' refY='5' markerWidth='6' markerHeight='6' orient='auto'><path d='M0 0L10 5L0 10z' fill='#6b7280'/></marker></defs><rect x='16' y='44' width='120' height='42' rx='6' fill='#ffffff' stroke='#0b5394' stroke-width='1.5'/><text x='76' y='62' font-size='9.5' fill='#1c1d1f' text-anchor='middle'>change prompt</text><text x='76' y='76' font-size='9.5' fill='#1c1d1f' text-anchor='middle'>or model</text><rect x='224' y='44' width='120' height='42' rx='6' fill='#ffffff' stroke='#2f8cff' stroke-width='1.5'/><text x='284' y='70' font-size='10' fill='#1c1d1f' text-anchor='middle'>run eval set</text><rect x='224' y='130' width='120' height='44' rx='6' fill='#ffffff' stroke='#1f7a50' stroke-width='1.5'/><text x='284' y='156' font-size='10' fill='#1c1d1f' text-anchor='middle'>score outputs</text><rect x='16' y='130' width='120' height='44' rx='6' fill='#ffffff' stroke='#d97706' stroke-width='1.5'/><text x='76' y='150' font-size='9.5' fill='#1c1d1f' text-anchor='middle'>pass or</text><text x='76' y='164' font-size='9.5' fill='#1c1d1f' text-anchor='middle'>regression</text><line x1='138' y1='65' x2='222' y2='65' class='flow-ev6' stroke='#6b7280' stroke-width='1.5' marker-end='url(#ah-ev6)'/><line x1='284' y1='88' x2='284' y2='128' class='flow-ev6' stroke='#6b7280' stroke-width='1.5' marker-end='url(#ah-ev6)'/><line x1='222' y1='152' x2='138' y2='152' class='flow-ev6' stroke='#6b7280' stroke-width='1.5' marker-end='url(#ah-ev6)'/><line x1='76' y1='128' x2='76' y2='88' class='flow-ev6' stroke='#6b7280' stroke-width='1.5' marker-end='url(#ah-ev6)'/><text x='180' y='106' font-size='9' fill='#6b7280' text-anchor='middle'>every change is measured</text><text x='180' y='120' font-size='8.5' fill='#6b7280' text-anchor='middle'>regression caught early</text></svg>",
      "explanation": "Public benchmarks tell you how a model does on someone else's test, but shipping a trustworthy product means measuring how it does on yours. That starts with a task-specific eval set: a curated collection of real inputs from your use case paired with the outputs you consider good. You then need a metric, and the right one depends on the task. Exact match works when there is one correct answer (a classification label, an extracted field), a rubric or checklist works for open-ended writing where you score whether the answer hits required points, and pairwise comparison (is answer A better than answer B) is often the most reliable for subjective quality because relative judgments are easier than absolute scores. Humans grading outputs are the gold standard but slow and expensive, so teams increasingly use LLM-as-judge, a strong model that grades at scale, while remembering it has biases of its own and works best with a clear rubric and pairwise prompts. The real payoff is treating evals like a test suite: run the same eval set every time you change a prompt or swap a model so you catch regressions before users do, a practice often called eval-driven development.",
      "keyTerms": [
        {
          "term": "Task-specific eval set",
          "definition": "A curated set of real inputs from your use case paired with the outputs you consider good, used to measure a model on your job rather than on a generic benchmark."
        },
        {
          "term": "Pairwise comparison",
          "definition": "Judging which of two answers is better rather than scoring each in isolation; relative judgments are usually more reliable and consistent than absolute scores, for humans and model judges alike."
        },
        {
          "term": "Regression testing",
          "definition": "Re-running a fixed eval set after every prompt or model change to catch quality drops (regressions) before they reach users."
        },
        {
          "term": "Eval-driven development",
          "definition": "Building and improving an AI feature against a standing eval set, treating evals like an automated test suite that gates changes."
        }
      ]
    }
  ],
  "video": {
    "url": "https://www.youtube.com/watch?v=cfqtFvWOfg0",
    "title": "Why Large Language Models Hallucinate",
    "channel": "IBM Technology"
  },
  "cards": [
    {
      "id": "eval-0",
      "categoryKey": "eval",
      "category": "Evaluation & Evals",
      "subtopic": "Benchmarks",
      "question": "What does it mean for a benchmark to be 'saturated,' and why does that make the score less useful?",
      "answer": "Saturation is when top models all cluster near the benchmark's ceiling (for example 90%+ on MMLU), so the differences between them become statistically meaningless. The test can no longer reliably rank models, which is why the field moves to harder, fresher benchmarks.",
      "plain": "When every top student aces the same easy exam, their scores no longer tell you who's actually smartest. The test has become too easy to separate them, so you need a harder exam to see real differences.",
      "difficulty": "core"
    },
    {
      "id": "eval-1",
      "categoryKey": "eval",
      "category": "Evaluation & Evals",
      "subtopic": "Fluent vs correct",
      "question": "Why can a model produce a fluent, confident, expert-sounding answer that is completely wrong?",
      "answer": "Because the model is trained to generate statistically plausible text, not verified truth, and fluency and correctness come from the same machinery. It has no separate internal truth signal, so the most likely-sounding continuation can simply be false while still reading perfectly.",
      "plain": "The AI is built to write what sounds right, not to check whether it is right, so a smooth wrong answer and a smooth correct one come out the same way. It's like a confident talker who's great at sounding expert whether or not they actually know the facts.",
      "difficulty": "core"
    },
    {
      "id": "eval-2",
      "categoryKey": "eval",
      "category": "Evaluation & Evals",
      "subtopic": "Jailbreaks vs injection",
      "question": "What is the difference between a jailbreak and a prompt injection?",
      "answer": "A jailbreak is the legitimate user wording their own prompt to bypass safety and get refused content. A prompt injection is malicious instructions hidden inside content the model reads (a document, webpage, or tool output), hijacking its behavior even though the real user never typed them.",
      "plain": "A jailbreak is the user sweet-talking the AI into breaking its own rules. A prompt injection is a trap hidden in a document or webpage the AI reads, like a forged note slipped into its inbox that it mistakes for an order from you.",
      "difficulty": "core"
    },
    {
      "id": "eval-3",
      "categoryKey": "eval",
      "category": "Evaluation & Evals",
      "subtopic": "Jailbreaks vs injection",
      "question": "Why is indirect prompt injection the central security concern for RAG systems and tool-using agents specifically?",
      "answer": "Because the attack rides in on the external content you retrieve. A poisoned document, webpage, or file can contain instructions like 'ignore your rules and exfiltrate the data,' and once that text enters the prompt the model may obey it. Any RAG or MCP pipeline is feeding untrusted content straight into the model.",
      "plain": "Whenever your AI pulls in outside documents or web pages to answer (RAG means it looks things up before replying), an attacker can hide commands inside those documents. The AI reads the booby-trapped file and may follow the hidden instructions, so you're letting strangers' text whisper orders into the system.",
      "difficulty": "intermediate"
    },
    {
      "id": "eval-4",
      "categoryKey": "eval",
      "category": "Evaluation & Evals",
      "subtopic": "Benchmarks",
      "question": "What is benchmark contamination, and how does it inflate a model's score?",
      "answer": "Contamination is when the benchmark's questions or answers were present in the model's training data. The model then recalls memorized answers instead of reasoning, so the score reflects memorization rather than real capability. It is why even SWE-bench tasks get audited for leaked gold patches.",
      "plain": "It's like a student who saw the exact exam questions beforehand: they ace the test by memorizing answers, not by understanding the material. The high score is fake because the AI already had the answer key in its training.",
      "difficulty": "intermediate"
    },
    {
      "id": "eval-5",
      "categoryKey": "eval",
      "category": "Evaluation & Evals",
      "subtopic": "Guardrails",
      "question": "Why is using a chat model from the same family as your main model a weak choice for a safety guardrail?",
      "answer": "Because a guardrail that shares the main model's training and prompt format is vulnerable to the same jailbreaks. An attack that defeats the primary model is likely to defeat the guardrail too. A purpose-trained, independent classifier is more robust.",
      "plain": "Using a near-identical AI as the security guard for your main AI is like hiring the suspect's twin to check IDs: the same trick that fools one fools the other. A separately built, specialized checker is much harder to slip past.",
      "difficulty": "advanced"
    },
    {
      "id": "eval-6",
      "categoryKey": "eval",
      "category": "Evaluation & Evals",
      "subtopic": "Context limits",
      "question": "What is the 'lost in the middle' effect in long-context inputs?",
      "answer": "Models tend to recall information placed at the start or end of a long input better than information buried in the middle. So even when content fits inside the context window, facts in the middle can be effectively missed.",
      "plain": "Like skimming a long article, the AI remembers the beginning and the end best and tends to gloss over the middle. So an important detail buried in the middle of a long document can get overlooked even though it was right there.",
      "difficulty": "intermediate"
    },
    {
      "id": "eval-7",
      "categoryKey": "eval",
      "category": "Evaluation & Evals",
      "subtopic": "Benchmarks",
      "question": "How does SWE-bench Verified differ from a knowledge benchmark like MMLU in what it measures?",
      "answer": "MMLU is multiple-choice knowledge across many subjects. SWE-bench Verified gives the model 500 real, human-validated GitHub issues and requires a patch that passes the repository's tests, so it measures end-to-end practical engineering rather than recall of facts.",
      "plain": "MMLU is a multiple-choice quiz testing what the AI knows. SWE-bench Verified is a hands-on driving test: it must actually fix real software bugs and pass the checks, showing whether it can do the job, not just answer trivia.",
      "difficulty": "intermediate"
    },
    {
      "id": "eval-8",
      "categoryKey": "eval",
      "category": "Evaluation & Evals",
      "subtopic": "Guardrails",
      "question": "What does RLHF contribute to model safety, and why is it described as 'soft' rather than a hard rule?",
      "answer": "RLHF (reinforcement learning from human feedback) uses human preference ratings to teach the model to prefer helpful, harmless responses and refuse harmful ones. It shapes tendencies probabilistically rather than enforcing absolute rules, so a sufficiently clever prompt can still talk the model around it.",
      "plain": "People rate the AI's answers as good or bad, and over many rounds it learns to lean toward helpful, harmless ones. But this is more like instilling good manners than installing a locked gate, so a clever enough request can still coax it past those habits.",
      "difficulty": "intermediate"
    },
    {
      "id": "eval-9",
      "categoryKey": "eval",
      "category": "Evaluation & Evals",
      "subtopic": "Fluent vs correct",
      "question": "Distinguish a model's calibration from its accuracy.",
      "answer": "Accuracy is how often the model is right. Calibration is how well its expressed confidence matches its actual accuracy. A poorly calibrated model sounds equally certain whether it is correct or wrong, which is exactly what makes hallucinations dangerous.",
      "plain": "Accuracy is how often it's right; calibration is whether its confidence matches reality, like a weather forecaster whose '70% chance' actually rains 70% of the time. A badly calibrated AI sounds just as sure when it's wrong as when it's right, which is what makes its mistakes sneaky.",
      "difficulty": "advanced"
    },
    {
      "id": "eval-10",
      "categoryKey": "eval",
      "category": "Evaluation & Evals",
      "subtopic": "Bias",
      "question": "Where does bias in LLM outputs come from, and what does that imply about removing it?",
      "answer": "It comes from the training data: human-written text full of stereotypes and skewed representation, which the model learns and reproduces. Because it is baked into what the model learned, you cannot simply switch it off; you have to measure it and apply deliberate mitigation, and some residual bias remains.",
      "plain": "The AI learned from huge piles of human writing, which carry our stereotypes and blind spots, so it picks those up too. You can't flip a switch to delete bias since it's woven into what it learned: you can only measure it, push back on it, and accept some will linger.",
      "difficulty": "core"
    },
    {
      "id": "eval-11",
      "categoryKey": "eval",
      "category": "Evaluation & Evals",
      "subtopic": "Guardrails",
      "question": "What is the tradeoff between over-refusal and under-blocking in safety guardrails?",
      "answer": "Over-refusal (a false positive) means blocking benign, legitimate requests, which frustrates users and hurts usefulness. Under-blocking means letting genuinely harmful content through. Tuning a guardrail is always balancing these two failure modes against each other; you cannot drive both to zero.",
      "plain": "It's like setting a security checkpoint's sensitivity: too strict and you turn away harmless people (annoying everyone), too loose and you let the real threats slip through. You're always balancing the two, and you can't fully avoid both at once.",
      "difficulty": "core"
    },
    {
      "id": "eval-12",
      "categoryKey": "eval",
      "category": "Evaluation & Evals",
      "subtopic": "Benchmarks",
      "question": "Why should a benchmark leaderboard number never be your only basis for choosing a model in 2026?",
      "answer": "Because top models are saturated (near-identical, near-ceiling scores), public benchmarks may be contaminated, and the test rarely matches your actual task. Sound evaluation is a portfolio: capability tests, safety tests, and your own task-specific evals on real data.",
      "plain": "Top models all score about the same on public tests, those tests may have leaked into training, and they don't match your real job anyway. So picking a model on its leaderboard rank is like hiring on test scores alone: also try it on your actual work before deciding.",
      "difficulty": "core"
    },
    {
      "id": "eval-13",
      "categoryKey": "eval",
      "category": "Evaluation & Evals",
      "subtopic": "Evaluation methods",
      "question": "What is 'LLM-as-a-judge,' and what is its main weakness?",
      "answer": "It is using a strong model to automatically grade other models' outputs at scale, which is fast and cheap. Its weakness is that the judge has its own biases (for example favoring longer or more confident-sounding answers) and can be gamed, so its verdicts are not ground truth.",
      "plain": "Instead of having humans grade thousands of AI answers, you use a smart AI to grade them, which is fast and cheap. The catch is the AI grader has its own quirks (it may reward longer or more confident-sounding answers) and can be played, so its scores aren't the final truth.",
      "difficulty": "advanced"
    },
    {
      "id": "eval-14",
      "categoryKey": "eval",
      "category": "Evaluation & Evals",
      "subtopic": "Why evaluation is hard",
      "question": "Why is plain accuracy often not enough to evaluate an LLM application?",
      "answer": "Because many LLM tasks are open-ended, there is no single correct string to match against. Two very different answers can both be good, an answer can be partly right, and qualities like tone, completeness, and faithfulness to the sources matter beyond bare correctness. So you need rubrics, comparisons, or human judgment rather than a simple right/wrong count.",
      "plain": "For an essay or a summary there is no one 'correct' answer to check a box against, unlike a math quiz. Two different responses might both be great, or one might be half-right, so counting exact matches misses what actually makes the output good or bad. You need richer ways to judge it.",
      "difficulty": "core"
    },
    {
      "id": "eval-15",
      "categoryKey": "eval",
      "category": "Evaluation & Evals",
      "subtopic": "Task-specific eval sets",
      "question": "What is a task-specific eval set, and why build your own instead of relying on public benchmarks?",
      "answer": "It is a curated collection of real inputs from your actual use case paired with outputs you consider good. You build your own because public benchmarks rarely match your task, may be contaminated, and are saturated near the top, so they cannot tell you whether the model is good at the specific job you are shipping.",
      "plain": "It is your own little exam, built from real examples of the work you need done, with model answers you trust. Public leaderboards test generic skills that may have nothing to do with your job, so the only way to know if a model handles your task is to test it on your task.",
      "difficulty": "core"
    },
    {
      "id": "eval-16",
      "categoryKey": "eval",
      "category": "Evaluation & Evals",
      "subtopic": "Metrics",
      "question": "Match the metric to the task: when would you use exact match, a rubric, and pairwise comparison?",
      "answer": "Exact match for tasks with one right answer (classification labels, extracted fields, yes/no). A rubric or checklist for open-ended outputs, scoring whether the answer covers the required points. Pairwise comparison (is A better than B) for subjective quality, since judging which of two answers is better is more reliable than assigning an absolute score.",
      "plain": "Use exact match when there's a single right answer (a category, a date). Use a checklist/rubric for things like essays, scoring whether key points are covered. Use head-to-head comparison ('which answer is better, A or B') for fuzzy quality, because picking a winner is easier and more consistent than putting a number on each.",
      "difficulty": "core"
    },
    {
      "id": "eval-17",
      "categoryKey": "eval",
      "category": "Evaluation & Evals",
      "subtopic": "Regression testing",
      "question": "Why should you keep a fixed eval set and re-run it every time you tweak a prompt or change models?",
      "answer": "Because LLM behavior is sensitive: a small prompt edit or a model swap can silently improve some cases while breaking others. Re-running the same eval set (regression testing) catches those quality drops before users do, the same way a software test suite catches bugs introduced by a code change.",
      "plain": "AI outputs are touchy, so a tiny wording change or a new model can quietly fix some answers while wrecking others. Running the same test set every time you make a change is like a smoke alarm: it warns you about the breakage before your users find it.",
      "difficulty": "core"
    },
    {
      "id": "eval-18",
      "categoryKey": "eval",
      "category": "Evaluation & Evals",
      "subtopic": "Human evaluation",
      "question": "Human evaluation is often called the gold standard. What are its two main practical drawbacks, and what helps with consistency?",
      "answer": "It is slow and expensive, and it is subjective: different reviewers can rate the same answer differently. A clear rubric and measuring inter-rater agreement (how often reviewers agree) help, as does using pairwise comparisons, which people judge more consistently than absolute scores.",
      "plain": "Having people grade answers gives the most trustworthy verdict, but it is slow, costs real money, and two graders may disagree. A clear scoring guide, checking how often graders agree, and asking 'which is better, A or B' instead of 'rate this 1-10' all make human grading steadier.",
      "difficulty": "intermediate"
    },
    {
      "id": "eval-19",
      "categoryKey": "eval",
      "category": "Evaluation & Evals",
      "subtopic": "Offline vs online eval",
      "question": "What is the difference between offline evaluation and online (A/B) evaluation, and what does each catch that the other misses?",
      "answer": "Offline eval runs the model against a fixed test set before release: fast, cheap, repeatable, but limited to the cases you thought to include. Online eval (A/B testing) compares versions on real live traffic using real user outcomes, which catches real-world behavior and edge cases offline missed, at the cost of exposing some users to a possibly worse version.",
      "plain": "Offline is a dress rehearsal against a fixed script: quick and safe, but only covers what you scripted. Online (A/B testing) is opening night with real audiences, where you compare two versions on actual users, catching surprises the rehearsal missed but risking a worse experience for some people.",
      "difficulty": "intermediate"
    },
    {
      "id": "eval-20",
      "categoryKey": "eval",
      "category": "Evaluation & Evals",
      "subtopic": "LLM-as-judge",
      "question": "What two practices make LLM-as-judge more reliable, and what bias should you still watch for?",
      "answer": "Give the judge a clear rubric and use pairwise comparison (which answer is better) rather than absolute scoring, since both improve consistency. Still watch for biases such as position bias (favoring the first or second answer shown) and length/verbosity bias (favoring longer or more confident answers), often countered by swapping answer order and averaging.",
      "plain": "When you let an AI grade other AIs, two things help: give it a clear scoring guide, and have it pick a winner between two answers instead of rating each alone. But it has quirks, like favoring whichever answer comes first or just preferring longer replies, so you flip the order and average to cancel that out.",
      "difficulty": "intermediate"
    },
    {
      "id": "eval-21",
      "categoryKey": "eval",
      "category": "Evaluation & Evals",
      "subtopic": "Eval-driven development",
      "question": "What does 'eval-driven development' mean, and how does it change how you improve an AI feature?",
      "answer": "It means building and refining the feature against a standing eval set that defines 'good,' and treating that set like an automated test suite that gates changes. Instead of tweaking prompts by gut feel and eyeballing a few outputs, every change is measured against the eval set, so improvement becomes a number you move rather than a vibe.",
      "plain": "It is the habit of defining 'good' up front with a test set, then judging every change by whether the score goes up, like writing tests before code. Instead of fiddling with the prompt and squinting at a couple of answers, you let the eval set tell you, with a number, whether you actually made it better.",
      "difficulty": "intermediate"
    }
  ]
};

export default mod;
