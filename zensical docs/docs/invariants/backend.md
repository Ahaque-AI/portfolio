# External service rules

- Surge hosts the static site; visitor submissions and private notification
  credentials require an external service. No backend is selected yet.
- Do not add FastAPI just because it appears in the resume.
- Validate inputs at the receiving service, impose size limits and rate limits,
  and handle abuse. Browser validation and CORS are not authentication.
- Separate accepted submission from notification delivery; a failed notification
  must not discard a stored submission. Avoid duplicates on retries.
- Keep browsing available during service outages. Never show false success.
