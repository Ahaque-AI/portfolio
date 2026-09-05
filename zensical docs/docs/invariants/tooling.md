# Tooling rules

- Quote `zensical docs` in shell commands because the path contains a space.
- Always use pnpm for packages and scripts. Do not use npm, npx, yarn, or Bun.
- Keep `pnpm-lock.yaml`; use `pnpm install --frozen-lockfile` for reproduction.
- Task commands are in root `taskfile.yaml`: `task build`, `task run-dev`,
  `task run-prod`, `task check`, and `task install`.
- No Pixi, Docker, or documentation runtime is needed for this preview.
- Keep the Surge build static. Verify direct loading of every generated route,
  especially privacy, terms, project pages, and the 404 page.
- Do not create a deployment workflow in this design-preview phase.
- Before later deployment, verify the exact target domain and authorization;
  do not overwrite either existing portfolio by assumption.
