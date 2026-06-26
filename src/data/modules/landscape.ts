import type { Category } from '../../types';

const mod: Category = {
  key: 'landscape',
  name: 'The Model Landscape',
  tier: 4,
  summary:
    'The field of available models is crowded and changes fast, but it has a learnable shape. This module maps the kinds of providers, the open-versus-closed split, and how models differ on size, capability, cost, speed, context, and licensing, then gives you a simple framework for picking the right model for a task and a budget without locking yourself in.',
  learningObjectives: [
    'By the end you can map the major kinds of providers and model families at a high level',
    'By the end you can explain the closed, open-weight, and open-source distinctions and their trade-offs',
    'By the end you can compare models on capability, cost, speed, context length, and licensing',
    'By the end you can build a simple, repeatable framework for choosing a model',
    'By the end you can explain why model choice is a moving target and how to stay flexible',
    'By the end you can design your system to avoid lock-in and swap models when something better appears',
  ],
  breakdown: [
    {
      heading: 'Who makes and serves models',
      explanation:
        'The market has a few distinct kinds of players, and knowing which is which keeps you from comparing apples to oranges. Frontier labs train the largest, most capable models and usually serve them through their own paid API and apps. Open-weight providers publish the trained model files so anyone can download and run them. Cloud platforms resell access to many of these models through one account and one bill, and they add hosting, security, and compliance features. Aggregators and routers sit on top and let you call dozens of models through a single interface. The same underlying model can reach you through several of these paths at once, so "which model" and "through whom" are two separate decisions.',
      keyTerms: [
        {
          term: 'Frontier lab',
          definition:
            'A company that trains the largest, most capable general models and typically offers them as a paid service rather than a download. They set the upper bar on capability at any given time.',
        },
        {
          term: 'Open-weight provider',
          definition:
            'A group that publishes the trained model files (the weights) so others can download, run, and adapt the model on their own hardware.',
        },
        {
          term: 'Aggregator / router',
          definition:
            'A service that gives you one account and one API to reach many different models from different providers, often with automatic fallback if one is down.',
        },
      ],
    },
    {
      heading: 'Closed, open-weight, and open-source',
      explanation:
        'People say "open" to mean three different things, and the differences matter for cost, privacy, and control. A closed model is one you can only use through the provider, as a service, with no access to the files inside. An open-weight model ships the trained weights so you can run it yourself, but you usually do not get the training data or the recipe, and the license may restrict commercial use. A truly open-source model also releases the training data, code, and method so the result can be reproduced from scratch, which is rare. The trade-off is roughly control versus convenience: closed models give you the strongest capability and zero infrastructure work but the least control over data and pricing, while open-weight models give you full control and local privacy at the cost of running the hardware yourself.',
      keyTerms: [
        {
          term: 'Closed model',
          definition:
            'A model available only as a hosted service. You send prompts and get answers, but you never see or hold the model files.',
        },
        {
          term: 'Open-weight model',
          definition:
            'A model whose trained weights are published for download. You can run and fine-tune it yourself, though the license and the original training data may still be restricted or undisclosed.',
        },
        {
          term: 'Weights',
          definition:
            'The billions of learned numbers that are the trained model. Having the weights means you can run the model entirely on your own machines.',
        },
      ],
    },
    {
      heading: 'Reading a model like a spec sheet',
      explanation:
        'Every model can be compared on a handful of dimensions, and learning to read them turns a confusing catalog into a shopping list. Capability is how good the answers are on the work you actually care about. Cost is usually quoted per million tokens of input and output, so longer prompts and longer answers cost more. Speed has two parts: how long until the first word appears and how many words per second after that. Context length is how much text the model can consider at once. Modality is which kinds of input and output it handles, such as text only or also images, audio, and video. A model family is a set of related sizes from one provider, where the bigger members are smarter but slower and pricier and the smaller ones are cheaper and faster.',
      keyTerms: [
        {
          term: 'Context length',
          definition:
            'The maximum amount of text (measured in tokens) a model can take in at once, including your prompt and its own answer. Ranges from a few thousand tokens to hundreds of thousands or more.',
        },
        {
          term: 'Modality',
          definition:
            'The kinds of data a model can read or produce. Text-only models handle words alone, while multimodal models also handle images, audio, or video.',
        },
        {
          term: 'Model family',
          definition:
            'A lineup of related models from one provider at different sizes (often labeled small, medium, large), trading capability against cost and speed.',
        },
      ],
    },
    {
      heading: 'Choosing well and staying flexible',
      explanation:
        'A good choice starts from the task, not from the brand. Write down what the job needs in terms of quality, the most you are willing to pay per request, how fast it must feel, how much text it must read at once, and any rules about where data may go. Then start with the cheapest model that plausibly clears the quality bar and only move up if it falls short, because paying for frontier capability on an easy task is wasteful. Treat benchmarks as a rough first filter, never the final word, and always test on your own examples. Finally, assume your pick will be outdated within months. Keep the model name in one place in your code, keep your prompts and tests separate from any one vendor, and you can swap to a better or cheaper model later with a small change instead of a rewrite.',
      keyTerms: [
        {
          term: 'Benchmark',
          definition:
            'A standardized test that scores models on a fixed set of questions. Useful for a rough ranking, but it may not reflect your specific task and can be gamed.',
        },
        {
          term: 'Lock-in',
          definition:
            'The situation where switching providers is painful because your prompts, tools, and code are tangled up with one vendor\'s specific way of doing things.',
        },
        {
          term: 'Selection framework',
          definition:
            'A short, repeatable checklist (quality, cost, speed, context, data rules) you apply to every task so model choice is deliberate rather than driven by hype.',
        },
      ],
    },
  ],
  cards: [
    {
      id: 'landscape-0',
      categoryKey: 'landscape',
      category: 'The Model Landscape',
      subtopic: 'Kinds of providers',
      question: 'What are the main kinds of players in the model market, and why does the distinction matter?',
      answer:
        'Roughly four: frontier labs that train the most capable models and serve them as a service, open-weight providers that publish downloadable model files, cloud platforms that resell many models under one account with hosting and compliance, and aggregators/routers that give one interface to many models. It matters because the same model can reach you through several paths, so "which model" and "through which provider" are separate decisions with different cost, privacy, and reliability trade-offs.',
      plain:
        'Think of music: there are artists who make the songs, streaming services that license many artists under one subscription, and apps that switch between services for you. The same song reaches you several ways. With models, picking the model and picking who serves it to you are two different choices.',
      difficulty: 'core',
    },
    {
      id: 'landscape-1',
      categoryKey: 'landscape',
      category: 'The Model Landscape',
      subtopic: 'Closed vs open',
      question: 'What is the difference between a closed model and an open-weight model?',
      answer:
        'A closed model is available only as a hosted service: you send prompts and receive answers but never get the model files. An open-weight model publishes its trained weights so you can download, run, and fine-tune it on your own hardware. Closed models tend to offer top capability with zero infrastructure work, while open-weight models give you control and local privacy at the cost of running the hardware yourself.',
      plain:
        'A closed model is like a restaurant: you order and eat, but you never get the recipe. An open-weight model is like being handed the finished dish to take home and reheat however you like, even though you still do not get the chef notes on how it was originally cooked.',
      difficulty: 'core',
    },
    {
      id: 'landscape-2',
      categoryKey: 'landscape',
      category: 'The Model Landscape',
      subtopic: 'Open-weight vs open-source',
      question: 'Why is "open weights" not the same as "open source," and why does the gap matter?',
      answer:
        'Open weights means the trained model files are downloadable, but the training data, training code, and exact recipe are usually withheld, and the license may restrict commercial use. Truly open-source means the data, code, and method are released so the model could be reproduced from scratch, which is uncommon. The gap matters because you may be able to run a model yet still not be allowed to use it commercially, and you cannot fully audit or rebuild it.',
      plain:
        'Getting the weights is like getting a baked cake you can serve. Open source is getting the full recipe, the ingredient list, and the right to sell copies. Many "open" models hand you the cake but not the recipe, and sometimes the fine print says you cannot sell slices.',
      difficulty: 'intermediate',
    },
    {
      id: 'landscape-3',
      categoryKey: 'landscape',
      category: 'The Model Landscape',
      subtopic: 'Model families and sizes',
      question: 'What is a model family, and how do its members usually differ?',
      answer:
        'A model family is a lineup of related models from one provider, trained with a shared approach but released at different sizes, often labeled something like small, medium, and large. Bigger members are generally more capable but slower and more expensive per token, while smaller members are cheaper and faster but less capable. Sharing a family usually means they share a prompt style and behavior, so moving between sizes is low-friction.',
      plain:
        'Like a car model offered as a base trim, a mid trim, and a top trim. Same basic design, but you pick how much power you pay for. You can move up a trim for a hard job and back down for an easy one without learning a whole new car.',
      difficulty: 'core',
    },
    {
      id: 'landscape-4',
      categoryKey: 'landscape',
      category: 'The Model Landscape',
      subtopic: 'Frontier vs small',
      question: 'What is the difference between a frontier model and a small model, and when would you reach for each?',
      answer:
        'A frontier model is among the largest and most capable available, best for hard reasoning, nuance, and open-ended work, but it costs more and responds more slowly. A small model is cheaper and faster and runs on lighter hardware, well suited to high-volume, well-defined, or latency-sensitive tasks like classification, extraction, or simple replies. Reach for frontier when quality is the bottleneck and for small when cost, speed, or volume is.',
      plain:
        'A frontier model is a senior expert: brilliant on hard problems but expensive and not instant. A small model is a fast, capable junior: perfect for the steady stream of routine tasks. You would not hire the expert to sort your mail, and you would not hand the junior your hardest case.',
      difficulty: 'core',
    },
    {
      id: 'landscape-5',
      categoryKey: 'landscape',
      category: 'The Model Landscape',
      subtopic: 'Capability vs cost vs speed',
      question: 'Why is choosing a model often described as a three-way trade-off?',
      answer:
        'Because capability, cost, and speed usually pull against each other. The most capable models tend to be the most expensive and the slowest to respond, while the cheapest and fastest models tend to be less capable. You rarely get all three at once, so a sensible choice means deciding which of the three matters most for the task and accepting compromises on the others.',
      plain:
        'It is the old "good, cheap, fast: pick two" rule. A genius that answers instantly for free does not exist. You decide whether this task most needs the smartest answer, the lowest bill, or the quickest reply, and you trade away some of the rest.',
      difficulty: 'core',
    },
    {
      id: 'landscape-6',
      categoryKey: 'landscape',
      category: 'The Model Landscape',
      subtopic: 'Context length',
      question: 'How should context length factor into choosing a model?',
      answer:
        'Context length is the most text a model can consider at once, covering both your input and its answer. If your task feeds in long documents, large codebases, or long conversations, you need a model whose context window comfortably exceeds that size, or you must split the work up. But a larger window costs more per request and does not guarantee the model uses the middle of a long input well, so match the window to the job rather than always maxing it out.',
      plain:
        'Context length is the size of the model desk. A tiny desk cannot hold a thick report all at once. A huge desk can, but it costs more, and papers piled in the middle still sometimes get overlooked. Pick a desk big enough for your documents, not the biggest desk on offer.',
      difficulty: 'intermediate',
    },
    {
      id: 'landscape-7',
      categoryKey: 'landscape',
      category: 'The Model Landscape',
      subtopic: 'Modality',
      question: 'What does it mean that models differ by modality, and why does it affect model choice?',
      answer:
        'Modality is the kinds of input and output a model can handle. Some models work with text only, while multimodal models also read or produce images, audio, or video. If your task involves screenshots, photos, charts, voice, or PDFs with figures, you must pick a model that supports that modality, because a text-only model simply cannot see or hear that content. Multimodal capability can also change cost and speed.',
      plain:
        'A text-only model is a brilliant pen pal who can read your letters but cannot look at the photo you mailed. If your job involves pictures or sound, you need a model with eyes or ears, not just one that reads.',
      difficulty: 'core',
    },
    {
      id: 'landscape-8',
      categoryKey: 'landscape',
      category: 'The Model Landscape',
      subtopic: 'Licensing and terms',
      question: 'Why do licensing and usage terms matter when picking a model, even an open-weight one?',
      answer:
        'Because being able to run a model does not always mean you are allowed to use it the way you want. Open-weight licenses can restrict commercial use, set conditions above a certain user count, or forbid using outputs to train competing models. Hosted-model terms govern data handling, retention, and whether your inputs may be used for training. Ignoring the terms can create legal and compliance problems regardless of how good the model is.',
      plain:
        'Downloading a song does not give you the right to play it in your paid ad. Models have similar fine print. Before you build a business on one, read what the license actually lets you do, not just whether you can technically run it.',
      difficulty: 'intermediate',
    },
    {
      id: 'landscape-9',
      categoryKey: 'landscape',
      category: 'The Model Landscape',
      subtopic: 'Benchmarks as a guide',
      question: 'How much should you trust published benchmark scores when comparing models?',
      answer:
        'Treat them as a rough first filter, not a verdict. Benchmarks are standardized tests on fixed question sets, so they give a quick ranking, but they may not match your task, they can be gamed or over-fit, and small score gaps are often within noise. The reliable test is to run the candidate models on a handful of your own real examples and compare the outputs yourself.',
      plain:
        'Benchmark scores are like a restaurant star rating: handy for narrowing the list, but no substitute for actually eating there. Two models a point apart on a leaderboard can feel very different on your specific work. Always taste-test on your own examples.',
      difficulty: 'intermediate',
    },
    {
      id: 'landscape-10',
      categoryKey: 'landscape',
      category: 'The Model Landscape',
      subtopic: 'Benchmarks as a guide',
      question: 'What is benchmark contamination, and why does it make leaderboard scores hard to trust?',
      answer:
        'Benchmark contamination is when the questions and answers from a test have leaked into a model training data, so the model has effectively seen the exam in advance. That inflates its score without reflecting real ability on new problems. Because modern models train on enormous web-scraped corpora, popular public benchmarks are especially prone to this, which is why a high score on a well-known test can overstate genuine capability.',
      plain:
        'Imagine a student who somehow studied the exact exam questions beforehand. They ace the test, but that tells you nothing about whether they understand the subject. When a benchmark has leaked into training data, a top score can be that kind of memorized win, not real skill.',
      difficulty: 'advanced',
    },
    {
      id: 'landscape-11',
      categoryKey: 'landscape',
      category: 'The Model Landscape',
      subtopic: 'Build vs buy',
      question: 'What does the "build versus buy" decision mean for models, and what pushes you each way?',
      answer:
        'Buy means using a hosted model through a provider API and paying per use. Build means running an open-weight model on your own or rented hardware. Buying wins on speed to start, top capability, and no infrastructure burden. Building can win when you need data to stay on your own systems, want predictable costs at very high volume, need offline operation, or require deep customization. Most teams start by buying and only build when a specific constraint forces it.',
      plain:
        'It is renting versus owning. Renting (buy) means you move in today and someone else fixes the plumbing. Owning (build) costs more upfront and you handle maintenance, but you control the keys and the rules. Most people rent first and only buy a house when they have a strong reason.',
      difficulty: 'intermediate',
    },
    {
      id: 'landscape-12',
      categoryKey: 'landscape',
      category: 'The Model Landscape',
      subtopic: 'Provider lock-in',
      question: 'What is provider lock-in, and why is it a risk in a fast-moving model market?',
      answer:
        'Lock-in is when switching providers becomes painful because your prompts, tools, output formats, and code are entangled with one vendor\'s specific features and conventions. In a market where a cheaper or better model can appear within months, heavy lock-in means you cannot take advantage of it without a costly rewrite, leaving you stuck paying more for less.',
      plain:
        'Lock-in is like building your whole kitchen around one brand of pods that only fit one machine. When a better, cheaper machine comes out, you cannot switch without replacing everything. In a field that improves this fast, that is an expensive corner to paint yourself into.',
      difficulty: 'intermediate',
    },
    {
      id: 'landscape-13',
      categoryKey: 'landscape',
      category: 'The Model Landscape',
      subtopic: 'Selection framework',
      question: 'What is a simple, repeatable framework for choosing a model for a task?',
      answer:
        'Start from the task and write down five things: the quality bar the output must clear, the most you will pay per request, how fast it must feel, how much text it must read at once, and any rules about where the data may go. Filter candidates against those constraints, then pick the cheapest model that plausibly clears the quality bar and test it on your own real examples before committing.',
      plain:
        'Treat it like hiring. Write the job description first (how good, how cheap, how fast, how much it must read, where data can live), then interview the cheapest candidate who might do the job before reaching for the expensive star. Choosing model-first, task-second is how people overpay.',
      difficulty: 'core',
    },
    {
      id: 'landscape-14',
      categoryKey: 'landscape',
      category: 'The Model Landscape',
      subtopic: 'Capability vs cost vs speed',
      question: 'Why is "start with the cheapest model that might work, then escalate" usually good advice?',
      answer:
        'Because many real tasks are easier than they look, and paying for frontier capability on an easy task is pure waste. If a small, cheap, fast model clears your quality bar on real examples, you save money and latency at scale. You only move up to a larger model on the specific tasks where the cheap one measurably falls short, so spend tracks difficulty instead of defaulting to the most expensive option.',
      plain:
        'You do not call a surgeon for a paper cut. Try the cheap, fast option first, and only escalate the cases it actually fails. Defaulting to the priciest model "to be safe" is like booking the surgeon for every scrape: it adds cost without adding value.',
      difficulty: 'core',
    },
    {
      id: 'landscape-15',
      categoryKey: 'landscape',
      category: 'The Model Landscape',
      subtopic: 'Moving target',
      question: 'Why is model choice a moving target rather than a one-time decision?',
      answer:
        'Because the field releases meaningfully better or cheaper models on a timescale of months, not years. A model that is the best value today can be beaten on price, speed, or capability soon after, and prices for a given capability level tend to fall over time. So a model choice is a snapshot of current conditions, and revisiting it periodically is part of using these systems well.',
      plain:
        'Picking a model is like buying a phone: whatever you choose, a better or cheaper one is months away. That is fine as long as you treat the choice as "best for now" and plan to re-check it, rather than assuming today\'s decision is permanent.',
      difficulty: 'core',
    },
    {
      id: 'landscape-16',
      categoryKey: 'landscape',
      category: 'The Model Landscape',
      subtopic: 'Avoiding lock-in',
      question: 'How can you design a system so you can swap models later without a rewrite?',
      answer:
        'Keep the model choice in one place rather than scattered through your code, so changing it is a single edit. Keep your prompts, tools, and evaluation examples separate from any one vendor\'s specific format. Avoid depending on quirks unique to a single provider unless you truly need them. Then maintain a small set of your own test cases so that when a new model appears, you can re-run them and switch with confidence.',
      plain:
        'Wire your house so the appliances plug into standard outlets instead of being soldered to one brand. Put the model name in a single, easy-to-change spot, keep your prompts and tests portable, and swapping in a better model becomes a quick change rather than a demolition.',
      difficulty: 'intermediate',
    },
    {
      id: 'landscape-17',
      categoryKey: 'landscape',
      category: 'The Model Landscape',
      subtopic: 'Frontier vs small',
      question: 'Common misconception: is the model with the most parameters always the best choice?',
      answer:
        'No. Parameter count is only one factor and is not a reliable stand-in for quality. A smaller model trained on better data with better post-training can beat a larger, older one, and on many real tasks a small model is more than good enough while being far cheaper and faster. The right metric is performance on your task at an acceptable cost and speed, not raw size.',
      plain:
        'Bigger engine does not mean better car. A well-tuned compact can out-perform a clumsy gas-guzzler for your daily commute, and it costs far less to run. Chasing the biggest model "because more is better" often just means a bigger bill for no real gain.',
      difficulty: 'advanced',
    },
    {
      id: 'landscape-18',
      categoryKey: 'landscape',
      category: 'The Model Landscape',
      subtopic: 'Capability vs cost vs speed',
      question: 'How is the cost of using a hosted model usually measured, and how do you compare two models on price?',
      answer:
        'Cost is typically quoted per million tokens, with separate rates for input (your prompt) and output (the answer), and output often costs more than input. To compare fairly, estimate the typical input and output token counts for your real task, apply each model\'s rates, and compare the per-request cost rather than the headline rate. A model with a lower input rate but a much higher output rate can be more expensive for answer-heavy work.',
      plain:
        'Models bill by the token, a bit like a taxi charging by the mile, with different rates for the trip in and the trip out. To compare two services, do not just glance at the base rate. Estimate a real trip for each and compare the full fare. The cheaper sticker price can lose on a long ride.',
      difficulty: 'intermediate',
    },
    {
      id: 'landscape-19',
      categoryKey: 'landscape',
      category: 'The Model Landscape',
      subtopic: 'Efficiency techniques',
      question: 'How do techniques like distillation and quantization let small models punch above their weight?',
      answer:
        'Distillation trains a smaller model to imitate a larger one, transferring much of the big model\'s behavior into a cheaper, faster package. Quantization stores the model numbers at lower precision so it uses less memory and runs faster, usually with only a small quality loss. Together these techniques are a big reason capable models keep getting smaller and cheaper, which steadily widens the range of tasks a modest model can handle well.',
      plain:
        'Distillation is an apprentice learning to copy a master, so you get most of the skill at a fraction of the cost. Quantization is like compressing a photo: slightly less detail, much smaller file, runs anywhere. Both are why yesterday\'s huge-model quality keeps showing up in this year\'s small, cheap models.',
      difficulty: 'advanced',
    },
  ],
};

export default mod;
