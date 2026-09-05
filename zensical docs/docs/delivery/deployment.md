# Future Surge deployment

Status: deferred by the owner. No workflow YAML exists or has been tested.

Intended future delivery: GitHub Actions builds the static portfolio and
publishes its generated output to an explicitly chosen Surge domain.
The [Astro Surge guide](https://docs.astro.build/en/guides/deploy/surge/)
documents building the site and deploying `dist`.

Before writing the workflow, establish the GitHub repository, deployment
branch/trigger, exact target domain, supported Node version, lockfile/package
manager, and Surge authentication requirements. Store deployment credentials
as GitHub secrets, never in the YAML or public site.

The future workflow should install reproducibly, run the project's actual
checks, build, and deploy only after success. Keep secrets out of untrusted
pull-request runs, minimize permissions, and avoid overlapping deployments.
Decide whether automatic deployment is approved; an approved trigger defines
the later automation scope and must be recorded.

Verification must include generated output and live direct links for home,
project, privacy, terms, assets, and 404 behavior. Test optional form failure
without blocking browsing. Define recovery to a known good build before launch.
Do not describe CI/CD as working until an authorized deployment run succeeds.
