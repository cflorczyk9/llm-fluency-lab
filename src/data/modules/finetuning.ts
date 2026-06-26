// Module: Fine-tuning & Adaptation
// Mode: deepen. Existing video, breakdown, and cards finetuning-0..finetuning-13
// are carried over verbatim from the original deck; finetuning-14..finetuning-21
// and one breakdown section are new, plus tier and learningObjectives.

import type { Category } from '../../types';

const mod: Category = {
  "key": "finetuning",
  "name": "Fine-tuning & Adaptation",
  "tier": 2,
  "summary": "Fine-tuning continues training a finished model on your own examples to change its default behavior, style, or output format. Knowing when to fine-tune versus prompt or retrieve, and what fine-tuning cannot reliably do (add fresh facts), saves a lot of money and effort.",
  "learningObjectives": [
    "By the end you can explain what fine-tuning does and what it cannot reliably add (behavior, not fresh facts)",
    "By the end you can choose between prompting, RAG, and fine-tuning for a given goal",
    "By the end you can describe full fine-tuning versus parameter-efficient methods like LoRA",
    "By the end you can explain what training-data quality and quantity you actually need",
    "By the end you can describe risks like overfitting and catastrophic forgetting and how to detect them",
    "By the end you can connect fine-tuning to distillation and small specialized models"
  ],
  "breakdown": [
    {
      "heading": "What fine-tuning actually does: it changes the weights",
      "explanation": "A pretrained model is a giant grid of numbers (weights) that encode everything it learned. Prompting and retrieval leave those numbers untouched: they just feed better text into the model at the moment you ask. Fine-tuning is different in kind, not degree: you take a finished model and keep training it on your own examples, nudging the weights so the new behavior becomes part of the model itself. After fine-tuning, the model behaves the new way even with no special prompt and nothing retrieved, because the change is now permanent inside the model. The practical payoff is consistency and shorter prompts (you no longer have to spell out the format or tone every time); the practical cost is that you now own a separate model artifact you have to host, version, and re-do whenever the base model improves.",
      "keyTerms": [
        {
          "term": "Weights (parameters)",
          "definition": "The billions of learned numbers inside a model that determine its behavior. Fine-tuning adjusts these; prompting and RAG do not touch them."
        },
        {
          "term": "Base model",
          "definition": "The general pretrained (and usually post-trained) model you start from before any of your own fine-tuning."
        },
        {
          "term": "Fine-tuned model (checkpoint)",
          "definition": "A separate copy of the model with your adjusted weights saved. You host and version this artifact yourself, distinct from the base."
        }
      ]
    },
    {
      "heading": "Full fine-tuning vs LoRA/PEFT: the cheap way to do it",
      "explanation": "Full fine-tuning updates every weight in the model. For a large model that means you need enough memory to hold the whole model plus its training bookkeeping (optimizer state and gradients), which is expensive and produces a full-size copy per task. PEFT (parameter-efficient fine-tuning) sidesteps this by freezing the original weights and training only a tiny set of new ones. The most popular version, LoRA (low-rank adaptation), inserts small add-on matrices next to the existing layers and trains only those, often well under 1% of the total parameters. You get most of the quality of full fine-tuning at a fraction of the compute and memory, and the result is a small adapter file (often tens of megabytes) that you snap onto the unchanged base model. That small size is why you can keep many task-specific LoRA adapters and swap them in cheaply, and why most teams fine-tune with LoRA rather than full fine-tuning unless they have a strong reason not to.",
      "keyTerms": [
        {
          "term": "Full fine-tuning",
          "definition": "Updating all of a model's weights. Highest ceiling and highest cost; produces a full-size model copy per task."
        },
        {
          "term": "PEFT (parameter-efficient fine-tuning)",
          "definition": "A family of methods that freeze most weights and train only a small number of new ones, cutting compute and storage dramatically."
        },
        {
          "term": "LoRA (low-rank adaptation)",
          "definition": "The most common PEFT method: it freezes the base weights and trains small add-on matrices, typically far under 1% of parameters, saved as a tiny swappable adapter."
        },
        {
          "term": "Adapter",
          "definition": "The small file of trained extra weights produced by LoRA. It attaches to the unchanged base model and can be swapped per task."
        }
      ]
    },
    {
      "heading": "Fine-tuning vs RAG vs prompting: pick by what the problem needs",
      "explanation": "These three are not competitors so much as tools for different jobs. Prompting (including few-shot examples in the prompt) is the first thing to try: it's free, instant, and reversible. Retrieval (RAG) is the answer when the problem is missing knowledge: you fetch the right documents at query time and paste them into the context, which is how you give a model current or private facts without retraining. Fine-tuning is the answer when the problem is behavior, not knowledge: a consistent output format, a specific tone or house style, a narrow classification task, or following instructions the base model keeps fumbling. The classic mistake is fine-tuning to add facts. Facts learned by fine-tuning are baked in, hard to update, and the model can still get them wrong or hallucinate; retrieval keeps facts external, fresh, and citable. A strong rule of thumb: RAG for what the model should know, fine-tuning for how the model should behave. The three also stack: you can fine-tune for format and still use RAG for facts in the same system.",
      "keyTerms": [
        {
          "term": "RAG (retrieval-augmented generation)",
          "definition": "Fetching relevant documents at query time and inserting them into the prompt so the model answers from current, external knowledge without any weight change."
        },
        {
          "term": "Few-shot prompting",
          "definition": "Putting a handful of example input/output pairs directly in the prompt to steer behavior. Often gets you most of fine-tuning's benefit with zero training."
        },
        {
          "term": "Behavior vs knowledge",
          "definition": "The decision axis: fine-tune to change how the model responds (format, tone, task); use RAG to change what facts it has access to."
        }
      ]
    },
    {
      "heading": "Costs, tradeoffs, and the data that makes or breaks it",
      "explanation": "Fine-tuning has costs in three buckets. First, the training run itself (compute time and money), which LoRA shrinks a lot but does not eliminate. Second, the data: you need a curated set of high-quality input/output examples, and quality matters far more than raw count. A few hundred to a few thousand clean, consistent examples usually beat tens of thousands of noisy ones, because the model copies whatever patterns are in your data, including the mistakes. Third, ongoing ownership: every fine-tuned model is a frozen snapshot, so when the provider ships a better base model your fine-tune does not automatically inherit the gains and you have to redo the training to catch up. There's also a hidden trap called catastrophic forgetting: training hard on a narrow task can degrade skills the model used to have, so a model fine-tuned to be great at one format can get worse at general reasoning. LoRA reduces this risk (the original weights stay frozen), and keeping the learning gentle and the dataset balanced helps too.",
      "keyTerms": [
        {
          "term": "Catastrophic forgetting",
          "definition": "When fine-tuning on a narrow task erodes general abilities the model already had. Mitigated by LoRA (frozen base weights), gentle training, and balanced data."
        },
        {
          "term": "Training data quality",
          "definition": "The curated example pairs you fine-tune on. Quality and consistency dominate quantity; the model faithfully copies patterns and errors in the data."
        },
        {
          "term": "Snapshot staleness",
          "definition": "A fine-tuned model is frozen against one base version; it does not inherit improvements when the provider ships a newer base, so you must re-fine-tune to catch up."
        },
        {
          "term": "Overfitting",
          "definition": "When the model memorizes the training examples instead of the general pattern, performing well on them but poorly on new inputs. A risk with small or repetitive datasets."
        }
      ]
    },
    {
      "heading": "Distillation, small specialized models, and quantized tuning",
      "explanation": "Fine-tuning connects to a wider family of techniques for getting a small, cheap model to punch above its size. Distillation is the headline one. A large, capable 'teacher' model generates lots of high-quality outputs, and a smaller 'student' model is trained to imitate them, so the student inherits much of the teacher's behavior at a fraction of the running cost. The result is a small specialized model that can match or beat a much larger general model on one narrow task while being far cheaper and faster to run, which is why production teams often distill or fine-tune a small model for a high-volume job rather than calling a frontier model every time. On the hardware side, QLoRA (quantized LoRA) makes tuning big models affordable by loading the frozen base in a compressed, low-precision form and training only the small LoRA adapter on top, which can bring a model that would otherwise need several GPUs down to one. Whatever method you use, the discipline that separates a real improvement from a regression is evaluation: you measure the base model on a held-out test set first, fine-tune, then measure again on the same set, and you also re-check general tasks to make sure you did not trade broad ability for narrow gains.",
      "keyTerms": [
        {
          "term": "Distillation",
          "definition": "Training a smaller 'student' model to imitate the outputs of a larger 'teacher' model, transferring much of the teacher's behavior into a cheaper, faster model."
        },
        {
          "term": "Small specialized model",
          "definition": "A compact model fine-tuned or distilled for one narrow task, where it can match or beat a much larger general model at far lower cost and latency."
        },
        {
          "term": "QLoRA",
          "definition": "A memory-saving method that loads the frozen base model in compressed low-precision (quantized) form and trains only a small LoRA adapter on top, letting you tune large models on modest hardware."
        },
        {
          "term": "Held-out evaluation",
          "definition": "Measuring the model on examples it was not trained on, before and after fine-tuning, to confirm a genuine gain rather than memorization."
        }
      ]
    }
  ],
  "video": {
    "url": "https://www.youtube.com/watch?v=D601JeK7e2E",
    "title": "Fine-Tuning Large Language Models",
    "channel": "IBM Technology"
  },
  "cards": [
    {
      "id": "finetuning-0",
      "categoryKey": "finetuning",
      "category": "Fine-tuning & Adaptation",
      "subtopic": "It changes the weights",
      "question": "What is the single defining thing fine-tuning does that prompting and RAG do not?",
      "answer": "Fine-tuning changes the model's weights (its actual learned parameters), making the new behavior permanent inside the model. Prompting and RAG leave the weights untouched and only change the text fed in at runtime.",
      "plain": "Fine-tuning actually rewires the AI's 'brain' so the new habit sticks for good. Prompting and RAG leave the brain alone and just hand it better instructions or notes in the moment.",
      "difficulty": "core"
    },
    {
      "id": "finetuning-1",
      "categoryKey": "finetuning",
      "category": "Fine-tuning & Adaptation",
      "subtopic": "It changes the weights",
      "question": "After you fine-tune a model, do you still need the special prompt or retrieved context that taught the behavior, and why?",
      "answer": "No. Because fine-tuning bakes the behavior into the weights, the model behaves the new way even with a plain prompt and nothing retrieved. That's the point of fine-tuning versus prompting: the change is now part of the model itself.",
      "plain": "Once someone has truly learned a skill, you do not have to re-explain it every time, they just do it. Fine-tuning works the same way: the behavior is now built in, so you can drop the long instructions you used to repeat.",
      "difficulty": "intermediate"
    },
    {
      "id": "finetuning-2",
      "categoryKey": "finetuning",
      "category": "Fine-tuning & Adaptation",
      "subtopic": "Fine-tuning vs RAG",
      "question": "State the rule of thumb for choosing between fine-tuning and RAG.",
      "answer": "RAG for what the model should know (facts, current or private knowledge fetched at query time); fine-tuning for how the model should behave (format, tone, style, a narrow task). Knowledge goes in retrieval; behavior goes in the weights.",
      "plain": "Simple split: use RAG to change what the AI knows (the facts), and fine-tuning to change how it acts (its style and format). Facts you look up; habits you train in.",
      "difficulty": "core"
    },
    {
      "id": "finetuning-3",
      "categoryKey": "finetuning",
      "category": "Fine-tuning & Adaptation",
      "subtopic": "Fine-tuning vs RAG",
      "question": "Why is fine-tuning a poor choice for adding fresh or frequently changing facts to a model?",
      "answer": "Facts learned by fine-tuning are frozen into the weights, so updating them means retraining, and the model can still recall them wrong or hallucinate. Retrieval (RAG) keeps facts external, easy to update, and citable, which is the right tool for knowledge.",
      "plain": "Baking facts in by fine-tuning is like memorizing a price list: when prices change you have to re-memorize the whole thing, and you might still misremember. Looking prices up in a live document (RAG) is always current and you can point to the source.",
      "difficulty": "intermediate"
    },
    {
      "id": "finetuning-4",
      "categoryKey": "finetuning",
      "category": "Fine-tuning & Adaptation",
      "subtopic": "LoRA / PEFT",
      "question": "What does LoRA do differently from full fine-tuning, and why does that make it cheaper?",
      "answer": "LoRA freezes all the original weights and trains only small add-on matrices inserted next to the existing layers (often well under 1% of parameters). Because you train and store far fewer numbers, it uses much less compute and memory and produces a tiny adapter file instead of a full model copy.",
      "plain": "Full fine-tuning is like repainting an entire house; LoRA is like adding a few small sticky notes that tweak how things work. Because you only change a tiny part, it is far cheaper and the result is a small file instead of a whole new copy of the model.",
      "difficulty": "core"
    },
    {
      "id": "finetuning-5",
      "categoryKey": "finetuning",
      "category": "Fine-tuning & Adaptation",
      "subtopic": "LoRA / PEFT",
      "question": "What is an adapter in the LoRA workflow, and what practical advantage does its small size give you?",
      "answer": "An adapter is the small file of trained extra weights LoRA produces. Because it's tiny (often tens of megabytes) and snaps onto the unchanged base model, you can keep many task-specific adapters and swap them in cheaply rather than hosting a full fine-tuned copy per task.",
      "plain": "An adapter is like a small clip-on lens for a camera: the camera (base model) stays the same, and you snap on whichever lens fits the job. Because each lens is tiny, you can keep a drawer full of them and switch instantly, instead of buying a whole new camera per task.",
      "difficulty": "intermediate"
    },
    {
      "id": "finetuning-6",
      "categoryKey": "finetuning",
      "category": "Fine-tuning & Adaptation",
      "subtopic": "LoRA / PEFT",
      "question": "What does the acronym PEFT stand for, and what is the core idea behind every method in that family?",
      "answer": "PEFT stands for parameter-efficient fine-tuning. The core idea is to freeze most of the model's weights and train only a small number of new parameters, getting most of full fine-tuning's quality at a fraction of the compute and storage. LoRA is the most common PEFT method.",
      "plain": "PEFT (parameter-efficient fine-tuning) just means 'train only a small piece instead of the whole thing.' You leave most of the model frozen and tweak a tiny part, getting almost the same result for much less cost. LoRA is the best-known version of this trick.",
      "difficulty": "core"
    },
    {
      "id": "finetuning-7",
      "categoryKey": "finetuning",
      "category": "Fine-tuning & Adaptation",
      "subtopic": "Catastrophic forgetting",
      "question": "What is catastrophic forgetting in fine-tuning, and why does LoRA reduce the risk of it?",
      "answer": "Catastrophic forgetting is when training hard on a narrow task erodes general skills the model already had (e.g. it nails your format but reasons worse overall). LoRA reduces the risk because it freezes the original weights and only adds small new ones, so the model's existing knowledge is left largely intact.",
      "plain": "Drilling someone obsessively on one narrow skill can make them rusty at everything else, that is catastrophic forgetting. LoRA avoids it by leaving the original skills frozen in place and only adding the new ability on top, so nothing old gets overwritten.",
      "difficulty": "intermediate"
    },
    {
      "id": "finetuning-8",
      "categoryKey": "finetuning",
      "category": "Fine-tuning & Adaptation",
      "subtopic": "Costs and tradeoffs",
      "question": "For fine-tuning, what matters more: the quantity of training examples or their quality, and what's the failure mode if you ignore this?",
      "answer": "Quality and consistency matter far more than raw quantity. A few hundred to a few thousand clean examples usually beat tens of thousands of noisy ones, because the model faithfully copies whatever patterns are in your data, including the mistakes and inconsistencies.",
      "plain": "The AI copies your examples like a mimic, including any sloppiness, so a small set of clean, consistent examples beats a huge messy pile. Feed it garbage and it will faithfully learn the garbage.",
      "difficulty": "core"
    },
    {
      "id": "finetuning-9",
      "categoryKey": "finetuning",
      "category": "Fine-tuning & Adaptation",
      "subtopic": "Costs and tradeoffs",
      "question": "Why does a fine-tuned model become stale over time even if you never touch it?",
      "answer": "A fine-tuned model is a frozen snapshot tied to one base-model version. When the provider ships an improved base model, your fine-tune does not automatically inherit those gains, so you have to redo the training on the new base to catch up.",
      "plain": "Your fine-tuned model is like a photo taken of the AI on a certain day. When the company releases a smarter version, your photo does not magically update, so you are stuck with the old one until you redo the work on the new release.",
      "difficulty": "intermediate"
    },
    {
      "id": "finetuning-10",
      "categoryKey": "finetuning",
      "category": "Fine-tuning & Adaptation",
      "subtopic": "When to fine-tune",
      "question": "Before reaching for fine-tuning, what cheaper adaptation should you usually try first, and why?",
      "answer": "Prompting, including few-shot examples in the prompt. It's free, instant, and reversible, and it often gets you most of fine-tuning's benefit for behavior and format with no training run and no model artifact to host.",
      "plain": "Try just asking well first, including showing a few examples right in your request. It costs nothing, takes effect immediately, and you can change it any time, often getting you most of the way there without the expense of training a custom model.",
      "difficulty": "core"
    },
    {
      "id": "finetuning-11",
      "categoryKey": "finetuning",
      "category": "Fine-tuning & Adaptation",
      "subtopic": "When to fine-tune",
      "question": "Name three concrete problem types where fine-tuning is the right tool rather than RAG or prompting.",
      "answer": "A consistently enforced output format or schema, a specific tone or house style, and a narrow repetitive task like classification or extraction where the base model keeps fumbling the instructions. All are about behavior, not adding knowledge.",
      "plain": "Reach for fine-tuning when you need the AI to reliably act a certain way: always reply in the exact same format, always use your brand's voice, or nail a repetitive sorting job it keeps getting wrong. All three are about how it behaves, not about feeding it new facts.",
      "difficulty": "intermediate"
    },
    {
      "id": "finetuning-12",
      "categoryKey": "finetuning",
      "category": "Fine-tuning & Adaptation",
      "subtopic": "Fine-tuning vs RAG",
      "question": "Can fine-tuning and RAG be used together in the same system, and what would each handle?",
      "answer": "Yes, they stack cleanly. You fine-tune the model for behavior (e.g. always answer in your house format and tone) and still use RAG at query time to supply the current facts. Behavior lives in the weights; knowledge stays external.",
      "plain": "Yes, and they work great as a team. Fine-tuning trains the AI's style and manners, while RAG hands it today's facts when a question comes in, like a well-trained assistant who also checks the latest files before answering.",
      "difficulty": "advanced"
    },
    {
      "id": "finetuning-13",
      "categoryKey": "finetuning",
      "category": "Fine-tuning & Adaptation",
      "subtopic": "Costs and tradeoffs",
      "question": "In full fine-tuning, why is memory cost much higher than just the size of the model itself?",
      "answer": "Training has to hold not only the model weights but also the optimizer state and the gradients for every parameter being updated, which together can multiply the memory needed by several times. PEFT methods like LoRA shrink this because they only carry that bookkeeping for the small set of trained parameters.",
      "plain": "Training does not just store the model; it also keeps a pile of scratch work for every single number it is adjusting, which balloons the memory needed to several times the model's size. LoRA keeps that scratch work tiny because it only adjusts a small part.",
      "difficulty": "advanced"
    },
    {
      "id": "finetuning-14",
      "categoryKey": "finetuning",
      "category": "Fine-tuning & Adaptation",
      "subtopic": "Distillation",
      "question": "What is distillation in the context of model adaptation?",
      "answer": "Distillation trains a smaller 'student' model to imitate the outputs of a larger, more capable 'teacher' model. The student learns to reproduce the teacher's behavior, ending up far cheaper and faster to run while keeping much of the teacher's quality on the target task.",
      "plain": "Distillation is like an expert mentor teaching an apprentice: the big, expensive model generates great answers, and a small model learns to copy them. You end up with a cheap, fast model that behaves a lot like the pricey one, at least for the job it was trained on.",
      "difficulty": "core"
    },
    {
      "id": "finetuning-15",
      "categoryKey": "finetuning",
      "category": "Fine-tuning & Adaptation",
      "subtopic": "Small specialized models",
      "question": "Why might a small fine-tuned model beat a large general-purpose model for a specific production task?",
      "answer": "On a narrow, well-defined task, a small model tuned (or distilled) for exactly that job can match or exceed a big general model's quality while costing far less per call and responding faster. The general model's extra breadth is wasted capacity for that one task, so you pay for capability you do not use.",
      "plain": "For one repetitive job, a small specialist often beats a big generalist, like a dedicated label-printer versus a full computer. The little model does that single task as well or better, much cheaper and faster, while the giant model's extra brainpower is just overhead you are paying for.",
      "difficulty": "core"
    },
    {
      "id": "finetuning-16",
      "categoryKey": "finetuning",
      "category": "Fine-tuning & Adaptation",
      "subtopic": "Instruction vs domain tuning",
      "question": "What is the difference between instruction tuning and domain tuning?",
      "answer": "Instruction tuning trains a model to follow instructions and respond in a helpful assistant style across many tasks (turning a raw text predictor into a usable assistant). Domain tuning, often continued training on domain text, steeps a model in the vocabulary, patterns, and style of a specific field like law or medicine. One teaches how to behave, the other teaches a domain's flavor.",
      "plain": "Instruction tuning teaches the model how to take orders and act like a helpful assistant. Domain tuning soaks it in one field's language and style, like an internship at a law firm. The first is about manners and following directions, the second is about sounding fluent in a particular world.",
      "difficulty": "core"
    },
    {
      "id": "finetuning-17",
      "categoryKey": "finetuning",
      "category": "Fine-tuning & Adaptation",
      "subtopic": "Cost and maintenance burden",
      "question": "Beyond the one-time training cost, what ongoing burden does owning a fine-tuned model create?",
      "answer": "You now own a model artifact you must host, version, monitor, and eventually re-train. It does not inherit improvements when the provider ships a better base model, and any change to your task or data may require re-tuning and re-evaluating. That maintenance burden is why you fine-tune only when prompting and retrieval cannot do the job.",
      "plain": "A fine-tuned model is like a custom car: great, but now you maintain it forever. You host it, keep it updated, and redo the work whenever the base model improves or your needs shift. That long-term upkeep is why you only build one when simpler options (better prompts, looking facts up) truly fall short.",
      "difficulty": "core"
    },
    {
      "id": "finetuning-18",
      "categoryKey": "finetuning",
      "category": "Fine-tuning & Adaptation",
      "subtopic": "QLoRA",
      "question": "At a high level, how does QLoRA make it possible to fine-tune a large model on modest hardware?",
      "answer": "QLoRA loads the frozen base model in a compressed, low-precision (quantized, often 4-bit) form so it takes far less memory, then trains only a small LoRA adapter on top of it. Combining quantization (which shrinks the base's footprint) with LoRA (which trains very few parameters) can bring a model that would need several GPUs down to a single one.",
      "plain": "QLoRA does two space-saving tricks at once: it stores the big frozen model in a shrunk-down form (quantization), and it only trains a tiny add-on (LoRA). Together they squeeze a model that normally needs several expensive chips down onto one, making custom tuning affordable.",
      "difficulty": "intermediate"
    },
    {
      "id": "finetuning-19",
      "categoryKey": "finetuning",
      "category": "Fine-tuning & Adaptation",
      "subtopic": "Overfitting",
      "question": "How do you detect overfitting during fine-tuning, and what is the telltale sign?",
      "answer": "You hold out a validation set the model never trains on and watch its performance there. The telltale sign of overfitting is that training-set performance keeps improving while validation performance stalls or gets worse, meaning the model is memorizing the examples instead of learning the general pattern.",
      "plain": "Keep a set of examples the model never studies, like a surprise quiz. If the model keeps acing the homework it has seen but does worse on the surprise quiz, it is memorizing instead of learning, which is overfitting. The gap between the two is your warning light.",
      "difficulty": "intermediate"
    },
    {
      "id": "finetuning-20",
      "categoryKey": "finetuning",
      "category": "Fine-tuning & Adaptation",
      "subtopic": "Evaluating before and after",
      "question": "What should you measure before and after fine-tuning to know it actually helped and did not cause harm?",
      "answer": "Score the base model on a held-out eval set for your task first, fine-tune, then score again on the same set to confirm a real gain. Crucially, also re-test general capabilities so you catch catastrophic forgetting, the case where you improved the narrow task but degraded broader skills.",
      "plain": "Grade the model on a fixed test before and after training so you can prove it improved, not just hope it did. And run a few general questions too, because a model that got better at your one task might have gotten worse at everything else, and you want to catch that.",
      "difficulty": "intermediate"
    },
    {
      "id": "finetuning-21",
      "categoryKey": "finetuning",
      "category": "Fine-tuning & Adaptation",
      "subtopic": "Distillation",
      "question": "In distillation, why can training a student on a teacher's full output distribution (soft targets) work better than training it only on the single correct answers?",
      "answer": "The teacher's soft targets (its probabilities across many possible outputs, not just the top one) carry extra information about how the teacher weighs alternatives, sometimes called dark knowledge. The student learns these nuanced relationships, which conveys more signal per example than a bare right/wrong label and often yields a better small model than training on hard labels alone.",
      "plain": "Instead of telling the student only 'the answer is A,' the teacher reveals how it weighed all the options ('A is most likely, but B was a close second, C was absurd'). That richer feedback teaches the small model the reasoning texture behind the answer, so it learns more from each example than from a plain yes/no label.",
      "difficulty": "advanced"
    }
  ]
};

export default mod;
