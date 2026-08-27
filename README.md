# portfolio

Personal portfolio for **Abdul Haque** — AI Software Engineer (backend systems,
LLMs, agentic AI). Static-first Astro site.

> **Phase 1 — project foundation only.** No visual design has been committed
> yet. The architecture is in place; the visual direction will land in a
> later phase.

## Quick start

```bash
pnpm install
pnpm dev          # local dev at http://localhost:4321
pnpm build        # static build → ./dist
pnpm preview      # serve the production build locally
pnpm check        # type-check + Astro diagnostics
```

Requires **Node.js 20+** and **pnpm 11+**.

## Source of truth

- Personal background, projects, and skills live in [`Resume/`](./Resume/).
- Site metadata (name, contact, nav, skills list) lives in
  [`src/lib/site.ts`](./src/lib/site.ts).
- Roles and project entries live in
  [`src/content/`](./src/content) (Astro content collections).
- Visual direction: **not committed yet.** Theme tokens in
  [`src/styles/global.css`](./src/styles/global.css) are neutral on purpose.

## Deploy

The `pnpm build` output in `./dist` is fully static. Any static host works
(Surge, Netlify, Cloudflare Pages, GitHub Pages, etc.). See `astro.config.mjs`
for the canonical site URL.

## Conventions for agents

See [`AGENTS.md`](./AGENTS.md) for repository structure, content-editing
workflow, and the rules of engagement for future agents.
