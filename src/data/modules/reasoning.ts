// Module: Reasoning & Test-time Compute (tier 4, new).
// No video. Covers test-time compute, chain-of-thought, trained reasoning models,
// their trade-offs, limits, and when to reach for one.

import type { Category } from '../../types';

const mod: Category = {
  key: 'reasoning',
  name: 'Reasoning & Test-time Compute',
  tier: 4,
  summary:
    "Newer models can think before they answer by generating intermediate reasoning steps, spending more computation at answer time to do better on hard problems. This module explains what test-time compute is, how chain-of-thought prompting and trained reasoning models differ, what the extra thinking costs in money and time, and how to decide when it is worth it.",
  learningObjectives: [
    'By the end you can explain what test-time compute means and why thinking longer can help',
    'By the end you can distinguish chain-of-thought prompting from trained reasoning models',
    'By the end you can describe when reasoning models help and when they are overkill',
    'By the end you can explain the cost and latency trade-offs of reasoning',
    'By the end you can recognize that more reasoning steps do not guarantee a correct answer',
    'By the end you can decide when to reach for a reasoning model versus a standard one',
  ],
  breakdown: [
    {
      heading: 'The test-time compute idea',
      explanation:
        'For years the main way to make models better was to spend more compute during training: bigger models, more data. Test-time compute (also called inference-time compute) is a different lever: spend more computation when the model answers a specific question, so it can work through the problem instead of blurting the first thing that comes to mind. Concretely, the model generates a chain of intermediate steps before its final answer, which gives it room to break a hard problem into parts, catch its own mistakes, and combine sub-results. This helps most on problems that genuinely require multiple steps (math, logic, planning, careful code), because a single forward pass that must produce the answer immediately has no room to "work it out." The trade is direct: more thinking means more tokens generated, which costs more money and takes more time per answer.',
      keyTerms: [
        {
          term: 'Test-time compute',
          definition:
            'Computation spent while answering a specific question (as opposed to during training), used to let the model reason through a problem before committing to an answer.',
        },
        {
          term: 'Forward pass',
          definition:
            'A single run of the model that produces one next-token prediction. Answering "immediately" gives the model no room to work through multi-step problems.',
        },
        {
          term: 'Reasoning steps',
          definition:
            'Intermediate text the model generates to break a problem into parts and work toward an answer, rather than producing the final answer in one shot.',
        },
      ],
    },
    {
      heading: 'From chain-of-thought prompting to trained reasoning models',
      explanation:
        'Chain-of-thought (CoT) is the original, prompt-level version of this idea: you simply ask the model to "think step by step," and it writes out its reasoning before the answer, which improves accuracy on multi-step tasks. That is a prompting technique you apply to an ordinary model. A trained reasoning model goes further: it is specifically trained (often with reinforcement learning that rewards reaching correct answers) to produce long internal reasoning on its own, without being asked, and to use that thinking time well, for example by exploring approaches and backtracking. The reasoning text is sometimes called thinking tokens or a scratchpad. A key practical detail: some reasoning models keep their detailed thinking hidden and show you only a summary plus the final answer, while still charging for the hidden thinking tokens, because that internal work is real computation even when you do not see it.',
      keyTerms: [
        {
          term: 'Chain-of-thought (CoT)',
          definition:
            'A prompting technique where the model is asked to write out intermediate reasoning before its answer, improving accuracy on multi-step problems.',
        },
        {
          term: 'Trained reasoning model',
          definition:
            'A model trained to generate long, structured reasoning on its own (often via reinforcement learning) rather than relying on the user to prompt for it.',
        },
        {
          term: 'Thinking tokens (scratchpad)',
          definition:
            'The intermediate reasoning tokens a model generates to work through a problem. Sometimes hidden from the user but still computed and usually billed.',
        },
      ],
    },
    {
      heading: 'Getting more out of reasoning: many paths and verification',
      explanation:
        'Once a model can reason, you can spend even more test-time compute to push accuracy further. Self-consistency runs the model several times on the same problem (with sampling, so each run can take a different route) and then picks the answer that shows up most often, which is more reliable than trusting any single run, at the cost of running the model many times. Another powerful pattern is verification: instead of trusting the reasoning, you check it. The model can call a tool (run code, query a database, use a calculator) so a step is validated against ground truth rather than just sounding right, or a separate check confirms the final answer. Tool-checked reasoning is especially valuable because it grounds the model\'s steps in something real, turning "this looks correct" into "this was actually verified," which directly attacks the risk that fluent reasoning is still wrong.',
      keyTerms: [
        {
          term: 'Self-consistency',
          definition:
            'Sampling several independent reasoning paths for one problem and taking the most common final answer, trading more compute for higher reliability.',
        },
        {
          term: 'Verification',
          definition:
            'Checking a reasoning step or final answer against ground truth (a tool, a calculation, a separate checker) instead of trusting that it sounds right.',
        },
        {
          term: 'Tool-checked reasoning',
          definition:
            'Reasoning where the model runs code, queries data, or calls a calculator so steps are validated against real results rather than just generated text.',
        },
      ],
    },
    {
      heading: 'Trade-offs, knowledge, and limits',
      explanation:
        'Reasoning is not free and not always better. The costs are concrete: it generates far more tokens, so it costs more per answer and is slower, sometimes much slower, before the first useful output appears. For simple lookups, formatting, short rewrites, or quick chat, that extra thinking is wasted overhead and can even over-complicate an easy task. A crucial distinction is reasoning versus knowledge: thinking longer helps the model use what it knows more carefully, but it cannot conjure facts it never learned. If the answer depends on information the model lacks, more steps will not fix it, and the right tool is retrieval (giving it the facts), not more reasoning. Finally, more steps do not guarantee correctness: a model can reason confidently to a wrong answer, and the written reasoning is not always a faithful account of how it actually reached its conclusion, so a clean-looking chain of thought is not proof the answer is right.',
      keyTerms: [
        {
          term: 'Reasoning vs knowledge',
          definition:
            'Reasoning helps a model use what it knows, but it cannot supply missing facts. Knowledge gaps are fixed by retrieval, not by thinking longer.',
        },
        {
          term: 'Faithfulness',
          definition:
            "Whether a model's written reasoning actually reflects how it reached its answer. Reasoning traces can be unfaithful, so a tidy chain is not proof of correctness.",
        },
        {
          term: 'Latency',
          definition:
            'The delay before an answer arrives. Reasoning models generate many more tokens, so they are often noticeably slower than standard models.',
        },
      ],
    },
  ],
  cards: [
    {
      id: 'reasoning-0',
      categoryKey: 'reasoning',
      category: 'Reasoning & Test-time Compute',
      subtopic: 'Test-time compute',
      question: 'What does "test-time compute" mean?',
      answer:
        'Test-time compute (or inference-time compute) is computation spent while the model is answering a specific question, rather than during training. The model uses that extra compute to generate intermediate reasoning and work through the problem before producing its final answer.',
      plain:
        'It is the model taking a moment to think before it speaks, and that thinking takes real computing effort. Instead of pouring all the work into building the model once, you let it spend more effort each time it answers a hard question.',
      difficulty: 'core',
    },
    {
      id: 'reasoning-1',
      categoryKey: 'reasoning',
      category: 'Reasoning & Test-time Compute',
      subtopic: 'Test-time compute',
      question:
        'Why can letting a model think longer improve its answers on hard problems?',
      answer:
        'Generating intermediate steps gives the model room to break a hard problem into parts, work out sub-results, and catch its own mistakes, instead of having to produce the final answer in a single immediate pass. Multi-step problems (math, logic, planning, careful code) benefit most because they cannot be solved correctly in one leap.',
      plain:
        'It is the difference between answering a tricky math problem off the top of your head versus working it out on scratch paper. The scratch work lets the model take it one step at a time and fix slips along the way, which is exactly what hard problems need.',
      difficulty: 'core',
    },
    {
      id: 'reasoning-2',
      categoryKey: 'reasoning',
      category: 'Reasoning & Test-time Compute',
      subtopic: 'Chain-of-thought',
      question: 'What is chain-of-thought (CoT) prompting?',
      answer:
        'Chain-of-thought prompting is asking an ordinary model to write out its reasoning step by step before giving the final answer. Producing the intermediate steps improves accuracy on multi-step tasks compared to demanding the answer immediately. It is a prompting technique, not a special model.',
      plain:
        'It is literally telling the model "show your work" or "think step by step." Just like a student who writes out each step is more likely to get a long problem right than one who only writes the final number, the model does better when it reasons out loud first.',
      difficulty: 'core',
    },
    {
      id: 'reasoning-3',
      categoryKey: 'reasoning',
      category: 'Reasoning & Test-time Compute',
      subtopic: 'Trained reasoning models',
      question:
        'How does a trained reasoning model differ from just using chain-of-thought prompting on a standard model?',
      answer:
        'Chain-of-thought is a prompting trick you apply to an ordinary model. A trained reasoning model is specifically trained (often with reinforcement learning that rewards correct final answers) to generate long, structured reasoning on its own, without being asked, and to use that thinking time well, such as exploring approaches and backtracking. The reasoning behavior is built into the model rather than coaxed out by the prompt.',
      plain:
        'Chain-of-thought is reminding any model to show its work. A trained reasoning model has already practiced thinking hard for thousands of hours, so it does deep, self-checking reasoning automatically, without you having to ask, and it is generally better at it.',
      difficulty: 'intermediate',
    },
    {
      id: 'reasoning-4',
      categoryKey: 'reasoning',
      category: 'Reasoning & Test-time Compute',
      subtopic: 'Thinking tokens',
      question:
        'What are "thinking tokens" or a "scratchpad," and do you always get to see them?',
      answer:
        'They are the intermediate reasoning tokens a model generates to work through a problem before the final answer. You do not always see them: some reasoning models hide the detailed chain and show only a summary plus the answer. The hidden thinking is still real computation and is typically billed, even though it is not displayed.',
      plain:
        'Thinking tokens are the model\'s rough work, its scratch paper. Sometimes the app shows it to you, and sometimes it tucks it away and shows only the polished answer. Either way the model actually did that work, and you usually pay for it.',
      difficulty: 'core',
    },
    {
      id: 'reasoning-5',
      categoryKey: 'reasoning',
      category: 'Reasoning & Test-time Compute',
      subtopic: 'Self-consistency',
      question:
        'How does self-consistency use extra compute to get more reliable answers?',
      answer:
        'Self-consistency runs the model several times on the same problem with sampling, so each run can follow a different reasoning path, then takes the answer that appears most often. Agreement across independent attempts is more reliable than any single run, at the cost of running the model many times.',
      plain:
        'It is like asking several people to solve the same puzzle separately and going with the answer most of them landed on. One person might slip, but if five out of seven independent tries agree, you can trust it more. The catch is you paid for all seven tries.',
      difficulty: 'intermediate',
    },
    {
      id: 'reasoning-6',
      categoryKey: 'reasoning',
      category: 'Reasoning & Test-time Compute',
      subtopic: 'Verification',
      question:
        'Why is tool-checked reasoning more trustworthy than reasoning alone?',
      answer:
        'In tool-checked reasoning the model validates steps against ground truth (running code, querying a database, using a calculator) instead of trusting text that merely sounds right. This grounds the reasoning in real results, turning "this looks correct" into "this was actually verified," which directly counters the risk that fluent reasoning is still wrong.',
      plain:
        'It is the difference between saying "I think 17 times 23 is 391" and actually punching it into a calculator. Letting the model check its steps against something real, like running the code, beats trusting a confident-sounding paragraph.',
      difficulty: 'intermediate',
    },
    {
      id: 'reasoning-7',
      categoryKey: 'reasoning',
      category: 'Reasoning & Test-time Compute',
      subtopic: 'When reasoning helps',
      question:
        'What kinds of tasks benefit most from a reasoning model?',
      answer:
        'Tasks that genuinely require multiple dependent steps: hard math, formal logic, multi-step planning, careful debugging or code generation, and problems where the model must combine sub-results or catch its own errors. These reward the extra room to work, where a single-shot answer often fails.',
      plain:
        'Reach for reasoning when the problem has real layers, like a thorny logic puzzle, a multi-step math word problem, or planning a complex sequence. Those are exactly the cases where stopping to work it out pays off.',
      difficulty: 'core',
    },
    {
      id: 'reasoning-8',
      categoryKey: 'reasoning',
      category: 'Reasoning & Test-time Compute',
      subtopic: 'When reasoning hurts',
      question:
        'When is a reasoning model overkill or even counterproductive?',
      answer:
        'For simple lookups, short rewrites, formatting, classification, or quick conversational replies, the extra reasoning is wasted overhead: it costs more and is slower without improving the answer, and it can over-complicate a task that has a direct answer. A standard model is the better fit for easy, single-step work.',
      plain:
        'Asking a reasoning model to capitalize a sentence or answer "what is the capital of France" is like convening a committee to decide what is for lunch. You pay more and wait longer for no benefit, and sometimes it overthinks something that was simple.',
      difficulty: 'intermediate',
    },
    {
      id: 'reasoning-9',
      categoryKey: 'reasoning',
      category: 'Reasoning & Test-time Compute',
      subtopic: 'Cost of thinking',
      question:
        'Why does a reasoning model usually cost more per answer than a standard model?',
      answer:
        'It generates many extra tokens of intermediate reasoning before the final answer, and you are typically billed for those thinking tokens (often at output-token rates) in addition to the visible answer. More thinking means more tokens, which means more cost, even when the thinking is hidden from you.',
      plain:
        'You pay roughly by the amount of text the model produces, and a reasoning model produces a lot of behind-the-scenes scratch work on top of the answer. All that extra thinking shows up on the bill, even if you never see it.',
      difficulty: 'core',
    },
    {
      id: 'reasoning-10',
      categoryKey: 'reasoning',
      category: 'Reasoning & Test-time Compute',
      subtopic: 'Latency of thinking',
      question:
        'How does reasoning affect how long you wait for an answer?',
      answer:
        'Because the model generates a large amount of reasoning before the final answer, reasoning models are often noticeably slower, sometimes seconds to much longer, before useful output appears. The thinking happens first, so the delay before the answer can be substantial compared to a standard model that responds right away.',
      plain:
        'The model does its homework before answering, so you wait through the thinking. For a hard problem that wait is worth it, but if you need a snappy reply, the pause can feel long.',
      difficulty: 'intermediate',
    },
    {
      id: 'reasoning-11',
      categoryKey: 'reasoning',
      category: 'Reasoning & Test-time Compute',
      subtopic: 'Reasoning vs knowledge',
      question:
        'If a model gives a wrong answer because it lacks a fact, will switching to a reasoning model fix it?',
      answer:
        'No. Reasoning helps the model use what it already knows more carefully, but it cannot supply facts it never learned. A knowledge gap is fixed by retrieval (giving the model the relevant documents or data), not by thinking longer. More steps on missing information just produces more confident-sounding error.',
      plain:
        'Thinking harder does not help if you simply do not know the fact. If the answer depends on information the model never saw, the fix is to hand it the source, not to tell it to ponder longer. No amount of reflection recalls a phone number you never learned.',
      difficulty: 'core',
    },
    {
      id: 'reasoning-12',
      categoryKey: 'reasoning',
      category: 'Reasoning & Test-time Compute',
      subtopic: 'Limits',
      question:
        'Why does generating more reasoning steps not guarantee a correct answer?',
      answer:
        'A model can reason fluently and confidently straight to a wrong conclusion: an early mistaken assumption can propagate through every step, and longer chains give more places for errors to enter. Reasoning improves the odds on suitable problems but provides no guarantee, so outputs still need verification on anything that matters.',
      plain:
        'You can show all your work and still get the wrong answer, especially if you started from a bad assumption. More steps raise the chances of being right but never make it certain, so you still check the result.',
      difficulty: 'intermediate',
    },
    {
      id: 'reasoning-13',
      categoryKey: 'reasoning',
      category: 'Reasoning & Test-time Compute',
      subtopic: 'Faithfulness',
      question:
        'What is the "faithfulness" caveat about a model\'s written reasoning?',
      answer:
        'The reasoning text a model writes is not guaranteed to reflect how it actually arrived at its answer. The displayed chain can be a plausible-sounding rationalization rather than the true computation, so a clean, convincing chain of thought is not proof the answer is correct and should not be treated as a reliable audit trail.',
      plain:
        'The explanation the model shows you may be a nice story it tells after the fact, not a true play-by-play of how it really decided. So a tidy, persuasive chain of thought is not the same as proof, and you should not trust it just because the reasoning reads well.',
      difficulty: 'advanced',
    },
    {
      id: 'reasoning-14',
      categoryKey: 'reasoning',
      category: 'Reasoning & Test-time Compute',
      subtopic: 'Choosing a reasoning model',
      question:
        'How should you decide between a reasoning model and a standard model for a given task?',
      answer:
        'Match the tool to the task. Use a reasoning model when the problem is genuinely hard and multi-step (complex math, logic, planning, intricate code) and correctness is worth extra cost and latency. Use a standard model for simple, single-step, latency-sensitive, or high-volume work where the extra thinking adds cost and delay without improving the result.',
      plain:
        'Ask "is this actually hard, or just a quick task?" Save the slow, expensive deep-thinker for the genuinely tough problems, and use the fast standard model for everyday asks. Do not pay for deep thought you do not need.',
      difficulty: 'core',
    },
    {
      id: 'reasoning-15',
      categoryKey: 'reasoning',
      category: 'Reasoning & Test-time Compute',
      subtopic: 'Test-time compute',
      question:
        'Why is test-time compute described as a new "scaling axis" for model performance?',
      answer:
        'Historically, gains came mostly from scaling training (bigger models, more data). Test-time compute adds a second axis: for a fixed trained model you can spend more computation per question (longer reasoning, multiple sampled paths) to get better answers on hard problems. It lets you trade compute at answer time for quality, independent of making the underlying model larger.',
      plain:
        'There are now two ways to get smarter answers: build a bigger model, or let the model you have think longer when it answers. The second is a separate dial you can turn per question, spending more effort on the spot to do better.',
      difficulty: 'advanced',
    },
    {
      id: 'reasoning-16',
      categoryKey: 'reasoning',
      category: 'Reasoning & Test-time Compute',
      subtopic: 'When reasoning helps',
      question:
        'A model gets a tricky multi-step word problem wrong when asked for the answer directly. What is the simplest thing to try first?',
      answer:
        'Prompt it to reason step by step (chain-of-thought) before answering, or switch to a reasoning model. Forcing the intermediate steps lets it break the problem apart and often flips a wrong one-shot answer into a correct worked-out one, without any change to the model\'s knowledge.',
      plain:
        'Before reaching for anything fancy, just add "think it through step by step." Making the model show its work on a multi-step problem is often enough to turn a wrong guess into the right answer.',
      difficulty: 'intermediate',
    },
    {
      id: 'reasoning-17',
      categoryKey: 'reasoning',
      category: 'Reasoning & Test-time Compute',
      subtopic: 'Cost of thinking',
      question:
        'Why can the cost and latency of a reasoning model be hard to predict in advance?',
      answer:
        'The amount of reasoning is not fixed: the model decides how much thinking a problem warrants, so the number of thinking tokens (and thus cost and time) varies with problem difficulty and can be large for hard inputs. Two prompts of similar length can produce very different amounts of hidden reasoning, making per-call cost and latency variable rather than constant.',
      plain:
        'You cannot fully tell in advance how long it will mull something over, because it spends more thought on harder problems. Two questions that look the same length can cost very differently depending on how much the model decides to think.',
      difficulty: 'advanced',
    },
    {
      id: 'reasoning-18',
      categoryKey: 'reasoning',
      category: 'Reasoning & Test-time Compute',
      subtopic: 'Verification',
      question:
        'Why is pairing reasoning with verification considered more robust than scaling reasoning alone?',
      answer:
        'Reasoning alone can still reach a confident wrong answer, and adding more steps does not guarantee catching the error. Verification introduces an independent check against ground truth (a tool result, a calculation, a separate validator), so mistakes are caught by something other than the same reasoning that made them. Combining generation with a separate check is more reliable than trusting longer generation by itself.',
      plain:
        'Thinking longer and then double-checking with a real test beats just thinking longer. If the same mind that made the mistake is the only one reviewing it, errors slip by. An outside check, like running the code, catches what the reasoning missed.',
      difficulty: 'intermediate',
    },
    {
      id: 'reasoning-19',
      categoryKey: 'reasoning',
      category: 'Reasoning & Test-time Compute',
      subtopic: 'Limits',
      question:
        'Is "the model thought for a long time" a reason to trust its answer more?',
      answer:
        'Not on its own. Longer thinking can raise accuracy on suitable problems, but it can also be a long path to a wrong answer, and the visible reasoning may not be faithful to how the answer was actually produced. Trust should come from verification and grounding, not from the length or confidence of the reasoning.',
      plain:
        'A long, elaborate explanation is not proof. Someone can talk confidently for ten minutes and still be wrong. Judge the answer by whether it checks out against real sources, not by how much the model appeared to deliberate.',
      difficulty: 'core',
    },
  ],
};

export default mod;
