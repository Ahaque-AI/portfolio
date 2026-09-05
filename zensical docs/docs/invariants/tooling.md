# Tooling rules

- Quote `zensical docs` in shell commands because the path contains a space.
- No Pixi, Docker, documentation runtime, or app dependencies are needed now.
- Once the stack is accepted, choose a supported Node version and one package
  manager, pin dependencies through its lockfile, and document actual commands.
- Keep the Surge build static. Verify direct loading of every generated route,
  especially privacy, terms, project pages, and the 404 page.
- Do not create `.github/workflows/workflow.yaml` during this docs-only phase.
- Before later deployment, verify the exact target domain and authorization;
  do not overwrite either existing portfolio by assumption.
