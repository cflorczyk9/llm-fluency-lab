// Module: Pretraining & Scaling (tier 1). Deepened from the original deck.
// Existing cards pretraining-0..pretraining-13 are carried over verbatim with
// their original ids, summary/breakdown/video preserved. New cards
// pretraining-14..21 add knowledge cutoff, data quality, gradient descent,
// contamination, training cost, and blind spots.

import type { Category } from '../../types';

const mod: Category = {
  key: 'pretraining',
  name: 'Pretraining & Scaling',
  tier: 1,
  summary:
    'Pretraining is where a model reads a huge slice of text and learns to predict the next token. It explains where knowledge, capabilities, and the knowledge cutoff come from, and why scale matters.',
  learningObjectives: [
    'By the end you can explain the next-token prediction objective and what self-supervised learning means',
    'By the end you can describe what training data, the knowledge cutoff, and data quality mean for behavior',
    'By the end you can explain scaling laws and the trade-off between model size and training data',
    'By the end you can describe loss, gradient descent, and a compute budget in plain terms',
    'By the end you can explain emergent capabilities and why bigger is not always better',
    "By the end you can connect pretraining choices to a model's strengths, blind spots, and recency limits",
  ],
  breakdown: [
    {
      heading: 'The Objective: Next-Token Prediction',
      video: { url: "https://www.youtube.com/watch?v=wjZofJX0v4M", title: "Transformers, the tech behind LLMs | Deep Learning Chapter 5", channel: "3Blue1Brown" },
      explanation:
        "Almost every modern language model is trained on one deceptively simple task: given a chunk of text, predict the very next token (a token is a word or word-fragment, roughly 0.75 words on average). The model outputs a probability for every possible next token, gets told what the real next token was, and nudges its internal numbers (weights) to make the right answer slightly more likely next time. Repeat this trillions of times across the internet and the model is forced to learn grammar, facts, reasoning patterns, and style as a side effect of getting better at guessing the next word. Nothing about the objective says 'be smart' or 'be helpful'; capability emerges because predicting text well across a huge variety of documents secretly requires understanding what the text is about.",
      keyTerms: [
        {
          term: 'Next-token prediction',
          definition:
            'The training task where the model predicts the next token in a sequence given all the preceding tokens. Also called autoregressive or causal language modeling.',
        },
        {
          term: 'Token',
          definition:
            'The unit a model reads and writes. Usually a word or sub-word fragment, averaging about 0.75 words in English. Models work on tokens, not raw characters or whole words.',
        },
        {
          term: 'Self-supervised learning',
          definition:
            "Training where the labels come free from the data itself (the 'answer' is just the next token in the text), so no human has to hand-label anything. This is what lets training scale to the whole internet.",
        },
      ],
      caption:
        'The model reads the words so far and outputs odds for every possible next token. Here mat scores highest, so it is the most likely next word.',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 200" width="100%" preserveAspectRatio="xMidYMid meet" role="img" font-family="-apple-system, system-ui, sans-serif"><title>Next-token prediction: the model outputs a probability for every possible next token</title><style>@keyframes ntpPulse{0%,100%{opacity:1}50%{opacity:.55}}.ntpHi{animation:ntpPulse 2.4s ease-in-out infinite}@media (prefers-reduced-motion: reduce){.ntpHi{animation:none}}</style><defs><marker id="ntpAr" markerWidth="9" markerHeight="9" refX="5.5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#2f8cff"/></marker></defs><rect x="0" y="0" width="360" height="200" rx="10" fill="#f7f3ea"/><text x="18" y="22" font-size="12.5" font-weight="700" fill="#1c1d1f">Predict the next token</text><g font-size="11" fill="#1c1d1f" text-anchor="middle"><rect x="18" y="34" width="40" height="22" rx="5" fill="#ffffff" stroke="#6b7280" stroke-width="1.2"/><text x="38" y="49">The</text><rect x="62" y="34" width="40" height="22" rx="5" fill="#ffffff" stroke="#6b7280" stroke-width="1.2"/><text x="82" y="49">cat</text><rect x="106" y="34" width="40" height="22" rx="5" fill="#ffffff" stroke="#6b7280" stroke-width="1.2"/><text x="126" y="49">sat</text><rect x="150" y="34" width="40" height="22" rx="5" fill="#ffffff" stroke="#6b7280" stroke-width="1.2"/><text x="170" y="49">on</text><rect x="194" y="34" width="40" height="22" rx="5" fill="#ffffff" stroke="#6b7280" stroke-width="1.2"/><text x="214" y="49">the</text><rect x="238" y="34" width="40" height="22" rx="5" fill="#ffffff" stroke="#2f8cff" stroke-width="1.6" stroke-dasharray="4 3"/><text x="258" y="49" fill="#2f8cff" font-weight="700">?</text></g><path d="M258,58 L258,74" fill="none" stroke="#2f8cff" stroke-width="1.6" marker-end="url(#ntpAr)"/><text x="18" y="88" font-size="10.5" fill="#6b7280">probabilities over the vocabulary</text><g font-size="11"><text x="92" y="106" text-anchor="end" fill="#1c1d1f">mat</text><rect class="ntpHi" x="98" y="97" width="123" height="13" rx="3" fill="#2f8cff"/><text x="227" y="107" font-size="10" fill="#6b7280">0.41</text><text x="92" y="128" text-anchor="end" fill="#1c1d1f">rug</text><rect x="98" y="119" width="54" height="13" rx="3" fill="#6b7280"/><text x="158" y="129" font-size="10" fill="#6b7280">0.18</text><text x="92" y="150" text-anchor="end" fill="#1c1d1f">floor</text><rect x="98" y="141" width="36" height="13" rx="3" fill="#6b7280"/><text x="140" y="151" font-size="10" fill="#6b7280">0.12</text><text x="92" y="172" text-anchor="end" fill="#1c1d1f">sofa</text><rect x="98" y="163" width="18" height="13" rx="3" fill="#6b7280"/><text x="122" y="173" font-size="10" fill="#6b7280">0.06</text></g></svg>`,
    },
    {
      heading: 'Loss: The Number That Drives Everything',
      video: { url: "https://www.youtube.com/watch?v=6ArSys5qHAU", title: "Neural Networks Part 6: Cross Entropy", channel: "StatQuest with Josh Starmer" },
      explanation:
        "During pretraining the model is graded by a loss function (specifically cross-entropy loss), which measures how surprised the model was by the true next token. If the model assigned high probability to the correct token, loss is low; if it was confident in the wrong token, loss is high. Training is just a long process of tweaking weights to push average loss down. A closely related, more intuitive number is perplexity, which is roughly 'how many equally-likely options the model felt it was choosing between' at each step: lower is better. Crucially, loss never hits zero, because language is genuinely unpredictable (you cannot perfectly guess the next word of a novel), and a model that drove training loss to zero would just be memorizing rather than generalizing.",
      keyTerms: [
        {
          term: 'Cross-entropy loss',
          definition:
            'The standard pretraining loss. It penalizes the model based on the negative log-probability it assigned to the correct token: confident-and-wrong is punished hardest, confident-and-right is rewarded most.',
        },
        {
          term: 'Perplexity',
          definition:
            'A reader-friendly transform of loss (the exponential of cross-entropy). It estimates the effective number of choices the model is hesitating between per token. Lower means a better-calibrated model.',
        },
        {
          term: 'Irreducible loss',
          definition:
            'The floor that loss cannot drop below because language has inherent randomness. No model, however large, can perfectly predict every next token.',
        },
      ],
      caption:
        'Loss measures how surprised the model is by the real next word. Training drives it down step by step, but it flattens above a floor because language is never perfectly predictable.',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 200" width="100%" preserveAspectRatio="xMidYMid meet" role="img" font-family="-apple-system, system-ui, sans-serif"><title>Training loss falls steeply, then flattens above an irreducible floor</title><style>@keyframes lsDot{0%,100%{opacity:1}50%{opacity:.35}}.lsPt{animation:lsDot 2s ease-in-out infinite}@media (prefers-reduced-motion: reduce){.lsPt{animation:none}}</style><rect x="0" y="0" width="360" height="200" rx="10" fill="#f7f3ea"/><text x="18" y="22" font-size="12.5" font-weight="700" fill="#1c1d1f">Loss falls, then flattens</text><line x1="50" y1="36" x2="50" y2="168" stroke="#6b7280" stroke-width="1.2"/><line x1="50" y1="168" x2="338" y2="168" stroke="#6b7280" stroke-width="1.2"/><line x1="50" y1="150" x2="338" y2="150" stroke="#d97706" stroke-width="1.3" stroke-dasharray="5 4"/><text x="336" y="163" text-anchor="end" font-size="9.5" fill="#d97706">irreducible floor</text><path d="M50,46 C96,116 150,136 212,142 C262,145 308,145 332,145" fill="none" stroke="#2f8cff" stroke-width="2"/><circle class="lsPt" cx="332" cy="145" r="3.4" fill="#2f8cff"/><text x="44" y="44" text-anchor="end" font-size="9.5" fill="#6b7280">high</text><text x="44" y="148" text-anchor="end" font-size="9.5" fill="#6b7280">low</text><text x="56" y="32" font-size="9.5" fill="#6b7280">loss</text><text x="336" y="184" text-anchor="end" font-size="9.5" fill="#6b7280">training steps</text></svg>`,
    },
    {
      heading: 'Scaling Laws: Bigger and More, Predictably Better',
      video: { url: "https://www.youtube.com/watch?v=TYCw8QSNT9w", title: "Understanding LLM Chinchilla Scaling Laws - Why Bigger Isn't Always Better!", channel: "Cloudvala" },
      explanation:
        "One of the most important empirical findings in modern AI is that loss falls in a smooth, predictable way (a power law) as you increase three things: the number of parameters (model size), the amount of training data (tokens), and the compute spent. This means you can run small cheap experiments and forecast how a much larger model will perform before spending millions to train it. The 2022 Chinchilla result sharpened this: for a fixed compute budget, earlier models like GPT-3 were too big and undertrained, and you get a better model by using a smaller network trained on far more data (roughly 20 tokens of data per parameter as a rule of thumb). This is why the trend shifted toward training modest-sized models on enormous, carefully filtered datasets rather than just inflating parameter counts.",
      keyTerms: [
        {
          term: 'Scaling law',
          definition:
            'The empirical relationship showing model loss decreases as a smooth power-law function of model size, dataset size, and compute. It lets labs predict large-model performance from small-model runs.',
        },
        {
          term: 'Parameters',
          definition:
            'The learned weights inside the model. More parameters means more capacity to store patterns, but only helps if matched by enough training data and compute.',
        },
        {
          term: 'Chinchilla-optimal',
          definition:
            "The 2022 finding that, for a given compute budget, the best model uses fewer parameters and more training tokens than was previously standard (roughly 20 tokens per parameter). It corrected the 'just make it bigger' assumption.",
        },
      ],
      caption:
        'Add more parameters, data, and compute and loss drops along a smooth straight line on a log-log chart. That predictability lets labs forecast a big model before building it.',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 200" width="100%" preserveAspectRatio="xMidYMid meet" role="img" font-family="-apple-system, system-ui, sans-serif"><title>Loss drops along a straight power-law line as parameters, data, and compute grow</title><defs><marker id="scAr" markerWidth="9" markerHeight="9" refX="5.5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#2f8cff"/></marker></defs><rect x="0" y="0" width="360" height="200" rx="10" fill="#f7f3ea"/><text x="18" y="22" font-size="12.5" font-weight="700" fill="#1c1d1f">Scaling laws</text><g font-size="10" fill="#1c1d1f" text-anchor="middle"><rect x="14" y="46" width="118" height="28" rx="6" fill="#ffffff" stroke="#6b7280" stroke-width="1.2"/><text x="73" y="64">more parameters</text><rect x="14" y="86" width="118" height="28" rx="6" fill="#ffffff" stroke="#6b7280" stroke-width="1.2"/><text x="73" y="104">more data</text><rect x="14" y="126" width="118" height="28" rx="6" fill="#ffffff" stroke="#6b7280" stroke-width="1.2"/><text x="73" y="144">more compute</text></g><path d="M136,100 L166,100" fill="none" stroke="#2f8cff" stroke-width="1.6" marker-end="url(#scAr)"/><line x1="190" y1="48" x2="190" y2="160" stroke="#6b7280" stroke-width="1.2"/><line x1="190" y1="160" x2="344" y2="160" stroke="#6b7280" stroke-width="1.2"/><line x1="196" y1="58" x2="338" y2="152" stroke="#2f8cff" stroke-width="2"/><text x="186" y="54" text-anchor="end" font-size="9.5" fill="#6b7280">loss</text><text x="344" y="174" text-anchor="end" font-size="9.5" fill="#6b7280">scale (log-log)</text><text x="300" y="120" text-anchor="end" font-size="9.5" fill="#2f8cff">power law</text></svg>`,
    },
    {
      heading: 'Emergent Abilities and Diminishing Returns',
      video: { url: "https://www.youtube.com/watch?v=qAUJwKvm_lQ", title: "AI achievements unlocked: Emergent abilities in large language models (GPT-3, GPT-4, PaLM, Gemini)", channel: "Dr Alan D. Thompson" },
      explanation:
        "As models scale, most skills improve smoothly, but some capabilities appear to switch on rather suddenly past a certain size or compute threshold (things like multi-step arithmetic or following novel instructions). These are called emergent abilities, though there is genuine debate about whether the 'sudden jump' is real or partly an artifact of using harsh all-or-nothing scoring metrics (a model can be quietly getting better before it crosses the line where it scores any points at all). Separately, scaling has real limits: returns diminish (each doubling of compute buys a smaller loss improvement), and the supply of high-quality human text is finite, which is pushing labs toward synthetic data, better data curation, and spending more compute at inference time (letting the model 'think' longer) rather than relying only on bigger pretraining.",
      keyTerms: [
        {
          term: 'Emergent ability',
          definition:
            'A capability that is largely absent in smaller models and present in larger ones, sometimes appearing abruptly. Whether the abruptness is fundamental or a measurement artifact is debated.',
        },
        {
          term: 'Diminishing returns',
          definition:
            'Because scaling follows a power law, each additional unit of compute or data yields a progressively smaller drop in loss. Gains never stop, but they get expensive.',
        },
        {
          term: 'Data wall',
          definition:
            'The constraint that high-quality human-written text is a finite resource, limiting how far pure data-scaling can go and motivating synthetic data and inference-time compute.',
        },
      ],
      caption:
        'On some skills, capability stays flat as models grow, then jumps past a size threshold. Higher up the curve flattens, so each new gain costs more.',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 200" width="100%" preserveAspectRatio="xMidYMid meet" role="img" font-family="-apple-system, system-ui, sans-serif"><title>Some skills stay flat as models scale, then rise sharply past a threshold</title><rect x="0" y="0" width="360" height="200" rx="10" fill="#f7f3ea"/><text x="18" y="22" font-size="12.5" font-weight="700" fill="#1c1d1f">Emergent jump, then diminishing returns</text><line x1="46" y1="40" x2="46" y2="160" stroke="#6b7280" stroke-width="1.2"/><line x1="46" y1="160" x2="344" y2="160" stroke="#6b7280" stroke-width="1.2"/><line x1="190" y1="44" x2="190" y2="160" stroke="#d97706" stroke-width="1.2" stroke-dasharray="5 4"/><text x="190" y="54" text-anchor="middle" font-size="9.5" fill="#d97706">threshold</text><path d="M50,150 C110,149 150,148 168,142 C186,135 198,98 212,76 C226,54 252,50 282,50 C304,50 324,51 338,52" fill="none" stroke="#2f8cff" stroke-width="2"/><text x="216" y="98" font-size="9.5" fill="#2f8cff">emergent jump</text><text x="338" y="44" text-anchor="end" font-size="9" fill="#6b7280">gains flatten</text><text x="40" y="50" text-anchor="end" font-size="9.5" fill="#6b7280">skill</text><text x="344" y="174" text-anchor="end" font-size="9.5" fill="#6b7280">model scale (log)</text></svg>`,
    },
    {
      heading: 'Base Models vs the Assistant You Talk To',
      video: { url: "https://www.youtube.com/watch?v=zjkBMFhNj_g", title: "[1hr Talk] Intro to Large Language Models", channel: "Andrej Karpathy" },
      explanation:
        "The direct output of pretraining is a base model (also called a foundation model or pretrained model). A base model is a raw next-token predictor: extremely knowledgeable but not an obedient chatbot. Ask it a question and it might just continue the text with more questions, because it learned to imitate internet documents, not to be helpful, honest, and safe. The friendly assistant behavior comes from a second stage, post-training (instruction tuning plus reinforcement learning from human or AI feedback), layered on top. The mental model is: pretraining builds the engine and installs all the knowledge; post-training teaches it manners and how to take orders. This is also the clean dividing line behind why people say models 'know' things from pretraining but get steered and aligned in post-training.",
      keyTerms: [
        {
          term: 'Base model',
          definition:
            'The model straight out of pretraining: a powerful next-token predictor with broad knowledge but no built-in instruction-following or chat behavior.',
        },
        {
          term: 'Foundation model',
          definition:
            'A large pretrained model meant to be a reusable starting point that gets adapted (via post-training or fine-tuning) for many downstream uses.',
        },
        {
          term: 'Post-training',
          definition:
            'The stages applied after pretraining (instruction tuning, RLHF/RLAIF) that turn a raw base model into a helpful, instruction-following, safer assistant. It shapes behavior, not core knowledge.',
        },
      ],
      caption:
        'Pretraining outputs a raw base model that only continues text. Post-training adds manners and instruction-following, turning it into the assistant you chat with.',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 200" width="100%" preserveAspectRatio="xMidYMid meet" role="img" font-family="-apple-system, system-ui, sans-serif"><title>Post-training turns a raw base model into a helpful chat assistant</title><defs><marker id="bvAr" markerWidth="10" markerHeight="10" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#2f8cff"/></marker></defs><rect x="0" y="0" width="360" height="200" rx="10" fill="#f7f3ea"/><text x="18" y="22" font-size="12.5" font-weight="700" fill="#1c1d1f">From base model to assistant</text><rect x="20" y="56" width="128" height="84" rx="7" fill="#ffffff" stroke="#6b7280" stroke-width="1.3"/><text x="84" y="80" text-anchor="middle" font-size="11.5" font-weight="700" fill="#1c1d1f">Base model</text><text x="84" y="100" text-anchor="middle" font-size="9.5" fill="#6b7280">raw next-token predictor</text><text x="84" y="116" text-anchor="middle" font-size="9.5" fill="#6b7280">knowledge baked in</text><text x="84" y="132" text-anchor="middle" font-size="9.5" fill="#6b7280">no manners yet</text><path d="M150,98 L206,98" fill="none" stroke="#2f8cff" stroke-width="1.8" marker-end="url(#bvAr)"/><text x="178" y="90" text-anchor="middle" font-size="9.5" fill="#1c1d1f">post-training</text><text x="178" y="112" text-anchor="middle" font-size="9" fill="#6b7280">SFT + RLHF</text><rect x="210" y="56" width="132" height="84" rx="7" fill="#ffffff" stroke="#2f8cff" stroke-width="1.6"/><text x="276" y="80" text-anchor="middle" font-size="11.5" font-weight="700" fill="#1c1d1f">Chat assistant</text><text x="276" y="100" text-anchor="middle" font-size="9.5" fill="#6b7280">follows instructions</text><text x="276" y="116" text-anchor="middle" font-size="9.5" fill="#6b7280">helpful and honest</text><text x="276" y="132" text-anchor="middle" font-size="9.5" fill="#6b7280">and harmless</text></svg>`,
    },
  ],
  video: {
    url: 'https://www.youtube.com/watch?v=7xTGNNLPyMI',
    title: 'Deep Dive into LLMs like ChatGPT',
    channel: 'Andrej Karpathy',
  },
  cards: [
    {
      id: 'pretraining-0',
      categoryKey: 'pretraining',
      category: 'Pretraining & Scaling',
      subtopic: 'Next-token prediction',
      question:
        'What is the single training objective behind almost all modern large language models, and what does the model actually output at each step?',
      answer:
        'The objective is next-token prediction (autoregressive language modeling): given the preceding tokens, predict the next one. At each step the model outputs a probability distribution over the entire vocabulary, and training nudges its weights to raise the probability of the token that actually came next.',
      plain:
        'The model is trained to do one thing: guess the next word given what came before, like a supercharged autocomplete. For each guess it produces odds for every possible next word, and training keeps adjusting it to bet more on the word that truly comes next.',
      difficulty: 'core',
    },
    {
      id: 'pretraining-1',
      categoryKey: 'pretraining',
      category: 'Pretraining & Scaling',
      subtopic: 'Next-token prediction',
      question: "Why is pretraining called 'self-supervised' when no humans label the data?",
      answer:
        'The labels come free from the text itself: the correct \'answer\' for any position is simply the token that actually follows it in the document. Because the data supervises itself, training can scale to enormous unlabeled corpora without any human annotation.',
      plain:
        'Nobody has to grade the answers because the text already contains them: the right next word is just the word that literally comes next. Since the data checks itself, you can train on basically the whole internet without an army of human labelers.',
      difficulty: 'core',
    },
    {
      id: 'pretraining-2',
      categoryKey: 'pretraining',
      category: 'Pretraining & Scaling',
      subtopic: 'Next-token prediction',
      question:
        "How does broad capability (grammar, facts, reasoning) emerge from an objective as narrow as 'predict the next token'?",
      answer:
        'Predicting the next token well across a huge variety of documents secretly requires modeling what the text is about. To minimize prediction error on code, math, dialogue, and prose, the model is forced to learn grammar, facts, and reasoning patterns as a side effect. Capability is a byproduct, not an explicit goal.',
      plain:
        'To guess the next word well across code, math, and conversation, you have to actually understand what is going on, so the model picks up grammar, facts, and reasoning just to get better at guessing. The intelligence is a side effect of relentlessly practicing one tiny task on hugely varied material.',
      difficulty: 'intermediate',
    },
    {
      id: 'pretraining-3',
      categoryKey: 'pretraining',
      category: 'Pretraining & Scaling',
      subtopic: 'Loss',
      question: 'What does the cross-entropy loss used in pretraining actually measure?',
      answer:
        'It measures how surprised the model was by the true next token, based on the negative log of the probability it assigned to that token. Being confident and wrong is penalized most heavily; being confident and correct is rewarded most. Training drives the average of this loss down.',
      plain:
        'Loss is basically a surprise meter: it spikes when the real next word is one the model thought was unlikely. Being boldly wrong hurts the most, being boldly right scores the best, and training just keeps shrinking the average surprise.',
      difficulty: 'intermediate',
    },
    {
      id: 'pretraining-4',
      categoryKey: 'pretraining',
      category: 'Pretraining & Scaling',
      subtopic: 'Loss',
      question: 'What is perplexity, and how does it relate to loss?',
      answer:
        'Perplexity is the exponential of the cross-entropy loss. Intuitively it is the effective number of equally-likely tokens the model felt it was choosing between at each step. Lower perplexity means a better, more confident-and-correct model.',
      plain:
        'Perplexity is a friendlier version of the loss number: roughly how many words the model felt torn between for each next guess. Picking confidently among 3 options (low perplexity) is a sharper model than waffling among 50 (high perplexity).',
      difficulty: 'intermediate',
    },
    {
      id: 'pretraining-5',
      categoryKey: 'pretraining',
      category: 'Pretraining & Scaling',
      subtopic: 'Loss',
      question:
        'Why does pretraining loss never reach zero, and why would driving it to zero be a bad sign anyway?',
      answer:
        'Language has inherent randomness, so the next token is often genuinely unpredictable (you cannot perfectly guess the next word of a novel). This sets an irreducible loss floor. A model that pushed training loss to zero would be memorizing the training data rather than generalizing, which hurts performance on new text.',
      plain:
        'Some next words are just unguessable (no one can perfectly predict the next line of a novel), so there is a floor the score can never beat. And if a model somehow got a perfect score, it would mean it memorized its study material instead of truly learning, so it would flop on anything new.',
      difficulty: 'advanced',
    },
    {
      id: 'pretraining-6',
      categoryKey: 'pretraining',
      category: 'Pretraining & Scaling',
      subtopic: 'Scaling laws',
      question: 'What do scaling laws state, and what practical power do they give AI labs?',
      answer:
        'Scaling laws say model loss drops as a smooth power-law function of three things: parameters, training data (tokens), and compute. The practical payoff is forecasting: labs can run small, cheap experiments and predict how a far larger model will perform before committing the money to train it.',
      plain:
        'Scaling laws say that as you add more model size, more data, and more computing power, the model gets better in a smooth, predictable curve. That predictability lets labs test cheaply at small scale and forecast a giant model\'s quality before spending millions to build it.',
      difficulty: 'core',
    },
    {
      id: 'pretraining-7',
      categoryKey: 'pretraining',
      category: 'Pretraining & Scaling',
      subtopic: 'Scaling laws',
      question: 'What did the Chinchilla finding (2022) change about how to spend a fixed compute budget?',
      answer:
        'It showed that earlier models like GPT-3 were too large and undertrained. For a fixed compute budget you get a better model by using fewer parameters and far more training tokens, roughly 20 tokens of data per parameter. This shifted the field from \'just make it bigger\' toward training smaller models on much more, well-curated data.',
      plain:
        'Chinchilla showed earlier giant models were like big brains that hadn\'t read enough books: better to build a somewhat smaller model and feed it far more reading. The rule of thumb landed near 20 chunks of text per unit of model size, which moved the field away from just making models bigger.',
      difficulty: 'advanced',
    },
    {
      id: 'pretraining-8',
      categoryKey: 'pretraining',
      category: 'Pretraining & Scaling',
      subtopic: 'Scaling laws',
      question:
        'Increasing parameter count alone does not reliably improve a model. What else must scale with it, and why?',
      answer:
        'Training data (tokens) and compute must scale alongside parameters. More parameters add capacity to store patterns, but without enough data and compute that capacity goes unused or leads to overfitting. The Chinchilla result formalized that parameters and data should grow roughly in proportion.',
      plain:
        'A bigger brain is useless without enough to read and enough time to study, so data and computing power have to grow alongside model size. Adding capacity with too little data just means the model memorizes instead of learning, and most of that capacity sits wasted.',
      difficulty: 'intermediate',
    },
    {
      id: 'pretraining-9',
      categoryKey: 'pretraining',
      category: 'Pretraining & Scaling',
      subtopic: 'Emergent abilities',
      question: "What is an 'emergent ability' in scaling, and why is the concept contested?",
      answer:
        'An emergent ability is a capability largely absent in smaller models that appears (sometimes abruptly) in larger ones, such as multi-step arithmetic or following novel instructions. It is contested because the apparent suddenness may be partly an artifact of harsh all-or-nothing scoring: the model can improve gradually while scoring zero until it crosses a threshold.',
      plain:
        'An emergent ability is a skill that small models just can\'t do but big ones suddenly can, like multi-step math seemingly switching on. The fight is over whether it truly pops up overnight or only looks sudden because pass-fail grading gives zero credit until the model finally clears the bar.',
      difficulty: 'advanced',
    },
    {
      id: 'pretraining-10',
      categoryKey: 'pretraining',
      category: 'Pretraining & Scaling',
      subtopic: 'Scaling laws',
      question:
        'Since scaling laws follow a power law, what does that imply about the payoff from each additional doubling of compute?',
      answer:
        'It implies diminishing returns: each doubling of compute or data produces a smaller absolute drop in loss than the previous one. Performance keeps improving, but the gains get progressively more expensive to buy.',
      plain:
        'Each time you double the computing power you get a smaller bump in quality than the time before, like a phone battery that charges fast to 80% then crawls. Models keep getting better, but every extra notch of improvement costs a lot more.',
      difficulty: 'intermediate',
    },
    {
      id: 'pretraining-11',
      categoryKey: 'pretraining',
      category: 'Pretraining & Scaling',
      subtopic: 'Scaling laws',
      question: "What is the 'data wall,' and what strategies are labs using in response?",
      answer:
        'The data wall is the constraint that high-quality human-written text is finite, limiting pure data-scaling. In response, labs lean on synthetic (model-generated) data, more aggressive data curation and filtering, and spending more compute at inference time (letting the model reason longer) rather than relying only on bigger pretraining runs.',
      plain:
        'The data wall is the problem that the world only has so much good human-written text, and models are running out of fresh reading material. Labs respond by generating their own practice text, filtering harder for the best stuff, and letting models think longer at answer time instead of just training bigger.',
      difficulty: 'advanced',
    },
    {
      id: 'pretraining-12',
      categoryKey: 'pretraining',
      category: 'Pretraining & Scaling',
      subtopic: 'Base models',
      question:
        "What is a 'base model,' and why does it behave differently from the assistant a user chats with?",
      answer:
        'A base model is the raw output of pretraining: a powerful next-token predictor with broad knowledge but no instruction-following or chat behavior. Asked a question, it might just continue the text (even with more questions) because it learned to imitate internet documents, not to be helpful. Assistant behavior is added later in post-training.',
      plain:
        'A base model is the raw, knowledgeable but unmannered version fresh out of training: ask it a question and it might just rattle off more questions because it only learned to mimic web text, not to be helpful. The polite, do-what-I-ask chatbot personality gets added in a later step.',
      difficulty: 'core',
    },
    {
      id: 'pretraining-13',
      categoryKey: 'pretraining',
      category: 'Pretraining & Scaling',
      subtopic: 'Base models',
      question:
        "In terms of pretraining versus post-training, where does a model's knowledge come from versus its helpful, instruction-following behavior?",
      answer:
        'Knowledge and core capability come from pretraining (the next-token prediction stage over massive text). The helpful, obedient, safer assistant behavior comes from post-training (instruction tuning plus reinforcement learning from human or AI feedback). Pretraining builds the engine and installs the knowledge; post-training teaches manners and how to take orders.',
      plain:
        'Pretraining is like school, where the model soaks up all the knowledge; post-training is like job training, where it learns manners and how to follow instructions. The smarts come from the first stage, the helpfulness and politeness from the second.',
      difficulty: 'core',
    },
    {
      id: 'pretraining-14',
      categoryKey: 'pretraining',
      category: 'Pretraining & Scaling',
      subtopic: 'Knowledge cutoff',
      question: "What is a model's 'knowledge cutoff,' and why can a model not know about events after it?",
      answer:
        "The knowledge cutoff is the point in time after which the model's training data ends. Because the model's knowledge is baked into its weights during pretraining, it cannot know about events, releases, or facts that occurred after that date unless they are supplied in the prompt or fetched by a tool at runtime.",
      plain:
        'A model\'s facts are frozen at the moment its training data was collected, like a textbook printed on a certain date. Ask it about something that happened after that printing and it simply was not in the book, so it has to guess or lean on whatever you give it in the conversation.',
      difficulty: 'core',
    },
    {
      id: 'pretraining-15',
      categoryKey: 'pretraining',
      category: 'Pretraining & Scaling',
      subtopic: 'Data quality',
      question: 'How does the quality of the training corpus affect the resulting model?',
      answer:
        'Strongly. The model learns the patterns, biases, errors, and style of whatever text it reads, so low-quality or skewed data produces a weaker, more biased model (garbage in, garbage out). This is why labs invest heavily in filtering, deduplicating, and curating the corpus rather than just maximizing raw volume.',
      plain:
        'A model is shaped by its reading list, so feeding it junk gives you a junk model and feeding it clean, well-chosen text gives a sharper one. That is why teams spend so much effort cleaning and curating the data instead of just grabbing as much text as possible.',
      difficulty: 'core',
    },
    {
      id: 'pretraining-16',
      categoryKey: 'pretraining',
      category: 'Pretraining & Scaling',
      subtopic: 'Tokens of training',
      question: "When a lab says a model was 'trained on 15 trillion tokens,' what does that number describe?",
      answer:
        'It is the total amount of text the model processed during pretraining, counted in tokens (word or sub-word pieces). It measures the volume of training data the model learned from, not the model\'s parameter size and not its context window. More training tokens generally means more exposure, which the Chinchilla result tied to good quality at a given model size.',
      plain:
        'It is how much reading the model did, measured in word-chunks, often trillions of them. It is about how much the model studied, which is different from how big its brain is (parameters) or how much it can hold in mind at once (context window).',
      difficulty: 'intermediate',
    },
    {
      id: 'pretraining-17',
      categoryKey: 'pretraining',
      category: 'Pretraining & Scaling',
      subtopic: 'Gradient descent',
      question: 'In plain terms, how does the model actually improve during pretraining, given its prediction errors?',
      answer:
        'It uses gradient descent. After each batch of predictions, the training process estimates how each weight contributed to the error and nudges every weight a tiny amount in the direction that would have reduced that error. Repeated over trillions of tokens, these tiny adjustments accumulate into a capable model.',
      plain:
        'Imagine adjusting millions of tiny knobs: after each guess, the system works out which way to turn each knob to be a little less wrong, then nudges them all slightly. No single nudge matters, but trillions of them add up to a model that predicts text well. That nudging process is gradient descent.',
      difficulty: 'core',
    },
    {
      id: 'pretraining-18',
      categoryKey: 'pretraining',
      category: 'Pretraining & Scaling',
      subtopic: 'Data contamination',
      question: 'What is data contamination, and why does it make benchmark scores misleading?',
      answer:
        'Data contamination is when test or benchmark questions accidentally appear in the training data. The model can then score well by having effectively memorized the answers rather than by genuinely solving the task, so the benchmark overstates its true ability. It is a major reason to be skeptical of headline benchmark numbers.',
      plain:
        'It is like a student who saw the exact exam questions beforehand: their high score does not prove understanding, just that they memorized the answer key. If test questions leaked into the training text, a model\'s benchmark score can look better than its real skill.',
      difficulty: 'intermediate',
    },
    {
      id: 'pretraining-19',
      categoryKey: 'pretraining',
      category: 'Pretraining & Scaling',
      subtopic: 'Cost of a training run',
      question: 'Why is a single pretraining run so expensive, and how does that cost compare to using the finished model?',
      answer:
        'Pretraining pushes trillions of tokens through a huge model, which requires thousands of specialized chips running for weeks, costing millions of dollars in compute and energy. It is a large one-time (or occasional) cost. Using the finished model afterward (inference) is far cheaper per request, which is why the heavy cost is paid up front.',
      plain:
        'Training is like building a factory: it takes enormous money, machines, and time once. After that, answering each question is like running one item down the assembly line, which is cheap by comparison. That is why the giant bill is paid up front, then spread across millions of later uses.',
      difficulty: 'core',
    },
    {
      id: 'pretraining-20',
      categoryKey: 'pretraining',
      category: 'Pretraining & Scaling',
      subtopic: 'Bigger is not always better',
      question: 'Common misconception: is the model with the most parameters always the best one?',
      answer:
        'No. Beyond a point, a bigger model trained on too little or low-quality data underperforms a smaller model trained on more, well-curated data (the Chinchilla insight). Scaling also has diminishing returns and a higher serving cost. The best model balances size, data quantity and quality, and compute, not raw parameter count.',
      plain:
        'A bigger brain does not automatically mean smarter. A medium model that read a lot of good material can beat a giant one that read too little, and the giant also costs more to run. What matters is the balance of size, amount and quality of reading, and compute, not just the headline parameter number.',
      difficulty: 'intermediate',
    },
    {
      id: 'pretraining-21',
      categoryKey: 'pretraining',
      category: 'Pretraining & Scaling',
      subtopic: 'Blind spots',
      question: "How do a model's pretraining data choices create its blind spots?",
      answer:
        'A model is strong on topics, languages, and styles that were well represented in its training text and weak where coverage was thin, such as low-resource languages, very niche or proprietary domains, and anything after the knowledge cutoff. Its strengths and gaps largely mirror the distribution of what it read.',
      plain:
        'A model is sharpest on whatever showed up a lot in its training reading and shakiest on what was rare, like a language with little text online or a niche specialty. Its blind spots are basically the topics the internet underrepresented, plus anything too recent to have been included.',
      difficulty: 'core',
    },
  ],
};

export default mod;
