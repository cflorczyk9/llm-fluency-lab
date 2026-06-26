// Pedagogical order of all 24 modules, prerequisite-aware, tier 1 -> tier 4.
// Earlier keys are foundations for later ones. Program planning walks this order
// (within a tier) so learners build up in a sensible sequence, and the diagnostic
// and learn list fall back to it. 'intro' is always first. This mirrors the
// canonical order in src/data/content.ts and the tier map in src/data/tiers.ts.

export const prerequisiteOrder: string[] = [
  // Tier 1: Foundations (how the machine works)
  'intro',
  'tokenization',
  'architecture',
  'attention',
  'pretraining',
  'posttraining',
  'inference',
  // Tier 2: Working with models
  'prompting',
  'contexteng',
  'toolcalling',
  'rag',
  'finetuning',
  'eval',
  // Tier 3: Systems and agents
  'agents',
  'multiagent',
  'multimodal',
  'serving',
  'economics',
  'reliability',
  // Tier 4: Judgment and frontier
  'safety',
  'reasoning',
  'landscape',
  'privacy',
  'frontier',
];
