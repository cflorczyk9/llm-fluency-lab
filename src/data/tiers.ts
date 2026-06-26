// The four-tier shape of the LLM-literacy curriculum. Tier 1 builds the mental
// model of how the machine works, Tier 2 is hands-on use, Tier 3 is systems and
// agents, and Tier 4 is judgment and the frontier. Module files carry their own
// tier number too; this file is the canonical list and the lookup for all keys.

export interface Tier {
  number: number;
  name: string;
  summary: string;
}

export const TIERS: Tier[] = [
  {
    number: 1,
    name: 'Foundations: how the machine works',
    summary:
      'Build the core mental model of a language model from the ground up: what it is, how text becomes tokens, the transformer and attention that process them, and the pretraining and post-training that give the model its knowledge and manners.',
  },
  {
    number: 2,
    name: 'Working with models',
    summary:
      'Turn the mental model into skill. Write prompts that work, manage the context window, get structured output and tool calls, ground answers in your own data with retrieval, adapt a model by fine-tuning, and measure whether any of it is actually good.',
  },
  {
    number: 3,
    name: 'Systems and agents',
    summary:
      'Move from one prompt to real systems: agents that take actions, multiple agents working together, models that see and hear, and the serving, cost, and reliability concerns that decide whether a deployment survives contact with real users.',
  },
  {
    number: 4,
    name: 'Judgment and frontier',
    summary:
      'Develop the judgment to use these systems responsibly: where they fail, how they reason, how to choose a model, how to handle data and privacy, and where the technology is heading next.',
  },
];

// Every module key mapped to its tier. Kept exhaustive so tierOf never guesses.
const TIER_BY_KEY: Record<string, number> = {
  // Tier 1: Foundations
  intro: 1,
  tokenization: 1,
  architecture: 1,
  attention: 1,
  pretraining: 1,
  posttraining: 1,
  inference: 1,
  // Tier 2: Working with models
  prompting: 2,
  contexteng: 2,
  toolcalling: 2,
  rag: 2,
  finetuning: 2,
  eval: 2,
  // Tier 3: Systems and agents
  agents: 3,
  multiagent: 3,
  multimodal: 3,
  serving: 3,
  economics: 3,
  reliability: 3,
  // Tier 4: Judgment and frontier
  safety: 4,
  reasoning: 4,
  landscape: 4,
  privacy: 4,
  frontier: 4,
};

// Returns the tier (1..4) for a module key, or 0 if the key is unknown.
export function tierOf(key: string): number {
  return TIER_BY_KEY[key] ?? 0;
}
