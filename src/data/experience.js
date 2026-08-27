/**
 * Work experience entries — strictly from Resume/Abdul_Haque_AI_Engineer_v1.pdf.
 *
 * Each entry mirrors the markdown frontmatter shape from the previous
 * Astro content collection, but as typed data so it ships with the
 * JS bundle and needs no runtime markdown parsing.
 */
export const EXPERIENCE = [
    {
        slug: 'deltashoppe',
        company: 'DeltaShoppe (Pvt.) Ltd',
        role: 'Associate Software Engineer – AI',
        startDate: '2025-12',
        location: 'Islamabad, Pakistan',
        summary: 'Sole backend engineer rotating across three concurrent client engagements within a small AI engineering pod. Partner: Kermit Tech (Norway).',
        highlights: [
            'Designed an AI therapy microservice for an Australian government healthcare client — 300+ daily sessions, with an event-driven audio pipeline on Azure Service Bus that decouples transcription and summarisation into background jobs.',
            'Deployed Faster-Whisper + Phi-3.5-Mini (INT8) CPU-only on 15 GB AKS pods; a multi-processing worker pool resolved lock contention and ONNX OOM failures.',
            'Built a multi-tenant RAG system with pgvector, per-client isolation, and propositional chunking (~10:1 compression, 90% token reduction). Sliding-window memory with importance scoring cut tokens from 100K to 10K per session.',
            'Implemented tool-injector pattern for per-user permission scoping across LLM tools, plus PII redaction middleware and audit logging. Azure DevOps CI/CD; retry/fallback across Groq/Mistral; load-tested at 5–10 concurrent sessions.',
            'Built real-time fraud detection for regulated retail banking: event-driven pipeline on Kafka with PII masking (6 fields) and automated Suspicious Transaction Report filing to regulator every 5 minutes. Prometheus + Grafana alerting (3 dashboards) with CRITICAL alerts on verification failures.',
        ],
        stack: [
            'Azure AKS',
            'FastAPI',
            'Faster-Whisper',
            'Phi-3.5-Mini',
            'Azure Service Bus',
            'LangGraph',
            'PostgreSQL (pgvector)',
            'Kafka',
            'Docker',
            'Prometheus',
            'Grafana',
        ],
        order: 1,
    },
    {
        slug: 'securely-innovations',
        company: 'Securely Innovations (Pvt.) Ltd',
        role: 'Data Science Intern',
        startDate: '2024-04',
        endDate: '2024-11',
        location: 'Islamabad, Pakistan',
        summary: 'Multi-threaded data-collection work for an automotive-parts dataset.',
        highlights: [
            'Built a multi-threaded data collection pipeline scraping ~3M automotive parts records via network-level API replication, outperforming Selenium-based scrapers by 3×.',
        ],
        stack: ['Python', 'multi-threading', 'network-level API replication'],
        order: 2,
    },
    {
        slug: 'datainsight-lab',
        company: 'DataInsight Lab — FAST-NUCES',
        role: 'Computer Vision & Generative AI Intern',
        startDate: '2024-06',
        endDate: '2024-08',
        location: 'Islamabad, Pakistan',
        summary: 'Generative-AI fine-tuning work on Stable Diffusion for furniture/interior design generation.',
        highlights: [
            'Fine-tuned Stable Diffusion (DreamBooth + LoRA, QLoRA) for furniture/interior design generation on 2× T4 GPUs with model parallelism.',
        ],
        stack: ['PyTorch', 'Stable Diffusion', 'DreamBooth', 'LoRA', 'QLoRA'],
        order: 3,
    },
];
export const EDUCATION = {
    degree: 'B.Sc. Data Science',
    institution: 'FAST-NUCES, Islamabad',
    period: 'Aug 2021 – Jun 2025',
    cgpa: '3.24/4.0',
    finalYearGpa: '3.75/4.0',
    deansList: ['Fall 2024', 'Spring 2025'],
    fyp: 'GraphRAG-Causal',
};
export const CERTIFICATIONS = [
    {
        name: 'Generative AI with LLMs',
        issuer: 'DeepLearning.AI & AWS',
    },
    {
        name: 'Section Leader, Code in Place',
        issuer: 'Stanford University, 2025',
        note: '95% student retention across a global cohort',
    },
];
