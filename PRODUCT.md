# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Astro static output and TypeScript, carrying forward the recommendation into
the owner's requested initial build. pnpm only. Surge remains the future host.

## Product Purpose

Abdul Haque's personal AI engineering portfolio. Current scope is exactly three
pages: introduction form, terms and conditions, and privacy policy.

## Users

Visitors previewing an introduction or continuing with their full name only.
Recruiters and prospective collaborators are a working audience assumption.

## Capabilities and Constraints

Full name is required for both paths. Full preview also requires email and an
unchecked-by-default agreement. Name-only continuation ignores email/comment
and does not require agreement. Comment is optional for a full introduction.
No backend, data storage, visitor tracking, notifications, or deployment in this
design phase. Submission previews validation and explicitly says nothing was sent.
The future portfolio and guided tour are outside this implementation.
Both paths stay in this preview and show a next-phase message, as chosen by the owner.
The owner performs manual browser testing; agents must not use browser controls.

## Brand Commitments

Space-inspired, distinctive, interactive, consistent across all three pages.
Clear form UX with a visible way to continue with a name only.

## Evidence on Hand

The resume and initial product brief in `zensical docs/docs/product/brief.md`.
No additional credentials, legal approval, or service capability may be invented.

## Product Principles

- No preview path transmits personal information; policy pages remain accessible.
- Use plain labels and honest feedback.
- Share design primitives and document their ownership.
