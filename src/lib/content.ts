/**
 * All site content lives here.
 *
 * Every fact below comes from the résumé. Nothing is invented: there are no
 * client names, employer logos, testimonials, repository metrics or press
 * mentions, because none exist yet. If you add any, add the real thing.
 */

export const site = {
  name: "Shreenivas Joshi",
  role: "GenAI Architect & AI Lead",
  location: "Gurugram, India",
  email: "srinivasjoshi11@gmail.com",
  linkedin: "https://www.linkedin.com/in/shreenivas-joshi",
  resume: "/Shreenivas_Joshi_Resume.pdf",
  // Change this to your real domain before launch — it drives the canonical
  // URL, the sitemap, robots.txt and every social preview.
  url: "https://shreenivasjoshi.com",
  available: true,
  /** Stated once. Every place that offers availability reads this. */
  availability: "Open to leadership positions in AI",
  tagline:
    "I build production AI systems, and the teams that keep them running.",
  intro:
    "Five years across AI and deep learning, from computer vision for geospatial defence to enterprise GenAI. I lead an 18-engineer team at HB Software Solutions, and before that built an AI function from zero at Basal Analytics — including the funding that paid for it.",
} as const;

/* ── Characteristics ────────────────────────────────────────────────────────
   The same figures as `stats`, restructured the way a reference document
   states a measured value: parameter, value, unit, and the condition the
   value was measured under. Nothing here is new — every row is already in
   `roles`, `leadership` or PRODUCT.md. What is new is that a reader can no
   longer take a number without also taking where it came from.
   ─────────────────────────────────────────────────────────────────────────── */

export type Characteristic = {
  parameter: string;
  value: string;
  unit: string;
  conditions: string;
};

export const characteristics: Characteristic[] = [
  {
    parameter: "AI engineering team led",
    value: "18",
    unit: "engineers",
    conditions: "HB Software Solutions, current seat",
  },
  {
    parameter: "Voice response latency",
    value: "650–800",
    unit: "ms",
    conditions: "End to end, production telephony",
  },
  {
    parameter: "Projects delivered to production",
    value: "20+",
    unit: "projects",
    conditions: "Across HB Software Solutions and Basal Analytics",
  },
  {
    parameter: "Incubation funding secured",
    value: "₹3",
    unit: "Cr",
    conditions: "Basal Analytics, ≈ USD 360K",
  },
  {
    parameter: "Cloud grants secured",
    value: "≈50",
    unit: "USD K",
    conditions: "AWS ≈20 / Azure ≈25 / Google ≈5",
  },
  {
    parameter: "Team growth from first AI hire",
    value: "6 → 10",
    unit: "engineers",
    conditions: "Basal Analytics, function built from zero",
  },
  {
    parameter: "Experience in AI and deep learning",
    value: "5+",
    unit: "years",
    conditions: "Deep learning through enterprise GenAI",
  },
  {
    parameter: "Image-recognition accuracy",
    value: "+25",
    unit: "%",
    conditions: "Geospatial defence imagery",
  },
  {
    parameter: "Object-detection false positives",
    value: "−30",
    unit: "%",
    conditions: "Defence imagery pipeline",
  },
  {
    parameter: "Customer acquisition",
    value: "+30",
    unit: "%",
    conditions: "AI-enabled analytics offerings",
  },
];

/* ── The status rail ────────────────────────────────────────────────────────
   The four figures under the hero.

   They live here rather than in the component because the rail's own caption
   promises they come from the characteristics table, and a figure hardcoded
   in a component is exactly how that promise quietly stops being true. Every
   `value` and `unit` below is copied from a row above; `base` and `swing`
   belong to the trace behind the figure and mean nothing about the number.

   Which four, and why: the rail is the forty-second read, so it carries one
   figure for scale (projects shipped), two for leadership (the team led and
   the money raised to build one), and one for depth (years in the field).
   ─────────────────────────────────────────────────────────────────────────── */

export type RailFigure = {
  label: string;
  value: string;
  unit: string;
  /** Resting centre of the trace, 0–1, and how far it wanders. Decoration. */
  base: number;
  swing: number;
};

export const railFigures: RailFigure[] = [
  { label: "Projects in production", value: "20+", unit: "projects", base: 0.7, swing: 0.14 },
  { label: "AI engineers led", value: "18", unit: "engineers", base: 0.78, swing: 0.06 },
  { label: "Funding secured", value: "₹3", unit: "Cr", base: 0.52, swing: 0.18 },
  { label: "Experience in AI", value: "5+", unit: "years", base: 0.6, swing: 0.1 },
];

/**
 * The features list on the front page. Five lines, each one a claim already
 * made and evidenced elsewhere on this page.
 */
export const features: string[] = [
  "Leads an 18-engineer AI organisation; built a previous AI function from zero as its first hire",
  "Owns GenAI architecture and delivery end to end for enterprise conversational and agentic products",
  "Multimodal voice architecture holding 650–800 ms end-to-end latency in production",
  "Author of the org-wide microservice reference architecture and MLOps standard",
  "Secured ₹3 Cr incubation funding and ≈ USD 50K in cloud grants by writing the AI strategy",
];

/**
 * The block diagram: the pairing drawn as one circuit rather than argued as
 * two sections. The organisation half is the input stage, the systems half is
 * the output stage, and the evaluation framework closes the loop back onto the
 * architecture. Every stage and every figure below is on the résumé.
 */
export const blockStages = [
  { label: "AI strategy & funding", datum: "₹3 Cr · ≈USD 50K" },
  { label: "Team", datum: "18 engineers" },
  { label: "Reference architecture", datum: "microservices · MLOps" },
  { label: "Production systems", datum: "RAG · agents · voice" },
] as const;

export const blockFeedback = {
  label: "Evaluation & benchmarking",
  datum: "accuracy · interpretability · regression",
} as const;

export type Project = {
  slug: string;
  title: string;
  summary: string;
  detail: string;
  stack: string[];
};

/**
 * Ordered by what the first one has to carry: `Work` features `projects[0]`
 * and sets the register beneath it. The phone-call negotiator leads because
 * it is the hardest claim on the page — a live spoken turn inside 800 ms over
 * telephony — and it is the only one with a budget the site can show running.
 */
export const projects: Project[] = [
  {
    slug: "voice-negotiator",
    title: "Real-time phone-call negotiator",
    summary:
      "A voice agent that holds a live phone negotiation and writes the outcome back to the CRM.",
    detail:
      "Speech recognition, LLM reasoning and speech synthesis run as separate services against a single latency budget, sustaining 650–800 ms end to end over telephony.",
    stack: ["Twilio", "STT / TTS", "LLM reasoning", "CRM"],
  },
  {
    slug: "rag-sales-assistant",
    title: "Enterprise RAG sales assistant",
    summary:
      "Retrieval over large client document sets, built to cut the time a sales team spends looking things up.",
    detail:
      "Production retrieval architecture combining LangChain, Meta-LLaMA 3, FAISS and custom embeddings across large-scale enterprise documents.",
    stack: ["LangChain", "LLaMA 3", "FAISS", "Embeddings"],
  },
  {
    slug: "medicalgpt",
    title: "MedicalGPT",
    summary:
      "A clinical assistant taken all the way from raw medical text to a deployed model.",
    detail:
      "LLaMA-based assistant built through continued pretraining on unstructured clinical text and instruction fine-tuning, with preprocessing, evaluation and deployment owned end to end.",
    stack: ["LLaMA", "Continued pretraining", "SFT", "Evaluation"],
  },
  {
    slug: "virtual-trial-room",
    title: "Virtual trial room",
    summary:
      "A diffusion-based virtual try-on, delivered as a working MVP across model, backend and platform.",
    detail:
      "Stable Diffusion try-on pipeline with custom preprocessing, led across model development, backend engineering and platform integration.",
    stack: ["Stable Diffusion", "Computer vision", "Platform"],
  },
];

export type Role = {
  title: string;
  org: string;
  /** The org name without its legal suffix, for tight spaces. */
  orgShort?: string;
  start: string;
  end: string;
  current?: boolean;
  /** The scope of the seat, in one line — team size and remit, nothing softer. */
  scope: string;
  points: string[];
};

export const roles: Role[] = [
  {
    title: "Lead AI",
    org: "HB Software Solutions India Pvt. Ltd.",
    orgShort: "HB Software Solutions",
    start: "Aug 2025",
    end: "Present",
    current: true,
    scope: "18 engineers · GenAI architecture and delivery",
    points: [
      "Own GenAI architecture and delivery end to end for enterprise conversational and agentic products.",
      "Lead an 18-member AI engineering team.",
      "Designed the multimodal voice architecture that sustains 650–800 ms response latency in production.",
      "Defined the microservice reference architecture and MLOps pipelines now used as the standard for training, deployment and monitoring — cutting redundant compute spend and engineering overhead.",
      "Built the LLM evaluation and benchmarking framework covering accuracy, interpretability and regression tracking across production models.",
      "Mentor engineers on GenAI architecture and prompt engineering, and run internal workshops on responsible AI adoption.",
    ],
  },
  {
    title: "Head of AI",
    org: "Basal Analytics Pvt. Ltd.",
    start: "Jun 2022",
    end: "Jul 2025",
    scope: "First AI hire · team grown 6 → 10",
    points: [
      "Built the AI function, architecture and product practice from zero as the first AI hire.",
      "Grew the team from 6 to 10 engineers and introduced documentation and review standards still in use.",
      "Secured ≈ USD 50K in cloud grants (AWS ≈ $20K, Azure ≈ $25K, Google ≈ $5K) and ₹3 Cr in incubation funding by writing and presenting the company's AI strategy — so the AI work never drew on core engineering budget.",
      "Architected training and evaluation infrastructure that shortened experiment-to-decision cycles.",
      "Helped grow customer acquisition by 30% through AI-enabled analytics offerings.",
      "Delivered client proofs-of-concept end to end, converting several into paid engagements.",
    ],
  },
  {
    title: "Deep Learning Engineer",
    org: "MC&ME Techserve Pvt. Ltd.",
    start: "Oct 2021",
    end: "May 2022",
    scope: "Computer vision for geospatial defence",
    points: [
      "Built computer-vision systems for geospatial defence applications.",
      "Improved image-recognition accuracy by 25% by optimising network architectures for defence imagery.",
      "Reduced object-detection false positives by 30%, and built terrain-analysis segmentation tooling that contributed to 20% faster mission response.",
      "Integrated ML models with GIS data pipelines for high-stakes operational environments.",
    ],
  },
];

export type Pillar = {
  /** Keys the authored icon in Sections.tsx. */
  icon: "team" | "architecture" | "strategy" | "mentorship";
  title: string;
  detail: string;
  /** The one measurable fact under the claim. Résumé-sourced, like everything else. */
  proof: string;
};

/**
 * The leadership half of the record. Everything here is already stated in the
 * roles below — this section exists because a hiring manager reading for a
 * lead should not have to reconstruct it from bullet points.
 */
export const leadership: Pillar[] = [
  {
    icon: "team",
    title: "Building and leading AI teams",
    detail:
      "I lead an 18-engineer AI organisation at HB Software Solutions. Before that I was the first AI hire at Basal Analytics and grew that team from 6 to 10, hiring for it and setting how it worked.",
    proof: "18 engineers led · team grown 6 → 10",
  },
  {
    icon: "architecture",
    title: "Owning the architecture",
    detail:
      "I define the reference architecture rather than review it. The microservice pattern and MLOps pipelines I set for training, deployment and monitoring are now the organisation's standard, cutting redundant compute spend and engineering overhead.",
    proof: "Org-wide reference architecture and MLOps standard",
  },
  {
    icon: "strategy",
    title: "Strategy that funds itself",
    detail:
      "At Basal Analytics I wrote and presented the AI strategy that secured ₹3 Cr in incubation funding and roughly USD 50K in cloud grants — so the AI function never drew on core engineering budget — and helped grow customer acquisition 30% through AI-enabled analytics offerings.",
    proof: "₹3 Cr incubation · ≈ USD 50K cloud grants · +30% acquisition",
  },
  {
    icon: "mentorship",
    title: "Raising the engineering bar",
    detail:
      "I mentor engineers on GenAI architecture and prompt engineering, run internal workshops on responsible AI adoption, and introduced the documentation and review standards still in use at a previous employer.",
    proof: "Mentorship, responsible-AI workshops, review standards",
  },
];

export type Expertise = { title: string; detail: string; tags: string[] };

/**
 * The technical half. Six areas I can be interviewed on to depth, each with
 * the production evidence behind it rather than a claim of familiarity.
 */
export const expertise: Expertise[] = [
  {
    title: "Retrieval architecture",
    detail:
      "RAG over large enterprise document sets: chunking and embedding strategy, vector index design, retrieval evaluation, and the failure modes that only appear at corpus scale.",
    tags: ["LangChain", "FAISS", "Embeddings", "Hybrid retrieval"],
  },
  {
    title: "Real-time multimodal voice",
    detail:
      "Speech recognition, LLM reasoning and synthesis as separate services against a single latency budget, sustaining 650–800 ms end to end over live telephony.",
    tags: ["STT / TTS", "Streaming", "Twilio", "Latency budgets"],
  },
  {
    title: "Model adaptation",
    detail:
      "Taking open-weight models to a domain: continued pretraining on unstructured clinical text, instruction fine-tuning, and the preprocessing and deployment work either side of it.",
    tags: ["LLaMA", "Continued pretraining", "SFT", "Hugging Face"],
  },
  {
    title: "Evaluation and benchmarking",
    detail:
      "The LLM evaluation framework I built covers accuracy, interpretability and regression tracking across production models — because a model is easy to demo and hard to keep working.",
    tags: ["Regression tracking", "Interpretability", "Benchmarks"],
  },
  {
    title: "Agentic systems",
    detail:
      "Agent architecture for enterprise work: task orchestration, multi-step planning, and tool and data access over MCP, with the state handling, guardrails and system-of-record integration that make an agent safe to put in front of a customer.",
    tags: ["Agent architecture", "MCP", "Tool use", "Guardrails", "CRM integration"],
  },
  {
    title: "Platform and MLOps",
    detail:
      "Training, deployment and monitoring pipelines across AWS, Azure and Google Cloud, containerised and delivered through CI/CD as a standard other teams can build on.",
    tags: ["Bedrock", "SageMaker", "Vertex AI", "Docker", "CI/CD"],
  },
];

export type SkillGroup = { title: string; items: string[] };

export const skills: SkillGroup[] = [
  {
    title: "Open-weight models",
    items: [
      "Llama 3",
      "Mistral",
      "Mixtral",
      "Qwen",
      "Gemma",
      "Phi",
      "DeepSeek",
      "Mamba",
      "BERT",
    ],
  },
  {
    title: "Model adaptation",
    items: [
      "Continued pretraining",
      "Instruction fine-tuning",
      "LoRA / QLoRA",
      "Quantisation",
      "Evaluation & benchmarking",
    ],
  },
  {
    title: "Retrieval",
    items: [
      "RAG architecture",
      "LangChain",
      "FAISS",
      "Embeddings",
      "Vector search",
      "Hybrid retrieval",
      "Re-ranking",
    ],
  },
  {
    title: "Agentic AI",
    items: [
      "Agent architecture",
      "MCP (Model Context Protocol)",
      "Tool use & function calling",
      "Task orchestration",
      "Multi-step planning",
      "Guardrails",
      "Enterprise agents",
    ],
  },
  {
    title: "Real-time voice",
    items: ["Streaming STT / TTS", "Twilio", "Latency budgets", "Barge-in handling"],
  },
  {
    title: "Vision & generation",
    items: ["Stable Diffusion", "Object detection", "Segmentation", "OCR / ICR"],
  },
  {
    title: "Platform & MLOps",
    items: ["AWS Bedrock", "SageMaker", "Azure AI Studio", "Vertex AI", "Docker", "CI/CD"],
  },
  {
    title: "Engineering",
    items: ["Python", "PyTorch", "FastAPI", "Hugging Face", "Microservices"],
  },
];

/**
 * The sheets of the document, in order. Drives the running head's section
 * name and page counter — the counter is the page's wayfinding, which is why
 * it covers every sheet rather than only the five that get nav links.
 */
export const sheets = [
  { id: "top", label: "Front page" },
  { id: "characteristics", label: "Characteristics" },
  { id: "diagram", label: "Block diagram" },
  { id: "work", label: "Selected work" },
  { id: "leadership", label: "Leadership" },
  { id: "expertise", label: "Technical depth" },
  { id: "experience", label: "Experience" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
] as const;

export const nav = [
  { href: "#work", label: "Work" },
  { href: "#leadership", label: "Leadership" },
  { href: "#expertise", label: "Expertise" },
  { href: "#experience", label: "Experience" },
  { href: "#about", label: "About" },
] as const;

/* ── Ask me ───────────────────────────────────────────────────────────────────
   The scripted Q&A behind the "Ask me" panel. It is a chooser, not a model:
   every answer below is written once, by hand, and returned verbatim. Nothing
   is generated at runtime, so there is no API key, no request and no chance of
   the site saying something that is not on the résumé.

   Every fact here already appears in `roles`, `projects`, `leadership` or
   `expertise` above. If one of those changes, change the matching answer too.
   ─────────────────────────────────────────────────────────────────────────── */

export type ChatTopic = {
  id: string;
  /** The chip a visitor clicks, phrased the way they would actually ask it. */
  question: string;
  /** The fixed reply, one paragraph per entry. Short — this is a chat. */
  answer: string[];
  /** At most one action offered under the answer. */
  action?: { label: string; href: string; kind: "download" | "external" | "jump" };
  /** Suggested follow-ups, by id, offered first in the chip row. */
  next?: string[];
};

export const chatIntro =
  "Hello — this is a scripted answer panel, not a chatbot. Pick a question and you get my own words back, verbatim.";

export const chatTopics: ChatTopic[] = [
  {
    id: "now",
    question: "What are you working on now?",
    answer: [
      "I am Lead AI at HB Software Solutions in Gurugram, since August 2025. I own GenAI architecture and delivery end to end for enterprise conversational and agentic products, and I lead an 18-engineer AI team.",
      "The two pieces I would point at: the multimodal voice architecture that holds 650–800 ms response latency in production, and the microservice and MLOps reference architecture that is now the organisation's standard for training, deployment and monitoring.",
    ],
    next: ["voice", "team"],
  },
  {
    id: "team",
    question: "How large a team have you led?",
    answer: [
      "Eighteen engineers today. Before that I was the first AI hire at Basal Analytics and built the AI function from zero — I grew that team from 6 to 10, hired for it, and introduced the documentation and review standards still in use there.",
      "I also mentor engineers on GenAI architecture and prompt engineering, and run internal workshops on responsible AI adoption.",
    ],
    next: ["strategy", "experience"],
  },
  {
    id: "rag",
    question: "What have you built with RAG?",
    answer: [
      "An enterprise sales assistant doing retrieval over large client document sets — LangChain, Meta-LLaMA 3, FAISS and custom embeddings — built to cut the time a sales team spends looking things up.",
      "The stack is the easy part. The work is chunking and embedding strategy, vector index design, retrieval evaluation, and the failure modes that only appear at corpus scale.",
    ],
    next: ["voice", "models"],
  },
  {
    id: "voice",
    question: "Tell me about the real-time voice work.",
    answer: [
      "A phone-call negotiator: it holds a live negotiation over telephony and writes the outcome back to the CRM.",
      "Speech recognition, LLM reasoning and speech synthesis run as separate services against a single shared latency budget, sustaining 650–800 ms end to end over Twilio. Splitting the budget across services rather than tuning one model is what makes that number hold.",
    ],
    next: ["agents", "rag"],
  },
  {
    id: "models",
    question: "Have you trained or fine-tuned models yourself?",
    answer: [
      "Yes. MedicalGPT is the clearest example — a LLaMA-based clinical assistant taken from raw unstructured clinical text through continued pretraining and instruction fine-tuning to a deployed model, with the preprocessing, evaluation and deployment owned end to end.",
      "There is also a Stable Diffusion virtual try-on I led across model, backend and platform to a working MVP, and earlier computer-vision work for geospatial defence: 25% better image-recognition accuracy and 30% fewer object-detection false positives.",
    ],
    next: ["evaluation", "platform"],
  },
  {
    id: "evaluation",
    question: "How do you know what you ship still works?",
    answer: [
      "I built the LLM evaluation and benchmarking framework used across production models at HB, covering accuracy, interpretability and regression tracking.",
      "A model is easy to demo and hard to keep working. The framework exists so a regression is caught by a pipeline rather than by a customer.",
    ],
    next: ["platform", "agents"],
  },
  {
    id: "agents",
    question: "Do you build agentic systems?",
    answer: [
      "That is the current remit — enterprise conversational and agentic products. Task orchestration and tool use, with the state handling, guardrails and CRM and system-of-record integration that make an agent safe to put in front of a customer.",
    ],
    next: ["voice", "evaluation"],
  },
  {
    id: "platform",
    question: "What is your cloud and MLOps stack?",
    answer: [
      "AWS Bedrock and SageMaker, Azure AI Studio and Vertex AI; Docker and CI/CD; Python, PyTorch, FastAPI and Hugging Face underneath.",
      "At HB I defined the microservice reference architecture and the MLOps pipelines for training, deployment and monitoring that other teams now build on — which is where the reduction in redundant compute spend and engineering overhead came from.",
    ],
    next: ["evaluation", "team"],
  },
  {
    id: "strategy",
    question: "Have you done AI strategy, or raised funding for it?",
    answer: [
      "At Basal Analytics I wrote and presented the AI strategy that secured ₹3 Cr in incubation funding — roughly USD 360K — plus about USD 50K in cloud grants across AWS, Azure and Google.",
      "The point of that was independence: the AI function never drew on core engineering budget. The analytics offerings it paid for helped grow customer acquisition by 30%.",
    ],
    next: ["team", "experience"],
  },
  {
    id: "experience",
    question: "Walk me through your background.",
    answer: [
      "Five years, three seats. Deep Learning Engineer at MC&ME Techserve (Oct 2021 – May 2022), computer vision for geospatial defence. Head of AI at Basal Analytics (Jun 2022 – Jul 2025), first AI hire, built the function. Lead AI at HB Software Solutions since Aug 2025, leading 18 engineers.",
    ],
    action: { label: "See the full record", href: "#experience", kind: "jump" },
    next: ["now", "hire"],
  },
  {
    id: "hire",
    question: "Are you open to new roles?",
    answer: [
      `Yes — I am open to conversations, and I am based in ${site.location}.`,
      `The quickest route is email: ${site.email}. LinkedIn works too, and the résumé has the full record.`,
    ],
    action: { label: `Email ${site.email}`, href: `mailto:${site.email}`, kind: "external" },
    next: ["resume", "experience"],
  },
  {
    id: "resume",
    question: "Can I get your résumé?",
    answer: ["Of course — one page, and every number on this site comes off it."],
    action: { label: "Download résumé", href: site.resume, kind: "download" },
    next: ["hire", "experience"],
  },
];
