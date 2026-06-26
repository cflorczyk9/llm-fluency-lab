import type { Category } from '../../types';

const mod: Category = {
  key: 'prompting',
  name: 'Prompting',
  tier: 2,
  summary:
    'Prompting is the craft of writing inputs that reliably get good outputs: clear instructions, useful examples, the right role, and a sensible structure. It is the single highest-leverage skill for a non-engineer, because most "the model is dumb" moments are really prompt problems in disguise. Small changes in how you ask can swing the answer from useless to excellent.',
  learningObjectives: [
    'By the end you can write clear, specific instructions and explain why specificity helps',
    'By the end you can choose between zero-shot, few-shot, and role or system prompts',
    'By the end you can apply chain-of-thought and step-by-step prompting where it actually helps',
    'By the end you can structure prompts with delimiters, format requests, and worked examples',
    'By the end you can diagnose and fix common prompt failures instead of guessing',
    'By the end you can iterate on a prompt systematically and reuse what works as a template',
  ],
  breakdown: [
    {
      heading: 'Specific instructions beat vague ones',
      explanation:
        'A model cannot read your mind, so it fills any gap you leave with its own best guess. The more you leave unsaid (length, audience, tone, format, what to include or skip), the more the output drifts from what you pictured. Specificity is not about long prompts, it is about naming the things that matter for your task. "Summarize this" invites a guess, while "Summarize this in three bullet points for a busy executive, focusing on the financial risk" closes off the wrong guesses. The skill is learning which details actually change the answer and stating those plainly up front.',
      keyTerms: [
        {
          term: 'Instruction',
          definition:
            'The part of a prompt that tells the model what to do. The clearer and more concrete it is, the less the model has to guess.',
        },
        {
          term: 'Specificity',
          definition:
            'Naming the details that matter (audience, length, format, focus) so the model produces what you actually want instead of a reasonable-but-wrong default.',
        },
        {
          term: 'Underspecification',
          definition:
            'Leaving important details out, which forces the model to invent them. The most common root cause of disappointing outputs.',
        },
      ],
    },
    {
      heading: 'Showing versus telling: zero-shot and few-shot',
      explanation:
        'You can teach a model what you want two ways. Zero-shot means you just describe the task and trust the model to handle it, which works well for common requests. Few-shot means you include a handful of worked examples (input then desired output) right in the prompt, so the model can copy the pattern. Examples are powerful when the task is unusual, the format is fiddly, or words alone keep producing the wrong shape. A good example is worth a paragraph of instructions, because it shows the exact style, length, and structure you want rather than describing it.',
      keyTerms: [
        {
          term: 'Zero-shot',
          definition:
            'Asking the model to do a task with instructions only and no examples. Best for common, well-understood requests.',
        },
        {
          term: 'Few-shot',
          definition:
            'Including a few example input-output pairs in the prompt so the model imitates the pattern. Best for unusual tasks or strict formats.',
        },
        {
          term: 'Demonstration',
          definition:
            'A single example pair in a few-shot prompt. Its job is to show, not tell, the model what a correct answer looks like.',
        },
      ],
    },
    {
      heading: 'Roles: system and user messages',
      explanation:
        'Chat models read more than your latest message. They also read a system message, which sets standing rules and persona for the whole conversation, and your user messages, which carry each specific request. Think of the system message as the job description you hand someone before they start, and user messages as the individual tasks you give them through the day. Putting durable instructions (tone, constraints, who the model is acting as) in the system role keeps them in force across turns, while one-off asks belong in the user role.',
      keyTerms: [
        {
          term: 'System prompt',
          definition:
            'A standing instruction that sets the model\'s role, tone, and rules for the whole conversation, separate from any single request.',
        },
        {
          term: 'User message',
          definition:
            'The specific request you type each turn. It works within the rules the system prompt has already established.',
        },
        {
          term: 'Role prompting',
          definition:
            'Telling the model who to act as ("you are a careful tax accountant") to bias its vocabulary, tone, and priorities toward that perspective.',
        },
      ],
    },
    {
      heading: 'Make it think, and make it formatted',
      explanation:
        'Two structural tricks do a lot of heavy lifting. First, for problems with multiple steps (math, logic, multi-part reasoning), asking the model to work through it step by step before answering often improves accuracy, because it spreads the work across more tokens instead of jumping to a guess. Second, you control the shape of the output by asking for it directly: bullet points, a table, JSON, a specific number of items. Delimiters (clear markers like triple quotes or XML-style tags) keep your instructions, your data, and your examples from blurring together, which prevents the model from treating your source text as a command.',
      keyTerms: [
        {
          term: 'Chain-of-thought',
          definition:
            'Prompting the model to show its reasoning step by step before the final answer, which tends to improve accuracy on multi-step problems.',
        },
        {
          term: 'Output format control',
          definition:
            'Explicitly asking for the structure you want (bullets, table, JSON, fixed length) so the result is easy to use or paste into something else.',
        },
        {
          term: 'Delimiter',
          definition:
            'A clear marker (triple quotes, dashes, or XML-style tags) that separates instructions from data, so the model knows which part to act on and which part to read.',
        },
      ],
    },
    {
      heading: 'Iterating like a scientist',
      explanation:
        'A first prompt is a draft, not a verdict. The reliable way to improve is to change one thing at a time, run it on a few representative inputs, and see whether the output got better or worse. Vague mega-prompts that pile on a dozen requirements usually fail in confusing ways, so it is better to start simple and add constraints only when you see them violated. When a phrasing finally works, save it as a reusable template with blanks to fill in, so you are not reinventing it every time. Treat prompting as testing, not as a one-shot spell.',
      keyTerms: [
        {
          term: 'Prompt iteration',
          definition:
            'Improving a prompt by changing one element, testing on real inputs, and keeping what helps. The opposite of randomly rewording until something works.',
        },
        {
          term: 'Anti-pattern',
          definition:
            'A common prompting habit that backfires, such as cramming many tasks into one prompt, being vague, or relying only on "do not" instructions.',
        },
        {
          term: 'Prompt template',
          definition:
            'A proven prompt with fill-in-the-blank slots, reused across many similar tasks so good wording is captured once and applied many times.',
        },
      ],
    },
  ],
  cards: [
    {
      id: 'prompting-0',
      categoryKey: 'prompting',
      category: 'Prompting',
      subtopic: 'Clear instructions and specificity',
      question: 'Why does being specific in a prompt usually produce better results than being brief and general?',
      answer:
        'Because the model fills any gap you leave with its own default guess. Every detail you omit (length, audience, tone, format, what to focus on) is a decision the model makes for you, often wrongly. Naming the details that matter removes those wrong guesses and steers the output toward what you actually pictured.',
      plain:
        'Asking an AI is like ordering at a restaurant: "get me food" technically works, but you will probably hate what arrives. "A medium-rare burger, no onions, fries on the side" gets you the meal you wanted. Specificity is just spelling out the choices you care about so the model does not pick for you.',
      difficulty: 'core',
    },
    {
      id: 'prompting-1',
      categoryKey: 'prompting',
      category: 'Prompting',
      subtopic: 'Clear instructions and specificity',
      question: 'What typically happens when you give a vague prompt like "make this better"?',
      answer:
        'The model guesses what "better" means and often optimizes for the wrong thing: it might make the text longer when you wanted it shorter, more formal when you wanted it casual, or reworded when you wanted facts added. Without a stated goal, "better" is undefined, so the result is unpredictable.',
      plain:
        'It is like telling a contractor "improve my kitchen" with no budget, style, or priority. You might come back to a knocked-out wall when all you wanted was new cabinet handles. Say what "better" means (shorter, friendlier, more accurate) and you get the change you intended.',
      difficulty: 'core',
    },
    {
      id: 'prompting-2',
      categoryKey: 'prompting',
      category: 'Prompting',
      subtopic: 'Zero-shot vs few-shot',
      question: 'What is a zero-shot prompt?',
      answer:
        'A prompt that describes the task with instructions only and gives no examples of the desired output. You rely on the model\'s general training to know what a good answer looks like. It works well for common, well-understood requests like summarizing, translating, or answering a question.',
      plain:
        'Zero-shot is just asking someone to do a familiar job without showing them a sample first: "translate this to Spanish." For everyday tasks the model has seen a million times, that is all it needs.',
      difficulty: 'core',
    },
    {
      id: 'prompting-3',
      categoryKey: 'prompting',
      category: 'Prompting',
      subtopic: 'Zero-shot vs few-shot',
      question: 'What is a few-shot prompt, and when is it worth the extra effort?',
      answer:
        'A few-shot prompt includes a handful of example input-output pairs before the real request, so the model copies the pattern. It is worth it when the task is unusual, the output format is strict or fiddly, or instructions alone keep producing the wrong shape. Examples show the exact style and structure rather than describing it.',
      plain:
        'It is like training a new hire by showing them two or three finished examples instead of writing a long manual. "Here is an input and the answer I want, here is another, now do this one." Seeing the pattern is often faster and clearer than explaining it.',
      difficulty: 'core',
    },
    {
      id: 'prompting-4',
      categoryKey: 'prompting',
      category: 'Prompting',
      subtopic: 'Zero-shot vs few-shot',
      question: 'How do you decide between a zero-shot and a few-shot prompt?',
      answer:
        'Start zero-shot for common tasks the model clearly understands, since it is simpler and cheaper. Switch to few-shot when zero-shot keeps getting the format, tone, or edge cases wrong, or when the task is niche. The examples cost extra tokens, so you add them only when they are buying you reliability.',
      plain:
        'Try just asking first. If the answers keep coming out in the wrong shape, show two or three examples of exactly what you want. Examples take up space (and a bit of cost), so use them when plain instructions are not enough, not by default.',
      difficulty: 'intermediate',
    },
    {
      id: 'prompting-5',
      categoryKey: 'prompting',
      category: 'Prompting',
      subtopic: 'System vs user roles',
      question: 'What is the difference between a system prompt and a user message?',
      answer:
        'A system prompt sets standing rules, role, and tone for the whole conversation, while a user message carries each specific request. The system prompt persists across turns and shapes how every reply is produced, whereas user messages are the individual tasks you ask within those rules.',
      plain:
        'The system prompt is the job description you hand an employee on day one ("you are our friendly support agent, never give legal advice"). User messages are the day-to-day tasks you send them. The job description stays in force no matter how many tasks you give.',
      difficulty: 'core',
    },
    {
      id: 'prompting-6',
      categoryKey: 'prompting',
      category: 'Prompting',
      subtopic: 'System vs user roles',
      question: 'What kinds of instructions belong in the system prompt rather than in each user message?',
      answer:
        'Durable, conversation-wide instructions: the persona or role, tone, hard constraints, output conventions, and rules that should apply to every reply. One-off requests belong in user messages. Putting standing rules in the system prompt keeps them in effect across all turns without repeating them.',
      plain:
        'Anything you would otherwise have to repeat every single time ("always answer in plain English, never use jargon") goes in the system prompt once. The specific question of the moment goes in the user message. It saves you from nagging the model on every turn.',
      difficulty: 'intermediate',
    },
    {
      id: 'prompting-7',
      categoryKey: 'prompting',
      category: 'Prompting',
      subtopic: 'Chain-of-thought and step-by-step',
      question: 'What is chain-of-thought prompting?',
      answer:
        'Asking the model to work through its reasoning step by step before giving the final answer, instead of jumping straight to a conclusion. On multi-step problems (math, logic, multi-part questions) this often improves accuracy, because the model spreads the work across more tokens rather than guessing in one leap.',
      plain:
        'It is the difference between blurting out an answer and showing your work on a math test. When you make the model think out loud one step at a time, it catches more of its own mistakes and lands the right answer more often.',
      difficulty: 'core',
    },
    {
      id: 'prompting-8',
      categoryKey: 'prompting',
      category: 'Prompting',
      subtopic: 'Chain-of-thought and step-by-step',
      question: 'When does chain-of-thought help, and when is it not worth it?',
      answer:
        'It helps on tasks that genuinely have multiple reasoning steps, such as math, logic puzzles, planning, or multi-part analysis. It is not worth it for simple lookups, classification, or short factual answers, where it just adds tokens, cost, and latency without improving the result. Match the technique to the problem.',
      plain:
        'Making the model think step by step is great for a tricky word problem but pointless for "what is the capital of France." Reasoning out loud costs time and money, so save it for problems that actually need working through.',
      difficulty: 'intermediate',
    },
    {
      id: 'prompting-9',
      categoryKey: 'prompting',
      category: 'Prompting',
      subtopic: 'Chain-of-thought and step-by-step',
      question: 'How does breaking a task into explicit steps improve a prompt?',
      answer:
        'Listing the steps you want ("first extract the dates, then sort them, then summarize") turns one big ambiguous request into a sequence of small clear ones. The model is less likely to skip a part or conflate sub-tasks, and you can see exactly where it went wrong if the output is off.',
      plain:
        'It is like giving directions as a checklist instead of "just get there." Number the steps and the model follows them in order, and if something breaks you can spot which step failed instead of redoing the whole thing.',
      difficulty: 'core',
    },
    {
      id: 'prompting-10',
      categoryKey: 'prompting',
      category: 'Prompting',
      subtopic: 'Output format control',
      question: 'How do you control the format of a model\'s output?',
      answer:
        'Ask for it explicitly: state the structure you want (bullet points, a table, JSON, a fixed number of items, a maximum length) and ideally show a small example. Models follow format requests well, so naming the shape up front saves you from reformatting the answer by hand afterward.',
      plain:
        'If you want a table, say "give me a table with these columns." If you want three bullets, say three bullets. The model is happy to oblige, but only if you tell it the shape. Otherwise you get a wall of prose you then have to chop up yourself.',
      difficulty: 'core',
    },
    {
      id: 'prompting-11',
      categoryKey: 'prompting',
      category: 'Prompting',
      subtopic: 'Delimiters and structure',
      question: 'Why are delimiters (like triple quotes or XML-style tags) useful in a prompt?',
      answer:
        'They draw a clear line between your instructions and the data you want the model to act on, so the model does not confuse the two. This prevents the model from treating text inside your source document as if it were a command, and it makes long prompts easier for the model to parse correctly.',
      plain:
        'Delimiters are like quotation marks around a passage you are handing someone: they say "this part is the material, not me talking to you." Without them, a model can mistake a sentence buried in your pasted document for an instruction and follow it.',
      difficulty: 'intermediate',
    },
    {
      id: 'prompting-12',
      categoryKey: 'prompting',
      category: 'Prompting',
      subtopic: 'Giving examples',
      question: 'What makes a good few-shot example?',
      answer:
        'One that is correct, representative of the real inputs you will send, and formatted exactly the way you want the final output. The examples should also cover the tricky cases you care about, because the model imitates whatever pattern it sees, including any mistakes or inconsistencies in your examples.',
      plain:
        'Your examples are the template the model copies, so they have to be the real deal. If your sample answer is sloppy or in the wrong format, the model will faithfully copy that sloppiness. Show it your best work and it will match it.',
      difficulty: 'intermediate',
    },
    {
      id: 'prompting-13',
      categoryKey: 'prompting',
      category: 'Prompting',
      subtopic: 'Negative instructions and constraints',
      question: 'Why can "do not do X" instructions backfire, and what works better?',
      answer:
        'Telling a model what to avoid still puts the idea in front of it and does not tell it what to do instead, so it can drift or even latch onto the forbidden thing. Stating the positive behavior you want ("write in short plain sentences") is usually more reliable than listing what to avoid ("do not be verbose").',
      plain:
        'Telling someone "don\'t think about a pink elephant" guarantees they picture one. Same with models: "do not use jargon" plants the jargon. Say what you do want instead ("use everyday words") and you steer toward it rather than circling the thing you banned.',
      difficulty: 'intermediate',
    },
    {
      id: 'prompting-14',
      categoryKey: 'prompting',
      category: 'Prompting',
      subtopic: 'Chain-of-thought and step-by-step',
      question: 'Is a model\'s written chain-of-thought a faithful record of how it actually reached the answer?',
      answer:
        'Not necessarily. The stated reasoning often helps accuracy and is useful to read, but it is text generated to look plausible, and it can be a post-hoc rationalization rather than the true internal computation. The model can reach a conclusion and then write reasoning that does not actually drive it.',
      plain:
        'Treat the "here is my thinking" section like a student explaining their answer after the fact: often helpful, sometimes a tidy story made up to justify a guess. It is good context, not proof, so do not trust a conclusion just because the steps sound convincing.',
      difficulty: 'advanced',
    },
    {
      id: 'prompting-15',
      categoryKey: 'prompting',
      category: 'Prompting',
      subtopic: 'Prompt iteration and testing',
      question: 'What is the systematic way to improve a prompt that is not working?',
      answer:
        'Change one element at a time (add a constraint, add an example, restate the format), then run it on several representative inputs and compare. This isolates what actually helped. Randomly rewording the whole prompt until something works teaches you nothing and is hard to repeat.',
      plain:
        'Treat it like cooking: adjust one ingredient, taste, then adjust the next. If you change five things at once and it improves, you have no idea which change did it. Tweak one thing, test on a few real cases, keep what helps.',
      difficulty: 'core',
    },
    {
      id: 'prompting-16',
      categoryKey: 'prompting',
      category: 'Prompting',
      subtopic: 'Common anti-patterns',
      question: 'What is a common prompting anti-pattern that quietly hurts results?',
      answer:
        'Cramming many separate tasks and conflicting requirements into one giant prompt. The model has to juggle them all at once and tends to drop or blur some. Breaking the work into focused prompts, or a clear ordered list of steps, usually produces more reliable output than one overloaded request.',
      plain:
        'It is like handing someone a single sticky note with twelve unrelated chores scrawled on it: a few will get forgotten. Give one clear task at a time, or a tidy numbered list, and far less falls through the cracks.',
      difficulty: 'intermediate',
    },
    {
      id: 'prompting-17',
      categoryKey: 'prompting',
      category: 'Prompting',
      subtopic: 'Prompt templates and reuse',
      question: 'What is a prompt template, and why is it valuable?',
      answer:
        'A prompt template is a proven prompt with fill-in-the-blank slots for the parts that change (the document, the customer name, the topic). It is valuable because it captures good wording once and reuses it across many similar tasks, giving consistent results and saving you from reinventing the prompt every time.',
      plain:
        'Think of a fill-in-the-blanks form letter. You figure out the wording that works once, leave gaps for the bits that vary, and reuse it forever. Every output comes out consistent instead of depending on how you happened to phrase it that day.',
      difficulty: 'intermediate',
    },
    {
      id: 'prompting-18',
      categoryKey: 'prompting',
      category: 'Prompting',
      subtopic: 'Giving examples',
      question: 'How can the choice and order of few-shot examples bias the model\'s output?',
      answer:
        'Models are sensitive to which examples you pick and their order. If most examples show one label or style, the model leans that way regardless of the input, and the last example often carries extra weight (a recency effect). Balancing the examples and varying their order makes the behavior more even and less skewed.',
      plain:
        'If you show the model four "approved" examples and one "rejected," it starts assuming everything is approved. And it tends to copy the last example most strongly. Mix your examples evenly and shuffle the order so it learns the real pattern, not an accidental bias.',
      difficulty: 'advanced',
    },
    {
      id: 'prompting-19',
      categoryKey: 'prompting',
      category: 'Prompting',
      subtopic: 'Common anti-patterns',
      question: 'Why can a tiny wording change in a prompt sometimes flip the answer, and what does that imply?',
      answer:
        'Because the model responds to surface patterns in the exact tokens it sees, so small changes in phrasing, order, or formatting can land in a different part of its learned behavior and shift the output. The implication is that a prompt should be tested on several inputs, not trusted because it worked once.',
      plain:
        'Sometimes swapping "list" for "summarize," or moving a sentence, noticeably changes the result, which feels fragile because it is. It means you cannot trust a prompt just because it nailed one example. Test it on a handful of cases before relying on it.',
      difficulty: 'advanced',
    },
  ],
};

export default mod;
