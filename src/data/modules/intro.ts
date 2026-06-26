// What LLMs Are: A Short History (tier 1). A new, video-free orientation module
// that gives every later module a shared starting point: what a large language
// model is, how we got here, and what it is not.
import type { Category } from '../../types';

const mod: Category = {
  key: 'intro',
  name: 'What LLMs Are: A Short History',
  tier: 1,
  summary:
    'A plain-English orientation to large language models: what they are, what they are not, and how the field moved from hand-written rules and word-counting statistics to the 2017 transformer and today\'s instruction-tuned chat assistants. The goal is a shared mental model that every later module can build on.',
  learningObjectives: [
    'By the end you can explain in plain terms what a large language model is and what next-token prediction means',
    'By the end you can place key milestones (rule-based systems, statistical NLP, the 2017 transformer, instruction-tuned chat models) on a rough timeline',
    'By the end you can distinguish a language model from a chatbot, a search engine, and a database',
    'By the end you can describe why scale in data, parameters, and compute changed what these systems could do',
    'By the end you can name common myths about LLMs and explain why they are wrong',
  ],
  breakdown: [
    {
      heading: 'What a large language model is',
      explanation:
        'A large language model is a computer program trained on an enormous amount of text to predict what text comes next. By working through trillions of words during training, it adjusts billions of internal values until it is very good at guessing the next piece of text in any passage. That single skill, applied over and over, is what lets it draft emails, answer questions, summarize documents, translate, and write code. The word "large" is doing real work: it points to the huge training data, the billions of learned values called parameters, and the massive computing effort that together separate a modern model from the smaller, narrower language models that came before.',
      keyTerms: [
        {
          term: 'Large language model (LLM)',
          definition:
            'A program trained on vast amounts of text to predict and generate language, able to write, answer, summarize, translate, and code by repeatedly guessing the next piece of text.',
        },
        {
          term: 'Parameter',
          definition:
            'One of the billions of internal numerical values a model learns during training. Collectively the parameters store everything the model picked up from its data.',
        },
        {
          term: 'Training data',
          definition:
            'The large body of text a model learns from. The model does not keep copies of it, but absorbs its patterns into the parameters.',
        },
      ],
    },
    {
      heading: 'Next-token prediction: the one thing it does',
      explanation:
        'Underneath every impressive output is a single, simple operation: given the text so far, predict the most likely next token, where a token is a word or fragment of a word. The model does not plan a whole reply in advance. It produces one token, adds it to the running text, then looks at the now-slightly-longer text and predicts again. This loop is called autoregression, and it is how a one-token-at-a-time process produces paragraphs that stay on topic, because each new guess can see everything generated so far. It also explains a lot of model behavior: the model is optimizing for a plausible continuation, not for verified truth, so it can write something fluent and wrong with equal ease.',
      keyTerms: [
        {
          term: 'Token',
          definition:
            'The unit a model reads and writes, usually a common word or a word fragment. Models work in tokens, not letters or whole words.',
        },
        {
          term: 'Next-token prediction',
          definition:
            'The model\'s core task: given the text so far, output a probability for what the next token should be, then pick from it.',
        },
        {
          term: 'Autoregression',
          definition:
            'Generating text by predicting one token, appending it, and feeding the result back in to predict the next, repeated until the reply is complete.',
        },
      ],
    },
    {
      heading: 'A short history: rules, statistics, transformers, chat',
      explanation:
        'The path to today runs through four broad eras. First came hand-written rule systems: programs like ELIZA in the 1960s that followed if-this-then-say-that scripts a person wrote by hand, which were brittle because no one could anticipate every case. Next came statistical language models, such as n-gram models, which learned from data by counting how often short word sequences appear, a real advance held back by a very short memory. The breakthrough was the transformer architecture, introduced in 2017 in the paper "Attention Is All You Need," which let a model relate every word to every other word at once and train efficiently on massive text. Finally, around the end of 2022, models were tuned to follow instructions and chat, then wrapped in a simple interface, and that combination is what brought LLMs to a mass audience.',
      keyTerms: [
        {
          term: 'Rule-based system',
          definition:
            'An early approach where humans hand-wrote explicit rules for how the program should respond. Brittle, since it only handled cases its authors foresaw.',
        },
        {
          term: 'N-gram model',
          definition:
            'A statistical language model that predicts the next word from counts of short word sequences. An early way to learn language from data, limited by its short context.',
        },
        {
          term: 'Transformer',
          definition:
            'The 2017 neural-network architecture, based on attention, that underlies essentially every modern LLM. It relates all words in a passage in parallel.',
        },
        {
          term: 'Instruction tuning',
          definition:
            'Extra training that teaches a base model to follow instructions and converse helpfully. A key step in turning a raw model into a usable chat assistant.',
        },
      ],
    },
    {
      heading: 'What it is not, and what to watch for',
      explanation:
        'A common source of confusion is treating a language model as if it were three other tools it resembles. It is not a chatbot: the model is the engine, while a chat assistant is the whole product built around it, including the interface, hidden instructions, memory of the session, and safety filters. It is not a search engine: by default it generates text from learned patterns rather than looking up and linking real documents. And it is not a database: it has no table of exact records, so it reconstructs likely-sounding information instead of retrieving a stored copy. Two practical cautions follow. The model only knows what was in its training data up to a fixed training cutoff, so it is not inherently up to date, and because it optimizes for plausible text it can produce confident falsehoods, known as hallucinations.',
      keyTerms: [
        {
          term: 'Model versus chatbot',
          definition:
            'The model is the text-predicting engine. A chatbot is the product around it: interface, system prompt, session memory, tools, and safety layers.',
        },
        {
          term: 'Training cutoff',
          definition:
            'The fixed date after which the model has no knowledge, because its training data ends there. Live information requires an added tool like web search.',
        },
        {
          term: 'Hallucination',
          definition:
            'A confident, fluent statement that is false. It happens because the model aims for plausible text and has no built-in check against a source of truth.',
        },
      ],
    },
  ],
  cards: [
    {
      id: 'intro-0',
      categoryKey: 'intro',
      category: 'What LLMs Are: A Short History',
      subtopic: 'What an LLM is',
      question: 'In plain terms, what is a large language model?',
      answer:
        'It is a computer program trained on an enormous amount of text to predict what text comes next. By learning the statistical patterns of language, it can generate fluent writing, answer questions, summarize, translate, and write code, all by repeatedly guessing the next piece of text. "Large" refers to the huge training data and the billions of internal values (parameters) it learns.',
      plain:
        'Picture the world\'s most well-read autocomplete. It studied a giant slice of books and the internet and got very good at guessing what comes next. String enough of those guesses together and you get essays, answers, and working code.',
      difficulty: 'core',
    },
    {
      id: 'intro-1',
      categoryKey: 'intro',
      category: 'What LLMs Are: A Short History',
      subtopic: 'Next-token prediction',
      question: 'What does "next-token prediction" mean, and why is it the core of how an LLM works?',
      answer:
        'The model\'s one fundamental job is, given the text so far, to predict the most likely next token (a word or word fragment). It does not plan a whole answer in advance. It produces one token, adds it to the text, and predicts again. Answering, summarizing, and coding are all this single guess-the-next-piece operation repeated many times.',
      plain:
        'It works like finishing the sentence "The capital of France is ___." It fills one blank, treats its own answer as the new prompt, and fills the next blank, again and again, until the reply is done.',
      difficulty: 'core',
    },
    {
      id: 'intro-2',
      categoryKey: 'intro',
      category: 'What LLMs Are: A Short History',
      subtopic: 'Model vs chatbot',
      question: 'What is the difference between a language model and a chatbot like a chat assistant?',
      answer:
        'The language model is the underlying engine that predicts text. A chatbot is a product built around that engine: it adds a chat interface, a hidden system prompt that shapes behavior, memory within the session, safety filters, and sometimes tools like web search. The same model can power many different chatbots, so a chatbot is more than the raw model.',
      plain:
        'The model is the engine and the chatbot is the whole car built around it: dashboard, seatbelts, GPS. You talk to the car, but the engine does the core work, and the same engine could go into a very different car.',
      difficulty: 'core',
    },
    {
      id: 'intro-3',
      categoryKey: 'intro',
      category: 'What LLMs Are: A Short History',
      subtopic: 'Model vs search',
      question: 'Why is a language model not the same as a search engine?',
      answer:
        'A search engine finds and ranks existing documents and points you to them with links you can verify. A language model does not look anything up by default. It generates new text from patterns learned in training, so it has no live web index, can be out of date, and may state things that sound right but are not. Some products bolt search onto a model, but the model itself is a generator, not a lookup tool.',
      plain:
        'A search engine is a librarian who hands you the actual book and the page. A bare language model is a knowledgeable friend recalling things from memory: often right, but with no source to point at and no guarantee the memory is accurate.',
      difficulty: 'core',
    },
    {
      id: 'intro-4',
      categoryKey: 'intro',
      category: 'What LLMs Are: A Short History',
      subtopic: 'Model vs database',
      question: 'Does a language model store and look up facts the way a database does?',
      answer:
        'No. A database stores exact records and retrieves them precisely. A language model has no table of facts inside it. What it learned is blended into its parameters as statistical patterns, so it reconstructs likely-sounding information rather than retrieving a stored copy. That is why it handles common facts well but can get specific details wrong or invent them.',
      plain:
        'A database is a filing cabinet: ask for record 4471 and you get exactly that record. A model is more like a person who absorbed a million documents and now paraphrases from a blurry memory. Great for the gist, shaky on an exact figure or quote.',
      difficulty: 'core',
    },
    {
      id: 'intro-5',
      categoryKey: 'intro',
      category: 'What LLMs Are: A Short History',
      subtopic: 'Why scale mattered',
      question: 'In "large language model," what does "large" actually refer to?',
      answer:
        'It refers to scale along three axes at once: the amount of training data (trillions of words), the number of parameters (the model\'s learned internal values, often billions), and the amount of computing power used to train it. Growing all three together is what separates a modern LLM from earlier, smaller language models.',
      plain:
        'Large means three things got huge together: how much it read, how many internal dials it has to capture what it read, and how much computer time went into training. Bigger on all three is roughly what turned a clever toy into something genuinely useful.',
      difficulty: 'core',
    },
    {
      id: 'intro-6',
      categoryKey: 'intro',
      category: 'What LLMs Are: A Short History',
      subtopic: 'Good and bad at',
      question: 'What tasks are LLMs reliably good at, and what are they unreliable at?',
      answer:
        'They are strong at fluent language work: drafting, rewriting, summarizing, translating, explaining, brainstorming, and writing code. They are unreliable at exact arithmetic, precise recall of obscure facts, anything needing up-to-the-minute information, and tasks where being confidently wrong is costly. They produce plausible text, which is not the same as verified truth.',
      plain:
        'Treat it like a brilliant, fast intern: wonderful for first drafts, explanations, and translations, but you double-check its math, its sources, and any fact that really matters. Fluent does not mean infallible.',
      difficulty: 'core',
    },
    {
      id: 'intro-7',
      categoryKey: 'intro',
      category: 'What LLMs Are: A Short History',
      subtopic: 'Common misconceptions',
      question: 'Common misconception: does a language model "understand" or "know" that its answer is correct?',
      answer:
        'Not in the human sense. It has no awareness of truth and no internal step that checks an answer for correctness. It generates the text that is statistically most plausible given your prompt. It can sound completely confident while being wrong, because confidence in its wording is unrelated to whether the content is accurate.',
      plain:
        'It is not quietly comparing its answer to reality before speaking. It says what sounds right, the way a smooth talker can be certain and mistaken at the same time. A confident tone tells you nothing about whether it is correct.',
      difficulty: 'core',
    },
    {
      id: 'intro-8',
      categoryKey: 'intro',
      category: 'What LLMs Are: A Short History',
      subtopic: '2017 transformer turning point',
      question: 'What happened in 2017 that is considered the turning point for modern LLMs?',
      answer:
        'Researchers introduced the transformer architecture in the paper "Attention Is All You Need." Its attention mechanism let a model process all the words in a passage in parallel and directly relate distant words to each other, which made training on huge datasets practical. Nearly every major LLM since has been built on the transformer.',
      plain:
        '2017 is when the key engine design, the transformer, was published. It let models read a whole passage at once and connect far-apart words easily, which made training on enormous amounts of text possible. Almost every model you have heard of since runs on that design.',
      difficulty: 'core',
    },
    {
      id: 'intro-9',
      categoryKey: 'intro',
      category: 'What LLMs Are: A Short History',
      subtopic: 'Next-token prediction',
      question: 'If a model only predicts one token at a time, how does it produce a long, coherent answer?',
      answer:
        'It runs a loop called autoregression. It predicts one token, appends it to the running text, then feeds that longer text back in to predict the next token, and repeats. Because each new prediction sees everything generated so far, the output stays coherent across sentences even though it was built one piece at a time.',
      plain:
        'Imagine writing a story where after every word you reread the whole thing so far before choosing the next word. Each choice is shaped by everything already written, so the result hangs together despite being made one step at a time.',
      difficulty: 'intermediate',
    },
    {
      id: 'intro-10',
      categoryKey: 'intro',
      category: 'What LLMs Are: A Short History',
      subtopic: 'Pre-transformer rules',
      question: 'Before machine learning, how did early chatbots like ELIZA work, and what was their main limitation?',
      answer:
        'They ran on hand-written rules: patterns a programmer specified in advance, such as "if the user says X, reply with Y." ELIZA in the 1960s used simple pattern-matching to imitate a therapist. The limitation was that humans had to anticipate and encode every case by hand, so the systems were brittle and could not generalize to anything their authors had not foreseen.',
      plain:
        'Early chatbots were basically long lists of if-this-then-say-that rules written by a person. Clever for their time, but they only knew the script. Step outside what the author imagined and they fell apart, because no rule existed for it.',
      difficulty: 'intermediate',
    },
    {
      id: 'intro-11',
      categoryKey: 'intro',
      category: 'What LLMs Are: A Short History',
      subtopic: 'Pre-transformer statistics',
      question: 'What were statistical language models (like n-gram models) doing before deep learning, and why were they limited?',
      answer:
        'They predicted the next word from counts of how often short word sequences appeared in text. An n-gram model looks only at the last few words to guess the next one. This was a genuine step toward learning language from data rather than rules, but the tiny window of context meant they could not track meaning across a long sentence, so output drifted into nonsense quickly.',
      plain:
        'These models guessed the next word by counting which words usually follow the previous two or three. Useful, but with such a short memory they lost the thread fast, like trying to follow a movie while only ever remembering the last three seconds.',
      difficulty: 'intermediate',
    },
    {
      id: 'intro-12',
      categoryKey: 'intro',
      category: 'What LLMs Are: A Short History',
      subtopic: 'History timeline',
      question: 'Put these four milestones in rough chronological order: instruction-tuned chat assistants, hand-written rule systems, the transformer architecture, statistical (n-gram) language models.',
      answer:
        'Hand-written rule systems came first (mid-1900s, for example ELIZA in the 1960s), then statistical n-gram models (late 1900s into the 2000s), then the transformer architecture (2017), then widely used instruction-tuned chat assistants (around 2022). The arc runs from hand-coded rules, to learning from word counts, to learning deep patterns at scale, to models tuned to follow instructions.',
      plain:
        'Rules first, then counting, then the transformer, then chat. Decades of hand-written rules gave way to models that learned from text statistics, which gave way to the 2017 transformer, which a few years later became the chat assistants people use today.',
      difficulty: 'intermediate',
    },
    {
      id: 'intro-13',
      categoryKey: 'intro',
      category: 'What LLMs Are: A Short History',
      subtopic: '2017 transformer turning point',
      question: 'Why did the transformer outperform the earlier sequence models (RNNs and LSTMs) it replaced?',
      answer:
        'Earlier models read text strictly one word at a time, carrying a running memory that tended to fade over long passages and could not be trained in parallel. The transformer\'s attention lets every word look directly at every other word in one step, so it captures long-range connections better and trains on many positions at once, which made learning from massive datasets far faster and more effective.',
      plain:
        'Older models read like a message whispered down a long line, with details lost along the way and no way to speed it up. The transformer lets every word talk to every other word at once, so nothing far away gets forgotten and the whole thing trains much faster.',
      difficulty: 'intermediate',
    },
    {
      id: 'intro-14',
      categoryKey: 'intro',
      category: 'What LLMs Are: A Short History',
      subtopic: 'The chat era',
      question: 'Large language models existed before late 2022, so what changed to make them suddenly mainstream?',
      answer:
        'Two things. The models were trained further to follow instructions and hold a conversation, using human-rated examples (instruction tuning and learning from human feedback), and they were wrapped in a free, simple chat interface. The raw model was not the only leap. Making it helpful and easy to talk to is what drove mass adoption around the end of 2022.',
      plain:
        'The raw ability had been building for years. What flipped it mainstream was teaching the model to actually follow requests and chat politely, then putting it behind a simple chat box anyone could try. Usable plus easy beat merely powerful.',
      difficulty: 'intermediate',
    },
    {
      id: 'intro-15',
      categoryKey: 'intro',
      category: 'What LLMs Are: A Short History',
      subtopic: 'Why scale mattered',
      question: 'Why did making these models bigger change what they could do, not just how well they did it?',
      answer:
        'As data, parameters, and compute grew together, models did not only get incrementally better at known tasks. New capabilities appeared that smaller models essentially could not do at all, such as multi-step reasoning, following novel instructions, and basic coding. These are often called emergent abilities, and they are a big reason scale became the central strategy.',
      plain:
        'Past a certain size the models did not just improve a little, they picked up whole new tricks smaller versions could not do, like working through a multi-step problem. Growing them unlocked new skills, not only sharper versions of old ones.',
      difficulty: 'intermediate',
    },
    {
      id: 'intro-16',
      categoryKey: 'intro',
      category: 'What LLMs Are: A Short History',
      subtopic: 'Common misconceptions',
      question: 'Common misconception: is a language model connected to the internet and always up to date?',
      answer:
        'By default, no. A base model only knows what was in its training data, which stops at a fixed point called the training cutoff, so it has no awareness of events after that date. Some chat products add live web search or other tools, but that is a feature layered on top. The model itself is a snapshot frozen at training time.',
      plain:
        'Out of the box the model is like an encyclopedia printed on a certain date: it knows nothing that happened after the presses ran. Some apps add live web access, but the underlying model is frozen in time unless given a tool to look things up.',
      difficulty: 'intermediate',
    },
    {
      id: 'intro-17',
      categoryKey: 'intro',
      category: 'What LLMs Are: A Short History',
      subtopic: 'Why scale mattered',
      question: 'What are "scaling laws," and why did they shape the strategy of building ever-larger models?',
      answer:
        'Scaling laws are the empirical finding that a model\'s performance improves in a smooth, predictable way as you increase training data, parameters, and compute together. Because the gains were measurable and consistent rather than random, labs could forecast that adding more resources would reliably yield a stronger model, which justified the enormous investment in scaling.',
      plain:
        'Researchers found that bigger reliably meant better, and in a smooth, chartable way rather than a lucky guess. Once you can predict that ten times the resources buys a known jump in quality, spending huge sums on scale stops being a gamble and starts looking like a recipe.',
      difficulty: 'advanced',
    },
    {
      id: 'intro-18',
      categoryKey: 'intro',
      category: 'What LLMs Are: A Short History',
      subtopic: 'Common misconceptions',
      question: 'Why does a language model sometimes state false information with total confidence (a "hallucination")?',
      answer:
        'Its objective is to produce the most plausible continuation of the text, not to verify facts. When it lacks the right information it still generates fluent, confident-sounding text, because that is what it was trained to do. There is no built-in step that checks claims against a source, so a smooth wrong answer and a smooth right answer are produced the same way.',
      plain:
        'The model is rewarded for sounding right, not for being right. When it does not actually know, it does not stop. It fills the gap with something that fits the pattern, delivered just as confidently as a true answer. The fluency is identical either way.',
      difficulty: 'advanced',
    },
    {
      id: 'intro-19',
      categoryKey: 'intro',
      category: 'What LLMs Are: A Short History',
      subtopic: 'Next-token prediction',
      question: 'How can a goal as simple as "predict the next token" lead to abilities like reasoning, translation, and coding?',
      answer:
        'To predict the next token well across a huge variety of text, the model is forced to internalize a great deal: grammar, facts, styles, logical structure, and rough world knowledge, because all of those help it guess correctly. Predicting the next word in a proof, a translation, or a program means partly modeling how those things actually work. So the simple objective indirectly pushes the model to learn rich, general patterns.',
      plain:
        'To reliably finish any sentence in any document, you secretly have to learn how the world tends to work: grammar, facts, cause and effect, even logic. Getting truly good at "guess the next word" across everything people wrote forces those deeper patterns in as a side effect.',
      difficulty: 'advanced',
    },
  ],
};

export default mod;
