# Portfolio brief

## Status and scope

Requested: a distinctive static portfolio for Abdul Haque, hosted on Surge,
with optional name/email introduction, privacy and terms pages, visitor
notifications, and an optional guided introduction. This phase creates docs
and recommends a framework. That initial phase is complete. The owner has now
authorized the four-page design preview and pnpm/Task tooling. The full
portfolio, services, and deployment remain deferred. The onboarding route map
and optional three-step tour are part of the preview.

Working audience assumption: recruiters, engineering leads, and prospective
clients evaluating production AI and backend engineering experience.

## Content evidence

Source: user-supplied `Abdul_Haque_AI_Engineer_v1.pdf`, text reviewed 2026-09-05.
Resume claims are supplied by the owner, not independently verified.

| Candidate story | Resume evidence | Portfolio opportunity |
| --- | --- | --- |
| AI therapy microservice | CPU-only inference, 15 GB AKS pods, 300+ daily sessions | Explain resource constraints, asynchronous audio processing, reliability decisions |
| AI student companion | Tenant-scoped RAG, pgvector, reported 100K to 10K tokens/session | Show retrieval, memory tradeoffs, and permission boundaries |
| Fraud detection | Kafka pipeline, PII masking, reporting every five minutes | Explain event flow and operational safeguards |
| GraphRAG-Causal | Neo4j, CrewAI, reported 82.88% F1 and 80% accuracy | Explain causal retrieval, evaluation conditions, and limitations |
| IntentLens | Four-agent feedback analysis, 5,000+ reviews | Show the agent workflow and how output was evaluated |

Proposed identity: an AI software engineer who makes systems work under real
constraints. Prefer a small number of substantial case studies over a wall
of skill badges. Each can show problem, constraints, personal contribution,
architecture, evidence, and lessons. Choose the lead stories during planning.
Confirm what client material can be published and verify metrics and links
before turning resume statements into public case studies. Do not automatically
publish the resume's phone number or copy the PDF into public assets.

## Visitor journey requirements

1. The entry screen briefly explains whose portfolio this is and why details
   are requested. Full name is now required on both paths (owner correction).
   Full preview also requires email/agreement; name-only continuation does not.
   Both stay in this preview and show a next-phase message. Privacy and terms
   are accessible without completing the form.
2. Visitors who submit get an explicit, unselected acknowledgement appropriate
   to the eventual notice and terms. Marketing permission, if ever wanted,
   is a separate decision. See the privacy domain for unresolved details.
3. Offer a short guided introduction explaining the available route and future
   navigation. The preview uses three steps and keeps the tour optional.
4. For the future tour, keep skip/exit and back available. Direct project links must work without
   replaying onboarding. A visitor can browse freely or follow the suggested order.
5. Present a clear next action within each section and a final contact route.

Reducing decision overload means emphasizing the next useful action; it does
not require removing navigation or forcing every visitor through every section.
The future tour is optional. The current introduction requires a full name.
The owner handles browser testing; agents do not use browser controls.

## Existing references

- [Original portfolio](https://abdul-haque-dev.surge.sh/).
- [Polished portfolio](https://abdulhaque-ai.surge.sh/).

Both were supplied by the owner. The web tool could not open them in this
session; no visual or source audit was completed. Revisit during design planning.
