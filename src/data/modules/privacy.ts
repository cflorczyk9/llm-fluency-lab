import type { Category } from '../../types';

const mod: Category = {
  key: 'privacy',
  name: 'Data, Privacy & Compliance',
  tier: 4,
  summary:
    'Every prompt you send is data leaving your control, so using these systems responsibly means knowing what happens to that data. This module covers whether your inputs train the model, how long they are kept, the risks of sending personal or secret information, practical safeguards like redaction and minimization, and the basics of the rules that may apply, so you can decide what is safe to send and what should stay local.',
  learningObjectives: [
    'By the end you can explain what providers may or may not do with your prompts and outputs',
    'By the end you can distinguish consumer products from business or API terms on training and retention',
    'By the end you can identify sensitive-data risks such as personal information, secrets, and confidential documents',
    'By the end you can apply practical safeguards like redaction, minimization, and access control',
    'By the end you can describe the high-level shape of relevant regulations and obligations',
    'By the end you can decide what is safe to send to a model versus what should stay local',
  ],
  breakdown: [
    {
      heading: 'Where your prompt actually goes',
      explanation:
        'When you use a hosted model, your prompt leaves your device, travels over the internet, and is processed on the provider servers, where it may be logged, briefly stored, and reviewed under certain conditions. What happens next depends entirely on the terms you agreed to, which differ sharply between a free consumer chatbot and a paid business or developer account. The single most important question is whether your inputs and the model outputs can be used to train future models, because training can bake fragments of your data into a system that millions of other people use. Reading which terms apply to you is the foundation of everything else in this module.',
      keyTerms: [
        {
          term: 'Prompt',
          definition:
            'Everything you send to the model, including your instructions, any pasted documents, and the prior conversation. All of it leaves your device when you use a hosted model.',
        },
        {
          term: 'Training on user data',
          definition:
            'Using your prompts and the model answers as material to improve future models. The key risk is that pieces of your data can end up influencing a model others use.',
        },
        {
          term: 'Logging',
          definition:
            'The provider recording your requests, typically for safety, abuse prevention, and debugging. Logged data is governed by the retention and access terms you accepted.',
        },
      ],
    },
    {
      heading: 'Consumer, business, and API terms',
      explanation:
        'The same company can offer very different privacy promises depending on the product. Free or low-cost consumer chat products more often reserve the right to use your conversations to improve the service, sometimes with an opt-out setting. Business, enterprise, and developer API tiers usually promise the opposite by default: your inputs are not used for training, retention is limited, and a formal data-processing agreement spells out the obligations. The practical lesson is that the tier you are on, not just the brand name, decides how your data is treated, so for anything sensitive you want to be on terms that explicitly say "no training" and short retention.',
      keyTerms: [
        {
          term: 'Consumer terms',
          definition:
            'The agreement for free or personal-use chatbots, which more often permits using your conversations to improve the product, sometimes with an opt-out.',
        },
        {
          term: 'Enterprise / API terms',
          definition:
            'Business and developer agreements that typically promise no training on your data by default, limited retention, and a formal data-processing contract.',
        },
        {
          term: 'Data-processing agreement (DPA)',
          definition:
            'A contract that defines how a vendor may handle your data on your behalf, including security, retention, deletion, and who else may touch it.',
        },
      ],
    },
    {
      heading: 'Retention, deletion, and sensitive data',
      explanation:
        'Even when a provider does not train on your data, it may still keep copies for a window of time for safety and debugging before deletion, and you should know that window and your rights over it. The bigger day-to-day risk is what you choose to put in the prompt. Personal information that identifies someone, secrets like passwords and access keys, and confidential business documents are all things that, once sent, you can no longer fully control. The defenses are simple and effective: remove or mask identifying details before sending, include only the minimum needed for the task, and never paste live credentials. Anything that absolutely cannot leave your walls should be handled by a model running on your own systems.',
      keyTerms: [
        {
          term: 'Retention',
          definition:
            'How long a provider keeps your data before deleting it. Even no-training tiers often retain inputs briefly for abuse monitoring and debugging.',
        },
        {
          term: 'Personal information (PII)',
          definition:
            'Data that identifies a specific person, such as a name with an address, a national ID number, an email, or health and financial details.',
        },
        {
          term: 'Secret',
          definition:
            'A credential that grants access, such as a password, API key, or token. Pasting one into a prompt can expose it through logs or screen-shares.',
        },
      ],
    },
    {
      heading: 'Safeguards, rules, and judgment',
      explanation:
        'Responsible use combines a few habits with awareness of the rules. Redaction means stripping or masking identifying details before they ever reach the model, and minimization means sending only the slice of data the task truly needs. On the rules side, broad privacy laws give people rights over their personal data and put obligations on whoever processes it, while sector-specific rules add stricter handling for things like health and financial records. Inside an organization, access control and audit logs decide who can use these tools and create a record of who sent what. Doing a little homework on a vendor (its terms, security posture, and who else it shares data with) rounds out a sensible approach.',
      keyTerms: [
        {
          term: 'Redaction',
          definition:
            'Removing or masking sensitive details (names, IDs, account numbers) from text before sending it, so the model never receives them.',
        },
        {
          term: 'Data minimization',
          definition:
            'The principle of including only the minimum data necessary for the task, reducing exposure if anything is logged, leaked, or misused.',
        },
        {
          term: 'Access control',
          definition:
            'Limiting which people or systems may use a tool or see certain data, paired with audit logs that record who did what.',
        },
      ],
    },
  ],
  cards: [
    {
      id: 'privacy-0',
      categoryKey: 'privacy',
      category: 'Data, Privacy & Compliance',
      subtopic: 'Where your prompt goes',
      question: 'When you send a prompt to a hosted model, what generally happens to that data?',
      answer:
        'It leaves your device, travels over the internet, and is processed on the provider servers, where it is typically logged and may be retained for a period and reviewed under certain conditions. Whether it can be used to train future models, and how long it is kept, depends entirely on the terms of the product or tier you are using.',
      plain:
        'Sending a prompt is like mailing a postcard to a company: it leaves your hands, passes through their system, and they may keep a copy. What they are allowed to do with it depends on the agreement you signed up under, not on good intentions.',
      difficulty: 'core',
    },
    {
      id: 'privacy-1',
      categoryKey: 'privacy',
      category: 'Data, Privacy & Compliance',
      subtopic: 'Training on user data',
      question: 'What does it mean for a provider to "train on your data," and why is it the key privacy question?',
      answer:
        'It means using your prompts and the model answers as material to improve future versions of the model. It is the central question because training can bake fragments of your input into a system that many other people use, so a confidential detail could, in principle, surface elsewhere. Whether a given product trains on your data is the first thing to check before sending anything sensitive.',
      plain:
        'Imagine telling a secret to someone who is studying to become a public encyclopedia. Even if they never repeat it word for word, your secret might shape what they say to others later. That is why "does this product learn from what I type?" is the question to ask first.',
      difficulty: 'core',
    },
    {
      id: 'privacy-2',
      categoryKey: 'privacy',
      category: 'Data, Privacy & Compliance',
      subtopic: 'Consumer vs enterprise',
      question: 'How do consumer chatbot terms typically differ from business or API terms on training and retention?',
      answer:
        'Free or personal-use consumer products more often reserve the right to use your conversations to improve the service, sometimes with an opt-out you must turn on. Business, enterprise, and developer API tiers usually promise the opposite by default: no training on your inputs, limited retention, and a formal data-processing agreement. The tier you are on, not just the brand, decides how your data is treated.',
      plain:
        'The free consumer app and the paid business plan from the same company can have opposite privacy rules. Free often means "we may learn from your chats unless you opt out." Business often means "we do not train on your data, by contract." Always check which lane you are actually in.',
      difficulty: 'intermediate',
    },
    {
      id: 'privacy-3',
      categoryKey: 'privacy',
      category: 'Data, Privacy & Compliance',
      subtopic: 'PII',
      question: 'What counts as personal information (PII), and why is it sensitive to send to a model?',
      answer:
        'Personal information is data that identifies a specific person, such as a full name paired with an address, a national ID or social security number, an email or phone number, or health and financial details. It is sensitive because once sent it may be logged or retained outside your control, it can trigger legal obligations, and exposing it can harm the person it describes.',
      plain:
        'PII is anything that points to a real, named human: their ID number, their address, their medical or money details. Once you paste it into a chatbot, you cannot un-send it. Treat it like someone else\'s wallet contents, not yours to scatter around.',
      difficulty: 'core',
    },
    {
      id: 'privacy-4',
      categoryKey: 'privacy',
      category: 'Data, Privacy & Compliance',
      subtopic: 'Secrets',
      question: 'Why should you never paste secrets like passwords or API keys into a prompt?',
      answer:
        'Because a secret is a credential that grants access, and once it is in a prompt it can be exposed through provider logs, retained copies, screen-shares, or shared chat histories, any of which could let someone misuse it. Unlike a typo you can fix, a leaked key can be abused immediately, so live credentials should be kept out of prompts entirely and rotated if they ever slip in.',
      plain:
        'An API key or password is a house key. Pasting it into a chat is like taping your house key to a postcard. It might pass through many hands and be photographed along the way. If one ever does slip out, change the lock (rotate the key) right away.',
      difficulty: 'core',
    },
    {
      id: 'privacy-5',
      categoryKey: 'privacy',
      category: 'Data, Privacy & Compliance',
      subtopic: 'Retention and deletion',
      question: 'If a provider promises not to train on your data, can it still keep copies of your prompts?',
      answer:
        'Yes. No-training and retention are separate promises. Many providers, even on business tiers, retain inputs for a limited window for safety monitoring, abuse prevention, and debugging before deleting them. So "we do not train on your data" does not by itself mean "we keep nothing." You should check the stated retention period and your deletion rights separately.',
      plain:
        'A hotel promising not to read your diary can still keep the diary in a drawer for a while. "We will not learn from it" and "we will not store it" are two different commitments. Ask about both, because one does not imply the other.',
      difficulty: 'intermediate',
    },
    {
      id: 'privacy-6',
      categoryKey: 'privacy',
      category: 'Data, Privacy & Compliance',
      subtopic: 'Retention and deletion',
      question: 'What deletion rights and behaviors should you look for from a model provider?',
      answer:
        'Look for a stated retention window after which data is deleted automatically, a way to delete your conversations or account data on request, and clarity on whether deletion also removes copies held by any subcontractors. Under some privacy laws you have a right to request deletion of your personal data. Note that data already absorbed into a trained model generally cannot be surgically removed, which is another reason not to send sensitive data in the first place.',
      plain:
        'You want to know two things: does my data auto-expire, and can I press a delete button that actually clears it everywhere? Be aware that if something was already used to train a model, you usually cannot pull it back out, so prevention beats deletion.',
      difficulty: 'intermediate',
    },
    {
      id: 'privacy-7',
      categoryKey: 'privacy',
      category: 'Data, Privacy & Compliance',
      subtopic: 'Redaction',
      question: 'What is redaction, and how does it reduce the risk of using a model on sensitive text?',
      answer:
        'Redaction is removing or masking sensitive details, such as names, ID numbers, and account numbers, from text before it is sent to the model, often replacing them with placeholders. It reduces risk because the provider never receives the identifying information, so even if the prompt is logged or leaked, the exposed data cannot be tied to a specific person. The model can still do its job on the structure and surrounding content.',
      plain:
        'Redaction is the black marker over names in a released document. You hand the model the report with the identifying bits blacked out, so it can still help with the content while the private parts never leave your hands.',
      difficulty: 'core',
    },
    {
      id: 'privacy-8',
      categoryKey: 'privacy',
      category: 'Data, Privacy & Compliance',
      subtopic: 'Data minimization',
      question: 'What is data minimization, and why is it a useful default when prompting?',
      answer:
        'Data minimization is including only the minimum data actually needed to complete the task and leaving everything else out. It is a useful default because anything you do not send cannot be logged, leaked, or misused, so trimming the prompt directly shrinks your exposure. In practice it means quoting the relevant paragraph instead of pasting the whole confidential file, and omitting identifiers the task does not require.',
      plain:
        'Send the slice, not the whole pie. If the model only needs one paragraph to answer, do not paste the entire confidential document. The data you never send is the data that can never come back to bite you.',
      difficulty: 'intermediate',
    },
    {
      id: 'privacy-9',
      categoryKey: 'privacy',
      category: 'Data, Privacy & Compliance',
      subtopic: 'What not to paste',
      question: 'What kinds of content should you avoid pasting into a general consumer chatbot?',
      answer:
        'Avoid live credentials (passwords, API keys, tokens), customer or patient personal data, regulated records such as health or financial files, confidential business documents and unreleased plans, and anything covered by a contract or law that restricts where it may go. On consumer terms these could be retained or used to improve the product, so they belong on a no-training tier, redacted, or kept on a local model instead.',
      plain:
        'A quick gut check before pasting: would I be comfortable if this showed up in a company training set or a leaked log? If it is a password, a customer record, a medical file, or an unreleased plan, the answer is no. Keep those out of the public chatbot.',
      difficulty: 'core',
    },
    {
      id: 'privacy-10',
      categoryKey: 'privacy',
      category: 'Data, Privacy & Compliance',
      subtopic: 'Local and on-prem',
      question: 'How does running a model locally or on-premises change the privacy picture for sensitive data?',
      answer:
        'When you run an open-weight model on your own hardware or inside your own network, the prompts and outputs never leave your control, so there is no third-party logging, retention, or training to worry about. That makes it the strongest option for data that legally or contractually cannot leave your walls. The trade-offs are that you take on the hardware, security, and maintenance, and self-hosted models may be less capable than the top hosted ones.',
      plain:
        'A hosted model is a public library computer, and a local model is a computer in your own locked office. For your most private documents, working on your own machine means nothing is mailed out. The cost is that you have to buy and maintain the machine yourself.',
      difficulty: 'core',
    },
    {
      id: 'privacy-11',
      categoryKey: 'privacy',
      category: 'Data, Privacy & Compliance',
      subtopic: 'Regulatory basics',
      question: 'What is the high-level shape of a broad privacy law like the GDPR-style regimes?',
      answer:
        'Such laws give individuals rights over their personal data (to access it, correct it, and request deletion) and place obligations on organizations that collect or process it, including having a lawful basis to use it, limiting use to stated purposes, keeping it secure, and being accountable for vendors who process it on their behalf. Sending personal data to a model is a form of processing, so these duties can extend to how you use AI tools.',
      plain:
        'Broad privacy laws basically say: people own their personal data, and if you handle it you must have a good reason, use it only for that reason, keep it safe, and answer for anyone you pass it to. Feeding someone personal data into a chatbot counts as handling it.',
      difficulty: 'intermediate',
    },
    {
      id: 'privacy-12',
      categoryKey: 'privacy',
      category: 'Data, Privacy & Compliance',
      subtopic: 'Regulatory basics',
      question: 'How do sector-specific rules (for example health or financial records) differ from general privacy laws?',
      answer:
        'Sector-specific rules add stricter, narrower requirements on top of general privacy law for particular kinds of data, such as health, financial, or children data. They often demand specific safeguards, signed agreements with any vendor that touches the data, and tight limits on use and sharing. So even a tool that satisfies general privacy law may not be cleared for regulated records until the extra sector requirements are met.',
      plain:
        'General privacy law is the baseline speed limit, and sector rules are the extra restrictions in a school zone. Health and financial data live in those stricter zones, so a tool that is fine for ordinary text may still be off-limits for medical or banking records until it meets the higher bar.',
      difficulty: 'intermediate',
    },
    {
      id: 'privacy-13',
      categoryKey: 'privacy',
      category: 'Data, Privacy & Compliance',
      subtopic: 'Access control',
      question: 'Why are access control and audit logs important when an organization adopts AI tools?',
      answer:
        'Access control limits which people and systems may use the tools and reach sensitive data, reducing the chance of misuse, while audit logs record who sent what and when, which is essential for investigating incidents and demonstrating compliance. Together they turn "anyone could paste anything anywhere" into a governed process where access is scoped and actions are traceable.',
      plain:
        'It is the difference between leaving the supply closet unlocked and giving out badges plus a sign-in sheet. Access control decides who gets in, and the log shows who took what. If something goes wrong, you can actually find out what happened.',
      difficulty: 'core',
    },
    {
      id: 'privacy-14',
      categoryKey: 'privacy',
      category: 'Data, Privacy & Compliance',
      subtopic: 'Vendor due diligence',
      question: 'What should you check about a model vendor before trusting it with company data?',
      answer:
        'Review its terms on training and retention, its security posture and any independent security certifications, where data is stored geographically, whether it will sign a data-processing agreement, and which subcontractors (sub-processors) may also handle your data. The goal is to confirm in writing that the vendor\'s obligations match your own legal and contractual duties before any sensitive data flows to it.',
      plain:
        'Before handing a contractor your house keys, you check their references, their insurance, and who else they will bring onto the job. Same with a model vendor: read the contract, confirm they take security seriously, and find out who else might touch your data.',
      difficulty: 'intermediate',
    },
    {
      id: 'privacy-15',
      categoryKey: 'privacy',
      category: 'Data, Privacy & Compliance',
      subtopic: 'What is safe to send',
      question: 'How can you decide on the spot whether a given piece of content is safe to send to a model?',
      answer:
        'Run a quick check. First, identify whether the content contains personal data, secrets, or regulated or contractually restricted material. Next, recall which terms your current tool operates under (training, retention, region). Then weigh whether the benefit justifies the exposure. If it is sensitive and you are on consumer terms, redact it, switch to a no-training tier, or use a local model. When in doubt, leave it out.',
      plain:
        'Pause and ask three things: is this private or secret, what are the rules of the tool I am about to use, and is it worth the risk? If it is sensitive and the tool is a public chatbot, black out the details, move to a stricter plan, or keep it local. Unsure means do not send.',
      difficulty: 'core',
    },
    {
      id: 'privacy-16',
      categoryKey: 'privacy',
      category: 'Data, Privacy & Compliance',
      subtopic: 'Vendor due diligence',
      question: 'What is a sub-processor, and why does it matter for your data?',
      answer:
        'A sub-processor is a third party that a vendor uses to help deliver its service and that may therefore touch your data, such as a cloud host or a content-moderation provider. It matters because your data protection is only as strong as the weakest party in that chain, and many regulations and contracts require you to know and approve who the sub-processors are and to ensure they carry the same obligations.',
      plain:
        'When you hire a moving company, they might subcontract part of the job to another crew who also handles your boxes. A sub-processor is that extra crew for your data. You want to know who they are and that they are held to the same care, because your stuff passes through their hands too.',
      difficulty: 'advanced',
    },
    {
      id: 'privacy-17',
      categoryKey: 'privacy',
      category: 'Data, Privacy & Compliance',
      subtopic: 'Redaction',
      question: 'Why is masking direct identifiers sometimes not enough to truly de-identify data?',
      answer:
        'Because people can be re-identified by combining several indirect details even when names are removed. A rare job title, a precise location, an unusual date, and an age can together point to one person, a problem known as re-identification through linkage. Strong de-identification therefore means generalizing or removing quasi-identifiers too, not just blacking out names and ID numbers.',
      plain:
        'Hiding the name is not always enough. "A 47-year-old left-handed orchestra conductor in a small town" may identify exactly one person even with no name attached. Truly anonymizing data means blurring the telltale combinations, not just deleting the obvious labels.',
      difficulty: 'advanced',
    },
    {
      id: 'privacy-18',
      categoryKey: 'privacy',
      category: 'Data, Privacy & Compliance',
      subtopic: 'Training on user data',
      question: 'Common misconception: if I type something into a chatbot, will it immediately tell my secret to other users?',
      answer:
        'Not in real time. A model does not have a live shared memory that pipes your current chat to other people, and on no-training tiers your input is not learned at all. The real risk is slower and indirect: if your data is used to train a future model, fragments could in rare cases be reproduced later. So the concern is legitimate but it is about future training and retention, not instant leakage to the next user.',
      plain:
        'Typing a secret does not beam it to the next person in line. The danger is more like ink soaking into paper over time: if your words are used to train a later model, traces could resurface eventually. Real risk, but a slow one, which is exactly why training and retention terms matter.',
      difficulty: 'advanced',
    },
    {
      id: 'privacy-19',
      categoryKey: 'privacy',
      category: 'Data, Privacy & Compliance',
      subtopic: 'Local and on-prem',
      question: 'When is the extra effort of a local or on-prem model clearly justified over a hosted one?',
      answer:
        'It is justified when data legally or contractually may not leave your environment, when you handle highly regulated records and cannot get adequate vendor guarantees, when you need to operate offline or in an air-gapped network, or when audit requirements demand full control of the data path. In those cases the privacy and control benefits outweigh the added hardware, security, and maintenance burden of self-hosting.',
      plain:
        'Self-hosting is worth the hassle when the data simply cannot go outside, for example strict medical, legal, or classified work, or when you must run with no internet at all. For everyday non-sensitive tasks, the convenience of a hosted model usually wins.',
      difficulty: 'intermediate',
    },
  ],
};

export default mod;
