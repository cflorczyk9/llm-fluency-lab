import type { Category } from '../../types';

const mod: Category = {
  key: 'economics',
  name: 'Cost & Token Economics',
  tier: 3,
  summary:
    'What you actually pay for when you use a language model, and how to keep the bill under control. This module covers input versus output token pricing, how to estimate the cost of a request or a whole workload, why long context and agent loops get expensive, and the levers (caching, smaller models, retrieval) that cut cost without wrecking quality.',
  learningObjectives: [
    'By the end you can explain how token-based pricing works, including input versus output costs',
    'By the end you can estimate the cost of a single request or a workload from token counts',
    'By the end you can identify the biggest cost drivers, like output length, context, agent loops, and big models',
    'By the end you can use levers such as caching, smaller models, and retrieval to cut cost',
    'By the end you can compare hosted-API cost versus self-hosting at a high level',
    'By the end you can avoid the common cost surprises that show up in production',
  ],
  breakdown: [
    {
      heading: 'How token pricing works: input versus output',
      explanation:
        "Model providers almost always bill per token, not per request or per word, and they split the price into two buckets: input tokens (everything you send, including the system prompt, chat history, and any documents) and output tokens (everything the model generates back). The crucial detail is that output tokens usually cost several times more than input tokens. The reason traces back to how generation works: input is read in one efficient parallel pass, while output is produced one slow token at a time, so each generated token consumes more of the expensive hardware. This single fact reshapes how you should think about cost: a request that reads a lot but answers briefly is cheap, while one that reads little but writes a long essay can be surprisingly expensive. Pricing is quoted per million tokens, so you scale the per-token price by your actual volume.",
      keyTerms: [
        {
          term: 'Token-based pricing',
          definition:
            'Billing by the number of tokens processed, typically quoted as a price per million input tokens and a separate price per million output tokens.',
        },
        {
          term: 'Input tokens',
          definition:
            'Everything you send into the model: the user message plus the system prompt, prior conversation, and any attached documents or retrieved context.',
        },
        {
          term: 'Output tokens',
          definition:
            'Everything the model generates in reply. Usually priced several times higher than input tokens because they are produced one at a time.',
        },
      ],
    },
    {
      heading: 'Estimating cost: from one request to a whole workload',
      explanation:
        "Estimating cost is just arithmetic once you know the token counts. For a single request, multiply input tokens by the input price and output tokens by the output price, then add them. For a workload, multiply that per-request cost by how many requests you expect per day or month. A rough sizing trick: English runs about 0.75 words per token, so a 1,000-word document is roughly 1,300 tokens. The discipline that saves you is doing this math before you ship, with realistic numbers, especially for the output side, since a feature that writes long answers at high volume is where bills balloon. Always estimate with peak volume and worst-case answer length in mind, not the friendly average, because the surprises live in the tail.",
      keyTerms: [
        {
          term: 'Cost per request',
          definition:
            'Input tokens times the input price plus output tokens times the output price. The building block for any larger estimate.',
        },
        {
          term: 'Workload cost',
          definition:
            'Cost per request multiplied by request volume over a period (per day or per month). Sensitive to both how big each request is and how many you run.',
        },
        {
          term: 'Token sizing rule',
          definition:
            'A handy approximation: about 0.75 English words per token, or roughly 4 characters per token, useful for back-of-envelope cost estimates.',
        },
      ],
    },
    {
      heading: 'The big cost drivers',
      explanation:
        "A few factors dominate almost every LLM bill. First, model size and tier: larger, more capable models cost more per token, often by an order of magnitude over small ones. Second, output length, which is the expensive token bucket, so a verbose prompt or an unbounded answer adds up fast. Third, context size: stuffing long documents or full chat histories into every call inflates input tokens on every single request. Fourth, repetition: agent loops and multi-turn chats resend the growing conversation as input again and again, so cost can climb steeply as the interaction goes on. Recognizing which driver is dominating your particular feature tells you which lever to pull. A common mistake is to chase a 10 percent saving on input price while ignoring that the feature generates ten times more output than it needs.",
      keyTerms: [
        {
          term: 'Model tier',
          definition:
            'The capability class of the model. Larger, smarter models charge more per token, so choosing the smallest model that does the job is a primary cost lever.',
        },
        {
          term: 'Context bloat',
          definition:
            'Sending more input than necessary (full documents, long histories) on every call, multiplying input cost across all requests.',
        },
        {
          term: 'Agent loop cost',
          definition:
            'The compounding expense of an agent or multi-turn chat that resends an ever-growing conversation as input on each step.',
        },
      ],
    },
    {
      heading: 'Levers to cut cost: caching, smaller models, retrieval',
      explanation:
        "The good news is that the same structure that drives cost gives you the levers to cut it. Prompt caching lets you reuse the processed form of a large repeated prefix (a long system prompt or a reference document) so you stop paying full price to reprocess it on every call, often at a steep discount on those cached tokens. Model routing means sending easy requests to a cheap small model and reserving the expensive big model for the hard ones. Retrieval (RAG) replaces dumping an entire knowledge base into context with fetching only the few relevant passages, slashing input tokens while often improving answers. Batch processing, where you submit non-urgent work to be done asynchronously, typically earns a significant discount. The art is matching the lever to your dominant cost driver rather than applying all of them blindly.",
      keyTerms: [
        {
          term: 'Prompt caching',
          definition:
            'Reusing the processed form of a repeated input prefix so it is not billed at full price every call. Cuts both cost and latency for shared context.',
        },
        {
          term: 'Model routing',
          definition:
            'Directing each request to the cheapest model that can handle it, sending only the hard cases to the expensive large model.',
        },
        {
          term: 'Retrieval (RAG)',
          definition:
            'Fetching only the few relevant passages from a knowledge base into the prompt instead of including everything, reducing input tokens while keeping answers grounded.',
        },
      ],
    },
    {
      heading: 'Hosted versus self-hosted, and watching the meter',
      explanation:
        "At low to moderate volume, a hosted API is almost always cheaper in total because you pay only for what you use and the provider amortizes expensive GPUs across many customers. Self-hosting an open-weight model can win on per-token cost at very high, steady volume where you can keep your own GPUs busy near full utilization, but it adds the hidden costs of hardware, engineering, and idle time, and a half-used GPU is pure waste. Either way, the habit that prevents nasty surprises is monitoring: track spend per feature and per user, set budgets and alerts, and watch for the cost-quality trade-off, since the most capable model is not always worth its price for a given task. Many production cost overruns come not from price but from a runaway loop, an unbounded output, or aggressive retries quietly multiplying calls.",
      keyTerms: [
        {
          term: 'Hosted API economics',
          definition:
            'Pay-per-token pricing where the provider spreads GPU cost across many users. Usually cheapest until volume is very high and steady.',
        },
        {
          term: 'Self-hosting economics',
          definition:
            'Running your own model on your own GPUs. Can lower per-token cost at high steady utilization but adds hardware, ops, and idle-capacity costs.',
        },
        {
          term: 'Cost-quality trade-off',
          definition:
            'The judgment call of spending more for a better model or output versus accepting a cheaper, good-enough result for a given task.',
        },
      ],
    },
  ],
  cards: [
    {
      id: 'economics-0',
      categoryKey: 'economics',
      category: 'Cost & Token Economics',
      subtopic: 'Token-based pricing',
      question: 'What is the unit you actually pay for when calling a hosted language model?',
      answer:
        'You pay per token, not per request or per word. Providers quote a price per million input tokens and a separate price per million output tokens, and your bill is your token volume times those rates.',
      plain:
        'It is metered like electricity, but the meter counts tokens (word-chunks) rather than kilowatt-hours. Send and receive more tokens, pay more. The number of times you press send barely matters. The size of each conversation does.',
      difficulty: 'core',
    },
    {
      id: 'economics-1',
      categoryKey: 'economics',
      category: 'Cost & Token Economics',
      subtopic: 'Input vs output cost',
      question: 'Which usually costs more per token, input or output, and why?',
      answer:
        'Output tokens usually cost several times more than input tokens. Input is read in one efficient parallel pass, while output is generated one token at a time, consuming more of the expensive hardware per token, so providers price it higher.',
      plain:
        'Reading is cheap, writing is dear. The model can skim your question quickly, but it has to compose the answer word by word, which is slower and pricier. So a short question with a long reply costs more than the reverse.',
      difficulty: 'core',
    },
    {
      id: 'economics-2',
      categoryKey: 'economics',
      category: 'Cost & Token Economics',
      subtopic: 'Estimating workload cost',
      question: 'How do you estimate the cost of a single request?',
      answer:
        'Multiply the number of input tokens by the input price and the number of output tokens by the output price, then add the two. Prices are quoted per million tokens, so scale accordingly.',
      plain:
        'It is a two-line grocery receipt: count what you put in (input) at one price, count what comes back (output) at another, and add them up. Do this with realistic token counts before you ship, not after the bill arrives.',
      difficulty: 'core',
    },
    {
      id: 'economics-3',
      categoryKey: 'economics',
      category: 'Cost & Token Economics',
      subtopic: 'Model size vs price',
      question: 'How does choosing a bigger model affect cost?',
      answer:
        'Larger, more capable models charge more per token, often many times more than small models. So model choice is one of the biggest cost levers: using the smallest model that meets the quality bar can cut the bill dramatically.',
      plain:
        'It is hiring a top specialist versus a competent generalist for every task. The specialist costs far more per hour. For routine work the generalist is fine, and reserving the specialist for the hard cases saves a fortune.',
      difficulty: 'core',
    },
    {
      id: 'economics-4',
      categoryKey: 'economics',
      category: 'Cost & Token Economics',
      subtopic: 'Cost drivers',
      question: 'Why is the length of the model’s answer such an important cost driver?',
      answer:
        'Output tokens are the expensive bucket, so a longer answer costs more on the priciest tokens. An unbounded or verbose response, multiplied across many requests, is a frequent source of runaway bills. Capping output length is a direct cost control.',
      plain:
        'If writing is the expensive part, then asking for a 2,000-word essay when a 3-sentence answer would do is like ordering the giant meal every time and tossing most of it. Setting a sensible answer-length limit keeps the priciest part in check.',
      difficulty: 'core',
    },
    {
      id: 'economics-5',
      categoryKey: 'economics',
      category: 'Cost & Token Economics',
      subtopic: 'Prompt and context caching',
      question: 'What is prompt caching and how does it save money?',
      answer:
        'Prompt caching reuses the processed form of a large repeated input prefix (such as a long system prompt or a reference document) so you are not billed full price to reprocess it on every call. Cached input tokens are typically charged at a steep discount.',
      plain:
        'If you start every chat with the same long instructions, caching is like the model keeping those instructions pinned up instead of rereading them each time. You pay a small fee to pin them, then almost nothing to reuse them.',
      difficulty: 'core',
    },
    {
      id: 'economics-6',
      categoryKey: 'economics',
      category: 'Cost & Token Economics',
      subtopic: 'Retrieval as a cost lever',
      question: 'How can retrieval (RAG) lower cost compared with stuffing everything into the prompt?',
      answer:
        'Instead of including an entire knowledge base in every prompt, retrieval fetches only the few passages relevant to the question. That sharply reduces input tokens on each call, and it often improves answer quality by removing irrelevant material.',
      plain:
        'It is the difference between mailing someone the whole encyclopedia with every question versus photocopying just the one relevant page. You pay to send far fewer pages, and the reader is not distracted by everything else.',
      difficulty: 'core',
    },
    {
      id: 'economics-7',
      categoryKey: 'economics',
      category: 'Cost & Token Economics',
      subtopic: 'Hosted vs self-hosted',
      question: 'At low or moderate volume, why is a hosted API usually cheaper than self-hosting?',
      answer:
        'A hosted API charges only for the tokens you use and spreads the cost of expensive GPUs across many customers. Self-hosting means paying for whole GPUs whether or not they are busy, so at low volume those machines sit mostly idle, wasting money.',
      plain:
        'It is taking a taxi versus buying a car. If you only drive occasionally, the taxi (pay per ride) is far cheaper than a car that sits in the driveway depreciating. You only buy the car when you are driving all day, every day.',
      difficulty: 'core',
    },
    {
      id: 'economics-8',
      categoryKey: 'economics',
      category: 'Cost & Token Economics',
      subtopic: 'Cost drivers',
      question: 'Why does using a long context window on every request get expensive?',
      answer:
        'Everything you place in context counts as input tokens on every single call. Long documents or full chat histories sent each time multiply input cost across your entire request volume, even when most of that context is not needed for the specific question.',
      plain:
        'Imagine paying postage by weight and attaching a phone book to every letter you mail, just in case. Most letters never need it, but you pay to ship it every time. Trimming context to what each request actually needs lightens every letter.',
      difficulty: 'core',
    },
    {
      id: 'economics-9',
      categoryKey: 'economics',
      category: 'Cost & Token Economics',
      subtopic: 'Estimating workload cost',
      question: 'You expect 50,000 requests a day, each about 2,000 input tokens and 500 output tokens. How do you size the daily cost?',
      answer:
        'Per request: 2,000 input tokens at the input rate plus 500 output tokens at the output rate. Multiply each token count by its per-million price, add them for the per-request cost, then multiply by 50,000. Total daily input is 100M tokens and output is 25M tokens, so you scale those against the two rates.',
      plain:
        'Do the receipt for one request, then multiply by how many requests a day. Here that is 100 million input tokens and 25 million output tokens per day. Plug those into the provider’s two prices and you have your daily number, no guessing.',
      difficulty: 'intermediate',
    },
    {
      id: 'economics-10',
      categoryKey: 'economics',
      category: 'Cost & Token Economics',
      subtopic: 'Agent and multi-turn cost blowups',
      question: 'Why can a long agent run or multi-turn chat cost far more than the same number of standalone questions?',
      answer:
        'Each step resends the entire growing conversation (and any tool outputs) as input. So by step ten the model is rereading nine prior steps every time. Input tokens accumulate across the run, making total cost climb much faster than the count of steps alone suggests.',
      plain:
        'Every reply in the thread re-attaches the whole thread so far. Turn one sends a paragraph, turn ten sends ten paragraphs. The conversation gets heavier with each message, so a long back-and-forth costs more than ten separate fresh questions.',
      difficulty: 'intermediate',
    },
    {
      id: 'economics-11',
      categoryKey: 'economics',
      category: 'Cost & Token Economics',
      subtopic: 'Model routing',
      question: 'What is model routing, and how does it trade cost against quality?',
      answer:
        'Model routing sends each request to the cheapest model that can handle it, escalating only hard cases to a larger, pricier model. It cuts average cost while preserving quality on the requests that need it, at the cost of added complexity in deciding what is hard.',
      plain:
        'It is triage in an emergency room. Minor cases see a nurse (cheap, fast), serious cases see the surgeon (expensive). You do not put every stubbed toe in front of the surgeon, and you do not send a heart attack to the nurse.',
      difficulty: 'intermediate',
    },
    {
      id: 'economics-12',
      categoryKey: 'economics',
      category: 'Cost & Token Economics',
      subtopic: 'Batching and volume discounts',
      question: 'How can a batch (asynchronous) processing mode reduce cost for non-urgent work?',
      answer:
        'Submitting non-urgent requests to a batch endpoint lets the provider schedule them on spare capacity rather than serving them instantly, which they typically reward with a meaningful discount. The trade-off is higher latency, since results come back later rather than in real time.',
      plain:
        'It is like standard shipping versus overnight. If you do not need the answer this second, you tell the provider "whenever you have a slack moment," and they charge you less for the patience. Great for overnight jobs, bad for live chat.',
      difficulty: 'intermediate',
    },
    {
      id: 'economics-13',
      categoryKey: 'economics',
      category: 'Cost & Token Economics',
      subtopic: 'Monitoring spend',
      question: 'What should you monitor to avoid cost surprises in production?',
      answer:
        'Track spend broken down by feature and ideally per user or request type, set budgets with alerts, and watch token counts (especially output length and context size) over time. Many overruns come not from price changes but from a runaway loop, an unbounded answer, or retries quietly multiplying calls.',
      plain:
        'Put a dashboard and an alarm on the meter, not just a monthly statement. That way you catch the one broken feature burning money at 3am the same night, instead of discovering it on the invoice four weeks later.',
      difficulty: 'intermediate',
    },
    {
      id: 'economics-14',
      categoryKey: 'economics',
      category: 'Cost & Token Economics',
      subtopic: 'Cost-quality trade-offs',
      question: 'Why is the most capable model not always the most cost-effective choice?',
      answer:
        'The top model costs more per token, but for many tasks a smaller model produces answers that are just as useful. Paying the premium only makes sense where the harder model measurably improves the outcome that matters. The right call is set by evaluating quality on your actual task, not by always reaching for the biggest model.',
      plain:
        'A sports car is not the best choice for a grocery run. It costs more to run and gets you there the same. Use the powerful model where its extra skill actually changes the result, and the cheaper one everywhere else.',
      difficulty: 'intermediate',
    },
    {
      id: 'economics-15',
      categoryKey: 'economics',
      category: 'Cost & Token Economics',
      subtopic: 'Cost surprises',
      question: 'A common misconception: "shortening my prompt is the main way to cut cost." Why is that often wrong?',
      answer:
        'Input tokens are the cheaper bucket, so trimming the prompt helps less than people expect. The larger savings usually come from the output side (capping or shortening answers), from using a smaller model, or from caching repeated context. Optimize the dominant driver, which is frequently output or model tier, not raw prompt length.',
      plain:
        'People obsess over making the question shorter, but writing the answer is the expensive part. It is like fussing over the price of the napkins while ignoring the steak. Look at where the money actually goes first, then trim there.',
      difficulty: 'intermediate',
    },
    {
      id: 'economics-16',
      categoryKey: 'economics',
      category: 'Cost & Token Economics',
      subtopic: 'Agent and multi-turn cost blowups',
      question: 'Why does the input cost of a multi-turn conversation grow faster than linearly with the number of turns?',
      answer:
        'If every turn resends the full prior history, then turn N carries roughly N turns’ worth of context. Summing that across all turns gives a total proportional to N squared rather than N. So doubling the number of turns can roughly quadruple the cumulative input cost, unless you trim or summarize history.',
      plain:
        'Turn one sends 1 unit, turn two sends 2, turn three sends 3, and so on. Add those up and the total grows like a triangle, not a line. That is why very long, unmanaged chats get expensive much faster than the turn count suggests.',
      difficulty: 'advanced',
    },
    {
      id: 'economics-17',
      categoryKey: 'economics',
      category: 'Cost & Token Economics',
      subtopic: 'Hosted vs self-hosted',
      question: 'What condition has to hold for self-hosting an open-weight model to actually beat a hosted API on cost?',
      answer:
        'You need high, steady volume that keeps your own GPUs near full utilization, because you pay for the hardware whether or not it is busy. If utilization is low or spiky, idle GPU time dominates and the per-token cost rises above the hosted price, before even counting engineering and operations overhead.',
      plain:
        'Owning the car only beats taxis if you drive it constantly. A GPU sitting idle is a car depreciating in the garage. Self-hosting wins when the machines run hot all day, every day, and loses the moment they are mostly parked.',
      difficulty: 'advanced',
    },
    {
      id: 'economics-18',
      categoryKey: 'economics',
      category: 'Cost & Token Economics',
      subtopic: 'Prompt and context caching',
      question: 'When does prompt caching pay off, and when can it cost more than it saves?',
      answer:
        'Caching pays off when a large prefix is reused many times within the cache’s lifetime, since the discounted cache reads outweigh the one-time write cost. It can lose money if the cached prefix is rarely reused, or expires before reuse, because you paid to store context that never got read back enough to recover the write cost.',
      plain:
        'It is like buying a bulk pass: worth it if you go often enough to use it, wasteful if you buy it and barely show up. Cache the context you reuse a lot, skip caching for one-off prompts that will not come around again.',
      difficulty: 'advanced',
    },
    {
      id: 'economics-19',
      categoryKey: 'economics',
      category: 'Cost & Token Economics',
      subtopic: 'Cost surprises',
      question: 'How can a retry or fallback policy accidentally multiply your token spend?',
      answer:
        'If a request that already consumed input and output tokens fails near the end and is retried in full, you pay for both attempts. Aggressive retries, or fallbacks that re-run the whole expensive request on a larger model, can multiply cost several times over for the same user action, especially during an outage when failures spike.',
      plain:
        'Imagine a slow checkout that times out, so the app silently rings up your whole cart again, and again. Each automatic retry is a fresh charge. A few stacked retries during a bad hour can quietly triple the bill for the same task.',
      difficulty: 'intermediate',
    },
  ],
};

export default mod;
