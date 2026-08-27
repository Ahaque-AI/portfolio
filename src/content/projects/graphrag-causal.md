---
title: 'GraphRAG-Causal: Graph-Augmented Framework for Causal Reasoning in News'
summary: 'Causal GraphRAG framework that combines XML cause-effect annotation with multi-hop graph traversal. Achieved 82.88% F1 / 80% accuracy on CausalNewsCorpus, on par with fine-tuned BERT-Large. Extended with a CrewAI Flows agentic layer for controllable causal inference over a graph DB plus web search.'
period: 'Aug 2024 – Apr 2025'
stack:
  - 'CrewAI Flows'
  - 'FastAPI'
  - 'Docker'
  - 'Neo4j'
  - 'GraphRAG'
links:
  - label: 'arXiv'
    href: 'https://arxiv.org/'
    type: 'paper'
featured: true
caseStudy: true
order: 1
---

## What it is

A research-grade GraphRAG pipeline for causal reasoning over news corpora.
Instead of relying on a fine-tuned transformer alone, the system encodes
cause–effect relations as XML annotations, lifts them into a knowledge graph,
and traverses that graph at inference time. A CrewAI Flows agentic layer
sits on top for controllable inference: it can decide when to consult the
graph, when to fall back to web search, and when to stop.

## Headline result

- **82.88% F1 / 80% accuracy** on CausalNewsCorpus
- Performance comparable to a fine-tuned BERT-Large baseline, achieved
  without task-specific fine-tuning of the underlying LLM.
