/**
 * Single source of truth for site-level metadata.
 *
 * Update this file (not the layout/components) when changing
 * the site name, URL, author identity, navigation structure,
 * or social profiles.
 *
 * Content for experiences, projects, and skills lives in
 * `src/content/` so it can evolve independently of the app shell.
 */

export interface SocialLink {
  readonly label: string;
  readonly href: string;
  readonly handle?: string;
}

export interface NavItem {
  readonly label: string;
  readonly href: string;
}

export interface SkillCategory {
  readonly category: string;
  readonly items: readonly string[];
}

export const SITE = {
  name: 'Abdul Haque',
  /** Short professional title shown in nav metadata and headers. */
  title: 'AI Software Engineer',
  description:
    'Backend AI engineer working on production LLM microservices, multi-agent RAG systems, and graph-based ML on Azure.',
  /** Canonical production URL. Update before first deploy. */
  url: 'https://abdulhaque.dev',
  /** Locale used for <html lang> and OG metadata. */
  locale: 'en',
  /** Where the canonical CV lives (relative to site root). */
  cvPath: '/Abdul_Haque_AI_Engineer.pdf',
} as const;

export const PROFILE = {
  name: 'Abdul Haque',
  location: 'Islamabad, Pakistan',
  email: 'abdulhaque.dev@gmail.com',
  phone: '+92-337-9211323',
  tagline: 'AI Software Engineer | Backend Systems, LLMs & Agentic AI',
  summary:
    'Backend AI engineer specialising in production LLM microservices (FastAPI) and multi-agent RAG systems (LangGraph, LangChain, CrewAI) on Azure, with hands-on experience deploying a CPU-only quantised inference pipeline serving 300+ daily sessions for an Australian government healthcare client.',
} as const;

export const SOCIAL: readonly SocialLink[] = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/abdul-haque-dev/', handle: 'abdul-haque-dev' },
  { label: 'GitHub', href: 'https://github.com/Ahaque-AI', handle: 'Ahaque-AI' },
  { label: 'Email', href: 'mailto:abdulhaque.dev@gmail.com', handle: 'abdulhaque.dev@gmail.com' },
];

export const NAV: readonly NavItem[] = [
  { label: 'About', href: '/#about' },
  { label: 'Experience', href: '/#experience' },
  { label: 'Projects', href: '/#projects' },
  { label: 'Skills', href: '/#skills' },
  { label: 'Contact', href: '/#contact' },
];

export const SKILLS: readonly SkillCategory[] = [
  {
    category: 'Programming',
    items: ['Python', 'SQL', 'Bash', 'C++'],
  },
  {
    category: 'Backend',
    items: ['FastAPI', 'REST APIs', 'microservices', 'AsyncIO', 'Pydantic', 'OAuth / JWT', 'Middleware'],
  },
  {
    category: 'Cloud & Infrastructure',
    items: ['Azure (AKS, DevOps, Blob Storage)', 'AWS (boto3)', 'GCP', 'Docker'],
  },
  {
    category: 'AI / LLM',
    items: [
      'LangGraph',
      'LangChain',
      'CrewAI',
      'multi-agent systems',
      'OpenAI / Anthropic APIs',
      'Azure OpenAI',
      'vLLM',
      'Ollama',
    ],
  },
  {
    category: 'ML, NLP & Speech',
    items: ['PyTorch', 'HuggingFace Transformers', 'Scikit-learn', 'Faster-Whisper'],
  },
  {
    category: 'Databases & Retrieval',
    items: ['PostgreSQL (pgvector)', 'Neo4j (Cypher)', 'GraphRAG'],
  },
  {
    category: 'Messaging & Observability',
    items: ['Azure Service Bus', 'Kafka', 'MLflow', 'Prometheus', 'Grafana'],
  },
];

/** True while the visual identity has not been chosen. Pages can use this to opt out of opinionated styling. */
export const VISUAL_DIRECTION_LOCKED = false;
