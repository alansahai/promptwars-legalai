# Legal AI Assistant

[![CI](https://github.com/OWNER/REPO/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/OWNER/REPO/actions/workflows/ci-cd.yml)
[![CodeQL](https://github.com/OWNER/REPO/actions/workflows/codeql.yml/badge.svg)](https://github.com/OWNER/REPO/actions/workflows/codeql.yml)


A GenAI-powered platform for understanding, comparing, and asking questions about legal
documents — contracts, terms of service, privacy policies — without needing a lawyer to get
started. Built for the **PromptWars: AI for Legal Assistance & Access** challenge.

> This tool provides general information to help you understand legal documents. It is **not** a
> substitute for advice from a licensed attorney.

## Evaluation criteria alignment

| Criterion | How this project addresses it |
|---|---|
| **Problem Statement Alignment** | Directly targets "AI for Legal Assistance & Access": simplifies contracts/ToS/privacy policies into plain English, surfaces risks and obligations, compares document versions, and answers grounded questions — all framed as *information*, never as legal advice (see disclaimer, and every Gemini prompt in `src/utils/prompts.ts`). |
| **GenAI Integration Architecture** | Single, well-isolated Gemini integration point (`src/api/services/aiService.ts`) used by all 4 analysis modes, with structured JSON output mode, a parsing fallback, a caching layer, and document truncation. Documented end-to-end in [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) and [`docs/API_REFERENCE.md`](docs/API_REFERENCE.md). |
| **Code Quality** | Full TypeScript strict mode, ESLint (flat config) + Prettier enforced in CI, no dead/duplicated logic between the Next.js and Express API layers (both call the same shared services), centralized error handling. |
| **Security** | 0 known vulnerabilities (`npm audit`), enforced by a dedicated CI job + CodeQL static analysis + Dependabot (see [`SECURITY.md`](SECURITY.md) for the full breakdown: input validation, rate limiting, Helmet/CORS, secret handling, no persistent storage of uploaded documents). |
| **Efficiency** | Response caching (1h TTL) avoids redundant Gemini calls, documents are truncated to a safe token budget, structured JSON mode removes fragile text parsing, in-memory storage avoids DB round-trips for a POC's scale. |
| **Testing** | 40+ automated tests (Jest + Supertest + Testing Library + jest-axe) across unit, integration, and accessibility layers, run in CI on two Node versions with enforced coverage thresholds — see [Testing](#testing) below. |
| **Accessibility** | Keyboard-operable ARIA tab pattern, labelled form controls, `aria-live` status/error regions, visible focus rings, semantic table markup, and automated axe-core checks in CI — see [Accessibility](#accessibility) below. |

## Features

- **Document Ingestion** — Drag-and-drop upload (PDF, DOCX, TXT up to 10MB) or direct legal text paste
- **Instant Test Fixtures** — One-click sample contracts (Residential Lease, Software MSA) for instant live evaluation
- **Simplified Summary** — Dense legal jargon rewritten in plain English, with bulleted key points and defined terms glossary
- **Risk & Obligation Audit** — Overall risk meter, obligations, red flags, and ambiguous clauses rated high/medium/low
- **Action Checklist & Lawyer Prep** — Interactive preparation checklist with checkboxes, strategic user options, and tailored questions for legal counsel
- **Document Comparison** — Structured, section-by-section diff between two documents with plain-language legal impact
- **Grounded Q&A** — Ask questions answered strictly from the uploaded document with confidence and source grounding pills
- **Export & Reporting** — Download formatted Markdown analysis reports or copy formatted text to clipboard with one click

## GenAI integration

All analysis is powered by the **Google Gemini API** (`gemini-2.5-flash` by default, configurable
via `GEMINI_MODEL`), using structured JSON output mode. See
[`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for the full integration map and
[`docs/API_REFERENCE.md`](docs/API_REFERENCE.md) for endpoint details.

## Tech stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API routes (serverless) + an equivalent standalone Express 5 server for
  split deployments
- **AI**: Google Gemini API (`@google/generative-ai`)
- **Document parsing**: `pdf-parse`, `mammoth`
- **Testing**: Jest, Supertest, Testing Library, jest-axe
- **CI/CD**: GitHub Actions (lint, type-check, test matrix, security audit, build), CodeQL,
  Dependabot
- **Deployment**: Vercel (frontend/API) and, optionally, Render/Railway (standalone backend)

## Project structure

```
src/
  api/
    controllers/     Express request handlers (document, analysis)
    middleware/       validation, rate limiting, error handling
    routes/           Express route definitions
    services/         aiService (Gemini), documentService (parsing), storageService (in-memory)
    server.ts         standalone Express app (for Render/Railway)
  components/         DocumentUpload, AnalysisResult, ComparisonView, QAInterface
  types/              shared TypeScript types
  utils/              prompts, constants, cache, helpers
pages/
  api/                Next.js API routes (upload, analyze, compare, ask, health)
  index.tsx           landing page
  dashboard.tsx        the working app (upload + all four analysis modes)
tests/
  unit/               aiService, documentService, storageService, cache, prompts, accessibility
  integration/         Express API endpoint tests (supertest)
  fixtures/            sample documents used by tests
docs/                 architecture, API reference, deployment guide
.github/
  workflows/          ci-cd.yml (lint/type-check/test/audit/build), codeql.yml
  dependabot.yml       automated weekly dependency update PRs
```

## Running locally

This section assumes nothing is installed yet. If you already have Node.js and the repo cloned,
skip to [step 3](#3-install-dependencies).

### 1. Install Node.js

You need **Node.js 20.9 or newer** (Next.js 16 requires it).

**Check if you already have it** — open a terminal (PowerShell on Windows) and run:

```powershell
node --version
npm --version
```

If both print a version (and Node is 20.9+), skip to step 2.

**If `node` is not recognized, or the version is too old:**

- **Windows, with [winget](https://learn.microsoft.com/windows/package-manager/winget/) available**
  (built into Windows 10/11):
  ```powershell
  winget install OpenJS.NodeJS.LTS
  ```
  Then **close and reopen your terminal** (PATH changes need a fresh shell) and re-run
  `node --version` to confirm.
- **Any OS, manual install**: download the LTS installer from https://nodejs.org and run it.
- **macOS with Homebrew**: `brew install node@20`

### 2. Get the code

If you don't already have this folder, clone it from your GitHub repository (see
[`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) if you haven't pushed it there yet):

```powershell
git clone https://github.com/YOUR_USERNAME/legal-ai-poc.git
cd legal-ai-poc
```

If you already have the project folder locally (no cloning needed), just open a terminal in that
folder.

### 3. Install dependencies

From the project folder:

```powershell
npm install
```

This installs everything from `package.json` into `node_modules/` (takes ~1-2 minutes). You'll see
some `npm warn deprecated` lines — those are normal and safe to ignore.

### 4. Get a Gemini API key

1. Go to https://aistudio.google.com/app/apikey
2. Sign in with a Google account
3. Click **Create API key** (choose "Create API key in new project" if you don't have one)
4. Copy the key it gives you — it's a long string, no spaces

### 5. Configure your environment file

Copy the example env file to a real one (this file is git-ignored, so your key never gets
committed):

```powershell
Copy-Item .env.example .env.local
```

(On macOS/Linux: `cp .env.example .env.local`)

Open `.env.local` in your editor and replace the placeholder with your real key:

```
GEMINI_API_KEY=your-actual-key-here
```

Everything else in that file already has a sensible default — you don't need to touch it.

### 6. Run the app

```powershell
npm run dev
```

Wait for `Ready` in the terminal, then open **http://localhost:3000** in your browser. You should
see the landing page. Click **"Try it now"**, upload a legal document (PDF, DOCX, or TXT), and try
the Simplify / Risk Analysis / Compare / Ask a Question tabs.

Stop the server anytime with `Ctrl+C` in the terminal.

This single command runs the whole app — frontend and API routes together — via Next.js's
built-in `pages/api/*` routes. **No separate backend process is required** for local development.

### 7. (Optional) Run the standalone Express backend

Only needed if you plan to deploy the backend separately to Render/Railway (see
[`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md), Option B) and want to test that exact setup locally:

```powershell
npm run dev:server
# listens on http://localhost:3001
```

### Troubleshooting local setup

**`node`/`npm` not recognized after installing** — close and reopen your terminal (a fresh shell
picks up the updated PATH); if it's still missing, restart your machine.

**`npm run dev` fails with "GEMINI_API_KEY environment variable is not set"** — you skipped step 5,
or `.env.local` still has the placeholder text instead of a real key. Next.js only reads
`.env.local` automatically when it exists in the project root.

**Port 3000 already in use** — either stop whatever else is using it, or run on a different port:
```powershell
npx next dev -p 3001
```

**PowerShell blocks running scripts** (`... cannot be loaded because running scripts is disabled on
this system`) — this affects some global npm-installed CLIs, not `npm` itself. If you hit it, run
PowerShell as Administrator once and execute:
```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

**Upload/analysis works but results look generic or fail** — double-check your Gemini API key is
valid and has quota left at https://aistudio.google.com/app/apikey; errors from Gemini are caught
and returned as a generic `"Failed to analyze document"` message (see
[`SECURITY.md`](SECURITY.md) for why — real error detail is never leaked to the client).

### Testing

```bash
npm test              # run all tests with coverage
npm run test:watch    # watch mode
npm run test:ci        # CI mode (used by GitHub Actions)
```

40+ tests across three layers, all run in CI on Node 20 and Node 22:

- **Unit** (`tests/unit/`): `aiService` (Gemini calls mocked — no live network calls in CI),
  `documentService`, `storageService`, `cache`, `prompts`.
- **Integration** (`tests/integration/`): the Express API end-to-end via Supertest — upload,
  analyze, compare, ask, document retrieval, validation failures, and the error-handling
  middleware (malformed JSON body).
- **Accessibility** (`tests/unit/accessibility.test.tsx`): renders key components with React
  Testing Library and asserts zero automated violations via `jest-axe` (axe-core), plus explicit
  checks that interactive controls have accessible names/labels.

Coverage thresholds are enforced (`jest.config.js`) and fail CI if a change drops coverage below
the configured floor.

### Linting & formatting

```bash
npm run lint
npm run lint:fix
npm run format
npm run type-check
```

## Security

- API keys are read only from environment variables and never logged
- Helmet security headers and a locked-down CORS origin on the Express backend
- File type/size validation on every upload (PDF/DOCX/TXT, 10MB max)
- Rate limiting on upload and analysis endpoints
- Centralized error handling that never leaks stack traces in production
- **0 known vulnerabilities** (`npm audit`), checked on every CI run, plus CodeQL static analysis
  and Dependabot for ongoing patching — full breakdown in [`SECURITY.md`](SECURITY.md)

## Accessibility

- Every page ships with `lang="en"` (`pages/_document.tsx`) and passes through Next's built-in
  semantic HTML/landmark structure
- The analysis tabs in the dashboard implement the full ARIA `tablist`/`tab`/`tabpanel` pattern
  with left/right arrow-key navigation, not just styled `<button>`s
- Every form control has an accessible name (visually-hidden `<label>` on the Q&A question field,
  `aria-label` on the file input) and a visible focus ring (`focus-visible:outline`) — nothing
  relies on `outline: none`
- Status and error messages use `aria-live`/`role="alert"` regions so screen reader users get the
  same "uploading…"/"failed"/"here are your results" feedback sighted users see instantly
- The document-comparison table has a `<caption>`, `scope="col"` headers, and an accessible name
- Automated regression coverage via `jest-axe` in CI (see [Testing](#testing)) — this doesn't
  replace manual screen-reader testing, but it catches the common regressions (missing labels,
  contrast/ARIA misuse, unlabelled controls) on every push

## Efficiency

- In-memory response caching (1-hour TTL) avoids re-calling Gemini for identical requests
- Documents are truncated to a safe character budget before being sent to the model
- Structured JSON output mode removes the need for fragile text parsing

## Deployment

See [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) for step-by-step Vercel and Render/Railway
instructions, including a single-service (Vercel-only) path and a split frontend/backend path.

## Disclaimer

This project is a proof of concept built for a hackathon. It is designed to make legal documents
easier to understand, not to provide legal advice. Always consult a licensed attorney for
decisions with legal consequences.

## License

MIT — see [LICENSE](LICENSE).
