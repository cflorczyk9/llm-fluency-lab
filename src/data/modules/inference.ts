// Module: Inference & Decoding (tier 1, deepened).
// Existing summary, breakdown, video, and cards inference-0..13 are carried over
// verbatim from the original deck. New cards inference-14..21 extend coverage of
// autoregressive generation, stop sequences, max tokens, streaming, seeds,
// determinism, and repetition penalties.

import type { Category } from '../../types';

const mod: Category = {
  key: 'inference',
  name: 'Inference & Decoding',
  tier: 1,
  summary:
    "Inference and decoding is what actually happens every time a model answers you: it predicts one token at a time, and the knobs you set (temperature, top-p, max tokens) plus the engineering underneath (KV cache, context window) decide quality, cost, and speed. Mastering this lets Connor reason about why an answer is creative vs robotic, why a long prompt is slow and expensive, and why a model degrades or fails as the context fills, which is exactly the difference between treating an LLM as a black box and tuning it like a system he controls.",
  learningObjectives: [
    'By the end you can explain autoregressive generation and why output is produced one token at a time',
    'By the end you can describe how logits become probabilities and how a sampling rule picks a token',
    'By the end you can use temperature, top-p, and top-k to control randomness deliberately',
    'By the end you can explain greedy versus sampled decoding and when to prefer each',
    'By the end you can describe stop sequences and max tokens and why outputs get cut off',
    'By the end you can explain why responses are non-deterministic and how to make them more reproducible',
  ],
  breakdown: [
    {
      heading: 'How a model picks the next token: greedy vs sampling',
      explanation:
        "A language model does not output text directly. At each step it produces a probability for every token in its vocabulary (a long list of numbers that sum to 1), and decoding is the rule for turning that list into one chosen token. The two ends of the spectrum are greedy decoding (always take the single highest-probability token) and sampling (roll a weighted die where higher-probability tokens are more likely but not guaranteed). Greedy is deterministic and repeatable but tends to produce flat, repetitive text and can get stuck in loops. Sampling introduces controlled randomness, which is why the same prompt can give different answers and why creative tasks feel more natural. Every other knob (temperature, top-p, top-k) is just a way to shape that probability list before the die is rolled.",
      keyTerms: [
        {
          term: 'Logits',
          definition:
            'The raw, unnormalized scores the model outputs for each possible next token before they are turned into probabilities. Higher logit means the model favors that token more.',
        },
        {
          term: 'Softmax',
          definition:
            'The function that converts logits into a probability distribution (numbers between 0 and 1 that sum to 1) so the model can pick or sample a next token.',
        },
        {
          term: 'Greedy decoding',
          definition:
            'Always selecting the single highest-probability token at each step. Deterministic and fast, but prone to bland or repetitive output.',
        },
        {
          term: 'Sampling',
          definition:
            'Choosing the next token by drawing from the probability distribution, so less likely tokens still have a chance. Adds variety and is the basis for temperature and top-p.',
        },
      ],
    },
    {
      heading: 'The shaping knobs: temperature, top-k, and top-p',
      explanation:
        "These three settings decide how adventurous the sampling is. Temperature rescales the probabilities before sampling: a low temperature (near 0) sharpens the distribution so the top token dominates (behaving almost like greedy), while a high temperature (above 1) flattens it so unlikely tokens get a real shot, which raises both creativity and the risk of nonsense. Top-k and top-p instead truncate the list of candidates: top-k keeps only the k most likely tokens and discards the rest, while top-p (also called nucleus sampling) keeps the smallest set of top tokens whose probabilities add up to at least p (for example 0.9), then samples among those. Top-p is usually preferred over top-k because it adapts: when the model is confident, the nucleus is tiny, and when it is uncertain, the nucleus widens automatically. In practice you tune temperature and top-p together; setting temperature to 0 makes output effectively deterministic regardless of the others.",
      keyTerms: [
        {
          term: 'Temperature',
          definition:
            'A scaling factor applied to logits before softmax. Low values (near 0) make output focused and near-deterministic; high values (above 1) make it more random and diverse.',
        },
        {
          term: 'Top-k sampling',
          definition:
            'Restricting the candidate pool to the k highest-probability tokens, then sampling among only those. Fixed cutoff regardless of how confident the model is.',
        },
        {
          term: 'Top-p (nucleus) sampling',
          definition:
            "Keeping the smallest group of top tokens whose cumulative probability reaches p (e.g. 0.9), then sampling within that group. The pool size adapts to the model's confidence.",
        },
      ],
    },
    {
      heading: 'Beam search and why chat models rarely use it',
      explanation:
        'Beam search is a decoding strategy that tries to find a high-probability whole sequence rather than just greedily picking each token. It keeps several candidate sequences alive at once (the beam width, say 4), extends each by one token, scores the partial sequences, and prunes back to the best few, repeating until done. This often produces more globally optimal text and is genuinely useful for tasks with one clearly correct answer, like machine translation or speech transcription. But for open-ended chat and creative generation it tends to produce bland, repetitive, generic text (the highest-probability sequence is often the most boring one), and it costs more compute because you are running multiple candidates in parallel. That is why modern chat assistants overwhelmingly use temperature-based sampling with top-p instead of beam search.',
      keyTerms: [
        {
          term: 'Beam search',
          definition:
            'A decoding method that maintains several partial sequence candidates at once and keeps the highest-scoring ones, aiming for a high-probability complete sequence rather than locally best single tokens.',
        },
        {
          term: 'Beam width',
          definition:
            'How many candidate sequences beam search keeps alive at each step. Larger width explores more options but costs more compute.',
        },
      ],
    },
    {
      heading: 'The KV cache: why generation gets faster after the first token',
      explanation:
        "When a model generates token by token, each new token's attention needs to look back at every previous token. Without help, the model would re-compute the internal representations (the keys and values used by attention) for the entire sequence at every single step, which is hugely wasteful. The KV cache stores those keys and values for all earlier tokens so each new step only computes the math for the one new token and reuses the rest. This is why the first response chunk (processing your whole prompt, the prefill) can lag while subsequent tokens stream out quickly (decode). The catch: the cache grows with sequence length and lives in GPU memory, so long contexts and many simultaneous users consume a lot of memory, which is a major driver of cost and of how many requests a server can handle at once.",
      keyTerms: [
        {
          term: 'KV cache',
          definition:
            'Stored attention keys and values for all already-processed tokens, so the model reuses them instead of recomputing the full sequence at every generation step. Trades memory for speed.',
        },
        {
          term: 'Prefill',
          definition:
            'The phase where the model processes the entire input prompt at once to populate the KV cache. Compute-heavy and a main source of time-to-first-token latency.',
        },
        {
          term: 'Decode (generation) phase',
          definition:
            'The step-by-step phase after prefill where each new token is produced one at a time, fast because it reuses the KV cache.',
        },
      ],
    },
    {
      heading: 'Context windows, latency vs throughput, and what breaks past the limit',
      explanation:
        'The context window is the maximum number of tokens (prompt plus generated output) the model can attend to at once, set by how it was trained. Two performance ideas often get confused: latency is how fast one request feels (time-to-first-token and per-token speed for a single user), while throughput is total tokens served per second across all users. They trade off: batching many requests together raises throughput and hardware efficiency but can add latency for any one user. As you fill the context window, two things degrade before you hit the hard limit. First, cost and latency rise roughly with length because attention work and the KV cache grow with the number of tokens. Second, quality can sag in the middle of very long inputs (the lost-in-the-middle effect), where models attend best to the beginning and end. Past the hard limit the request errors out or older tokens get truncated/dropped, so the model literally stops seeing the start of the conversation.',
      keyTerms: [
        {
          term: 'Context window',
          definition:
            'The maximum total tokens (input plus output) a model can process in one request, fixed by its training. Exceeding it forces truncation or an error.',
        },
        {
          term: 'Latency',
          definition:
            "How quickly a single request responds, commonly measured as time-to-first-token plus per-token generation speed. What one user experiences as 'fast.'",
        },
        {
          term: 'Throughput',
          definition:
            'Total tokens generated per unit time across all concurrent requests. Maximized by batching, which can come at the cost of individual latency.',
        },
        {
          term: 'Lost-in-the-middle',
          definition:
            'The tendency of models to use information at the start and end of a long context more reliably than information buried in the middle, degrading quality before the hard token limit is even reached.',
        },
      ],
    },
  ],
  video: {
    url: 'https://www.youtube.com/watch?v=MkaazQttbpc',
    title: 'The Secret Controls for your LLM: Temperature, Top-K, Top-P',
    channel: 'Matt Williams',
  },
  cards: [
    {
      id: 'inference-0',
      categoryKey: 'inference',
      category: 'Inference & Decoding',
      subtopic: 'Decoding basics',
      question:
        'At each generation step, what does a language model actually produce before any token is chosen, and what turns it into a single output token?',
      answer:
        'It produces a probability distribution over its entire vocabulary (one probability per possible token). A decoding rule (greedy, sampling, top-p, etc.) then selects one token from that distribution.',
      plain:
        'Before saying anything, the model makes a giant ranked list of every possible next word with odds attached, like a weather forecast giving a percent chance to each outcome. A separate picking rule then chooses one word off that list.',
      difficulty: 'core',
    },
    {
      id: 'inference-1',
      categoryKey: 'inference',
      category: 'Inference & Decoding',
      subtopic: 'Decoding basics',
      question:
        'What is the practical difference in output between greedy decoding and sampling?',
      answer:
        'Greedy always picks the single highest-probability token, so it is deterministic and repeatable but tends to be bland or repetitive. Sampling draws from the probability distribution, so output varies between runs and feels more natural and creative.',
      plain:
        'Greedy always grabs the single most likely word, so you get the same safe, sometimes boring answer every time. Sampling rolls a weighted die instead, so answers vary run to run and feel more lively and human.',
      difficulty: 'core',
    },
    {
      id: 'inference-2',
      categoryKey: 'inference',
      category: 'Inference & Decoding',
      subtopic: 'Sampling controls',
      question:
        "How does temperature change the model's probability distribution, and what happens at the extremes?",
      answer:
        'Temperature rescales the logits before softmax. Low temperature (near 0) sharpens the distribution so the top token dominates, making output focused and nearly deterministic. High temperature (above 1) flattens it, giving unlikely tokens a real chance and increasing both diversity and the risk of incoherent output.',
      plain:
        'Temperature is a creativity dial. Turn it down and the model plays it safe and predictable; turn it up and it takes more risks, getting more imaginative but also more likely to ramble or make no sense.',
      difficulty: 'core',
    },
    {
      id: 'inference-3',
      categoryKey: 'inference',
      category: 'Inference & Decoding',
      subtopic: 'Sampling controls',
      question:
        'What is the key difference between top-k and top-p (nucleus) sampling?',
      answer:
        'Top-k keeps a fixed number (k) of the highest-probability tokens regardless of context. Top-p keeps the smallest set of top tokens whose cumulative probability reaches at least p, so the candidate pool shrinks when the model is confident and grows when it is uncertain.',
      plain:
        'Both trim the list of candidate words before choosing, but top-k always keeps a fixed number (say the top 40), while top-p keeps however many add up to a set share of the odds. So top-p flexes with the situation while top-k stays rigid.',
      difficulty: 'intermediate',
    },
    {
      id: 'inference-4',
      categoryKey: 'inference',
      category: 'Inference & Decoding',
      subtopic: 'Sampling controls',
      question:
        'Why is top-p generally preferred over top-k for general-purpose text generation?',
      answer:
        "Top-p adapts to the model's confidence: when one token is clearly best the nucleus stays tiny (focused output), and when many tokens are plausible the nucleus widens (more diversity). Top-k uses a fixed cutoff, which can be too restrictive on uncertain steps and too permissive on confident ones.",
      plain:
        'Top-p adjusts itself: when there is an obvious right word it narrows down, and when many words fit it opens up. Top-k uses one fixed number for every situation, so it is often either too strict or too loose.',
      difficulty: 'intermediate',
    },
    {
      id: 'inference-5',
      categoryKey: 'inference',
      category: 'Inference & Decoding',
      subtopic: 'Sampling controls',
      question:
        'If you set temperature to 0, what happens to the effect of top-p and top-k, and why?',
      answer:
        'They become effectively irrelevant. At temperature 0 the distribution collapses to picking the single highest-probability token (greedy), so output is deterministic no matter what top-p or top-k are set to.',
      plain:
        'Setting temperature to 0 forces the model to always pick the single top word, so the other randomness settings no longer matter. It is like turning the dice into a coin with the same side on both faces: the other rules about which dice to use stop mattering.',
      difficulty: 'advanced',
    },
    {
      id: 'inference-6',
      categoryKey: 'inference',
      category: 'Inference & Decoding',
      subtopic: 'Beam search',
      question:
        'How does beam search differ from greedy decoding in what it optimizes for?',
      answer:
        'Greedy picks the locally best single token at each step. Beam search keeps several candidate sequences alive at once and scores whole partial sequences, aiming for a high-probability complete sequence rather than a series of locally best choices.',
      plain:
        'Greedy commits to the best next word and never looks back, like always taking the next turn that looks shortest. Beam search keeps a few possible routes open at once and judges the whole path, so it can find a better overall answer rather than just the best one word.',
      difficulty: 'intermediate',
    },
    {
      id: 'inference-7',
      categoryKey: 'inference',
      category: 'Inference & Decoding',
      subtopic: 'Beam search',
      question:
        'Why do modern chat assistants generally avoid beam search despite it finding higher-probability sequences?',
      answer:
        'For open-ended generation the highest-probability sequence is often bland, generic, and repetitive, which hurts conversational quality. Beam search also costs more compute by running multiple candidates in parallel. Temperature-based sampling with top-p produces more natural, varied output. Beam search is still useful for closed tasks like translation or transcription.',
      plain:
        'The most statistically likely wording is usually the most generic and dull, so beam search makes chat feel flat, and it costs more to run. For tasks with one right answer like translation it shines, but for free-flowing conversation, a dash of randomness reads better.',
      difficulty: 'advanced',
    },
    {
      id: 'inference-8',
      categoryKey: 'inference',
      category: 'Inference & Decoding',
      subtopic: 'KV cache',
      question:
        'What does the KV cache store, and what problem does it solve during generation?',
      answer:
        'It stores the attention keys and values computed for all already-processed tokens. This avoids recomputing the entire sequence\'s attention at every step, so each new token only computes its own math and reuses the cached rest, making token-by-token generation far faster.',
      plain:
        'It is a scratchpad that saves the work the model already did on earlier words so it does not redo all of it for each new word. Like keeping a running total instead of re-adding the whole grocery list every time you toss in one more item.',
      difficulty: 'core',
    },
    {
      id: 'inference-9',
      categoryKey: 'inference',
      category: 'Inference & Decoding',
      subtopic: 'KV cache',
      question:
        'Distinguish the prefill phase from the decode phase of inference, and which one drives time-to-first-token.',
      answer:
        'Prefill processes the whole input prompt at once to fill the KV cache and is compute-heavy, so it drives time-to-first-token latency. Decode is the step-by-step generation of output tokens afterward, which is fast because it reuses the cache.',
      plain:
        'Prefill is the model reading and digesting your whole prompt first, which is why there is a pause before the first word appears. Decode is the quick part after, where words stream out one by one because the heavy reading is already done.',
      difficulty: 'intermediate',
    },
    {
      id: 'inference-10',
      categoryKey: 'inference',
      category: 'Inference & Decoding',
      subtopic: 'Context window',
      question:
        'Why does a longer context window make inference both slower and more expensive, even before hitting the limit?',
      answer:
        'Attention work scales with the number of tokens, and the KV cache grows with sequence length and occupies GPU memory. More tokens means more compute per step and more memory pressure, which raises latency and cost and reduces how many requests a server can run at once.',
      plain:
        'The more text you pile in, the more the model has to keep track of and re-reference for every new word, which eats both processing time and memory. A longer document is simply more work to hold in mind and reason over, so it costs more and runs slower.',
      difficulty: 'intermediate',
    },
    {
      id: 'inference-11',
      categoryKey: 'inference',
      category: 'Inference & Decoding',
      subtopic: 'Context window',
      question: "What is the 'lost-in-the-middle' effect?",
      answer:
        'Models tend to use information placed at the beginning and end of a long context more reliably than information buried in the middle. Quality on mid-context details can degrade well before the hard token limit is reached.',
      plain:
        'Just like a person skimming a long document, the model remembers the start and the end best and tends to gloss over the middle. So a key detail buried in the middle of a huge prompt can get overlooked.',
      difficulty: 'advanced',
    },
    {
      id: 'inference-12',
      categoryKey: 'inference',
      category: 'Inference & Decoding',
      subtopic: 'Latency vs throughput',
      question:
        'Define latency and throughput in LLM serving, and explain the tradeoff between them.',
      answer:
        'Latency is how fast a single request responds (time-to-first-token plus per-token speed). Throughput is total tokens served per second across all concurrent requests. Batching many requests together raises throughput and hardware efficiency but can increase latency for any individual user.',
      plain:
        'Latency is how fast your one answer comes back; throughput is how many people the system can serve at once. It is like a coffee shop: grouping orders gets more drinks out per hour overall, but any single customer might wait a bit longer.',
      difficulty: 'intermediate',
    },
    {
      id: 'inference-13',
      categoryKey: 'inference',
      category: 'Inference & Decoding',
      subtopic: 'Context window',
      question:
        "What actually happens when an input plus expected output exceeds a model's context window?",
      answer:
        'The request either errors out or older tokens get truncated/dropped. When earlier tokens are dropped, the model literally stops seeing the start of the prompt or conversation, so it can lose instructions or earlier context entirely.',
      plain:
        'The model can only hold so much text at once, so going over the limit either throws an error or quietly forgets the oldest parts. That means it can lose your original instructions or the early part of the chat, like a whiteboard where the start gets erased to make room.',
      difficulty: 'core',
    },
    {
      id: 'inference-14',
      categoryKey: 'inference',
      category: 'Inference & Decoding',
      subtopic: 'Autoregressive decoding',
      question:
        'What does it mean that an LLM is "autoregressive," and why does it generate one token at a time instead of the whole answer at once?',
      answer:
        'Autoregressive means each new token is predicted from all the tokens before it, including the ones the model just generated. The model has no way to produce a full answer in one shot: it must append its own previous output to the input and predict the next token, then repeat. The output it has already written becomes part of the input for the next step.',
      plain:
        'The model writes the way you might tell a story word by word, where each next word depends on everything said so far, including the words you just spoke. It cannot jump to the ending. It has to keep feeding its own latest words back in and asking "so what comes next?"',
      difficulty: 'core',
    },
    {
      id: 'inference-15',
      categoryKey: 'inference',
      category: 'Inference & Decoding',
      subtopic: 'Stop sequences and max tokens',
      question:
        'What is a stop sequence, and how does it control where generation ends?',
      answer:
        'A stop sequence is a string you specify that, once produced, immediately halts generation (the stop string itself is usually not included in the returned output). It lets you end a response at a natural boundary, such as a newline, a closing tag, or a marker like "User:", instead of letting the model ramble on.',
      plain:
        'A stop sequence is like telling the model "when you reach this exact phrase, put the pen down." If you say stop at "User:", it will finish its turn and not start writing the next person\'s lines for them.',
      difficulty: 'core',
    },
    {
      id: 'inference-16',
      categoryKey: 'inference',
      category: 'Inference & Decoding',
      subtopic: 'Stop sequences and max tokens',
      question:
        'Why might a response get cut off mid-sentence, and what setting usually controls that?',
      answer:
        'The max tokens (max output tokens) setting caps how many tokens the model is allowed to generate in one response. If the model has not naturally finished when it hits that cap, generation stops abruptly, often mid-sentence. The fix is to raise the limit or ask the model to be more concise, not to assume the model "gave up."',
      plain:
        'There is a length budget on the answer, and when the model runs out of budget it stops cold, even mid-word. A chopped-off reply usually means you set the output length too short, not that the model lost its train of thought.',
      difficulty: 'core',
    },
    {
      id: 'inference-17',
      categoryKey: 'inference',
      category: 'Inference & Decoding',
      subtopic: 'Streaming output',
      question:
        'When a chat assistant streams text word by word, is that a visual effect or is it tied to how the model actually works?',
      answer:
        'It reflects how the model actually works. Because generation is autoregressive (one token after another), each token becomes available the moment it is produced, so the server can send it immediately rather than waiting for the whole response. Streaming lowers perceived latency by showing progress as it happens, but it does not make the model finish any faster overall.',
      plain:
        'The typing-out effect is real, not a gimmick. The model genuinely produces one piece at a time, so the app shows each piece as it arrives, like reading a fax as it prints instead of waiting for the full page. It feels faster even though the total time is the same.',
      difficulty: 'core',
    },
    {
      id: 'inference-18',
      categoryKey: 'inference',
      category: 'Inference & Decoding',
      subtopic: 'Determinism and seeds',
      question:
        'What is a random seed in this context, and how does it relate to reproducibility?',
      answer:
        'A seed is a fixed starting value for the random number generator used during sampling. With the same seed, same prompt, same settings, and same model version, the sequence of "random" choices repeats, so you get the same output. It makes sampled generation reproducible for debugging or testing without forcing temperature to 0.',
      plain:
        'A seed is like shuffling a deck of cards the exact same way every time. The model still draws cards (samples), but because the shuffle is identical, you get the identical hand again, which is handy when you want to rerun and compare.',
      difficulty: 'intermediate',
    },
    {
      id: 'inference-19',
      categoryKey: 'inference',
      category: 'Inference & Decoding',
      subtopic: 'Determinism and seeds',
      question:
        'Even with temperature set to 0, why can the same prompt sometimes still return slightly different answers?',
      answer:
        'Temperature 0 removes the deliberate randomness, but full bit-for-bit determinism is not guaranteed in practice. Tiny floating-point differences from how work is batched and ordered across hardware, plus model or system updates on the provider side, can change which token wins a near-tie. So "deterministic" decoding is highly consistent but not an absolute promise across runs.',
      plain:
        'Turning randomness off makes answers very stable, but not always perfectly identical. When two top words are almost exactly tied, tiny rounding differences in the math (and behind-the-scenes updates) can tip the winner one way or the other.',
      difficulty: 'intermediate',
    },
    {
      id: 'inference-20',
      categoryKey: 'inference',
      category: 'Inference & Decoding',
      subtopic: 'Repetition penalties',
      question:
        'What do repetition, frequency, and presence penalties do during decoding?',
      answer:
        'They reduce the probability of tokens based on what has already appeared, to discourage loops and repetition. A frequency penalty lowers a token\'s odds more the more often it has occurred. A presence penalty lowers it once the token has appeared at all (nudging toward new topics). Set too high, they can hurt coherence by forcing the model away from words it genuinely needs.',
      plain:
        'These are anti-broken-record settings. They quietly dock points from words the model has already used so it stops repeating itself, with one flavor punishing heavy reuse and another nudging it toward fresh topics. Crank them too far and it starts avoiding words it actually needs.',
      difficulty: 'intermediate',
    },
    {
      id: 'inference-21',
      categoryKey: 'inference',
      category: 'Inference & Decoding',
      subtopic: 'Choosing settings',
      question:
        'For a task that needs exact, repeatable answers (like extracting a date from a document) versus brainstorming taglines, how should you set the decoding knobs differently?',
      answer:
        'For exact extraction, use low or zero temperature (greedy-like) so the model commits to the single most likely answer and stays consistent. For brainstorming, raise temperature and use top-p around 0.9 to widen the candidate pool, producing varied, creative options. The same model serves both, and only the decoding settings change.',
      plain:
        'Match the dial to the job. For "just give me the right date," turn creativity down so it picks the safest answer every time. For "give me ten catchy taglines," turn it up so it explores. Same model, different knobs.',
      difficulty: 'core',
    },
  ],
};

export default mod;
