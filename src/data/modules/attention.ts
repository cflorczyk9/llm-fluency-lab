// Module: Attention Mechanism (tier 1). Deepened from the original deck.
// Existing cards attention-0..attention-13 are carried over verbatim with their
// original ids, summary/breakdown/video preserved. New cards attention-14..21
// extend coverage to KV cache, long-context tricks, and efficient attention.

import type { Category } from '../../types';

const mod: Category = {
  key: 'attention',
  name: 'Attention Mechanism',
  tier: 1,
  summary:
    'Attention lets a model decide, for each token, which other tokens matter. It is the engine of the transformer and the reason long context is both powerful and expensive.',
  learningObjectives: [
    'By the end you can explain self-attention as a weighted blend and contrast it with cross-attention',
    'By the end you can describe the roles of Query, Key, and Value and how relevance is scored',
    'By the end you can walk through scaling, softmax, and the weighted sum that produce attention output',
    'By the end you can explain multi-head attention and why position must be encoded separately',
    'By the end you can connect causal masking to left-to-right generation',
    'By the end you can explain the quadratic cost of attention and the ideas that reduce it',
  ],
  breakdown: [
    {
      heading: 'Self-attention: every token looks at every other token',
      video: { url: "https://www.youtube.com/watch?v=eMlx5fFNoYc", title: "Attention in transformers, step-by-step | Deep Learning Chapter 6", channel: "3Blue1Brown" },
      caption: 'Every token reads every other token and blends them by relevance. Here the word it draws most of its attention from trophy.',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 200" width="100%" preserveAspectRatio="xMidYMid meet" role="img" font-family="system-ui, -apple-system, Segoe UI, Roboto, sans-serif"><title>Self-attention: the word it attends most to trophy</title><style>@keyframes at1pulse{0%,100%{opacity:1}50%{opacity:.5}}.at1-strong{animation:at1pulse 2.4s ease-in-out infinite}@media (prefers-reduced-motion: reduce){.at1-strong{animation:none}}</style><rect x="0.5" y="0.5" width="359" height="199" rx="10" fill="#efe9da" stroke="#e6dfce"/><text x="180" y="22" text-anchor="middle" font-size="10.5" fill="#6b7280">self-attention: every token reads every other</text><path class="at1-strong" d="M256 78 Q156 26 57 78" fill="none" stroke="#2f8cff" stroke-width="3.2"/><path d="M256 78 Q194 42 133 78" fill="none" stroke="#6b7280" stroke-width="1.3"/><path d="M256 78 Q234 52 209 78" fill="none" stroke="#6b7280" stroke-width="1.3"/><rect x="28" y="78" width="58" height="26" rx="6" fill="#fff" stroke="#e6dfce"/><text x="57" y="95" text-anchor="middle" font-size="11" fill="#1c1d1f">trophy</text><rect x="100" y="78" width="66" height="26" rx="6" fill="#fff" stroke="#e6dfce"/><text x="133" y="95" text-anchor="middle" font-size="11" fill="#1c1d1f">suitcase</text><rect x="180" y="78" width="58" height="26" rx="6" fill="#fff" stroke="#e6dfce"/><text x="209" y="95" text-anchor="middle" font-size="11" fill="#1c1d1f">because</text><rect x="240" y="78" width="40" height="26" rx="6" fill="#2f8cff" fill-opacity="0.15" stroke="#2f8cff"/><text x="260" y="95" text-anchor="middle" font-size="11" font-weight="700" fill="#1c1d1f">it</text><polygon points="57,80 53,73 61,73" fill="#2f8cff"/><polygon points="133,80 129,73 137,73" fill="#6b7280"/><polygon points="209,80 205,73 213,73" fill="#6b7280"/><text x="150" y="33" text-anchor="middle" font-size="9" fill="#2f8cff">0.6</text><text x="196" y="46" text-anchor="middle" font-size="8.5" fill="#6b7280">0.2</text><text x="232" y="56" text-anchor="middle" font-size="8.5" fill="#6b7280">0.1</text><text x="180" y="130" text-anchor="middle" font-size="11" fill="#1c1d1f">the word it draws most attention from trophy</text><text x="180" y="150" text-anchor="middle" font-size="10" fill="#6b7280">self means the sentence attends to itself</text></svg>`,
      explanation:
        "Self-attention is the core operation: for each token (roughly, each word-piece) in the input, the model computes how relevant every other token is to it, then builds a new representation of that token as a blend of the others, weighted by relevance. 'Self' means the sequence attends to itself (the same sentence is both the thing asking and the thing being looked at), as opposed to cross-attention where one sequence looks at a different one. This is what lets the word 'it' in 'the trophy didn't fit in the suitcase because it was too big' get information from 'trophy' rather than 'suitcase.' Crucially, every token is processed in parallel, which is why transformers train far faster on GPUs than the older sequential RNNs they replaced.",
      keyTerms: [
        {
          term: 'token',
          definition:
            'The unit a model actually processes: a word, sub-word piece, or character. Text is split into tokens before anything else happens.',
        },
        {
          term: 'self-attention',
          definition:
            'An operation where each token in a sequence computes a weighted blend of all tokens in that same sequence, based on learned relevance.',
        },
        {
          term: 'cross-attention',
          definition:
            "Attention where one sequence (e.g. a decoder) attends to a different sequence (e.g. an encoder's output). Contrast with self-attention, which attends within one sequence.",
        },
      ],
    },
    {
      heading: 'Query, Key, and Value: the three roles every token plays',
      video: { url: "https://www.youtube.com/watch?v=UPtG_38Oq8o", title: "The math behind Attention: Keys, Queries, and Values matrices", channel: "Luis Serrano Academy" },
      caption: 'Each token becomes three views. The Query is what it looks for, the Key is its label to match, and the Value is the content it shares once matched.',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 200" width="100%" preserveAspectRatio="xMidYMid meet" role="img" font-family="system-ui, -apple-system, Segoe UI, Roboto, sans-serif"><title>Each token becomes three views: Query, Key, and Value</title><style>@keyframes at2flow{0%{transform:translateX(0)}100%{transform:translateX(212px)}}.at2-dot{animation:at2flow 3s ease-in-out infinite alternate}@media (prefers-reduced-motion: reduce){.at2-dot{animation:none}}</style><rect x="0.5" y="0.5" width="359" height="199" rx="10" fill="#efe9da" stroke="#e6dfce"/><text x="180" y="22" text-anchor="middle" font-size="11" fill="#6b7280">three learned views of one token</text><rect x="148" y="30" width="64" height="30" rx="6" fill="#fff" stroke="#1c1d1f"/><text x="180" y="50" text-anchor="middle" font-size="11" fill="#1c1d1f">token</text><line x1="180" y1="60" x2="78" y2="92" stroke="#6b7280" stroke-width="1.3"/><line x1="180" y1="60" x2="180" y2="92" stroke="#6b7280" stroke-width="1.3"/><line x1="180" y1="60" x2="282" y2="92" stroke="#6b7280" stroke-width="1.3"/><polygon points="74,95 71,88 79,89" fill="#6b7280"/><polygon points="180,95 176,88 184,88" fill="#6b7280"/><polygon points="286,95 282,89 289,88" fill="#6b7280"/><rect x="28" y="96" width="92" height="36" rx="6" fill="#fff" stroke="#2f8cff"/><text x="74" y="113" text-anchor="middle" font-size="11" font-weight="700" fill="#1c1d1f">Query</text><text x="74" y="125" text-anchor="middle" font-size="8.5" fill="#6b7280">what I look for</text><rect x="134" y="96" width="92" height="36" rx="6" fill="#fff" stroke="#0b5394"/><text x="180" y="113" text-anchor="middle" font-size="11" font-weight="700" fill="#1c1d1f">Key</text><text x="180" y="125" text-anchor="middle" font-size="8.5" fill="#6b7280">label to match</text><rect x="240" y="96" width="92" height="36" rx="6" fill="#fff" stroke="#1f7a50"/><text x="286" y="113" text-anchor="middle" font-size="11" font-weight="700" fill="#1c1d1f">Value</text><text x="286" y="125" text-anchor="middle" font-size="8.5" fill="#6b7280">content I give</text><circle class="at2-dot" cx="74" cy="142" r="3.5" fill="#2f8cff"/><rect x="28" y="152" width="304" height="28" rx="6" fill="#efe9da" stroke="#e6dfce"/><text x="180" y="170" text-anchor="middle" font-size="10.5" fill="#1c1d1f">Query · Key → match score → weight the Value</text></svg>`,
      explanation:
        "To compute relevance, each token is projected into three different vectors by three learned weight matrices: a Query (what this token is looking for), a Key (what this token offers as a label others can match against), and a Value (the actual content this token contributes if it gets attended to). The mental model is a soft dictionary lookup: a token's Query is compared against every token's Key to score the match, and those scores decide how much of each token's Value to pull in. The comparison is a dot product (multiply the two vectors element-wise and sum), so a high dot product means 'this Query and this Key point in a similar direction, so they are relevant to each other.' Q, K, and V are not three different inputs; they are three learned views of the same tokens.",
      keyTerms: [
        {
          term: 'Query (Q)',
          definition:
            'A vector representing what a token is searching for. It gets compared against every Key to produce relevance scores.',
        },
        {
          term: 'Key (K)',
          definition:
            "A vector that acts as a token's matchable label. A token's Key is scored against other tokens' Queries to decide relevance.",
        },
        {
          term: 'Value (V)',
          definition:
            'A vector holding the content a token actually passes along. The output is a weighted sum of Values, weighted by attention scores.',
        },
        {
          term: 'dot product',
          definition:
            'Multiplying two vectors element-wise and summing the results. Used here to score how aligned a Query and a Key are: higher means more relevant.',
        },
      ],
    },
    {
      heading: 'From scores to output: scaling, softmax, and the weighted sum',
      video: { url: "https://www.youtube.com/watch?v=bcGpt2e56Ek", title: "Scaled Dot Product Attention Explained + Implemented", channel: "Uygar Kurt" },
      caption: 'Match scores are scaled down, passed through softmax into weights that sum to 1, then used to blend the Values into one new vector per token.',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 200" width="100%" preserveAspectRatio="xMidYMid meet" role="img" font-family="system-ui, -apple-system, Segoe UI, Roboto, sans-serif"><title>Attention pipeline: scale scores, softmax to weights, blend the Values</title><style>@keyframes at3flow{0%{transform:translateX(0)}100%{transform:translateX(326px)}}.at3-dot{animation:at3flow 4s linear infinite}@media (prefers-reduced-motion: reduce){.at3-dot{animation:none}}</style><rect x="0.5" y="0.5" width="359" height="199" rx="10" fill="#efe9da" stroke="#e6dfce"/><text x="180" y="20" text-anchor="middle" font-size="10.5" fill="#6b7280">scale the scores, softmax to weights, blend the Values</text><rect x="12" y="38" width="76" height="40" rx="6" fill="#fff" stroke="#e6dfce"/><text x="50" y="62" text-anchor="middle" font-size="10" fill="#1c1d1f">Q·K scores</text><rect x="100" y="38" width="58" height="40" rx="6" fill="#fff" stroke="#e6dfce"/><text x="129" y="62" text-anchor="middle" font-size="10" fill="#1c1d1f">÷ √d_k</text><rect x="170" y="38" width="64" height="40" rx="6" fill="#fff" stroke="#2f8cff"/><text x="202" y="62" text-anchor="middle" font-size="10" fill="#1c1d1f">softmax</text><rect x="246" y="38" width="98" height="40" rx="6" fill="#fff" stroke="#1f7a50"/><text x="295" y="62" text-anchor="middle" font-size="9.5" fill="#1c1d1f">weighted Σ of V</text><line x1="88" y1="58" x2="98" y2="58" stroke="#6b7280" stroke-width="1.3"/><polygon points="100,58 94,55 94,61" fill="#6b7280"/><line x1="158" y1="58" x2="168" y2="58" stroke="#6b7280" stroke-width="1.3"/><polygon points="170,58 164,55 164,61" fill="#6b7280"/><line x1="234" y1="58" x2="244" y2="58" stroke="#6b7280" stroke-width="1.3"/><polygon points="246,58 240,55 240,61" fill="#6b7280"/><line x1="202" y1="78" x2="202" y2="100" stroke="#6b7280" stroke-width="1.3"/><polygon points="202,102 199,96 205,96" fill="#6b7280"/><rect x="184" y="106" width="12" height="46" rx="1.5" fill="#2f8cff"/><rect x="200" y="128" width="12" height="24" rx="1.5" fill="#2f8cff" opacity="0.8"/><rect x="216" y="142" width="12" height="10" rx="1.5" fill="#2f8cff" opacity="0.6"/><text x="206" y="166" text-anchor="middle" font-size="9" fill="#6b7280">weights sum to 1</text><line x1="295" y1="78" x2="295" y2="112" stroke="#6b7280" stroke-width="1.3"/><polygon points="295,114 292,108 298,108" fill="#6b7280"/><rect x="287" y="116" width="16" height="34" rx="2" fill="#1f7a50" opacity="0.85"/><text x="295" y="166" text-anchor="middle" font-size="9" fill="#6b7280">new vector</text><circle class="at3-dot" cx="14" cy="58" r="3.5" fill="#2f8cff"/></svg>`,
      explanation:
        "The raw Query-Key dot products are first divided by the square root of the key dimension (this 'scaling' keeps the numbers from getting so large that the next step saturates and stops learning). Then a softmax turns each token's row of scores into positive weights that add up to 1, so they read as 'spend 60% of your attention here, 30% there, 10% elsewhere.' Finally the model takes a weighted sum of all the Value vectors using those weights, producing one new vector per token. The whole thing is the famous formula softmax(QK^T / sqrt(d_k)) V. The key intuition: attention is a soft, learned average. Nothing is hard-selected; every token contributes a little, and learning shapes the weights.",
      keyTerms: [
        {
          term: 'softmax',
          definition:
            'A function that turns a list of raw scores into positive weights that sum to 1, so they can be read as proportions of attention to spend.',
        },
        {
          term: 'scaling (1/sqrt(d_k))',
          definition:
            "Dividing the dot-product scores by the square root of the key vector's dimension. Prevents large values from pushing softmax into a region where gradients vanish.",
        },
        {
          term: 'weighted sum',
          definition:
            "The final attention output: each token's new vector is the sum of all Value vectors, each multiplied by its attention weight.",
        },
      ],
    },
    {
      heading: 'Multi-head attention and why position must be added in',
      video: { url: "https://www.youtube.com/watch?v=mMa2PmYJlCo", title: "Visual Guide to Transformer Neural Networks - (Episode 2) Multi-Head & Self-Attention", channel: "Hedu AI by Batool Haider" },
      caption: 'Several heads run at once, each with its own Query, Key, and Value, so they can track different relationships. Their outputs are joined and word order is added separately.',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 200" width="100%" preserveAspectRatio="xMidYMid meet" role="img" font-family="system-ui, -apple-system, Segoe UI, Roboto, sans-serif"><title>Multi-head attention: parallel heads, each with its own Q/K/V, then combined</title><style>@keyframes at4pulse{0%,100%{opacity:.35}50%{opacity:1}}.at4-h1{animation:at4pulse 2.1s ease-in-out infinite}.at4-h2{animation:at4pulse 2.1s ease-in-out infinite .35s}.at4-h3{animation:at4pulse 2.1s ease-in-out infinite .7s}@media (prefers-reduced-motion: reduce){.at4-h1,.at4-h2,.at4-h3{animation:none;opacity:1}}</style><rect x="0.5" y="0.5" width="359" height="199" rx="10" fill="#efe9da" stroke="#e6dfce"/><text x="180" y="20" text-anchor="middle" font-size="10.5" fill="#6b7280">many heads in parallel, each with its own Q/K/V</text><rect x="14" y="86" width="52" height="30" rx="6" fill="#fff" stroke="#1c1d1f"/><text x="40" y="105" text-anchor="middle" font-size="10" fill="#1c1d1f">input</text><line x1="66" y1="101" x2="102" y2="50" stroke="#6b7280" stroke-width="1.2"/><line x1="66" y1="101" x2="102" y2="96" stroke="#6b7280" stroke-width="1.2"/><line x1="66" y1="101" x2="102" y2="142" stroke="#6b7280" stroke-width="1.2"/><rect x="104" y="36" width="124" height="28" rx="6" fill="#fff" stroke="#2f8cff"/><text x="166" y="54" text-anchor="middle" font-size="9.5" fill="#1c1d1f">Head 1: subject/verb</text><rect x="104" y="82" width="124" height="28" rx="6" fill="#fff" stroke="#0b5394"/><text x="166" y="100" text-anchor="middle" font-size="9.5" fill="#1c1d1f">Head 2: pronoun link</text><rect x="104" y="128" width="124" height="28" rx="6" fill="#fff" stroke="#1f7a50"/><text x="166" y="146" text-anchor="middle" font-size="9.5" fill="#1c1d1f">Head 3: long-range</text><circle class="at4-h1" cx="236" cy="50" r="3" fill="#2f8cff"/><circle class="at4-h2" cx="236" cy="96" r="3" fill="#0b5394"/><circle class="at4-h3" cx="236" cy="142" r="3" fill="#1f7a50"/><line x1="240" y1="50" x2="250" y2="92" stroke="#6b7280" stroke-width="1.2"/><line x1="240" y1="96" x2="250" y2="98" stroke="#6b7280" stroke-width="1.2"/><line x1="240" y1="142" x2="250" y2="106" stroke="#6b7280" stroke-width="1.2"/><rect x="250" y="78" width="80" height="44" rx="8" fill="#fff" stroke="#1c1d1f"/><text x="290" y="98" text-anchor="middle" font-size="10" font-weight="600" fill="#1c1d1f">concat</text><text x="290" y="112" text-anchor="middle" font-size="9" fill="#6b7280">+ mix</text><line x1="330" y1="100" x2="344" y2="100" stroke="#6b7280" stroke-width="1.3"/><polygon points="346,100 339,96.5 339,103.5" fill="#6b7280"/><text x="180" y="190" text-anchor="middle" font-size="10" fill="#6b7280">word order is added separately (RoPE rotates Q and K)</text></svg>`,
      explanation:
        "One attention calculation can only capture one kind of relationship at a time. Multi-head attention runs several attention operations (heads) in parallel, each with its own learned Q/K/V matrices, so different heads can specialize: one might track grammatical subject-verb links, another might track which pronoun refers to what. Their outputs are concatenated and mixed back together. Separately, attention has a structural blind spot: because it is a weighted sum over a set, it has no built-in sense of order, so 'dog bites man' and 'man bites dog' would look identical to it. To fix this, position information is injected into the token representations (positional encoding). Modern LLMs mostly use rotary position embeddings (RoPE), which encode position by rotating the Query and Key vectors by an amount that depends on where the token sits, baking relative distance directly into the attention score.",
      keyTerms: [
        {
          term: 'multi-head attention',
          definition:
            'Running several independent attention operations in parallel, each with its own Q/K/V projections, then combining them. Lets the model attend to different relationship types at once.',
        },
        {
          term: 'attention head',
          definition:
            'One of the parallel attention operations inside multi-head attention. Each head learns to focus on a different aspect of the relationships between tokens.',
        },
        {
          term: 'positional encoding',
          definition:
            'Information added so the model knows token order, which raw attention ignores. Without it, the model treats the input as an unordered bag.',
        },
        {
          term: 'rotary position embedding (RoPE)',
          definition:
            'The dominant modern scheme: it rotates Query and Key vectors by an angle based on position, encoding relative distance directly into attention scores.',
        },
      ],
    },
    {
      heading: 'Causal masking and the quadratic cost',
      video: { url: "https://www.youtube.com/watch?v=piT1_k8b9uM", title: "Transformers - Part 7 - Decoder (2): masked self-attention", channel: "Lennart Svensson" },
      caption: 'Each token can attend only to itself and earlier tokens, so the upper half is masked. Because every token compares with every token, cost grows with the square of the length.',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 200" width="100%" preserveAspectRatio="xMidYMid meet" role="img" font-family="system-ui, -apple-system, Segoe UI, Roboto, sans-serif"><title>Causal mask blocks future tokens, and attention cost grows with the square of length</title><style>@keyframes at5draw{0%{stroke-dashoffset:180}100%{stroke-dashoffset:0}}.at5-curve{stroke-dasharray:180;animation:at5draw 3s ease-in-out infinite}@media (prefers-reduced-motion: reduce){.at5-curve{animation:none;stroke-dashoffset:0}}</style><rect x="0.5" y="0.5" width="359" height="199" rx="10" fill="#efe9da" stroke="#e6dfce"/><text x="83" y="38" text-anchor="middle" font-size="8.5" fill="#6b7280">key (attended to) →</text><text x="30" y="90" text-anchor="middle" font-size="8.5" fill="#6b7280" transform="rotate(-90 30 90)">query</text><polygon points="40,46 57,46 57,63 74,63 74,80 91,80 91,97 108,97 108,114 125,114 125,131 40,131" fill="#2f8cff" fill-opacity="0.18"/><rect x="40" y="46" width="85" height="85" fill="none" stroke="#e6dfce"/><line x1="57" y1="46" x2="57" y2="131" stroke="#e6dfce"/><line x1="74" y1="46" x2="74" y2="131" stroke="#e6dfce"/><line x1="91" y1="46" x2="91" y2="131" stroke="#e6dfce"/><line x1="108" y1="46" x2="108" y2="131" stroke="#e6dfce"/><line x1="40" y1="63" x2="125" y2="63" stroke="#e6dfce"/><line x1="40" y1="80" x2="125" y2="80" stroke="#e6dfce"/><line x1="40" y1="97" x2="125" y2="97" stroke="#e6dfce"/><line x1="40" y1="114" x2="125" y2="114" stroke="#e6dfce"/><text x="64" y="124" text-anchor="middle" font-size="8" fill="#2f8cff">allowed</text><text x="102" y="58" text-anchor="middle" font-size="8" fill="#6b7280">masked</text><text x="252" y="50" text-anchor="middle" font-size="12" font-weight="700" fill="#1c1d1f">Causal mask</text><text x="252" y="68" text-anchor="middle" font-size="9.5" fill="#6b7280">see self and earlier only</text><text x="252" y="82" text-anchor="middle" font-size="9" fill="#6b7280">future set to −∞ before softmax</text><line x1="182" y1="170" x2="330" y2="170" stroke="#6b7280" stroke-width="1"/><line x1="182" y1="170" x2="182" y2="100" stroke="#6b7280" stroke-width="1"/><path class="at5-curve" d="M182 168 Q272 166 326 104" fill="none" stroke="#dc2626" stroke-width="2"/><text x="300" y="98" text-anchor="middle" font-size="9.5" fill="#dc2626">cost ∝ n²</text><text x="256" y="186" text-anchor="middle" font-size="8.5" fill="#6b7280">context length n</text></svg>`,
      explanation:
        "Generative LLMs predict the next token, so during training a token must not be allowed to peek at tokens that come after it (that would be cheating, seeing the answer). Causal masking enforces this by setting the attention scores for all future positions to negative infinity before the softmax, which drives their weights to zero. This is why these models are 'left-to-right' and why a decoder-only transformer can be trained on all positions at once while still respecting order. The catch is cost: because every token attends to every other token, the attention step scales with the square of the sequence length (n tokens means roughly n-by-n comparisons). Double the context and you roughly quadruple this work, which is the core reason long context windows are expensive and why a whole research area (sparse, sliding-window, and FlashAttention-style efficient attention) exists to soften that curve.",
      keyTerms: [
        {
          term: 'causal masking',
          definition:
            'Blocking each token from attending to later tokens by setting future scores to negative infinity before softmax. Makes generation strictly left-to-right.',
        },
        {
          term: 'decoder-only transformer',
          definition:
            'The architecture of modern generative LLMs: a stack of self-attention layers with causal masking that predicts the next token.',
        },
        {
          term: 'quadratic cost (O(n^2))',
          definition:
            'Attention compute and memory grow with the square of sequence length n, because every token compares against every token. The reason long context is expensive.',
        },
        {
          term: 'FlashAttention',
          definition:
            'An efficient implementation of exact attention that reorders the computation to use far less memory and run faster, without changing the math or the result.',
        },
      ],
    },
  ],
  video: {
    url: 'https://www.youtube.com/watch?v=eMlx5fFNoYc',
    title: 'Attention in transformers, step-by-step',
    channel: '3Blue1Brown',
  },
  cards: [
    {
      id: 'attention-0',
      categoryKey: 'attention',
      category: 'Attention Mechanism',
      subtopic: 'Self-attention basics',
      question: 'In self-attention, what does each token actually produce as its output?',
      answer:
        'A new vector that is a weighted sum (a learned blend) of the Value vectors of all tokens in the sequence, where the weights reflect how relevant each other token is to it.',
      plain:
        "Each word ends up with a fresh summary of itself that mixes in a little from every other word, paying more attention to the words that matter most. It is like rewriting a person's bio after letting them absorb hints from everyone else in the room.",
      difficulty: 'core',
    },
    {
      id: 'attention-1',
      categoryKey: 'attention',
      category: 'Attention Mechanism',
      subtopic: 'Self-attention basics',
      question: 'What is the difference between self-attention and cross-attention?',
      answer:
        'In self-attention a sequence attends to itself (Queries, Keys, and Values all come from the same tokens). In cross-attention the Queries come from one sequence while the Keys and Values come from a different one, letting one sequence look at another.',
      plain:
        'Self-attention is a sentence studying its own words; cross-attention is one document looking over at a different document for answers. Think of editing your essay by rereading it (self) versus editing it while consulting a separate source article (cross).',
      difficulty: 'intermediate',
    },
    {
      id: 'attention-2',
      categoryKey: 'attention',
      category: 'Attention Mechanism',
      subtopic: 'Query/Key/Value',
      question:
        'Name the three vectors each token is projected into for attention, and state what each one represents.',
      answer:
        'Query (what this token is looking for), Key (the matchable label this token offers), and Value (the actual content this token contributes when attended to).',
      plain:
        'Picture online dating: the Query is what you are searching for, the Key is the profile tag others use to match you, and the Value is the actual content you bring once matched. Every word carries all three at once.',
      difficulty: 'core',
    },
    {
      id: 'attention-3',
      categoryKey: 'attention',
      category: 'Attention Mechanism',
      subtopic: 'Query/Key/Value',
      question: 'Q, K, and V come from where, and how are they derived from a token?',
      answer:
        'All three come from the same input tokens. Each is produced by multiplying the token\'s representation by a separate learned weight matrix, so Q/K/V are three different learned views of the same token, not three different inputs.',
      plain:
        'All three start from the very same word and are just three different filters applied to it, like running one photo through three Instagram presets. They are three angles on one thing, not three separate things.',
      difficulty: 'intermediate',
    },
    {
      id: 'attention-4',
      categoryKey: 'attention',
      category: 'Attention Mechanism',
      subtopic: 'Scoring',
      question: 'How does attention measure how relevant one token is to another?',
      answer:
        'It takes the dot product of the first token\'s Query with the second token\'s Key. A larger dot product means the two vectors point in a more similar direction, which is read as higher relevance.',
      plain:
        "It checks how well one word's 'looking for' matches another word's 'label,' and a closer match scores higher. It is like swiping right when a search and a profile clearly line up.",
      difficulty: 'core',
    },
    {
      id: 'attention-5',
      categoryKey: 'attention',
      category: 'Attention Mechanism',
      subtopic: 'Scoring',
      question: 'What does the softmax step do in attention, and why is it needed?',
      answer:
        'It converts each token\'s row of raw relevance scores into positive weights that sum to 1. This makes them interpretable as proportions of attention to spend across the other tokens, and ensures the output is a proper weighted average of Values.',
      plain:
        "It turns a messy pile of raw scores into clean percentages that add up to 100%, like splitting a budget across categories. That way the word can say 'I'll spend 60% of my attention here and 40% there.'",
      difficulty: 'core',
    },
    {
      id: 'attention-6',
      categoryKey: 'attention',
      category: 'Attention Mechanism',
      subtopic: 'Scoring',
      question:
        'Why are the Query-Key dot products divided by the square root of the key dimension before softmax?',
      answer:
        'In high dimensions the dot products can grow large, which pushes softmax into a saturated region where outputs are near 0 or 1 and gradients nearly vanish. Scaling by 1/sqrt(d_k) keeps the values in a range where learning still works.',
      plain:
        "If the raw scores get too big, the model becomes overconfident and stops learning, like a volume knob blasted so loud you can't hear any difference between songs. Dividing the scores down keeps them in a sane range so the model can still tell good guesses from bad and keep improving.",
      difficulty: 'advanced',
    },
    {
      id: 'attention-7',
      categoryKey: 'attention',
      category: 'Attention Mechanism',
      subtopic: 'Multi-head attention',
      question:
        'What problem does multi-head attention solve that a single attention operation cannot?',
      answer:
        'A single attention can only capture one type of relationship at a time. Multiple heads, each with their own Q/K/V projections, run in parallel so different heads can specialize (e.g. one tracks subject-verb links, another tracks pronoun reference), then their outputs are combined.',
      plain:
        "One reader can only chase one kind of connection at a time, so the model uses several readers in parallel, each looking for a different pattern. It is like a study group where one person tracks grammar, another tracks who 'she' refers to, and they pool notes.",
      difficulty: 'core',
    },
    {
      id: 'attention-8',
      categoryKey: 'attention',
      category: 'Attention Mechanism',
      subtopic: 'Multi-head attention',
      question:
        'After the separate attention heads each produce an output, how are those outputs combined?',
      answer:
        "The heads' output vectors are concatenated, then passed through a final learned linear projection that mixes them back into a single output vector per token.",
      plain:
        "Each reader's notes get stapled together, then run through one final blender so the model gets a single combined takeaway per word. Many separate findings in, one merged summary out.",
      difficulty: 'intermediate',
    },
    {
      id: 'attention-9',
      categoryKey: 'attention',
      category: 'Attention Mechanism',
      subtopic: 'Positional encoding',
      question:
        'Why does attention need positional encoding added, and what would go wrong without it?',
      answer:
        "Raw attention is a weighted sum over an unordered set, so it has no inherent sense of token order. Without positional information, 'dog bites man' and 'man bites dog' would be indistinguishable to the model.",
      plain:
        "On its own, attention sees the words as a jumbled bag with no sense of which came first, so 'dog bites man' and 'man bites dog' look the same. Position info is like numbering the words so order is preserved.",
      difficulty: 'intermediate',
    },
    {
      id: 'attention-10',
      categoryKey: 'attention',
      category: 'Attention Mechanism',
      subtopic: 'Positional encoding',
      question: 'What is rotary position embedding (RoPE) and how does it encode position?',
      answer:
        "RoPE is the dominant modern positional scheme. It rotates each token's Query and Key vectors by an angle that depends on the token's position, which bakes relative distance between tokens directly into their dot-product attention scores.",
      plain:
        "RoPE is today's go-to trick for telling the model word order: it spins each word's data by an angle set by its spot in the line, like setting each word to a slightly different clock position. Because the spin depends on position, the model can feel how far apart two words are just from comparing them.",
      difficulty: 'advanced',
    },
    {
      id: 'attention-11',
      categoryKey: 'attention',
      category: 'Attention Mechanism',
      subtopic: 'Causal masking',
      question: 'How does causal masking work mechanically, and what behavior does it enforce?',
      answer:
        'Before softmax, the attention scores for all future positions are set to negative infinity, so their softmax weights become zero. This stops each token from attending to later tokens, enforcing strictly left-to-right (next-token) prediction.',
      plain:
        "The model covers up all the words that come after the current one so it can't peek at the answer while guessing, like a teacher hiding the rest of the sentence. This forces it to work strictly left to right, predicting one next word at a time.",
      difficulty: 'intermediate',
    },
    {
      id: 'attention-12',
      categoryKey: 'attention',
      category: 'Attention Mechanism',
      subtopic: 'Quadratic cost',
      question: 'Why does the cost of attention scale quadratically with sequence length?',
      answer:
        'Every token computes a relevance score against every other token, so for n tokens there are roughly n-by-n comparisons. Doubling the context length roughly quadruples the attention compute and memory, which is the core reason long context windows are expensive.',
      plain:
        'Every word has to compare itself with every other word, so the work balloons fast: like a party where everyone must shake hands with everyone, doubling the guests roughly quadruples the handshakes. That is why feeding in a very long prompt costs so much more.',
      difficulty: 'core',
    },
    {
      id: 'attention-13',
      categoryKey: 'attention',
      category: 'Attention Mechanism',
      subtopic: 'Quadratic cost',
      question:
        "Does FlashAttention change attention's quadratic computational complexity, and what does it actually improve?",
      answer:
        'No, it still computes exact attention with the same O(n^2) compute complexity. It improves speed and especially memory use by reordering the computation so it never materializes the full n-by-n score matrix, giving identical results faster and with far less memory.',
      plain:
        'FlashAttention gives the exact same answer but computes it in a smarter order, so it runs faster and uses far less memory, like a chef prepping ingredients in batches instead of cluttering the whole counter at once. It does not reduce the underlying amount of comparison work, just how cleverly that work is handled.',
      difficulty: 'advanced',
    },
    {
      id: 'attention-14',
      categoryKey: 'attention',
      category: 'Attention Mechanism',
      subtopic: 'The weighted sum output',
      question: "Why is attention called a 'soft' selection instead of a 'hard' one?",
      answer:
        'A hard selection would pick exactly one token and ignore the rest. Attention instead spreads weights that sum to 1 across all tokens, so every token contributes something and the output is a smooth blend. Because the weights are continuous rather than all-or-nothing, the model can learn them gradually with gradient descent.',
      plain:
        'Hard selection is picking one channel and muting all the others. Soft selection is a mixing board where every channel stays a little bit audible and the model slides the faders. Keeping everything partly on is what lets the model slowly learn the right mix instead of flipping switches.',
      difficulty: 'core',
    },
    {
      id: 'attention-15',
      categoryKey: 'attention',
      category: 'Attention Mechanism',
      subtopic: 'KV cache',
      question:
        'When a model generates text one token at a time, why does it cache the Keys and Values of earlier tokens?',
      answer:
        'Each new token must attend to all previous tokens, and the Keys and Values of those earlier tokens do not change as generation continues. Storing them (the KV cache) avoids recomputing them at every step, so adding the next token only requires computing that one token\'s Q/K/V and attending over the stored cache.',
      plain:
        "The earlier words' notes never change once written, so the model jots them down once and reuses them instead of rewriting the whole notebook for every new word. Those saved notes are the KV cache, and they are why long conversations eat a lot of memory even though each new word is cheap to add.",
      difficulty: 'intermediate',
    },
    {
      id: 'attention-16',
      categoryKey: 'attention',
      category: 'Attention Mechanism',
      subtopic: 'Long-context tricks',
      question:
        'What is sliding-window (local) attention, and what does it trade away to handle long inputs cheaply?',
      answer:
        'Sliding-window attention restricts each token to attend only to a fixed number of nearby tokens (a local window) instead of the whole sequence, so cost grows roughly linearly with length rather than quadratically. The trade-off is that a single layer can no longer directly connect very distant tokens, though stacking layers lets information travel further step by step.',
      plain:
        'Instead of letting every word talk to every other word, each word only chats with its neighbors within a set distance, like only hearing the people seated near you at a long table. That is far cheaper for long inputs, but distant words can only reach each other indirectly, passed along layer by layer like a message down the table.',
      difficulty: 'intermediate',
    },
    {
      id: 'attention-17',
      categoryKey: 'attention',
      category: 'Attention Mechanism',
      subtopic: 'Grouped-query attention',
      question: 'What is grouped-query attention (GQA), and which cost does it mainly reduce?',
      answer:
        'GQA lets several Query heads share one set of Key and Value heads instead of every head having its own. This shrinks the KV cache that must be stored and read during generation, cutting memory and bandwidth cost with little quality loss. It sits between full multi-head attention (separate K/V per head) and multi-query attention (one shared K/V for all heads).',
      plain:
        'Normally every reader keeps a full personal copy of the notes. GQA has small groups of readers share one copy, so there are far fewer notebooks to store and flip through while generating. It saves a lot of memory while barely hurting quality, which is why many recent models use it.',
      difficulty: 'intermediate',
    },
    {
      id: 'attention-18',
      categoryKey: 'attention',
      category: 'Attention Mechanism',
      subtopic: 'Context window',
      question: "What is a model's 'context window,' and how does it connect to attention?",
      answer:
        'The context window is the maximum number of tokens the model can attend over at once (prompt plus generated output). It exists because attention compares tokens against one another, and both the compute and the stored Keys and Values grow with how many tokens are in play. Beyond the window the model has no mechanism to see the tokens at all.',
      plain:
        "The context window is the model's field of view, the most words it can hold in mind at one time. Anything that scrolls past the edge is simply gone, because attention can only compare words still inside the window. A bigger window means more to juggle, which is why it costs more.",
      difficulty: 'core',
    },
    {
      id: 'attention-19',
      categoryKey: 'attention',
      category: 'Attention Mechanism',
      subtopic: 'Interpretability',
      question:
        'Common misconception: do high attention weights reliably tell us why a model produced a given answer?',
      answer:
        'Not reliably. Attention weights show where one layer\'s heads spread their focus, which is suggestive, but a model has many layers and heads, and the Value vectors plus later computation also shape the output. Research has shown attention maps can be altered without changing the prediction, so they are a useful hint, not a faithful explanation.',
      plain:
        "It is tempting to read the attention highlights as the model 'showing its work,' but that is only one slice of a deep stack of computation. Two different highlight patterns can give the same answer, so treat attention maps as a loose clue about focus, not a confession of the real reasoning.",
      difficulty: 'intermediate',
    },
    {
      id: 'attention-20',
      categoryKey: 'attention',
      category: 'Attention Mechanism',
      subtopic: 'Multi-head attention',
      question:
        'In multi-head attention, why does each head usually operate on a smaller vector than the full model dimension?',
      answer:
        "The model's full dimension is split across the heads, so with h heads each head works in a slice of size about d_model / h. This lets several heads run in parallel for roughly the same total compute as one full-size attention, while still letting each head specialize on a different relationship.",
      plain:
        "The model's information is divided into lanes, one per head, so eight heads each handle about one-eighth of the width. You get several specialists for roughly the price of one generalist, because the total work is split up rather than multiplied.",
      difficulty: 'core',
    },
    {
      id: 'attention-21',
      categoryKey: 'attention',
      category: 'Attention Mechanism',
      subtopic: 'Efficient attention',
      question:
        'Compare FlashAttention with approximate methods like sliding-window attention: do they both change the result?',
      answer:
        'No. FlashAttention computes exact standard attention, just in a memory-smart order, so it gives identical results faster. Sliding-window and other sparse or linear methods are approximations: they skip some token-to-token comparisons to save cost, which changes the result in exchange for handling longer inputs more cheaply.',
      plain:
        'FlashAttention is a faster route to the exact same destination, no shortcuts on accuracy. Sliding-window attention is an actual shortcut that skips some stops to save time, so you arrive at a slightly different place. One speeds up the math, the other simplifies it.',
      difficulty: 'core',
    },
  ],
};

export default mod;
