---
title: 'IntentLens: Multi-Agent Feedback Analysis'
summary: 'Four-agent system (scraper, intent analyser, search agent, supervisor) that analyses 5,000+ customer reviews. Used LLM-as-judge evaluation to score agent outputs against ground-truth intent labels.'
period: 'Aug 2024 – Jan 2025'
stack:
  - 'CrewAI'
  - 'Groq API'
  - 'Streamlit'
links:
  - label: 'Demo'
    href: 'https://streamlit.io/'
    type: 'demo'
featured: true
caseStudy: false
order: 2
---

## What it is

A multi-agent pipeline for large-scale customer-feedback analysis. A scraper
agent ingests reviews, an intent-analyser agent labels them, a search agent
enriches each review with public context, and a supervisor agent reconciles
conflicts. LLM-as-judge scoring drives offline evaluation against labelled
intent buckets.
