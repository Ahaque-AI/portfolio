---
name: Orbital guestbook
description: Shared visual identity for Abdul Haque's portfolio preview
colors:
  background: "#0c151c"
  surface: "#131f27"
  text: "#eff0de"
  muted: "#a5b4bb"
  accent: "#e7ecac"
  accent-hover: "#f4f7ce"
  border: "#53616a"
  line: "#29363e"
  error: "#ffb4a9"
  focus: "#d0ddff"
typography:
  display:
    fontFamily: "Chakra Petch, sans-serif"
    fontWeight: 400
    lineHeight: 1.09
  body:
    fontFamily: "Manrope Variable, sans-serif"
    fontSize: "15px"
    lineHeight: 1.65
rounded:
  control: "8px"
spacing:
  unit: "8px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.background}"
    rounded: "{rounded.control}"
    height: "54px"
---

# Orbital guestbook

## Overview

Visual identity approved by the owner. Space is
expressed through a large orbital diagram and instrument-like lettering.
The form remains a familiar, readable task surface. Terms and privacy are
reading surfaces within the same identity. Assets use authored SVG and Three.js
geometry; no stock or generated raster images are used.

Reference: [NASA Eyes](https://science.nasa.gov/eyes/) for spatial subject matter
and restrained navigation, not a copied layout. The design-system search's
generic amber block layout was rejected as unrelated to the brief.

## Colors

Runtime owner: `src/styles/global.css` `:root`. Frontmatter mirrors that source;
update both together. `colors.*` maps directly to `--color-*`. Components consume
these variables. Dim `line` is decorative; form boundaries use `border`.
Pale citron marks primary actions and the visitor point. Error text uses the
error token and an explicit correction, never color alone. One dark theme.

## Typography

Chakra Petch 400/500 provides the display lettering; Manrope Variable handles
body, labels, and controls. Fonts are packaged locally, with sans-serif fallbacks.
Display: 48–76px desktop (84px on very wide screens), 44–62px mobile.
Legal headings: 44–66px; section headings: 24px. Inputs use 16px on mobile.
Utility copy is smaller and never carries the only critical instruction.

## Layout

Minimum effort is a hard rule. Every page keeps its primary next action in the
first viewport, guides the visitor through visible cues, and avoids extra steps
that do not help the current decision. Scrolling remains available for content,
but it must not be required to discover the next action. The footer begins below
the first viewport so it is available through scrolling without competing with
the page task.

Shared shell: identity, location, legal navigation, footer. Desktop entry uses
two unequal columns: orbit/identity left, form right (maximum 460px). The orbit
is deliberately oversized, with a 320 to 560px height budget, so it reads as
the main visual anchor rather than a small illustration. It sits slightly toward
the form and center gap, leaving breathing room at the far left. The visitor annotation
uses larger type and a stronger citron marker so “YOU ARE HERE” survives the
orbit's scale.
The entry form uses two compact steps: name, then contact details. The comment
field is a native disclosure, closed initially. A name-only action is available
on either step. The name is validated before moving forward; Back preserves
all values. Completion replaces the fields instead of extending the page.
Focus moves to the first field after a step change without opening the mobile
keyboard on initial load. A successfully submitted name is retained in browser
local storage only to send return visits to the route map. Back and Arrival
explicitly clear it so the visitor can replace it. It is never sent.

The 760px breakpoint stacks a shortened introduction above the form. On the
contact step, mobile reduces the headline and orbit further to prioritize the
controls. Short desktop viewports also reduce header/diagram space. Normal
document scrolling stays available for expanded comments, zoom, validation
messages, unusually small windows, and software keyboards. Do not promise zero
scrolling under every browser/text-size combination.

The onboarding page is a viewport-first route map. The copy gives one clear
instruction, then the visitor hovers over a destination and selects the one
available point directly on the map. Back and one optional guided-flight button
are the only separate controls. Future points remain visibly muted and are not
presented as fake choices. Route motion is sparse: a slow signal along the path
and restrained star twinkle. No floating particle wash or repeated shooting-star
loop. The map now renders a lit Three.js sphere, depth-tested latitude and
longitude lines, two orbital tracks, and a signal along the destination curve.
The original SVG remains the fallback when WebGL is unavailable. The canvas and
SVG share an 820 × 520 aspect ratio so destination targets stay aligned. Map
motion stops offscreen, in hidden tabs and under reduced motion.

The map labels are route annotations rather than floating captions: each carries
an index, destination and concise state. Arrival remains a native link and has
the brightest label at the lower-left launch point. About and Work stay muted,
non-interactive labels with the same alignment system. Their touch-sized layout
does not rely on hover. On capable devices, the Three.js map adds a slow star
field drift, an orbital shimmer, a breathing signal halo and a small mouse-only
camera parallax. The effects are part of one spatial instrument, not separate
decorative loops.

The owner explicitly requested Three.js for the page transition. On “See the
route ahead”, a WebGL globe takes over at the source orbit's measured position,
expands and rotates for 900ms, holds the route during the swap, then contracts
into the destination orbit for 950ms and crossfades over about 450ms into the
identical live page scene before the overlay is removed. The destination map
freezes its own animation clock during the landing, so its motion resumes from
the exact landing frame with no snap. The return route uses the same scene. Astro's
ClientRouter keeps the overlay canvas alive across the actual page swap. The
destination loads before the screen is covered; no introduction values are
stored. Escape skips the animation. History traversal and reduced motion skip
the flight, and unavailable WebGL falls back to native navigation.

Three.js loads on navigation intent or on the map page. Rendering is capped at
1.5 device pixels per CSS pixel and two million framebuffer pixels. Geometry,
materials, render targets, observers and animation frames are released after
use. Browser shader compilation and visual smoothness require owner testing.

Legal pages pair a 250px navigation
rail with a reading column up to 660px; mobile removes the decorative rail.
Document scroll owns all pages. No scroll lock or custom cursor.

## Elevation & Depth

The orbital sphere alone uses physical light shading. Form controls are flat
with a single border; no glass cards or luminous panel shadows. The authored
orbit enters once, tilts gently with a mouse pointer, and carries the visitor
marker continuously around the orbital path. The label stays upright while it
travels. Reduced motion removes the traveler and leaves a static marker,
tilt, and transitions.

## Shapes

Orbital ellipses are the signature; avoid rockets, emoji stars, random particle
fields, or decorative dashboards. Controls have 8px corners; checkbox 4px.
Arrows share a 1.5px stroke. The favicon is the same orbital mark as the header.

## Components

| Owner | Contract |
| --- | --- |
| `src/layouts/Shell.astro` | Shared header/footer, title, focus skip link, local fonts |
| `src/layouts/Legal.astro` | Both policy pages, article measure, shared return links |
| `src/components/Orbit.astro` | Decorative diagram, excluded from accessibility tree |
| `src/components/Arrow.astro` | Shared directional icon |
| `src/components/StarMap.astro` | Decorative route map for onboarding |
| `src/styles/global.css` | Canonical tokens, controls, responsive rules, scrollbar |
| `src/scripts/validation.mjs` | Full/name-only validation shared by both actions |
| `src/scripts/orbital-three.ts` | Shared Three.js globe geometry and flight renderer |
| `src/scripts/orbit-navigation.ts` | Astro navigation lifecycle, cancellation, reduced motion and focus |
| `src/scripts/orbital-map.ts` | Map renderer, aligned route, visibility and resource cleanup |
| `src/pages/index.astro` | Form state, inline errors, status and focus handling |
| `src/pages/onboarding.astro` | Route map, direct destination, and guided flight |

Full name is required on both paths. Full preview additionally validates email
and agreement; name-only continuation does not validate email, comment, or
agreement. The submitted name alone is retained locally, never sent. Both show
the next-phase boundary.
Legal links from the form open new tabs to preserve fields. No form drafts are
written to storage. Native semantic controls, labelled fields, visible focus,
and inline error descriptions are required. Global scrollbars use tokenized
thumb/track/hover/active colors with system behavior in forced-colors mode.

## Do's and Don'ts

- Reuse the shell, legal layout, tokens, and arrow before creating new variants.
- Minimize effort across every flow. Give the visitor one clear next action,
  keep the useful content in the first viewport, and let the interface guide
  the sequence instead of presenting a menu of competing buttons.
- Keep agreement unchecked, name-only continuation visible, and copy honest.
- Keep policies accessible without form completion or JavaScript.
- Do not add unrelated portfolio sections, tracking, or fabricated live status.
- Do not use browser controls; the owner handles visual/interaction testing.
- Portfolio copy uses no em dashes or generic AI-style filler. Follow the
  writing rules in `zensical docs/docs/invariants/frontend.md`.
- Current review status: build/type/unit verification only; manual responsive,
  keyboard and reduced-motion checks for this form refinement remain with the owner.
