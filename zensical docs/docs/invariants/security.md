# Security and personal-data rules

- Collect name and email only through deliberate submission after clear notice.
  Do not infer identity, enrich visitor data, or capture partially typed fields.
- Do not place names, emails, private tokens, or notification webhook secrets in
  URLs, analytics payloads, source control, public build output, or browser storage.
- Keep private service credentials at the external service; future deployment
  credentials belong in GitHub Actions secrets.
- Document purpose, recipients, retention, deletion handling, and consent text
  before activating collection. Do not assume terms acceptance authorizes marketing.
- Minimize notification content and access to submissions. Avoid sending full
  personal details through unnecessary third-party channels.
- Resolve applicable privacy requirements against the actual audience and
  service choices before publishing legal text. Draft outlines are not legal approval.
