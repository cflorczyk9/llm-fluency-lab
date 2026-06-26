// Tokenization & Embeddings (tier 1). Deepened module: the original 14 cards are carried
// over verbatim from the legacy deck, followed by additional cards.
import type { Category } from '../../types';

const mod: Category = {
  "key": "tokenization",
  "name": "Tokenization & Embeddings",
  "tier": 1,
  "summary": "Every model interaction starts with text being chopped into tokens and turned into vectors, so this is the layer that sits between the words you type and everything the model actually computes. Mastering it explains why you are billed per token (not per word), why models stumble on spelling and arithmetic, why a non-English prompt can cost 2-3x more, and what \"semantic search\" or RAG retrieval is really comparing under the hood.",
  "learningObjectives": [
    "By the end you can explain why models use subword tokens instead of whole words or single characters",
    "By the end you can estimate token counts and connect them to cost and context limits",
    "By the end you can describe how byte-pair encoding builds a vocabulary and why it is frozen at runtime",
    "By the end you can explain how token IDs become embedding vectors and what the embedding dimension controls",
    "By the end you can use cosine similarity and embedding space to explain semantic search and RAG retrieval",
    "By the end you can predict tokenization-driven failures like letter counting, arithmetic, and non-English cost"
  ],
  "breakdown": [
    {
      "heading": "Why tokens, not words or characters",
      "explanation": "A model needs a fixed-size dictionary of input units, and neither whole words nor single characters work well. There are too many possible words (millions, plus typos, names, and code) to give each its own slot, and the model would have no way to handle a word it never saw in training. Single characters go the other way: the vocabulary is tiny, but a sentence becomes a very long sequence, which is slow and forces the model to relearn spelling from scratch every time. Tokens are the middle ground: common words become one token, rare words get split into a few subword pieces, and absolutely any string can be represented because the smallest pieces are individual bytes. This is why 'the' is one token but 'antidisestablishmentarianism' is several, and why token count, not word count, is what you pay for and what fills the context window.",
      "keyTerms": [
        {
          "term": "Token",
          "definition": "The atomic unit a language model reads and writes: usually a common word, a word fragment, or a punctuation mark. Roughly 0.75 words per token in English, or about 4 characters."
        },
        {
          "term": "Subword unit",
          "definition": "A token that is a piece of a word (like 'ing' or 'pre'), letting the model represent rare or unseen words by combining a few known pieces instead of needing every full word in its vocabulary."
        },
        {
          "term": "Vocabulary",
          "definition": "The fixed set of all tokens a model knows, typically 50,000 to 200,000+ entries for modern models. Each token maps to one integer ID."
        }
      ]
    },
    {
      "heading": "How byte-pair encoding builds the vocabulary",
      "explanation": "Byte-pair encoding (BPE) is the most common recipe for deciding what the tokens are, and it is learned from data, not hand-written. You start with the rawest units (individual bytes or characters), then scan a giant text corpus and repeatedly find the most frequent adjacent pair and merge it into a new single token. Merge 't' + 'h' into 'th' because it is everywhere, then 'th' + 'e' into 'the', and so on, thousands of times, until you hit your target vocabulary size. The result is that frequent strings collapse into single tokens while rare strings stay split into smaller pieces. Crucially, the tokenizer is frozen after this training step: at runtime it just applies the learned merge rules greedily to your input, it does not learn anything new. Starting from bytes (byte-level BPE) guarantees that emoji, accented letters, and any Unicode at all can always be encoded, with no 'unknown token' fallback.",
      "keyTerms": [
        {
          "term": "Byte-pair encoding (BPE)",
          "definition": "An algorithm that builds a vocabulary by starting from characters/bytes and iteratively merging the most frequent adjacent pair into a new token until a target vocab size is reached."
        },
        {
          "term": "Merge rule",
          "definition": "A learned instruction like 'whenever you see token A next to token B, combine them into token AB.' The ordered list of these rules IS the trained tokenizer."
        },
        {
          "term": "Byte-level BPE",
          "definition": "A BPE variant whose base units are the 256 raw bytes rather than characters, so any possible Unicode string can always be tokenized with no out-of-vocabulary failures."
        }
      ]
    },
    {
      "heading": "From token IDs to embedding vectors",
      "explanation": "A token ID is just an integer (token 1037 means nothing numerically), so the first thing inside the model is an embedding table: a big lookup matrix with one learnable row per vocabulary entry, where each row is a vector of a few thousand numbers. Tokenizing turns text into IDs, and the embedding lookup turns each ID into its vector, which is the actual input to the neural network. These vectors are not assigned by hand; they are learned during pretraining so that tokens used in similar ways end up with similar vectors. The width of these vectors (the embedding dimension, e.g. 4096) is a core size knob of the model. One subtlety: the vector that comes straight out of the lookup table is 'static' (the same every time for a given token), while the rich, meaning-aware vectors people usually mean by 'embeddings' are the 'contextual' ones the model produces after attention has let each token look at its neighbors.",
      "keyTerms": [
        {
          "term": "Embedding table",
          "definition": "A learned matrix with one row per token in the vocabulary; looking up a token ID returns that token's vector, the real numeric input to the network."
        },
        {
          "term": "Embedding dimension",
          "definition": "The length of each token vector (a few hundred to several thousand numbers). Larger dimension means more capacity to encode meaning but more compute and memory."
        },
        {
          "term": "Contextual embedding",
          "definition": "A token's vector after the model's attention layers have mixed in surrounding context, so 'bank' near 'river' differs from 'bank' near 'money.' Contrast with the fixed lookup-table (static) vector."
        }
      ]
    },
    {
      "heading": "Embedding space and semantic distance",
      "explanation": "Once text is vectors, 'meaning' becomes geometry: each token or chunk of text is a point in a high-dimensional space, and things that mean similar things sit close together. Closeness is almost always measured by the angle between vectors (cosine similarity) rather than straight-line distance, because direction encodes meaning while raw length often just reflects how common or long the text is. This geometry is what powers semantic search and RAG retrieval: you embed the user's question, embed all your documents ahead of time, and fetch the chunks whose vectors point in the most similar direction, which catches matches by meaning even when no exact words overlap. Two important nuances: the famous 'king minus man plus woman equals queen' arithmetic worked on older standalone word vectors and is only loosely true; and for retrieval people use dedicated embedding models that produce one vector per sentence or passage, which is a different job from the per-token embeddings inside a generative model.",
      "keyTerms": [
        {
          "term": "Embedding space",
          "definition": "The high-dimensional space where every piece of text lives as a point/vector, arranged so that semantic similarity corresponds to geometric closeness."
        },
        {
          "term": "Cosine similarity",
          "definition": "A similarity score based on the angle between two vectors (1 = same direction, 0 = unrelated, -1 = opposite). The standard way to measure semantic distance because it ignores vector length."
        },
        {
          "term": "Semantic search",
          "definition": "Finding relevant text by comparing embedding vectors rather than matching keywords, so a query retrieves passages with similar meaning even when the exact words differ. The retrieval engine behind RAG."
        }
      ]
    },
    {
      "heading": "Practical consequences: cost, weaknesses, and languages",
      "explanation": "Tokenization quietly shapes a lot of model behavior you actually feel. Because the model sees tokens, not letters, it has a blurry view of spelling, which is why counting the r's in 'strawberry' or reversing a string is genuinely hard: the relevant characters are fused inside one opaque token. Arithmetic suffers for a related reason, since numbers can split into odd chunks (327 might be '3' + '27'). Cost and context limits are billed per token, so English is cheap (about 4 characters per token), while many other languages and scripts tokenize far less efficiently and can cost two to three times more for the same meaning, because the BPE vocabulary was trained mostly on English-heavy data. Whitespace and capitalization also matter: ' the' (with a leading space) and 'The' are often different tokens, so formatting changes can subtly change token counts and even outputs.",
      "keyTerms": [
        {
          "term": "Token efficiency",
          "definition": "How many characters of meaning fit into one token. High for English (~4 chars/token), much lower for many non-Latin scripts, directly affecting cost and how much fits in context."
        },
        {
          "term": "Character blindness",
          "definition": "The model's weakness at spelling, counting letters, and reversing text, caused by characters being hidden inside multi-character tokens the model cannot easily inspect."
        },
        {
          "term": "Leading-space token",
          "definition": "Many tokenizers attach the space before a word to the word itself, so ' cat' and 'cat' are distinct tokens. This is why spacing and capitalization can shift token counts."
        }
      ]
    }
  ],
  "video": {
    "url": "https://www.youtube.com/watch?v=wgfSDrqYMJ4",
    "title": "What are Word Embeddings?",
    "channel": "IBM Technology"
  },
  "cards": [
    {
      "id": "tokenization-0",
      "categoryKey": "tokenization",
      "category": "Tokenization & Embeddings",
      "subtopic": "Why tokens",
      "question": "Why do language models use tokens instead of just feeding in whole words?",
      "answer": "There are too many possible words (millions, plus typos, names, and code) to give each a fixed vocabulary slot, and whole-word vocabularies cannot handle words never seen in training. Tokens (often subword pieces) keep the vocabulary manageable while still being able to represent any string by combining smaller units.",
      "plain": "Think of the model's dictionary like a box of LEGO pieces: instead of needing a unique brick for every word that exists (impossible, there are too many), it keeps a smaller set of common words and word-chunks it can snap together to build anything, even a word it has never seen before.",
      "difficulty": "core"
    },
    {
      "id": "tokenization-1",
      "categoryKey": "tokenization",
      "category": "Tokenization & Embeddings",
      "subtopic": "Token sizing",
      "question": "Roughly how many words does one token correspond to in English, and how many characters?",
      "answer": "About 0.75 words per token, or roughly 4 characters per token, on average for English. So 100 tokens is approximately 75 words.",
      "plain": "A handy rule of thumb: one token is about three-quarters of a word, or roughly four letters. So if you see a 100-token limit, picture about 75 words of English.",
      "difficulty": "core"
    },
    {
      "id": "tokenization-2",
      "categoryKey": "tokenization",
      "category": "Tokenization & Embeddings",
      "subtopic": "Why tokens",
      "question": "What is the trade-off that makes single characters a bad choice as the model's input unit?",
      "answer": "Character-level vocabularies are tiny, but they make sequences very long (one unit per letter), which is slow and memory-heavy, and force the model to relearn spelling and word structure from scratch. Tokens balance vocabulary size against sequence length.",
      "plain": "Feeding the model one letter at a time is like reading a book by spelling out every word out loud: technically possible, but painfully slow and a waste of effort. Tokens let it read in convenient chunks instead, striking a balance between a small alphabet and short, fast-to-process input.",
      "difficulty": "intermediate"
    },
    {
      "id": "tokenization-3",
      "categoryKey": "tokenization",
      "category": "Tokenization & Embeddings",
      "subtopic": "Byte-pair encoding",
      "question": "Describe how byte-pair encoding (BPE) builds a vocabulary from a text corpus.",
      "answer": "Start with the smallest units (bytes or characters), scan the corpus to find the most frequent adjacent pair, merge that pair into a new single token, and repeat this thousands of times until you reach the target vocabulary size. Frequent strings collapse into single tokens; rare ones stay split.",
      "plain": "It is like inventing shorthand by watching what you write most: you notice 'th' shows up constantly so you make a single squiggle for it, then notice 'the' is everywhere and give that its own squiggle, repeating until your most common combos each have a quick symbol. Popular letter-combos become one token; rare ones stay spelled out.",
      "difficulty": "core"
    },
    {
      "id": "tokenization-4",
      "categoryKey": "tokenization",
      "category": "Tokenization & Embeddings",
      "subtopic": "Byte-pair encoding",
      "question": "Once a tokenizer is trained, does it keep learning new merges as it processes user input at runtime?",
      "answer": "No. The tokenizer is frozen after training. At runtime it just greedily applies its fixed, learned list of merge rules to encode the input. It does not learn or adapt to new text.",
      "plain": "No. Once the shorthand rules are written down, they are locked in like a printed dictionary. When you type something, it just looks up and applies the existing rules; it never invents new shorthand on the fly.",
      "difficulty": "intermediate"
    },
    {
      "id": "tokenization-5",
      "categoryKey": "tokenization",
      "category": "Tokenization & Embeddings",
      "subtopic": "Byte-pair encoding",
      "question": "What problem does byte-level BPE solve compared to character-level BPE?",
      "answer": "By using the 256 raw bytes as base units, byte-level BPE can encode literally any Unicode string (emoji, accents, unusual scripts) with no out-of-vocabulary or 'unknown token' failures, since every possible character decomposes into bytes it already knows.",
      "plain": "Computers ultimately store everything as a fixed set of 256 basic building blocks called bytes. By starting from those, the tokenizer can spell out anything you throw at it (emoji, accented letters, foreign alphabets) without ever hitting a 'sorry, I don't have a symbol for that' dead end.",
      "difficulty": "advanced"
    },
    {
      "id": "tokenization-6",
      "categoryKey": "tokenization",
      "category": "Tokenization & Embeddings",
      "subtopic": "Embeddings",
      "question": "After text is split into token IDs, what is the very first thing the model does with those integer IDs?",
      "answer": "It looks each ID up in an embedding table: a learned matrix with one vector (row) per vocabulary entry. The retrieved vectors are the actual numeric input to the neural network. The integer ID itself carries no numeric meaning.",
      "plain": "Each token first gets a number (just a name tag, like a coat-check ticket), and the model swaps that number for a long list of values that actually describe the token's meaning. That lookup, like exchanging a ticket for the coat it stands for, is the real first step inside the model.",
      "difficulty": "core"
    },
    {
      "id": "tokenization-7",
      "categoryKey": "tokenization",
      "category": "Tokenization & Embeddings",
      "subtopic": "Embeddings",
      "question": "What is the difference between a token's static (lookup-table) embedding and its contextual embedding?",
      "answer": "The static embedding is the fixed vector pulled straight from the embedding table, identical every time for a given token. The contextual embedding is that vector after the attention layers mix in surrounding words, so the same token ('bank') gets different vectors depending on its neighbors (river vs money).",
      "plain": "The static version is the dictionary entry for a word: always the same, regardless of how it is used. The contextual version is what the word actually means in this sentence, so 'bank' next to 'river' and 'bank' next to 'money' end up meaning different things once the model reads the surrounding words.",
      "difficulty": "advanced"
    },
    {
      "id": "tokenization-8",
      "categoryKey": "tokenization",
      "category": "Tokenization & Embeddings",
      "subtopic": "Embeddings",
      "question": "What does the embedding dimension control, and what is the cost of making it larger?",
      "answer": "It is the length of each token's vector (e.g. 4096 numbers). A larger dimension gives more capacity to encode meaning and nuance, but increases compute and memory usage throughout the model.",
      "plain": "It is how many descriptive values each token gets, like how many adjectives you allow to describe a person. More descriptors capture finer nuance, but they also make everything heavier and slower to process.",
      "difficulty": "intermediate"
    },
    {
      "id": "tokenization-9",
      "categoryKey": "tokenization",
      "category": "Tokenization & Embeddings",
      "subtopic": "Semantic distance",
      "question": "Why is cosine similarity (the angle between vectors) used to measure semantic distance rather than straight-line distance?",
      "answer": "Direction in embedding space encodes meaning, while a vector's raw length often just reflects incidental factors like word frequency or text length. Cosine similarity compares only direction, so it captures semantic relatedness without being skewed by magnitude.",
      "plain": "Picture each piece of text as an arrow; the direction it points captures its meaning, while how long the arrow is mostly reflects boring stuff like how common or wordy the text is. So you compare which way arrows point, not how long they are, to judge whether two things mean the same thing.",
      "difficulty": "intermediate"
    },
    {
      "id": "tokenization-10",
      "categoryKey": "tokenization",
      "category": "Tokenization & Embeddings",
      "subtopic": "Semantic search",
      "question": "How does embedding-based semantic search retrieve relevant documents, and why can it beat keyword matching?",
      "answer": "You embed every document chunk into vectors ahead of time, embed the query at search time, and return the chunks whose vectors are closest in direction (highest cosine similarity). Because it matches on meaning rather than exact words, it finds relevant passages even when no keywords overlap. This is the retrieval engine behind RAG.",
      "plain": "Instead of hunting for the exact words you typed, it converts your question and all your documents into 'meaning fingerprints' and returns the ones whose meaning is closest. That is why a search for 'how do I get my money back' can surface a 'refund policy' page even though none of those words match.",
      "difficulty": "intermediate"
    },
    {
      "id": "tokenization-11",
      "categoryKey": "tokenization",
      "category": "Tokenization & Embeddings",
      "subtopic": "Practical consequences",
      "question": "Why are tasks like counting the letters in 'strawberry' or reversing a string unusually hard for a language model?",
      "answer": "The model sees tokens, not individual characters, so the letters are fused inside opaque multi-character tokens it cannot easily inspect. This 'character blindness' is a direct side effect of tokenization, not a reasoning failure.",
      "plain": "The model reads in word-chunks, not letter by letter, so a word like 'strawberry' arrives as a sealed package it cannot peek inside. Asking it to count the r's is like asking someone to count items in a closed box, which is why it fumbles, not because it is bad at thinking.",
      "difficulty": "core"
    },
    {
      "id": "tokenization-12",
      "categoryKey": "tokenization",
      "category": "Tokenization & Embeddings",
      "subtopic": "Practical consequences",
      "question": "Why can a prompt in a non-English language cost two to three times more than the same meaning in English?",
      "answer": "BPE vocabularies are trained mostly on English-heavy data, so English packs about 4 characters per token while many other scripts fragment into far more tokens for the same content. Since billing and context limits are per token, lower token efficiency means higher cost.",
      "plain": "The model's shorthand was learned mostly from English, so English gets packed efficiently while other languages get chopped into many more small pieces for the same sentence. Since you pay per piece, the same message in another language can simply cost two or three times as much.",
      "difficulty": "intermediate"
    },
    {
      "id": "tokenization-13",
      "categoryKey": "tokenization",
      "category": "Tokenization & Embeddings",
      "subtopic": "Practical consequences",
      "question": "Why might ' the' (with a leading space) and 'the' be treated as two different tokens?",
      "answer": "Many tokenizers attach the preceding space to the word, so the space-prefixed version is a distinct token from the bare word. This is why spacing, capitalization, and formatting can change token counts and occasionally shift model outputs.",
      "plain": "The model often glues the space in front of a word onto the word itself, so 'the' at the start of a line and ' the' mid-sentence count as two separate items in its eyes. That is why little formatting changes like extra spaces or capital letters can quietly nudge token counts and even the answer.",
      "difficulty": "advanced"
    },
    {
      "id": "tokenization-14",
      "categoryKey": "tokenization",
      "category": "Tokenization & Embeddings",
      "subtopic": "Cost and context",
      "question": "A model advertises a 128,000-token context window. Roughly how many English words is that, and what has to share that space?",
      "answer": "About 96,000 words (128,000 times ~0.75). That single budget has to hold everything at once: your system instructions, the documents you paste in, the whole back-and-forth conversation so far, and the model's own reply. When the total exceeds the window, the oldest content is dropped or must be summarized.",
      "plain": "Picture a whiteboard that fits about 96,000 words. Your instructions, your pasted files, the entire chat history, and the answer all have to fit on that one board at the same time. Fill it up and the earliest notes get wiped to make room.",
      "difficulty": "core"
    },
    {
      "id": "tokenization-15",
      "categoryKey": "tokenization",
      "category": "Tokenization & Embeddings",
      "subtopic": "Counting tokens",
      "question": "How can you estimate how many tokens a prompt will use before sending it, and does the reply count too?",
      "answer": "For English, divide the character count by about 4, or the word count by about 0.75, as a quick estimate. For an exact count, run the text through the model's own tokenizer tool. Both directions are billed: the input (your prompt) and the output (the model's generated reply) each consume tokens, and output tokens are often priced higher.",
      "plain": "A fast guess: characters divided by four. For an exact number, paste the text into the model maker's token counter. And remember you pay both ways, like a phone call charged for what you say and what you hear, with the model's answer usually the pricier half.",
      "difficulty": "core"
    },
    {
      "id": "tokenization-16",
      "categoryKey": "tokenization",
      "category": "Tokenization & Embeddings",
      "subtopic": "Arithmetic weakness",
      "question": "Why does tokenization make exact arithmetic, like adding two long numbers, error-prone for a language model?",
      "answer": "Numbers do not split into clean digits. A number like 327 might become one token, or split as \"3\" and \"27\", and the chunking is inconsistent across numbers. The model never reliably sees the individual place-value digits it would need to add columns, so it pattern-matches a plausible answer rather than computing one.",
      "plain": "The model often reads \"327\" as a single lump, not as 3, 2, 7. Asking it to add numbers column by column is like asking someone to do long addition when the digits are glued together in random clumps. It guesses what looks right instead of actually carrying the ones.",
      "difficulty": "core"
    },
    {
      "id": "tokenization-17",
      "categoryKey": "tokenization",
      "category": "Tokenization & Embeddings",
      "subtopic": "Hidden tokens",
      "question": "Besides the words you type, what other tokens get fed into a chat model's input?",
      "answer": "Special control tokens are added that you never type: markers that label who is speaking (system, user, assistant), and an end-of-text token that signals where a turn or document stops. These structure the conversation for the model and also count toward your token usage.",
      "plain": "Behind the scenes the system staples little labels onto your message, like \"this part is from the user\" and \"the reply goes here\", plus a \"stop\" marker. You never see these tags, but they are real tokens that take up space and count on the bill.",
      "difficulty": "core"
    },
    {
      "id": "tokenization-18",
      "categoryKey": "tokenization",
      "category": "Tokenization & Embeddings",
      "subtopic": "Comparing tokenizers",
      "question": "Why can the exact same paragraph come out to different token counts on two different models?",
      "answer": "Each model family trains its own tokenizer with its own vocabulary size and merge rules, so they chop text differently. One model might encode a word as a single token while another splits it into three. This means token-based price comparisons are only fair when measured with each model's own tokenizer, not a single shared estimate.",
      "plain": "Every model has its own personal shorthand, learned separately. The same sentence might be 40 chunks in one model and 47 in another. So comparing two models purely on price-per-token can mislead you unless you count each one with its own ruler.",
      "difficulty": "intermediate"
    },
    {
      "id": "tokenization-19",
      "categoryKey": "tokenization",
      "category": "Tokenization & Embeddings",
      "subtopic": "Vocabulary size",
      "question": "What is the trade-off in choosing a larger tokenizer vocabulary (say 200,000 tokens instead of 50,000)?",
      "answer": "A bigger vocabulary packs more text into each token, so sequences are shorter and cheaper to process, and it usually tokenizes other languages more efficiently. The cost is a much larger embedding table and output layer (one row per token), which adds parameters and memory, and rare tokens get fewer training examples each.",
      "plain": "A bigger shorthand dictionary means fewer chunks per sentence, so things run faster and non-English text fits better. But the dictionary itself gets heavier to carry, and the rarely used entries get less practice during training. It is a space-versus-speed balancing act.",
      "difficulty": "intermediate"
    },
    {
      "id": "tokenization-20",
      "categoryKey": "tokenization",
      "category": "Tokenization & Embeddings",
      "subtopic": "Embedding models",
      "question": "How do the dedicated embedding models used for search differ from the per-token embeddings inside a chat model?",
      "answer": "A chat model produces one vector per token as an internal step toward generating text. A dedicated embedding model is a separate model whose whole job is to turn an entire sentence or passage into one fixed-length vector that captures its overall meaning, optimized so similar passages land close together. RAG and semantic search use the dedicated kind.",
      "plain": "Inside a chat model, every word gets its own meaning-vector as a stepping stone to writing the next word. A search embedding model is a different tool that boils a whole paragraph down to a single fingerprint. Search systems use that one-fingerprint-per-passage tool, not the chat model's internal per-word vectors.",
      "difficulty": "intermediate"
    },
    {
      "id": "tokenization-21",
      "categoryKey": "tokenization",
      "category": "Tokenization & Embeddings",
      "subtopic": "Embedding space",
      "question": "People say \"king minus man plus woman equals queen\" in embedding space. How true is that, and what does it illustrate?",
      "answer": "It is only loosely true, and it came from older standalone word-vector models (like word2vec), not from a modern LLM's contextual embeddings. It illustrates the real and useful idea that directions in embedding space can capture meaningful relationships (a roughly consistent \"gender\" or \"royalty\" direction), but the clean algebra is more of a memorable demo than a reliable equation.",
      "plain": "It is a catchy demo, not a precise law. It shows something genuine: meaning is laid out as directions in space, so \"moving toward royalty\" or \"toward female\" is a real direction you can sometimes follow. But do not expect the math to land exactly on the dot, especially in today's context-aware models.",
      "difficulty": "intermediate"
    }
  ]
};

export default mod;
