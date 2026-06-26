// Transformer Architecture (tier 1). Deepened module: the original 14 cards are carried
// over verbatim from the legacy deck, followed by additional cards.
import type { Category } from '../../types';

const mod: Category = {
  "key": "architecture",
  "name": "Transformer Architecture",
  "tier": 1,
  "summary": "The transformer block is the repeating unit that every modern LLM is built from, so understanding it turns \"the model\" from a black box into a stack of parts you can reason about. Once you can name what a layer is, what flows through the residual stream, and where the parameters actually live, decisions about model size, cost, context length, and why bigger models behave differently stop being guesswork.",
  "learningObjectives": [
    "By the end you can describe the two sub-steps of a transformer block and what each does",
    "By the end you can explain the residual stream and why skip connections make deep models trainable",
    "By the end you can say what layer normalization does and why modern models use pre-norm and RMSNorm",
    "By the end you can locate where most parameters live and why feed-forward layers are the model knowledge storage",
    "By the end you can distinguish parameters from activations and connect each to memory and cost",
    "By the end you can read a model spec (layers, width, parameter count) and reason about its implications"
  ],
  "breakdown": [
    {
      "heading": "What a transformer block actually is",
      "explanation": "A transformer is not one giant network; it is the same small recipe (a 'block' or 'layer') stacked dozens of times. Each block does exactly two jobs in order: first an attention step that lets every token look at and pull in information from other tokens, then a feed-forward step (a small two-layer neural net, also called the MLP) that processes each token on its own. Tokens enter a block as a list of vectors (one vector per token), get refined by attention and then by the MLP, and leave as the same-shaped list of vectors, just with richer meaning. 'Depth' is how many of these blocks are stacked; a model with 80 layers literally runs this attention-then-MLP recipe 80 times in sequence, each time letting the representation get a little more abstract.",
      "keyTerms": [
        {
          "term": "Transformer block (layer)",
          "definition": "One repeating unit of the model containing an attention sub-step and a feed-forward (MLP) sub-step. Stacking N of these gives a model 'N layers' of depth."
        },
        {
          "term": "Attention sub-step",
          "definition": "The part of a block where each token gathers information from other tokens in the sequence; this is where tokens 'talk to each other.'"
        },
        {
          "term": "Feed-forward / MLP sub-step",
          "definition": "A small two-layer neural network applied to each token's vector independently (no looking at other tokens); this is where most of a block's computation and parameters live."
        }
      ]
    },
    {
      "heading": "The residual stream: the model's shared workspace",
      "explanation": "Every block reads from and writes to a single running vector per token called the residual stream. Crucially, attention and the MLP do not replace that vector; they compute an update and add it back (output = input + sub-layer(input)). Picture a conveyor belt carrying each token's vector through all the layers, where each block reaches in, reads the current value, and adds its small contribution. This 'add, don't overwrite' design is what makes very deep models trainable: the original signal can flow straight through if a block has nothing to add, so the learning signal (gradient) does not fade away as it passes back through dozens of layers. It also means later layers can build directly on what earlier layers wrote, since everything shares one common channel.",
      "keyTerms": [
        {
          "term": "Residual stream",
          "definition": "The per-token vector that runs through the whole stack; every block reads it and adds its output back to it rather than replacing it."
        },
        {
          "term": "Residual (skip) connection",
          "definition": "The 'input + sub-layer(input)' wiring that adds each sub-layer's output back onto its input, preserving the original signal."
        },
        {
          "term": "Vanishing gradient",
          "definition": "The problem where the training signal shrinks to nothing as it propagates back through many layers; residual connections largely prevent it by giving the signal a direct path."
        }
      ]
    },
    {
      "heading": "Layer normalization: keeping the numbers sane",
      "explanation": "Before each sub-step, the model normalizes each token's vector so its numbers sit in a stable range (roughly mean zero, consistent scale), then re-scales it with a few learned knobs. This is layer normalization, and it matters because without it the values flowing through dozens of stacked blocks can blow up or collapse, making training unstable. The placement detail experts care about: modern LLMs put the normalization before each sub-layer ('pre-norm'), not after ('post-norm'). Pre-norm keeps the residual stream itself clean and un-normalized, which is what lets you train very deep models reliably. Many recent models use a lighter variant called RMSNorm that skips the mean-centering step and just rescales by magnitude, which is cheaper and works about as well.",
      "keyTerms": [
        {
          "term": "Layer normalization (LayerNorm)",
          "definition": "A step that rescales each token's vector to a stable mean and variance, then applies learned scale and shift parameters, keeping values well-behaved across deep stacks."
        },
        {
          "term": "Pre-norm vs post-norm",
          "definition": "Pre-norm normalizes the input before each sub-layer and is standard in modern LLMs for stable deep training; post-norm (the original 2017 design) normalizes after and is harder to train deep."
        },
        {
          "term": "RMSNorm",
          "definition": "A cheaper normalization that rescales a vector by its root-mean-square magnitude without subtracting the mean; common in recent LLMs (e.g., Llama-family)."
        }
      ]
    },
    {
      "heading": "The feed-forward network: where the model stores what it knows",
      "explanation": "Inside each block, after attention, sits a small two-layer neural network applied to every token separately. It expands the token's vector to a much wider hidden size (commonly about 4x the model's width), applies a nonlinearity (a function like GELU or a gated SwiGLU that lets the network represent complex relationships), then projects back down to the original width. This expand-then-contract shape is where the bulk of a transformer's parameters live, typically around two-thirds of them, which is why people describe the feed-forward layers as the model's main 'knowledge storage.' Attention decides what to combine; the feed-forward layer is where most of the learned facts and patterns are actually encoded.",
      "keyTerms": [
        {
          "term": "Feed-forward network (FFN)",
          "definition": "The per-token two-layer net inside each block that expands to a wide hidden dimension, applies a nonlinearity, then projects back down."
        },
        {
          "term": "Expansion ratio",
          "definition": "How much wider the FFN's hidden layer is than the model width, classically about 4x; it sets how much capacity each block has."
        },
        {
          "term": "Activation function (GELU / SwiGLU)",
          "definition": "The nonlinearity in the FFN that lets the network model nonlinear patterns; SwiGLU is a gated variant common in modern LLMs."
        }
      ]
    },
    {
      "heading": "Parameters vs activations: weights that are fixed vs numbers that flow",
      "explanation": "These two are easy to conflate but mean very different things. Parameters (weights) are the model's learned values, baked in during training and frozen at inference; they are what you count when you say '70 billion parameters,' and they sit in the attention and feed-forward layers. Activations are the temporary numbers computed as a specific input flows through, the actual vectors in the residual stream at each step; they exist only during a forward pass and depend entirely on the prompt. The practical link to cost: parameters drive how much memory you need just to load the model and roughly how much compute each token takes, while activations (especially the cached attention values, the 'KV cache') grow with how long your context is and dominate the memory cost of long prompts. Same weights every time; different activations for every input.",
      "keyTerms": [
        {
          "term": "Parameters (weights)",
          "definition": "The model's learned, frozen values set during training; the count people quote (7B, 70B) and the same for every input at inference."
        },
        {
          "term": "Activations",
          "definition": "The temporary numbers computed during a forward pass as a specific input flows through; input-dependent and discarded after generation."
        },
        {
          "term": "KV cache",
          "definition": "Stored attention keys and values for past tokens, a kind of activation memory that grows with context length and drives the memory cost of long prompts."
        }
      ]
    }
  ],
  "video": {
    "url": "https://www.youtube.com/watch?v=wjZofJX0v4M",
    "title": "Transformers, the tech behind LLMs",
    "channel": "3Blue1Brown"
  },
  "cards": [
    {
      "id": "architecture-0",
      "categoryKey": "architecture",
      "category": "Transformer Architecture",
      "subtopic": "Block structure",
      "question": "In a single transformer block, what are the two sub-steps and in what order do they run?",
      "answer": "Attention first, then the feed-forward network (MLP). Attention lets each token gather information from other tokens; the feed-forward step then processes each token's vector independently.",
      "plain": "Each block runs two steps in order: first a 'group discussion' where every word gathers clues from the other words, then a 'private think' where each word digests what it learned on its own. Discussion first, solo reflection second.",
      "difficulty": "core"
    },
    {
      "id": "architecture-1",
      "categoryKey": "architecture",
      "category": "Transformer Architecture",
      "subtopic": "Stacking layers",
      "question": "When someone says a model 'has 80 layers,' what does that physically describe?",
      "answer": "It means the same attention-then-feed-forward block recipe is stacked and run 80 times in sequence. Each layer refines the per-token representation a bit further, so layer count is the model's depth.",
      "plain": "It means the same little processing step is repeated 80 times in a row, like passing a draft through 80 editors one after another, each one polishing it a bit more. More layers means a deeper, more refined chain of editing.",
      "difficulty": "core"
    },
    {
      "id": "architecture-2",
      "categoryKey": "architecture",
      "category": "Transformer Architecture",
      "subtopic": "Residual stream",
      "question": "What is the residual stream in a transformer?",
      "answer": "It is the running per-token vector that flows through the entire stack of blocks. Each block reads its current value and adds its output back to it, so it acts as a shared workspace that carries information from the input all the way to the output.",
      "plain": "Picture a shared notepad for each word that travels through every step of the model. Each step reads the notepad and jots its own additions, so by the end the notepad holds everything learned along the way.",
      "difficulty": "core"
    },
    {
      "id": "architecture-3",
      "categoryKey": "architecture",
      "category": "Transformer Architecture",
      "subtopic": "Residual stream",
      "question": "How does a sub-layer (attention or MLP) combine its output with its input, and why does that specific design matter?",
      "answer": "It adds the output to the input (output = input + sublayer(input)) rather than replacing the input. This residual/skip connection preserves the original signal and gives the training gradient a direct path back through many layers, which is what makes very deep models trainable (it prevents the vanishing-gradient problem).",
      "plain": "Each step adds its notes to the shared notepad instead of erasing what was there, like editing in the margins rather than rewriting the page. This 'add, don't overwrite' habit keeps the original ideas intact and is the trick that lets you stack lots of steps without the message getting lost along the way.",
      "difficulty": "intermediate"
    },
    {
      "id": "architecture-4",
      "categoryKey": "architecture",
      "category": "Transformer Architecture",
      "subtopic": "Layer normalization",
      "question": "What problem does layer normalization solve in a deep transformer?",
      "answer": "It keeps the numbers flowing through the stack in a stable range (consistent mean and scale) so values do not blow up or collapse across dozens of stacked blocks, which would otherwise make training unstable. It rescales each token's vector and then applies a few learned scale/shift knobs.",
      "plain": "It is like a volume control between steps that keeps the numbers from getting deafeningly loud or fading to silence as they pass through many layers. Without it, the signal would distort and the model would be a mess to train.",
      "difficulty": "core"
    },
    {
      "id": "architecture-5",
      "categoryKey": "architecture",
      "category": "Transformer Architecture",
      "subtopic": "Layer normalization",
      "question": "What is the difference between pre-norm and post-norm placement, and which do modern LLMs use?",
      "answer": "Pre-norm normalizes the input before each sub-layer and leaves the residual stream itself un-normalized; post-norm (the original 2017 design) normalizes after the sub-layer. Modern LLMs use pre-norm because it keeps the residual path clean and makes very deep models far more stable to train.",
      "plain": "It is just whether you adjust the volume before each step does its work or after. Modern models adjust it before (pre-norm) because that keeps the shared notepad untouched and makes very deep models much easier to train reliably.",
      "difficulty": "advanced"
    },
    {
      "id": "architecture-6",
      "categoryKey": "architecture",
      "category": "Transformer Architecture",
      "subtopic": "Layer normalization",
      "question": "How does RMSNorm differ from standard LayerNorm, and why is it popular in recent models?",
      "answer": "RMSNorm rescales a vector only by its root-mean-square magnitude and skips subtracting the mean (no recentering). It is cheaper to compute while performing about as well, which is why many recent LLMs (such as the Llama family) adopted it.",
      "plain": "RMSNorm is a stripped-down version of that volume control: it just adjusts loudness and skips an extra centering step the fuller version does. It is cheaper to run and works about as well, so many newer models switched to it.",
      "difficulty": "advanced"
    },
    {
      "id": "architecture-7",
      "categoryKey": "architecture",
      "category": "Transformer Architecture",
      "subtopic": "Feed-forward network",
      "question": "What does the feed-forward network inside a block do to a token's vector, dimensionally?",
      "answer": "It expands the vector to a much wider hidden size (commonly about 4x the model width), applies a nonlinearity (e.g., GELU or SwiGLU), then projects it back down to the original width. This expand-then-contract happens per token, independently of other tokens.",
      "plain": "It takes each word's data, spreads it out into a much bigger scratch space to work through complex patterns, then squeezes the result back to the original size. Imagine unfolding a map to study it in detail, then folding it back up to carry on.",
      "difficulty": "intermediate"
    },
    {
      "id": "architecture-8",
      "categoryKey": "architecture",
      "category": "Transformer Architecture",
      "subtopic": "Feed-forward network",
      "question": "Roughly what share of a transformer's parameters live in the feed-forward layers versus attention, and what does that imply?",
      "answer": "The feed-forward (MLP) layers hold the majority of the parameters, typically around two-thirds. This is why FFNs are described as the model's main knowledge storage: attention decides what information to combine, but the feed-forward layers are where most learned facts and patterns are encoded.",
      "plain": "About two-thirds of the model's learned settings sit in the 'private think' part, which makes it the model's main memory bank. The discussion step decides what to look at, but the facts and patterns themselves are mostly stored here.",
      "difficulty": "intermediate"
    },
    {
      "id": "architecture-9",
      "categoryKey": "architecture",
      "category": "Transformer Architecture",
      "subtopic": "Block structure",
      "question": "What is the key behavioral difference between the attention sub-step and the feed-forward sub-step regarding which tokens they see?",
      "answer": "Attention mixes information across tokens (each token looks at others in the sequence), while the feed-forward network processes each token's vector in isolation with no cross-token interaction. Attention is the only place tokens 'talk to each other.'",
      "plain": "The attention step is the only moment the words actually talk to each other and share information; the feed-forward step is each word thinking quietly alone, ignoring its neighbors. Sharing happens in attention, solo work happens in feed-forward.",
      "difficulty": "intermediate"
    },
    {
      "id": "architecture-10",
      "categoryKey": "architecture",
      "category": "Transformer Architecture",
      "subtopic": "Parameters vs activations",
      "question": "Distinguish parameters from activations in a transformer.",
      "answer": "Parameters (weights) are the model's learned values, frozen after training and identical for every input; they are what you count as '7B' or '70B.' Activations are the temporary numbers computed as a specific input flows through (the actual vectors in the residual stream), which depend on the prompt and are discarded after the forward pass.",
      "plain": "Parameters are like a chef's permanent skills and recipes: fixed, the same for every meal, and what you mean by a '70-billion-parameter' model. Activations are the actual ingredients being chopped and cooked for this one order: they change with each request and get cleared away once the dish is served.",
      "difficulty": "core"
    },
    {
      "id": "architecture-11",
      "categoryKey": "architecture",
      "category": "Transformer Architecture",
      "subtopic": "Parameters vs activations",
      "question": "Why does context length drive memory cost more through activations than through parameters?",
      "answer": "Parameters are fixed regardless of prompt length, so loading the model costs the same. But the KV cache (stored attention keys and values for past tokens) is an activation that grows with the number of tokens in context, so longer prompts mean more activation memory, which dominates the memory cost of long contexts.",
      "plain": "The model's fixed 'skills' take the same space no matter how long your prompt is. But the model keeps running notes on every word it has seen so far, and that pile of notes grows with a longer prompt, which is what really eats up memory on big contexts.",
      "difficulty": "advanced"
    },
    {
      "id": "architecture-12",
      "categoryKey": "architecture",
      "category": "Transformer Architecture",
      "subtopic": "Stacking layers",
      "question": "Why can later layers in a transformer build directly on what earlier layers computed?",
      "answer": "Because all blocks read from and write to the same residual stream by addition, the information an early block adds stays in the shared vector and is visible to every later block. The common channel lets layers compose, with earlier layers handling lower-level features and later ones building more abstract representations on top.",
      "plain": "Because every step writes to the same shared notepad, anything an early step jots down is still there for later steps to read and build on. Early steps catch the basics and later steps stack bigger-picture ideas on top, all using the one shared page.",
      "difficulty": "intermediate"
    },
    {
      "id": "architecture-13",
      "categoryKey": "architecture",
      "category": "Transformer Architecture",
      "subtopic": "Feed-forward network",
      "question": "What role does the nonlinearity (activation function) play in the feed-forward network, and why can't it be skipped?",
      "answer": "The nonlinearity (e.g., GELU or the gated SwiGLU) lets the network represent nonlinear, complex relationships. Without it, the FFN's two linear projections would collapse into a single linear transformation, so the model could not learn anything beyond simple linear mappings.",
      "plain": "The nonlinearity is the ingredient that lets the model learn curvy, complicated relationships instead of just straight-line ones. Skip it and the two processing steps would collapse into one plain step, leaving the model too simple to capture anything interesting.",
      "difficulty": "advanced"
    },
    {
      "id": "architecture-14",
      "categoryKey": "architecture",
      "category": "Transformer Architecture",
      "subtopic": "Decoder-only",
      "question": "What does it mean that modern chat LLMs are \"decoder-only,\" and how does that differ from the original 2017 design?",
      "answer": "The original transformer had two halves: an encoder that reads a full input and a decoder that writes an output, built for tasks like translation. Modern chat LLMs keep only the decoder: one stack that reads everything so far and predicts the next token, treating prompt and response as one continuous stream. This single-stack design is simpler and scales well for general text generation.",
      "plain": "The first transformer was like a translator with a \"reader\" department and a \"writer\" department. Today's chat models drop the separate reader and just use one stack that reads what is there and writes the next word, over and over. One unit doing both jobs turned out to be simpler and to scale better.",
      "difficulty": "core"
    },
    {
      "id": "architecture-15",
      "categoryKey": "architecture",
      "category": "Transformer Architecture",
      "subtopic": "Mixture-of-experts",
      "question": "What is a mixture-of-experts (MoE) model at a high level?",
      "answer": "In an MoE model, each block's single feed-forward network is replaced by many parallel feed-forward \"experts,\" and a small router picks just a few of them to run for each token. So a given token is processed by only a slice of the network rather than all of it, even though the model as a whole contains many more parameters.",
      "plain": "Instead of one all-purpose specialist handling every word, the model keeps a panel of specialists and a receptionist who sends each word to just the two or three most relevant ones. The model owns lots of experts in total, but any single word only bothers a handful of them.",
      "difficulty": "core"
    },
    {
      "id": "architecture-16",
      "categoryKey": "architecture",
      "category": "Transformer Architecture",
      "subtopic": "Mixture-of-experts",
      "question": "Why can a mixture-of-experts model have a huge total parameter count but still run relatively cheaply per token?",
      "answer": "Because only the few experts the router selects actually run for each token, the compute per token is set by the \"active parameters,\" not the much larger \"total parameters.\" An MoE model might hold hundreds of billions of total parameters while activating only tens of billions per token, giving it more knowledge capacity without paying full dense-model compute on every token.",
      "plain": "You can keep a giant staff on the payroll, but if only three people work on each task, your per-task cost is just those three, not the whole company. MoE separates \"how much the model knows in total\" from \"how much work it does on any one word.\"",
      "difficulty": "intermediate"
    },
    {
      "id": "architecture-17",
      "categoryKey": "architecture",
      "category": "Transformer Architecture",
      "subtopic": "Model width",
      "question": "What is a model's \"width\" (hidden dimension or d_model), and what does it control?",
      "answer": "Width is the length of the per-token vector that flows through the residual stream, for example 4,096 numbers. It sets how much information each token can carry at once and, together with depth (number of layers), largely determines the parameter count, since the attention and feed-forward weights scale with it. Wider models have more representational capacity per token but cost more compute and memory.",
      "plain": "Width is how many numbers describe each word as it moves through the model, like how many fields are on each word's index card. A bigger card holds more nuance per word. Width and number-of-layers together are the two dials that set how large the model is.",
      "difficulty": "core"
    },
    {
      "id": "architecture-18",
      "categoryKey": "architecture",
      "category": "Transformer Architecture",
      "subtopic": "Reading a spec",
      "question": "A spec says a model has 32 layers and a hidden size of 4,096. How do those two numbers relate to its parameter count?",
      "answer": "Parameter count grows with depth times width-squared, roughly. Each layer's attention and feed-forward weights are matrices whose size scales with the square of the width, and you have one set per layer, so multiplying that per-layer cost by the number of layers gives the bulk of the total. More layers or a larger hidden size both push the parameter count (and cost) up.",
      "plain": "Think of each layer as a fixed-size machine whose price grows fast as you widen it, then count how many layers you stack. Doubling the width roughly quadruples each layer's weights, and adding layers multiplies that out. The two numbers together let you ballpark how big the model really is.",
      "difficulty": "core"
    },
    {
      "id": "architecture-19",
      "categoryKey": "architecture",
      "category": "Transformer Architecture",
      "subtopic": "Depth vs width",
      "question": "Two models have nearly the same parameter count, but one is deeper (more layers) and the other is wider. Why might they behave differently?",
      "answer": "Depth and width trade off. More layers give more sequential processing steps, which can help with multi-step composition and abstraction, but are harder to train stably and slower to run one token at a time. More width gives each token more capacity per step and parallelizes better on hardware. Same parameter budget can be spent either way, and the balance affects both capability and speed.",
      "plain": "Same amount of material, different shape. A tall, thin model thinks in more small steps, good for layered reasoning but slower in sequence. A short, wide model does fewer but beefier steps that hardware chews through faster. The mix changes how the model feels even at equal size.",
      "difficulty": "intermediate"
    },
    {
      "id": "architecture-20",
      "categoryKey": "architecture",
      "category": "Transformer Architecture",
      "subtopic": "Autoregressive generation",
      "question": "In a decoder-only transformer, what restriction governs which tokens each position is allowed to look at, and why?",
      "answer": "Each token can attend only to itself and earlier tokens, never to later ones. This \"causal\" masking is required because the model is trained to predict the next token: if a position could peek at the words that come after it, predicting them would be trivial and the model would learn nothing useful. At generation time the future tokens do not exist yet anyway.",
      "plain": "Every word is only allowed to look backward, at the words already written, never forward. It is like writing a story where you can reread what you have so far but cannot see the page ahead, because the whole point is to guess what comes next.",
      "difficulty": "core"
    },
    {
      "id": "architecture-21",
      "categoryKey": "architecture",
      "category": "Transformer Architecture",
      "subtopic": "Output layer",
      "question": "After a token's vector reaches the top of the stack, how does the model turn it into a prediction of the next token?",
      "answer": "A final \"unembedding\" layer projects the top vector onto the vocabulary, producing one score (a logit) for every possible token. A softmax converts those scores into a probability distribution over the whole vocabulary, and the model samples or picks from that distribution to choose the next token. This is the step that closes the loop back to text.",
      "plain": "At the very top, the model holds a vote: it scores every word in its dictionary for how well it fits next, turns those scores into percentages, and then draws a winner from that. That winning token becomes the next word, and the process repeats.",
      "difficulty": "intermediate"
    }
  ]
};

export default mod;
