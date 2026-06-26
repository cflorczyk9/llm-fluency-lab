// Module: Multi-agent Systems (new)

import type { Category } from '../../types';

const mod: Category = {
  "key": "multiagent",
  "name": "Multi-agent Systems",
  "tier": 3,
  "learningObjectives": [
    "By the end you can explain why and when to use multiple agents instead of one",
    "By the end you can describe the common patterns: orchestrator-worker, pipeline, debate, and supervisor",
    "By the end you can explain how agents communicate and hand off tasks to each other",
    "By the end you can identify failure modes that are unique to multi-agent setups",
    "By the end you can weigh the cost and latency overhead a multi-agent design adds",
    "By the end you can decide when a single strong agent beats a crowd of weaker ones"
  ],
  "summary": "When one agent is not enough, you can run several specialized agents that divide the work, hand tasks to each other, debate, or check each other's output. This module covers the main orchestration patterns, what they buy you, and the catch: more agents usually means more cost, more latency, and more ways for the system to go wrong. The goal is to reason about when a team of agents actually helps versus when one strong agent is simpler and better.",
  "breakdown": [
    {
      "heading": "Why use more than one agent",
      "video": { "url": "https://www.youtube.com/watch?v=sWH0T4Zez6I", "title": "Multi Agent Systems Explained: How AI Agents & LLMs Work Together", "channel": "IBM Technology" },
      "explanation": "A single agent holds one conversation, one set of instructions, and one growing pile of context. That works until the task gets large or has very different parts. As the context fills with unrelated detail, a single agent loses focus and quality drops. Splitting the work lets each agent keep a short, focused context and a narrow job, which often raises quality and lets independent parts run in parallel. The trade is real: every extra agent is another full model running, so you pay more tokens, add coordination overhead, and create new ways for the pieces to disagree or drop the ball. Multi-agent designs earn their keep when the work genuinely separates into distinct skills or parallel chunks, not when you are just adding agents for their own sake.",
      "keyTerms": [
        {
          "term": "multi-agent system",
          "definition": "A setup where two or more model-driven agents, each with its own role, instructions, and often its own tools, work together on a task instead of one agent doing everything."
        },
        {
          "term": "context isolation",
          "definition": "Giving each agent only the slice of information it needs, so its context stays short and focused instead of one agent juggling everything at once."
        },
        {
          "term": "parallelism",
          "definition": "Running independent sub-tasks at the same time on separate agents to finish sooner, possible only when the sub-tasks do not depend on each other's output."
        }
      ],
      "caption": "One agent juggling everything loses focus as its context fills up. Splitting the work gives each agent a short context and one job, and independent parts can run at the same time.",
      "svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 200" width="100%" preserveAspectRatio="xMidYMid meet" role="img" font-family="system-ui, -apple-system, Segoe UI, Roboto, sans-serif">
<title>One overloaded agent versus several focused agents</title>
<style>.ma1dot{animation:ma1flow 2.4s linear infinite}@keyframes ma1flow{0%{transform:translateX(0);opacity:0}15%{opacity:1}85%{opacity:1}100%{transform:translateX(40px);opacity:0}}@media (prefers-reduced-motion: reduce){.ma1dot{animation:none;opacity:0}}</style>
<defs><marker id="ma1ar" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="#6b7280"/></marker></defs>
<rect x="0.5" y="0.5" width="359" height="199" rx="10" fill="#ffffff" stroke="#e6dfce"/>
<text x="70" y="30" font-size="12" font-weight="600" fill="#1c1d1f" text-anchor="middle">One agent</text>
<rect x="22" y="40" width="96" height="118" rx="8" fill="#efe9da" stroke="#e6dfce"/>
<text x="70" y="56" font-size="9.5" fill="#6b7280" text-anchor="middle">mixed context</text>
<rect x="34" y="66" width="72" height="7" rx="2" fill="#2f8cff"/>
<rect x="34" y="79" width="60" height="7" rx="2" fill="#d97706"/>
<rect x="34" y="92" width="76" height="7" rx="2" fill="#1f7a50"/>
<rect x="34" y="105" width="54" height="7" rx="2" fill="#0b5394"/>
<rect x="34" y="118" width="70" height="7" rx="2" fill="#6b7280"/>
<rect x="34" y="131" width="62" height="7" rx="2" fill="#d97706"/>
<text x="70" y="152" font-size="9" fill="#dc2626" text-anchor="middle">focus drops</text>
<line x1="124" y1="100" x2="166" y2="100" stroke="#6b7280" stroke-width="1.5" marker-end="url(#ma1ar)"/>
<text x="145" y="92" font-size="9" fill="#6b7280" text-anchor="middle">split</text>
<circle class="ma1dot" cx="126" cy="100" r="3" fill="#2f8cff"/>
<text x="272" y="30" font-size="12" font-weight="600" fill="#1c1d1f" text-anchor="middle">Focused agents</text>
<rect x="196" y="42" width="150" height="32" rx="7" fill="#ffffff" stroke="#e6dfce"/>
<circle cx="212" cy="58" r="6" fill="#2f8cff"/>
<rect x="226" y="54" width="104" height="7" rx="2" fill="#efe9da"/>
<rect x="196" y="82" width="150" height="32" rx="7" fill="#ffffff" stroke="#e6dfce"/>
<circle cx="212" cy="98" r="6" fill="#1f7a50"/>
<rect x="226" y="94" width="104" height="7" rx="2" fill="#efe9da"/>
<rect x="196" y="122" width="150" height="32" rx="7" fill="#ffffff" stroke="#e6dfce"/>
<circle cx="212" cy="138" r="6" fill="#0b5394"/>
<rect x="226" y="134" width="104" height="7" rx="2" fill="#efe9da"/>
<text x="272" y="172" font-size="9.5" fill="#6b7280" text-anchor="middle">short context, runs in parallel</text>
</svg>`
    },
    {
      "heading": "The main coordination patterns",
      "video": { "url": "https://www.youtube.com/watch?v=l_i7icCA56c", "title": "5 Multi-Agent Orchestration Patterns You MUST Know in 2025!", "channel": "AI Anytime" },
      "explanation": "A few shapes cover most multi-agent designs. In orchestrator-worker, one lead agent breaks the goal into sub-tasks, hands each to a worker agent, and assembles the results. The workers do not see the whole picture, only their slice. In a pipeline, agents are chained in a fixed order and each one's output is the next one's input, like an assembly line. In debate (or ensemble), several agents tackle the same question independently and their answers are compared or voted on to surface a stronger result. In the supervisor-and-critic pattern, one agent produces work and another agent reviews it, catching errors before the output ships. Real systems often combine these: an orchestrator whose workers each run a small pipeline, with a critic checking the final assembly.",
      "keyTerms": [
        {
          "term": "orchestrator-worker",
          "definition": "A lead agent splits the goal into sub-tasks, delegates each to a worker agent, and combines the results. The orchestrator holds the plan. Workers handle focused pieces."
        },
        {
          "term": "pipeline",
          "definition": "Agents arranged in a fixed sequence where each one's output feeds the next, like an assembly line. Order is hard-coded, not decided by the model."
        },
        {
          "term": "debate / ensemble",
          "definition": "Several agents answer the same question independently, then their answers are compared, voted on, or merged to reduce the chance any single one is wrong."
        },
        {
          "term": "supervisor / critic",
          "definition": "A reviewer agent that checks another agent's output for errors, policy violations, or missed requirements before it is accepted, adding a second set of eyes."
        }
      ],
      "caption": "Most designs are one of four shapes. An orchestrator hands slices to workers, a pipeline chains steps in order, a debate compares independent answers, and a critic reviews another agent's work.",
      "svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 200" width="100%" preserveAspectRatio="xMidYMid meet" role="img" font-family="system-ui, -apple-system, Segoe UI, Roboto, sans-serif">
<title>Four common multi-agent coordination patterns</title>
<style>.ma2p{animation:ma2pulse 2.6s ease-in-out infinite}@keyframes ma2pulse{0%,100%{opacity:1}50%{opacity:.5}}@media (prefers-reduced-motion: reduce){.ma2p{animation:none}}</style>
<defs><marker id="ma2ar" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7 z" fill="#6b7280"/></marker></defs>
<rect x="0.5" y="0.5" width="359" height="199" rx="10" fill="#ffffff" stroke="#e6dfce"/>
<line x1="180" y1="16" x2="180" y2="184" stroke="#e6dfce"/>
<line x1="16" y1="100" x2="344" y2="100" stroke="#e6dfce"/>
<text x="97" y="30" font-size="9.5" font-weight="600" fill="#1c1d1f" text-anchor="middle">orchestrator-worker</text>
<circle cx="97" cy="46" r="7" fill="#0b5394"/>
<line x1="97" y1="53" x2="61" y2="76" stroke="#6b7280" stroke-width="1.3"/>
<line x1="97" y1="53" x2="97" y2="76" stroke="#6b7280" stroke-width="1.3"/>
<line x1="97" y1="53" x2="133" y2="76" stroke="#6b7280" stroke-width="1.3"/>
<circle cx="61" cy="82" r="6" fill="#2f8cff"/>
<circle cx="97" cy="82" r="6" fill="#2f8cff"/>
<circle cx="133" cy="82" r="6" fill="#2f8cff"/>
<text x="263" y="30" font-size="9.5" font-weight="600" fill="#1c1d1f" text-anchor="middle">pipeline</text>
<rect x="206" y="52" width="30" height="20" rx="4" fill="#efe9da" stroke="#e6dfce"/>
<rect x="256" y="52" width="30" height="20" rx="4" fill="#efe9da" stroke="#e6dfce"/>
<rect x="306" y="52" width="30" height="20" rx="4" fill="#efe9da" stroke="#e6dfce"/>
<line x1="237" y1="62" x2="254" y2="62" stroke="#6b7280" stroke-width="1.3" marker-end="url(#ma2ar)"/>
<line x1="287" y1="62" x2="304" y2="62" stroke="#6b7280" stroke-width="1.3" marker-end="url(#ma2ar)"/>
<text x="97" y="122" font-size="9.5" font-weight="600" fill="#1c1d1f" text-anchor="middle">debate / vote</text>
<circle cx="52" cy="134" r="5" fill="#2f8cff"/>
<circle cx="52" cy="150" r="5" fill="#2f8cff"/>
<circle cx="52" cy="166" r="5" fill="#2f8cff"/>
<line x1="57" y1="134" x2="116" y2="148" stroke="#6b7280" stroke-width="1.3"/>
<line x1="57" y1="150" x2="116" y2="150" stroke="#6b7280" stroke-width="1.3"/>
<line x1="57" y1="166" x2="116" y2="152" stroke="#6b7280" stroke-width="1.3"/>
<circle class="ma2p" cx="128" cy="150" r="11" fill="#1f7a50"/>
<path d="M123,150 l4,4 l7,-8" stroke="#ffffff" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
<text x="263" y="122" font-size="9.5" font-weight="600" fill="#1c1d1f" text-anchor="middle">worker / critic</text>
<rect x="200" y="138" width="46" height="26" rx="5" fill="#efe9da" stroke="#e6dfce"/>
<text x="223" y="155" font-size="9" fill="#1c1d1f" text-anchor="middle">work</text>
<line x1="247" y1="151" x2="285" y2="151" stroke="#6b7280" stroke-width="1.3" marker-end="url(#ma2ar)"/>
<rect x="288" y="138" width="46" height="26" rx="5" fill="#ffffff" stroke="#1f7a50"/>
<path d="M305,151 l4,4 l7,-8" stroke="#1f7a50" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`
    },
    {
      "heading": "How agents talk to each other",
      "video": { "url": "https://www.youtube.com/watch?v=WTr6mHTw5cM", "title": "Understanding multi-agent handoffs", "channel": "LangChain" },
      "explanation": "Agents do not literally 'know' about each other. Communication is something you wire up. The simplest form is message passing: one agent's text output becomes part of another agent's prompt, often through a handoff where the first agent decides the second should take over and bundles up what it learned. A second form is shared memory (sometimes called a blackboard): a common space, like a scratchpad file or a database, that every agent can read and write, so they coordinate through a shared record instead of direct messages. The hard part is that natural-language messages are lossy. If the orchestrator's summary to a worker omits a detail, the worker simply never has it. So the quality of the handoff and how much context you pass along often matters more than the cleverness of the pattern.",
      "keyTerms": [
        {
          "term": "handoff",
          "definition": "When one agent passes control of a task to another, bundling the relevant context so the receiving agent can continue. The bundle is lossy: anything left out is lost."
        },
        {
          "term": "shared memory / blackboard",
          "definition": "A common store (a file, scratchpad, or database) that multiple agents read from and write to, letting them coordinate through a shared record rather than direct messages."
        },
        {
          "term": "message passing",
          "definition": "Coordination by feeding one agent's output into another agent's input as text, the most common and simplest way agents communicate."
        }
      ],
      "caption": "Agents only share what you wire up. Either one passes a note into another's prompt, which can drop details, or every agent reads and writes one shared scratchpad.",
      "svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 200" width="100%" preserveAspectRatio="xMidYMid meet" role="img" font-family="system-ui, -apple-system, Segoe UI, Roboto, sans-serif">
<title>Message passing between agents versus a shared blackboard</title>
<style>.ma3p{animation:ma3pulse 2.6s ease-in-out infinite}@keyframes ma3pulse{0%,100%{opacity:1}50%{opacity:.45}}@media (prefers-reduced-motion: reduce){.ma3p{animation:none}}</style>
<defs><marker id="ma3ar" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7 z" fill="#6b7280"/></marker></defs>
<rect x="0.5" y="0.5" width="359" height="199" rx="10" fill="#ffffff" stroke="#e6dfce"/>
<line x1="180" y1="18" x2="180" y2="182" stroke="#e6dfce"/>
<text x="92" y="30" font-size="10" font-weight="600" fill="#1c1d1f" text-anchor="middle">message passing</text>
<rect x="22" y="82" width="38" height="30" rx="6" fill="#efe9da" stroke="#e6dfce"/>
<text x="41" y="102" font-size="12" font-weight="600" fill="#1c1d1f" text-anchor="middle">A</text>
<rect x="124" y="82" width="38" height="30" rx="6" fill="#efe9da" stroke="#e6dfce"/>
<text x="143" y="102" font-size="12" font-weight="600" fill="#1c1d1f" text-anchor="middle">B</text>
<rect x="79" y="74" width="26" height="22" rx="2" fill="#ffffff" stroke="#e6dfce"/>
<path d="M99,74 l6,6 l-6,0 z" fill="#efe9da"/>
<line x1="83" y1="82" x2="97" y2="82" stroke="#6b7280" stroke-width="1"/>
<line x1="83" y1="87" x2="95" y2="87" stroke="#6b7280" stroke-width="1"/>
<line x1="60" y1="97" x2="79" y2="90" stroke="#6b7280" stroke-width="1.3"/>
<line x1="105" y1="90" x2="124" y2="97" stroke="#6b7280" stroke-width="1.3" marker-end="url(#ma3ar)"/>
<text class="ma3p" x="92" y="132" font-size="8.5" fill="#dc2626" text-anchor="middle">lossy note</text>
<text x="268" y="30" font-size="10" font-weight="600" fill="#1c1d1f" text-anchor="middle">shared memory</text>
<rect x="206" y="50" width="124" height="40" rx="6" fill="#efe9da" stroke="#e6dfce"/>
<text x="268" y="74" font-size="10" fill="#1c1d1f" text-anchor="middle">blackboard</text>
<line x1="224" y1="130" x2="224" y2="92" stroke="#6b7280" stroke-width="1.3" marker-start="url(#ma3ar)" marker-end="url(#ma3ar)"/>
<line x1="268" y1="130" x2="268" y2="92" stroke="#6b7280" stroke-width="1.3" marker-start="url(#ma3ar)" marker-end="url(#ma3ar)"/>
<line x1="312" y1="130" x2="312" y2="92" stroke="#6b7280" stroke-width="1.3" marker-start="url(#ma3ar)" marker-end="url(#ma3ar)"/>
<circle cx="224" cy="140" r="10" fill="#2f8cff"/>
<circle cx="268" cy="140" r="10" fill="#2f8cff"/>
<circle cx="312" cy="140" r="10" fill="#2f8cff"/>
<text x="268" y="172" font-size="9" fill="#6b7280" text-anchor="middle">all read and write</text>
</svg>`
    },
    {
      "heading": "Failure modes, cost, and when one agent is better",
      "video": { "url": "https://www.youtube.com/watch?v=2lTFI6FAqhk", "title": "Single Agent Vs. Multi-Agent Systems in AI | How To Choose The Right Architecture", "channel": "Snowflake Developers" },
      "explanation": "Multi-agent systems inherit every single-agent failure and add new ones. Coordination failures happen when agents duplicate work, leave gaps between their slices, or contradict each other. Error propagation is worse than in one agent: a mistake by an early agent gets passed downstream as if it were fact, and a critic that rubber-stamps gives false confidence. Cost and latency multiply: five agents is roughly five times the tokens, and a long chain is only as fast as its slowest link. Debugging is harder because a wrong final answer might come from any agent or any handoff. The practical lesson is that a single strong agent with good tools is often simpler, cheaper, and easier to trust than a crowd of weaker ones. Add agents only when the task clearly splits into different skills or parallel work, and always measure the whole system end to end, not each agent alone.",
      "keyTerms": [
        {
          "term": "coordination failure",
          "definition": "Agents duplicating work, leaving gaps where no agent owns a sub-task, or producing contradictory results because no one reconciled them."
        },
        {
          "term": "error propagation",
          "definition": "An early agent's mistake flows downstream and is treated as fact by later agents, so a small slip can corrupt the whole result."
        },
        {
          "term": "cost and latency multiplication",
          "definition": "Each agent is a full model running, so token cost scales with the number of agents, and a sequential chain is only as fast as its slowest step."
        },
        {
          "term": "end-to-end evaluation",
          "definition": "Judging a multi-agent system by its final output and overall cost, not by each agent in isolation, since the failure may live in the seams between agents."
        }
      ],
      "caption": "A mistake by an early agent gets passed along as fact and corrupts later steps. And every extra agent adds tokens, so five agents cost about five times one.",
      "svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 200" width="100%" preserveAspectRatio="xMidYMid meet" role="img" font-family="system-ui, -apple-system, Segoe UI, Roboto, sans-serif">
<title>An early error spreads downstream and more agents cost more</title>
<style>.ma4dot{animation:ma4flow 2.8s linear infinite}@keyframes ma4flow{0%{transform:translateX(0);opacity:0}10%{opacity:1}90%{opacity:1}100%{transform:translateX(240px);opacity:0}}@media (prefers-reduced-motion: reduce){.ma4dot{animation:none;opacity:0}}</style>
<defs><marker id="ma4ar" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7 z" fill="#6b7280"/></marker></defs>
<rect x="0.5" y="0.5" width="359" height="199" rx="10" fill="#ffffff" stroke="#e6dfce"/>
<text x="18" y="26" font-size="10" font-weight="600" fill="#1c1d1f" text-anchor="start">An early error spreads downstream</text>
<line x1="58" y1="66" x2="114" y2="66" stroke="#6b7280" stroke-width="1.5" marker-end="url(#ma4ar)"/>
<line x1="138" y1="66" x2="194" y2="66" stroke="#6b7280" stroke-width="1.5" marker-end="url(#ma4ar)"/>
<line x1="218" y1="66" x2="274" y2="66" stroke="#6b7280" stroke-width="1.5" marker-end="url(#ma4ar)"/>
<circle cx="46" cy="66" r="12" fill="#ffffff" stroke="#dc2626" stroke-width="2"/>
<path d="M40,60 l12,12 M52,60 l-12,12" stroke="#dc2626" stroke-width="1.6" stroke-linecap="round"/>
<circle cx="126" cy="66" r="12" fill="#ffffff" stroke="#e6dfce"/>
<circle cx="134" cy="58" r="2.5" fill="#dc2626"/>
<circle cx="206" cy="66" r="12" fill="#ffffff" stroke="#e6dfce"/>
<circle cx="214" cy="58" r="2.5" fill="#dc2626"/>
<circle cx="286" cy="66" r="12" fill="#ffffff" stroke="#e6dfce"/>
<circle cx="294" cy="58" r="2.5" fill="#dc2626"/>
<circle class="ma4dot" cx="58" cy="66" r="3" fill="#dc2626"/>
<text x="86" y="50" font-size="8" fill="#dc2626" text-anchor="middle">error</text>
<text x="18" y="132" font-size="10" font-weight="600" fill="#1c1d1f" text-anchor="start">More agents cost more</text>
<rect x="18" y="142" width="40" height="12" rx="2" fill="#6b7280"/>
<text x="64" y="152" font-size="8" fill="#6b7280" text-anchor="start">1 agent</text>
<rect x="18" y="162" width="200" height="12" rx="2" fill="#d97706"/>
<text x="224" y="172" font-size="8" fill="#6b7280" text-anchor="start">5 agents, about 5x</text>
<text x="18" y="190" font-size="8.5" fill="#6b7280" text-anchor="start">a chain is only as fast as its slowest step</text>
</svg>`
    }
  ],
  "cards": [
    {
      "id": "multiagent-0",
      "categoryKey": "multiagent",
      "category": "Multi-agent Systems",
      "subtopic": "Why multi-agent",
      "question": "What is the core reason to split a task across multiple agents instead of using one?",
      "answer": "Focus and parallelism. Each agent keeps a short, narrow context and a single job, which usually raises quality compared to one agent juggling everything, and independent sub-tasks can run at the same time. The cost is more tokens, coordination overhead, and new ways to fail, so the split only pays off when the work genuinely separates into distinct skills or parallel chunks.",
      "plain": "One person trying to cook, set the table, and greet guests at once does each badly. Split the jobs across a few people and each can focus and they can work in parallel. But more people also means more coordinating and more chances someone drops a ball.",
      "difficulty": "core"
    },
    {
      "id": "multiagent-1",
      "categoryKey": "multiagent",
      "category": "Multi-agent Systems",
      "subtopic": "Why multi-agent",
      "question": "What exactly makes a system 'multi-agent' rather than one agent calling many tools?",
      "answer": "A multi-agent system has two or more separate model-driven agents, each with its own instructions, its own context, and often its own tools, that coordinate on a task. A single agent calling many tools is still one mind making every decision. The line is whether there is more than one independent reasoning loop, not how many tools are involved.",
      "plain": "One worker with a big toolbox is still one worker. A multi-agent system is several workers, each thinking for themselves, who have to talk to get the job done. The difference is how many separate 'brains' are in the loop, not how many tools are on the bench.",
      "difficulty": "core"
    },
    {
      "id": "multiagent-2",
      "categoryKey": "multiagent",
      "category": "Multi-agent Systems",
      "subtopic": "Orchestrator-worker",
      "question": "Describe the orchestrator-worker pattern.",
      "answer": "One lead agent (the orchestrator) takes the overall goal, breaks it into sub-tasks, and hands each to a worker agent. The workers each do their focused piece without seeing the whole picture, then return results that the orchestrator assembles into the final answer. The orchestrator owns the plan and the integration; workers own the details.",
      "plain": "It works like a general contractor and subcontractors: the contractor plans the build and hands out jobs (plumbing, wiring, drywall), each specialist does just their part, and the contractor puts it all together. Only the contractor sees the whole house.",
      "difficulty": "core"
    },
    {
      "id": "multiagent-3",
      "categoryKey": "multiagent",
      "category": "Multi-agent Systems",
      "subtopic": "Orchestrator-worker",
      "question": "In orchestrator-worker, why can a worker fail even when it does its own task perfectly?",
      "answer": "A worker only sees the slice of context the orchestrator chose to pass. If the orchestrator's instructions or summary leave out a key constraint, the worker has no way to know it and will produce a locally correct but globally wrong result. The weak point is the handoff and how much context travels with it, not the worker's reasoning.",
      "plain": "Tell a subcontractor 'install a sink here' but forget to mention the gas line behind the wall, and they will do a perfect job and still hit the pipe. The worker only knows what it was told, so a gap in the briefing becomes a real mistake.",
      "difficulty": "intermediate"
    },
    {
      "id": "multiagent-4",
      "categoryKey": "multiagent",
      "category": "Multi-agent Systems",
      "subtopic": "Pipelines",
      "question": "What is a pipeline pattern, and how does it differ from orchestrator-worker?",
      "answer": "A pipeline chains agents in a fixed order where each one's output is the next one's input, like an assembly line (for example: research, then draft, then edit). The order is hard-coded by you. Orchestrator-worker instead has a lead agent decide at runtime how to split and route the work. Pipelines are predictable; orchestration is flexible.",
      "plain": "A pipeline is an assembly line: each station does its step and passes the product down, always in the same order. Orchestrator-worker is more like a manager who decides on the spot who does what. One is fixed and predictable, the other adapts.",
      "difficulty": "core"
    },
    {
      "id": "multiagent-5",
      "categoryKey": "multiagent",
      "category": "Multi-agent Systems",
      "subtopic": "Handoffs",
      "question": "What is a 'handoff' between agents, and why is it the riskiest moment in a multi-agent flow?",
      "answer": "A handoff is when one agent passes control of a task to another, bundling up the context the next agent needs. It is risky because the bundle is lossy: it is usually a natural-language summary, and anything the first agent leaves out simply does not exist for the second. Most multi-agent bugs trace back to incomplete or ambiguous handoffs rather than bad reasoning.",
      "plain": "A handoff is like passing a baton in a relay, except the baton is a written note. If the note skips a detail, the next runner never learns it. That moment of passing the note is where the most things quietly go wrong.",
      "difficulty": "intermediate"
    },
    {
      "id": "multiagent-6",
      "categoryKey": "multiagent",
      "category": "Multi-agent Systems",
      "subtopic": "Specialist roles",
      "question": "Why does giving each agent a narrow, specialized role tend to improve results?",
      "answer": "A narrow role means a shorter, more focused system prompt, a smaller set of tools, and less unrelated context to distract the model. That keeps the agent on task and reduces tool-selection confusion. Specialization is the multi-agent version of the single-agent rule that focused context and a tight tool set raise quality.",
      "plain": "A generalist who is asked to do everything spreads thin and gets distracted. Give one agent just 'find the facts' and another just 'write the summary,' and each stays in its lane and does its one thing well, like a kitchen with a dedicated prep cook and a dedicated baker.",
      "difficulty": "core"
    },
    {
      "id": "multiagent-7",
      "categoryKey": "multiagent",
      "category": "Multi-agent Systems",
      "subtopic": "Specialist roles",
      "question": "What is the downside of slicing a task into too many tiny specialist agents?",
      "answer": "Every slice adds a handoff, and every handoff loses context and costs tokens. Past a point, the coordination overhead and accumulated context loss outweigh the focus benefit, and the system gets slower, pricier, and harder to debug for no quality gain. The right grain is the fewest agents that cleanly separate genuinely different skills.",
      "plain": "Chopping a job into a hundred micro-roles means a hundred handoffs, and each handoff drops a little information and adds cost. At some point all the passing-around hurts more than the focus helps. Use the fewest specialists that still cover clearly different skills.",
      "difficulty": "intermediate"
    },
    {
      "id": "multiagent-8",
      "categoryKey": "multiagent",
      "category": "Multi-agent Systems",
      "subtopic": "Debate",
      "question": "How does a debate or ensemble pattern try to produce a better answer?",
      "answer": "Several agents answer the same question independently, then their answers are compared, critiqued against each other, or voted on, and a stronger consensus answer is selected or synthesized. Because independent attempts make different mistakes, cross-checking them filters out errors that any single agent would have made alone.",
      "plain": "Ask three people the same hard question separately, then have them compare answers. Where they agree you can trust it, and where they differ they catch each other's mistakes. Several independent tries beat one, because they rarely all get it wrong the same way.",
      "difficulty": "core"
    },
    {
      "id": "multiagent-9",
      "categoryKey": "multiagent",
      "category": "Multi-agent Systems",
      "subtopic": "Self-critique",
      "question": "What is self-critique (reflection), and how is it different from a separate critic agent?",
      "answer": "Self-critique is when the same agent reviews and revises its own output in a second pass, catching obvious errors before finishing. A separate critic agent is an independent agent whose only job is to review the first agent's work. The independent critic catches more, because it does not share the original's blind spots or its commitment to its own answer.",
      "plain": "Self-critique is proofreading your own essay: helpful, but you tend to miss your own mistakes. A separate critic agent is handing the essay to a fresh editor who has no attachment to your wording and spots things you glossed over.",
      "difficulty": "intermediate"
    },
    {
      "id": "multiagent-10",
      "categoryKey": "multiagent",
      "category": "Multi-agent Systems",
      "subtopic": "Supervisor and critic",
      "question": "What role does a supervisor or critic agent play, and what is its biggest weakness?",
      "answer": "A supervisor or critic agent reviews another agent's output for errors, missed requirements, or policy violations before it is accepted, acting as a second set of eyes. Its biggest weakness is rubber-stamping: a critic that approves weak work gives false confidence, which can be worse than no critic because people now trust the unchecked output.",
      "plain": "A critic agent is a quality inspector at the end of the line. The danger is an inspector who waves everything through: now you trust the product more, but nothing was actually checked. A lazy reviewer is more dangerous than no reviewer.",
      "difficulty": "core"
    },
    {
      "id": "multiagent-11",
      "categoryKey": "multiagent",
      "category": "Multi-agent Systems",
      "subtopic": "Communication",
      "question": "How do agents actually communicate, given that the model is stateless between calls?",
      "answer": "Communication is wired up by your code, not innate. The common form is message passing: one agent's text output is placed into another agent's prompt. Agents never share a mind; they only see whatever text you choose to forward. So coordination quality is entirely a function of what context you pass and how you summarize it.",
      "plain": "Agents do not telepathically know what the others did. They only learn what you literally copy into their prompt. It is like coworkers who can only communicate by leaving each other notes, so the system works only as well as those notes are written.",
      "difficulty": "intermediate"
    },
    {
      "id": "multiagent-12",
      "categoryKey": "multiagent",
      "category": "Multi-agent Systems",
      "subtopic": "Shared memory",
      "question": "What is a shared-memory (blackboard) approach to agent coordination, and what does it trade away?",
      "answer": "Instead of passing messages directly, all agents read from and write to a common store (a scratchpad file, a database, a shared document). Agents coordinate through that shared record. It scales to many agents and keeps a durable trail, but it adds the classic shared-state problems: agents can overwrite each other, read stale entries, or all crowd the same record, so you need conventions about who writes what and when.",
      "plain": "Picture one big shared whiteboard everyone writes on instead of passing notes person to person. It is great for keeping everyone in sync and leaving a record, but people can scribble over each other or read an old line, so you need rules about who updates what.",
      "difficulty": "advanced"
    },
    {
      "id": "multiagent-13",
      "categoryKey": "multiagent",
      "category": "Multi-agent Systems",
      "subtopic": "Coordination failures",
      "question": "Name a coordination failure that only appears with multiple agents, not with one.",
      "answer": "Examples include duplicated work (two agents independently doing the same sub-task), coverage gaps (a sub-task no agent owns because each assumed another had it), and contradiction (two agents producing conflicting outputs with no one to reconcile them). These come from the seams between agents, not from any single agent's reasoning.",
      "plain": "Put two people on a project with no clear split and you get classic team problems: both do the same chunk, nobody does the boring chunk, or they hand in answers that contradict each other. Those failures live in the gaps between agents, not inside any one of them.",
      "difficulty": "intermediate"
    },
    {
      "id": "multiagent-14",
      "categoryKey": "multiagent",
      "category": "Multi-agent Systems",
      "subtopic": "Error propagation",
      "question": "Why can an error be more damaging in a multi-agent pipeline than inside a single agent?",
      "answer": "In a pipeline, a downstream agent treats the upstream agent's output as a trusted fact and builds on it, so an early mistake is laundered into 'given' and silently corrupts everything after it. Worse, the downstream agent often lacks the original context to notice the error. A single agent at least keeps the original information in its own context and can second-guess itself.",
      "plain": "If the first worker on an assembly line mislabels a part, every station after just trusts the label and builds on the wrong thing, never questioning it. Because later agents only see the handed-off summary, they can't catch a mistake they were never shown the evidence for.",
      "difficulty": "advanced"
    },
    {
      "id": "multiagent-15",
      "categoryKey": "multiagent",
      "category": "Multi-agent Systems",
      "subtopic": "Cost multiplication",
      "question": "Roughly how does running five agents affect cost compared to one agent?",
      "answer": "Each agent is a full model running with its own context, so token cost scales roughly with the number of agents, and often worse, because handoffs duplicate context (the same information re-sent to several agents). Five agents can easily cost five times or more versus a single agent, before counting any debate rounds or critic passes that re-process the same content.",
      "plain": "Five agents means five separate AI workers, each reading and writing their own stuff, so you are paying about five salaries instead of one, and sometimes more because they keep re-reading the same shared notes. Agents are not free; every extra one shows up on the bill.",
      "difficulty": "core"
    },
    {
      "id": "multiagent-16",
      "categoryKey": "multiagent",
      "category": "Multi-agent Systems",
      "subtopic": "Latency",
      "question": "When does adding agents speed a task up, and when does it slow things down?",
      "answer": "If sub-tasks are independent, running them on parallel agents finishes sooner than one agent doing them in sequence, so it speeds things up. If the agents form a chain where each waits on the previous one's output, total time is the sum of the steps, so a long pipeline is slower than a single agent and only as fast as its slowest link. Parallel helps; sequential hurts.",
      "plain": "Three people painting different rooms at once finish faster than one person painting all three. But a relay where each runner must wait for the baton is only as quick as the whole chain. Agents save time when they work side by side, not when they wait in line.",
      "difficulty": "intermediate"
    },
    {
      "id": "multiagent-17",
      "categoryKey": "multiagent",
      "category": "Multi-agent Systems",
      "subtopic": "Single vs many",
      "question": "When does a single strong agent beat a crowd of agents?",
      "answer": "When the task does not cleanly separate into different skills or parallel chunks. A single agent with good tools keeps all the context in one place, avoids handoff loss, costs less, and is far easier to debug. Multi-agent designs pay off only when specialization or parallelism gives a real benefit that outweighs the coordination tax; otherwise one capable agent wins.",
      "plain": "If a job is really one coherent thing, one skilled worker who keeps the whole picture in their head beats a committee that has to keep briefing each other. Reach for a team only when the work truly splits into different specialties or can run in parallel.",
      "difficulty": "core"
    },
    {
      "id": "multiagent-18",
      "categoryKey": "multiagent",
      "category": "Multi-agent Systems",
      "subtopic": "Single vs many",
      "question": "What is the common misconception that 'more agents means better results'?",
      "answer": "The belief that stacking on agents, critics, and debate rounds always improves quality. In practice each added agent adds cost, latency, context loss at handoffs, and new coordination failures, and it can lower quality if the task did not need splitting. More agents help only when they add genuine specialization or parallelism; otherwise they add overhead and risk, not accuracy.",
      "plain": "It feels like throwing more people at a problem must help, but a bigger team with no clear reason to be big mostly creates more meetings and miscommunication. Extra agents only help when each one has a real, distinct job to do.",
      "difficulty": "intermediate"
    },
    {
      "id": "multiagent-19",
      "categoryKey": "multiagent",
      "category": "Multi-agent Systems",
      "subtopic": "Evaluation",
      "question": "Why must you evaluate a multi-agent system end to end rather than agent by agent?",
      "answer": "Each agent can look correct in isolation while the overall result is wrong, because the failure lives in the handoffs and seams: lost context, duplicated work, or an unreconciled contradiction. Only an end-to-end evaluation, judging the final output and the total cost and latency, catches those gaps and tells you whether the multi-agent design actually beats a single agent.",
      "plain": "Every player can grade out fine on their own and the team still loses, because the breakdown was in the passes between them. You have to score the final result, not each member, to know if the whole machine actually works, and whether it was worth the extra cost.",
      "difficulty": "advanced"
    }
  ]
};

export default mod;
