# Security

## Current status

`npm audit` reports **0 known vulnerabilities** (last verified against Next.js 16, React 19,
Express 5, and Multer 2 — all current major versions as of this writing).

## How this is enforced

- **CI on every push/PR** (`.github/workflows/ci-cd.yml`): a dedicated `security-audit` job runs
  `npm audit --audit-level=high` so any newly-disclosed high/critical CVE in a dependency is
  visible on the next CI run, not just at release time.
- **CodeQL static analysis** (`.github/workflows/codeql.yml`): scans the TypeScript/JavaScript
  source itself (not just dependencies) for common vulnerability patterns on every push/PR and
  weekly on a schedule, with results in the repo's Security tab.
- **Dependabot** (`.github/dependabot.yml`): opens weekly PRs for outdated npm packages and GitHub
  Actions, so patches land automatically instead of drifting.

## Application-level controls

- **Secrets**: `GEMINI_API_KEY` is read only from environment variables (`process.env`), is never
  logged, and `.env.local`/`.env` are git-ignored. `.env.example` ships only placeholder values.
- **Input validation**: every upload is checked for MIME type and size (10MB max) before touching
  the parser; every analysis request is checked for a valid `analysisType` and non-empty content.
- **Rate limiting**: `express-rate-limit` caps upload and analysis endpoints per client.
- **Transport/headers**: Helmet sets standard security headers; CORS is locked to a single
  configured `FRONTEND_URL` origin, not `*`.
- **Error handling**: the centralized error handler never returns stack traces or internal error
  detail in production (`NODE_ENV=production`), only a generic message.
- **No persistent storage**: uploaded documents live in memory only (24h TTL) — nothing is written
  to disk or a third-party store, which removes an entire class of data-at-rest risk for what may
  be sensitive legal documents.

## Reporting a vulnerability

This is a hackathon proof of concept without a dedicated security contact. If you find an issue,
open a GitHub issue on the repository describing it; avoid including real user data or live API
keys in the report.
