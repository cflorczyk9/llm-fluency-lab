// Curriculum index. This file assembles the full deck by importing every module
// file from ./modules and exporting them as one ordered `categories` array. It is
// intentionally tiny: all card content, breakdowns, learning objectives, tiers,
// and videos live in the per-module files. Edit a module file to change content,
// not this index.
//
// The 24 modules span four tiers (see ./tiers.ts). The original ten modules keep
// their real videos and their original card ids; the fourteen newer modules have
// no video. The array order below is the canonical teaching order the rest of the
// app reads (study path, learn list, diagnostic breadth): tier 1 -> 4, then a
// sensible within-tier order.

import type { Category } from '../types';

// Tier 1: Foundations (how the machine works)
import intro from './modules/intro';
import tokenization from './modules/tokenization';
import architecture from './modules/architecture';
import attention from './modules/attention';
import pretraining from './modules/pretraining';
import posttraining from './modules/posttraining';
import inference from './modules/inference';

// Tier 2: Working with models
import prompting from './modules/prompting';
import contexteng from './modules/contexteng';
import toolcalling from './modules/toolcalling';
import rag from './modules/rag';
import finetuning from './modules/finetuning';
import evaluation from './modules/eval';

// Tier 3: Systems and agents
import agents from './modules/agents';
import multiagent from './modules/multiagent';
import multimodal from './modules/multimodal';
import serving from './modules/serving';
import economics from './modules/economics';
import reliability from './modules/reliability';

// Tier 4: Judgment and frontier
import safety from './modules/safety';
import reasoning from './modules/reasoning';
import landscape from './modules/landscape';
import privacy from './modules/privacy';
import frontier from './modules/frontier';

export const categories: Category[] = [
  // Tier 1: Foundations
  intro,
  tokenization,
  architecture,
  attention,
  pretraining,
  posttraining,
  inference,
  // Tier 2: Working with models
  prompting,
  contexteng,
  toolcalling,
  rag,
  finetuning,
  evaluation,
  // Tier 3: Systems and agents
  agents,
  multiagent,
  multimodal,
  serving,
  economics,
  reliability,
  // Tier 4: Judgment and frontier
  safety,
  reasoning,
  landscape,
  privacy,
  frontier,
];
