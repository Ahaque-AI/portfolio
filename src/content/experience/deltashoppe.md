---
company: 'DeltaShoppe (Pvt.) Ltd'
role: 'Associate Software Engineer – AI'
startDate: '2025-12'
location: 'Islamabad, Pakistan'
summary: 'Sole backend engineer rotating across three concurrent client engagements within a small AI engineering pod. Partner: Kermit Tech (Norway).'
highlights:
  - 'Designed an AI therapy microservice for an Australian government healthcare client — 300+ daily sessions, with an event-driven audio pipeline on Azure Service Bus that decouples transcription and summarisation into background jobs.'
  - 'Deployed Faster-Whisper + Phi-3.5-Mini (INT8) CPU-only on 15 GB AKS pods; a multi-processing worker pool resolved lock contention and ONNX OOM failures.'
  - 'Built a multi-tenant RAG system with pgvector, per-client isolation, and propositional chunking (~10:1 compression, 90% token reduction). Sliding-window memory with importance scoring cut tokens from 100K to 10K per session.'
  - 'Implemented tool-injector pattern for per-user permission scoping across LLM tools, plus PII redaction middleware and audit logging. Azure DevOps CI/CD; retry/fallback across Groq/Mistral; load-tested at 5–10 concurrent sessions.'
  - 'Built real-time fraud detection for regulated retail banking: event-driven pipeline on Kafka with PII masking (6 fields) and automated Suspicious Transaction Report filing to regulator every 5 minutes. Prometheus + Grafana alerting (3 dashboards) with CRITICAL alerts on verification failures.'
stack:
  - 'Azure AKS'
  - 'FastAPI'
  - 'Faster-Whisper'
  - 'Phi-3.5-Mini'
  - 'Azure Service Bus'
  - 'LangGraph'
  - 'PostgreSQL (pgvector)'
  - 'Kafka'
  - 'Docker'
  - 'Prometheus'
  - 'Grafana'
order: 1
---

## Context

Three concurrent client engagements, all backend, all in production. The work spans therapy-session audio understanding, an LLM-powered student companion, and regulated banking fraud detection.
