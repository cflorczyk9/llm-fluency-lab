// Module: Retrieval-Augmented Generation (RAG)
// Mode: deepen. Existing video, breakdown, and cards rag-0..rag-13 are carried
// over verbatim from the original deck; rag-14..rag-21 and one breakdown section
// are new, plus tier and learningObjectives.

import type { Category } from '../../types';

const mod: Category = {
  "key": "rag",
  "name": "Retrieval-Augmented Generation (RAG)",
  "tier": 2,
  "summary": "RAG feeds a model the relevant documents at question time so its answers are grounded in your data and can cite their sources, all without retraining the model. It is the default way to give a model private or fresh knowledge, and the single highest-leverage technique for cutting hallucinations on factual lookups.",
  "learningObjectives": [
    "By the end you can explain why RAG exists and what problems it solves compared with fine-tuning",
    "By the end you can describe the retrieve-then-generate pipeline end to end",
    "By the end you can explain chunking, embeddings, and vector search in plain terms",
    "By the end you can distinguish semantic, keyword, and hybrid retrieval and when to use each",
    "By the end you can describe reranking, citations, and grounding and how they reduce hallucination",
    "By the end you can diagnose common RAG failures like bad chunks, stale indexes, and retrieval misses"
  ],
  "breakdown": [
    {
      "heading": "The core RAG loop: retrieve, then generate",
      "video": { "url": "https://www.youtube.com/watch?v=T-D1OfcDW1M", "title": "What is Retrieval-Augmented Generation (RAG)?", "channel": "IBM Technology" },
      "explanation": "A model only knows two things: what it learned in training (its weights) and what you put in the prompt right now (its context window). RAG is a pattern that fills the context window with relevant source text fetched at question time. The loop is: (1) ahead of time, chop your documents into chunks and store them in a searchable index; (2) when a question comes in, search that index for the chunks most likely to contain the answer; (3) stuff the top few chunks into the prompt along with the question and an instruction like 'answer using only the provided context.' The model then reads those chunks and writes the answer. The model is doing the same thing it always does, generating the next tokens, but now the relevant facts are sitting right in front of it instead of being half-remembered from training. This is why RAG fixes staleness (you can index a document from this morning) and cuts hallucination (the answer is anchored to text you supplied).",
      "caption": "A question first goes to the search index to pull the most relevant chunks, then those chunks plus the question go to the model, which writes a grounded answer.",
      "svg": '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 200" width="100%" preserveAspectRatio="xMidYMid meet" role="img" font-family="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif" font-size="12" fill="#1c1d1f"><title>The RAG loop: retrieve relevant chunks, then generate a grounded answer</title><style>@keyframes rag1flow{0%{transform:translateX(0)}100%{transform:translateX(330px)}}.rag1dot{animation:rag1flow 3.4s ease-in-out infinite}@media (prefers-reduced-motion:reduce){.rag1dot{animation:none}}</style><defs><marker id="rag1ah" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="#0b5394"/></marker></defs><text x="96" y="20" font-size="11" font-weight="600" fill="#6b7280" text-anchor="middle">RETRIEVE</text><text x="276" y="20" font-size="11" font-weight="600" fill="#6b7280" text-anchor="middle">GENERATE</text><line x1="186" y1="30" x2="186" y2="168" stroke="#e6dfce" stroke-width="1.5" stroke-dasharray="4 4"/><text x="84" y="66" text-anchor="middle" font-size="9.5" fill="#6b7280">search</text><text x="188" y="66" text-anchor="middle" font-size="9.5" fill="#6b7280">top chunks</text><text x="281" y="66" text-anchor="middle" font-size="9.5" fill="#6b7280">grounded</text><rect x="8" y="74" width="62" height="46" rx="8" fill="#fff" stroke="#e6dfce" stroke-width="1.5"/><text x="39" y="101" text-anchor="middle">Question</text><rect x="100" y="74" width="74" height="46" rx="8" fill="#efe9da" stroke="#e6dfce" stroke-width="1.5"/><text x="137" y="93" text-anchor="middle" font-size="11">Index</text><line x1="112" y1="102" x2="162" y2="102" stroke="#6b7280" stroke-width="1"/><line x1="112" y1="108" x2="162" y2="108" stroke="#6b7280" stroke-width="1"/><line x1="112" y1="114" x2="150" y2="114" stroke="#6b7280" stroke-width="1"/><rect x="204" y="74" width="64" height="46" rx="8" fill="#fff" stroke="#2f8cff" stroke-width="1.5"/><text x="236" y="101" text-anchor="middle">Model</text><rect x="296" y="74" width="56" height="46" rx="8" fill="#fff" stroke="#e6dfce" stroke-width="1.5"/><text x="324" y="101" text-anchor="middle" font-size="11">Answer</text><line x1="70" y1="97" x2="98" y2="97" stroke="#0b5394" stroke-width="2" marker-end="url(#rag1ah)"/><line x1="174" y1="97" x2="202" y2="97" stroke="#0b5394" stroke-width="2" marker-end="url(#rag1ah)"/><line x1="268" y1="97" x2="294" y2="97" stroke="#0b5394" stroke-width="2" marker-end="url(#rag1ah)"/><circle class="rag1dot" cx="14" cy="146" r="4" fill="#2f8cff"/><text x="180" y="186" text-anchor="middle" font-size="10" fill="#6b7280">relevant text is fetched at question time, weights never change</text></svg>',
      "keyTerms": [
        {
          "term": "Retrieval",
          "definition": "The search step: given a question, find the chunks in your index most likely to answer it. This happens before the model is called."
        },
        {
          "term": "Grounding",
          "definition": "Constraining the model's answer to the supplied source text rather than its trained-in knowledge, usually via both the retrieved context and an instruction to use only that context."
        },
        {
          "term": "Context window",
          "definition": "The total amount of text (prompt plus generated output) a model can process in one call, measured in tokens. Retrieved chunks compete for this finite space."
        }
      ]
    },
    {
      "heading": "Chunking: how you cut up your documents",
      "video": { "url": "https://www.youtube.com/watch?v=pIGRwMjhMaQ", "title": "Chunking Strategies in RAG: Optimising Data for Advanced AI Responses", "channel": "Mervin Praison" },
      "explanation": "You cannot index a whole 80-page PDF as one unit, because retrieval needs to return pieces small enough to be relevant and to fit in the prompt alongside other chunks. So you split documents into chunks, typically a few hundred to ~1000 tokens each. The hard part is where to cut. Cut too small and a chunk loses the context that makes it meaningful (a sentence saying 'it expires in 30 days' is useless if you can't tell what 'it' is). Cut too big and each chunk is mostly noise, which dilutes the search signal and wastes context-window space. The standard fixes: split on natural boundaries (paragraphs, headings, sections) rather than blindly every N characters, and use overlap, where each chunk repeats the last sentence or two of the previous one so a fact that straddles a boundary survives in at least one chunk. Good chunking is the highest-leverage and most underrated part of a RAG system: bad retrieval is very often a chunking problem, not a search-algorithm problem.",
      "caption": "A long document is split into smaller chunks, and each chunk repeats a little of the one before it so a fact sitting on a boundary still shows up whole in one chunk.",
      "svg": '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 200" width="100%" preserveAspectRatio="xMidYMid meet" role="img" font-family="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif" font-size="12" fill="#1c1d1f"><title>Splitting a document into overlapping chunks</title><defs><marker id="rag2ah" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="#0b5394"/></marker></defs><text x="62" y="22" text-anchor="middle" font-size="11" fill="#6b7280">Document</text><rect x="18" y="30" width="88" height="150" rx="6" fill="#fff" stroke="#e6dfce" stroke-width="1.5"/><line x1="30" y1="48" x2="94" y2="48" stroke="#e6dfce" stroke-width="1.5"/><line x1="30" y1="64" x2="94" y2="64" stroke="#e6dfce" stroke-width="1.5"/><line x1="30" y1="80" x2="94" y2="80" stroke="#e6dfce" stroke-width="1.5"/><line x1="30" y1="96" x2="94" y2="96" stroke="#e6dfce" stroke-width="1.5"/><line x1="30" y1="112" x2="94" y2="112" stroke="#e6dfce" stroke-width="1.5"/><line x1="30" y1="128" x2="94" y2="128" stroke="#e6dfce" stroke-width="1.5"/><line x1="30" y1="144" x2="94" y2="144" stroke="#e6dfce" stroke-width="1.5"/><line x1="30" y1="160" x2="78" y2="160" stroke="#e6dfce" stroke-width="1.5"/><line x1="110" y1="104" x2="150" y2="104" stroke="#0b5394" stroke-width="2" marker-end="url(#rag2ah)"/><rect x="160" y="30" width="184" height="40" rx="6" fill="#fff" stroke="#e6dfce" stroke-width="1.5"/><text x="172" y="54" font-size="11">Chunk 1</text><rect x="176" y="70" width="152" height="14" rx="3" fill="#d97706" fill-opacity="0.18" stroke="#d97706" stroke-width="1"/><text x="252" y="80" text-anchor="middle" font-size="9" fill="#d97706">overlap</text><rect x="160" y="86" width="184" height="40" rx="6" fill="#fff" stroke="#e6dfce" stroke-width="1.5"/><text x="172" y="110" font-size="11">Chunk 2</text><rect x="176" y="126" width="152" height="14" rx="3" fill="#d97706" fill-opacity="0.18" stroke="#d97706" stroke-width="1"/><text x="252" y="136" text-anchor="middle" font-size="9" fill="#d97706">overlap</text><rect x="160" y="142" width="184" height="40" rx="6" fill="#fff" stroke="#e6dfce" stroke-width="1.5"/><text x="172" y="166" font-size="11">Chunk 3</text></svg>',
      "keyTerms": [
        {
          "term": "Chunk",
          "definition": "A small, self-contained slice of a source document that is indexed and retrieved as a unit."
        },
        {
          "term": "Chunk overlap",
          "definition": "Deliberately repeating some text at the boundary between adjacent chunks so a fact spanning the boundary appears whole in at least one chunk."
        },
        {
          "term": "Semantic / structural chunking",
          "definition": "Splitting on meaningful boundaries (paragraphs, sections, headings) instead of fixed character counts, so each chunk stays coherent."
        }
      ]
    },
    {
      "heading": "Embeddings and vector search: meaning-based retrieval",
      "video": { "url": "https://www.youtube.com/watch?v=gl1r1XV0SLw", "title": "What is a Vector Database? Powering Semantic Search & AI Applications", "channel": "IBM Technology" },
      "explanation": "The dominant way to find relevant chunks is semantic search using embeddings. An embedding is a list of numbers (a vector, often hundreds or thousands of values) that a small specialized model produces from a piece of text, positioned so that texts with similar MEANING land close together in that numeric space. You embed every chunk once, up front, and store the vectors in a vector database (Pinecone, Weaviate, pgvector, etc.). At query time you embed the question with the SAME model and ask the database for the chunks whose vectors are nearest to the question's vector, usually by cosine similarity. The payoff over old keyword search is that it matches on meaning, so a question about 'time off policy' can retrieve a chunk titled 'vacation and PTO' even with zero shared words. The catch is the reverse: pure vector search can miss exact terms like a part number or an error code, where the literal string matters. That is why many production systems use hybrid search, combining vector similarity with a keyword score (BM25) to get both. Note: embeddings are a different model from the chat model. Anthropic does not ship a first-party embedding endpoint, so RAG builds on Claude pair it with a third-party embedding model (Voyage, OpenAI, Cohere, open-source) for this step.",
      "caption": "Every chunk becomes a dot in a meaning space, so similar ideas sit close. The question becomes a dot too, and the nearest dots are the chunks that get retrieved.",
      "svg": '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 200" width="100%" preserveAspectRatio="xMidYMid meet" role="img" font-family="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif" font-size="12" fill="#1c1d1f"><title>Embeddings place similar meanings close together for vector search</title><style>@keyframes rag3p{0%,100%{opacity:1}50%{opacity:.45}}.rag3pc{animation:rag3p 2.6s ease-in-out infinite}@media (prefers-reduced-motion:reduce){.rag3pc{animation:none}}</style><rect x="10" y="22" width="340" height="160" rx="8" fill="#fff" stroke="#e6dfce" stroke-width="1.5"/><text x="22" y="40" font-size="10" fill="#6b7280">meaning space</text><circle cx="60" cy="70" r="4" fill="#6b7280"/><circle cx="300" cy="60" r="4" fill="#6b7280"/><circle cx="290" cy="150" r="4" fill="#6b7280"/><circle cx="80" cy="150" r="4" fill="#6b7280"/><circle cx="250" cy="110" r="4" fill="#6b7280"/><circle cx="320" cy="110" r="4" fill="#6b7280"/><circle cx="200" cy="160" r="4" fill="#6b7280"/><circle cx="150" cy="88" r="4.5" fill="#1f7a50"/><circle cx="188" cy="104" r="4.5" fill="#1f7a50"/><circle cx="162" cy="138" r="4.5" fill="#1f7a50"/><circle cx="170" cy="112" r="48" fill="none" stroke="#2f8cff" stroke-width="1.5" stroke-dasharray="5 4"/><circle class="rag3pc" cx="170" cy="112" r="6.5" fill="#2f8cff"/><text x="170" y="116" text-anchor="middle" font-size="9" fill="#fff">Q</text><text x="226" y="112" font-size="10" fill="#2f8cff">query</text><text x="170" y="178" text-anchor="middle" font-size="10" fill="#1f7a50">nearest dots become the retrieved chunks</text></svg>',
      "keyTerms": [
        {
          "term": "Embedding",
          "definition": "A numeric vector representing a piece of text's meaning, such that semantically similar texts have nearby vectors."
        },
        {
          "term": "Vector database",
          "definition": "A store optimized for finding the nearest vectors to a query vector quickly, even across millions of chunks."
        },
        {
          "term": "Cosine similarity",
          "definition": "A common measure of how aligned two vectors are (closer to 1 = more similar in meaning); the typical ranking metric for vector search."
        },
        {
          "term": "Hybrid search",
          "definition": "Combining semantic (vector) search with keyword search (e.g. BM25) so you catch both meaning-based matches and exact-term matches."
        }
      ]
    },
    {
      "heading": "Reranking: a second, sharper pass",
      "video": { "url": "https://www.youtube.com/watch?v=K1F8BIgcoNk", "title": "Rerank for better RAG (Explained)", "channel": "vectorize" },
      "explanation": "Vector search is fast but coarse: it compares each chunk's vector to the query's vector independently, so it is good at pulling a rough candidate set but not at finely ordering it. Reranking adds a second stage. You retrieve a generous candidate set (say the top 50) cheaply with vector search, then run a reranker, a more expensive model that looks at the query and each candidate chunk TOGETHER and scores how well that chunk actually answers the query. You keep only the top few after reranking (say the best 5) to put in the prompt. This two-stage 'retrieve wide, then rerank narrow' pattern is one of the biggest accuracy wins available, because the reranker catches relevance nuance the embedding step is too blunt to see. The reason you don't just rerank everything is cost and latency: the reranker is too slow to run over your whole corpus, so vector search does the cheap first cut and the reranker does the precise final cut.",
      "caption": "Vector search cheaply pulls a wide set of candidates, then a slower reranker scores each one against the question and keeps only the few best for the prompt.",
      "svg": '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 200" width="100%" preserveAspectRatio="xMidYMid meet" role="img" font-family="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif" font-size="12" fill="#1c1d1f"><title>Two-stage retrieval: wide vector search, then a narrow rerank</title><style>@keyframes rag4p{0%,100%{opacity:1}50%{opacity:.55}}.rag4pc{animation:rag4p 2.6s ease-in-out infinite}@media (prefers-reduced-motion:reduce){.rag4pc{animation:none}}</style><defs><marker id="rag4ah" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="#0b5394"/></marker></defs><text x="64" y="26" text-anchor="middle" font-size="11" fill="#6b7280">vector search</text><text x="64" y="42" text-anchor="middle" font-size="9" fill="#6b7280">wide, about 50</text><rect x="14" y="54" width="100" height="7" rx="2" fill="#efe9da" stroke="#e6dfce" stroke-width="1"/><rect x="14" y="65" width="100" height="7" rx="2" fill="#efe9da" stroke="#e6dfce" stroke-width="1"/><rect x="14" y="76" width="100" height="7" rx="2" fill="#efe9da" stroke="#e6dfce" stroke-width="1"/><rect x="14" y="87" width="100" height="7" rx="2" fill="#efe9da" stroke="#e6dfce" stroke-width="1"/><rect x="14" y="98" width="100" height="7" rx="2" fill="#efe9da" stroke="#e6dfce" stroke-width="1"/><rect x="14" y="109" width="100" height="7" rx="2" fill="#efe9da" stroke="#e6dfce" stroke-width="1"/><rect x="14" y="120" width="100" height="7" rx="2" fill="#efe9da" stroke="#e6dfce" stroke-width="1"/><rect x="14" y="131" width="100" height="7" rx="2" fill="#efe9da" stroke="#e6dfce" stroke-width="1"/><rect x="14" y="142" width="100" height="7" rx="2" fill="#efe9da" stroke="#e6dfce" stroke-width="1"/><line x1="118" y1="100" x2="148" y2="100" stroke="#0b5394" stroke-width="2" marker-end="url(#rag4ah)"/><rect class="rag4pc" x="150" y="64" width="64" height="72" rx="8" fill="#fff" stroke="#2f8cff" stroke-width="2"/><text x="182" y="96" text-anchor="middle" font-size="11" fill="#0b5394">Reranker</text><text x="182" y="112" text-anchor="middle" font-size="9" fill="#6b7280">scores each</text><line x1="214" y1="100" x2="244" y2="100" stroke="#0b5394" stroke-width="2" marker-end="url(#rag4ah)"/><text x="298" y="26" text-anchor="middle" font-size="11" fill="#1f7a50">top 5</text><text x="298" y="42" text-anchor="middle" font-size="9" fill="#6b7280">into prompt</text><rect x="250" y="64" width="96" height="10" rx="2" fill="#1f7a50" fill-opacity="0.8" stroke="#1f7a50" stroke-width="1"/><rect x="250" y="82" width="96" height="10" rx="2" fill="#1f7a50" fill-opacity="0.8" stroke="#1f7a50" stroke-width="1"/><rect x="250" y="100" width="96" height="10" rx="2" fill="#1f7a50" fill-opacity="0.8" stroke="#1f7a50" stroke-width="1"/><rect x="250" y="118" width="96" height="10" rx="2" fill="#1f7a50" fill-opacity="0.8" stroke="#1f7a50" stroke-width="1"/><text x="180" y="168" text-anchor="middle" font-size="10" fill="#6b7280">retrieve wide, then rank narrow</text></svg>',
      "keyTerms": [
        {
          "term": "Reranker",
          "definition": "A model that takes the query and a candidate chunk together and scores their relevance, used to reorder and trim a retrieved candidate set."
        },
        {
          "term": "Cross-encoder",
          "definition": "The model architecture most rerankers use: it processes the query and a candidate jointly (rather than embedding each alone), which is more accurate but too slow to run over an entire corpus."
        },
        {
          "term": "Two-stage retrieval",
          "definition": "Retrieve a wide candidate set cheaply (vector search), then rerank to a small, high-precision final set before prompting the model."
        }
      ]
    },
    {
      "heading": "Citations and the RAG-vs-fine-tuning-vs-prompting choice",
      "video": { "url": "https://www.youtube.com/watch?v=00Q0G84kq3M", "title": "RAG vs. Fine Tuning", "channel": "IBM Technology" },
      "explanation": "Because RAG hands the model specific source chunks, you can ask it to cite which chunk each claim came from, which makes answers auditable and is essential in regulated domains. With Claude you can turn on a built-in citations feature by setting citations: {enabled: true} on each document block in the request; cited sentences come back as separate text blocks carrying the exact quoted source text and a location pointer (character or page range), rather than you trusting the model to hand-write its references. Now the key decision an expert tests you on, when to use what: PROMPTING (just paste the relevant text directly) is right when the needed context is small and you already have it. RAG is right when knowledge is large, changes often, or must be cited, because you swap the source text per question and never touch the model. FINE-TUNING (further training the model's weights on examples) changes how the model behaves, its tone, format, or task skill, but it does NOT reliably teach it new facts and does not give citations. The crisp line: RAG injects KNOWLEDGE at question time; fine-tuning shapes BEHAVIOR at training time. They are complements, not competitors. For a system that needs current, citable facts over a private corpus, the answer is almost always RAG (often with a fine-tuned or well-prompted model on top for style), not fine-tuning alone.",
      "caption": "Choose by what the job needs. Paste it in the prompt when the context is small, reach for RAG when facts are large or change or must be cited, fine-tune to set a behavior.",
      "svg": '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 200" width="100%" preserveAspectRatio="xMidYMid meet" role="img" font-family="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif" font-size="12" fill="#1c1d1f"><title>Choosing between prompting, RAG, and fine-tuning</title><style>@keyframes rag5p{0%,100%{opacity:1}50%{opacity:.5}}.rag5pc{animation:rag5p 2.8s ease-in-out infinite}@media (prefers-reduced-motion:reduce){.rag5pc{animation:none}}</style><text x="180" y="22" text-anchor="middle" font-size="11" font-weight="600" fill="#6b7280">Pick by what the job needs</text><rect x="10" y="36" width="104" height="116" rx="8" fill="#fff" stroke="#e6dfce" stroke-width="1.5"/><text x="62" y="62" text-anchor="middle" font-weight="600">Prompt</text><text x="62" y="86" text-anchor="middle" font-size="10" fill="#6b7280">small context</text><text x="62" y="104" text-anchor="middle" font-size="10" fill="#6b7280">already on hand</text><rect class="rag5pc" x="128" y="36" width="104" height="116" rx="8" fill="#fff" stroke="#2f8cff" stroke-width="2"/><text x="180" y="62" text-anchor="middle" font-weight="600" fill="#0b5394">RAG</text><text x="180" y="86" text-anchor="middle" font-size="10" fill="#6b7280">large or fresh facts</text><text x="180" y="104" text-anchor="middle" font-size="10" fill="#6b7280">must cite sources</text><rect x="246" y="36" width="104" height="116" rx="8" fill="#fff" stroke="#d97706" stroke-width="1.5"/><text x="298" y="62" text-anchor="middle" font-weight="600" fill="#d97706">Fine-tune</text><text x="298" y="86" text-anchor="middle" font-size="10" fill="#6b7280">tone and format</text><text x="298" y="104" text-anchor="middle" font-size="10" fill="#6b7280">a behavior</text><text x="180" y="174" text-anchor="middle" font-size="10" fill="#1c1d1f">RAG adds knowledge at ask time, fine-tuning sets behavior in training</text></svg>',
      "keyTerms": [
        {
          "term": "Citation",
          "definition": "A pointer from a claim in the answer back to the exact source chunk (and location) it came from, making the output auditable."
        },
        {
          "term": "Fine-tuning",
          "definition": "Further training a model's weights on your examples to change its behavior, tone, or task skill. It does not reliably implant new facts and gives no citations."
        },
        {
          "term": "RAG vs fine-tuning line",
          "definition": "RAG adds knowledge at inference time and is swappable per query; fine-tuning bakes in behavior at training time. Use RAG for facts that change or must be cited; fine-tune for consistent style or task format."
        }
      ]
    },
    {
      "heading": "Operating a RAG system: top-k, freshness, and agentic retrieval",
      "video": { "url": "https://www.youtube.com/watch?v=0z9_MhcYvcY", "title": "What is Agentic RAG?", "channel": "IBM Technology" },
      "explanation": "Building the pipeline is only half the job. Keeping it accurate in production is the other half, and three operational knobs matter most. The first is top-k, the number of chunks you actually paste into the prompt after retrieval and reranking. Pass too few and the answer-bearing passage may be left out, pass too many and you bury the model in distractors and waste context-window space, so most systems settle on a handful (often three to ten) of the best chunks. The second is freshness. An index is a snapshot, so when a source document changes you have to re-chunk and re-embed it (re-indexing), or the model will confidently answer from a stale copy. The third is measurement. You should evaluate retrieval on its own, separately from the final answer, because a wrong answer is very often a retrieval miss (the right chunk was never fetched) rather than a reasoning failure. A more advanced pattern is agentic retrieval, where the model is allowed to search more than once. It reads the first results, judges them insufficient, reformulates the query, and searches again, which handles multi-step questions that a single search cannot.",
      "caption": "Three operating knobs. Top-k limits how many chunks reach the prompt, re-indexing keeps the index current as sources change, and agentic retrieval lets the model search again.",
      "svg": '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 200" width="100%" preserveAspectRatio="xMidYMid meet" role="img" font-family="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif" font-size="12" fill="#1c1d1f"><title>Operating a RAG system: top-k, freshness, and agentic retrieval</title><defs><marker id="rag6ah" markerWidth="8" markerHeight="8" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#d97706"/></marker><marker id="rag6gh" markerWidth="8" markerHeight="8" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#1f7a50"/></marker></defs><text x="180" y="20" text-anchor="middle" font-size="11" font-weight="600" fill="#6b7280">Keeping answers accurate</text><rect x="8" y="32" width="110" height="140" rx="8" fill="#fff" stroke="#e6dfce" stroke-width="1.5"/><text x="63" y="54" text-anchor="middle" font-weight="600" font-size="11">Top-k</text><rect x="20" y="74" width="12" height="12" rx="2" fill="#2f8cff"/><rect x="36" y="74" width="12" height="12" rx="2" fill="#2f8cff"/><rect x="52" y="74" width="12" height="12" rx="2" fill="#2f8cff"/><rect x="68" y="74" width="12" height="12" rx="2" fill="#2f8cff"/><rect x="84" y="74" width="12" height="12" rx="2" fill="#efe9da" stroke="#e6dfce" stroke-width="1"/><rect x="100" y="74" width="12" height="12" rx="2" fill="#efe9da" stroke="#e6dfce" stroke-width="1"/><text x="63" y="112" text-anchor="middle" font-size="10" fill="#6b7280">few best chunks</text><text x="63" y="128" text-anchor="middle" font-size="10" fill="#6b7280">into the prompt</text><rect x="126" y="32" width="108" height="140" rx="8" fill="#fff" stroke="#e6dfce" stroke-width="1.5"/><text x="180" y="54" text-anchor="middle" font-weight="600" font-size="11">Freshness</text><rect x="158" y="72" width="22" height="28" rx="3" fill="#fff" stroke="#e6dfce" stroke-width="1.5"/><line x1="162" y1="80" x2="176" y2="80" stroke="#6b7280" stroke-width="1"/><line x1="162" y1="86" x2="176" y2="86" stroke="#6b7280" stroke-width="1"/><line x1="162" y1="92" x2="172" y2="92" stroke="#6b7280" stroke-width="1"/><path d="M204,92 A13,13 0 1 1 190,79" fill="none" stroke="#d97706" stroke-width="2" marker-end="url(#rag6ah)"/><text x="180" y="120" text-anchor="middle" font-size="10" fill="#6b7280">re-index</text><text x="180" y="136" text-anchor="middle" font-size="10" fill="#6b7280">when sources change</text><rect x="242" y="32" width="110" height="140" rx="8" fill="#fff" stroke="#e6dfce" stroke-width="1.5"/><text x="297" y="54" text-anchor="middle" font-weight="600" font-size="11">Agentic</text><rect x="258" y="70" width="80" height="24" rx="6" fill="#fff" stroke="#e6dfce" stroke-width="1.5"/><text x="298" y="86" text-anchor="middle" font-size="10" fill="#6b7280">search</text><path d="M336,95 C356,124 262,130 260,98" fill="none" stroke="#1f7a50" stroke-width="2" marker-end="url(#rag6gh)"/><text x="297" y="122" text-anchor="middle" font-size="10" fill="#6b7280">read, refine,</text><text x="297" y="138" text-anchor="middle" font-size="10" fill="#6b7280">search again</text></svg>',
      "keyTerms": [
        {
          "term": "Top-k",
          "definition": "The number of top-ranked chunks you insert into the prompt after retrieval (and reranking). Too small risks missing the answer, too large adds noise and cost."
        },
        {
          "term": "Re-indexing",
          "definition": "Re-chunking and re-embedding a source after it changes, so the searchable index reflects the current document instead of a stale snapshot."
        },
        {
          "term": "Retrieval miss",
          "definition": "A failure where the chunk containing the answer was never retrieved, so the model cannot answer correctly no matter how capable it is. Often the true cause of a 'wrong' RAG answer."
        },
        {
          "term": "Agentic retrieval",
          "definition": "Letting the model run retrieval iteratively, reformulating its query and searching again based on what it found, rather than doing a single one-shot search."
        }
      ]
    }
  ],
  "video": {
    "url": "https://www.youtube.com/watch?v=T-D1OfcDW1M",
    "title": "What is Retrieval-Augmented Generation (RAG)?",
    "channel": "IBM Technology"
  },
  "cards": [
    {
      "id": "rag-0",
      "categoryKey": "rag",
      "category": "Retrieval-Augmented Generation (RAG)",
      "subtopic": "Core loop",
      "question": "In the RAG pattern, what are the two distinct steps and which model component does the actual searching?",
      "answer": "Step 1 is retrieval: searching a pre-built index for the chunks most relevant to the question, done before the model is called and NOT by the chat model itself (a search index or vector database does it). Step 2 is generation: the chat model reads those retrieved chunks plus the question and writes the answer.",
      "plain": "Think of an open-book exam: first a librarian (the search step) pulls the right pages for your question, then you (the AI) read those pages and write the answer. The librarian and the writer are two different jobs.",
      "difficulty": "core"
    },
    {
      "id": "rag-1",
      "categoryKey": "rag",
      "category": "Retrieval-Augmented Generation (RAG)",
      "subtopic": "Core loop",
      "question": "Why does RAG reduce hallucination and fix knowledge staleness, when the underlying model is unchanged?",
      "answer": "It places the relevant source text directly in the model's context window at question time, so the model answers from supplied facts rather than half-remembered training data (less hallucination), and you can index documents created after the model's training cutoff (no staleness). The model's weights are never touched.",
      "plain": "Instead of asking someone to recite a fact from memory (where they might guess wrong or be out of date), you hand them the actual document and say 'answer from this.' They are far less likely to make things up, and the document can be from this morning.",
      "difficulty": "core"
    },
    {
      "id": "rag-2",
      "categoryKey": "rag",
      "category": "Retrieval-Augmented Generation (RAG)",
      "subtopic": "Chunking",
      "question": "What problem does chunk overlap solve, and how?",
      "answer": "It prevents a fact that straddles a chunk boundary from being split across two chunks and lost. By repeating the last sentence or two of one chunk at the start of the next, any boundary-spanning fact appears whole in at least one chunk so retrieval can return it intact.",
      "plain": "When you tear a document into pieces, a sentence can get cut in half right at the tear. Overlap means each piece repeats the last bit of the one before it, like overlapping shingles on a roof, so nothing important falls through the crack.",
      "difficulty": "core"
    },
    {
      "id": "rag-3",
      "categoryKey": "rag",
      "category": "Retrieval-Augmented Generation (RAG)",
      "subtopic": "Chunking",
      "question": "Describe the failure mode of chunking too small versus too large.",
      "answer": "Too small: a chunk loses surrounding context and becomes ambiguous or meaningless on its own (e.g. a pronoun with no antecedent). Too large: each chunk is mostly irrelevant text, which dilutes the search signal so relevance scoring degrades and the chunk wastes scarce context-window space.",
      "plain": "Cut the pieces too small and they lose meaning, like a note that just says 'it expires in 30 days' with no clue what 'it' is. Cut them too big and the answer is buried in a wall of unrelated text, making it harder to find and a waste of space.",
      "difficulty": "intermediate"
    },
    {
      "id": "rag-4",
      "categoryKey": "rag",
      "category": "Retrieval-Augmented Generation (RAG)",
      "subtopic": "Embeddings",
      "question": "What is an embedding, and what property makes it useful for retrieval?",
      "answer": "An embedding is a numeric vector that a specialized model produces from text. Its key property is that texts with similar meaning are placed close together in the vector space, so nearness between a question's vector and a chunk's vector signals semantic relevance even when they share no words.",
      "plain": "An embedding turns a piece of text into a string of numbers that acts like a GPS coordinate for its meaning. Texts that mean similar things end up near each other on the map, so you can find related passages by checking which coordinates are closest, even if they use totally different words.",
      "difficulty": "core"
    },
    {
      "id": "rag-5",
      "categoryKey": "rag",
      "category": "Retrieval-Augmented Generation (RAG)",
      "subtopic": "Embeddings",
      "question": "Why must you embed the query with the same model you used to embed your chunks?",
      "answer": "Vectors are only comparable within the same embedding model's space. Different models produce vectors with different dimensions and geometry, so a query embedded by a different model would have meaningless distances to your chunk vectors and retrieval would be garbage.",
      "plain": "It is like map coordinates: latitude and longitude only line up if everyone uses the same map. If your documents are pinned on one map and your question on a totally different one, comparing their positions tells you nothing, so both have to use the same embedding tool.",
      "difficulty": "intermediate"
    },
    {
      "id": "rag-6",
      "categoryKey": "rag",
      "category": "Retrieval-Augmented Generation (RAG)",
      "subtopic": "Vector search",
      "question": "Pure semantic (vector) search excels at one kind of match but is weak at another. What is the weakness, and what is the standard remedy?",
      "answer": "Its weakness is exact-term matching: literal strings like a part number, error code, or specific name can be missed because vectors capture meaning, not exact tokens. The remedy is hybrid search, combining vector similarity with a keyword score (such as BM25) so both meaning-based and exact matches are caught.",
      "plain": "Meaning-based search is great at 'I want something like this idea' but can fumble an exact code like 'part X7-42B,' where the precise characters matter. The fix is to run a plain keyword search alongside it (hybrid search), so you catch both the gist and the exact text.",
      "difficulty": "intermediate"
    },
    {
      "id": "rag-7",
      "categoryKey": "rag",
      "category": "Retrieval-Augmented Generation (RAG)",
      "subtopic": "Vector search",
      "question": "What does cosine similarity measure in vector retrieval, and what does a value near 1 indicate?",
      "answer": "It measures how aligned two vectors' directions are, ignoring their magnitude. A value near 1 means the two texts point the same way in the embedding space, i.e. they are highly similar in meaning; it is the common ranking metric for nearest-neighbor vector search.",
      "plain": "Picture two arrows pointing out from the same spot. Cosine similarity just asks 'are they aimed the same direction?' A score near 1 means they point almost the exact same way, which is the system's way of saying the two texts mean nearly the same thing.",
      "difficulty": "intermediate"
    },
    {
      "id": "rag-8",
      "categoryKey": "rag",
      "category": "Retrieval-Augmented Generation (RAG)",
      "subtopic": "Reranking",
      "question": "What does a reranker do differently from the initial vector search, and why is it more accurate?",
      "answer": "A reranker scores the query and each candidate chunk by processing them TOGETHER (a cross-encoder), rather than comparing two independently-computed vectors. Looking at the pair jointly lets it judge actual relevance with nuance the blunt single-vector comparison misses.",
      "plain": "The first search judges each passage on its own, then guesses which fits your question. A reranker instead reads your question and a passage side by side, like a careful editor weighing them together, so it judges relevance much more precisely.",
      "difficulty": "intermediate"
    },
    {
      "id": "rag-9",
      "categoryKey": "rag",
      "category": "Retrieval-Augmented Generation (RAG)",
      "subtopic": "Reranking",
      "question": "Why do production systems use vector search and a reranker as two stages rather than just reranking everything?",
      "answer": "The reranker is far too slow and expensive to run over an entire corpus. So vector search does a cheap, fast first cut to a wide candidate set (e.g. top 50), and the reranker does a precise, expensive final cut to a small set (e.g. top 5). You get the reranker's accuracy without paying it across millions of chunks.",
      "plain": "It is like hiring: a fast resume scan narrows thousands of applicants down to 50, then slow in-depth interviews pick the final 5. You would never interview everyone, so the cheap first pass does the bulk filtering and the expensive careful pass only handles the short list.",
      "difficulty": "advanced"
    },
    {
      "id": "rag-10",
      "categoryKey": "rag",
      "category": "Retrieval-Augmented Generation (RAG)",
      "subtopic": "RAG vs alternatives",
      "question": "State the one-line distinction between what RAG changes and what fine-tuning changes.",
      "answer": "RAG injects knowledge at question time (inference) and is swappable per query without touching the model; fine-tuning shapes behavior (tone, format, task skill) by retraining the model's weights ahead of time. RAG = knowledge in context; fine-tuning = behavior in weights.",
      "plain": "RAG is handing someone the right notes for each question (changing what they know in the moment); fine-tuning is sending them to a training course (changing how they work). One feeds facts, the other reshapes habits.",
      "difficulty": "core"
    },
    {
      "id": "rag-11",
      "categoryKey": "rag",
      "category": "Retrieval-Augmented Generation (RAG)",
      "subtopic": "RAG vs alternatives",
      "question": "A team wants their model to reliably answer questions about a large, frequently-updated internal knowledge base with source citations. Why is fine-tuning the wrong tool here?",
      "answer": "Fine-tuning does not reliably implant new facts, cannot keep up with frequent updates (you would retrain constantly), and provides no citations. RAG fits all three needs: it serves current facts by re-indexing, swaps source text per query, and lets you cite the exact retrieved chunk.",
      "plain": "Fine-tuning is like memorizing a fast-changing manual: it goes stale the moment the manual updates, you cannot easily say which page a fact came from, and you would have to re-memorize constantly. Keeping the manual open and looking things up (RAG) stays current and lets you point to the exact line.",
      "difficulty": "advanced"
    },
    {
      "id": "rag-12",
      "categoryKey": "rag",
      "category": "Retrieval-Augmented Generation (RAG)",
      "subtopic": "RAG vs alternatives",
      "question": "When is plain prompting the right choice over building a RAG pipeline?",
      "answer": "When the context the model needs is small and you already have it on hand, so you can paste it directly into the prompt. RAG only earns its complexity when the knowledge is large, changes often, must be cited, or is too big to know in advance which slice the model will need.",
      "plain": "If the relevant info fits on a sticky note you already have, just paste it into the question, no need to build a whole library system. RAG is only worth the extra machinery when there is too much material to paste and you do not know in advance which part you will need.",
      "difficulty": "core"
    },
    {
      "id": "rag-13",
      "categoryKey": "rag",
      "category": "Retrieval-Augmented Generation (RAG)",
      "subtopic": "Citations",
      "question": "With Claude's built-in document citations, what do you enable and what comes back differently in the response?",
      "answer": "You set citations: {enabled: true} on each document block in the request. The response then splits into multiple text blocks where cited blocks carry a citations array containing the exact quoted source text (cited_text), the document index, and a location pointer (character range for text, page range for PDFs), instead of the model hand-writing unverifiable references.",
      "plain": "You flip a 'citations on' switch on each document you send. In return, the answer comes back with built-in receipts: each cited sentence is tagged with the exact source quote and where it was found (which document, which page), instead of the AI just claiming it without proof.",
      "difficulty": "advanced"
    },
    {
      "id": "rag-14",
      "categoryKey": "rag",
      "category": "Retrieval-Augmented Generation (RAG)",
      "subtopic": "Top-k and relevance",
      "question": "What does 'top-k' refer to in retrieval, and what is the tradeoff between setting it too low versus too high?",
      "answer": "Top-k is how many of the highest-ranked chunks you actually place into the prompt. Set it too low and the chunk containing the answer may be excluded, so the model cannot answer. Set it too high and you flood the prompt with irrelevant chunks (distractors) that dilute the signal, raise cost and latency, and can confuse the answer.",
      "plain": "Top-k is just 'how many search results do I hand the AI.' Give it too few and you might leave out the one page with the answer. Give it too many and the AI drowns in unrelated pages, which both confuses it and costs more. Most systems hand over a small handful of the best results.",
      "difficulty": "core"
    },
    {
      "id": "rag-15",
      "categoryKey": "rag",
      "category": "Retrieval-Augmented Generation (RAG)",
      "subtopic": "RAG vs long context",
      "question": "Now that models have very large context windows, why not skip RAG and just paste an entire document collection into every prompt?",
      "answer": "Even large context windows are finite and expensive: you pay for every token on each call, latency grows with input length, and models attend less reliably to facts buried in the middle of a very long input. RAG sends only the few relevant chunks, which is cheaper, faster, and often more accurate, and it scales to corpora far larger than any context window.",
      "plain": "Yes, you can paste in a lot now, but it is like reading an entire library aloud to answer one question: slow, costly, and easy to lose the key sentence in the flood. RAG just pulls the few relevant pages, which is cheaper, faster, and usually more accurate, and it works even when your documents are far bigger than the window.",
      "difficulty": "core"
    },
    {
      "id": "rag-16",
      "categoryKey": "rag",
      "category": "Retrieval-Augmented Generation (RAG)",
      "subtopic": "Freshness and re-indexing",
      "question": "Your source documents get edited regularly. What must you do to keep RAG answers correct, and what goes wrong if you skip it?",
      "answer": "You must re-chunk and re-embed any changed documents so the index reflects the current text (re-indexing). If you skip it, the index holds a stale snapshot, and the model will answer confidently from outdated content even though the live document has changed.",
      "plain": "The search index is a photocopy made at one moment. If the original changes, you have to re-copy it into the index, or the AI keeps answering from the old version, sounding just as confident while being out of date.",
      "difficulty": "core"
    },
    {
      "id": "rag-17",
      "categoryKey": "rag",
      "category": "Retrieval-Augmented Generation (RAG)",
      "subtopic": "Failure modes",
      "question": "If a RAG system gives a wrong answer, why is the retrieval step often the real culprit rather than the model's reasoning?",
      "answer": "The model can only answer from the chunks it is given. If the chunk containing the answer was never retrieved (a retrieval miss), no amount of reasoning can recover it, so the model either guesses or hallucinates. That is why debugging a wrong RAG answer should start with checking whether the right chunk was even retrieved.",
      "plain": "The AI can only work with the pages the search step handed it. If the right page never showed up, the AI is stuck, like asking someone to answer from a binder that is missing the key page. So when a RAG answer is wrong, first check whether the correct passage was even pulled.",
      "difficulty": "core"
    },
    {
      "id": "rag-18",
      "categoryKey": "rag",
      "category": "Retrieval-Augmented Generation (RAG)",
      "subtopic": "Evaluating retrieval",
      "question": "Why should you evaluate the retrieval step separately from the final generated answer, and what is a common metric for it?",
      "answer": "Because the two stages fail for different reasons, and a good final answer can mask a weak retriever (or vice versa). Evaluating retrieval alone, often with recall@k (did the relevant chunk appear in the top k results), tells you whether the right context was even available before you blame the model for the answer.",
      "plain": "Test the librarian and the writer separately. A common check is 'did the correct page show up in the top few results' (recall@k). If the right page never appeared, the problem is the search, not the AI's writing, and you would fix the wrong thing if you only judged the final answer.",
      "difficulty": "intermediate"
    },
    {
      "id": "rag-19",
      "categoryKey": "rag",
      "category": "Retrieval-Augmented Generation (RAG)",
      "subtopic": "Semantic vs keyword",
      "question": "Give a concrete case where old-fashioned keyword search beats semantic (vector) search, and explain why.",
      "answer": "Exact-identifier lookups: a product code like 'X7-42B,' a legal citation, a function name, or a rare proper noun. Keyword search (e.g. BM25) matches the literal string, while semantic search maps text to meaning and can drift toward similar-looking but wrong items, missing the exact token. This is why hybrid search keeps a keyword component.",
      "plain": "Searching for an exact code like 'X7-42B' or a specific name, plain keyword search wins because it matches the literal characters. Meaning-based search might fetch something that 'feels related' but isn't the exact item, since it cares about gist, not precise spelling. That is why good systems keep both.",
      "difficulty": "intermediate"
    },
    {
      "id": "rag-20",
      "categoryKey": "rag",
      "category": "Retrieval-Augmented Generation (RAG)",
      "subtopic": "Agentic retrieval",
      "question": "What is agentic (iterative) retrieval, and what kind of question makes it worth the extra cost over a single search?",
      "answer": "Agentic retrieval lets the model search multiple times: it reads the first results, judges them insufficient, reformulates the query, and searches again. It pays off for multi-step or multi-hop questions where the answer requires combining facts that no single query would surface together (for example, 'which of our clients in California also hold the fund we downgraded last quarter').",
      "plain": "Instead of one search, the AI searches, looks at what it got, realizes it needs more, rephrases, and searches again, like a researcher following leads. It is worth the extra effort for layered questions where no single search would gather all the needed pieces at once.",
      "difficulty": "intermediate"
    },
    {
      "id": "rag-21",
      "categoryKey": "rag",
      "category": "Retrieval-Augmented Generation (RAG)",
      "subtopic": "Citations and grounding",
      "question": "Besides retrieving good chunks, what instruction-level technique reduces hallucination when the retrieved context does not actually contain the answer?",
      "answer": "Instruct the model to answer only from the provided context and to say it does not know (or that the context is insufficient) when the answer is not there, rather than filling the gap from memory. Grounding is not just supplying sources, it is also licensing the model to abstain when those sources fall short.",
      "plain": "Tell the AI: 'answer only from these documents, and if the answer isn't in them, say you don't know.' Without that permission to say 'not found,' a model will often invent something to fill the silence. Grounding means both giving it the sources and allowing it to admit when they come up short.",
      "difficulty": "intermediate"
    }
  ]
};

export default mod;
