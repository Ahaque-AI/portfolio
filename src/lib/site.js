/**
 * Site-wide identity and metadata.
 * Single source of truth for name, location, social, nav, and skills.
 */
export const SITE = {
    name: 'Abdul Haque',
    title: 'AI Software Engineer',
    description: 'Backend AI engineer working on production LLM microservices, multi-agent RAG systems, and graph-based ML on Azure.',
    url: 'https://abdulhaque.dev',
    locale: 'en',
    cvPath: '/Abdul_Haque_AI_Engineer.pdf',
};
export const PROFILE = {
    name: 'Abdul Haque',
    location: 'Islamabad, Pakistan',
    email: 'abdulhaque.dev@gmail.com',
    phone: '+92-337-9211323',
    tagline: 'AI Software Engineer | Backend Systems, LLMs & Agentic AI',
    summary: 'Backend AI engineer specialising in production LLM microservices (FastAPI) and multi-agent RAG systems (LangGraph, LangChain, CrewAI) on Azure, with hands-on experience deploying a CPU-only quantised inference pipeline serving 300+ daily sessions for an Australian government healthcare client.',
};
export const SOCIAL = [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/abdul-haque-dev/', handle: 'abdul-haque-dev' },
    { label: 'GitHub', href: 'https://github.com/Ahaque-AI', handle: 'Ahaque-AI' },
    { label: 'Email', href: 'mailto:abdulhaque.dev@gmail.com', handle: 'abdulhaque.dev@gmail.com' },
];
export const NAV = [
    { label: 'About', href: '/#about' },
    { label: 'Experience', href: '/#experience' },
    { label: 'Projects', href: '/#projects' },
    { label: 'Skills', href: '/#skills' },
    { label: 'Questions', href: '/#questions' },
    { label: 'Contact', href: '/#contact' },
];
export const SKILLS = [
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
