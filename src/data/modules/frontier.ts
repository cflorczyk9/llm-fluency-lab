import type { Category } from '../../types';

const mod: Category = {
  key: 'frontier',
  name: 'Where It Is Heading',
  tier: 4,
  summary:
    'A grounded look at where language models are going in the near term: longer context and memory, stronger reasoning and agents, more senses, and steadily cheaper, smaller models that still perform well. This module separates well-supported trends from hype, explains why predictions are uncertain, and gives you a habit for staying current and for investing in skills that survive the constant churn.',
  learningObjectives: [
    'By the end you can summarize the main directions the field is moving in, in plain terms',
    'By the end you can separate well-supported trends from speculation and hype',
    'By the end you can explain why predictions are uncertain and how to reason about them',
    'By the end you can identify durable skills that survive model churn',
    'By the end you can describe open problems researchers are still working on',
    'By the end you can build a habit for staying current without chasing every release',
  ],
  breakdown: [
    {
      heading: 'The main directions',
      video: { url: "https://www.youtube.com/watch?v=_WYiaeLwfeQ", title: "The Real Frontier of AI (2026): Agents, Multimodal Models, and the Next Architecture", channel: "Physics helper" },
      caption:
        'Four trends are well underway: longer context and memory, stronger reasoning and agents, more senses, and cheaper smaller models.',
      svg:
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 200" width="100%" preserveAspectRatio="xMidYMid meet" role="img" font-family="system-ui, -apple-system, Helvetica, Arial, sans-serif"><title>Four main directions language models are heading</title><defs><marker id="arF1" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#1f7a50"/></marker></defs><rect x="0" y="0" width="360" height="200" rx="10" fill="#f7f3ea"/><text x="180" y="24" text-anchor="middle" font-size="14" font-weight="700" fill="#1c1d1f">The main directions</text><rect x="16" y="42" width="158" height="64" rx="8" fill="#ffffff" stroke="#e6dfce" stroke-width="1.5"/><text x="30" y="68" font-size="11" font-weight="700" fill="#1c1d1f">Context and memory</text><text x="30" y="86" font-size="8.5" fill="#6b7280">hold more, recall across chats</text><line x1="158" y1="98" x2="158" y2="64" stroke="#1f7a50" stroke-width="2" marker-end="url(#arF1)"/><rect x="186" y="42" width="158" height="64" rx="8" fill="#ffffff" stroke="#e6dfce" stroke-width="1.5"/><text x="200" y="68" font-size="11" font-weight="700" fill="#1c1d1f">Reasoning and agents</text><text x="200" y="86" font-size="8.5" fill="#6b7280">think first, then act</text><line x1="328" y1="98" x2="328" y2="64" stroke="#1f7a50" stroke-width="2" marker-end="url(#arF1)"/><rect x="16" y="118" width="158" height="64" rx="8" fill="#ffffff" stroke="#e6dfce" stroke-width="1.5"/><text x="30" y="144" font-size="11" font-weight="700" fill="#1c1d1f">More senses</text><text x="30" y="162" font-size="8.5" fill="#6b7280">text, images, audio, video</text><line x1="158" y1="174" x2="158" y2="140" stroke="#1f7a50" stroke-width="2" marker-end="url(#arF1)"/><rect x="186" y="118" width="158" height="64" rx="8" fill="#ffffff" stroke="#e6dfce" stroke-width="1.5"/><text x="200" y="144" font-size="11" font-weight="700" fill="#1c1d1f">Cheaper and smaller</text><text x="200" y="162" font-size="8.5" fill="#6b7280">same quality, lower cost</text><line x1="328" y1="174" x2="328" y2="140" stroke="#1f7a50" stroke-width="2" marker-end="url(#arF1)"/></svg>',
      explanation:
        'A few trends are well underway and broadly agreed on. Context windows and memory are growing, so models can take in more at once and carry information across sessions. Reasoning is improving, especially by letting a model spend more effort thinking before it answers, which feeds directly into agents that plan and take multi-step actions. Models are gaining more senses, handling images, audio, and video alongside text, with early steps toward controlling software and robots. And efficiency is rising, so the quality that once required a giant model increasingly fits in a smaller, cheaper, faster one. These are extrapolations of visible progress rather than guarantees, but they are the safest bets about the near term.',
      keyTerms: [
        {
          term: 'Memory',
          definition:
            'A model\'s ability to retain and reuse information beyond a single prompt, for example remembering facts about you across separate conversations, usually built with external storage rather than a bigger context window alone.',
        },
        {
          term: 'Reasoning model',
          definition:
            'A model tuned to spend extra computation working through a problem step by step before answering, trading speed and cost for better results on hard tasks.',
        },
        {
          term: 'Agent',
          definition:
            'A system that uses a model to plan and carry out multi-step tasks by calling tools and acting, rather than only producing a single block of text.',
        },
      ],
    },
    {
      heading: 'The economics of getting cheaper',
      video: { url: "https://www.youtube.com/watch?v=jFzogzqrCug", title: "How AI Pricing Works (This May Shock You!)", channel: "Pretty Wired Builds" },
      caption:
        'The price for a fixed level of quality keeps dropping over time. Open models trail the closed frontier and push costs down further.',
      svg:
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 200" width="100%" preserveAspectRatio="xMidYMid meet" role="img" font-family="system-ui, -apple-system, Helvetica, Arial, sans-serif"><title>Cost for a given capability falls over time</title><rect x="0" y="0" width="360" height="200" rx="10" fill="#f7f3ea"/><text x="180" y="24" text-anchor="middle" font-size="14" font-weight="700" fill="#1c1d1f">Cost for the same quality keeps falling</text><line x1="46" y1="44" x2="46" y2="158" stroke="#6b7280" stroke-width="1.4"/><line x1="46" y1="158" x2="336" y2="158" stroke="#6b7280" stroke-width="1.4"/><text x="46" y="40" text-anchor="middle" font-size="9" fill="#6b7280">cost</text><text x="332" y="172" text-anchor="end" font-size="9" fill="#6b7280">time</text><path d="M58,64 C120,118 210,146 326,150" fill="none" stroke="#2f8cff" stroke-width="2.4"/><path d="M78,90 C150,134 220,148 326,153" fill="none" stroke="#1f7a50" stroke-width="2" stroke-dasharray="5 3"/><rect x="206" y="54" width="14" height="4" fill="#2f8cff"/><text x="224" y="61" font-size="9" fill="#1c1d1f">closed frontier</text><line x1="206" y1="74" x2="220" y2="74" stroke="#1f7a50" stroke-width="2" stroke-dasharray="5 3"/><text x="224" y="77" font-size="9" fill="#1c1d1f">open follows</text><text x="120" y="142" font-size="9" fill="#6b7280">cheaper every year</text></svg>',
      explanation:
        'Alongside capability, the cost of a given level of capability has fallen steadily and quickly, driven by better hardware, better training methods, and efficiency techniques that shrink models without gutting quality. The practical effect is that tasks too expensive to automate at scale one year become affordable the next, which keeps widening where these tools make sense. There is also a tug-of-war between closed frontier models and open-weight models you can run yourself: the closed ones usually set the capability ceiling first, while strong open models follow and push prices down. How that race plays out shapes who controls the technology and at what cost, which is one of the genuinely open questions about the trajectory.',
      keyTerms: [
        {
          term: 'Cost curve',
          definition:
            'How the price for a given capability changes over time. For models it has trended sharply downward, so the same quality keeps getting cheaper to run.',
        },
        {
          term: 'Open-weight trajectory',
          definition:
            'The path of downloadable, self-hostable models, which tend to trail the closed frontier in capability but follow closely and drive prices down.',
        },
        {
          term: 'Efficiency frontier',
          definition:
            'The best capability achievable at a given cost or model size at a point in time. It moves outward as methods improve, so small models keep getting more capable.',
        },
      ],
    },
    {
      heading: 'Open problems and honest uncertainty',
      video: { url: "https://www.youtube.com/watch?v=IcqEBdYGYyY", title: "AI Bubble? Why the Hype Dies but Machine Learning Stays", channel: "David Bombal" },
      caption:
        'Progress is real but uneven, and the path ahead is uncertain. Confident mistakes, long tasks, and alignment stay unsolved.',
      svg:
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 200" width="100%" preserveAspectRatio="xMidYMid meet" role="img" font-family="system-ui, -apple-system, Helvetica, Arial, sans-serif"><title>Progress is real and uneven with an uncertain future</title><rect x="0" y="0" width="360" height="200" rx="10" fill="#f7f3ea"/><text x="180" y="24" text-anchor="middle" font-size="14" font-weight="700" fill="#1c1d1f">Real progress, honest uncertainty</text><line x1="40" y1="150" x2="324" y2="150" stroke="#6b7280" stroke-width="1.3"/><path d="M182,82 L308,56 L308,112 Z" fill="#efe9da" opacity="0.7"/><line x1="182" y1="82" x2="308" y2="56" stroke="#0b5394" stroke-width="1.4" stroke-dasharray="5 3"/><line x1="182" y1="82" x2="308" y2="112" stroke="#0b5394" stroke-width="1.4" stroke-dasharray="5 3"/><path d="M44,140 L74,122 L98,130 L126,100 L152,108 L182,82" fill="none" stroke="#2f8cff" stroke-width="2.4"/><text x="314" y="90" font-size="16" font-weight="700" fill="#d97706">?</text><text x="250" y="48" text-anchor="middle" font-size="9" fill="#0b5394">uncertain ahead</text><text x="70" y="68" font-size="9" fill="#6b7280">uneven progress</text><text x="180" y="166" text-anchor="middle" font-size="9" fill="#6b7280">still unsolved</text><rect x="16" y="172" width="104" height="20" rx="5" fill="#ffffff" stroke="#e6dfce" stroke-width="1.2"/><text x="68" y="185" text-anchor="middle" font-size="8.5" fill="#1c1d1f">confident mistakes</text><rect x="128" y="172" width="116" height="20" rx="5" fill="#ffffff" stroke="#e6dfce" stroke-width="1.2"/><text x="186" y="185" text-anchor="middle" font-size="8" fill="#1c1d1f">long-horizon reliability</text><rect x="252" y="172" width="92" height="20" rx="5" fill="#ffffff" stroke="#e6dfce" stroke-width="1.2"/><text x="298" y="185" text-anchor="middle" font-size="8.5" fill="#1c1d1f">alignment</text></svg>',
      explanation:
        'Real progress sits next to stubborn, unsolved problems, and a clear-eyed view holds both. Models still make confident mistakes, struggle to know the limits of their own knowledge, and can behave unpredictably on inputs unlike their training. Long-horizon reliability, staying coherent and correct over many steps, is hard, which is why fully autonomous agents remain fragile. Safety and governance are active areas: how to keep systems aligned with human intent, how to evaluate them, and how society should oversee them. Predictions are uncertain because progress comes in uneven jumps, benchmarks can mislead, and incentives push hype. The right stance is to track what is actually shipping and working rather than what is promised.',
      keyTerms: [
        {
          term: 'Reliability (long-horizon)',
          definition:
            'Staying correct and coherent across many steps or a long task. A model can be impressive for one step yet drift or compound errors over a long sequence.',
        },
        {
          term: 'Alignment',
          definition:
            'The problem of making a system reliably pursue what people actually intend, including being honest about uncertainty and not causing unintended harm.',
        },
        {
          term: 'Hype',
          definition:
            'Claims that outrun the evidence, often driven by marketing, funding, or attention. Distinguished from substance by looking for shipped, reproducible results.',
        },
      ],
    },
    {
      heading: 'Signal, noise, and staying current',
      video: { url: "https://www.youtube.com/watch?v=bSv3vAfx1Xw", title: "AI Hype vs. Reality: Avoid the Tech Bubble!", channel: "STARTUP HAKK" },
      caption:
        'Invest in skills that last across models, like prompting, grounding, and judging output. Treat names, prices, and benchmarks as details that expire.',
      svg:
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 200" width="100%" preserveAspectRatio="xMidYMid meet" role="img" font-family="system-ui, -apple-system, Helvetica, Arial, sans-serif"><title>Durable skills last while ephemeral details expire</title><rect x="0" y="0" width="360" height="200" rx="10" fill="#f7f3ea"/><text x="180" y="24" text-anchor="middle" font-size="14" font-weight="700" fill="#1c1d1f">Durable skills vs ephemeral details</text><rect x="16" y="42" width="158" height="118" rx="8" fill="#ffffff" stroke="#1f7a50" stroke-width="1.6"/><text x="95" y="62" text-anchor="middle" font-size="11" font-weight="700" fill="#1f7a50">Durable: keep</text><path d="M30,84 l4,5 l8,-11" fill="none" stroke="#1f7a50" stroke-width="2"/><text x="48" y="88" font-size="9.5" fill="#1c1d1f">how they work</text><path d="M30,102 l4,5 l8,-11" fill="none" stroke="#1f7a50" stroke-width="2"/><text x="48" y="106" font-size="9.5" fill="#1c1d1f">prompt and ground</text><path d="M30,120 l4,5 l8,-11" fill="none" stroke="#1f7a50" stroke-width="2"/><text x="48" y="124" font-size="9.5" fill="#1c1d1f">evaluate output</text><path d="M30,138 l4,5 l8,-11" fill="none" stroke="#1f7a50" stroke-width="2"/><text x="48" y="142" font-size="9.5" fill="#1c1d1f">use responsibly</text><rect x="186" y="42" width="158" height="118" rx="8" fill="#ffffff" stroke="#e6dfce" stroke-width="1.5"/><text x="265" y="62" text-anchor="middle" font-size="10.5" font-weight="700" fill="#6b7280">Ephemeral: hold loosely</text><circle cx="206" cy="84" r="2.5" fill="#6b7280"/><text x="216" y="88" font-size="9.5" fill="#6b7280">model name</text><circle cx="206" cy="104" r="2.5" fill="#6b7280"/><text x="216" y="108" font-size="9.5" fill="#6b7280">price</text><circle cx="206" cy="124" r="2.5" fill="#6b7280"/><text x="216" y="128" font-size="9.5" fill="#6b7280">context size</text><text x="265" y="148" text-anchor="middle" font-size="8.5" fill="#d97706">these change fast</text><text x="180" y="184" text-anchor="middle" font-size="9.5" fill="#6b7280">Habit: few sources, test on your own tasks</text></svg>',
      explanation:
        'Because models change monthly, the worst strategy is to memorize the leaderboard, and the best is to invest in skills and judgment that outlast any one model. The durable skills are the ones this whole curriculum teaches: how these systems work, how to prompt and ground them, how to evaluate output, and how to use them responsibly. Those transfer across vendors and versions. The ephemeral details (a specific model name, a price, a context-window number) are worth knowing but not worth memorizing, because they expire. To stay current without drowning, follow a small number of trustworthy sources, test new models on your own examples rather than trusting announcements, and update your mental model on the trend lines, not every press release.',
      keyTerms: [
        {
          term: 'Durable skill',
          definition:
            'An ability that stays useful across model generations, such as evaluating outputs, writing clear prompts, and judging when to trust a result.',
        },
        {
          term: 'Ephemeral detail',
          definition:
            'A fact tied to a specific model or moment (a name, a price, a benchmark score) that is likely to change soon and is not worth memorizing.',
        },
        {
          term: 'Staying current',
          definition:
            'A sustainable habit of tracking a few reliable sources and testing changes on your own tasks, rather than reacting to every release.',
        },
      ],
    },
  ],
  cards: [
    {
      id: 'frontier-0',
      categoryKey: 'frontier',
      category: 'Where It Is Heading',
      subtopic: 'Longer context and memory',
      question: 'What is the near-term trend in context and memory, and what does it enable?',
      answer:
        'Context windows are growing so models can read more at once, and separate memory mechanisms are emerging so models can retain information across sessions rather than forgetting everything between chats. Together these let a model work over whole documents or codebases and build up persistent knowledge about a user or project, making longer, more continuous tasks possible.',
      plain:
        'Two things are expanding: how much a model can hold in mind at one time, and whether it remembers you next time. The first is a bigger desk, and the second is a notebook it keeps between visits. Both let it help with longer, ongoing work instead of starting from zero each chat.',
      difficulty: 'core',
    },
    {
      id: 'frontier-1',
      categoryKey: 'frontier',
      category: 'Where It Is Heading',
      subtopic: 'Better reasoning and agents',
      question: 'How is improved reasoning connected to the rise of agents?',
      answer:
        'Reasoning is improving largely by letting models spend more computation thinking through a problem before answering, which raises their reliability on multi-step problems. That same ability to plan and self-correct is what agents depend on, because an agent must break a goal into steps, decide which tools to call, and adapt when something goes wrong. Better reasoning therefore makes agents that take real actions more feasible.',
      plain:
        'Letting a model slow down and think it through is what makes it good at multi-step problems. Agents are exactly that: take a goal, plan the steps, use tools, fix mistakes along the way. So better thinking is the engine that makes hands-on, do-the-task agents work.',
      difficulty: 'core',
    },
    {
      id: 'frontier-2',
      categoryKey: 'frontier',
      category: 'Where It Is Heading',
      subtopic: 'Multimodality',
      question: 'What is the trend toward multimodality, and why does it matter?',
      answer:
        'Models are increasingly able to take in and produce more than text, handling images, audio, and video, so a single system can read a chart, describe a photo, transcribe speech, or discuss a video. It matters because most real-world information is not plain text, so multimodal models can work directly on the documents, screens, and recordings people actually have, instead of needing everything converted to text first.',
      plain:
        'Models are gaining eyes and ears, not just the ability to read. That matters because real life is full of pictures, screenshots, and audio. A model that can look at your photo or listen to your recording can help with far more than one that only reads typed words.',
      difficulty: 'core',
    },
    {
      id: 'frontier-3',
      categoryKey: 'frontier',
      category: 'Where It Is Heading',
      subtopic: 'Embodiment',
      question: 'What does "embodiment" refer to as a frontier direction, and how settled is it?',
      answer:
        'Embodiment refers to connecting models to systems that act in the physical or digital world, from controlling software interfaces to guiding robots. It is an active research direction with early, uneven results: navigating real environments reliably is much harder than producing text, because the physical world is unforgiving and feedback is messy. So it is a real trend to watch but far less mature than text or image capabilities.',
      plain:
        'Embodiment is hooking a model up to a body, whether that is clicking around an app or driving a robot. It is promising but early. Talking about a task is one thing. Reliably doing it in the messy real world, where a small slip has real consequences, is much harder.',
      difficulty: 'intermediate',
    },
    {
      id: 'frontier-4',
      categoryKey: 'frontier',
      category: 'Where It Is Heading',
      subtopic: 'Efficiency',
      question: 'Why is "smaller models that are still very capable" an important trend?',
      answer:
        'Because better training data, better methods, and compression techniques keep moving the quality that once needed a giant model into smaller, cheaper, faster ones. That broadens where models can be deployed, including on phones and laptops and inside cost-sensitive, high-volume systems, and it reduces reliance on expensive frontier models for everyday tasks. The capability floor keeps rising even as size and cost fall.',
      plain:
        'Last year\'s supercomputer-grade smarts keep showing up in this year\'s pocket-sized models. That means more capability you can run cheaply, quickly, even on your own laptop or phone, so you do not need the biggest, priciest model for ordinary jobs.',
      difficulty: 'core',
    },
    {
      id: 'frontier-5',
      categoryKey: 'frontier',
      category: 'Where It Is Heading',
      subtopic: 'Cost curves',
      question: 'What has happened to the cost of a given level of capability over time, and why?',
      answer:
        'The cost to achieve a given capability has fallen steadily and quickly, driven by better hardware, more efficient training and serving methods, and techniques that shrink models without large quality loss. The effect is that tasks too expensive to automate at scale one year often become affordable the next, which keeps expanding the range of practical uses. The trend is downward even though the very newest frontier models can still be expensive.',
      plain:
        'The price for a fixed level of smarts keeps dropping, like how a given amount of computing power gets cheaper every year. So things that were too costly to automate at scale last year quietly become affordable this year. The newest top model is still pricey, but yesterday\'s top quality keeps getting cheap.',
      difficulty: 'intermediate',
    },
    {
      id: 'frontier-6',
      categoryKey: 'frontier',
      category: 'Where It Is Heading',
      subtopic: 'Open vs closed trajectory',
      question: 'How is the relationship between closed frontier models and open-weight models likely to evolve?',
      answer:
        'The common pattern is that closed frontier models set the capability ceiling first, while strong open-weight models follow some months behind and push prices down and control outward. Whether that gap widens or narrows is genuinely uncertain and depends on funding, hardware access, and research breakthroughs. The practical takeaway is to expect capable open options to keep arriving, which is good for avoiding lock-in, while the absolute frontier may stay closed.',
      plain:
        'Closed labs usually reach the newest heights first, then capable free-to-run models catch up a bit later and drive prices down. Will they ever fully close the gap? Genuinely unknown. But you can count on strong open options continuing to appear, which is healthy for keeping your choices flexible.',
      difficulty: 'intermediate',
    },
    {
      id: 'frontier-7',
      categoryKey: 'frontier',
      category: 'Where It Is Heading',
      subtopic: 'Hype vs substance',
      question: 'How can you tell hype from substance when a new model or capability is announced?',
      answer:
        'Look for shipped, reproducible results rather than promises: can you or others actually use it, does it work on independent examples and not just curated demos, and do the claims survive testing on your own tasks. Be skeptical of cherry-picked demos, vague superlatives, and benchmark wins with no real-world follow-through. Substance shows up as consistent performance you can verify, while hype shows up as a great demo you cannot reproduce.',
      plain:
        'Ask "can I actually use this today, and does it hold up on my own examples?" A polished demo proves someone can stage one good result. Substance is when it keeps working when you try it yourself. If you cannot reproduce the magic, treat it as hype until proven otherwise.',
      difficulty: 'core',
    },
    {
      id: 'frontier-8',
      categoryKey: 'frontier',
      category: 'Where It Is Heading',
      subtopic: 'Trend vs speculation',
      question: 'How do you separate a well-supported trend from speculation about the future?',
      answer:
        'A well-supported trend is an extrapolation of progress you can already see across multiple releases, such as falling costs or growing context windows. Speculation extends far beyond current evidence, often to specific dates or sweeping claims about what models will be able to do. Treat near-term extrapolations of visible trend lines as reasonably reliable and treat confident long-range or precise predictions as low-confidence guesses, however compelling they sound.',
      plain:
        'If something has been improving steadily for a while, expecting a bit more of it is a fair bet. Claiming exactly when machines will match humans at everything is a guess dressed up as a forecast. Trust the gentle continuation of visible lines, and be wary of bold leaps with a date attached.',
      difficulty: 'intermediate',
    },
    {
      id: 'frontier-9',
      categoryKey: 'frontier',
      category: 'Where It Is Heading',
      subtopic: 'Why predictions are uncertain',
      question: 'Why are predictions about model progress inherently uncertain?',
      answer:
        'Because progress arrives in uneven jumps rather than a smooth line, breakthroughs are hard to schedule, benchmarks can mislead about real ability, and strong incentives (funding, attention, marketing) push optimistic claims. Capabilities can also appear suddenly at scale in ways that were not predicted in advance. So even informed forecasts carry wide error bars, and anyone projecting precise outcomes is overstating their certainty.',
      plain:
        'The field moves in fits and starts, not a tidy ramp. Surprises happen, scores can flatter, and lots of money rides on sounding bullish. Add it up and even smart predictions are blurry. Anyone who tells you exactly what happens and when is more confident than the evidence allows.',
      difficulty: 'core',
    },
    {
      id: 'frontier-10',
      categoryKey: 'frontier',
      category: 'Where It Is Heading',
      subtopic: 'Durable vs ephemeral skills',
      question: 'What is the difference between durable and ephemeral skills in this field?',
      answer:
        'Durable skills stay useful across model generations: understanding how these systems work, writing clear prompts, grounding answers in your own data, evaluating outputs, and using them responsibly. Ephemeral details are tied to a specific model or moment, like a particular model name, price, or context-window size, and they change quickly. Investing your effort in the durable skills pays off, while the ephemeral facts are worth knowing but not worth memorizing.',
      plain:
        'Learning to cook is durable, while memorizing today\'s menu at one restaurant is ephemeral. Knowing how to prompt, check, and judge a model lasts across versions. The exact name and price of this month\'s top model will be stale soon, so hold those loosely.',
      difficulty: 'core',
    },
    {
      id: 'frontier-11',
      categoryKey: 'frontier',
      category: 'Where It Is Heading',
      subtopic: 'Durable vs ephemeral skills',
      question: 'Which concrete skills are most worth investing in given that models keep changing?',
      answer:
        'The transferable ones: framing a task clearly and prompting for it, supplying the right context and grounding answers in trusted data, designing evaluations so you can tell good output from bad, recognizing failure modes like confident errors, and handling data responsibly. These do not depend on any single vendor or version, so they keep paying off as models improve and as you switch between them.',
      plain:
        'Bet on the skills that move with you: asking clearly, feeding in the right information, checking the answer, spotting when it is wrong, and being careful with data. Those work no matter which model you use this year or next, which is exactly why they are worth the effort.',
      difficulty: 'intermediate',
    },
    {
      id: 'frontier-12',
      categoryKey: 'frontier',
      category: 'Where It Is Heading',
      subtopic: 'How to stay current',
      question: 'What is a sustainable habit for staying current without chasing every release?',
      answer:
        'Follow a small number of trustworthy sources instead of the full firehose, focus on trend lines rather than individual announcements, and when a release matters to you, test it on your own real examples rather than trusting the marketing. Re-check your model choice periodically rather than continuously. This keeps you informed about meaningful shifts while protecting your attention from constant, mostly low-impact news.',
      plain:
        'You do not need to read every headline. Pick a couple of sources you trust, watch the direction things are moving, and when something looks relevant, just try it on your own task. Check in now and then instead of refreshing constantly. That keeps you current without burning out.',
      difficulty: 'intermediate',
    },
    {
      id: 'frontier-13',
      categoryKey: 'frontier',
      category: 'Where It Is Heading',
      subtopic: 'Open research problems',
      question: 'What are some of the open problems researchers are still working on?',
      answer:
        'Reducing confident mistakes and getting models to know the limits of their own knowledge, achieving long-horizon reliability so they stay correct over many steps, making behavior robust on inputs unlike the training data, improving interpretability so we can understand why a model did something, and the alignment and evaluation challenges of keeping powerful systems doing what people intend. None of these is fully solved, which bounds what today\'s systems can be trusted to do.',
      plain:
        'Big unsolved ones: stopping confident wrong answers, staying reliable across long tasks, behaving sensibly on weird inputs, being able to explain why the model did something, and keeping powerful systems aligned with what we actually want. These are still open, which is why you cannot fully hand off the wheel yet.',
      difficulty: 'core',
    },
    {
      id: 'frontier-14',
      categoryKey: 'frontier',
      category: 'Where It Is Heading',
      subtopic: 'Safety and governance',
      question: 'What kinds of safety and governance trends are shaping the field?',
      answer:
        'There is growing investment in technical safety (alignment research, evaluations, and red-teaming to find failures before release), in transparency practices like documenting model limitations, and in external oversight through emerging laws, standards, and audits. The broad direction is toward treating capable models as systems that need testing, disclosure, and accountability, though the specifics vary by region and are still being worked out.',
      plain:
        'On the safety side, more effort is going into stress-testing models before launch and being upfront about their limits. On the governance side, rules and standards are taking shape to hold makers accountable. The exact rules differ by place and are still forming, but the trend is clearly toward more oversight, not less.',
      difficulty: 'intermediate',
    },
    {
      id: 'frontier-15',
      categoryKey: 'frontier',
      category: 'Where It Is Heading',
      subtopic: 'Scaling and diminishing returns',
      question: 'What do scaling trends suggest, and why might simply making models bigger hit diminishing returns?',
      answer:
        'Past progress came partly from scaling up model size, data, and compute together, which reliably improved capability. But each further gain tends to require disproportionately more resources, and high-quality training data is finite, so brute-force scaling faces rising cost and supply limits. That is part of why attention has shifted toward better data, better training methods, and spending more effort at answer time rather than only building ever-larger models.',
      plain:
        'For a while, bigger plus more data plus more computing power kept paying off. But each extra bit of improvement costs a lot more than the last, and the supply of good training text is not endless. So the field is leaning on smarter training and letting models think harder at answer time, not just supersizing them.',
      difficulty: 'advanced',
    },
    {
      id: 'frontier-16',
      categoryKey: 'frontier',
      category: 'Where It Is Heading',
      subtopic: 'Better reasoning',
      question: 'What is "test-time compute," and why is it a notable direction for reasoning?',
      answer:
        'Test-time compute means letting a model spend more computation when answering a question, for example by working through intermediate steps or exploring several approaches, rather than relying only on what was learned during training. It is notable because it offers a second lever for capability: instead of only training a bigger model, you can get better answers on hard problems by letting an existing model think longer, trading speed and cost for quality on demand.',
      plain:
        'Test-time compute is just letting the model think longer before it answers, like giving a student more time and scratch paper on a hard exam. It is a new dial: rather than building a smarter brain, you let the current brain work harder when the question deserves it, paying with a little extra time and cost.',
      difficulty: 'advanced',
    },
    {
      id: 'frontier-17',
      categoryKey: 'frontier',
      category: 'Where It Is Heading',
      subtopic: 'What survives churn',
      question: 'Given constant model churn, what is the most reliable thing for a user to anchor on?',
      answer:
        'Judgment about how to use these systems: knowing what they are good and bad at, how to frame a task, how to check an answer, and when to trust or distrust output. That judgment is built on understanding the fundamentals rather than on any one model, so it transfers across versions and vendors and actually compounds as models improve. The models change, but the skill of using them well is the durable asset.',
      plain:
        'Anchor on knowing how to drive, not on which car is newest. The models will keep changing, but your ability to give a clear task, sense when an answer is off, and decide whether to trust it only gets more valuable. That judgment is the thing worth building.',
      difficulty: 'core',
    },
    {
      id: 'frontier-18',
      categoryKey: 'frontier',
      category: 'Where It Is Heading',
      subtopic: 'Hype vs speculation',
      question: 'Common misconception: do current trends prove human-level general AI is arriving on a specific timeline?',
      answer:
        'No. Today trends show real, broad improvement, but extrapolating them to a precise date for human-level general intelligence is speculation, not a proven conclusion. Progress is uneven, current systems still have fundamental unsolved weaknesses, and confident timelines often reflect incentives more than evidence. The honest position is that the technology is advancing fast and the endpoint and pace remain genuinely uncertain, so plan for a range of outcomes rather than a single forecast.',
      plain:
        'Fast progress is real, but it does not prove a calendar date for machines that match humans at everything. The trend lines are impressive and the destination is unknown. When someone gives you a confident year, treat it as opinion, not fact, and prepare for a range of possibilities instead.',
      difficulty: 'advanced',
    },
    {
      id: 'frontier-19',
      categoryKey: 'frontier',
      category: 'Where It Is Heading',
      subtopic: 'Memory beyond context',
      question: 'Why is true long-term memory usually built outside the context window rather than just by enlarging it?',
      answer:
        'Because simply enlarging the context window is expensive and the model only sees what is currently loaded, so it still forgets once a session ends. Persistent memory is instead built by storing information externally, such as in a database or retrieval system, and pulling the relevant pieces back into the prompt when needed. That gives durable, searchable recall across sessions without paying to keep everything in the window at all times.',
      plain:
        'A giant desk still gets cleared at the end of the day, and a bigger desk is costly. Real long-term memory works more like a filing cabinet: store things outside, then pull the relevant folder back onto the desk when it is needed. That way the model can remember across days without holding everything at once.',
      difficulty: 'intermediate',
    },
  ],
};

export default mod;
