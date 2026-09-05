# Guided flight solar system, rocket, About page, CV

Status: proposed, 2026-09-05. Owner accepted the shape on the same day:
full-screen flight overlay, HTML CV page, About reachable from flight and map,
owner-supplied metrics published as reported results. Each step still gets
owner approval after it is built.

## Decisions this plan is built on

| Decision | Choice |
| --- | --- |
| Guided flight | Full-screen Three.js solar system overlay with a rocket; current dialog stays as the no-WebGL fallback |
| Rocket | Authored Three.js geometry in the design palette, no stock assets |
| About reachability | Guided flight stop plus a real map link on the About stop |
| CV | Static HTML `/cv/` page in the shared identity, persistent control on every page |
| Metrics | Owner-supplied figures from the brief, always labeled as reported results |
| Personal contacts | No phone, email, or address from the resume on the CV page; the introduction form stays the contact route |

## Content source

Resume evidence already reviewed in `../product/brief.md` (text reviewed
2026-09-05): AI therapy microservice (CPU-only inference, 15 GB AKS pods,
300+ daily sessions), AI student companion (tenant-scoped RAG, pgvector,
100K to 10K tokens/session), fraud detection (Kafka pipeline, PII masking,
five-minute reporting), GraphRAG-Causal (Neo4j, CrewAI, reported 82.88% F1
and 80% accuracy), IntentLens (four-agent feedback analysis, 5,000+ reviews).
No dates, employers, phone numbers, or education entries exist in the brief,
so none will be invented.

## Steps

### Step 01: CV page and persistent control

- What: `/cv/` page using Shell. Sections: short profile, selected work
  (the five stories with reported metrics), tools the evidence actually shows
  (AKS/Kubernetes, Kafka, Neo4j, pgvector, RAG, CrewAI), and the next action
  pointing back to the introduction form. A CV link in the shared header
  appears on every page, so the CV is always one step away.
- Why: the owner wants the CV previewable at all times along the journey
  without a public PDF and without publishing personal contacts.
- How: `src/pages/cv.astro` + one header link in `src/layouts/Shell.astro`;
  copy follows the writing rules (no em dashes, no filler).
- Verify: `pnpm check`, `pnpm test` (dash check), `pnpm build`; owner reads
  the page copy.
- Files: `src/pages/cv.astro`, `src/layouts/Shell.astro`, `global.css`,
  `DESIGN.md`.

### Step 02: Solar system and rocket scene module

- What: `src/scripts/solar-system.ts`, same lifecycle contract as
  `orbital-map.ts` (mount, visibility pause, reduced-motion freeze, full
  disposal). Scene: the existing globe reused as the sun, planet stops for
  Arrival, About and Work on orbital tracks, deterministic star field, one
  sparse comet accent. Rocket built from cones and cylinders: ink body,
  citron stripe and engine dot. Mouse-only parallax; everything decorative
  stays aria-hidden.
- Why: the flight needs one shared scene the overlay, captions and rocket
  fly-through can use.
- Verify: type check plus a focused unit test on geometry/disposal, mirroring
  existing Three.js tests.
- Files: `src/scripts/solar-system.ts`, `src/scripts/rocket.ts`.

### Step 03: Full-screen guided flight overlay

- What: full-screen overlay on the onboarding page hosting the solar system.
  The rocket flies a spline through the stops; the camera follows. Each stop
  shows the existing tutorial copy as a caption with one primary action;
  the About stop ends with an Enter About link. Close and skip stay visible,
  Escape closes, background main goes inert, focus returns to the trigger.
  Without WebGL the existing tutorial dialog keeps working unchanged.
- Why: replaces the small dialog with the requested interactive experience.
- Verify: check, tests, build; reduced-motion and no-WebGL paths stay
  functional; owner tests the feel.
- Files: `src/components/GuidedFlight.astro`, `src/scripts/guided-flight.ts`,
  `src/pages/onboarding.astro`, `global.css`.

### Step 04: About page and map link

- What: `/about/` page in the shared identity: who Abdul is, the five work
  stories with reported metrics labeled as such, an honest tools list, and
  one clear next action in the first viewport. The map's About stop becomes
  a real link and its caption changes from Coming next to open; Work stays
  muted. The legend updates to two available sections.
- Why: the owner authorized opening About now.
- Verify: check, tests, build, dash check; owner reviews copy.
- Files: `src/pages/about.astro`, `src/components/StarMap.astro`,
  `global.css`, `DESIGN.md`.

### Step 05: Orbit transition to About

- What: extend the WebGL flight network in `orbit-navigation.ts` so
  `/onboarding/` to `/about/` (and back) flies like the existing routes.
  The About page gets a measured orbit anchor with `data-orbit-core` so the
  landing aligns exactly, and the same delta-clock contract applies.
- Why: the flight should feel like one continuous journey, not per-page
  tricks.
- Verify: check, tests, build; visual timing is an owner check.
- Files: `src/scripts/orbit-navigation.ts`, `src/pages/about.astro`.

### Step 06: Docs sync

- What: DESIGN.md components and motion sections, product brief status line,
  plans row in the docs index, README command and page list.
- Why: docs describe intent and must not go stale.
- Verify: links resolve; owner informed.

## Dependencies

02 needs nothing new. 03 needs 02. 04 is independent of 02 and 03 but should
land before 05. 05 needs 04. 06 runs last. Build order: 01, 02, 03, 04, 05, 06.

## Common issues to watch

- Three.js chunk grows; keep the module dynamic and loaded on intent only.
- Overlay focus traps and Escape handling must not fight the existing
  navigation lifecycle listeners.
- Reduced motion: overlay becomes a static scene with captions, no rocket
  flight, no comet loop.
- Mobile: the overlay must keep close/skip reachable with a thumb and never
  scroll-lock the page behind it.
- Map copy and legend must not promise Work as a real destination.
