/**
 * Project / research entries — strictly from the résumé.
 *
 * Bodies are stored as markdown strings and rendered with `marked`
 * at runtime. Markdown preserves the option to add headings, lists,
 * or pull quotes later without touching the type signature.
 */
export const PROJECTS = [
    {
        slug: 'graphrag-causal',
        title: 'GraphRAG-Causal: Graph-Augmented Framework for Causal Reasoning in News',
        summary: 'A research-grade GraphRAG framework that combines XML cause-effect annotation with multi-hop graph traversal. Achieved 82.88% F1 / 80% accuracy on CausalNewsCorpus, on par with fine-tuned BERT-Large.',
        period: 'Aug 2024 – Apr 2025',
        stack: ['CrewAI Flows', 'FastAPI', 'Docker', 'Neo4j', 'GraphRAG'],
        links: [
            { label: 'arXiv', href: 'https://arxiv.org/', type: 'paper' },
        ],
        featured: true,
        caseStudy: true,
        order: 1,
        body: `## What it is

A research-grade GraphRAG pipeline for causal reasoning over news corpora.
Instead of relying on a fine-tuned transformer alone, the system encodes
cause–effect relations as XML annotations, lifts them into a knowledge
graph, and traverses that graph at inference time. A CrewAI Flows
agentic layer sits on top for controllable inference: it can decide when
to consult the graph, when to fall back to web search, and when to stop.

## Headline result

- **82.88% F1 / 80% accuracy** on CausalNewsCorpus
- Performance comparable to a fine-tuned BERT-Large baseline, achieved
  without task-specific fine-tuning of the underlying LLM.`,
    },
    {
        slug: 'intentlens',
        title: 'IntentLens: Multi-Agent Feedback Analysis',
        summary: 'A four-agent system (scraper, intent analyser, search agent, supervisor) that analyses 5,000+ customer reviews using LLM-as-judge evaluation.',
        period: 'Aug 2024 – Jan 2025',
        stack: ['CrewAI', 'Groq API', 'Streamlit'],
        links: [
            { label: 'Demo', href: 'https://streamlit.io/', type: 'demo' },
        ],
        featured: true,
        caseStudy: false,
        order: 2,
        body: `## What it is

A multi-agent pipeline for large-scale customer-feedback analysis. A
scraper agent ingests reviews, an intent-analyser agent labels them, a
search agent enriches each review with public context, and a supervisor
agent reconciles conflicts. LLM-as-judge scoring drives offline
evaluation against labelled intent buckets.`,
    },
];
export function findProject(slug) {
    return PROJECTS.find((p) => p.slug === slug);
}
