# AGENTS.md

Single source of truth for working-rule routing. No separate `INSTRUCTIONS.md`.

## Routing

```text
AGENTS.md (routing + meta rules)
    -> zensical docs/docs/index.md (knowledge domain map)
    -> relevant domain/index.md
    -> zensical docs/docs/invariants/index.md
    -> core.md + task-specific rule doc
    -> source code (ground truth, when needed)
    -> implementation
```

## Rules

All detailed rules live in `zensical docs/docs/invariants/`.
Load `core.md` and only the rule documents relevant to the task.

| Task | Rule doc (relative to `zensical docs/docs/invariants/`) |
| --- | --- |
| Any task | `core.md` |
| Astro / frontend / interactions | `frontend.md` |
| External forms / notification services / backend | `backend.md` |
| Personal data / credentials / storage | `security.md` |
| Dependencies / paths / Surge / GitHub Actions | `tooling.md` |
| Plans / ADRs / README / docs / Git | `processes.md` |

## Never go exploring

For anything related to this repo, check the docs first. Enter source only
when docs do not answer, the user requests implementation details, or an
implementation task requires verifying the documented behavior in source.
If docs are missing or stale, inspect the smallest relevant source surface
and update the docs. Source describes actual behavior; docs describe intent.

## Session-level rules

- Capture non-trivial fixes in `zensical docs/docs/known-issues/fix-log-YYYY-MM-DD.md`
  and link from `known-issues/index.md`. Keep this router under 100 lines.
- Always confirm before pushing, deleting, or rebuilding containers.
- Never run `git commit` without explicit user confirmation in the current
  session. Stage only this task's changes, propose the message, and let the
  user run the commit by default.
- Never add the AI or agent as co-author.
- Use pnpm only; see `zensical docs/docs/invariants/tooling.md`.
- Portfolio writing rules: no em dashes or generic AI-style copy. See
  `zensical docs/docs/invariants/frontend.md`.
- Minimum effort is a hard UX rule for every page. Keep the primary next action
  in the first viewport, guide the visitor visually, and remove avoidable steps
  before adding more content or controls.
- Do not use browser controls. The owner handles manual browser testing;
  see `zensical docs/docs/invariants/frontend.md` for verification boundaries.

## Git

Propose a compact commit message for every change. One commit per coherent
change; subject under 72 characters and understandable without its body.
The agent proposes the message; the user owns the commit.

## Skills

- Frontend UX review / polish / audit: **impeccable**.
- Visual redesign / overhaul: **ui-ux-pro-max**.
- Backend security implementation: **backend-security-coder**, if available;
  otherwise state its absence and follow the security invariants.
- Simplest working solution: **Ponytail**, active by default for coding.
- Follow applicable skills supplied by the active environment as well.
