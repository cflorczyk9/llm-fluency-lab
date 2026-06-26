// Module: Multimodal Models (new)

import type { Category } from '../../types';

const mod: Category = {
  "key": "multimodal",
  "name": "Multimodal Models",
  "tier": 3,
  "learningObjectives": [
    "By the end you can explain how images and audio are turned into tokens a model can process",
    "By the end you can describe what vision-language models can do: describe, read, and reason over images",
    "By the end you can explain the difference between understanding a modality and generating one",
    "By the end you can identify common multimodal failure modes like small text and fine spatial detail",
    "By the end you can describe practical uses like document and screenshot understanding",
    "By the end you can reason about the cost and resolution trade-offs of feeding images to a model"
  ],
  "summary": "Modern models do not only read text. They can also see images, and some can hear audio or generate images. This module explains how a picture or a sound is turned into the same kind of tokens a model already understands, what vision-language models are genuinely good at, and where they reliably break, like tiny text or precise spatial detail. The goal is to use multimodal models well and to know what to double-check.",
  "breakdown": [
    {
      "heading": "What multimodal means and how an image becomes tokens",
      "video": { "url": "https://www.youtube.com/watch?v=J51oZYcNvP8", "title": "What is Multimodal AI? How LLMs Process Text, Images, and More", "channel": "IBM Technology" },
      "explanation": "A modality is a type of input or output: text, images, audio, video. A multimodal model can handle more than one. The trick that makes this work is that everything is converted into the same currency the model already uses: tokens, which are numeric vectors. For text, a tokenizer splits words into pieces. For images, the picture is cut into a grid of small square patches (think of a tiled mosaic), and each patch is turned into a vector by a vision encoder. Those patch vectors are fed into the model right alongside the text tokens, so the model processes a sentence and a photo through the same machinery. This is why people say a model 'sees' an image: it is really reading a sequence of patch vectors that stand in for the picture. The key consequence is that an image costs tokens, and a bigger or higher-resolution image becomes more patches and therefore more tokens.",
      "keyTerms": [
        {
          "term": "modality",
          "definition": "A type of input or output a model handles: text, images, audio, or video. 'Multimodal' means it handles more than one."
        },
        {
          "term": "image patch",
          "definition": "A small square tile the image is cut into (like one piece of a mosaic). Each patch is encoded into a vector, and the patches together stand in for the whole image."
        },
        {
          "term": "vision encoder",
          "definition": "The part of the model that turns image patches into vectors the language model can read, so a picture enters the model as a sequence of tokens alongside text."
        },
        {
          "term": "visual tokens",
          "definition": "The patch vectors that represent an image inside the model. They occupy context and cost money just like text tokens, so larger images cost more."
        }
      ],
      "caption": "The picture is cut into a grid of small patches, each turned into a vector by a vision encoder. Those visual tokens enter the model in one sequence next to the text tokens, so a bigger image means more tokens.",
      "svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 200" width="100%" preserveAspectRatio="xMidYMid meet" role="img" font-family="system-ui, -apple-system, Segoe UI, Roboto, sans-serif">
<title>An image becomes patch tokens fed to the model beside text</title>
<style>.mm1dot{animation:mm1flow 2.4s linear infinite}@keyframes mm1flow{0%{transform:translateX(0);opacity:0}15%{opacity:1}85%{opacity:1}100%{transform:translateX(18px);opacity:0}}@media (prefers-reduced-motion: reduce){.mm1dot{animation:none;opacity:0}}</style>
<defs><marker id="mm1ar" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7 z" fill="#6b7280"/></marker></defs>
<rect x="0.5" y="0.5" width="359" height="199" rx="10" fill="#ffffff" stroke="#e6dfce"/>
<text x="45" y="60" font-size="9" fill="#6b7280" text-anchor="middle">image</text>
<rect x="16" y="66" width="58" height="58" rx="4" fill="#efe9da" stroke="#e6dfce"/>
<circle cx="34" cy="86" r="8" fill="#d97706"/>
<path d="M20,124 L46,94 L72,124 Z" fill="#1f7a50"/>
<line x1="35.3" y1="66" x2="35.3" y2="124" stroke="#ffffff" stroke-width="1" opacity="0.7"/>
<line x1="54.6" y1="66" x2="54.6" y2="124" stroke="#ffffff" stroke-width="1" opacity="0.7"/>
<line x1="16" y1="85.3" x2="74" y2="85.3" stroke="#ffffff" stroke-width="1" opacity="0.7"/>
<line x1="16" y1="104.6" x2="74" y2="104.6" stroke="#ffffff" stroke-width="1" opacity="0.7"/>
<line x1="76" y1="95" x2="92" y2="95" stroke="#6b7280" stroke-width="1.5" marker-end="url(#mm1ar)"/>
<circle class="mm1dot" cx="78" cy="95" r="2.5" fill="#2f8cff"/>
<rect x="94" y="78" width="56" height="34" rx="7" fill="#ffffff" stroke="#e6dfce"/>
<text x="122" y="93" font-size="9" fill="#1c1d1f" text-anchor="middle">vision</text>
<text x="122" y="105" font-size="9" fill="#1c1d1f" text-anchor="middle">encoder</text>
<line x1="152" y1="95" x2="168" y2="95" stroke="#6b7280" stroke-width="1.5" marker-end="url(#mm1ar)"/>
<text x="222" y="60" font-size="9" fill="#6b7280" text-anchor="middle">one token sequence</text>
<rect x="174" y="80" width="14" height="14" rx="2" fill="#2f8cff"/>
<rect x="191" y="80" width="14" height="14" rx="2" fill="#2f8cff"/>
<rect x="208" y="80" width="14" height="14" rx="2" fill="#2f8cff"/>
<rect x="225" y="80" width="14" height="14" rx="2" fill="#2f8cff"/>
<rect x="246" y="80" width="14" height="14" rx="2" fill="#1c1d1f"/>
<rect x="263" y="80" width="14" height="14" rx="2" fill="#1c1d1f"/>
<text x="205" y="110" font-size="8" fill="#6b7280" text-anchor="middle">image patches</text>
<text x="261" y="110" font-size="8" fill="#6b7280" text-anchor="middle">text</text>
<line x1="282" y1="95" x2="298" y2="95" stroke="#6b7280" stroke-width="1.5" marker-end="url(#mm1ar)"/>
<rect x="300" y="74" width="44" height="42" rx="8" fill="#0b5394"/>
<text x="322" y="99" font-size="10" font-weight="600" fill="#ffffff" text-anchor="middle">Model</text>
</svg>`
    },
    {
      "heading": "Vision-language models: what they can do",
      "video": { "url": "https://www.youtube.com/watch?v=lOD_EE96jhM", "title": "What Are Vision Language Models? How AI Sees & Understands Images", "channel": "IBM Technology" },
      "explanation": "A vision-language model (VLM) takes text and images together and reasons over both. In practice that unlocks several abilities. It can describe an image in words (captioning). It can read text inside an image, which covers handwriting, signs, screenshots, and scanned documents, a capability that overlaps with traditional OCR (optical character recognition) but is more flexible because the model also understands context. And it can reason over an image: answer questions about it, compare two pictures, explain a chart, or extract structured fields from a form. The big mental model shift is that the image is just more context: the same model that can summarize a paragraph can now summarize a screenshot, so the prompt patterns you already know mostly carry over.",
      "keyTerms": [
        {
          "term": "vision-language model (VLM)",
          "definition": "A model that accepts both text and images and reasons over them together, so you can ask questions about a picture in plain language."
        },
        {
          "term": "captioning",
          "definition": "Generating a text description of what is in an image, the most basic vision skill."
        },
        {
          "term": "visual question answering",
          "definition": "Answering questions about an image (what is it, how many, what does this chart show), treating the picture as context the way text is context."
        },
        {
          "term": "OCR (optical character recognition)",
          "definition": "Reading text that appears inside an image, like a scanned page or a screenshot. VLMs do this flexibly and can also interpret the meaning, not just transcribe."
        }
      ],
      "caption": "A vision-language model takes text and an image together. From that it can describe the picture, read the words inside it, and reason about it like answering a question or explaining a chart.",
      "svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 200" width="100%" preserveAspectRatio="xMidYMid meet" role="img" font-family="system-ui, -apple-system, Segoe UI, Roboto, sans-serif">
<title>A vision-language model takes text and image and can describe, read, and reason</title>
<style>.mm2p{animation:mm2pulse 2.8s ease-in-out infinite}@keyframes mm2pulse{0%,100%{opacity:1}50%{opacity:.5}}@media (prefers-reduced-motion: reduce){.mm2p{animation:none}}</style>
<defs><marker id="mm2ar" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7 z" fill="#6b7280"/></marker></defs>
<rect x="0.5" y="0.5" width="359" height="199" rx="10" fill="#ffffff" stroke="#e6dfce"/>
<text x="33" y="48" font-size="8.5" fill="#6b7280" text-anchor="middle">image</text>
<rect x="16" y="54" width="34" height="26" rx="4" fill="#efe9da" stroke="#e6dfce"/>
<circle cx="27" cy="67" r="5" fill="#d97706"/>
<text x="33" y="98" font-size="8.5" fill="#6b7280" text-anchor="middle">text</text>
<rect x="16" y="104" width="34" height="26" rx="4" fill="#efe9da" stroke="#e6dfce"/>
<rect x="22" y="110" width="22" height="3" rx="1" fill="#6b7280"/>
<rect x="22" y="116" width="22" height="3" rx="1" fill="#6b7280"/>
<rect x="22" y="122" width="16" height="3" rx="1" fill="#6b7280"/>
<line x1="50" y1="67" x2="90" y2="86" stroke="#6b7280" stroke-width="1.3" marker-end="url(#mm2ar)"/>
<line x1="50" y1="117" x2="90" y2="100" stroke="#6b7280" stroke-width="1.3" marker-end="url(#mm2ar)"/>
<rect class="mm2p" x="92" y="66" width="70" height="58" rx="8" fill="#ffffff" stroke="#2f8cff" stroke-width="1.8"/>
<text x="127" y="91" font-size="13" font-weight="600" fill="#0b5394" text-anchor="middle">VLM</text>
<text x="127" y="107" font-size="8" fill="#6b7280" text-anchor="middle">text + image</text>
<line x1="162" y1="74" x2="194" y2="55" stroke="#6b7280" stroke-width="1.3" marker-end="url(#mm2ar)"/>
<line x1="162" y1="95" x2="194" y2="99" stroke="#6b7280" stroke-width="1.3" marker-end="url(#mm2ar)"/>
<line x1="162" y1="116" x2="194" y2="143" stroke="#6b7280" stroke-width="1.3" marker-end="url(#mm2ar)"/>
<rect x="196" y="40" width="150" height="30" rx="6" fill="#ffffff" stroke="#e6dfce"/>
<text x="208" y="59" font-size="10" font-weight="600" fill="#1c1d1f" text-anchor="start">Describe</text>
<text x="272" y="59" font-size="9" fill="#6b7280" text-anchor="start">caption</text>
<rect x="196" y="84" width="150" height="30" rx="6" fill="#ffffff" stroke="#e6dfce"/>
<text x="208" y="103" font-size="10" font-weight="600" fill="#1c1d1f" text-anchor="start">Read text</text>
<text x="276" y="103" font-size="9" fill="#6b7280" text-anchor="start">OCR</text>
<rect x="196" y="128" width="150" height="30" rx="6" fill="#ffffff" stroke="#e6dfce"/>
<text x="208" y="147" font-size="10" font-weight="600" fill="#1c1d1f" text-anchor="start">Reason</text>
<text x="266" y="147" font-size="9" fill="#6b7280" text-anchor="start">visual Q and A</text>
</svg>`
    },
    {
      "heading": "Understanding versus generating, and the cost of resolution",
      "video": { "url": "https://www.youtube.com/watch?v=1CIpzeNxIhU", "title": "How AI Image Generators Work (Stable Diffusion / Dall-E) - Computerphile", "channel": "Computerphile" },
      "explanation": "Reading a modality and producing one are different jobs, often handled by different models. A vision-language model understands images. An image-generation model produces them, and these are usually separate systems even from the same vendor. The same split holds for audio: transcribing speech to text (understanding) is different from speaking text aloud (generation). Image generation models are commonly built on a method called diffusion, which starts from random noise and repeatedly refines it toward a picture that matches the prompt. On the input side, resolution is the central trade-off. A higher-resolution image gives the model more patches and so more detail to work with, which helps it read small text or notice fine features, but it also costs more tokens and slows the request. Downscaling an image to save money can quietly erase the very detail you needed, so you pick resolution based on what the task actually requires.",
      "keyTerms": [
        {
          "term": "understanding vs generating",
          "definition": "Reading or interpreting a modality (image in, text out) is a different capability from producing it (text in, image out), often done by separate models."
        },
        {
          "term": "diffusion model",
          "definition": "A common image-generation method that starts from random noise and refines it step by step into a picture matching the prompt. Used for generation, not understanding."
        },
        {
          "term": "resolution trade-off",
          "definition": "Higher-resolution input gives more patches and more visible detail but costs more tokens and time. Downscaling saves money but can erase the detail you needed."
        },
        {
          "term": "speech-to-text vs text-to-speech",
          "definition": "Transcribing spoken audio into words (understanding) versus speaking written text aloud (generation), two separate audio capabilities."
        }
      ],
      "caption": "Reading an image and making one are different jobs, usually different models. Understanding goes image in, text out. Generating goes text in, image out, often by refining random noise step by step.",
      "svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 200" width="100%" preserveAspectRatio="xMidYMid meet" role="img" font-family="system-ui, -apple-system, Segoe UI, Roboto, sans-serif">
<title>Understanding takes image to text, generating takes text to image</title>
<style>.mm3dot{animation:mm3flow 2.6s linear infinite}@keyframes mm3flow{0%{transform:translateX(0);opacity:0}15%{opacity:1}85%{opacity:1}100%{transform:translateX(180px);opacity:0}}@media (prefers-reduced-motion: reduce){.mm3dot{animation:none;opacity:0}}</style>
<defs><marker id="mm3ar" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7 z" fill="#6b7280"/></marker></defs>
<rect x="0.5" y="0.5" width="359" height="199" rx="10" fill="#ffffff" stroke="#e6dfce"/>
<rect x="22" y="44" width="60" height="32" rx="6" fill="#efe9da" stroke="#e6dfce"/>
<text x="52" y="64" font-size="10" fill="#1c1d1f" text-anchor="middle">Image</text>
<line x1="86" y1="60" x2="272" y2="60" stroke="#6b7280" stroke-width="1.5" marker-end="url(#mm3ar)"/>
<circle class="mm3dot" cx="88" cy="60" r="2.5" fill="#1f7a50"/>
<text x="179" y="50" font-size="10" font-weight="600" fill="#1f7a50" text-anchor="middle">understand</text>
<text x="179" y="73" font-size="8" fill="#6b7280" text-anchor="middle">image in, text out</text>
<rect x="276" y="44" width="60" height="32" rx="6" fill="#ffffff" stroke="#e6dfce"/>
<text x="306" y="64" font-size="10" fill="#1c1d1f" text-anchor="middle">Text</text>
<line x1="18" y1="98" x2="342" y2="98" stroke="#e6dfce"/>
<rect x="22" y="124" width="60" height="32" rx="6" fill="#ffffff" stroke="#e6dfce"/>
<text x="52" y="144" font-size="10" fill="#1c1d1f" text-anchor="middle">Text</text>
<text x="179" y="118" font-size="10" font-weight="600" fill="#d97706" text-anchor="middle">generate (diffusion)</text>
<line x1="86" y1="140" x2="124" y2="140" stroke="#6b7280" stroke-width="1.3" marker-end="url(#mm3ar)"/>
<rect x="126" y="128" width="24" height="24" rx="3" fill="#efe9da" stroke="#e6dfce"/>
<circle cx="132" cy="134" r="1.3" fill="#6b7280"/><circle cx="142" cy="132" r="1.3" fill="#6b7280"/><circle cx="136" cy="140" r="1.3" fill="#6b7280"/><circle cx="144" cy="146" r="1.3" fill="#6b7280"/><circle cx="131" cy="146" r="1.3" fill="#6b7280"/>
<line x1="151" y1="140" x2="161" y2="140" stroke="#6b7280" stroke-width="1.3" marker-end="url(#mm3ar)"/>
<rect x="162" y="128" width="24" height="24" rx="3" fill="#efe9da" stroke="#e6dfce"/>
<circle cx="170" cy="136" r="3" fill="#d97706"/><path d="M164,152 L172,143 L180,152 Z" fill="#1f7a50"/>
<line x1="187" y1="140" x2="272" y2="140" stroke="#6b7280" stroke-width="1.3" marker-end="url(#mm3ar)"/>
<text x="230" y="134" font-size="8" fill="#6b7280" text-anchor="middle">text in, image out</text>
<rect x="276" y="124" width="60" height="32" rx="6" fill="#efe9da" stroke="#e6dfce"/>
<text x="306" y="144" font-size="10" fill="#1c1d1f" text-anchor="middle">Image</text>
</svg>`
    },
    {
      "heading": "Failure modes and practical uses",
      "video": { "url": "https://www.youtube.com/watch?v=NpWP-hOq6II", "title": "Dissecting Vision Language Models: How AI Sees", "channel": "Jacob Danner" },
      "explanation": "Vision models are strong at the gist of an image and weaker at exact detail. They reliably struggle with very small or low-contrast text, dense tables, precise counting of many similar objects, and exact spatial relationships (which item is third from the left, the precise pixel location of a button). Like text models, they can also hallucinate: confidently describe something that is not in the image or misread a number, so anything load-bearing, a dollar figure on an invoice, a date on a form, should be verified. Grounding, tying a claim to a specific region of the image, is an active weak spot, which is why asking for exact coordinates or bounding boxes is less reliable than asking what is present. Despite these limits, the practical wins are large: reading screenshots and PDFs, extracting fields from documents and receipts, describing images for accessibility, and answering questions about charts and diagrams. The rule of thumb is to lean on these models for understanding and summarizing, and to verify any precise number, location, or count.",
      "keyTerms": [
        {
          "term": "small-text failure",
          "definition": "Vision models miss or misread tiny, blurry, or low-contrast text, because at a given resolution there are too few patches covering it. Raise resolution or crop to fix."
        },
        {
          "term": "visual hallucination",
          "definition": "Confidently describing something not actually in the image, or misreading a value. Always verify load-bearing details like amounts, dates, and counts."
        },
        {
          "term": "grounding",
          "definition": "Linking a statement to the specific part of an image it refers to. Models are weaker at exact locations and bounding boxes than at saying what is present."
        },
        {
          "term": "spatial reasoning",
          "definition": "Judging precise positions, counts, and arrangements (third from the left, how many of these). A reliable weak spot, so double-check exact spatial claims."
        }
      ],
      "caption": "Vision models read the overall picture well but slip on fine detail. Small text, exact counts, and precise positions are weak spots, so check any number or location that matters.",
      "svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 200" width="100%" preserveAspectRatio="xMidYMid meet" role="img" font-family="system-ui, -apple-system, Segoe UI, Roboto, sans-serif">
<title>Vision models are strong on the gist and weak on exact detail</title>
<style>.mm4p{animation:mm4pulse 2.8s ease-in-out infinite}@keyframes mm4pulse{0%,100%{opacity:1}50%{opacity:.55}}@media (prefers-reduced-motion: reduce){.mm4p{animation:none}}</style>
<rect x="0.5" y="0.5" width="359" height="199" rx="10" fill="#ffffff" stroke="#e6dfce"/>
<rect x="130" y="14" width="100" height="56" rx="6" fill="#efe9da" stroke="#e6dfce"/>
<circle cx="150" cy="34" r="7" fill="#d97706"/>
<path d="M134,70 L165,40 L196,70 Z" fill="#1f7a50"/>
<circle class="mm4p" cx="224" cy="24" r="10" fill="#1f7a50"/>
<path d="M219,24 l4,4 l7,-8" stroke="#ffffff" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
<text x="180" y="88" font-size="10" font-weight="600" fill="#1f7a50" text-anchor="middle">gist of the image: reliable</text>
<rect x="16" y="102" width="104" height="58" rx="7" fill="#ffffff" stroke="#e6dfce"/>
<circle cx="30" cy="116" r="3" fill="#dc2626"/>
<text x="68" y="126" font-size="10" font-weight="600" fill="#1c1d1f" text-anchor="middle">small text</text>
<text x="68" y="146" font-size="8.5" fill="#dc2626" text-anchor="middle">misreads $1,200</text>
<rect x="128" y="102" width="104" height="58" rx="7" fill="#ffffff" stroke="#e6dfce"/>
<circle cx="142" cy="116" r="3" fill="#dc2626"/>
<text x="180" y="126" font-size="10" font-weight="600" fill="#1c1d1f" text-anchor="middle">counting</text>
<text x="180" y="146" font-size="8.5" fill="#dc2626" text-anchor="middle">guesses, not exact</text>
<rect x="240" y="102" width="104" height="58" rx="7" fill="#ffffff" stroke="#e6dfce"/>
<circle cx="254" cy="116" r="3" fill="#dc2626"/>
<text x="292" y="126" font-size="10" font-weight="600" fill="#1c1d1f" text-anchor="middle">exact location</text>
<text x="292" y="146" font-size="8.5" fill="#dc2626" text-anchor="middle">where? unsure</text>
<text x="180" y="186" font-size="9" fill="#6b7280" text-anchor="middle">strong on the gist, verify any exact value</text>
</svg>`
    }
  ],
  "cards": [
    {
      "id": "multimodal-0",
      "categoryKey": "multimodal",
      "category": "Multimodal Models",
      "subtopic": "What multimodal means",
      "question": "What does it mean for a model to be 'multimodal'?",
      "answer": "A modality is a type of input or output: text, images, audio, or video. A multimodal model can handle more than one, for example reading text and images together, or transcribing audio. It works by converting every modality into the same internal currency, tokens, so one model can process a sentence and a photo through the same machinery.",
      "plain": "A 'modality' is just a kind of input: words, pictures, sound. A multimodal model can take in more than one. It is like a person who can both read a letter and look at the photo clipped to it, instead of only being able to read.",
      "difficulty": "core"
    },
    {
      "id": "multimodal-1",
      "categoryKey": "multimodal",
      "category": "Multimodal Models",
      "subtopic": "Image patches",
      "question": "How does an image get turned into something a language model can process?",
      "answer": "The image is cut into a grid of small square patches, and a vision encoder turns each patch into a vector. Those patch vectors are fed into the model right alongside the text tokens. So the model never sees pixels directly; it reads a sequence of patch vectors that stand in for the picture, the same way it reads token vectors for text.",
      "plain": "The picture is chopped into a grid of little tiles, like a mosaic, and each tile is turned into a string of numbers. The model reads those numbers the same way it reads words. It does not 'look' at the photo so much as read a numbered description of every tile.",
      "difficulty": "core"
    },
    {
      "id": "multimodal-2",
      "categoryKey": "multimodal",
      "category": "Multimodal Models",
      "subtopic": "Visual tokens",
      "question": "Why does feeding a model a large image use up context and cost money?",
      "answer": "Each image patch becomes a visual token, and visual tokens occupy the context window and are billed just like text tokens. A larger or higher-resolution image is cut into more patches, so it produces more tokens. A single high-resolution image can cost as much as a page or more of text, which is why image inputs are not free.",
      "plain": "Every tile the picture is cut into counts as a token, just like a word does. A big, detailed photo makes a lot of tiles, so it eats up space and money like feeding the model a few pages of text. Pictures are not free just because they are not words.",
      "difficulty": "intermediate"
    },
    {
      "id": "multimodal-3",
      "categoryKey": "multimodal",
      "category": "Multimodal Models",
      "subtopic": "Vision-language models",
      "question": "What is a vision-language model (VLM)?",
      "answer": "A vision-language model accepts both text and images in the same request and reasons over them together. You can show it a picture and ask questions in plain language: describe it, read the text in it, explain the chart, or compare two images. The image becomes additional context, so the prompting patterns you use for text mostly carry over.",
      "plain": "A vision-language model is one that can take a picture and a question at the same time and answer in words. You can paste a screenshot and ask 'what does this error mean?' the same way you would paste text and ask about it.",
      "difficulty": "core"
    },
    {
      "id": "multimodal-4",
      "categoryKey": "multimodal",
      "category": "Multimodal Models",
      "subtopic": "Vision-language models",
      "question": "Name three distinct things a vision-language model can do with an image.",
      "answer": "It can describe the image in words (captioning), read text that appears inside it (handwriting, signs, screenshots, scanned pages), and reason over it: answer questions, compare two images, interpret a chart, or extract structured fields from a form. These range from simple description to genuine reasoning about content.",
      "plain": "Three things: tell you what is in the picture, read any words printed in it, and actually think about it, like answering 'which quarter had the highest sales?' from a bar chart. It is not just labeling, it can reason about what it sees.",
      "difficulty": "core"
    },
    {
      "id": "multimodal-5",
      "categoryKey": "multimodal",
      "category": "Multimodal Models",
      "subtopic": "Understanding vs generating",
      "question": "Why is understanding an image a different capability from generating one?",
      "answer": "Understanding takes an image in and produces text out (describe, read, reason). Generating takes text in and produces an image out. These are usually separate models even from the same vendor, built on different methods. A model that can analyze a photo cannot necessarily create one, and vice versa, so you should not assume one implies the other.",
      "plain": "Reading a painting and painting one are different skills. A model that can describe a photo in detail might not be able to draw anything at all, because making pictures is a separate system from interpreting them, like a critic versus an artist.",
      "difficulty": "core"
    },
    {
      "id": "multimodal-6",
      "categoryKey": "multimodal",
      "category": "Multimodal Models",
      "subtopic": "Audio and speech",
      "question": "How is audio handled by a multimodal model, similar to images?",
      "answer": "Audio is converted into tokens too. A sound clip is sliced into short time segments and turned into vectors (often via a spectrogram, a picture of the sound's frequencies over time), which the model reads like any other tokens. So speech and music enter the model as a sequence of vectors, the same general approach as cutting an image into patches.",
      "plain": "Sound gets the same treatment as a picture: it is sliced into tiny time-chunks, each turned into numbers the model can read. A common trick is to turn the audio into a kind of image of its pitches over time, then treat it like a picture.",
      "difficulty": "intermediate"
    },
    {
      "id": "multimodal-7",
      "categoryKey": "multimodal",
      "category": "Multimodal Models",
      "subtopic": "Audio and speech",
      "question": "What is the difference between speech-to-text and a model that natively understands audio?",
      "answer": "Speech-to-text (transcription) only converts spoken words into written text, discarding tone, pauses, and non-speech sound. A model that natively understands audio takes the sound itself as input and can reason about tone, emotion, overlapping speakers, or background noise, not just the words. Transcription is a narrower step; native audio understanding keeps more of the signal.",
      "plain": "Transcription just writes down the words, like subtitles, and loses how something was said. A model that hears the audio directly can also notice the sarcasm, the nervous pause, or the dog barking, because it keeps the actual sound, not only the words.",
      "difficulty": "intermediate"
    },
    {
      "id": "multimodal-8",
      "categoryKey": "multimodal",
      "category": "Multimodal Models",
      "subtopic": "OCR and documents",
      "question": "How does a vision-language model reading a document differ from traditional OCR?",
      "answer": "Traditional OCR transcribes the characters it sees and stops there. A vision-language model reads the text and understands it in context, so it can pull specific fields from a form, summarize an invoice, answer questions about a contract, or interpret a chart, all in one step. It transcribes and reasons together, which is more flexible but can also hallucinate, so verify key values.",
      "plain": "Old-style OCR just types out whatever letters it sees. A vision model reads the document and gets what it means, so you can ask 'what is the total and the due date?' and it finds them. More useful, but it can also make things up, so check the important numbers.",
      "difficulty": "core"
    },
    {
      "id": "multimodal-9",
      "categoryKey": "multimodal",
      "category": "Multimodal Models",
      "subtopic": "Image generation",
      "question": "Is the model that describes an image usually the same one that creates an image? Why does it matter?",
      "answer": "Usually no. Image understanding and image generation are typically separate models, even from the same provider, built with different methods. It matters because you cannot assume a model with strong vision can also draw, or that a strong image generator can analyze a photo. You pick the model for the direction you need: image-in or image-out.",
      "plain": "The 'look at this photo and explain it' model and the 'make me a picture of a cat' model are usually two different tools, even from the same company. Don't assume one does both, the way a great food critic is not automatically a great chef.",
      "difficulty": "intermediate"
    },
    {
      "id": "multimodal-10",
      "categoryKey": "multimodal",
      "category": "Multimodal Models",
      "subtopic": "Image generation",
      "question": "At a high level, how do diffusion-based image generators create a picture?",
      "answer": "A diffusion model starts from an image of pure random noise and repeatedly refines it, step by step, nudging the pixels toward something that matches the text prompt, until a coherent picture emerges. It learned this by being trained to reverse the process of gradually adding noise to real images. It is generation by denoising, not by drawing stroke by stroke.",
      "plain": "Imagine starting with TV static and slowly cleaning it up, step after step, until a clear picture of what you asked for appears. The model learned to do that by practicing on millions of images that had noise added, then removed. It sculpts the photo out of randomness rather than drawing it.",
      "difficulty": "advanced"
    },
    {
      "id": "multimodal-11",
      "categoryKey": "multimodal",
      "category": "Multimodal Models",
      "subtopic": "Resolution",
      "question": "Why does the resolution you send an image at change what the model can see?",
      "answer": "Higher resolution means the image is cut into more patches, so fine details like small text get spread across more tokens and become legible. Lower resolution packs more of the picture into each patch, blurring fine detail away. Downscaling an image to save tokens can erase exactly the detail you needed, so you match resolution to what the task requires.",
      "plain": "Send a tiny thumbnail and the model squints at a blur; send a crisp version and it can read the fine print. Shrinking the image to save money can wipe out the very detail you were asking about, like photographing a receipt from across the room.",
      "difficulty": "intermediate"
    },
    {
      "id": "multimodal-12",
      "categoryKey": "multimodal",
      "category": "Multimodal Models",
      "subtopic": "Failure modes",
      "question": "Why do vision models so often misread small or low-contrast text?",
      "answer": "Tiny or faint text is covered by only a few patches at a given resolution, so there simply are not enough visual tokens carrying its detail for the model to resolve the characters. The fix is practical: increase the input resolution, or crop and zoom to the region of interest so that small text gets more patches devoted to it.",
      "plain": "If a line of fine print only falls across a couple of mosaic tiles, there is not enough detail in those tiles to make out the letters. The cure is to zoom in or crop, so the small text gets more tiles and becomes readable.",
      "difficulty": "intermediate"
    },
    {
      "id": "multimodal-13",
      "categoryKey": "multimodal",
      "category": "Multimodal Models",
      "subtopic": "Failure modes",
      "question": "What are the most common things vision-language models get wrong?",
      "answer": "They struggle with very small or low-contrast text, dense tables, precise counting of many similar items, and exact spatial relationships (which item is third, the precise location of a button). They can also hallucinate, describing something not in the image or misreading a value. They are strong on the gist and weak on exact detail, so verify anything precise.",
      "plain": "They nail the overall picture but fumble the fine print: tiny text, busy tables, counting lots of similar things, and exactly where something sits. They can also confidently make stuff up. Trust them for the gist, double-check any exact number or position.",
      "difficulty": "core"
    },
    {
      "id": "multimodal-14",
      "categoryKey": "multimodal",
      "category": "Multimodal Models",
      "subtopic": "Failure modes",
      "question": "What is a visual hallucination, and what should you do about it?",
      "answer": "A visual hallucination is when the model confidently states something that is not actually in the image, or misreads a value like a dollar amount or date. It happens because the model fills gaps with plausible guesses, just as text models do. The defense is to verify any load-bearing detail (amounts, dates, counts) against the source rather than trusting the description outright.",
      "plain": "Sometimes the model swears there is a stop sign in a photo that has none, or reads $1,200 as $7,200. It is guessing plausibly when unsure. So for anything that matters, like a price or a date, check it against the actual image instead of taking its word.",
      "difficulty": "intermediate"
    },
    {
      "id": "multimodal-15",
      "categoryKey": "multimodal",
      "category": "Multimodal Models",
      "subtopic": "Tokens and cost",
      "question": "How should you think about the cost of sending images to a model?",
      "answer": "Images are billed in tokens, and the token count grows with the image's size and resolution because more patches are produced. A handful of high-resolution images can cost as much as pages of text. So you trade resolution against price: send enough detail for the task, but downscale or crop when full resolution is not needed, and avoid attaching images you do not actually use.",
      "plain": "Every image is charged like a chunk of text, and bigger, sharper images cost more because they make more tiles. Send the detail you need and no more, the way you would not mail a giant high-res scan when a clear small one does the job.",
      "difficulty": "core"
    },
    {
      "id": "multimodal-16",
      "categoryKey": "multimodal",
      "category": "Multimodal Models",
      "subtopic": "Tokens and cost",
      "question": "You need to read a small serial number on a product photo cheaply. What is the trade-off, and a smart move?",
      "answer": "The trade-off is resolution versus cost: full resolution makes the serial number legible but costs many tokens, while downscaling is cheap but can blur it past reading. A smart move is to crop to just the region containing the serial number and send that small crop at high resolution, so you get the detail where it matters without paying for the whole image.",
      "plain": "Sending the whole sharp photo reads the number but costs a lot; shrinking it is cheap but blurs the number away. The clever middle path is to cut out just the patch with the serial number and send that piece crisp, so you pay for detail only where you need it.",
      "difficulty": "intermediate"
    },
    {
      "id": "multimodal-17",
      "categoryKey": "multimodal",
      "category": "Multimodal Models",
      "subtopic": "Grounding",
      "question": "What is 'grounding' in vision models, and why are exact coordinates unreliable?",
      "answer": "Grounding means tying a statement to the specific region of the image it refers to, for example pointing to where an object is. Models are far better at saying what is present than at giving exact pixel locations or bounding boxes, because precise spatial output is a known weak spot. So asking 'is there a button?' is more reliable than asking for its exact coordinates.",
      "plain": "Grounding is pointing, not just naming: saying not only 'there is a cat' but 'it is right here.' Models are good at the naming and shaky at the pointing, so asking exactly where something sits, in pixels, gives unreliable answers compared to asking whether it is there at all.",
      "difficulty": "advanced"
    },
    {
      "id": "multimodal-18",
      "categoryKey": "multimodal",
      "category": "Multimodal Models",
      "subtopic": "Spatial reasoning",
      "question": "Why is counting many similar objects or judging precise arrangement hard for vision models?",
      "answer": "Patch-based vision captures the overall scene well but blurs exact positions and boundaries between similar items, so the model approximates instead of tallying precisely. Counting twenty near-identical objects or deciding which is exactly third from the left requires fine spatial bookkeeping the representation does not preserve well, so these answers drift. Verify counts and orderings independently.",
      "plain": "Ask how many nearly identical screws are in a bin and the model will guess in the right ballpark but rarely nail it, because its mosaic view smears similar things together. Same with 'which one is exactly third.' For precise counts or order, check it yourself.",
      "difficulty": "advanced"
    },
    {
      "id": "multimodal-19",
      "categoryKey": "multimodal",
      "category": "Multimodal Models",
      "subtopic": "Use cases",
      "question": "What are strong, practical use cases for vision-language models today?",
      "answer": "Reading screenshots and PDFs, extracting fields from documents like invoices and receipts, describing images for accessibility, summarizing or answering questions about charts and diagrams, and turning a photo of a whiteboard or form into structured text. The pattern is understanding and summarizing visual content, while verifying any precise number, date, or count the output depends on.",
      "plain": "Great everyday jobs: read a screenshot, pull the total and date off a receipt, describe a photo for a blind user, or explain a chart. The sweet spot is 'understand this image for me,' as long as you double-check any exact figure it hands back.",
      "difficulty": "core"
    }
  ]
};

export default mod;
