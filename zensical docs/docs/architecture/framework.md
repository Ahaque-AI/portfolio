# Framework recommendation

Status: proposed, 2026-09-05; not installed or accepted yet.

Recommend **Astro + TypeScript**, static output, native CSS, and small browser
scripts. Add React islands only where a complex interactive demonstration
benefits from them. Use Markdown for case studies initially; a CMS is unnecessary.

Astro suits a portfolio whose primary value is readable project evidence while
allowing isolated interactive components. Its official Surge guide builds the
site and publishes `dist`. [Astro Surge guide](https://docs.astro.build/en/guides/deploy/surge/)
and [islands architecture](https://docs.astro.build/en/concepts/islands/).

| Option | Fit and tradeoff |
| --- | --- |
| Astro + TypeScript | Recommended: static content with selectively added interactivity; a clear boundary for future agents |
| Next.js static export | Viable if an all-React codebase is the priority, but runtime server features are unavailable on a static host |
| Plain HTML/CSS/JavaScript | Sufficient for a small site; shared layouts and growing case-study content would require more manual organization |

Next.js supports static export but documents unsupported server-dependent
features. Those capabilities do not help this Surge requirement.
[Next.js static exports](https://nextjs.org/docs/app/guides/static-exports).

The framework does not make the portfolio distinctive by itself. Original
case-study content, a deliberate reading sequence, and meaningful interactive
explanations will matter more than animation libraries.

## Proposed service boundary

```text
Surge: static pages, styles, optional browser interactions
    -> external submission endpoint: validate and securely store volunteered details
        -> private notification service: tell owner a submission arrived

Optional visit event -> separate external event receiver -> visit notification
```

An ordinary visit does not reveal a visitor's name or email. Separate anonymous
visit events from volunteered contact submissions. No email should be fabricated
or inferred for visitors who skip. Browser events are best-effort: blockers,
network failures, bots, and repeat visits prevent a promise of exact human counts.

Provider, storage, notification destination, event definition, and retention are
undecided. Evaluate a managed form service first during planning; introduce a
small external backend only if the agreed requirements need it. Surge itself
will not run an Astro server endpoint or a FastAPI application.

Future agents should keep static content in Astro, interactive state local,
and service secrets outside the browser. Confirm versions at implementation
time; no speculative dependency pins or project scaffolding are created now.
