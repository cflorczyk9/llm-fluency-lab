// Module: Post-training & Alignment (tier 1). Deepened from the original deck.
// Existing cards posttraining-0..posttraining-13 are carried over verbatim with
// their original ids, summary/breakdown/video preserved. New cards
// posttraining-14..21 add alignment goals, the helpful/harmless tension, system
// prompts, persona, refusals, sycophancy, and reward hacking.

import type { Category } from '../../types';

const mod: Category = {
  key: 'posttraining',
  name: 'Post-training & Alignment',
  tier: 1,
  summary:
    'After pretraining, a raw model is steered into a helpful assistant through instruction tuning and human feedback. This is where manners, refusals, tone, and alignment come from.',
  learningObjectives: [
    'By the end you can distinguish a base model from an instruction-tuned chat model',
    'By the end you can explain supervised fine-tuning and reinforcement learning from human feedback in plain terms',
    'By the end you can describe what a reward model and preference data do',
    'By the end you can explain what alignment means and the trade-off between helpfulness and harmlessness',
    'By the end you can describe newer methods like DPO and AI-feedback approaches at a high level',
    'By the end you can connect post-training to refusals, tone, and system-prompt behavior',
  ],
  breakdown: [
    {
      heading: 'Why a raw model needs post-training (base vs instruct/chat models)',
      explanation:
        'Pretraining produces a base model whose only skill is predicting the most likely next token given all the internet text it read. That makes it a powerful pattern-completer but a bad assistant: ask it a question and it may continue with more questions, repeat the prompt, or drift, because plausible internet text often looks like that. Post-training reshapes this raw capability into instruction-following and conversational behavior without teaching the model much new factual knowledge (knowledge mostly comes from pretraining). The result is split into two flavors people use loosely: a base/foundation model (raw completer) and an instruct or chat model (the post-trained version aligned to be helpful, honest, and harmless). The knowledge is already in there after pretraining; post-training mostly changes how the model uses and presents it.',
      keyTerms: [
        {
          term: 'Base model (foundation model)',
          definition:
            'The raw output of pretraining. It predicts the next token well but does not reliably follow instructions or chat; it just continues text.',
        },
        {
          term: 'Instruct / chat model',
          definition:
            'A base model that has gone through post-training so it follows instructions, answers questions, holds multi-turn conversations, and refuses harmful requests.',
        },
        {
          term: 'Alignment',
          definition:
            "The broad goal of post-training: making a model's behavior match human intent and values, often summarized as helpful, honest, and harmless.",
        },
      ],
    },
    {
      heading: 'Supervised fine-tuning (SFT): teaching the model the format of a good answer',
      explanation:
        'SFT is the first and simplest post-training step. You take the base model and continue training it (still next-token prediction) but now on a curated dataset of example prompts paired with high-quality human-written ideal responses. By imitating thousands of these demonstrations, the model learns the shape of a good answer: that a question should get a direct answer, that instructions should be followed, that a chat turn ends cleanly. SFT is imitation learning: the model copies the demonstrations it is shown. It is fast and effective at establishing baseline instruction-following, but it has a ceiling. It can only imitate the specific responses in the dataset, and writing enough high-quality demonstrations to cover every nuance (tone, refusal style, degree of helpfulness) is expensive and hard, which is the gap that preference-based methods fill next.',
      keyTerms: [
        {
          term: 'Supervised fine-tuning (SFT)',
          definition:
            'Continuing to train the base model on curated (prompt, ideal-response) pairs so it learns to follow instructions by imitation. Also called instruction tuning.',
        },
        {
          term: 'Demonstration data',
          definition:
            'The training examples for SFT: prompts paired with human-written model responses that show the desired behavior.',
        },
        {
          term: 'Instruction tuning',
          definition:
            'Another name for SFT, emphasizing that the demonstrations span many instruction types so the model generalizes to following instructions broadly.',
        },
      ],
    },
    {
      heading: 'RLHF: learning from preferences via a reward model',
      explanation:
        'RLHF (Reinforcement Learning from Human Feedback) goes beyond imitation by teaching the model what humans prefer, not just what to copy. It runs in stages. First, you collect preference data: for a given prompt, the model generates two or more candidate answers and a human labels which one is better. Second, you train a separate reward model (RM) on these comparisons so it can take any (prompt, response) and output a scalar score predicting how much a human would like it. Third, you use reinforcement learning (classically the PPO algorithm) to update the main model so it generates responses the reward model scores highly, while a penalty (a KL term) keeps it from drifting too far from the SFT model and producing degenerate text. The key insight is that judging which of two answers is better is far easier and cheaper for humans than writing the ideal answer from scratch, so RLHF can push quality past the SFT ceiling.',
      keyTerms: [
        {
          term: 'RLHF',
          definition:
            'Reinforcement Learning from Human Feedback: aligning a model by training a reward model on human preference comparisons, then using RL to optimize the model against that reward.',
        },
        {
          term: 'Reward model (RM)',
          definition:
            'A separate model trained on human preference data that scores a (prompt, response) pair, acting as a learned stand-in for human judgment during RL.',
        },
        {
          term: 'Preference data',
          definition:
            'Datasets of comparisons where humans pick the better of two (or more) model responses to the same prompt. Cheaper to produce than full demonstrations.',
        },
        {
          term: 'PPO and the KL penalty',
          definition:
            'PPO (Proximal Policy Optimization) is the classic RL algorithm used in RLHF. A KL-divergence penalty keeps the tuned model close to the SFT model so it does not overoptimize the reward and degrade.',
        },
      ],
    },
    {
      heading: 'RLAIF and DPO: cheaper feedback and skipping the reward model',
      explanation:
        "Two big follow-ups address RLHF's main pain points. RLAIF (Reinforcement Learning from AI Feedback) replaces expensive human labelers with an AI model that compares responses, often guided by a written set of principles. Anthropic's Constitutional AI is the well-known version: the model critiques and revises its own answers against a written 'constitution,' and an AI judge generates the preference labels, which makes alignment far more scalable and consistent. DPO (Direct Preference Optimization) attacks a different cost: it removes the separate reward model and the RL loop entirely. DPO uses a clever loss function that trains the model directly on the (preferred, rejected) pairs, mathematically achieving the same preference-optimization goal as RLHF but as a single supervised-style step. DPO is simpler, more stable, and cheaper to run, which is why it became hugely popular, though large labs still use full RL-based methods where they want maximum control.",
      keyTerms: [
        {
          term: 'RLAIF',
          definition:
            'Reinforcement Learning from AI Feedback: using an AI model (instead of humans) to generate the preference labels, making alignment cheaper and more scalable.',
        },
        {
          term: 'Constitutional AI',
          definition:
            "Anthropic's RLAIF approach where the model critiques and revises its outputs against a written set of principles (a 'constitution'), and AI-generated preferences drive training.",
        },
        {
          term: 'DPO (Direct Preference Optimization)',
          definition:
            'A method that optimizes a model directly on preferred-vs-rejected response pairs using a special loss, skipping the separate reward model and RL loop while targeting the same objective.',
        },
        {
          term: 'Preference optimization',
          definition:
            'The general class of methods (RLHF, DPO, and variants) that align a model using comparisons of which response is better rather than imitation of a single ideal answer.',
        },
      ],
    },
  ],
  video: {
    url: 'https://www.youtube.com/watch?v=T_X4XFwKX8k',
    title: 'Reinforcement Learning from Human Feedback (RLHF) Explained',
    channel: 'IBM Technology',
  },
  cards: [
    {
      id: 'posttraining-0',
      categoryKey: 'posttraining',
      category: 'Post-training & Alignment',
      subtopic: 'Base vs instruct models',
      question:
        'What single capability does a base model have right after pretraining, and why does that make it a poor assistant out of the box?',
      answer:
        'It can only predict the next token given prior text. That makes it a strong text completer but a poor assistant, because answering a question reliably or following an instruction is not the same as continuing plausible text. A base model might respond to a question with more questions or by repeating the prompt.',
      plain:
        'Think of a raw model like the autocomplete on your phone, just vastly more powerful: all it knows how to do is guess the next word that should follow. It has not yet learned that a question deserves an answer, so it might just keep the text going instead of helping you.',
      difficulty: 'core',
    },
    {
      id: 'posttraining-1',
      categoryKey: 'posttraining',
      category: 'Post-training & Alignment',
      subtopic: 'Why post-training exists',
      question: 'In one sentence, what is the purpose of the post-training stage?',
      answer:
        'To turn a raw next-token-predicting base model into a useful assistant that follows instructions, holds conversations, and behaves safely (helpful, honest, harmless), without teaching it much new factual knowledge.',
      plain:
        'Post-training is like finishing school for a brilliant but socially clueless graduate: it does not cram in new facts, it teaches manners and how to actually be helpful in a conversation. The smarts were already there; this stage shapes the behavior.',
      difficulty: 'core',
    },
    {
      id: 'posttraining-2',
      categoryKey: 'posttraining',
      category: 'Post-training & Alignment',
      subtopic: 'Why post-training exists',
      question:
        'True distinction check: where does a model\'s factual knowledge mostly come from, pretraining or post-training, and what does post-training mostly change instead?',
      answer:
        'Knowledge mostly comes from pretraining. Post-training mostly changes behavior: how the model uses and presents what it already knows (instruction-following, format, tone, refusals), not what facts it knows.',
      plain:
        'The model learns its facts during the first big phase (reading the internet), and the later phase mostly teaches it how to behave and present those facts, not new trivia. It is the difference between knowing a lot and knowing how to share it usefully.',
      difficulty: 'intermediate',
    },
    {
      id: 'posttraining-3',
      categoryKey: 'posttraining',
      category: 'Post-training & Alignment',
      subtopic: 'SFT',
      question: 'What is supervised fine-tuning (SFT) and what kind of data does it train on?',
      answer:
        'SFT continues training the base model on curated pairs of (prompt, high-quality human-written ideal response). The model learns instruction-following by imitating these demonstrations. It is the same next-token objective as pretraining, just on a focused dataset.',
      plain:
        'This is teaching by example: you show the model thousands of question-and-good-answer pairs written by people, and it learns to copy that style. Like an apprentice watching an expert do a job over and over until they can do it too.',
      difficulty: 'core',
    },
    {
      id: 'posttraining-4',
      categoryKey: 'posttraining',
      category: 'Post-training & Alignment',
      subtopic: 'SFT',
      question:
        'Why is SFT described as imitation learning, and what is its main ceiling or limitation?',
      answer:
        'SFT teaches the model by copying demonstration responses, so it imitates the specific answers it was shown. Its ceiling is that high-quality demonstrations are expensive to write and can only cover so many nuances, so the model cannot easily exceed the quality of the examples it imitated.',
      plain:
        'Because the model only mimics the examples it saw, it can rarely get better than the people who wrote those examples (a copycat does not beat the original). And writing enough great examples by hand to cover every situation is slow and costly.',
      difficulty: 'intermediate',
    },
    {
      id: 'posttraining-5',
      categoryKey: 'posttraining',
      category: 'Post-training & Alignment',
      subtopic: 'RLHF',
      question: 'Walk through the three stages of classic RLHF.',
      answer:
        '1) Collect preference data: humans compare two or more model responses to a prompt and pick the better one. 2) Train a reward model on those comparisons to score any (prompt, response). 3) Use reinforcement learning (PPO) to update the main model to produce responses the reward model scores highly, with a KL penalty to keep it close to the SFT model.',
      plain:
        'First, people pick the better of two answers, like a taste test. Then you train a separate judge to predict those picks automatically, and finally you coach the main model to chase higher scores from that judge while not changing so much that it goes off the rails.',
      difficulty: 'intermediate',
    },
    {
      id: 'posttraining-6',
      categoryKey: 'posttraining',
      category: 'Post-training & Alignment',
      subtopic: 'RLHF',
      question: 'What is a reward model in RLHF and what does it output?',
      answer:
        'A reward model is a separate model trained on human preference comparisons. Given a (prompt, response) pair it outputs a scalar score that predicts how much a human would prefer that response. It acts as a learned, automated stand-in for human judgment during the RL step.',
      plain:
        'It is an automated judge that watched lots of human ratings and now scores any answer with a single number for how much a person would like it. That lets training run at machine speed instead of waiting for a human to rate everything.',
      difficulty: 'core',
    },
    {
      id: 'posttraining-7',
      categoryKey: 'posttraining',
      category: 'Post-training & Alignment',
      subtopic: 'RLHF',
      question:
        'Why is collecting preference comparisons often more practical than collecting demonstrations for SFT?',
      answer:
        'Judging which of two answers is better is much easier, faster, and cheaper for a human than writing the single ideal answer from scratch. This is what lets preference-based methods like RLHF push response quality past the SFT ceiling.',
      plain:
        'It is far easier to say which of two dishes tastes better than to cook the perfect dish yourself. So having people pick a winner is cheaper than having them write flawless answers, and it lets the model improve faster.',
      difficulty: 'intermediate',
    },
    {
      id: 'posttraining-8',
      categoryKey: 'posttraining',
      category: 'Post-training & Alignment',
      subtopic: 'RLHF',
      question: 'In RLHF, what is the KL-divergence penalty for, and what goes wrong without it?',
      answer:
        'The KL penalty keeps the RL-tuned model from drifting too far from the SFT model. Without it the model overoptimizes the reward model (reward hacking) and can produce degenerate or unnatural text that scores high on the reward but is actually bad.',
      plain:
        'It is a leash that stops the model from straying too far from its sensible starting point while chasing a high score. Without the leash, the model games the judge (like a student who learns to ace the test without actually learning) and starts spitting out gibberish that scores well but reads terribly.',
      difficulty: 'advanced',
    },
    {
      id: 'posttraining-9',
      categoryKey: 'posttraining',
      category: 'Post-training & Alignment',
      subtopic: 'RLAIF',
      question: 'What does RLAIF change relative to RLHF, and what problem does that solve?',
      answer:
        'RLAIF (Reinforcement Learning from AI Feedback) replaces human labelers with an AI model that generates the preference comparisons. This solves the cost and scalability bottleneck of human labeling and can give more consistent labels.',
      plain:
        'Instead of paying people to pick the better answer, you let another AI do the picking. That is much cheaper and faster, and the AI judge does not get tired or change its mind from one day to the next.',
      difficulty: 'core',
    },
    {
      id: 'posttraining-10',
      categoryKey: 'posttraining',
      category: 'Post-training & Alignment',
      subtopic: 'RLAIF',
      question: 'What is Constitutional AI and which lab is it associated with?',
      answer:
        "Constitutional AI is Anthropic's RLAIF method. The model critiques and revises its own responses against a written set of principles (a 'constitution'), and an AI judge generates the preference labels used for training, reducing reliance on human feedback for harmlessness.",
      plain:
        "Anthropic gives the model a short written rulebook (a 'constitution') and has it grade and fix its own answers against those rules. It is like an employee checking their own work against the company handbook instead of needing a manager to review every task.",
      difficulty: 'intermediate',
    },
    {
      id: 'posttraining-11',
      categoryKey: 'posttraining',
      category: 'Post-training & Alignment',
      subtopic: 'DPO',
      question: 'What does DPO eliminate compared to RLHF, and what does it train on directly?',
      answer:
        'DPO (Direct Preference Optimization) eliminates both the separate reward model and the reinforcement-learning loop. It trains the model directly on (preferred, rejected) response pairs using a special loss, achieving the same preference-optimization goal in a single supervised-style step.',
      plain:
        'DPO skips building a separate judge and the whole trial-and-error coaching loop. It just shows the model the winning and losing answers side by side and teaches it to lean toward the winners directly, which is a much simpler one-step recipe.',
      difficulty: 'intermediate',
    },
    {
      id: 'posttraining-12',
      categoryKey: 'posttraining',
      category: 'Post-training & Alignment',
      subtopic: 'DPO',
      question:
        'Why did DPO become so popular versus PPO-based RLHF, and what is the tradeoff for large labs?',
      answer:
        'DPO is simpler, more stable, and cheaper because it skips training and serving a separate reward model and the unstable RL loop. The tradeoff is less fine-grained control over the optimization, so large labs sometimes still prefer full RL-based methods when they want maximum control.',
      plain:
        'DPO is the easy, reliable, low-cost option because it drops the extra moving parts that often break. The catch is you get fewer dials to fine-tune the result, so big labs that want precise control sometimes stick with the more complicated method.',
      difficulty: 'advanced',
    },
    {
      id: 'posttraining-13',
      categoryKey: 'posttraining',
      category: 'Post-training & Alignment',
      subtopic: 'Pipeline overview',
      question: 'Order the typical post-training pipeline and name what each stage contributes.',
      answer:
        'Start from the pretrained base model, then SFT to establish instruction-following by imitation, then a preference-optimization stage (RLHF, RLAIF, or DPO) to push quality and alignment past what imitation alone can reach. SFT sets the baseline format; preference methods refine behavior toward what humans actually prefer.',
      plain:
        'The recipe goes: take the raw model, first teach it by example so it learns the basic shape of good answers, then polish it using human (or AI) preferences so it goes beyond mere copying. The first step sets the format, the second makes it genuinely better.',
      difficulty: 'core',
    },
    {
      id: 'posttraining-14',
      categoryKey: 'posttraining',
      category: 'Post-training & Alignment',
      subtopic: 'Alignment goals',
      question: "What does 'alignment' mean in post-training, and what is the common 'HHH' shorthand?",
      answer:
        'Alignment means shaping a model\'s behavior to match human intent and values. A common shorthand for the goals is HHH: helpful (actually assists the user), honest (does not knowingly mislead or fabricate), and harmless (avoids enabling serious harm). Post-training is where these goals are instilled.',
      plain:
        "Alignment is getting the model to want what we want, behaving the way a thoughtful, trustworthy assistant would. People sum up the target as 'helpful, honest, and harmless,' meaning it should actually help you, tell the truth, and not assist with dangerous stuff.",
      difficulty: 'core',
    },
    {
      id: 'posttraining-15',
      categoryKey: 'posttraining',
      category: 'Post-training & Alignment',
      subtopic: 'Helpfulness vs harmlessness',
      question:
        'Why can the goals of helpfulness and harmlessness conflict, and what is the failure mode if harmlessness is over-weighted?',
      answer:
        'Refusing risky requests serves harmlessness but can hurt helpfulness, and being maximally helpful can occasionally aid harm. If harmlessness is over-weighted, the model over-refuses: it declines benign requests that merely sound sensitive, frustrating users. Tuning post-training is partly about balancing this tension.',
      plain:
        "A model that never refuses anything could be dangerous, but one that refuses too eagerly becomes useless, turning down harmless questions just because they pattern-match to something scary. Post-training has to find the middle, and tilting too far toward caution gives you the annoying 'I can't help with that' on perfectly fine requests.",
      difficulty: 'intermediate',
    },
    {
      id: 'posttraining-16',
      categoryKey: 'posttraining',
      category: 'Post-training & Alignment',
      subtopic: 'System prompt',
      question: 'What is a system prompt, and how does it differ from the behavior baked in during post-training?',
      answer:
        "A system prompt is a special instruction placed at the start of a conversation that sets the model's role, tone, and rules for that session. Unlike post-training, which permanently shapes the weights, the system prompt steers behavior at runtime and can be changed per application without any retraining.",
      plain:
        "The system prompt is like a job briefing handed to the model at the start of a shift: 'you are a polite support agent, keep answers short.' Post-training is the model's upbringing, fixed and permanent, while the system prompt is changeable instructions for today's task, no retraining required.",
      difficulty: 'core',
    },
    {
      id: 'posttraining-17',
      categoryKey: 'posttraining',
      category: 'Post-training & Alignment',
      subtopic: 'Persona',
      question: "Where does an assistant's consistent tone or 'personality' come from?",
      answer:
        'Mainly from post-training: the demonstration data and preference data reward a particular voice (for example warm, measured, and helpful), so the model learns that style. A system prompt can then nudge or override it at runtime. The personality is a trained-in behavior, not a literal self.',
      plain:
        'The assistant\'s steady voice is taught, not innate. During post-training it was repeatedly rewarded for sounding a certain way, so that tone stuck, the way an employee absorbs a company\'s house style. A system prompt can dial it up or down for a given app.',
      difficulty: 'core',
    },
    {
      id: 'posttraining-18',
      categoryKey: 'posttraining',
      category: 'Post-training & Alignment',
      subtopic: 'Refusals',
      question: "Where do a chat model's refusals come from, and were they present in the base model?",
      answer:
        'Refusals are installed during post-training, through demonstrations and preference data that reward declining harmful or disallowed requests. A raw base model has no notion of refusing, it would just continue the text, so refusal behavior is a learned post-training overlay, not an inherent property.',
      plain:
        "The base model would happily continue almost any text because it only learned to predict words. The habit of saying 'I won't help with that' is added later, by training it on examples where refusing was the rewarded response. Refusals are a learned manner, not something the raw model came with.",
      difficulty: 'core',
    },
    {
      id: 'posttraining-19',
      categoryKey: 'posttraining',
      category: 'Post-training & Alignment',
      subtopic: 'Sycophancy',
      question: 'What is sycophancy in language models, and why can preference-based training encourage it?',
      answer:
        'Sycophancy is the tendency to tell users what they seem to want to hear (agreeing, flattering, caving to pushback) rather than what is accurate. It can arise because human raters often prefer agreeable, validating answers, so training to maximize human preference can inadvertently reward telling people what they like over telling them the truth.',
      plain:
        'Sycophancy is a yes-man model: it agrees with you or flatters you instead of being straight, and folds the moment you push back. It creeps in because raters tend to give higher marks to answers that please them, so optimizing for what people rate highly can quietly teach the model to be a people-pleaser.',
      difficulty: 'intermediate',
    },
    {
      id: 'posttraining-20',
      categoryKey: 'posttraining',
      category: 'Post-training & Alignment',
      subtopic: 'Reward hacking',
      question: "What is reward hacking in alignment, and how does Goodhart's law explain it?",
      answer:
        "Reward hacking is when a model maximizes the measured reward signal without achieving the goal the reward was meant to capture, for example padding answers because longer responses happened to score higher. Goodhart's law ('when a measure becomes a target, it stops being a good measure') explains it: the reward model is only a proxy for human preference, and aggressively optimizing the proxy diverges from the real intent.",
      plain:
        "Reward hacking is gaming the metric: if longer answers happen to score better, the model just writes longer answers whether or not that helps. Goodhart's law captures it: once you turn a score into the goal, the model finds ways to win the score that miss the actual point, like a worker optimizing for the dashboard instead of the customer.",
      difficulty: 'advanced',
    },
    {
      id: 'posttraining-21',
      categoryKey: 'posttraining',
      category: 'Post-training & Alignment',
      subtopic: 'SFT limits',
      question: 'Why can fine-tuning a model on confident expert answers sometimes increase hallucination?',
      answer:
        'If demonstrations show the model giving confident, complete answers, it learns the style of confidence even for questions whose answers are not in its weights. It imitates sounding like an expert rather than checking what it actually knows, so it may state false facts confidently. This is one reason post-training also emphasizes honesty and calibrated uncertainty, not just helpfulness.',
      plain:
        'Train a model only on examples of experts answering crisply, and it learns to sound crisp and sure even when it does not actually know, like a student who copied the confident tone of an A-student without the knowledge. That can make it state wrong things boldly, which is why training also has to reward admitting uncertainty.',
      difficulty: 'intermediate',
    },
  ],
};

export default mod;
