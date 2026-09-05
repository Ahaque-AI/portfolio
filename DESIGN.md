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

Initial implemented direction, awaiting the owner's visual review. Space is
expressed through a large orbital diagram and instrument-like lettering.
The form remains a familiar, readable task surface. Terms and privacy are
reading surfaces within the same identity. All assets are authored vector
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

Shared shell: identity, location, legal navigation, footer. Desktop entry uses
two unequal columns: orbit/identity left, form right (maximum 460px).
The 760px breakpoint stacks these regions. Legal pages pair a 250px navigation
rail with a reading column up to 660px; mobile removes the decorative rail.
Document scroll owns all pages. No scroll lock or custom cursor.

## Elevation & Depth

The orbital sphere alone uses physical light shading. Form controls are flat
with a single border; no glass cards or luminous panel shadows. The authored
orbit enters once and tilts gently with a mouse pointer. Reduced motion removes
animation, tilt, and transitions; no continuous ambient animation is needed.

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
| `src/styles/global.css` | Canonical tokens, controls, responsive rules, scrollbar |
| `src/scripts/validation.mjs` | Full/name-only validation shared by both actions |
| `src/pages/index.astro` | Form state, inline errors, status and focus handling |

Full name is required on both paths. Full preview additionally validates email
and agreement; name-only continuation does not validate email, comment, or
agreement. Neither sends or saves anything. Both show the next-phase boundary.
Legal links from the form open new tabs to preserve fields. No form drafts are
written to storage. Native semantic controls, labelled fields, visible focus,
and inline error descriptions are required. Global scrollbars use tokenized
thumb/track/hover/active colors with system behavior in forced-colors mode.

## Do's and Don'ts

- Reuse the shell, legal layout, tokens, and arrow before creating new variants.
- Keep agreement unchecked, name-only continuation visible, and copy honest.
- Keep policies accessible without form completion or JavaScript.
- Do not add unrelated portfolio sections, tracking, or fabricated live status.
- Do not use browser controls; the owner handles visual/interaction testing.
- Current review status: build/type/unit verification only; manual responsive,
  keyboard, reduced-motion, and final visual approval remain with the owner.
