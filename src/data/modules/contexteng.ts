import type { Category } from '../../types';

const mod: Category = {
  key: 'contexteng',
  name: 'Context Windows & Context Engineering',
  tier: 2,
  summary:
    'The context window is the model\'s working memory: everything it can "see" at once, made of the prompt plus the answer it is writing. Context engineering is the practical skill of deciding what to put in that window and what to leave out. It matters more, not less, as windows grow, because the model still pays attention unevenly and reads the middle of a long input worst.',
  learningObjectives: [
    'By the end you can explain what a context window is and how the prompt and the output share it',
    'By the end you can describe what happens when context overflows and how truncation works',
    'By the end you can explain the lost-in-the-middle effect and order information accordingly',
    'By the end you can decide what to include, summarize, or drop to fit a token budget',
    'By the end you can use summarization, chunking, and conversation memory across turns',
    'By the end you can connect context length to cost, latency, and accuracy trade-offs',
  ],
  breakdown: [
    {
      heading: 'The context window: the model\'s working memory',
      video: { url: "https://www.youtube.com/watch?v=TeQDr4DkLYo", title: "Why LLMs get dumb (Context Windows Explained)", channel: "NetworkChuck" },
      explanation:
        'Every time you call a model, it can only consider a fixed amount of text at once, measured in tokens (the word-pieces models read). That budget is the context window, and it holds everything: the system prompt, the conversation so far, any documents you pasted, and the answer being generated. Crucially the model has no memory between separate calls. It is not remembering your last chat, it is being handed a transcript each time. So the context window is less like long-term memory and more like a desk: only what is on the desk right now can be used.',
      caption:
        'One window holds the system prompt, the chat so far, any documents, and the answer. Nothing carries over between calls, so it all gets re-sent each time.',
      svg:
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 200" width="100%" preserveAspectRatio="xMidYMid meet" role="img" font-family="system-ui,-apple-system,Segoe UI,Roboto,sans-serif"><title>The context window holds everything at once</title><rect x="0.5" y="0.5" width="359" height="199" rx="10" fill="#ffffff" stroke="#e6dfce"/><text x="180" y="24" text-anchor="middle" font-size="12.5" font-weight="600" fill="#1c1d1f">One window holds everything the model sees</text><rect x="22" y="42" width="316" height="120" rx="8" fill="#efe9da" stroke="#e6dfce" stroke-width="1.5"/><rect x="34" y="50" width="292" height="22" rx="4" fill="#ffffff" stroke="#e6dfce"/><text x="180" y="65" text-anchor="middle" font-size="11" fill="#0b5394">System prompt</text><rect x="34" y="76" width="292" height="22" rx="4" fill="#ffffff" stroke="#e6dfce"/><text x="180" y="91" text-anchor="middle" font-size="11" fill="#2f8cff">Conversation history</text><rect x="34" y="102" width="292" height="22" rx="4" fill="#ffffff" stroke="#e6dfce"/><text x="180" y="117" text-anchor="middle" font-size="11" fill="#d97706">Pasted documents</text><rect x="34" y="128" width="292" height="22" rx="4" fill="#ffffff" stroke="#1f7a50"/><text x="180" y="143" text-anchor="middle" font-size="11" fill="#1f7a50">Answer being written (output)</text><text x="180" y="180" text-anchor="middle" font-size="10" fill="#6b7280">Stateless: it is re-handed all of this on every call</text></svg>',
      keyTerms: [
        {
          term: 'Context window',
          definition:
            'The maximum amount of text, measured in tokens, a model can consider in a single call. It holds the prompt, any history or documents, and the generated answer.',
        },
        {
          term: 'Token budget',
          definition:
            'The number of tokens you have to spend within the window. Every word of instructions, data, and output draws from the same pool.',
        },
        {
          term: 'Statelessness',
          definition:
            'The fact that a model keeps no memory between separate calls. Anything it should "remember" must be resupplied in the context window each time.',
        },
      ],
    },
    {
      heading: 'Input and output share one budget',
      video: { url: "https://www.youtube.com/watch?v=nKSk_TiR8YA", title: "Most devs don't understand how LLM tokens work", channel: "Matt Pocock" },
      explanation:
        'A common surprise is that the answer competes for the same space as your prompt. If a model has a 100,000-token window and your input already uses 95,000, there is little room left for it to write, and a long requested answer may get cut off. Reserving headroom for the output is part of planning a prompt. This also explains why pasting an entire long document plus asking for a long detailed report can fail: the two together do not fit, even though each alone would.',
      caption:
        'The same budget is split between your input and the answer. Fill it with input and there is no room left, so a long reply gets cut off.',
      svg:
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 200" width="100%" preserveAspectRatio="xMidYMid meet" role="img" font-family="system-ui,-apple-system,Segoe UI,Roboto,sans-serif"><title>Input and output share one token budget</title><rect x="0.5" y="0.5" width="359" height="199" rx="10" fill="#ffffff" stroke="#e6dfce"/><text x="180" y="24" text-anchor="middle" font-size="12.5" font-weight="600" fill="#1c1d1f">Input and the answer share one budget</text><rect x="28" y="56" width="262" height="28" rx="6" fill="#ffffff" stroke="#e6dfce" stroke-width="1.5"/><rect x="28" y="56" width="157" height="28" rx="6" fill="#0b5394"/><text x="106" y="74" text-anchor="middle" font-size="11" fill="#ffffff">Input</text><text x="237" y="74" text-anchor="middle" font-size="11" fill="#1f7a50">answer</text><rect x="296" y="56" width="58" height="28" rx="6" fill="#ffffff" stroke="#1f7a50"/><text x="325" y="74" text-anchor="middle" font-size="10" fill="#1f7a50">fits</text><rect x="28" y="104" width="262" height="28" rx="6" fill="#ffffff" stroke="#e6dfce" stroke-width="1.5"/><rect x="28" y="104" width="241" height="28" rx="6" fill="#0b5394"/><text x="148" y="122" text-anchor="middle" font-size="11" fill="#ffffff">Input (too long)</text><rect x="296" y="104" width="58" height="28" rx="6" fill="#ffffff" stroke="#dc2626"/><text x="325" y="122" text-anchor="middle" font-size="10" fill="#dc2626">cut off</text><rect x="28" y="160" width="12" height="12" rx="2" fill="#0b5394"/><text x="46" y="170" font-size="10" fill="#6b7280">input tokens</text><rect x="140" y="160" width="12" height="12" rx="2" fill="#ffffff" stroke="#1f7a50"/><text x="158" y="170" font-size="10" fill="#6b7280">room for the answer</text><text x="180" y="190" text-anchor="middle" font-size="10" fill="#6b7280">Leave headroom or a long reply gets cut off</text></svg>',
      keyTerms: [
        {
          term: 'Input tokens',
          definition:
            'The tokens in everything you send: system prompt, history, instructions, and pasted data. They consume the window before the model writes a word.',
        },
        {
          term: 'Output tokens',
          definition:
            'The tokens the model generates as its answer. They draw from the same window, so a huge input leaves less room for a long reply.',
        },
        {
          term: 'Headroom',
          definition:
            'The space you deliberately leave free in the window so the model has room to produce a complete answer without being cut off.',
        },
      ],
    },
    {
      heading: 'It fills up: overflow and truncation',
      video: { url: "https://www.youtube.com/watch?v=5ikn6shbm6w", title: "Context Window Explained: Why 1M Tokens Still Forgets", channel: "Devsplainers" },
      explanation:
        'When the text you supply exceeds the window, it does not gracefully shrink: something gets dropped. Many chat tools quietly truncate, usually trimming the oldest messages or the start of a document, which is why a long conversation can seem to "forget" how it began. This silent loss is dangerous, because the model will confidently answer using only what survived, with no warning that key material fell off the edge. Knowing the limit and managing what stays in the window is what prevents these invisible failures.',
      caption:
        'When text is too long to fit, the oldest part is quietly dropped. The model then answers from only what is left, with no warning.',
      svg:
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 200" width="100%" preserveAspectRatio="xMidYMid meet" role="img" font-family="system-ui,-apple-system,Segoe UI,Roboto,sans-serif"><title>Overflow drops the oldest text silently</title><rect x="0.5" y="0.5" width="359" height="199" rx="10" fill="#ffffff" stroke="#e6dfce"/><text x="180" y="24" text-anchor="middle" font-size="12.5" font-weight="600" fill="#1c1d1f">When it overflows, the oldest text is dropped</text><rect x="40" y="34" width="248" height="18" rx="4" fill="#efe9da" stroke="#e6dfce" opacity="0.5"/><text x="164" y="47" text-anchor="middle" font-size="10" fill="#6b7280" opacity="0.7">oldest message</text><rect x="40" y="54" width="248" height="18" rx="4" fill="#efe9da" stroke="#e6dfce" opacity="0.5"/><text x="164" y="67" text-anchor="middle" font-size="10" fill="#6b7280" opacity="0.7">older message</text><text x="332" y="46" text-anchor="end" font-size="9.5" fill="#dc2626">dropped</text><line x1="24" y1="78" x2="336" y2="78" stroke="#dc2626" stroke-width="1.5" stroke-dasharray="5 4"/><text x="332" y="90" text-anchor="end" font-size="9.5" fill="#dc2626">window edge</text><rect x="40" y="92" width="248" height="18" rx="4" fill="#ffffff" stroke="#e6dfce"/><text x="164" y="105" text-anchor="middle" font-size="10" fill="#1c1d1f">recent message</text><rect x="40" y="114" width="248" height="18" rx="4" fill="#ffffff" stroke="#e6dfce"/><text x="164" y="127" text-anchor="middle" font-size="10" fill="#1c1d1f">recent message</text><rect x="40" y="136" width="248" height="18" rx="4" fill="#ffffff" stroke="#1f7a50"/><text x="164" y="149" text-anchor="middle" font-size="10" fill="#1f7a50">newest message</text><text x="332" y="127" text-anchor="end" font-size="9.5" fill="#1f7a50">kept</text><text x="180" y="178" text-anchor="middle" font-size="10" fill="#6b7280">Truncation is silent. The model answers from what survived.</text></svg>',
      keyTerms: [
        {
          term: 'Overflow',
          definition:
            'When the text you want to include is larger than the context window, so it cannot all fit and something must be removed.',
        },
        {
          term: 'Truncation',
          definition:
            'Cutting text to make it fit the window, often by dropping the oldest turns or the start of a document. It usually happens silently.',
        },
        {
          term: 'Sliding window',
          definition:
            'A history strategy that keeps only the most recent turns within the budget, letting older ones fall away as the conversation grows.',
        },
      ],
    },
    {
      heading: 'Position matters: lost in the middle',
      video: { url: "https://www.youtube.com/watch?v=Kf3LeaUGwlg", title: "Lost in the Middle: How Language Models use Long Context - Explained!", channel: "Weaviate vector database" },
      explanation:
        'A large window does not mean the model reads all of it equally well. In practice models attend most strongly to the beginning and the end of a long input and are weakest at recalling things buried in the middle, an effect nicknamed "lost in the middle." The practical move is to order information by importance: put the key instructions and the most relevant material near the top or the very bottom, not stranded in the center of a giant block. Filling a window to the brim with marginally relevant text can actually lower answer quality by drowning the signal.',
      caption:
        'Models pay the most attention at the start and the end of a long input and the least in the middle. Put key facts at the top or bottom, not buried in the center.',
      svg:
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 200" width="100%" preserveAspectRatio="xMidYMid meet" role="img" font-family="system-ui,-apple-system,Segoe UI,Roboto,sans-serif"><title>Models attend best at the start and end, worst in the middle</title><style>.ce4dot{animation:ce4pulse 2.2s ease-in-out infinite}@keyframes ce4pulse{0%,100%{opacity:1}50%{opacity:0.4}}@media (prefers-reduced-motion:reduce){.ce4dot{animation:none}}</style><rect x="0.5" y="0.5" width="359" height="199" rx="10" fill="#ffffff" stroke="#e6dfce"/><text x="180" y="24" text-anchor="middle" font-size="12.5" font-weight="600" fill="#1c1d1f">Edges are read best, the middle gets lost</text><text x="30" y="46" font-size="10" fill="#0b5394">attention</text><path d="M40,66 Q180,150 320,66" fill="none" stroke="#0b5394" stroke-width="2"/><line x1="40" y1="66" x2="40" y2="150" stroke="#e6dfce" stroke-dasharray="3 3"/><line x1="180" y1="108" x2="180" y2="150" stroke="#e6dfce" stroke-dasharray="3 3"/><line x1="320" y1="66" x2="320" y2="150" stroke="#e6dfce" stroke-dasharray="3 3"/><circle cx="40" cy="66" r="5" fill="#1f7a50"/><circle cx="320" cy="66" r="5" fill="#1f7a50"/><circle class="ce4dot" cx="180" cy="108" r="5" fill="#dc2626"/><text x="52" y="62" font-size="9.5" fill="#1f7a50">remembered</text><text x="308" y="62" text-anchor="end" font-size="9.5" fill="#1f7a50">remembered</text><text x="180" y="128" text-anchor="middle" font-size="9.5" fill="#dc2626">key fact here gets missed</text><rect x="28" y="150" width="304" height="22" rx="5" fill="#efe9da" stroke="#e6dfce"/><text x="180" y="165" text-anchor="middle" font-size="10" fill="#6b7280">long context, start to end</text><text x="40" y="188" font-size="10" fill="#6b7280">start</text><text x="180" y="188" text-anchor="middle" font-size="10" fill="#6b7280">middle</text><text x="320" y="188" text-anchor="end" font-size="10" fill="#6b7280">end</text></svg>',
      keyTerms: [
        {
          term: 'Lost in the middle',
          definition:
            'The tendency of models to recall information placed at the start or end of a long context better than information in the middle.',
        },
        {
          term: 'Information ordering',
          definition:
            'Arranging context so the most important instructions and evidence sit where the model attends best, near the top or bottom.',
        },
        {
          term: 'Signal-to-noise',
          definition:
            'The ratio of relevant to irrelevant text in the window. Padding with marginal material lowers it and can hurt the answer.',
        },
      ],
    },
    {
      heading: 'Fitting more in: summarize, chunk, retrieve, and cache',
      video: { url: "https://www.youtube.com/watch?v=jLuwLJBQkIs", title: "Context Engineering Clearly Explained", channel: "Tina Huang" },
      explanation:
        'When the material is bigger than the budget, you reshape it rather than dump it. Summarization compresses long history or documents into the key points so they cost fewer tokens. Chunking splits a big document into pieces so you can process or retrieve them one at a time. Retrieval (the engine behind RAG) fetches only the few most relevant chunks for the current question instead of including everything. And prompt caching lets a provider reuse the processing of an unchanged prefix (like a long fixed instruction block) across calls, cutting cost and latency. Choosing among context, retrieval, and fine-tuning is a judgment about whether the knowledge is one-off, looked-up, or permanent.',
      caption:
        'When material is too big, you reshape it instead of dumping it. Summarize, chunk, retrieve only what is relevant, or cache a fixed prefix so it fits.',
      svg:
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 200" width="100%" preserveAspectRatio="xMidYMid meet" role="img" font-family="system-ui,-apple-system,Segoe UI,Roboto,sans-serif"><title>Reshape oversized material to fit the window</title><rect x="0.5" y="0.5" width="359" height="199" rx="10" fill="#ffffff" stroke="#e6dfce"/><text x="180" y="24" text-anchor="middle" font-size="12.5" font-weight="600" fill="#1c1d1f">Reshape big material so it fits the window</text><rect x="22" y="48" width="64" height="116" rx="6" fill="#ffffff" stroke="#d97706" stroke-width="1.5"/><line x1="32" y1="62" x2="76" y2="62" stroke="#e6dfce" stroke-width="3"/><line x1="32" y1="74" x2="76" y2="74" stroke="#e6dfce" stroke-width="3"/><line x1="32" y1="86" x2="76" y2="86" stroke="#e6dfce" stroke-width="3"/><line x1="32" y1="98" x2="76" y2="98" stroke="#e6dfce" stroke-width="3"/><line x1="32" y1="110" x2="76" y2="110" stroke="#e6dfce" stroke-width="3"/><line x1="32" y1="122" x2="76" y2="122" stroke="#e6dfce" stroke-width="3"/><line x1="32" y1="134" x2="76" y2="134" stroke="#e6dfce" stroke-width="3"/><line x1="32" y1="146" x2="76" y2="146" stroke="#e6dfce" stroke-width="3"/><text x="54" y="180" text-anchor="middle" font-size="10" fill="#d97706">too big</text><rect x="118" y="50" width="124" height="22" rx="11" fill="#ffffff" stroke="#d97706" stroke-width="1.5"/><text x="180" y="65" text-anchor="middle" font-size="11" fill="#d97706">Summarize</text><rect x="118" y="80" width="124" height="22" rx="11" fill="#ffffff" stroke="#0b5394" stroke-width="1.5"/><text x="180" y="95" text-anchor="middle" font-size="11" fill="#0b5394">Chunk</text><rect x="118" y="110" width="124" height="22" rx="11" fill="#ffffff" stroke="#1f7a50" stroke-width="1.5"/><text x="180" y="125" text-anchor="middle" font-size="11" fill="#1f7a50">Retrieve</text><rect x="118" y="140" width="124" height="22" rx="11" fill="#ffffff" stroke="#2f8cff" stroke-width="1.5"/><text x="180" y="155" text-anchor="middle" font-size="11" fill="#2f8cff">Cache</text><rect x="276" y="80" width="62" height="52" rx="6" fill="#efe9da" stroke="#1f7a50" stroke-width="1.5"/><text x="307" y="103" text-anchor="middle" font-size="11" fill="#1f7a50">Window</text><text x="307" y="118" text-anchor="middle" font-size="9.5" fill="#6b7280">fits</text><line x1="86" y1="106" x2="112" y2="106" stroke="#6b7280" stroke-width="1.5"/><polygon points="118,106 111,102 111,110" fill="#6b7280"/><line x1="242" y1="106" x2="270" y2="106" stroke="#6b7280" stroke-width="1.5"/><polygon points="276,106 269,102 269,110" fill="#6b7280"/></svg>',
      keyTerms: [
        {
          term: 'Summarization',
          definition:
            'Compressing long text or conversation history into its key points so it occupies far fewer tokens in the window.',
        },
        {
          term: 'Chunking',
          definition:
            'Splitting a long document into smaller passages so each fits the budget and can be searched or processed independently.',
        },
        {
          term: 'Prompt caching',
          definition:
            'Reusing the model\'s processing of an unchanged prompt prefix across calls, so repeated long context is cheaper and faster the second time.',
        },
      ],
    },
  ],
  cards: [
    {
      id: 'contexteng-0',
      categoryKey: 'contexteng',
      category: 'Context Windows & Context Engineering',
      subtopic: 'What a context window is',
      question: 'What is a context window?',
      answer:
        'The fixed maximum amount of text, measured in tokens, that a model can consider in a single call. It holds everything the model sees at once: the system prompt, the conversation history, any pasted documents, and the answer it is generating.',
      plain:
        'Picture the model working at a desk that only fits so many pages. The context window is the size of that desk. Anything not on the desk right now simply does not exist for the model, no matter how important it was earlier.',
      difficulty: 'core',
    },
    {
      id: 'contexteng-1',
      categoryKey: 'contexteng',
      category: 'Context Windows & Context Engineering',
      subtopic: 'Tokens shared by input and output',
      question: 'Do the prompt and the answer share the same context window, or get separate space?',
      answer:
        'They share the same window. Input (instructions, history, pasted data) and the generated output draw from one token budget. If the input nearly fills the window, there is little room left for the model to write, and a long answer may be cut off.',
      plain:
        'It is one shared whiteboard, not two. If you cover the whole board with your notes, there is nowhere left for the model to write its reply. Leave space for the answer or it runs out of room mid-sentence.',
      difficulty: 'core',
    },
    {
      id: 'contexteng-2',
      categoryKey: 'contexteng',
      category: 'Context Windows & Context Engineering',
      subtopic: 'Overflow and truncation',
      question: 'What happens when the text you supply is larger than the context window?',
      answer:
        'It overflows, and something gets dropped to make it fit, a process called truncation. Tools commonly trim the oldest messages or the start of a document. The model then answers using only the text that survived, usually with no warning that material was cut.',
      plain:
        'Think of a tape recorder that only holds 60 minutes: record longer and the beginning gets taped over. The model happily answers from whatever is left, never telling you the opening got erased.',
      difficulty: 'core',
    },
    {
      id: 'contexteng-3',
      categoryKey: 'contexteng',
      category: 'Context Windows & Context Engineering',
      subtopic: 'Lost-in-the-middle and position effects',
      question: 'What is the "lost in the middle" effect?',
      answer:
        'The tendency of models to recall information placed at the start or end of a long context better than information buried in the middle. Even when a fact is technically inside the window, the model may overlook it if it sits deep in the center of a large block of text.',
      plain:
        'It is like skimming a long article: you remember the opening and the conclusion, but the stuff in the middle blurs. Models do the same, so a key detail stranded in the center can get effectively ignored.',
      difficulty: 'core',
    },
    {
      id: 'contexteng-4',
      categoryKey: 'contexteng',
      category: 'Context Windows & Context Engineering',
      subtopic: 'Relevance and information ordering',
      question: 'Given the lost-in-the-middle effect, how should you order information in a long prompt?',
      answer:
        'Put the most important instructions and the most relevant evidence near the top or the very bottom, where the model attends best, rather than in the center of a large block. Avoid padding the window with marginal material that pushes the key content into the weak middle.',
      plain:
        'Front-load and back-load the stuff that matters. If you have one crucial sentence, do not bury it on page 40 of a 60-page paste. Put it where the model is paying the most attention: the beginning or the end.',
      difficulty: 'intermediate',
    },
    {
      id: 'contexteng-5',
      categoryKey: 'contexteng',
      category: 'Context Windows & Context Engineering',
      subtopic: 'What a context window is',
      question: 'Does a model remember your previous separate conversations on its own?',
      answer:
        'No. A model is stateless between calls: it keeps no memory of past chats by itself. Anything it appears to "remember" is being resupplied in the context window each time, usually as a transcript of the conversation that the app sends along with your new message.',
      plain:
        'The model does not carry memories from yesterday. Each time, it is handed a fresh transcript and reads it cold, like a temp worker who is given the case file every morning and remembers nothing once they go home.',
      difficulty: 'core',
    },
    {
      id: 'contexteng-6',
      categoryKey: 'contexteng',
      category: 'Context Windows & Context Engineering',
      subtopic: 'Conversation memory and history management',
      question: 'If the model is stateless, how does a chat seem to "remember" what you said earlier in the conversation?',
      answer:
        'The app resends the prior turns as part of each new request, so the whole conversation so far sits in the context window. The model is not recalling anything: it is rereading the transcript every time. As the chat grows, that history takes up more and more of the budget.',
      plain:
        'Every message you send secretly drags the entire chat history along with it. The model "remembers" only because it is rereading the full thread each turn. That is also why very long chats start to feel sluggish or forgetful: the history is eating the budget.',
      difficulty: 'core',
    },
    {
      id: 'contexteng-7',
      categoryKey: 'contexteng',
      category: 'Context Windows & Context Engineering',
      subtopic: 'Conversation memory and history management',
      question: 'How can you manage a long conversation so it keeps fitting in the window?',
      answer:
        'Trim or compress the history: keep only the most recent turns (a sliding window), summarize older turns into a short recap, or extract and pin the few durable facts that matter and drop the rest. The goal is to preserve the important state while shedding low-value back-and-forth.',
      plain:
        'Instead of dragging the entire transcript forever, keep a running summary of what matters ("client prefers email, budget is 10k") and the last few messages, and let the rest go. It is like meeting notes: you keep the decisions, not every word.',
      difficulty: 'intermediate',
    },
    {
      id: 'contexteng-8',
      categoryKey: 'contexteng',
      category: 'Context Windows & Context Engineering',
      subtopic: 'Summarization and compression',
      question: 'How does summarization help with context limits?',
      answer:
        'It compresses long history or documents into their key points, which take far fewer tokens, so more meaning fits in the budget. The trade-off is that summarizing is lossy: details not captured in the summary are gone, so you choose what to preserve based on what the task needs.',
      plain:
        'It is like replacing a two-hour meeting with a half-page of notes. You free up a ton of space, but anything you did not write down is lost, so summarize with the next question in mind.',
      difficulty: 'core',
    },
    {
      id: 'contexteng-9',
      categoryKey: 'contexteng',
      category: 'Context Windows & Context Engineering',
      subtopic: 'Chunking long documents',
      question: 'What is chunking, and why is it used for long documents?',
      answer:
        'Chunking is splitting a long document into smaller passages that each fit comfortably in the budget. It lets you process pieces one at a time, or store and search them so only the most relevant chunks are pulled into context for a given question instead of the whole document.',
      plain:
        'A 300-page manual will not fit on the desk, so you tear it into labeled sections. Then for any question you grab just the two or three sections that matter, instead of trying to read the whole book at once.',
      difficulty: 'intermediate',
    },
    {
      id: 'contexteng-10',
      categoryKey: 'contexteng',
      category: 'Context Windows & Context Engineering',
      subtopic: 'Relevance and information ordering',
      question: 'Why should you include only relevant material in the context instead of everything you have?',
      answer:
        'Because irrelevant text lowers the signal-to-noise ratio, can distract the model, and pushes important content into the weakly attended middle. More context is not automatically better: a focused, relevant prompt often beats a bloated one, and it costs less and runs faster too.',
      plain:
        'Giving the model everything "just in case" is like answering a quick question by dumping every file you own on someone\'s desk. The useful page gets lost in the pile. Hand over only what is relevant and the answer gets better, cheaper, and faster.',
      difficulty: 'core',
    },
    {
      id: 'contexteng-11',
      categoryKey: 'contexteng',
      category: 'Context Windows & Context Engineering',
      subtopic: 'Context vs retrieval vs fine-tuning',
      question: 'When should you put knowledge in the context window versus using retrieval versus fine-tuning?',
      answer:
        'Use the context window for one-off material relevant to this request. Use retrieval (RAG) when the knowledge is large or changing and you only need the relevant slice per question. Use fine-tuning when you want a permanent behavior or style baked in, not facts looked up. They solve different problems and are often combined.',
      plain:
        'Context is a sticky note for right now. Retrieval is a filing cabinet you pull the right folder from each time. Fine-tuning is training a habit into the employee. A phone number for today goes on the sticky note, the company handbook goes in the cabinet, and "always be polite" gets trained in.',
      difficulty: 'intermediate',
    },
    {
      id: 'contexteng-12',
      categoryKey: 'contexteng',
      category: 'Context Windows & Context Engineering',
      subtopic: 'Long-context cost and latency',
      question: 'How does using a very long context affect cost and speed?',
      answer:
        'You pay for input tokens, so a longer context costs more per call, and processing more tokens generally makes the response slower to start and finish. So filling a huge window has a real price in both money and latency, which is another reason to include only what the task needs.',
      plain:
        'Stuffing the window is not free: you are billed per token and the model takes longer to chew through more text. A bloated prompt is like overpacking a suitcase, it costs extra and slows you down, so pack only what you will use.',
      difficulty: 'intermediate',
    },
    {
      id: 'contexteng-13',
      categoryKey: 'contexteng',
      category: 'Context Windows & Context Engineering',
      subtopic: 'Relevance and information ordering',
      question: 'True or false: now that windows are huge, you can just paste in everything and let the model sort it out.',
      answer:
        'False. A bigger window removes the hard size limit but not the uneven attention, the cost per token, or the slowdown. Dumping everything lowers signal-to-noise, can bury key facts in the weak middle, and wastes money. Curating what goes in still matters, arguably more as windows grow.',
      plain:
        'A bigger desk does not make you read better, it just lets you pile on more clutter. The model still skims the middle, still charges by the page, and still works slower with more on the desk. Choosing what to include never stopped mattering.',
      difficulty: 'core',
    },
    {
      id: 'contexteng-14',
      categoryKey: 'contexteng',
      category: 'Context Windows & Context Engineering',
      subtopic: 'Prompt caching basics',
      question: 'What is prompt caching, and what problem does it solve?',
      answer:
        'Prompt caching lets a provider reuse the processing of an unchanged prompt prefix (such as a long fixed instruction block or document) across calls, instead of reprocessing it every time. It cuts cost and latency when you repeatedly send the same large preamble with only the tail changing.',
      plain:
        'If you start every request with the same long setup, caching is like the model bookmarking that setup so it does not have to reread it from scratch each time. You pay full price once, then a discount on the repeats, and it answers faster.',
      difficulty: 'intermediate',
    },
    {
      id: 'contexteng-15',
      categoryKey: 'contexteng',
      category: 'Context Windows & Context Engineering',
      subtopic: 'Overflow and truncation',
      question: 'Why is silent truncation especially dangerous?',
      answer:
        'Because the model gives a confident, complete-looking answer based only on the text that survived, with no flag that part of the input was dropped. You can get a fluent answer that is wrong simply because the key paragraph fell off the edge of the window unnoticed.',
      plain:
        'It is the worst kind of error: invisible. The model does not say "I only saw half your document." It just answers as if it saw everything, so you trust a reply that quietly skipped the part that mattered.',
      difficulty: 'intermediate',
    },
    {
      id: 'contexteng-16',
      categoryKey: 'contexteng',
      category: 'Context Windows & Context Engineering',
      subtopic: 'Lost-in-the-middle and position effects',
      question: 'Why do models tend to attend less well to the middle of a long context?',
      answer:
        'It stems from how position is handled and what training data looks like: models see relatively few examples that require pulling a single fact from deep in a very long input, and position-encoding and attention patterns tend to favor the recent end and the salient start. The middle gets the weakest, most diluted attention.',
      plain:
        'The model was mostly trained on shorter texts and on patterns where the beginning and the latest words matter most. So when you hand it a giant block, its attention naturally pools at the edges and thins out in the middle, where it was least practiced at digging.',
      difficulty: 'advanced',
    },
    {
      id: 'contexteng-17',
      categoryKey: 'contexteng',
      category: 'Context Windows & Context Engineering',
      subtopic: 'Long-context cost and latency',
      question: 'Why does the cost of processing context tend to grow faster than linearly with length?',
      answer:
        'In standard attention, each token compares itself with every other token, so the comparison work grows with the square of the length (double the tokens, roughly quadruple the attention work). Modern systems use optimizations to soften this, but very long contexts remain disproportionately expensive and slower.',
      plain:
        'If everyone in a room has to shake hands with everyone else, doubling the guests roughly quadruples the handshakes. Attention works similarly across tokens, so a context twice as long can cost far more than twice as much to process.',
      difficulty: 'advanced',
    },
    {
      id: 'contexteng-18',
      categoryKey: 'contexteng',
      category: 'Context Windows & Context Engineering',
      subtopic: 'Relevance and information ordering',
      question: 'What is "context rot" or distraction, and how does it hurt long-context performance?',
      answer:
        'As you add more text, especially marginally relevant or contradictory material, the model can get distracted and its accuracy on the real task can drop even though everything technically fits. More context past a point becomes a liability, diluting attention and introducing conflicting cues rather than helping.',
      plain:
        'Past a certain point, extra context is like background chatter at a meeting: the more voices, the harder it is to follow the one that matters. Piling on text can actually make answers worse, not better, even when it all fits in the window.',
      difficulty: 'advanced',
    },
    {
      id: 'contexteng-19',
      categoryKey: 'contexteng',
      category: 'Context Windows & Context Engineering',
      subtopic: 'Lost-in-the-middle and position effects',
      question: 'What does a "needle in a haystack" test measure, and why is it useful?',
      answer:
        'It hides a specific fact (the needle) somewhere inside a very long context (the haystack) and asks the model to retrieve it, varying the position. It measures how reliably a model recalls information across the whole window, and it exposes weak spots like the lost-in-the-middle dip.',
      plain:
        'You slip one odd sentence into a huge wall of text, move it around, and check whether the model can find it. It is a stress test for long memory: if it only finds the needle near the edges, you have proof the middle is its blind spot.',
      difficulty: 'intermediate',
    },
  ],
};

export default mod;
