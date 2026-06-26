import type { Category } from '../../types';

const mod: Category = {
  key: 'serving',
  name: 'Latency, Throughput & Serving',
  tier: 3,
  summary:
    'Why a model feels fast or slow, and what it takes to serve one to many users at once. This module covers time-to-first-token, streaming, the prefill and decode phases, batching, and the hardware realities (GPUs, memory, quantization) behind every API call.',
  learningObjectives: [
    'By the end you can distinguish latency from throughput and explain why both matter',
    'By the end you can explain time-to-first-token versus tokens-per-second and what each one feels like',
    'By the end you can describe how streaming improves perceived speed',
    'By the end you can explain batching and why it raises throughput but can add latency',
    'By the end you can connect the KV cache and context length to speed and memory use',
    'By the end you can reason about why hosted APIs, GPUs, and quantization affect performance',
  ],
  breakdown: [
    {
      heading: 'Two different speed numbers: latency and throughput',
      explanation:
        "People say a model is 'fast' or 'slow,' but there are really two separate measurements that often pull in opposite directions. Latency is how long one request takes from your point of view: you ask, you wait, you get an answer. Throughput is how much total work the system gets done across everyone using it, usually measured in tokens generated per second across all requests at once. A single user cares about latency. The person paying the GPU bill cares about throughput, because higher throughput means each expensive chip serves more customers. The tension is that the tricks that raise throughput (like grouping many requests together) can make any single request wait a little longer, and the tricks that minimize one user's latency can leave the hardware underused. Good serving is about balancing the two.",
      keyTerms: [
        {
          term: 'Latency',
          definition:
            "How long a single request takes from send to finished answer, from one user's perspective. Measured in seconds or milliseconds. Lower is better.",
        },
        {
          term: 'Throughput',
          definition:
            'Total useful work the whole system produces per unit time, usually tokens per second summed across all concurrent requests. Higher means each GPU serves more users.',
        },
        {
          term: 'Tail latency',
          definition:
            "The latency of the slowest requests (for example the worst 1 percent), not the average. Under heavy load the tail is what users actually complain about.",
        },
      ],
    },
    {
      heading: 'What a user actually feels: first token, then the stream',
      explanation:
        "From a person waiting at a screen, two numbers describe the experience. The first is time-to-first-token (TTFT): the gap between hitting send and the very first word appearing. The second is the generation speed after that, measured in tokens per second, which sets how fast the rest of the answer scrolls out. Streaming is the technique of sending each token to your screen the instant it is produced, instead of silently computing the whole answer and dumping it at the end. Streaming does not make the model compute any faster, but it dramatically improves perceived speed, because you start reading after a fraction of a second instead of staring at a blank box. A response that takes ten seconds to finish feels fine if words start flowing in half a second, and feels broken if nothing appears for ten seconds and then everything lands at once.",
      keyTerms: [
        {
          term: 'Time-to-first-token (TTFT)',
          definition:
            'The delay between sending a request and the first token of the answer appearing. Dominated by how long it takes to read and process your prompt.',
        },
        {
          term: 'Tokens per second',
          definition:
            "The rate at which the answer is generated after the first token. Sets how fast text scrolls out. Tens of tokens per second already reads faster than most people.",
        },
        {
          term: 'Streaming',
          definition:
            'Delivering each token to the client as soon as it is generated, rather than waiting for the full response. Improves perceived speed without changing total compute.',
        },
      ],
    },
    {
      heading: 'Inside one request: prefill, decode, and the KV cache',
      explanation:
        "Generating an answer happens in two distinct phases. First is prefill: the model reads your entire prompt at once and builds up its internal understanding of it. This phase processes many tokens in parallel and is what TTFT is mostly waiting on, so a long prompt means a longer wait before the first word. Second is decode: the model writes the answer one token at a time, and each new token depends on all the tokens before it. To avoid re-reading the whole conversation from scratch for every single new word, the model saves its intermediate work in a KV cache (key-value cache), a running memory of everything processed so far. The KV cache is what makes decode fast, but it lives in scarce GPU memory and grows with every token, so longer contexts cost more memory and eventually limit how many users you can serve at once.",
      keyTerms: [
        {
          term: 'Prefill phase',
          definition:
            'The first step, where the model ingests the whole prompt in parallel before producing any output. Its length drives time-to-first-token.',
        },
        {
          term: 'Decode phase',
          definition:
            'The step-by-step generation of the answer, one token at a time, each depending on all previous tokens. Its speed is your tokens-per-second.',
        },
        {
          term: 'KV cache (key-value cache)',
          definition:
            "Saved intermediate results for every token seen so far, so the model need not reprocess the whole sequence for each new token. Speeds decode but consumes GPU memory that grows with context length.",
        },
      ],
    },
    {
      heading: 'Serving many users: batching and continuous batching',
      explanation:
        "A GPU is happiest doing a lot of math at once, so processing one user's request alone leaves most of the chip idle. Batching means running several requests together as a group so the hardware stays busy, which is the single biggest lever for throughput. The catch is that classic batching can add latency, because a request might wait for the batch to fill up or wait for the slowest member to finish. Continuous batching (also called in-flight batching) fixes much of this: instead of locking the group until everyone is done, the server adds new requests and retires finished ones token by token, keeping the GPU full without making fast requests wait for slow ones. This is why a well-run serving stack can feel snappy for individuals while still squeezing high total throughput out of expensive hardware.",
      keyTerms: [
        {
          term: 'Batching',
          definition:
            'Grouping multiple requests so the GPU processes them together, raising throughput by keeping the hardware busy. Can add latency if requests wait for the group.',
        },
        {
          term: 'Continuous batching',
          definition:
            'A scheduling approach that adds and removes requests from the running batch on the fly, rather than waiting for a fixed group to all finish. Keeps utilization high without penalizing fast requests.',
        },
        {
          term: 'Concurrency',
          definition:
            'How many requests a system handles at the same time. Limited by GPU memory (especially the KV cache) and enforced through rate limits.',
        },
      ],
    },
    {
      heading: 'The hardware reality: GPUs, quantization, and where you run it',
      explanation:
        "Large models run on GPUs because generating text is mostly huge amounts of matrix multiplication, which GPUs do in massively parallel fashion. The binding constraint during decode is usually not raw math speed but memory: the model's weights and the KV cache must fit in GPU memory, and every new token requires reading the weights back out, so memory bandwidth often sets the pace. Quantization is a key trick here: it stores the model's numbers at lower precision (say 8-bit or 4-bit instead of 16-bit), which shrinks memory use and speeds up those memory reads, usually with only a small quality cost. Finally, where you run matters. A hosted API hands all of this (GPUs, batching, scaling) to a provider for a per-token price, while self-hosting gives you control and possibly lower cost at high volume but makes you responsible for the hardware. Caching repeated prompts is a cross-cutting win either way, cutting both latency and cost.",
      keyTerms: [
        {
          term: 'GPU',
          definition:
            'A graphics processing unit, a chip with thousands of small cores that excels at the parallel matrix math LLMs need. The standard hardware for running large models.',
        },
        {
          term: 'Quantization',
          definition:
            "Storing a model's numbers at lower numeric precision (for example 4-bit or 8-bit instead of 16-bit) to cut memory and speed up reads, usually with minor quality loss.",
        },
        {
          term: 'Memory bandwidth',
          definition:
            'How fast data moves between GPU memory and the compute cores. Often the real bottleneck during decode, because the model weights must be read for every token.',
        },
      ],
    },
  ],
  cards: [
    {
      id: 'serving-0',
      categoryKey: 'serving',
      category: 'Latency, Throughput & Serving',
      subtopic: 'Latency vs throughput',
      question: 'What is the difference between latency and throughput?',
      answer:
        'Latency is how long a single request takes from send to finished answer, measured from one user’s perspective. Throughput is how much total work the whole system completes per unit time, usually tokens per second across all concurrent requests. They often trade off against each other.',
      plain:
        'Latency is how long you personally wait in line at the coffee shop. Throughput is how many total customers the shop serves per hour. A fast line for you and a high total customer count are different goals, and pushing on one can hurt the other.',
      difficulty: 'core',
    },
    {
      id: 'serving-1',
      categoryKey: 'serving',
      category: 'Latency, Throughput & Serving',
      subtopic: 'Time-to-first-token',
      question: 'What is time-to-first-token (TTFT), and what mostly determines it?',
      answer:
        'TTFT is the delay between sending a request and the first token of the answer appearing. It is dominated by the prefill phase, where the model reads and processes your entire prompt, so a longer prompt generally means a longer TTFT.',
      plain:
        'TTFT is how long you stare at a blank box before the first word shows up. The model has to read your whole question before it can start answering, so a giant prompt is like handing someone a ten-page letter and waiting while they read it before they reply.',
      difficulty: 'core',
    },
    {
      id: 'serving-2',
      categoryKey: 'serving',
      category: 'Latency, Throughput & Serving',
      subtopic: 'Tokens per second',
      question: 'What does tokens-per-second measure, and roughly how fast does it need to be to feel smooth?',
      answer:
        'Tokens-per-second is the rate at which the answer is generated after the first token, setting how fast text scrolls out. Even a few tens of tokens per second already exceeds normal reading speed, so it feels smooth once it comfortably outpaces how fast a person reads.',
      plain:
        'It is the speed at which words appear once the answer starts flowing. As long as the text comes out faster than you can read it, it feels instant. It only feels sluggish when you are waiting for the next word to catch up to your eyes.',
      difficulty: 'core',
    },
    {
      id: 'serving-3',
      categoryKey: 'serving',
      category: 'Latency, Throughput & Serving',
      subtopic: 'Streaming responses',
      question: 'How does streaming improve the experience if it does not make the model compute any faster?',
      answer:
        'Streaming sends each token to the screen the moment it is produced instead of waiting for the whole answer. Total compute time is unchanged, but perceived speed improves a lot because the user starts reading after a fraction of a second rather than after the full response is done.',
      plain:
        'It is the difference between a friend texting you their reply word by word as they think it, versus typing the whole paragraph silently and hitting send at the end. Same total time, but the first one feels alive and the second feels frozen.',
      difficulty: 'core',
    },
    {
      id: 'serving-4',
      categoryKey: 'serving',
      category: 'Latency, Throughput & Serving',
      subtopic: 'Decode phase',
      question: 'Why does a longer answer take proportionally longer to produce?',
      answer:
        'During the decode phase the model generates one token at a time, and each new token depends on all the tokens before it, so it cannot produce them all at once. Twice as many output tokens means roughly twice as much generation time.',
      plain:
        'The model writes its answer one word at a time, where each word builds on the last, like a person writing a sentence rather than printing a finished page. A longer answer simply means more words to write, one after another.',
      difficulty: 'core',
    },
    {
      id: 'serving-5',
      categoryKey: 'serving',
      category: 'Latency, Throughput & Serving',
      subtopic: 'GPUs and hardware basics',
      question: 'Why are large language models run on GPUs rather than ordinary CPUs?',
      answer:
        'Generating text is mostly enormous amounts of matrix multiplication, which GPUs perform in massively parallel fashion across thousands of cores. CPUs have far fewer cores optimized for sequential work, making them much slower for this kind of math.',
      plain:
        'A CPU is like a few very smart accountants doing sums one after another. A GPU is like a stadium full of average students all doing simple sums at the same time. For the mountain of tiny calculations a model needs, the stadium wins easily.',
      difficulty: 'core',
    },
    {
      id: 'serving-6',
      categoryKey: 'serving',
      category: 'Latency, Throughput & Serving',
      subtopic: 'Batching and continuous batching',
      question: 'At a high level, what is batching and why does a provider use it?',
      answer:
        'Batching means running several requests together as a group so the GPU stays busy with a lot of math at once. A single request leaves most of the chip idle, so batching raises throughput, letting each expensive GPU serve many more users.',
      plain:
        'It is like a tour bus instead of a private car. Driving one passenger wastes most of the seats. Filling the bus before it leaves serves far more people per trip, which is why providers batch many users’ requests onto one GPU.',
      difficulty: 'core',
    },
    {
      id: 'serving-7',
      categoryKey: 'serving',
      category: 'Latency, Throughput & Serving',
      subtopic: 'KV cache and context length',
      question: 'How does the length of the context window affect both speed and memory?',
      answer:
        'A longer context means more tokens to process during prefill (raising time-to-first-token) and a larger KV cache held in GPU memory throughout generation. Since GPU memory is limited, big contexts use more memory and reduce how many requests can run at once.',
      plain:
        'A long conversation is like a long meeting transcript the model must keep open on its desk the whole time. It takes longer to read at the start and hogs desk space, leaving less room to help other people at the same time.',
      difficulty: 'core',
    },
    {
      id: 'serving-8',
      categoryKey: 'serving',
      category: 'Latency, Throughput & Serving',
      subtopic: 'Self-hosting vs API',
      question: 'What do you give up and gain by using a hosted API instead of self-hosting a model?',
      answer:
        'A hosted API hands off the GPUs, batching, scaling, and maintenance to a provider in exchange for a per-token price and less control. Self-hosting gives you control over hardware, data location, and tuning, and can cost less at very high steady volume, but you take on the operational burden.',
      plain:
        'It is renting versus owning. Renting (the API) means you just pay per use and someone else fixes the plumbing. Owning (self-hosting) means more control and maybe cheaper at scale, but now the broken water heater at 2am is your problem.',
      difficulty: 'core',
    },
    {
      id: 'serving-9',
      categoryKey: 'serving',
      category: 'Latency, Throughput & Serving',
      subtopic: 'Prefill vs decode phases',
      question: 'Compare the prefill and decode phases of generating a response.',
      answer:
        'Prefill processes the entire prompt at once in parallel, which is efficient per token and sets time-to-first-token. Decode generates the answer one token at a time in sequence, which is the slower per-token phase and sets the tokens-per-second rate. A request is prefill-heavy with a long prompt and short answer, and decode-heavy with a short prompt and long answer.',
      plain:
        'Prefill is reading the question, which you can skim all at once. Decode is writing the answer, which you must do one word at a time. A long question with a short reply is mostly reading, a short question with a long reply is mostly writing.',
      difficulty: 'intermediate',
    },
    {
      id: 'serving-10',
      categoryKey: 'serving',
      category: 'Latency, Throughput & Serving',
      subtopic: 'Time-to-first-token',
      question: 'A user complains the model is "slow to start" but then types quickly. What is likely happening?',
      answer:
        'A slow start with fast generation points to a long prefill, usually caused by a large prompt or context (long documents, big system prompt, long chat history). Time-to-first-token is high because the model must read all of it before the first output token, while the decode rate stays normal.',
      plain:
        'They handed the model a thick binder to read before answering. It takes a while to get through the binder (slow first word), but once it starts talking it speaks at a normal pace. Shrinking the prompt is the fix for the slow start.',
      difficulty: 'intermediate',
    },
    {
      id: 'serving-11',
      categoryKey: 'serving',
      category: 'Latency, Throughput & Serving',
      subtopic: 'KV cache and memory limits',
      question: 'What problem does the KV cache solve, and what does it cost?',
      answer:
        'Without a KV cache, the model would reprocess the entire sequence from scratch for every new token, which is hugely wasteful. The KV cache stores the intermediate results for all prior tokens so each new token only does a little fresh work. The cost is GPU memory: the cache grows with every token, competing with other requests.',
      plain:
        'It is the model’s running notes. Instead of rereading the whole conversation before every new word, it keeps notes it can glance at. The notes make it fast, but they pile up on a small desk, so a very long chat eventually crowds everything out.',
      difficulty: 'intermediate',
    },
    {
      id: 'serving-12',
      categoryKey: 'serving',
      category: 'Latency, Throughput & Serving',
      subtopic: 'Batching and continuous batching',
      question: 'How does continuous batching improve on classic fixed batching?',
      answer:
        'Classic batching locks a group of requests together until all finish, so fast requests wait for the slowest and new arrivals wait for the next group. Continuous batching adds new requests and retires finished ones token by token, keeping the GPU full without making quick requests wait for slow ones.',
      plain:
        'Old way: a shuttle that will not leave until every seat is full and will not let anyone off until the last stop. New way: a moving walkway where people hop on and off whenever they are ready. The walkway stays busy and nobody is trapped waiting.',
      difficulty: 'intermediate',
    },
    {
      id: 'serving-13',
      categoryKey: 'serving',
      category: 'Latency, Throughput & Serving',
      subtopic: 'Quantization for speed',
      question: 'How does quantization make a model faster, and what is the trade-off?',
      answer:
        'Quantization stores the model’s numbers at lower precision (for example 8-bit or 4-bit instead of 16-bit), which shrinks memory use and speeds up the memory reads that bottleneck decode. The trade-off is a usually small loss in output quality, which grows if you quantize too aggressively.',
      plain:
        'It is like rounding prices to the nearest dollar instead of tracking every cent. The numbers get lighter and quicker to handle, and for most purposes the answer is just as good. Round too hard, though, and the small errors start to show.',
      difficulty: 'intermediate',
    },
    {
      id: 'serving-14',
      categoryKey: 'serving',
      category: 'Latency, Throughput & Serving',
      subtopic: 'Concurrency and rate limits',
      question: 'Why do hosted APIs impose rate limits, and what do they protect?',
      answer:
        'Rate limits cap how many requests or tokens per minute a single customer can send. They protect the shared GPU pool from being overwhelmed by one user, keep latency predictable for everyone, and give the provider a knob to manage finite memory and compute fairly across customers.',
      plain:
        'It is the "one scoop per customer" rule at a busy ice cream shop. Without it, one person could clear the whole freezer and everyone else waits. The limit keeps service fair and the line moving for the whole crowd.',
      difficulty: 'intermediate',
    },
    {
      id: 'serving-15',
      categoryKey: 'serving',
      category: 'Latency, Throughput & Serving',
      subtopic: 'Caching',
      question: 'How does caching a repeated prompt prefix help both latency and cost?',
      answer:
        'If many requests share a large identical prefix (like a long system prompt or document), the server can save the processed form of that prefix and reuse it instead of running prefill again. This lowers time-to-first-token and reduces the compute billed for those repeated input tokens.',
      plain:
        'Imagine the model takes a photo of a page it reads often, so next time it glances at the photo instead of reading the page again. The shared part is already understood, so the answer starts faster and you are not charged to reread the same thing.',
      difficulty: 'intermediate',
    },
    {
      id: 'serving-16',
      categoryKey: 'serving',
      category: 'Latency, Throughput & Serving',
      subtopic: 'Latency vs throughput',
      question: 'Why does increasing batch size raise throughput but can hurt a single request’s latency?',
      answer:
        'A bigger batch keeps the GPU more fully utilized, so total tokens per second across all users goes up. But a single request now shares the chip with more neighbors and may wait for the batch to assemble, so its own start-to-finish time can rise. It is a throughput-versus-latency trade-off.',
      plain:
        'Cramming more people onto the tour bus serves more travelers per day (throughput), but your own trip gets a little slower because of all the extra stops (latency). Bigger groups are efficient overall and slightly worse for any one rider.',
      difficulty: 'intermediate',
    },
    {
      id: 'serving-17',
      categoryKey: 'serving',
      category: 'Latency, Throughput & Serving',
      subtopic: 'GPUs and hardware basics',
      question: 'During decode, why is memory bandwidth often the bottleneck rather than raw math speed?',
      answer:
        'Decode produces one token at a time, and for each token the GPU must read the model’s full set of weights out of memory. The amount of math per token is small relative to the data that has to be moved, so the limiting factor is how fast weights can be read (memory bandwidth), not the cores’ arithmetic power.',
      plain:
        'It is like a chef who can chop instantly but keeps having to walk to the far pantry for one ingredient at a time. The cooking is quick, the walking is slow, so the trips to the pantry set the pace, not the knife skills.',
      difficulty: 'advanced',
    },
    {
      id: 'serving-18',
      categoryKey: 'serving',
      category: 'Latency, Throughput & Serving',
      subtopic: 'KV cache and memory limits',
      question: 'Why does the KV cache, more than the model’s own size, often cap how many users you can serve at once?',
      answer:
        'The model’s weights are a fixed cost loaded once and shared by all requests. The KV cache, by contrast, is per-request and grows with each user’s context length, so total KV memory scales with the number of concurrent users times their sequence lengths. Once that sum exhausts the remaining GPU memory, no more requests fit, regardless of spare compute.',
      plain:
        'The model itself is like one shared cookbook on the shelf, paid for once. Each diner, though, needs their own growing pile of order tickets on the counter. The counter fills up with tickets long before the cookbook is the problem, and that is when you stop seating new diners.',
      difficulty: 'advanced',
    },
    {
      id: 'serving-19',
      categoryKey: 'serving',
      category: 'Latency, Throughput & Serving',
      subtopic: 'Concurrency and rate limits',
      question: 'Why can the same model feel fast at midnight and sluggish at peak hours even with no code changes?',
      answer:
        'Under heavy concurrent load the serving system batches more requests onto each GPU and queues others, so each request shares hardware and may wait its turn. Average latency rises and the slow tail gets worse. At off-peak times there is spare capacity, so requests run with little contention and feel fast.',
      plain:
        'It is the same highway at 3am versus rush hour. The road did not change, but when everyone shows up at once you crawl. The model has no traffic at midnight and a packed freeway at peak, and you feel the difference even though nothing about it was edited.',
      difficulty: 'advanced',
    },
  ],
};

export default mod;
