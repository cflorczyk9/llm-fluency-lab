// Module: Agents, Tools & MCP (deepened)
// Existing summary, breakdown, video, and cards agents-0..agents-13 carried over
// verbatim from src/data/content.ts. New cards agents-14..agents-21 appended.

import type { Category } from '../../types';

const mod: Category = {
  "key": "agents",
  "name": "Agents, Tools & MCP",
  "tier": 3,
  "learningObjectives": [
    "By the end you can define an agent and tell it apart from a single prompt or a plain chatbot",
    "By the end you can describe the plan-act-observe loop and how it knows when to stop",
    "By the end you can explain how tools and MCP give an agent real capabilities in the world",
    "By the end you can spot where agents fail: runaway loops, bad tool use, and compounding errors",
    "By the end you can describe guardrails like human-in-the-loop approvals and permission boundaries",
    "By the end you can decide when an agent is the right tool versus a simpler fixed pipeline"
  ],
  "summary": "This category is where a language model stops being a text generator and starts being a system that takes actions in the world: calling functions, reading live data, editing files, and running loops until a goal is met. Mastering it lets Connor reason about what's actually happening when \"Claude does something\" (versus hallucinates an answer), design tool surfaces that are safe and debuggable, and tell apart the three real building blocks he keeps hearing conflated: a single tool call, an agent loop, and the Model Context Protocol (MCP) plumbing that connects them. It's also the layer where most production failures live, so understanding the failure modes is what separates a demo from a shippable product like Briefly.",
  "breakdown": [
    {
      "heading": "Tool / function calling: the model asks, your code acts",
      "explanation": "A tool call does not mean the model runs code. You hand the model a list of tools, each with a name, a plain-English description, and a JSON schema describing its inputs. When the model decides a tool would help, it stops generating text and instead emits a structured 'tool_use' block: the tool's name plus a JSON object of arguments it filled in. Your program reads that block, actually executes the function (hit an API, query a database, send an email), and sends the result back as a 'tool_result' message. The model then continues with that result now in its context. The description is load-bearing: the model picks tools almost entirely from how you describe them, so 'call this when the user asks about current prices' beats a bare 'get_prices'. Crucially the API is stateless, so you resend the whole conversation (including prior tool calls and results) on every request.",
      "keyTerms": [
        {
          "term": "tool_use block",
          "definition": "The structured output the model returns when it wants a tool run: a tool name plus a JSON object of arguments. It replaces a text answer for that turn; you detect it via stop_reason == 'tool_use'."
        },
        {
          "term": "tool_result",
          "definition": "The message your code sends back containing the tool's output, tagged with the matching tool_use_id so the model knows which call it answers. Set is_error: true to report a failure the model can recover from."
        },
        {
          "term": "input_schema",
          "definition": "A JSON Schema on each tool defining its parameters and which are required. With strict: true on the tool, the model's arguments are guaranteed to validate exactly against it."
        },
        {
          "term": "tool_choice",
          "definition": "A request setting controlling tool use: 'auto' (model decides, the default), 'any' (must use some tool), {type:'tool', name} (must use that one), or 'none' (forbidden)."
        }
      ]
    },
    {
      "heading": "The agent loop: plan, act, observe, repeat",
      "explanation": "An agent is just tool calling run in a loop until the task is done, not a single request. The loop: send the conversation, the model plans and either answers or emits one or more tool_use blocks (act), your code executes them and feeds results back (observe), and you call again. You keep looping while the model wants tools and stop when stop_reason is 'end_turn'. You append the model's full response (including tool_use blocks) to the history every iteration, then add the tool results, so the model accumulates what it has learned. Two practical wrinkles: server-side tools can return 'pause_turn' when an internal limit is hit, meaning resend to resume; and you should cap iterations to avoid infinite loops. Anthropic's advice is to reach for an agent only when the task is genuinely multi-step and hard to specify up front, the outcome justifies the cost and latency, and errors are recoverable (tests, review, rollback). Simpler tasks should stay a single call or a code-controlled workflow.",
      "keyTerms": [
        {
          "term": "plan-act-observe",
          "definition": "One iteration of the agent loop: the model reasons about next steps (plan), emits tool calls (act), and your harness returns results that re-enter its context (observe)."
        },
        {
          "term": "stop_reason",
          "definition": "Why the model stopped: 'end_turn' (done), 'tool_use' (wants a tool), 'max_tokens' (hit the output cap), 'pause_turn' (server-tool loop paused, resend to continue), or 'refusal' (declined for safety)."
        },
        {
          "term": "tool runner",
          "definition": "An SDK helper that drives the loop for you (call API, execute your functions, feed results, repeat) so you don't hand-write it. Use the manual loop when you need approval gates, logging, or conditional execution."
        },
        {
          "term": "agent vs workflow",
          "definition": "A workflow has code-controlled steps you orchestrate; an agent lets the model decide its own trajectory. Default to the simplest tier that works; only build an agent when the task is open-ended and error-recoverable."
        }
      ]
    },
    {
      "heading": "Model Context Protocol (MCP): the universal adapter for tools and data",
      "explanation": "MCP is an open standard for connecting models to external tools, data sources, and prompts, so a capability you build once works across any MCP-compatible client instead of being wired bespoke to one app. Think of it as a USB-C port for AI: an MCP server (which you write or a vendor provides, like GitHub or Linear) exposes tools, resources (read-only data), and prompts; an MCP client (Claude Desktop, an IDE, or the API) connects and uses them. From the model's side, MCP tools look just like ordinary tools, the protocol standardizes how they're discovered and called over the wire. In the Claude API, the MCP connector lets a request reach a remote MCP server directly: you list the server under mcp_servers (type, name, url) AND reference it with an mcp_toolset tool entry, gated behind a beta flag. This is exactly the shape Briefly's hosted MCP uses: ship one server, and any advisor running Claude can plug in.",
      "keyTerms": [
        {
          "term": "MCP server",
          "definition": "A program that exposes tools, resources, and prompts over the Model Context Protocol. Write it once and any MCP client can connect, eliminating per-app integration work."
        },
        {
          "term": "MCP client",
          "definition": "The host that connects to MCP servers and surfaces their capabilities to the model (Claude Desktop, an IDE, or an API request via the MCP connector)."
        },
        {
          "term": "resources vs tools (MCP)",
          "definition": "Tools are actions the model can invoke; resources are read-only data the server exposes (like a file or record) that can be pulled into context. MCP also standardizes reusable prompts."
        },
        {
          "term": "mcp_toolset",
          "definition": "The required tools-array entry that points at a declared MCP server by name. Listing a server in mcp_servers without a matching mcp_toolset is rejected; both halves are needed."
        }
      ]
    },
    {
      "heading": "Designing the tool surface: bash breadth vs dedicated-tool control",
      "explanation": "How you shape tools determines what your harness can do, because the model only emits the calls; your code handles them. A bash tool gives the model maximum reach but hands your harness an opaque command string it can't reason about. Promoting an action to a dedicated typed tool (a send_email tool, an edit tool) gives the harness an action-specific hook it can gate, validate, render in a UI, audit, or run in parallel safely. The rule of thumb: start with bash for breadth, then promote any action that needs a security gate (especially hard-to-reverse actions like sending or deleting), a staleness check (reject an edit if the file changed), custom rendering, or parallel-safe scheduling. This connects to one of the deepest agent lessons: which actions get their own tool is a product and safety decision, not just an API detail. It's also why anthropic recommends keeping the tool set focused, too many tools confuses the model's selection.",
      "keyTerms": [
        {
          "term": "dedicated tool",
          "definition": "A typed, named tool for one action (e.g. send_email) so the harness can gate, validate, render, audit, or parallelize it, things impossible with an opaque bash string."
        },
        {
          "term": "reversibility criterion",
          "definition": "A heuristic for what to gate: hard-to-reverse actions (external API writes, sends, deletes) deserve a dedicated tool behind user confirmation; read-only actions can run freely and in parallel."
        },
        {
          "term": "server-side vs client-side tools",
          "definition": "Server-side tools (web search, code execution) run on Anthropic's infrastructure with no execution loop on your end; client-side tools (bash, text editor, your custom tools) return a tool_use that YOUR code executes."
        }
      ]
    },
    {
      "heading": "Common failure modes and how production agents guard against them",
      "explanation": "Most agent breakage is operational, not model-quality. Infinite or runaway loops happen when there's no iteration cap, so bound the loop and watch token spend. Context bloat is the slow killer: every tool result piles into the conversation and you eventually exceed the window, so long-running agents use context editing (clear stale tool results and thinking blocks) and compaction (summarize earlier history) to stay lean, and memory (files that persist across sessions) for state that must survive a restart. Tool-result handling has sharp edges: when the model makes several tool calls at once you must return ALL results in a single user message (splitting them silently trains the model to stop calling tools in parallel), and a failed tool needs a tool_result with is_error: true, not a dropped block. Tool inputs should always be parsed as JSON, never string-matched, because escaping varies. And the model can refuse (stop_reason 'refusal') or pause (server-tool 'pause_turn'), both of which break naive code that assumes the first content block is text.",
      "keyTerms": [
        {
          "term": "context editing vs compaction",
          "definition": "Context editing CLEARS stale tool results and thinking blocks (pruning); compaction SUMMARIZES earlier history into a compact block when nearing the window limit. Both run within a session; memory persists across sessions."
        },
        {
          "term": "parallel tool results rule",
          "definition": "When one assistant turn contains multiple tool_use blocks, return every tool_result in a single user message. Splitting them across messages degrades the model's willingness to make parallel calls."
        },
        {
          "term": "runaway loop",
          "definition": "An agent that keeps calling tools without converging. Guard with a max-iterations cap, a token/budget ceiling, and a terminal stop check (break on end_turn, not transient idle)."
        },
        {
          "term": "is_error tool result",
          "definition": "A tool_result marked is_error: true that hands the model a readable failure message so it can adapt or retry, instead of silently omitting the result (which breaks the call/result pairing)."
        }
      ]
    }
  ],
  "video": {
    "url": "https://www.youtube.com/watch?v=7j_NE6Pjv-E",
    "title": "Model Context Protocol (MCP), clearly explained",
    "channel": "Jeff Su"
  },
  "cards": [
    {
      "id": "agents-0",
      "categoryKey": "agents",
      "category": "Agents, Tools & MCP",
      "subtopic": "Tool calling",
      "question": "When a model 'calls a tool,' what does it actually produce, and who runs the tool?",
      "answer": "The model produces a structured tool_use block: the tool's name plus a JSON object of arguments it filled in. It does not execute anything itself. Your application reads that block, runs the real function, and sends the output back as a tool_result. The model only decides what to call and with what inputs.",
      "plain": "The AI does not actually do anything itself: it just writes a note saying 'please run the weather tool for New York' and hands it to your program. Your program does the real work and reports back, like a manager who writes work orders but never picks up a wrench.",
      "difficulty": "core"
    },
    {
      "id": "agents-1",
      "categoryKey": "agents",
      "category": "Agents, Tools & MCP",
      "subtopic": "Tool calling",
      "question": "What information do you give a model so it knows a tool exists and when to use it?",
      "answer": "Each tool has a name, a description, and an input_schema (JSON Schema for its parameters with a required list). The description is the most load-bearing part: the model decides whether and when to call the tool almost entirely from it, so it should state when to call the tool, not just what it does.",
      "plain": "You give the AI a labeled toolbox: each tool has a name, a sentence saying when to reach for it, and a list of the details it needs to fill in. That 'when to use me' sentence matters most, like a clear label on a drawer is what makes someone open the right one.",
      "difficulty": "core"
    },
    {
      "id": "agents-2",
      "categoryKey": "agents",
      "category": "Agents, Tools & MCP",
      "subtopic": "Agent loop",
      "question": "Describe the three phases that repeat in an agent loop.",
      "answer": "Plan: the model reasons about next steps and either answers or emits tool calls. Act: it issues one or more tool_use blocks. Observe: your code executes them and feeds the results back into the conversation. You then call the model again, repeating until it produces a final answer (stop_reason 'end_turn').",
      "plain": "The AI works in a repeating cycle, like a cook tasting and adjusting: think about what to do next, do it (ask for a tool), then look at the result, and go around again until the dish is done.",
      "difficulty": "core"
    },
    {
      "id": "agents-3",
      "categoryKey": "agents",
      "category": "Agents, Tools & MCP",
      "subtopic": "Agent loop",
      "question": "In an agent loop, how do you know the agent is finished versus wanting another tool, and what's the safe way to detect each?",
      "answer": "Check stop_reason on each response. 'tool_use' means it wants a tool, run it and loop again; 'end_turn' means it's done, break. Branch on stop_reason rather than assuming the first content block is text, because the model may also return 'refusal' or 'max_tokens'.",
      "plain": "Each reply comes stamped with a reason it stopped, like a status light: 'I want a tool' means keep going, 'I'm done' means stop. Read that stamp instead of guessing, because the AI might also say it refused or ran out of room.",
      "difficulty": "intermediate"
    },
    {
      "id": "agents-4",
      "categoryKey": "agents",
      "category": "Agents, Tools & MCP",
      "subtopic": "Agent loop",
      "question": "Why must you append the model's full response (including tool_use blocks) to the conversation each loop iteration, rather than just the text?",
      "answer": "The API is stateless, so you resend the entire history every call. The tool_use blocks must be present for the matching tool_result blocks to make sense to the model; dropping them breaks the call/result pairing and loses what the agent has learned. You append the full content, then add tool results as the next user message.",
      "plain": "The AI has no memory between turns, so you have to hand it the whole conversation again each time, including its own requests. If you keep the answer but throw away the original question, the answer makes no sense, like saving 'yes' without the question it replied to.",
      "difficulty": "intermediate"
    },
    {
      "id": "agents-5",
      "categoryKey": "agents",
      "category": "Agents, Tools & MCP",
      "subtopic": "MCP",
      "question": "In one sentence, what problem does the Model Context Protocol (MCP) solve?",
      "answer": "MCP is an open standard for connecting models to external tools, data, and prompts so a capability built once works across any MCP-compatible client, instead of being wired bespoke into each application. It standardizes how tools are discovered and invoked over the wire.",
      "plain": "MCP is a shared plug shape (like USB) for connecting AI to outside tools and data, so you build a connection once and it works everywhere instead of building a custom adapter for every single app.",
      "difficulty": "core"
    },
    {
      "id": "agents-6",
      "categoryKey": "agents",
      "category": "Agents, Tools & MCP",
      "subtopic": "MCP",
      "question": "What are the roles of an MCP server versus an MCP client?",
      "answer": "An MCP server exposes capabilities: tools (actions), resources (read-only data), and prompts. An MCP client (Claude Desktop, an IDE, or an API request via the MCP connector) connects to servers and surfaces their capabilities to the model. You build the server once; many clients can use it.",
      "plain": "The server is the wall outlet that offers up tools and data; the client is the device that plugs into it and brings those abilities to the AI. Build one outlet and many devices can use it.",
      "difficulty": "core"
    },
    {
      "id": "agents-7",
      "categoryKey": "agents",
      "category": "Agents, Tools & MCP",
      "subtopic": "MCP",
      "question": "In the Claude API's MCP connector, why is listing a server under mcp_servers not enough on its own?",
      "answer": "You must also add an mcp_toolset entry in the tools array that references the server by name, and pass the MCP-connector beta flag. Declaring a server in mcp_servers without a matching mcp_toolset is rejected as a validation error; every declared server needs exactly one toolset referencing it.",
      "plain": "Just listing the outlet's address is not enough: you also have to flip the switch that says 'and actually use it.' Naming the connection without that second step gets rejected, like adding a contact to your phone but never pressing call.",
      "difficulty": "advanced"
    },
    {
      "id": "agents-8",
      "categoryKey": "agents",
      "category": "Agents, Tools & MCP",
      "subtopic": "MCP",
      "question": "What is the difference between an MCP resource and an MCP tool?",
      "answer": "A tool is an action the model can invoke (it runs code and returns a result). A resource is read-only data the server exposes, such as a file or record, that can be pulled into the model's context. MCP also standardizes reusable prompts. Conflating resources with tools is a common mistake.",
      "plain": "A tool is a button the AI can press to make something happen; a resource is just a document on the shelf it can read but not change. One is a verb, the other is a reference book.",
      "difficulty": "intermediate"
    },
    {
      "id": "agents-9",
      "categoryKey": "agents",
      "category": "Agents, Tools & MCP",
      "subtopic": "Tool surface design",
      "question": "When deciding whether to give an agent a broad bash tool or a narrow dedicated tool, what does each choice cost you on the harness side?",
      "answer": "Bash gives the model maximum reach but hands your harness an opaque command string it can't inspect, gate, or schedule. A dedicated typed tool gives the harness an action-specific hook it can validate, gate behind confirmation, render in a UI, audit, or run in parallel safely. Start with bash for breadth; promote to dedicated tools for safety and control.",
      "plain": "Giving the AI a general command line is like handing it a master key: it can do anything, but you can't see or check what it's about to do. A purpose-built tool (like a 'send email' button) is one specific key you can watch, approve, and label. Start broad, then lock down the risky actions.",
      "difficulty": "advanced"
    },
    {
      "id": "agents-10",
      "categoryKey": "agents",
      "category": "Agents, Tools & MCP",
      "subtopic": "Tool surface design",
      "question": "What criterion best identifies an action that should be promoted from bash to a dedicated, gateable tool?",
      "answer": "Reversibility. Hard-to-reverse actions (sending a message, deleting data, external API writes) should get a dedicated tool so the harness can require user confirmation. A send_email tool is easy to gate; a bash curl POST is not, because the harness can't tell what it does.",
      "plain": "The test is: can you undo it? Actions you can't take back (sending an email, deleting a file) deserve their own clearly-labeled button so you can put an 'are you sure?' check in front of them, the way a shredder has a guard but a pencil doesn't need one.",
      "difficulty": "advanced"
    },
    {
      "id": "agents-11",
      "categoryKey": "agents",
      "category": "Agents, Tools & MCP",
      "subtopic": "Tools",
      "question": "What's the difference between a server-side tool and a client-side tool in the Claude API?",
      "answer": "Server-side tools (web search, web fetch, code execution) run entirely on Anthropic's infrastructure; you just declare them and results come back in the same response, no execution loop on your end. Client-side tools (bash, text editor, your custom tools) return a tool_use block that your own code must execute and return as a tool_result.",
      "plain": "Some tools (like web search) run on Anthropic's own computers and just hand you the answer, no work for you. Others (like editing your files) only produce a request that your own program has to carry out, like the difference between ordering takeout and getting a recipe you still have to cook.",
      "difficulty": "intermediate"
    },
    {
      "id": "agents-12",
      "categoryKey": "agents",
      "category": "Agents, Tools & MCP",
      "subtopic": "Failure modes",
      "question": "When a model makes several tool calls in one turn, what's the rule for returning the results, and what breaks if you get it wrong?",
      "answer": "Return every tool_result in a single user message. Splitting the results across multiple messages silently trains the model to stop making parallel tool calls in future turns. A failed call still needs its tool_result (with is_error: true), not a dropped block.",
      "plain": "If the AI asks for five things at once, give back all five answers together in one reply. Dribbling them in separately quietly teaches it to stop asking for things in batches, and even a failed task needs an 'it failed' note, not silence.",
      "difficulty": "intermediate"
    },
    {
      "id": "agents-13",
      "categoryKey": "agents",
      "category": "Agents, Tools & MCP",
      "subtopic": "Failure modes",
      "question": "How do long-running agents keep from exceeding the context window, and how do context editing and compaction differ?",
      "answer": "Context editing CLEARS stale content (old tool results, thinking blocks) from the transcript; compaction SUMMARIZES earlier history into a compact block as you near the limit. Both operate within a session. For state that must survive across sessions, you use a separate memory mechanism (files that persist). Many long agents use all three.",
      "plain": "The AI can only hold so much in its head at once, so on long jobs you tidy up: editing throws out old scraps it no longer needs, while compaction shrinks the earlier chapters into a short recap. For anything that must outlast the whole session, you write it down in a file, like notes you keep after the meeting ends.",
      "difficulty": "advanced"
    },
    {
      "id": "agents-14",
      "categoryKey": "agents",
      "category": "Agents, Tools & MCP",
      "subtopic": "What an agent is",
      "question": "What separates an 'agent' from a single prompt or an ordinary chatbot?",
      "answer": "A single prompt does one round of generation and stops. A chatbot trades messages with a person but still just produces text. An agent is given a goal and tools, then runs its own loop: it plans, calls tools, reads the results, and decides the next step itself, repeating until the goal is met or it gives up. The defining trait is that the model, not your code, chooses the sequence of actions.",
      "plain": "A single prompt is like asking one question and getting one answer. A chatbot is a back-and-forth conversation. An agent is more like handing someone a goal and a set of tools and saying 'go figure it out,' then letting them work, check their progress, and try again until it's done.",
      "difficulty": "core"
    },
    {
      "id": "agents-15",
      "categoryKey": "agents",
      "category": "Agents, Tools & MCP",
      "subtopic": "Planning and decomposition",
      "question": "Why does breaking a goal into sub-steps (task decomposition) make an agent more reliable?",
      "answer": "Decomposition turns one vague goal into a sequence of small, checkable steps. Each step has a clear input, a clear output, and a tool that fits it, so the model is less likely to skip work or hallucinate. It also gives the loop natural checkpoints where the agent can verify progress and recover before errors pile up. Agents that plan first and then execute tend to outperform agents that improvise every step.",
      "plain": "Telling an agent 'plan a trip' is overwhelming; 'pick dates, then find flights, then book a hotel' is doable. Splitting a big goal into small steps is like a recipe: each step is simple, you can tell when it's done, and you catch a mistake before it ruins the whole dish.",
      "difficulty": "intermediate"
    },
    {
      "id": "agents-16",
      "categoryKey": "agents",
      "category": "Agents, Tools & MCP",
      "subtopic": "Memory and state",
      "question": "Where does an agent's 'memory' actually live, and why is that a design choice rather than a built-in feature?",
      "answer": "Within a single run, the agent's memory is just the growing conversation (the context window) that you resend each turn, since the API is stateless. Anything that must survive across runs has to be written somewhere durable: a file, a database, or a vector store the agent reads back later. So 'memory' is whatever state you choose to persist and re-feed, not something the model retains on its own.",
      "plain": "The AI forgets everything the moment a task ends, like a worker with no long-term memory. Its 'memory' during a job is the notepad you keep handing back. To remember across days, someone has to file those notes in a cabinet and pull them out next time, the model never keeps them by itself.",
      "difficulty": "intermediate"
    },
    {
      "id": "agents-17",
      "categoryKey": "agents",
      "category": "Agents, Tools & MCP",
      "subtopic": "Error recovery",
      "question": "What is a 'compounding error' in an agent, and why does it make long tasks risky?",
      "answer": "A compounding error is a small early mistake (a misread value, a wrong assumption) that the agent then builds later steps on top of, so the damage multiplies down the chain. Because each step trusts the prior step's output, a 5% chance of error per step becomes a large chance of failure over many steps. Guards include verification checkpoints, having the agent re-read its own work, and keeping individual steps reversible.",
      "plain": "If you write down one wrong number at the start of a long calculation, every step after it is also wrong. Agents have the same problem: a tiny early slip gets baked into everything that follows, so the more steps a task has, the more likely something quietly goes off the rails.",
      "difficulty": "intermediate"
    },
    {
      "id": "agents-18",
      "categoryKey": "agents",
      "category": "Agents, Tools & MCP",
      "subtopic": "Human-in-the-loop",
      "question": "What does 'human-in-the-loop' mean for an agent, and which actions most deserve it?",
      "answer": "Human-in-the-loop means the agent pauses and asks a person to approve before it takes certain actions, rather than running fully autonomously. You apply it to the high-stakes, hard-to-reverse steps: sending an email, moving money, deleting records, publishing. Low-stakes read-only steps can run freely. It is the simplest, strongest guardrail because it puts a person at exactly the moments that matter.",
      "plain": "Human-in-the-loop is just an 'are you sure?' checkpoint: the agent does the routine work on its own but stops for a thumbs-up before anything it can't take back, like a self-driving car that handles the highway but asks you to confirm before it actually parks.",
      "difficulty": "core"
    },
    {
      "id": "agents-19",
      "categoryKey": "agents",
      "category": "Agents, Tools & MCP",
      "subtopic": "Permissions and sandboxing",
      "question": "What is a sandbox for an agent, and why give an agent only the permissions it needs?",
      "answer": "A sandbox is a restricted environment (limited files, network, and accounts) where the agent can act without being able to touch anything outside it, so a mistake or a hijacked instruction is contained. Granting least privilege (only the access a task requires) limits the blast radius if the agent misbehaves. Both matter because an agent acts on its own and can be steered by malicious text it reads (prompt injection).",
      "plain": "A sandbox is a fenced play area: the agent can do whatever it wants inside, but it can't reach the rest of your house. Giving it only the keys it needs means that even if it makes a mistake, or someone tricks it through a poisoned web page, the worst it can do is limited to that one room.",
      "difficulty": "core"
    },
    {
      "id": "agents-20",
      "categoryKey": "agents",
      "category": "Agents, Tools & MCP",
      "subtopic": "Agent vs fixed workflow",
      "question": "When should you build an agent versus a fixed, code-controlled workflow?",
      "answer": "Use a fixed workflow when the steps are known and stable: you get speed, lower cost, and predictability by hard-coding the sequence. Reach for an agent only when the task is genuinely open-ended and hard to specify up front, the value justifies the extra cost and latency, and errors are recoverable. If you can write down the steps, write down the steps; agents earn their keep on messy, branching problems.",
      "plain": "If a job always follows the same recipe, just write the recipe down: it's faster and never surprises you. Save the 'figure it out yourself' agent for problems where you genuinely can't predict the steps. Don't hire an improviser to do an assembly-line job.",
      "difficulty": "core"
    },
    {
      "id": "agents-21",
      "categoryKey": "agents",
      "category": "Agents, Tools & MCP",
      "subtopic": "ReAct and run cost",
      "question": "What is the ReAct (reason-and-act) pattern, and why does it make agents expensive to run?",
      "answer": "ReAct interleaves reasoning and acting: the model writes out a short thought, takes one tool action, observes the result, then reasons again, looping step by step. It improves reliability because the visible reasoning guides the next action. The cost comes from the stateless API: every loop resends the entire growing transcript, so tokens (and dollars and latency) climb with each step, roughly with the square of the number of steps for a long run.",
      "plain": "ReAct means the agent talks itself through the work: think a little, do one thing, look, think again. It's more reliable but pricey, because each step re-reads the whole conversation so far. Like rereading the entire meeting notes before every single decision, the longer it goes, the more time and money each step costs.",
      "difficulty": "advanced"
    }
  ]
};

export default mod;
