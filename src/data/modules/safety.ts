// Module: Safety & Failure Modes (tier 4, new).
// No video. Covers hallucination, prompt injection, jailbreaks, bias, and the
// practical defenses for anyone deploying or trusting LLMs.

import type { Category } from '../../types';

const mod: Category = {
  key: 'safety',
  name: 'Safety & Failure Modes',
  tier: 4,
  summary:
    "Large language models fail in characteristic ways: they make up facts, follow malicious instructions hidden in their inputs, can be talked around their safety rules, and can repeat the biases in their training data. This module gives you the judgment to spot those failure modes and the practical defenses (grounding, least privilege, human review) that keep an LLM useful without trusting it blindly.",
  learningObjectives: [
    'By the end you can explain why hallucination happens and the main ways to reduce it',
    'By the end you can describe prompt injection, direct and indirect, and why it is hard to fully prevent',
    'By the end you can explain jailbreaks and the limits of safety training',
    'By the end you can recognize bias and fairness issues and where they come from',
    'By the end you can apply practical defenses like grounding, least privilege, and human review',
    'By the end you can calibrate your trust and know when an LLM answer needs verification',
  ],
  breakdown: [
    {
      heading: 'Hallucination and confidence',
      explanation:
        'A hallucination is when a model states something false or fabricated as if it were true: a made-up citation, a wrong date, a function that does not exist. This is not a bug bolted on by accident. It falls out of how the model works. An LLM is trained to produce text that is plausible given its training data, not text that is verified against the world. It has no built-in fact-checker and no internal signal that says "I do not actually know this." Worse, the fluent, confident tone is the same whether the model is right or wrong, because tone is just more predicted text. This is the calibration problem: a well-calibrated system would sound less sure when it is more likely to be wrong, but base LLMs are often overconfident. The practical takeaway is that confidence in the wording is not evidence of correctness.',
      keyTerms: [
        {
          term: 'Hallucination',
          definition:
            'A confident, fluent statement from a model that is factually wrong or entirely fabricated, such as a fake citation or a nonexistent API.',
        },
        {
          term: 'Calibration',
          definition:
            "How well a model's expressed confidence matches its actual accuracy. A well-calibrated model is unsure when it is likely wrong. LLMs are often overconfident.",
        },
        {
          term: 'Grounding',
          definition:
            'Tying answers to provided source material (documents, search results, a database) so the model reports what the sources say instead of inventing facts.',
        },
      ],
    },
    {
      heading: 'Prompt injection and data exfiltration',
      explanation:
        'A model reads everything in its context as one stream of text, and it cannot reliably tell your trusted instructions apart from untrusted content it was asked to process. Prompt injection exploits this: an attacker plants instructions inside content the model will read and the model follows them. In direct injection a user types adversarial instructions straight into the chat. In indirect injection the malicious instructions are hidden in a web page, email, PDF, or document that the model retrieves or summarizes later, so the attacker never talks to the model directly. This becomes dangerous the moment the model has tools: an injected instruction can tell it to send data to an attacker, delete files, or call an API. That last risk is data exfiltration, where private information is leaked out through a tool the model controls. Prompt injection is hard to fully prevent precisely because the model has no robust boundary between "instructions" and "data."',
      keyTerms: [
        {
          term: 'Prompt injection',
          definition:
            'An attack that smuggles instructions into the text a model reads so the model follows the attacker instead of the intended task.',
        },
        {
          term: 'Indirect prompt injection',
          definition:
            'Injection where the malicious instructions live in external content (a web page, email, or document) the model later retrieves, not in what the user typed.',
        },
        {
          term: 'Data exfiltration',
          definition:
            'Leaking private or sensitive data out of a system, for example by tricking a tool-using model into sending it to an attacker-controlled destination.',
        },
      ],
    },
    {
      heading: 'Jailbreaks and the limits of safety training',
      explanation:
        'Safety training (using human and AI feedback to teach a model to refuse harmful requests) makes models decline many obviously bad asks, but it is a learned tendency, not a hard wall. A jailbreak is an input crafted to get around those refusals: role-play framings, hypothetical scenarios, obfuscated wording, or step-by-step setups that coax the model past its guardrails. These keep being found because the space of possible inputs is effectively infinite and adversaries adapt, so safety training reduces the rate of harmful outputs rather than eliminating it. This is why serious deployments do not rely on the model refusing as the only line of defense. They add independent checks (input and output filters, monitoring, restricted capabilities) so a single clever prompt cannot cause real-world harm on its own.',
      keyTerms: [
        {
          term: 'Jailbreak',
          definition:
            "An input designed to bypass a model's safety guardrails and get it to produce content it was trained to refuse.",
        },
        {
          term: 'Safety training',
          definition:
            'Post-training (often with human feedback) that teaches a model to refuse harmful requests. It lowers, but does not eliminate, harmful outputs.',
        },
        {
          term: 'Red-teaming',
          definition:
            'Deliberately attacking your own system with adversarial prompts and scenarios to find failures before real attackers or users do.',
        },
      ],
    },
    {
      heading: 'Bias, fairness, and harmful content',
      explanation:
        'Models learn from vast amounts of human-written text, so they absorb the patterns, stereotypes, and imbalances in that data. Bias shows up as systematically different treatment or assumptions tied to gender, race, age, or other attributes: skewed word associations, uneven quality across languages, or stereotyped completions. Because the source is the data and the surrounding society, you cannot fully "delete" bias. You manage it by measuring it, curating data, and adding mitigations, then checking outputs for the specific use. Separately, safety work targets toxic or harmful content (harassment, instructions for serious harm), which models can reproduce because such text exists in their training. Fairness matters most where outputs influence real decisions about people (hiring, lending, moderation), where biased behavior causes concrete harm and may carry legal weight.',
      keyTerms: [
        {
          term: 'Bias',
          definition:
            'Systematic, unfair skew in a model\'s outputs tied to attributes like gender or race, inherited from patterns in its training data.',
        },
        {
          term: 'Fairness',
          definition:
            'The goal that a system treats people and groups equitably, especially when its outputs feed real decisions about them.',
        },
        {
          term: 'Toxicity',
          definition:
            'Harmful, hateful, or abusive content a model can generate because similar text appeared in its training data.',
        },
      ],
    },
    {
      heading: 'Defenses and calibrated trust',
      explanation:
        'No single safeguard makes an LLM trustworthy, so the practical answer is defense in depth: layer several independent protections so one failure does not become a disaster. Ground answers in retrieved sources and ask for citations to cut hallucination. Give tools least privilege, meaning the model can only do the narrow set of actions a task needs (read-only where possible, no blanket shell or send access) so an injection or jailbreak has a small blast radius. Keep a human in the loop for any irreversible or high-stakes action (sending money, deleting data, publishing) so a person approves before it happens. And calibrate your own trust: treat fluent output as a draft, verify specifics like names, numbers, quotes, and citations against a real source, and distrust any answer the model could not actually know. The more an output is hard to reverse, public, or about a person, the higher the bar for checking it.',
      keyTerms: [
        {
          term: 'Defense in depth',
          definition:
            'Layering multiple independent safeguards (filters, limits, monitoring, human review) so no single failure causes harm on its own.',
        },
        {
          term: 'Least privilege',
          definition:
            'Granting a model or tool only the minimum access a task requires, so a compromised or misled model can do limited damage.',
        },
        {
          term: 'Human in the loop',
          definition:
            'Requiring a person to review or approve high-stakes or irreversible actions before the system carries them out.',
        },
      ],
    },
  ],
  cards: [
    {
      id: 'safety-0',
      categoryKey: 'safety',
      category: 'Safety & Failure Modes',
      subtopic: 'Hallucination',
      question: 'What is a hallucination in the context of LLMs?',
      answer:
        'A hallucination is when a model produces a confident, fluent statement that is factually wrong or entirely fabricated, such as a made-up citation, a nonexistent function, or an invented quote, presented as if it were true.',
      plain:
        'It is the model making something up and saying it with a straight face, like a student who does not know the answer but writes a polished, totally invented one rather than leaving it blank.',
      difficulty: 'core',
    },
    {
      id: 'safety-1',
      categoryKey: 'safety',
      category: 'Safety & Failure Modes',
      subtopic: 'Hallucination',
      question:
        'Why do hallucinations happen at all, rather than the model just saying "I do not know"?',
      answer:
        'The model is trained to produce text that is plausible given its training data, not text verified against the world. It has no built-in fact-checker and no reliable internal signal for "I do not actually know this," so when knowledge is missing it fills the gap with a plausible-sounding guess.',
      plain:
        'The model is a master of "what word usually comes next," not a database of verified facts. When it hits a gap, its instinct is to produce something that sounds right, not to admit the gap, because sounding right is exactly what it was trained to do.',
      difficulty: 'core',
    },
    {
      id: 'safety-2',
      categoryKey: 'safety',
      category: 'Safety & Failure Modes',
      subtopic: 'Hallucination',
      question: 'What are the most effective ways to reduce hallucination?',
      answer:
        'Ground the model in real sources (retrieval/RAG) and ask it to answer only from those sources and to cite them, explicitly allow "I do not know," lower the temperature for factual tasks, and verify specific claims (names, numbers, citations) against an authoritative source. Grounding plus verification is the core defense.',
      plain:
        'Give the model the documents and tell it to answer only from them and show its sources, let it off the hook for saying "not sure," and then spot-check the facts yourself. An open-book test with citations beats asking it to recite from memory.',
      difficulty: 'intermediate',
    },
    {
      id: 'safety-3',
      categoryKey: 'safety',
      category: 'Safety & Failure Modes',
      subtopic: 'Calibration',
      question:
        'Why is a confident tone from an LLM not evidence that the answer is correct?',
      answer:
        'Tone is just more generated text, produced the same way whether the model is right or wrong. The model has no separate internal honesty signal driving its phrasing, so fluent, assertive wording appears even on fabricated answers. Confidence in the words does not track accuracy.',
      plain:
        'The model writes "I am certain" the same way it writes anything else: by predicting words. It is like a smooth talker who sounds equally sure whether telling the truth or bluffing. The polish tells you nothing about whether it is right.',
      difficulty: 'core',
    },
    {
      id: 'safety-4',
      categoryKey: 'safety',
      category: 'Safety & Failure Modes',
      subtopic: 'Calibration',
      question:
        'What does it mean for a model to be "well calibrated," and how do base LLMs typically fall short?',
      answer:
        'A well-calibrated model expresses confidence that matches its actual accuracy: things it states with high confidence are usually right, and it sounds less sure when it is more likely to be wrong. Base LLMs are often overconfident, sounding equally certain across correct and incorrect answers, which makes their stated confidence an unreliable guide.',
      plain:
        'Calibration means the model\'s "how sure am I" actually lines up with "how often am I right." A well-calibrated weather app that says 70 percent rain is right about 70 percent of the time. LLMs tend to say "100 percent" far more often than they are actually correct.',
      difficulty: 'advanced',
    },
    {
      id: 'safety-5',
      categoryKey: 'safety',
      category: 'Safety & Failure Modes',
      subtopic: 'Prompt injection',
      question: 'What is prompt injection?',
      answer:
        'Prompt injection is an attack where adversarial instructions are placed inside the text a model reads, so the model follows the attacker\'s instructions instead of, or in addition to, the intended task. It exploits the fact that the model treats all text in its context as one stream and cannot reliably separate trusted instructions from untrusted content.',
      plain:
        'It is slipping a hidden order into something the model is reading, like writing "ignore your boss and do this instead" on a memo you hand it. Because the model reads everything as one message, it can end up obeying the smuggled order.',
      difficulty: 'core',
    },
    {
      id: 'safety-6',
      categoryKey: 'safety',
      category: 'Safety & Failure Modes',
      subtopic: 'Prompt injection',
      question:
        'What is the difference between direct and indirect prompt injection?',
      answer:
        'In direct injection, a user types the malicious instructions straight into the chat. In indirect injection, the instructions are hidden inside external content the model later retrieves or processes (a web page, email, PDF, or document), so the attacker never interacts with the model directly. Indirect injection is especially dangerous because the victim may not even see the planted text.',
      plain:
        'Direct is someone typing the trick straight at the model. Indirect is planting the trick in a webpage or email and waiting for the model to read it later, like leaving a booby-trapped note where you know the assistant will eventually pick it up.',
      difficulty: 'intermediate',
    },
    {
      id: 'safety-7',
      categoryKey: 'safety',
      category: 'Safety & Failure Modes',
      subtopic: 'Prompt injection',
      question:
        'Why is prompt injection hard to fully prevent, unlike a traditional software bug?',
      answer:
        'There is no robust boundary inside the model between "instructions" and "data": both arrive as text in the same context, and the model decides what to follow based on meaning, not on a trusted code path. Natural language is open-ended, so attackers can endlessly rephrase, and you cannot enumerate every malicious instruction in advance. Mitigations reduce risk but do not close it completely.',
      plain:
        'In normal software you can keep commands and user data in separate lanes. With an LLM everything is just words in one lane, and the model judges by meaning, so there is no clean wall to enforce. You cannot list every sneaky phrasing ahead of time, so you can only lower the odds, not eliminate them.',
      difficulty: 'intermediate',
    },
    {
      id: 'safety-8',
      categoryKey: 'safety',
      category: 'Safety & Failure Modes',
      subtopic: 'Data exfiltration',
      question:
        'How can prompt injection lead to data exfiltration when a model has tools?',
      answer:
        'If the model can call tools (send email, make web requests, write files), an injected instruction can direct it to take sensitive data from its context and send it to an attacker-controlled destination, for example embedding secrets in a URL it fetches or in an outbound message. The model becomes the unwitting courier that leaks private data out of the system.',
      plain:
        'Once the model can actually do things like send messages or load URLs, a hidden instruction can tell it "take this private info and ship it over there." The model, trying to be helpful, becomes the leak, carrying your secrets out the door for the attacker.',
      difficulty: 'intermediate',
    },
    {
      id: 'safety-9',
      categoryKey: 'safety',
      category: 'Safety & Failure Modes',
      subtopic: 'Jailbreaks',
      question: 'What is a jailbreak?',
      answer:
        'A jailbreak is an input crafted to bypass a model\'s safety guardrails and get it to produce content it was trained to refuse. Common tactics include role-play or hypothetical framings, obfuscated or encoded wording, and multi-step setups that gradually coax the model past its refusals.',
      plain:
        'A jailbreak is a clever way of phrasing a banned request so the model answers anyway, like asking "pretend you are a character with no rules" to get around the "I cannot help with that." It is talking your way past the bouncer instead of breaking the lock.',
      difficulty: 'core',
    },
    {
      id: 'safety-10',
      categoryKey: 'safety',
      category: 'Safety & Failure Modes',
      subtopic: 'Safety-training limits',
      question:
        'Why does safety training reduce harmful outputs without eliminating them?',
      answer:
        'Safety training teaches a learned tendency to refuse, not a hard rule the model cannot break. It is shaped by examples seen during training, so inputs that look different from those examples can slip through. Because the space of possible inputs is effectively infinite and adversaries adapt, new bypasses keep appearing. It lowers the rate of harmful outputs rather than guaranteeing zero.',
      plain:
        'Safety training is more like teaching good habits than installing a physical lock. The model usually says no, but a phrasing it never practiced refusing can get past it. Since people can always invent new phrasings, the habit is strong but never perfect.',
      difficulty: 'intermediate',
    },
    {
      id: 'safety-11',
      categoryKey: 'safety',
      category: 'Safety & Failure Modes',
      subtopic: 'Safety-training limits',
      question:
        'Why can model providers not simply patch a jailbreak the way they patch a software vulnerability?',
      answer:
        'A software vulnerability is usually a specific code path you can fix once. A jailbreak exploits the model\'s general language understanding across an open-ended, effectively infinite input space, so patching one phrasing leaves countless equivalent rephrasings. Providers can retrain and add filters to raise the cost of attacks, but it is an ongoing adversarial process rather than a one-time fix.',
      plain:
        'A normal bug is one broken door you can weld shut. A jailbreak is more like a persuasive argument: block one version and someone rewords it. Providers keep hardening the model, but it is a continuing arms race, not a single permanent patch.',
      difficulty: 'advanced',
    },
    {
      id: 'safety-12',
      categoryKey: 'safety',
      category: 'Safety & Failure Modes',
      subtopic: 'Bias',
      question: 'What is bias in an LLM, and where does it come from?',
      answer:
        'Bias is systematic, unfair skew in a model\'s outputs tied to attributes like gender, race, age, or language. It comes from the training data: models learn from large amounts of human text that contain stereotypes, imbalances, and uneven coverage, and they reproduce those patterns. It can also be amplified or partly corrected by post-training choices.',
      plain:
        'Bias is the model leaning in a consistently unfair direction, like assuming a "nurse" is a woman and an "engineer" is a man. It picks this up from the human writing it learned from, which carries all of society\'s lopsided assumptions along with the facts.',
      difficulty: 'core',
    },
    {
      id: 'safety-13',
      categoryKey: 'safety',
      category: 'Safety & Failure Modes',
      subtopic: 'Fairness',
      question:
        'Why does fairness matter most when an LLM feeds real decisions about people?',
      answer:
        'When outputs influence consequential decisions (hiring, lending, content moderation, medical or legal triage), biased behavior produces concrete harm to real people and can carry legal and reputational consequences. The same skew that is a curiosity in casual chat becomes discrimination when it gates access or opportunity, so those uses demand explicit fairness testing and human review.',
      plain:
        'A biased autocomplete is annoying, but a biased hiring screen is discrimination. The higher the stakes for a real person, the more a lopsided model can actually hurt someone, so those uses need careful checking, not blind trust.',
      difficulty: 'intermediate',
    },
    {
      id: 'safety-14',
      categoryKey: 'safety',
      category: 'Safety & Failure Modes',
      subtopic: 'Toxicity',
      question:
        'Why can a model generate toxic or harmful content even after safety training?',
      answer:
        'Such content exists in the vast text the model learned from, so the capability to produce it is latent in the model. Safety training suppresses it for typical requests, but adversarial prompts (jailbreaks) or unusual phrasings can still surface it. That is why output filtering and monitoring are used as additional layers beyond the model\'s own refusals.',
      plain:
        'The model read a huge slice of the internet, so it has seen the ugly stuff and can in principle repeat it. Training teaches it to hold back, but a determined prompt can still pull it out, which is why apps add separate filters on top as a backstop.',
      difficulty: 'core',
    },
    {
      id: 'safety-15',
      categoryKey: 'safety',
      category: 'Safety & Failure Modes',
      subtopic: 'Defense in depth',
      question:
        'What does "defense in depth" mean for an LLM application, and why is it necessary?',
      answer:
        'Defense in depth means layering multiple independent safeguards (grounding, input and output filters, restricted tool permissions, monitoring, and human review) so that no single failure causes harm. It is necessary because every individual safeguard, including the model\'s own refusals, can fail, so you do not want any one of them to be the only thing standing between a bad input and a bad outcome.',
      plain:
        'It means not betting everything on one safeguard. Like a bank using locks, cameras, alarms, and guards together, you stack several checks so that if a clever prompt slips past one, another still catches it before real damage happens.',
      difficulty: 'core',
    },
    {
      id: 'safety-16',
      categoryKey: 'safety',
      category: 'Safety & Failure Modes',
      subtopic: 'Least privilege',
      question:
        'How does the principle of least privilege limit the damage from prompt injection or a jailbreak?',
      answer:
        'Least privilege means giving the model only the minimum tool access a task needs: read-only where possible, narrowly scoped actions, no blanket shell or send-money capability. Then even if an attacker hijacks the model through injection or a jailbreak, the set of actions it can take is small, so the blast radius of any single compromise is limited.',
      plain:
        'Give the model only the keys it truly needs, not the master key. If someone tricks it, the worst it can do is whatever those few keys unlock. A model that can only read a calendar cannot wire money no matter how it is fooled.',
      difficulty: 'intermediate',
    },
    {
      id: 'safety-17',
      categoryKey: 'safety',
      category: 'Safety & Failure Modes',
      subtopic: 'Human oversight',
      question:
        'For which kinds of actions should a human stay in the loop, and why?',
      answer:
        'Keep a human approving any action that is irreversible or high-stakes: sending money, deleting data, sending external messages, publishing content, or anything affecting real people or systems. Because the model can be wrong or manipulated and cannot undo a real-world action, a human checkpoint catches errors before they cause harm that cannot be taken back.',
      plain:
        'Let the model draft and suggest, but make a person press the button on anything you cannot easily undo, like spending money, deleting records, or hitting publish. The model can be confidently wrong, and you want a human to catch it before it is too late to reverse.',
      difficulty: 'core',
    },
    {
      id: 'safety-18',
      categoryKey: 'safety',
      category: 'Safety & Failure Modes',
      subtopic: 'When to distrust an answer',
      question:
        'What are practical signals that an LLM answer needs independent verification before you act on it?',
      answer:
        'Distrust answers that include specific facts the model could not actually know (precise figures, dates, quotes, citations, legal or medical specifics), anything about recent events past its training, high-stakes or irreversible decisions, and cases where it has no provided source to ground the claim. When any of these apply, check the specifics against an authoritative source rather than taking the wording at face value.',
      plain:
        'Be skeptical when the answer hangs on exact numbers, names, quotes, or citations, touches money, law, or health, concerns recent news, or has no source behind it. Those are exactly the moments to look it up yourself rather than trust a confident sentence.',
      difficulty: 'intermediate',
    },
    {
      id: 'safety-19',
      categoryKey: 'safety',
      category: 'Safety & Failure Modes',
      subtopic: 'Red-teaming',
      question:
        'What is red-teaming, and what role does it play in deploying an LLM safely?',
      answer:
        'Red-teaming is deliberately attacking your own system with adversarial prompts, jailbreak attempts, and edge-case scenarios to discover failures before real users or attackers do. It plays the role of stress-testing: it surfaces injection paths, refusal bypasses, and biased or harmful outputs so you can add or tighten safeguards, and it is ongoing because new attacks keep emerging.',
      plain:
        'Red-teaming is hiring people to try to break your own system on purpose, like a store paying someone to attempt shoplifting to find the weak spots. You probe for trouble yourself so you can fix it before a real bad actor finds it first.',
      difficulty: 'advanced',
    },
  ],
};

export default mod;
