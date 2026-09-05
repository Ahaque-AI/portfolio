# Documentation and Git rules

- Keep AGENTS.md a router under 100 lines. Do not create INSTRUCTIONS.md.
- Link new domain documents from their index. Keep rules in invariants and
  decisions in the relevant domain rather than duplicating detailed rules.
- Label framework and design proposals as proposed until the owner accepts them.
- Create detailed plans in the next requested phase. Record accepted architecture
  decisions with rationale and alternatives then; do not fabricate acceptance now.
- Log non-trivial fixes in `../known-issues/fix-log-YYYY-MM-DD.md` with symptom,
  cause, resolution, verification, and a link from that directory's index.
- Stage only task changes, inspect the staged diff, and propose a commit subject
  under 72 characters. Let the user commit; never add agent co-authorship.
- Confirm before pushing, deleting, or rebuilding containers as required by AGENTS.md.
