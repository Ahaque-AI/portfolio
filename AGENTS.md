# AGENTS.md — Agent guide for this portfolio

> Conventions for any agent (human or AI) working in this repo. Keep this file
> small and durable. Detailed specs live next to the code they describe.

## Stack

- **Framework:** Astro `^7.2.8` (static-first, zero-JS by default)
- **UI islands:** React `^19.2.7` via `@astrojs/react ^6.0.4` — use sparingly,
  only for genuinely interactive components
- **Styling:** Tailwind CSS `^4.3.3` via `@tailwindcss/vite ^4.3.3`
  (CSS-first config in `src/styles/global.css`, no `tailwind.config.*`)
- **TypeScript:** strict mode (`astro/tsconfigs/strict`), `^5.9.3`
- **Content:** Astro Content Collections — `experience` and `projects`
- **Package manager:** pnpm (`packageManager` pinned in `package.json`)
- **Node:** `>=20`

## Scripts

| Command           | Purpose                                    |
| ----------------- | ------------------------------------------ |
| `pnpm dev`        | Local dev server                           |
| `pnpm build`      | Static production build to `./dist`        |
| `pnpm preview`    | Serve the production build locally         |
| `pnpm check`      | TypeScript + Astro diagnostics (`astro check`) |

## Repository map

```
portfolio/
├── astro.config.mjs            # Astro + integrations + Tailwind Vite plugin
├── tsconfig.json               # extends astro/tsconfigs/strict + path aliases
├── src/
│   ├── layouts/
│   │   └── BaseLayout.astro    # document shell, SEO, skip link, nav, footer
│   ├── components/
│   │   ├── layout/             # Nav.astro, Footer.astro
│   │   ├── sections/           # Hero, Experience, Projects, Skills, Contact
│   │   └── ui/                 # Section, Tag, Prose — generic primitives
│   ├── content.config.ts       # Zod schemas for content collections
│   ├── content/
│   │   ├── experience/         # *.md — one per role
│   │   └── projects/           # *.md — one per project/research item
│   ├── lib/site.ts             # SITE, PROFILE, SOCIAL, NAV, SKILLS
│   ├── pages/
│   │   ├── index.astro         # homepage placeholder
│   │   └── 404.astro
│   ├── styles/global.css       # Tailwind v4 import + neutral @theme tokens
│   └── env.d.ts
└── public/                     # favicon, robots, résumé PDF
```

## Conventions

- **Path aliases:** `@/*`, `@components/*`, `@layouts/*`, `@content/*`,
  `@lib/*`, `@styles/*`. Use them in `.astro` / `.ts` files.
- **No `any`.** Use `unknown` + narrowing or define a typed shape.
- **No fabricated content.** Personal info comes from `Resume/` and
  `src/lib/site.ts`; experience/projects from `src/content/`.
- **Visual direction is intentionally not committed yet.** Theme tokens in
  `src/styles/global.css` are neutral. Do not lock in colors, fonts, or
  aesthetic motifs in code without an explicit direction phase.
- **Static-first.** Avoid client-side React unless an interaction truly needs
  it. Prefer CSS, browser APIs, and Astro `<script>` islands.
- **Accessibility.** Semantic HTML, skip link, focus rings, reduced-motion
  guard, mobile-disclosure nav, keyboard-friendly controls. Don't ship a
  component without checking these.
- **Gitignore covers:** `node_modules`, `dist`, `.astro`, `.env*`, `*.bak`,
  editor / OS noise.

## When adding content

- **New role:** add `src/content/experience/<company>.md` matching the schema
  in `src/content.config.ts`. Bump `order` for placement.
- **New project/research item:** add `src/content/projects/<slug>.md`.
  Set `featured: true` for prominent placement. If it deserves a full
  case-study page, set `caseStudy: true` and a future dynamic route can use
  it.
- **New skill / contact channel:** edit `src/lib/site.ts` only — never
  duplicate this data in components.

## When adding interactivity

1. Prefer a CSS-only or browser-API solution first.
2. If React is genuinely required, put it in `src/components/interactive/`
   and use the lightest `client:*` directive that satisfies the UX
   (`client:visible`, `client:idle`, etc.).
3. Keep islands small; isolate them so the rest of the page stays static.
