# Abdul Haque portfolio

Three-page Astro design preview: introduction (`/`), terms (`/terms/`), and
privacy (`/privacy/`). No backend, tracking, data collection, or deployment.

Start with [AGENTS.md](AGENTS.md), then the
[knowledge map](zensical%20docs/docs/index.md).

Astro + TypeScript, static output for Surge, native CSS and small scripts.
Use pnpm only. Node 22.12+ (tested on Node 24), pnpm 11.19, and optional
[Task v3](https://taskfile.dev/docs/installation) are prerequisites.

| Task command | pnpm equivalent | Purpose |
| --- | --- | --- |
| `task install` | `pnpm install --frozen-lockfile` | Reproduce dependencies |
| `task run-dev` | `pnpm dev` | Local development on port 4321 |
| `task build` | `pnpm build` | Generate `dist/` |
| `task run-prod` | `pnpm build` then `pnpm preview` | Local production preview |
| `task check` | `pnpm check` then `pnpm test` | Types and validation tests |

Task is not installed in the current environment; direct pnpm commands work.
The taskfile is provided for environments with Task installed.

Both continuation paths require a full name. Full introduction also requires
email and agreement; the name-only path needs neither. Both stay in the preview
and show a next-phase message. Nothing is sent or saved. Policy copy describes
this preview and must be reviewed before enabling a real submission service.

The shared identity and component ownership live in [DESIGN.md](DESIGN.md).
The owner handles manual browser tests; agents must not use browser controls.

Read the [framework recommendation](zensical%20docs/docs/architecture/framework.md)
and [portfolio brief](zensical%20docs/docs/product/brief.md).
Portfolio content, the guided tour, services, and CI/CD remain outside this phase.
