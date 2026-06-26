// Module: Reasoning & Test-time Compute (tier 4, new).
// No video. Covers test-time compute, chain-of-thought, trained reasoning models,
// their trade-offs, limits, and when to reach for one.

import type { Category } from '../../types';

const mod: Category = {
  key: 'reasoning',
  name: 'Reasoning & Test-time Compute',
  tier: 4,
  summary:
    "Newer models can think before they answer by generating intermediate reasoning steps, spending more computation at answer time to do better on hard problems. This module explains what test-time compute is, how chain-of-thought prompting and trained reasoning models differ, what the extra thinking costs in money and time, and how to decide when it is worth it.",
  learningObjectives: [
    'By the end you can explain what test-time compute means and why thinking longer can help',
    'By the end you can distinguish chain-of-thought prompting from trained reasoning models',
    'By the end you can describe when reasoning models help and when they are overkill',
    'By the end you can explain the cost and latency trade-offs of reasoning',
    'By the end you can recognize that more reasoning steps do not guarantee a correct answer',
    'By the end you can decide when to reach for a reasoning model versus a standard one',
  ],
  breakdown: [
    {
      heading: 'The test-time compute idea',
      video: { url: "https://www.youtube.com/watch?v=DAlC8mL5ZlI", title: "Why AI Models Pause to Think: Test Time Compute Explained", channel: "IBM Technology" },
      caption:
        'A single pass has to answer right away. A reasoning model writes a few steps first, which leaves room to break the problem up and catch slips.',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 200" width="100%" preserveAspectRatio="xMidYMid meet" role="img" aria-labelledby="rsn1t" font-family="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif" fill="#1c1d1f">
  <title id="rsn1t">A single forward pass answers at once, while a reasoning model adds steps first</title>
  <style>.rsn1g{animation:rsn1p 2.6s ease-in-out infinite}@keyframes rsn1p{0%,100%{opacity:1}50%{opacity:.55}}@media (prefers-reduced-motion:reduce){.rsn1g{animation:none}}</style>
  <defs><marker id="rsn1a" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#6b7280"/></marker></defs>
  <text x="180" y="18" text-anchor="middle" font-size="12.5" font-weight="700">Think before answering</text>
  <text x="18" y="40" font-size="10" fill="#6b7280">Answer immediately</text>
  <rect x="18" y="46" width="44" height="26" rx="6" fill="#fff" stroke="#6b7280" stroke-width="1.5"/>
  <text x="40" y="63" text-anchor="middle" font-size="11">Q</text>
  <text x="164" y="52" text-anchor="middle" font-size="10" fill="#6b7280">no room to work it out</text>
  <line x1="64" y1="62" x2="262" y2="62" stroke="#6b7280" stroke-width="1.6" marker-end="url(#rsn1a)"/>
  <rect x="266" y="49" width="76" height="26" rx="6" fill="#fff" stroke="#dc2626" stroke-width="1.6"/>
  <text x="304" y="66" text-anchor="middle" font-size="11" fill="#dc2626">rushed guess</text>
  <line x1="18" y1="92" x2="342" y2="92" stroke="#e6dfce" stroke-width="1.5"/>
  <text x="18" y="110" font-size="11" font-weight="600" fill="#1f7a50">Reason step by step</text>
  <rect x="18" y="118" width="40" height="26" rx="6" fill="#fff" stroke="#6b7280" stroke-width="1.5"/>
  <text x="38" y="135" text-anchor="middle" font-size="11">Q</text>
  <g class="rsn1g">
    <rect x="74" y="120" width="54" height="22" rx="5" fill="#efe9da" stroke="#e6dfce" stroke-width="1.4"/><text x="101" y="135" text-anchor="middle" font-size="10" fill="#6b7280">step 1</text>
    <rect x="146" y="120" width="54" height="22" rx="5" fill="#efe9da" stroke="#e6dfce" stroke-width="1.4"/><text x="173" y="135" text-anchor="middle" font-size="10" fill="#6b7280">step 2</text>
    <rect x="218" y="120" width="54" height="22" rx="5" fill="#efe9da" stroke="#e6dfce" stroke-width="1.4"/><text x="245" y="135" text-anchor="middle" font-size="10" fill="#6b7280">step 3</text>
  </g>
  <line x1="58" y1="131" x2="72" y2="131" stroke="#6b7280" stroke-width="1.4" marker-end="url(#rsn1a)"/>
  <line x1="128" y1="131" x2="144" y2="131" stroke="#6b7280" stroke-width="1.4" marker-end="url(#rsn1a)"/>
  <line x1="200" y1="131" x2="216" y2="131" stroke="#6b7280" stroke-width="1.4" marker-end="url(#rsn1a)"/>
  <line x1="272" y1="131" x2="286" y2="131" stroke="#6b7280" stroke-width="1.4" marker-end="url(#rsn1a)"/>
  <rect x="290" y="118" width="52" height="26" rx="6" fill="#fff" stroke="#1f7a50" stroke-width="1.6"/>
  <text x="316" y="135" text-anchor="middle" font-size="11" fill="#1f7a50">answer</text>
  <text x="180" y="164" text-anchor="middle" font-size="10" fill="#6b7280">breaking it apart leaves room to catch mistakes</text>
  <text x="180" y="184" text-anchor="middle" font-size="10" fill="#6b7280">more steps means more tokens, so more time and cost</text>
</svg>`,
      explanation:
        'For years the main way to make models better was to spend more compute during training: bigger models, more data. Test-time compute (also called inference-time compute) is a different lever: spend more computation when the model answers a specific question, so it can work through the problem instead of blurting the first thing that comes to mind. Concretely, the model generates a chain of intermediate steps before its final answer, which gives it room to break a hard problem into parts, catch its own mistakes, and combine sub-results. This helps most on problems that genuinely require multiple steps (math, logic, planning, careful code), because a single forward pass that must produce the answer immediately has no room to "work it out." The trade is direct: more thinking means more tokens generated, which costs more money and takes more time per answer.',
      keyTerms: [
        {
          term: 'Test-time compute',
          definition:
            'Computation spent while answering a specific question (as opposed to during training), used to let the model reason through a problem before committing to an answer.',
        },
        {
          term: 'Forward pass',
          definition:
            'A single run of the model that produces one next-token prediction. Answering "immediately" gives the model no room to work through multi-step problems.',
        },
        {
          term: 'Reasoning steps',
          definition:
            'Intermediate text the model generates to break a problem into parts and work toward an answer, rather than producing the final answer in one shot.',
        },
      ],
    },
    {
      heading: 'From chain-of-thought prompting to trained reasoning models',
      video: { url: "https://www.youtube.com/watch?v=Fp-ue4UCE3s", title: "What Is Chain-of-Thought Prompting in Generative AI?", channel: "Eye on Tech" },
      caption:
        'Chain-of-thought is a prompt trick you add to any model. A trained reasoning model thinks on its own and often hides the steps, showing only a summary.',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 200" width="100%" preserveAspectRatio="xMidYMid meet" role="img" aria-labelledby="rsn2t" font-family="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif" fill="#1c1d1f">
  <title id="rsn2t">Chain-of-thought is a prompt you add, a trained reasoning model thinks on its own</title>
  <style>.rsn2g{animation:rsn2p 2.8s ease-in-out infinite}@keyframes rsn2p{0%,100%{opacity:1}50%{opacity:.55}}@media (prefers-reduced-motion:reduce){.rsn2g{animation:none}}</style>
  <defs><marker id="rsn2a" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#6b7280"/></marker></defs>
  <text x="180" y="18" text-anchor="middle" font-size="12.5" font-weight="700">From prompting to trained reasoning</text>
  <rect x="12" y="30" width="162" height="150" rx="10" fill="#fff" stroke="#e6dfce" stroke-width="1.5"/>
  <text x="93" y="48" text-anchor="middle" font-size="11" font-weight="600" fill="#0b5394">Chain-of-thought</text>
  <text x="93" y="62" text-anchor="middle" font-size="9.5" fill="#6b7280">a prompt trick</text>
  <rect x="28" y="72" width="130" height="26" rx="6" fill="#efe9da" stroke="#e6dfce" stroke-width="1.4"/>
  <text x="93" y="89" text-anchor="middle" font-size="10">'think step by step'</text>
  <line x1="93" y1="100" x2="93" y2="116" stroke="#6b7280" stroke-width="1.5" marker-end="url(#rsn2a)"/>
  <rect x="40" y="120" width="106" height="30" rx="6" fill="#fff" stroke="#6b7280" stroke-width="1.5"/>
  <text x="93" y="139" text-anchor="middle" font-size="10.5">any model</text>
  <text x="93" y="168" text-anchor="middle" font-size="9.5" fill="#6b7280">you add it each time</text>
  <rect x="186" y="30" width="162" height="150" rx="10" fill="#fff" stroke="#1f7a50" stroke-width="1.6"/>
  <text x="267" y="48" text-anchor="middle" font-size="11" font-weight="600" fill="#1f7a50">Trained reasoner</text>
  <text x="267" y="62" text-anchor="middle" font-size="9.5" fill="#6b7280">thinks by default</text>
  <rect class="rsn2g" x="206" y="70" width="122" height="42" rx="6" fill="#f7f3ea" stroke="#1f7a50" stroke-width="1.4" stroke-dasharray="4 3"/>
  <text x="267" y="84" text-anchor="middle" font-size="9.5" fill="#6b7280">hidden thinking</text>
  <line x1="218" y1="92" x2="316" y2="92" stroke="#6b7280" stroke-width="1" opacity="0.5"/>
  <line x1="218" y1="99" x2="316" y2="99" stroke="#6b7280" stroke-width="1" opacity="0.5"/>
  <line x1="218" y1="106" x2="298" y2="106" stroke="#6b7280" stroke-width="1" opacity="0.5"/>
  <line x1="267" y1="114" x2="267" y2="128" stroke="#6b7280" stroke-width="1.5" marker-end="url(#rsn2a)"/>
  <rect x="210" y="132" width="114" height="26" rx="6" fill="#fff" stroke="#1f7a50" stroke-width="1.5"/>
  <text x="267" y="149" text-anchor="middle" font-size="10" fill="#1f7a50">summary + answer</text>
  <text x="267" y="172" text-anchor="middle" font-size="9.5" fill="#6b7280">still billed for hidden steps</text>
</svg>`,
      explanation:
        'Chain-of-thought (CoT) is the original, prompt-level version of this idea: you simply ask the model to "think step by step," and it writes out its reasoning before the answer, which improves accuracy on multi-step tasks. That is a prompting technique you apply to an ordinary model. A trained reasoning model goes further: it is specifically trained (often with reinforcement learning that rewards reaching correct answers) to produce long internal reasoning on its own, without being asked, and to use that thinking time well, for example by exploring approaches and backtracking. The reasoning text is sometimes called thinking tokens or a scratchpad. A key practical detail: some reasoning models keep their detailed thinking hidden and show you only a summary plus the final answer, while still charging for the hidden thinking tokens, because that internal work is real computation even when you do not see it.',
      keyTerms: [
        {
          term: 'Chain-of-thought (CoT)',
          definition:
            'A prompting technique where the model is asked to write out intermediate reasoning before its answer, improving accuracy on multi-step problems.',
        },
        {
          term: 'Trained reasoning model',
          definition:
            'A model trained to generate long, structured reasoning on its own (often via reinforcement learning) rather than relying on the user to prompt for it.',
        },
        {
          term: 'Thinking tokens (scratchpad)',
          definition:
            'The intermediate reasoning tokens a model generates to work through a problem. Sometimes hidden from the user but still computed and usually billed.',
        },
      ],
    },
    {
      heading: 'Getting more out of reasoning: many paths and verification',
      video: { url: "https://www.youtube.com/watch?v=IMkSUxGKfvw", title: "Chain of Thought Self-Consistency: Improve AI Accuracy by Comparing Multiple Reasoning Paths", channel: "LearnAwesome" },
      caption:
        'Two ways to spend more compute. Self-consistency runs the problem several times and takes the majority answer. Verification checks a step against a real tool.',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 200" width="100%" preserveAspectRatio="xMidYMid meet" role="img" aria-labelledby="rsn3t" font-family="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif" fill="#1c1d1f">
  <title id="rsn3t">Self-consistency votes across many runs, verification checks a step with a tool</title>
  <style>.rsn3g{animation:rsn3p 2.6s ease-in-out infinite}@keyframes rsn3p{0%,100%{opacity:1}50%{opacity:.5}}@media (prefers-reduced-motion:reduce){.rsn3g{animation:none}}</style>
  <defs><marker id="rsn3a" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#6b7280"/></marker></defs>
  <text x="180" y="18" text-anchor="middle" font-size="12.5" font-weight="700">Spend more for a more reliable answer</text>
  <line x1="180" y1="30" x2="180" y2="186" stroke="#e6dfce" stroke-width="1.4" stroke-dasharray="4 4"/>
  <text x="92" y="44" text-anchor="middle" font-size="11" font-weight="600" fill="#0b5394">Self-consistency</text>
  <text x="92" y="58" text-anchor="middle" font-size="9.5" fill="#6b7280">run it several times, vote</text>
  <circle cx="26" cy="104" r="13" fill="#fff" stroke="#6b7280" stroke-width="1.5"/>
  <text x="26" y="108" text-anchor="middle" font-size="10">Q</text>
  <path d="M39,98 C56,86 64,80 76,76" fill="none" stroke="#6b7280" stroke-width="1.4"/>
  <path d="M39,104 C56,104 64,104 76,104" fill="none" stroke="#6b7280" stroke-width="1.4"/>
  <path d="M39,110 C56,122 64,128 76,132" fill="none" stroke="#6b7280" stroke-width="1.4"/>
  <rect x="78" y="66" width="34" height="20" rx="5" fill="#fff" stroke="#e6dfce" stroke-width="1.4"/><text x="95" y="80" text-anchor="middle" font-size="10">7</text>
  <rect x="78" y="94" width="34" height="20" rx="5" fill="#fff" stroke="#e6dfce" stroke-width="1.4"/><text x="95" y="108" text-anchor="middle" font-size="10">7</text>
  <rect x="78" y="122" width="34" height="20" rx="5" fill="#fff" stroke="#e6dfce" stroke-width="1.4"/><text x="95" y="136" text-anchor="middle" font-size="10">9</text>
  <line x1="112" y1="78" x2="126" y2="96" stroke="#6b7280" stroke-width="1.2" marker-end="url(#rsn3a)"/>
  <line x1="112" y1="104" x2="126" y2="104" stroke="#6b7280" stroke-width="1.2" marker-end="url(#rsn3a)"/>
  <line x1="112" y1="130" x2="126" y2="113" stroke="#6b7280" stroke-width="1.2" marker-end="url(#rsn3a)"/>
  <rect class="rsn3g" x="130" y="90" width="44" height="30" rx="6" fill="#fff" stroke="#1f7a50" stroke-width="1.6"/>
  <text x="152" y="105" text-anchor="middle" font-size="12" font-weight="700" fill="#1f7a50">7</text>
  <text x="152" y="115" text-anchor="middle" font-size="8" fill="#6b7280">wins</text>
  <text x="92" y="170" text-anchor="middle" font-size="9.5" fill="#6b7280">the most common answer wins</text>
  <text x="268" y="44" text-anchor="middle" font-size="11" font-weight="600" fill="#1f7a50">Verification</text>
  <text x="268" y="58" text-anchor="middle" font-size="9.5" fill="#6b7280">check it against a tool</text>
  <rect x="198" y="70" width="140" height="24" rx="6" fill="#efe9da" stroke="#e6dfce" stroke-width="1.4"/>
  <text x="268" y="86" text-anchor="middle" font-size="10">claim: 17 x 23 = 391</text>
  <line x1="268" y1="96" x2="268" y2="108" stroke="#6b7280" stroke-width="1.5" marker-end="url(#rsn3a)"/>
  <rect x="232" y="110" width="72" height="26" rx="6" fill="#fff" stroke="#2f8cff" stroke-width="1.6"/>
  <text x="268" y="127" text-anchor="middle" font-size="10" fill="#0b5394">run the code</text>
  <line x1="268" y1="138" x2="268" y2="150" stroke="#6b7280" stroke-width="1.5" marker-end="url(#rsn3a)"/>
  <rect class="rsn3g" x="206" y="152" width="124" height="24" rx="6" fill="#fff" stroke="#1f7a50" stroke-width="1.6"/>
  <text x="268" y="168" text-anchor="middle" font-size="10" fill="#1f7a50">verified against a real result</text>
</svg>`,
      explanation:
        'Once a model can reason, you can spend even more test-time compute to push accuracy further. Self-consistency runs the model several times on the same problem (with sampling, so each run can take a different route) and then picks the answer that shows up most often, which is more reliable than trusting any single run, at the cost of running the model many times. Another powerful pattern is verification: instead of trusting the reasoning, you check it. The model can call a tool (run code, query a database, use a calculator) so a step is validated against ground truth rather than just sounding right, or a separate check confirms the final answer. Tool-checked reasoning is especially valuable because it grounds the model\'s steps in something real, turning "this looks correct" into "this was actually verified," which directly attacks the risk that fluent reasoning is still wrong.',
      keyTerms: [
        {
          term: 'Self-consistency',
          definition:
            'Sampling several independent reasoning paths for one problem and taking the most common final answer, trading more compute for higher reliability.',
        },
        {
          term: 'Verification',
          definition:
            'Checking a reasoning step or final answer against ground truth (a tool, a calculation, a separate checker) instead of trusting that it sounds right.',
        },
        {
          term: 'Tool-checked reasoning',
          definition:
            'Reasoning where the model runs code, queries data, or calls a calculator so steps are validated against real results rather than just generated text.',
        },
      ],
    },
    {
      heading: 'Trade-offs, knowledge, and limits',
      video: { url: "https://www.youtube.com/watch?v=9-vhYcPe5W4", title: "Do Reasoning Models Hallucinate More?", channel: "The AI Daily Brief: Artificial Intelligence News" },
      caption:
        'Reasoning earns its cost on hard multi-step work and wastes it on easy tasks. It cannot add facts the model never learned, and a neat chain is not proof.',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 200" width="100%" preserveAspectRatio="xMidYMid meet" role="img" aria-labelledby="rsn4t" font-family="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif" fill="#1c1d1f">
  <title id="rsn4t">Reasoning helps on hard multi-step work, is overkill on easy tasks, and cannot supply missing facts</title>
  <text x="180" y="18" text-anchor="middle" font-size="12.5" font-weight="700">A trade, not a guarantee</text>
  <rect x="12" y="30" width="164" height="98" rx="10" fill="#fff" stroke="#1f7a50" stroke-width="1.6"/>
  <text x="94" y="48" text-anchor="middle" font-size="11" font-weight="600" fill="#1f7a50">Worth the thinking</text>
  <text x="28" y="68" font-size="11" fill="#1f7a50">+</text><text x="42" y="68" font-size="10">hard, multi-step math</text>
  <text x="28" y="88" font-size="11" fill="#1f7a50">+</text><text x="42" y="88" font-size="10">logic and planning</text>
  <text x="28" y="108" font-size="11" fill="#1f7a50">+</text><text x="42" y="108" font-size="10">careful code</text>
  <rect x="184" y="30" width="164" height="98" rx="10" fill="#fff" stroke="#d97706" stroke-width="1.6"/>
  <text x="266" y="48" text-anchor="middle" font-size="11" font-weight="600" fill="#d97706">Overkill</text>
  <text x="200" y="68" font-size="11" fill="#d97706">x</text><text x="214" y="68" font-size="10">simple lookups</text>
  <text x="200" y="88" font-size="11" fill="#d97706">x</text><text x="214" y="88" font-size="10">short rewrites</text>
  <text x="200" y="108" font-size="11" fill="#d97706">x</text><text x="214" y="108" font-size="10">quick chat</text>
  <rect x="12" y="138" width="336" height="46" rx="8" fill="#efe9da" stroke="#dc2626" stroke-width="1.3"/>
  <text x="180" y="157" text-anchor="middle" font-size="9.5">More steps cannot supply facts the model never learned. Use retrieval.</text>
  <text x="180" y="173" text-anchor="middle" font-size="9.5">A tidy chain of thought is not proof the answer is right.</text>
</svg>`,
      explanation:
        'Reasoning is not free and not always better. The costs are concrete: it generates far more tokens, so it costs more per answer and is slower, sometimes much slower, before the first useful output appears. For simple lookups, formatting, short rewrites, or quick chat, that extra thinking is wasted overhead and can even over-complicate an easy task. A crucial distinction is reasoning versus knowledge: thinking longer helps the model use what it knows more carefully, but it cannot conjure facts it never learned. If the answer depends on information the model lacks, more steps will not fix it, and the right tool is retrieval (giving it the facts), not more reasoning. Finally, more steps do not guarantee correctness: a model can reason confidently to a wrong answer, and the written reasoning is not always a faithful account of how it actually reached its conclusion, so a clean-looking chain of thought is not proof the answer is right.',
      keyTerms: [
        {
          term: 'Reasoning vs knowledge',
          definition:
            'Reasoning helps a model use what it knows, but it cannot supply missing facts. Knowledge gaps are fixed by retrieval, not by thinking longer.',
        },
        {
          term: 'Faithfulness',
          definition:
            "Whether a model's written reasoning actually reflects how it reached its answer. Reasoning traces can be unfaithful, so a tidy chain is not proof of correctness.",
        },
        {
          term: 'Latency',
          definition:
            'The delay before an answer arrives. Reasoning models generate many more tokens, so they are often noticeably slower than standard models.',
        },
      ],
    },
  ],
  cards: [
    {
      id: 'reasoning-0',
      categoryKey: 'reasoning',
      category: 'Reasoning & Test-time Compute',
      subtopic: 'Test-time compute',
      question: 'What does "test-time compute" mean?',
      answer:
        'Test-time compute (or inference-time compute) is computation spent while the model is answering a specific question, rather than during training. The model uses that extra compute to generate intermediate reasoning and work through the problem before producing its final answer.',
      plain:
        'It is the model taking a moment to think before it speaks, and that thinking takes real computing effort. Instead of pouring all the work into building the model once, you let it spend more effort each time it answers a hard question.',
      difficulty: 'core',
    },
    {
      id: 'reasoning-1',
      categoryKey: 'reasoning',
      category: 'Reasoning & Test-time Compute',
      subtopic: 'Test-time compute',
      question:
        'Why can letting a model think longer improve its answers on hard problems?',
      answer:
        'Generating intermediate steps gives the model room to break a hard problem into parts, work out sub-results, and catch its own mistakes, instead of having to produce the final answer in a single immediate pass. Multi-step problems (math, logic, planning, careful code) benefit most because they cannot be solved correctly in one leap.',
      plain:
        'It is the difference between answering a tricky math problem off the top of your head versus working it out on scratch paper. The scratch work lets the model take it one step at a time and fix slips along the way, which is exactly what hard problems need.',
      difficulty: 'core',
    },
    {
      id: 'reasoning-2',
      categoryKey: 'reasoning',
      category: 'Reasoning & Test-time Compute',
      subtopic: 'Chain-of-thought',
      question: 'What is chain-of-thought (CoT) prompting?',
      answer:
        'Chain-of-thought prompting is asking an ordinary model to write out its reasoning step by step before giving the final answer. Producing the intermediate steps improves accuracy on multi-step tasks compared to demanding the answer immediately. It is a prompting technique, not a special model.',
      plain:
        'It is literally telling the model "show your work" or "think step by step." Just like a student who writes out each step is more likely to get a long problem right than one who only writes the final number, the model does better when it reasons out loud first.',
      difficulty: 'core',
    },
    {
      id: 'reasoning-3',
      categoryKey: 'reasoning',
      category: 'Reasoning & Test-time Compute',
      subtopic: 'Trained reasoning models',
      question:
        'How does a trained reasoning model differ from just using chain-of-thought prompting on a standard model?',
      answer:
        'Chain-of-thought is a prompting trick you apply to an ordinary model. A trained reasoning model is specifically trained (often with reinforcement learning that rewards correct final answers) to generate long, structured reasoning on its own, without being asked, and to use that thinking time well, such as exploring approaches and backtracking. The reasoning behavior is built into the model rather than coaxed out by the prompt.',
      plain:
        'Chain-of-thought is reminding any model to show its work. A trained reasoning model has already practiced thinking hard for thousands of hours, so it does deep, self-checking reasoning automatically, without you having to ask, and it is generally better at it.',
      difficulty: 'intermediate',
    },
    {
      id: 'reasoning-4',
      categoryKey: 'reasoning',
      category: 'Reasoning & Test-time Compute',
      subtopic: 'Thinking tokens',
      question:
        'What are "thinking tokens" or a "scratchpad," and do you always get to see them?',
      answer:
        'They are the intermediate reasoning tokens a model generates to work through a problem before the final answer. You do not always see them: some reasoning models hide the detailed chain and show only a summary plus the answer. The hidden thinking is still real computation and is typically billed, even though it is not displayed.',
      plain:
        'Thinking tokens are the model\'s rough work, its scratch paper. Sometimes the app shows it to you, and sometimes it tucks it away and shows only the polished answer. Either way the model actually did that work, and you usually pay for it.',
      difficulty: 'core',
    },
    {
      id: 'reasoning-5',
      categoryKey: 'reasoning',
      category: 'Reasoning & Test-time Compute',
      subtopic: 'Self-consistency',
      question:
        'How does self-consistency use extra compute to get more reliable answers?',
      answer:
        'Self-consistency runs the model several times on the same problem with sampling, so each run can follow a different reasoning path, then takes the answer that appears most often. Agreement across independent attempts is more reliable than any single run, at the cost of running the model many times.',
      plain:
        'It is like asking several people to solve the same puzzle separately and going with the answer most of them landed on. One person might slip, but if five out of seven independent tries agree, you can trust it more. The catch is you paid for all seven tries.',
      difficulty: 'intermediate',
    },
    {
      id: 'reasoning-6',
      categoryKey: 'reasoning',
      category: 'Reasoning & Test-time Compute',
      subtopic: 'Verification',
      question:
        'Why is tool-checked reasoning more trustworthy than reasoning alone?',
      answer:
        'In tool-checked reasoning the model validates steps against ground truth (running code, querying a database, using a calculator) instead of trusting text that merely sounds right. This grounds the reasoning in real results, turning "this looks correct" into "this was actually verified," which directly counters the risk that fluent reasoning is still wrong.',
      plain:
        'It is the difference between saying "I think 17 times 23 is 391" and actually punching it into a calculator. Letting the model check its steps against something real, like running the code, beats trusting a confident-sounding paragraph.',
      difficulty: 'intermediate',
    },
    {
      id: 'reasoning-7',
      categoryKey: 'reasoning',
      category: 'Reasoning & Test-time Compute',
      subtopic: 'When reasoning helps',
      question:
        'What kinds of tasks benefit most from a reasoning model?',
      answer:
        'Tasks that genuinely require multiple dependent steps: hard math, formal logic, multi-step planning, careful debugging or code generation, and problems where the model must combine sub-results or catch its own errors. These reward the extra room to work, where a single-shot answer often fails.',
      plain:
        'Reach for reasoning when the problem has real layers, like a thorny logic puzzle, a multi-step math word problem, or planning a complex sequence. Those are exactly the cases where stopping to work it out pays off.',
      difficulty: 'core',
    },
    {
      id: 'reasoning-8',
      categoryKey: 'reasoning',
      category: 'Reasoning & Test-time Compute',
      subtopic: 'When reasoning hurts',
      question:
        'When is a reasoning model overkill or even counterproductive?',
      answer:
        'For simple lookups, short rewrites, formatting, classification, or quick conversational replies, the extra reasoning is wasted overhead: it costs more and is slower without improving the answer, and it can over-complicate a task that has a direct answer. A standard model is the better fit for easy, single-step work.',
      plain:
        'Asking a reasoning model to capitalize a sentence or answer "what is the capital of France" is like convening a committee to decide what is for lunch. You pay more and wait longer for no benefit, and sometimes it overthinks something that was simple.',
      difficulty: 'intermediate',
    },
    {
      id: 'reasoning-9',
      categoryKey: 'reasoning',
      category: 'Reasoning & Test-time Compute',
      subtopic: 'Cost of thinking',
      question:
        'Why does a reasoning model usually cost more per answer than a standard model?',
      answer:
        'It generates many extra tokens of intermediate reasoning before the final answer, and you are typically billed for those thinking tokens (often at output-token rates) in addition to the visible answer. More thinking means more tokens, which means more cost, even when the thinking is hidden from you.',
      plain:
        'You pay roughly by the amount of text the model produces, and a reasoning model produces a lot of behind-the-scenes scratch work on top of the answer. All that extra thinking shows up on the bill, even if you never see it.',
      difficulty: 'core',
    },
    {
      id: 'reasoning-10',
      categoryKey: 'reasoning',
      category: 'Reasoning & Test-time Compute',
      subtopic: 'Latency of thinking',
      question:
        'How does reasoning affect how long you wait for an answer?',
      answer:
        'Because the model generates a large amount of reasoning before the final answer, reasoning models are often noticeably slower, sometimes seconds to much longer, before useful output appears. The thinking happens first, so the delay before the answer can be substantial compared to a standard model that responds right away.',
      plain:
        'The model does its homework before answering, so you wait through the thinking. For a hard problem that wait is worth it, but if you need a snappy reply, the pause can feel long.',
      difficulty: 'intermediate',
    },
    {
      id: 'reasoning-11',
      categoryKey: 'reasoning',
      category: 'Reasoning & Test-time Compute',
      subtopic: 'Reasoning vs knowledge',
      question:
        'If a model gives a wrong answer because it lacks a fact, will switching to a reasoning model fix it?',
      answer:
        'No. Reasoning helps the model use what it already knows more carefully, but it cannot supply facts it never learned. A knowledge gap is fixed by retrieval (giving the model the relevant documents or data), not by thinking longer. More steps on missing information just produces more confident-sounding error.',
      plain:
        'Thinking harder does not help if you simply do not know the fact. If the answer depends on information the model never saw, the fix is to hand it the source, not to tell it to ponder longer. No amount of reflection recalls a phone number you never learned.',
      difficulty: 'core',
    },
    {
      id: 'reasoning-12',
      categoryKey: 'reasoning',
      category: 'Reasoning & Test-time Compute',
      subtopic: 'Limits',
      question:
        'Why does generating more reasoning steps not guarantee a correct answer?',
      answer:
        'A model can reason fluently and confidently straight to a wrong conclusion: an early mistaken assumption can propagate through every step, and longer chains give more places for errors to enter. Reasoning improves the odds on suitable problems but provides no guarantee, so outputs still need verification on anything that matters.',
      plain:
        'You can show all your work and still get the wrong answer, especially if you started from a bad assumption. More steps raise the chances of being right but never make it certain, so you still check the result.',
      difficulty: 'intermediate',
    },
    {
      id: 'reasoning-13',
      categoryKey: 'reasoning',
      category: 'Reasoning & Test-time Compute',
      subtopic: 'Faithfulness',
      question:
        'What is the "faithfulness" caveat about a model\'s written reasoning?',
      answer:
        'The reasoning text a model writes is not guaranteed to reflect how it actually arrived at its answer. The displayed chain can be a plausible-sounding rationalization rather than the true computation, so a clean, convincing chain of thought is not proof the answer is correct and should not be treated as a reliable audit trail.',
      plain:
        'The explanation the model shows you may be a nice story it tells after the fact, not a true play-by-play of how it really decided. So a tidy, persuasive chain of thought is not the same as proof, and you should not trust it just because the reasoning reads well.',
      difficulty: 'advanced',
    },
    {
      id: 'reasoning-14',
      categoryKey: 'reasoning',
      category: 'Reasoning & Test-time Compute',
      subtopic: 'Choosing a reasoning model',
      question:
        'How should you decide between a reasoning model and a standard model for a given task?',
      answer:
        'Match the tool to the task. Use a reasoning model when the problem is genuinely hard and multi-step (complex math, logic, planning, intricate code) and correctness is worth extra cost and latency. Use a standard model for simple, single-step, latency-sensitive, or high-volume work where the extra thinking adds cost and delay without improving the result.',
      plain:
        'Ask "is this actually hard, or just a quick task?" Save the slow, expensive deep-thinker for the genuinely tough problems, and use the fast standard model for everyday asks. Do not pay for deep thought you do not need.',
      difficulty: 'core',
    },
    {
      id: 'reasoning-15',
      categoryKey: 'reasoning',
      category: 'Reasoning & Test-time Compute',
      subtopic: 'Test-time compute',
      question:
        'Why is test-time compute described as a new "scaling axis" for model performance?',
      answer:
        'Historically, gains came mostly from scaling training (bigger models, more data). Test-time compute adds a second axis: for a fixed trained model you can spend more computation per question (longer reasoning, multiple sampled paths) to get better answers on hard problems. It lets you trade compute at answer time for quality, independent of making the underlying model larger.',
      plain:
        'There are now two ways to get smarter answers: build a bigger model, or let the model you have think longer when it answers. The second is a separate dial you can turn per question, spending more effort on the spot to do better.',
      difficulty: 'advanced',
    },
    {
      id: 'reasoning-16',
      categoryKey: 'reasoning',
      category: 'Reasoning & Test-time Compute',
      subtopic: 'When reasoning helps',
      question:
        'A model gets a tricky multi-step word problem wrong when asked for the answer directly. What is the simplest thing to try first?',
      answer:
        'Prompt it to reason step by step (chain-of-thought) before answering, or switch to a reasoning model. Forcing the intermediate steps lets it break the problem apart and often flips a wrong one-shot answer into a correct worked-out one, without any change to the model\'s knowledge.',
      plain:
        'Before reaching for anything fancy, just add "think it through step by step." Making the model show its work on a multi-step problem is often enough to turn a wrong guess into the right answer.',
      difficulty: 'intermediate',
    },
    {
      id: 'reasoning-17',
      categoryKey: 'reasoning',
      category: 'Reasoning & Test-time Compute',
      subtopic: 'Cost of thinking',
      question:
        'Why can the cost and latency of a reasoning model be hard to predict in advance?',
      answer:
        'The amount of reasoning is not fixed: the model decides how much thinking a problem warrants, so the number of thinking tokens (and thus cost and time) varies with problem difficulty and can be large for hard inputs. Two prompts of similar length can produce very different amounts of hidden reasoning, making per-call cost and latency variable rather than constant.',
      plain:
        'You cannot fully tell in advance how long it will mull something over, because it spends more thought on harder problems. Two questions that look the same length can cost very differently depending on how much the model decides to think.',
      difficulty: 'advanced',
    },
    {
      id: 'reasoning-18',
      categoryKey: 'reasoning',
      category: 'Reasoning & Test-time Compute',
      subtopic: 'Verification',
      question:
        'Why is pairing reasoning with verification considered more robust than scaling reasoning alone?',
      answer:
        'Reasoning alone can still reach a confident wrong answer, and adding more steps does not guarantee catching the error. Verification introduces an independent check against ground truth (a tool result, a calculation, a separate validator), so mistakes are caught by something other than the same reasoning that made them. Combining generation with a separate check is more reliable than trusting longer generation by itself.',
      plain:
        'Thinking longer and then double-checking with a real test beats just thinking longer. If the same mind that made the mistake is the only one reviewing it, errors slip by. An outside check, like running the code, catches what the reasoning missed.',
      difficulty: 'intermediate',
    },
    {
      id: 'reasoning-19',
      categoryKey: 'reasoning',
      category: 'Reasoning & Test-time Compute',
      subtopic: 'Limits',
      question:
        'Is "the model thought for a long time" a reason to trust its answer more?',
      answer:
        'Not on its own. Longer thinking can raise accuracy on suitable problems, but it can also be a long path to a wrong answer, and the visible reasoning may not be faithful to how the answer was actually produced. Trust should come from verification and grounding, not from the length or confidence of the reasoning.',
      plain:
        'A long, elaborate explanation is not proof. Someone can talk confidently for ten minutes and still be wrong. Judge the answer by whether it checks out against real sources, not by how much the model appeared to deliberate.',
      difficulty: 'core',
    },
  ],
};

export default mod;
