<p align="center">
  <img src="./public/favicon.svg" alt="Orbital guestbook mark" width="96" height="96" />
</p>

# Abdul Haque, AI Engineer

A static, space-themed portfolio built with the same discipline I bring to production AI systems: docs first, small surfaces, no magic, and an honest read of what is done and what is still ahead.

I love spaceships. The route map is a star chart. The guided tour is a flight through a small solar system. The exploration ship in the overlay is built from about forty-five authored Three.js meshes. The whole project feels like the kind of cockpit I would want to fly, so it became the way I introduce myself.

---

## If you are a hiring manager

If you only have ten minutes, do this:

1. Read this README top to bottom.
2. Skim [DESIGN.md](./DESIGN.md) for the design system and component ownership.
3. Skim [AGENTS.md](./AGENTS.md) for the operating rules and the agent team.
4. Skim [the knowledge map](./zensical%20docs/docs/index.md) to see the docs tree.

That is the whole project on one screen. If you want depth, follow the links.

## What building this portfolio proves I can do

Honest framing first. I am a backend AI engineer. The CV page and the resume are where to read what I actually ship in production: AI microservices on AKS with FastAPI, multi-agent RAG on LangGraph and CrewAI, pgvector and Neo4j retrieval, Kafka pipelines, real-time fraud detection, CPU-only quantised inference. That is the work I am proud of.

This portfolio is not that work. I directed a small agent team (`mavis`, `explore`, `worker`, `verifier`) through docs first, then source. I wrote the rules, the invariants, the plan, the design constraints and the fix log. The agents wrote the bulk of the code. I am the human in the loop, and I sign off on every change.

Three.js, Astro and the CSS: I did not write that. The agents did, under my direction. The resume is the artifact for what I actually own. What I personally own here is the docs architecture, the plan, the design constraints and the fix log.

The honest signal of how I work:

- I write the rules in one place. `AGENTS.md` routes to invariant rule files that are the only source of truth.
- I plan in small steps and accept each one before starting the next. The guided-flight plan in `zensical docs/docs/plans/` is a real example.
- I keep what is done and what is ahead on the same page. See the status section below.
- I work with a small agent team in clear lanes. `mavis` orchestrates, `explore` reads, `worker` builds, `verifier` reviews.
- I keep the test loop green. 22 unit tests run on every change.

## How this project was built: docs first, agents in clear lanes

This is the part I am proudest of.

The rules sit in one place. [AGENTS.md](./AGENTS.md) is the router. It points at the invariant rule files in `zensical docs/docs/invariants/`, which are the only source of truth for what is and is not allowed. The plan lives at [`guided-flight-solar-system.md`](./zensical%20docs/docs/plans/guided-flight-solar-system.md) and is broken into five steps, each accepted before the next starts. Decisions and incidents are recorded in `known-issues/`. The portfolio brief at [`product/brief.md`](./zensical%20docs/docs/product/brief.md) is the source for what to build, with resume evidence attached.

I work with a small agent team:

- `mavis` is the orchestrator and root of context. It owns user intent, scope, integration, and the final answer.
- `explore` is read-only and does evidence-heavy searches across the repo.
- `worker` takes a bounded production task with a clear deliverable and acceptance criteria.
- `verifier` independently reviews a result and reports findings without fixing them.

Every agent has a tight role so a hidden fix cannot hide inside a refactor. The default skills are `impeccable` for frontend polish, `ui-ux-pro-max` for visual overhaul, and `ponytail` for the laziest working solution by default. I switch a skill on for a session, then turn it off when the job is done.

The docs are the source of intent, the source code is the source of truth. When they disagree, the code wins and the docs get updated. This loop is what kept the project small and the surprises few.

## Tour the sections

Six pages. Designed for minimum effort, which is a hard rule. Every page shows one clear next action in the first viewport.

### Introduction (`/`)

A two-step form. Step one asks for a full name. Step two optionally takes email and a comment. A name-only action is available on both steps for visitors who do not want to share contact details. Nothing is sent. A submitted name is kept only in `localStorage` so a returning visitor skips the form.

### Onboarding (`/onboarding/`)

The route map. Arrival and About are live destinations. Work is shown as a muted future point. A click on the launch control opens the guided flight.

### Guided flight

A full-screen native dialog that loads the Three.js scene on intent. The exploration ship flies a CatmullRomCurve3 between four planets, with asteroid fields that approach and scatter on arrival, a targeting reticle, and a follow camera that banks into the turn. Native modal behavior owns focus, Escape, and inert background. Closing restores trigger focus. WebGL failure keeps the text tour. Reduced motion changes stops instantly.

### About (`/about/`)

A static reading surface with five resume-based work summaries, each with reported metrics labeled as such. The honest tools list. One clear next action back to the introduction.

### CV (`/cv/`)

The owner-supplied resume in the portfolio type system, without the side rail. A persistent Back to map control lives on every page so the CV is always one step away.

### Privacy (`/privacy/`) and Terms (`/terms/`)

Policy pages accessible without JavaScript. They describe this preview and must be reviewed before any real submission service is enabled.

## What is done, what is still ahead

Honest status, not a roadmap.

### Done

- Six static pages with the shared identity.
- Three.js orbit transition that takes over at the source orbit, holds the route, and crossfades into the destination page.
- Guided spaceship flight with authored ship, asteroid encounters, banking, and a text fallback.
- WebGL route map with the SVG fallback.
- Form validation, local visitor name, name-only and full paths.
- Accessibility: reduced motion, focus management, ARIA labels.
- Docs tree: architecture, product, delivery, invariants, plans, known issues.
- 22 unit tests, all green.

### Deferred to a later phase

- Backend, submission service, notification, and visitor tracking.
- The Work section on the map. Muted, not yet built.
- Optional in-flight interactions during the guided tour.
- CI/CD and Surge deployment automation.
- Public case studies for the five work stories. The metrics exist. The write-ups do not yet because the client material needs sign-off.

## Run it locally

Node 22.12+ is required. Two workflows are supported, pick the one that fits.

### Option A: Task v3 (recommended)

Task is a small task runner that wraps pnpm. The repo ships with `taskfile.yaml` so the tasks are versioned with the project.

Install Task v3 first. Pick the method that matches your machine:

- macOS or Linux with Homebrew: `brew install go-task/tap/go-task`
- Windows with Scoop: `scoop install go-task`
- Anywhere with the official install script:

  ```bash
  sh -c "$(curl --location https://taskfile.dev/install.sh)" -- -d -b ~/.local/bin
  ```

The full list lives at the [Task installation guide](https://taskfile.dev/docs/installation). Confirm the install with `task --version`.

Then run the project:

```bash
task install    # pnpm install --frozen-lockfile
task run-dev    # dev server on http://127.0.0.1:4321
task check      # pnpm check plus pnpm test
task build      # pnpm build into ./dist
task run-prod   # build then preview the production site
task --list     # show every task this repo defines
```

### Option B: pnpm directly

Skip Task and call pnpm yourself. The tasks above just forward to these commands.

```bash
# install
pnpm install --frozen-lockfile

# dev server on http://127.0.0.1:4321
pnpm dev

# type check
pnpm check

# unit tests
pnpm test

# production build to ./dist
pnpm build
```

If pnpm is not installed yet, the cleanest path on Node 22 is `corepack enable pnpm`, since pnpm 11 is a Node version manager managed release. Otherwise install pnpm 11 or newer with `npm install -g pnpm`.

## Where to read next

- [AGENTS.md](./AGENTS.md): operating rules and routing.
- [DESIGN.md](./DESIGN.md): design tokens, components, motion.
- [zensical docs/docs/index.md](./zensical%20docs/docs/index.md): the knowledge map.
- [zensical docs/docs/architecture/framework.md](./zensical%20docs/docs/architecture/framework.md): the framework choice.
- [zensical docs/docs/product/brief.md](./zensical%20docs/docs/product/brief.md): the portfolio brief.
- [zensical docs/docs/known-issues/fix-log-2026-09-06.md](./zensical%20docs/docs/known-issues/fix-log-2026-09-06.md): the most recent fix log.

The owner reviews and ships. Agents do not push or run browser tests.
