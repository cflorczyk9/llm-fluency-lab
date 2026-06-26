import type { Category } from '../../types';

const mod: Category = {
  key: 'toolcalling',
  name: 'Structured Output & Tool Calling',
  tier: 2,
  summary:
    'A language model normally produces free text, but software needs predictable, machine-readable data and the ability to actually do things. Structured output (like clean JSON) and tool or function calling are the bridge from a chatbot to working software. The key idea is that the model proposes a structured action, and your own code, not the model, executes it.',
  learningObjectives: [
    'By the end you can explain how a model returns structured output like JSON and why schemas help',
    'By the end you can describe how tool or function calling works as a request-and-response loop',
    'By the end you can distinguish the model proposing a call from your code executing it',
    'By the end you can write a clear tool definition with a name, description, and parameters',
    'By the end you can handle errors, validation, and multiple or parallel tool calls',
    'By the end you can explain how tool calling underpins agents and integrations like MCP',
  ],
  breakdown: [
    {
      heading: 'From prose to JSON: structured output',
      video: { url: "https://www.youtube.com/watch?v=i4nyL0vS24g", title: "OpenAI Model: Implementing JSON Schema for Structured Outputs", channel: "Learn Microsoft AI" },
      explanation:
        'By default a model writes prose, which is great for humans but awkward for software, because a program cannot reliably pull "the order total" out of a friendly paragraph. Structured output means asking the model to answer in a fixed, machine-readable shape, most often JSON: a simple format of labeled fields and values. To make it dependable you supply a schema, a description of exactly which fields are required and what type each should be. Many providers also offer a strict mode that guarantees the output parses as valid JSON matching your schema, so your code never chokes on a stray sentence.',
      caption:
        'A schema turns a friendly sentence into labeled JSON fields. Software can read total and items directly instead of parsing prose.',
      svg:
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 200" width="100%" preserveAspectRatio="xMidYMid meet" role="img" font-family="system-ui,-apple-system,Segoe UI,Roboto,sans-serif"><title>Structured output turns prose into JSON</title><rect x="0.5" y="0.5" width="359" height="199" rx="10" fill="#ffffff" stroke="#e6dfce"/><text x="180" y="24" text-anchor="middle" font-size="12.5" font-weight="600" fill="#1c1d1f">Prose for people, JSON for code</text><rect x="24" y="50" width="124" height="100" rx="6" fill="#ffffff" stroke="#e6dfce" stroke-width="1.5"/><text x="34" y="68" font-size="9.5" fill="#6b7280">PROSE</text><text x="34" y="92" font-size="10.5" fill="#1c1d1f">Your order of two</text><text x="34" y="108" font-size="10.5" fill="#1c1d1f">shirts comes to</text><text x="34" y="124" font-size="10.5" fill="#1c1d1f">48 dollars.</text><text x="86" y="166" text-anchor="middle" font-size="9.5" fill="#6b7280">for people</text><line x1="150" y1="100" x2="208" y2="100" stroke="#0b5394" stroke-width="2"/><polygon points="214,100 206,95 206,105" fill="#0b5394"/><text x="180" y="92" text-anchor="middle" font-size="9.5" fill="#0b5394">via schema</text><rect x="216" y="50" width="120" height="100" rx="6" fill="#efe9da" stroke="#1f7a50" stroke-width="1.5"/><text x="226" y="68" font-size="9.5" fill="#6b7280">JSON</text><text x="228" y="90" font-size="11" font-family="ui-monospace,Menlo,Consolas,monospace" fill="#1c1d1f">{</text><text x="238" y="108" font-size="11" font-family="ui-monospace,Menlo,Consolas,monospace" fill="#0b5394">"items"<tspan fill="#1c1d1f">: </tspan><tspan fill="#1f7a50">2</tspan><tspan fill="#1c1d1f">,</tspan></text><text x="238" y="126" font-size="11" font-family="ui-monospace,Menlo,Consolas,monospace" fill="#0b5394">"total"<tspan fill="#1c1d1f">: </tspan><tspan fill="#1f7a50">48</tspan></text><text x="228" y="144" font-size="11" font-family="ui-monospace,Menlo,Consolas,monospace" fill="#1c1d1f">}</text><text x="276" y="166" text-anchor="middle" font-size="9.5" fill="#1f7a50">for code</text></svg>',
      keyTerms: [
        {
          term: 'Structured output',
          definition:
            'A model response in a fixed, machine-readable shape (commonly JSON) with labeled fields, instead of free-form prose, so software can use it directly.',
        },
        {
          term: 'JSON',
          definition:
            'A simple, widely used data format of labeled fields and values (like name, amount, date) that programs read and write reliably.',
        },
        {
          term: 'Schema',
          definition:
            'A specification of the exact fields, types, and which are required, that the output must follow. It tells the model and your code what shape to expect.',
        },
      ],
    },
    {
      heading: 'Tools: giving the model a menu of actions',
      video: { url: "https://www.youtube.com/watch?v=gosZ_vqXkMI", title: "AI Tool Calling via Natural Language: LLMs, APIs & Docker in Action", channel: "IBM Technology" },
      explanation:
        'A tool (also called a function) is a capability you offer the model, such as "look up the weather," "search the customer database," or "send an email." You describe each tool to the model with three things: a name, a plain-language description of what it does and when to use it, and a list of parameters it accepts (with types). The model cannot run any of this. The definition simply tells the model what is available so it can decide, given the user request, whether and how to call one. Good descriptions matter enormously, because the model picks a tool based on what you wrote about it.',
      caption:
        'Each tool is listed with a name, a short description, and the inputs it takes. The model reads this menu to pick one, but it never runs the tool itself.',
      svg:
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 200" width="100%" preserveAspectRatio="xMidYMid meet" role="img" font-family="system-ui,-apple-system,Segoe UI,Roboto,sans-serif"><title>A tool definition lists actions the model can request</title><rect x="0.5" y="0.5" width="359" height="199" rx="10" fill="#ffffff" stroke="#e6dfce"/><text x="180" y="22" text-anchor="middle" font-size="12.5" font-weight="600" fill="#1c1d1f">Tools are a menu the model chooses from</text><circle cx="56" cy="104" r="26" fill="#ffffff" stroke="#0b5394" stroke-width="1.5"/><text x="56" y="100" text-anchor="middle" font-size="11" fill="#0b5394">Model</text><text x="56" y="114" text-anchor="middle" font-size="9" fill="#6b7280">reads</text><line x1="84" y1="104" x2="142" y2="104" stroke="#6b7280" stroke-width="1.5"/><polygon points="148,104 140,99 140,109" fill="#6b7280"/><text x="116" y="96" text-anchor="middle" font-size="9" fill="#6b7280">chooses</text><rect x="150" y="40" width="192" height="140" rx="8" fill="#efe9da" stroke="#e6dfce" stroke-width="1.5"/><text x="162" y="58" font-size="10" font-weight="600" fill="#0b5394">Tool menu</text><text x="162" y="80" font-size="11" font-family="ui-monospace,Menlo,Consolas,monospace" fill="#0b5394">get_weather</text><text x="162" y="93" font-size="9" fill="#6b7280">look up the forecast</text><rect x="286" y="70" width="48" height="15" rx="7" fill="#ffffff" stroke="#e6dfce"/><text x="310" y="81" text-anchor="middle" font-size="8.5" fill="#1f7a50">city</text><text x="162" y="116" font-size="11" font-family="ui-monospace,Menlo,Consolas,monospace" fill="#0b5394">search_db</text><text x="162" y="129" font-size="9" fill="#6b7280">find a record</text><rect x="286" y="106" width="48" height="15" rx="7" fill="#ffffff" stroke="#e6dfce"/><text x="310" y="117" text-anchor="middle" font-size="8.5" fill="#1f7a50">query</text><text x="162" y="152" font-size="11" font-family="ui-monospace,Menlo,Consolas,monospace" fill="#0b5394">send_email</text><text x="162" y="165" font-size="9" fill="#6b7280">send a message</text><rect x="286" y="142" width="48" height="15" rx="7" fill="#ffffff" stroke="#e6dfce"/><text x="310" y="153" text-anchor="middle" font-size="8.5" fill="#1f7a50">to, body</text><text x="180" y="194" text-anchor="middle" font-size="9.5" fill="#6b7280">Name, description, parameters. You run it, not the model.</text></svg>',
      keyTerms: [
        {
          term: 'Tool (function) definition',
          definition:
            'A description you give the model of an action it can request: its name, what it does, and the parameters it accepts.',
        },
        {
          term: 'Parameter',
          definition:
            'A named input a tool needs, with a type, such as "city" (text) or "days" (number). The model fills these in when it requests the tool.',
        },
        {
          term: 'Tool description',
          definition:
            'The plain-language explanation of what a tool does and when to use it. The model relies on it to choose the right tool, so clarity is critical.',
        },
      ],
    },
    {
      heading: 'The loop: model proposes, code executes, result returns',
      video: { url: "https://www.youtube.com/watch?v=QiRdYCNXAxk", title: "How LLM Tool Calling Works", channel: "Tommy Eberle" },
      explanation:
        'Tool calling is a back-and-forth, not a single step. You send the user request plus the available tools. If the model decides a tool is needed, it does not run anything: it returns a structured message saying "call tool X with these arguments." Your code reads that, actually runs the function (queries the database, calls the weather service), and sends the result back to the model. The model then uses that result to write its final answer, or to request another tool. The model is the planner choosing what to do, while your code is the hands that do it. This separation is what keeps the system safe and grounded in real systems.',
      caption:
        'The model proposes a tool call, your code runs it and returns the result, then the model writes the final answer. The model plans and your code does the work.',
      svg:
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 200" width="100%" preserveAspectRatio="xMidYMid meet" role="img" font-family="system-ui,-apple-system,Segoe UI,Roboto,sans-serif"><title>The tool-calling loop: model proposes, code executes</title><style>.tc3flow{stroke-dasharray:6 6;animation:tc3dash 1.1s linear infinite}@keyframes tc3dash{to{stroke-dashoffset:-12}}@media (prefers-reduced-motion:reduce){.tc3flow{animation:none}}</style><rect x="0.5" y="0.5" width="359" height="199" rx="10" fill="#ffffff" stroke="#e6dfce"/><text x="180" y="24" text-anchor="middle" font-size="12.5" font-weight="600" fill="#1c1d1f">Model proposes, your code executes</text><rect x="28" y="62" width="96" height="56" rx="8" fill="#ffffff" stroke="#0b5394" stroke-width="1.5"/><text x="76" y="88" text-anchor="middle" font-size="12" fill="#0b5394">Model</text><text x="76" y="103" text-anchor="middle" font-size="9" fill="#6b7280">planner</text><rect x="236" y="62" width="96" height="56" rx="8" fill="#ffffff" stroke="#1f7a50" stroke-width="1.5"/><text x="284" y="88" text-anchor="middle" font-size="12" fill="#1f7a50">Your code</text><text x="284" y="103" text-anchor="middle" font-size="9" fill="#6b7280">executor</text><line class="tc3flow" x1="124" y1="78" x2="230" y2="78" stroke="#0b5394" stroke-width="2"/><polygon points="236,78 228,73 228,83" fill="#0b5394"/><text x="180" y="72" text-anchor="middle" font-size="9.5" fill="#0b5394">1  tool call</text><line class="tc3flow" x1="236" y1="102" x2="130" y2="102" stroke="#1f7a50" stroke-width="2"/><polygon points="124,102 132,97 132,107" fill="#1f7a50"/><text x="180" y="116" text-anchor="middle" font-size="9.5" fill="#1f7a50">3  result</text><line x1="76" y1="118" x2="76" y2="148" stroke="#6b7280" stroke-width="1.5"/><polygon points="76,154 71,146 81,146" fill="#6b7280"/><rect x="28" y="154" width="96" height="30" rx="6" fill="#ffffff" stroke="#0b5394"/><text x="76" y="173" text-anchor="middle" font-size="10" fill="#0b5394">final answer</text><line x1="284" y1="118" x2="284" y2="148" stroke="#6b7280" stroke-width="1.5"/><polygon points="284,154 279,146 289,146" fill="#6b7280"/><rect x="236" y="154" width="96" height="30" rx="6" fill="#efe9da" stroke="#e6dfce"/><text x="284" y="173" text-anchor="middle" font-size="10" fill="#1c1d1f">2  run tool</text></svg>',
      keyTerms: [
        {
          term: 'Tool call',
          definition:
            'The model\'s structured request to use a tool, naming the tool and the arguments. It is a proposal, not an action the model performs.',
        },
        {
          term: 'Tool result',
          definition:
            'The output your code produces after running the requested tool, fed back to the model so it can continue with real data.',
        },
        {
          term: 'Model proposes, code executes',
          definition:
            'The core principle: the model decides which action to take, but your own code carries it out, keeping the model from acting directly on real systems.',
        },
      ],
    },
    {
      heading: 'Doing it well: validation, errors, and many calls',
      video: { url: "https://www.youtube.com/watch?v=l7lvoiCvcVU", title: "LangGraph Deep Dive: Agents with Parallel Function Calling", channel: "Deploying AI" },
      explanation:
        'Because the model generates the arguments, you must treat them like any untrusted input: validate them before acting, and never blindly execute something with real-world consequences. Tools fail too (a record is missing, a service is down), and the clean way to handle that is to send the error back to the model as the tool result so it can adjust, retry, or explain. Real tasks often need several tools: sometimes independent ones that can run in parallel (look up three cities at once), sometimes a chain where each step depends on the last. Managing that loop, with validation and error handling, is most of the engineering around tool calling.',
      caption:
        'The model fills in the arguments, so check them before acting. Valid ones run, bad ones go back as an error, and independent calls can run in parallel.',
      svg:
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 200" width="100%" preserveAspectRatio="xMidYMid meet" role="img" font-family="system-ui,-apple-system,Segoe UI,Roboto,sans-serif"><title>Validate proposed arguments before acting</title><rect x="0.5" y="0.5" width="359" height="199" rx="10" fill="#ffffff" stroke="#e6dfce"/><text x="180" y="24" text-anchor="middle" font-size="12.5" font-weight="600" fill="#1c1d1f">Check the proposed arguments before acting</text><rect x="18" y="78" width="84" height="44" rx="6" fill="#ffffff" stroke="#e6dfce" stroke-width="1.5"/><text x="60" y="98" text-anchor="middle" font-size="10.5" fill="#1c1d1f">Model args</text><text x="60" y="112" text-anchor="middle" font-size="9" fill="#dc2626">untrusted</text><line x1="102" y1="100" x2="132" y2="100" stroke="#6b7280" stroke-width="1.5"/><polygon points="138,100 130,95 130,105" fill="#6b7280"/><polygon points="172,72 206,100 172,128 138,100" fill="#ffffff" stroke="#d97706" stroke-width="1.5"/><text x="172" y="104" text-anchor="middle" font-size="11" fill="#d97706">Validate</text><line x1="206" y1="90" x2="246" y2="84" stroke="#1f7a50" stroke-width="1.5"/><polygon points="252,83 244,80 246,89" fill="#1f7a50"/><text x="226" y="78" text-anchor="middle" font-size="9" fill="#1f7a50">valid</text><rect x="252" y="70" width="90" height="32" rx="6" fill="#ffffff" stroke="#1f7a50" stroke-width="1.5"/><text x="297" y="90" text-anchor="middle" font-size="10" fill="#1f7a50">Execute action</text><line x1="206" y1="110" x2="246" y2="116" stroke="#dc2626" stroke-width="1.5"/><polygon points="252,117 244,111 246,120" fill="#dc2626"/><text x="226" y="132" text-anchor="middle" font-size="9" fill="#dc2626">invalid</text><rect x="252" y="118" width="90" height="32" rx="6" fill="#ffffff" stroke="#dc2626" stroke-width="1.5"/><text x="297" y="138" text-anchor="middle" font-size="10" fill="#dc2626">Send error back</text><path d="M252,142 C150,168 90,150 64,124" fill="none" stroke="#dc2626" stroke-width="1.5" stroke-dasharray="5 4"/><polygon points="62,121 56,130 68,130" fill="#dc2626"/><text x="180" y="192" text-anchor="middle" font-size="9.5" fill="#6b7280">Independent calls run in parallel. Dependent ones chain in order.</text></svg>',
      keyTerms: [
        {
          term: 'Argument validation',
          definition:
            'Checking that the arguments the model produced are well-formed and safe before your code acts on them, since the model can get them wrong.',
        },
        {
          term: 'Parallel tool calls',
          definition:
            'Requesting several independent tools at once so they can run together, rather than one at a time, when none depends on another.',
        },
        {
          term: 'Multi-step (chained) calls',
          definition:
            'A sequence of tool calls where each step uses the result of the previous one, looping through the model several times to finish a task.',
        },
      ],
    },
    {
      heading: 'From tool calls to agents and MCP',
      video: { url: "https://www.youtube.com/watch?v=CQywdSdi5iA", title: "The Model Context Protocol (MCP)", channel: "Anthropic" },
      explanation:
        'Tool calling is the foundation that turns a model from a talker into a doer. An agent is essentially a model running this propose-execute-observe loop repeatedly on its own to accomplish a goal, deciding which tools to use and when it is done. MCP (the Model Context Protocol) is an open standard for how tools and data sources describe themselves to a model, so the same connector works across many apps instead of being rewired for each one. Both build directly on the simple loop: a model that can request structured actions, grounded by code that actually runs them.',
      caption:
        'An agent is this loop run over and over toward a goal. MCP is a shared standard so one connector plugs into many apps.',
      svg:
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 200" width="100%" preserveAspectRatio="xMidYMid meet" role="img" font-family="system-ui,-apple-system,Segoe UI,Roboto,sans-serif"><title>Tool calling is the base for agents and MCP</title><rect x="0.5" y="0.5" width="359" height="199" rx="10" fill="#ffffff" stroke="#e6dfce"/><text x="180" y="22" text-anchor="middle" font-size="12.5" font-weight="600" fill="#1c1d1f">Agents and MCP build on the tool-calling loop</text><rect x="36" y="40" width="134" height="92" rx="8" fill="#ffffff" stroke="#0b5394" stroke-width="1.5"/><text x="103" y="58" text-anchor="middle" font-size="11" font-weight="600" fill="#0b5394">Agent</text><circle cx="78" cy="92" r="16" fill="none" stroke="#0b5394" stroke-width="2"/><polygon points="84,76 76,71 76,81" fill="#0b5394"/><circle cx="116" cy="92" r="4" fill="#1f7a50"/><text x="124" y="96" font-size="9" fill="#1f7a50">goal</text><text x="103" y="124" text-anchor="middle" font-size="9" fill="#6b7280">runs the loop on its own</text><rect x="190" y="40" width="134" height="92" rx="8" fill="#ffffff" stroke="#1f7a50" stroke-width="1.5"/><text x="257" y="58" text-anchor="middle" font-size="11" font-weight="600" fill="#1f7a50">MCP</text><circle cx="208" cy="90" r="7" fill="#0b5394"/><text x="208" y="110" text-anchor="middle" font-size="8" fill="#6b7280">model</text><line x1="215" y1="90" x2="250" y2="90" stroke="#6b7280" stroke-width="1.5"/><line x1="250" y1="74" x2="250" y2="106" stroke="#6b7280" stroke-width="1.5"/><line x1="250" y1="74" x2="282" y2="74" stroke="#6b7280" stroke-width="1.5"/><line x1="250" y1="90" x2="282" y2="90" stroke="#6b7280" stroke-width="1.5"/><line x1="250" y1="106" x2="282" y2="106" stroke="#6b7280" stroke-width="1.5"/><rect x="282" y="68" width="14" height="12" rx="2" fill="#ffffff" stroke="#1f7a50"/><rect x="282" y="84" width="14" height="12" rx="2" fill="#ffffff" stroke="#1f7a50"/><rect x="282" y="100" width="14" height="12" rx="2" fill="#ffffff" stroke="#1f7a50"/><text x="257" y="124" text-anchor="middle" font-size="9" fill="#6b7280">one plug, many apps</text><rect x="36" y="150" width="288" height="30" rx="6" fill="#efe9da" stroke="#e6dfce" stroke-width="1.5"/><text x="180" y="169" text-anchor="middle" font-size="12" font-weight="600" fill="#0b5394">Tool-calling loop</text><line x1="103" y1="132" x2="103" y2="146" stroke="#6b7280" stroke-width="1.5"/><polygon points="103,150 98,142 108,142" fill="#6b7280"/><line x1="257" y1="132" x2="257" y2="146" stroke="#6b7280" stroke-width="1.5"/><polygon points="257,150 252,142 262,142" fill="#6b7280"/></svg>',
      keyTerms: [
        {
          term: 'Agent',
          definition:
            'A model running the tool-calling loop on its own, repeatedly choosing and using tools to reach a goal rather than answering in one shot.',
        },
        {
          term: 'MCP (Model Context Protocol)',
          definition:
            'An open standard for how external tools and data describe themselves to a model, so one connector works across many applications.',
        },
        {
          term: 'Grounding',
          definition:
            'Tying the model\'s actions and answers to real systems and live data through tools, instead of relying on its internal, possibly outdated knowledge.',
        },
      ],
    },
  ],
  cards: [
    {
      id: 'toolcalling-0',
      categoryKey: 'toolcalling',
      category: 'Structured Output & Tool Calling',
      subtopic: 'Structured and JSON output',
      question: 'What is structured output, and why would you want it instead of a normal prose answer?',
      answer:
        'Structured output is a model response in a fixed, machine-readable shape (most often JSON, a format of labeled fields and values) rather than free-form prose. You want it when software, not a human, will consume the answer, because a program can reliably read a labeled field but cannot dependably extract a value from a friendly paragraph.',
      plain:
        'Prose is for people, structured output is for code. Instead of "Your order of two shirts comes to 48 dollars," you ask for {"items": 2, "total": 48}. A program can grab "total" instantly, whereas parsing the sentence is fragile and error-prone.',
      difficulty: 'core',
    },
    {
      id: 'toolcalling-1',
      categoryKey: 'toolcalling',
      category: 'Structured Output & Tool Calling',
      subtopic: 'Schemas and JSON mode',
      question: 'What is a schema, and how does it make structured output more reliable?',
      answer:
        'A schema specifies exactly which fields the output must contain, their types, and which are required. Supplying it tells the model the precise shape to produce, and many providers offer a strict mode that guarantees the result parses as valid JSON matching the schema, so your code never breaks on a malformed or extra-chatty response.',
      plain:
        'A schema is like a fill-in-the-blank form: name (text), age (number), subscribed (yes or no). Hand the model the form and it returns exactly those blanks filled, instead of a free-write essay you then have to decode.',
      difficulty: 'core',
    },
    {
      id: 'toolcalling-2',
      categoryKey: 'toolcalling',
      category: 'Structured Output & Tool Calling',
      subtopic: 'What a tool or function definition is',
      question: 'What is a tool (or function) definition?',
      answer:
        'It is a description you give the model of an action it can request: a name, a plain-language description of what the action does and when to use it, and a list of parameters it accepts with their types. It tells the model what is available, but the definition itself does not run any code.',
      plain:
        'Think of it as a menu entry: the dish name, a sentence describing it, and what you can customize. Handing the model the menu lets it order, but ordering is not cooking. The definition just says "this option exists and here is how to ask for it."',
      difficulty: 'core',
    },
    {
      id: 'toolcalling-3',
      categoryKey: 'toolcalling',
      category: 'Structured Output & Tool Calling',
      subtopic: 'The call-then-result loop',
      question: 'Walk through the basic tool-calling loop. What are the steps?',
      answer:
        'You send the user request plus the available tools. If the model needs one, it returns a structured "call tool X with these arguments" message. Your code runs that tool and sends the result back to the model. The model then writes its final answer using the result, or requests another tool, repeating until done.',
      plain:
        'It is like texting an assistant who cannot leave their desk. They text back "please look up Jane\'s balance." You go look it up and text them the number. Then they finish the answer using it. Request, you fetch, they continue: that is the loop.',
      difficulty: 'core',
    },
    {
      id: 'toolcalling-4',
      categoryKey: 'toolcalling',
      category: 'Structured Output & Tool Calling',
      subtopic: 'Model proposes, code executes',
      question: 'When a model "calls a tool," does the model actually run the function?',
      answer:
        'No. The model only proposes the call: it outputs a structured request naming the tool and the arguments. Your own code receives that proposal and decides whether and how to execute it. The model is the planner, your code is the executor. This separation is what keeps the model from acting directly on real systems.',
      plain:
        'The model writes the order ticket, the kitchen cooks the food. It never touches the stove itself. So "the AI called the database" really means the AI asked, and your program chose to do it.',
      difficulty: 'core',
    },
    {
      id: 'toolcalling-5',
      categoryKey: 'toolcalling',
      category: 'Structured Output & Tool Calling',
      subtopic: 'Why tool descriptions matter',
      question: 'Why does the wording of a tool\'s description matter so much?',
      answer:
        'Because the model chooses which tool to use, and with what arguments, based almost entirely on the name and description you wrote. A vague or misleading description leads to the wrong tool being called, called at the wrong time, or not called when it should be. Clear descriptions are effectively part of the prompt.',
      plain:
        'The description is the model\'s only clue about what a tool is for. If "lookup" could mean a customer or a product, the model will guess and sometimes guess wrong. Spelling out "use this to find a customer by email" steers it to the right choice.',
      difficulty: 'intermediate',
    },
    {
      id: 'toolcalling-6',
      categoryKey: 'toolcalling',
      category: 'Structured Output & Tool Calling',
      subtopic: 'What a tool or function definition is',
      question: 'What three things does a good tool definition include?',
      answer:
        'A name, a plain-language description of what the tool does and when to use it, and a list of parameters it accepts, each with a type (and ideally a short description). The name and description guide tool selection, while the parameters tell the model what arguments to supply and in what form.',
      plain:
        'Name, purpose, and inputs. Like a contact card for a service: what it is called, what it is for, and the details it needs from you. "send_email", "sends an email to a customer", and the fields "to", "subject", "body".',
      difficulty: 'core',
    },
    {
      id: 'toolcalling-7',
      categoryKey: 'toolcalling',
      category: 'Structured Output & Tool Calling',
      subtopic: 'Argument validation and errors',
      question: 'Why should you validate the arguments a model supplies before executing a tool?',
      answer:
        'Because the model generates those arguments and can get them wrong: an invalid date, a missing field, an out-of-range value, or even an unsafe instruction. Treat them like untrusted input, check them against the schema and your own rules, and refuse or correct bad ones before acting, especially for actions with real consequences.',
      plain:
        'The model fills in the form, but it can fumble the entries. Before you charge a card or delete a record, double-check the values like you would a stranger\'s paperwork. Trusting them blindly is how a typo becomes a 9,000-dollar refund.',
      difficulty: 'intermediate',
    },
    {
      id: 'toolcalling-8',
      categoryKey: 'toolcalling',
      category: 'Structured Output & Tool Calling',
      subtopic: 'Argument validation and errors',
      question: 'What is the clean way to handle a tool that fails (for example, a record is not found)?',
      answer:
        'Send the error back to the model as the tool result, described plainly ("no customer found with that email"). The model can then adjust, ask the user for clarification, try a different approach, or explain the problem, rather than the whole interaction crashing. Errors become part of the conversation.',
      plain:
        'Do not hide the failure, tell the model about it. "That lookup came back empty" lets the assistant say "I could not find that account, can you confirm the email?" instead of freezing. The error is just more information for it to work with.',
      difficulty: 'intermediate',
    },
    {
      id: 'toolcalling-9',
      categoryKey: 'toolcalling',
      category: 'Structured Output & Tool Calling',
      subtopic: 'Parallel and multi-step tool calls',
      question: 'What are parallel tool calls, and when are they appropriate?',
      answer:
        'They are several tool requests issued at once so they can run together, instead of one at a time. They are appropriate when the calls are independent, meaning none needs the result of another, such as fetching the weather for three different cities. They cannot be used when one call\'s output feeds the next.',
      plain:
        'If you need to look up three unrelated facts, you can ask for all three at the same time rather than waiting for each in turn, like sending three people on separate errands at once. It only works when the errands do not depend on each other.',
      difficulty: 'intermediate',
    },
    {
      id: 'toolcalling-10',
      categoryKey: 'toolcalling',
      category: 'Structured Output & Tool Calling',
      subtopic: 'Parallel and multi-step tool calls',
      question: 'What is a multi-step (chained) tool sequence?',
      answer:
        'A series of tool calls where each step depends on the result of the previous one, so the model loops several times: call a tool, see the result, decide the next call, and so on, until the task is complete. For example, find a customer, then look up their orders, then summarize them.',
      plain:
        'It is a relay, not a sprint. First find the account, and only once you have it can you pull its invoices, and only then total them. Each step hands the baton to the next, so the model goes around the loop several times to finish the job.',
      difficulty: 'intermediate',
    },
    {
      id: 'toolcalling-11',
      categoryKey: 'toolcalling',
      category: 'Structured Output & Tool Calling',
      subtopic: 'Grounding actions in real systems',
      question: 'How does tool calling let a model use up-to-date or private information it was never trained on?',
      answer:
        'Through tools, the model can request a live lookup (today\'s prices, a specific customer record, a current calendar) and your code returns the real data, which the model then uses in its answer. This grounds the response in actual systems instead of the model\'s frozen, possibly outdated training knowledge.',
      plain:
        'The model\'s built-in knowledge is a snapshot from training and knows nothing about your private data or today. Tools let it phone out for the real, current answer, like a person saying "let me check the system" instead of guessing from memory.',
      difficulty: 'core',
    },
    {
      id: 'toolcalling-12',
      categoryKey: 'toolcalling',
      category: 'Structured Output & Tool Calling',
      subtopic: 'Tool calling vs plain prompting',
      question: 'How is tool calling different from just asking the model to do something in a prompt?',
      answer:
        'Plain prompting keeps everything inside the model\'s own text and knowledge, so it can describe an action but not perform it or fetch real data. Tool calling lets the model trigger your code to actually do things and pull in live information, then continue with the real result. It is the step from talking about a task to completing it.',
      plain:
        'Asking "what should I email this client?" gets you a draft. Giving the model a send_email tool lets it actually send it. Prompting alone is advice, tool calling is action, because now the model can reach outside its own head.',
      difficulty: 'core',
    },
    {
      id: 'toolcalling-13',
      categoryKey: 'toolcalling',
      category: 'Structured Output & Tool Calling',
      subtopic: 'Relation to MCP and agents',
      question: 'How does tool calling relate to AI agents?',
      answer:
        'An agent is essentially a model running the tool-calling loop on its own, repeatedly: choosing tools, observing results, and deciding the next move until it judges the goal is met. Tool calling is the underlying mechanism that gives an agent its hands. Without it, an agent could plan but never act.',
      plain:
        'An agent is what you get when you let the propose-execute-observe loop run by itself toward a goal, instead of one call at a time. Tool calling is the muscle, the agent is the worker repeatedly flexing it until the job is done.',
      difficulty: 'intermediate',
    },
    {
      id: 'toolcalling-14',
      categoryKey: 'toolcalling',
      category: 'Structured Output & Tool Calling',
      subtopic: 'Relation to MCP and agents',
      question: 'What is MCP, and what problem does it solve for tool calling?',
      answer:
        'MCP (the Model Context Protocol) is an open standard for how external tools and data sources describe themselves to a model. It solves the problem of every app reinventing its own tool integrations: with MCP, a connector built once (for a database, a file store, an API) can be reused across many applications instead of being rewired for each.',
      plain:
        'MCP is like a standard plug shape for tools. Before, every app needed its own custom wiring to a given service. With a shared standard, you build the connector once and it snaps into any app that speaks MCP, the way any USB device fits any USB port.',
      difficulty: 'core',
    },
    {
      id: 'toolcalling-15',
      categoryKey: 'toolcalling',
      category: 'Structured Output & Tool Calling',
      subtopic: 'Tool calling vs plain prompting',
      question: 'When should you use plain structured output versus full tool calling?',
      answer:
        'Use plain structured output when you just need the model to return data in a fixed shape and nothing external has to happen (classify this ticket, extract these fields). Use tool calling when the model needs to fetch live data or perform actions in real systems. Structured output is a clean answer, tool calling is the model reaching out and back.',
      plain:
        'If you only need the model to hand you a neatly filled form, structured output is enough. If it needs to actually look something up or do something in the world to complete the task, you need tools. One is formatting, the other is acting.',
      difficulty: 'intermediate',
    },
    {
      id: 'toolcalling-16',
      categoryKey: 'toolcalling',
      category: 'Structured Output & Tool Calling',
      subtopic: 'Schemas and JSON mode',
      question: 'Why do models sometimes produce broken JSON, and how is that prevented?',
      answer:
        'Because a model normally generates text one token at a time by likelihood, so left to itself it can add a stray comment, drop a bracket, or wander off format. Providers prevent this with constrained or structured decoding, which restricts generation at each step so only tokens that keep the output valid against the schema are allowed.',
      plain:
        'Free-form, the model might end a list with an extra comma or a chatty aside that breaks the format. Strict JSON mode acts like guard rails on the keyboard: at every step it only lets the model type characters that keep the result valid, so it cannot wander off the form.',
      difficulty: 'intermediate',
    },
    {
      id: 'toolcalling-17',
      categoryKey: 'toolcalling',
      category: 'Structured Output & Tool Calling',
      subtopic: 'What a tool or function definition is',
      question: 'How does a text-only model "know" how to emit a tool call in the first place?',
      answer:
        'It is trained for it. During post-training the model is taught, on many examples, to recognize when a tool fits and to output the call in a specific structured format the system can parse. Under the hood it is still generating tokens, but it has learned the convention for signaling "this is a tool request" with the right name and arguments.',
      plain:
        'Tool calling is a learned habit, not magic. The model was shown countless examples of "here is a request, here is the tool call that fits," so it picked up the format the way you learn to fill out a standard form. It is still just producing text, but in a shape the software recognizes.',
      difficulty: 'advanced',
    },
    {
      id: 'toolcalling-18',
      categoryKey: 'toolcalling',
      category: 'Structured Output & Tool Calling',
      subtopic: 'Grounding actions in real systems',
      question: 'What is the main safety risk in tool calling, and how do you reduce it?',
      answer:
        'The risk is that the model requests a harmful or wrong action with real consequences (deleting data, sending money, emailing the wrong person), perhaps from a misunderstanding or a manipulated input. You reduce it by never auto-executing sensitive actions: validate arguments, limit what tools can do, and require human confirmation for anything irreversible or high-stakes.',
      plain:
        'The danger is letting the model pull a trigger it should not. The fix is the same as with a new intern: give limited access, double-check the risky requests, and require a human sign-off before anything you cannot undo, like a wire transfer or a mass delete.',
      difficulty: 'advanced',
    },
    {
      id: 'toolcalling-19',
      categoryKey: 'toolcalling',
      category: 'Structured Output & Tool Calling',
      subtopic: 'Schemas and JSON mode',
      question: 'How can a system guarantee the output is valid JSON rather than just hoping the model complies?',
      answer:
        'By using constrained decoding, where the generator is restricted so that at each step only tokens permitted by the schema or grammar can be chosen. Instead of asking nicely and validating afterward, the format is enforced during generation, making invalid output structurally impossible rather than merely unlikely. The catch worth remembering: this guarantees valid shape, not correct content. The JSON will always parse, but the values inside it can still be wrong.',
      plain:
        'There are two ways to get a tidy form: ask politely and hope, or hand someone a form where the wrong boxes are physically blocked off. Constrained decoding is the second, so the result always fits the format. Just remember it guarantees a properly filled form, not that the answers written in it are true.',
      difficulty: 'advanced',
    },
  ],
};

export default mod;
