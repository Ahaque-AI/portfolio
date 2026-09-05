# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Astro static output and TypeScript, carrying forward the recommendation into
the owner's requested initial build. pnpm only. Surge remains the future host.

## Product Purpose

Abdul Haque's personal AI engineering portfolio. Current scope is four pages:
introduction form, onboarding route map, terms and conditions, and privacy policy.

## Users

Visitors previewing an introduction or continuing with their full name only.
Recruiters and prospective collaborators are a working audience assumption.

## Capabilities and Constraints

Full name is required for both paths. Full preview also requires email and an
unchecked-by-default agreement. Name-only continuation ignores email/comment
and does not require agreement. Comment is optional for a full introduction.
No backend, external data storage, visitor tracking, notifications, or deployment
in this design phase. A submitted full name is saved in browser local storage only
to send a returning visitor directly to the route map. Back and Arrival clear it so the visitor can submit a replacement. Submission previews validation and explicitly says nothing was sent.
The full portfolio is outside this implementation. The onboarding route map and
short optional tour preview the future structure without inventing unavailable
sections.
Both paths stay in this preview and show a next-phase message, as chosen by the owner.
The form guides visitors through name first, then optional contact details.
Comments expand on request. A name-only action remains available at each step.
Back preserves typed values in the page; completion replaces the form.
The owner performs manual browser testing; agents must not use browser controls.

## Brand Commitments

Space-inspired, distinctive, interactive, consistent across all four pages.
Clear form UX with a visible way to continue with a name only.
Every flow should minimize user effort and guide one clear next action at a time.

## Evidence on Hand

The resume and initial product brief in `zensical docs/docs/product/brief.md`.
No additional credentials, legal approval, or service capability may be invented.

## Product Principles

- No preview path transmits personal information; policy pages remain accessible.
- Use plain labels and honest feedback.
- Share design primitives and document their ownership.
