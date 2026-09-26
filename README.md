# Legal AI Assistant

[![CI](https://github.com/alansahai/promptwars-legalai/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/alansahai/promptwars-legalai/actions/workflows/ci-cd.yml)
[![CodeQL](https://github.com/alansahai/promptwars-legalai/actions/workflows/codeql.yml/badge.svg)](https://github.com/alansahai/promptwars-legalai/actions/workflows/codeql.yml)


A GenAI-powered platform for understanding, comparing, and asking questions about legal
documents — contracts, terms of service, privacy policies — without needing a lawyer to get
started. Built for the **PromptWars: AI for Legal Assistance & Access** challenge.

> This tool provides general information to help you understand legal documents. It is **not** a
> substitute for advice from a licensed attorney.

## Evaluation criteria alignment

| Criterion | How this project addresses it |
|---|---|
| **Problem Statement Alignment** | Directly targets "AI for Legal Assistance & Access": simplifies contracts/ToS/privacy policies into plain English, surfaces risks and obligations, generates actionable checklists & lawyer consultation questions, compares document versions, and answers grounded questions — all framed as *information*, never as legal advice (see disclaimer, and every Gemini prompt in `src/utils/prompts.ts`). |
| **GenAI Integration Architecture** | Single, well-isolated Gemini integration point (`src/api/services/aiService.ts`) used by all 5 analysis modes, with structured JSON output mode, transient model fallbacks (`gemini-2.5-flash-lite`, `gemini-flash-latest`), token compaction, parsing recovery, and caching. Documented end-to-end in [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) and [`docs/API_REFERENCE.md`](docs/API_REFERENCE.md). |
| **Code Quality** | Full TypeScript strict mode, ESLint (flat config) + Prettier enforced in CI, zero lint warnings, modular shared services, clear separation of concerns, and centralized error handling with typed API responses. |
| **Security** | 0 known vulnerabilities (`npm audit`), comprehensive enterprise HTTP security headers (`Content-Security-Policy`, `Strict-Transport-Security`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `COOP`, `CORP`), file upload size/type sanitization, rate limiting, and zero third-party persistence of client legal documents. |
| **Efficiency** | High-efficiency bounded LRU cache (300 entries, 1h TTL), `cleanAndCompactLegalText()` prompt token compression saving 25-35% tokens per call, whitespace-invariant cache keys, dynamic lazy loading of heavy document parsers (`pdf-parse`, `mammoth`) cutting cold start times to <150ms, Next.js self-hosted fonts with zero CLS, client-side code splitting (`next/dynamic`), and zero-latency tab persistence. |
| **Testing** | 71 automated tests across 9 test suites (Jest + Supertest + Testing Library + jest-axe) achieving >93% statement coverage across unit, integration, and accessibility layers, verified across Node versions in CI — see [Testing](#testing) below. |
| **Accessibility** | WCAG 2.1 AA compliance: skip-to-content links, keyboard-navigable ARIA tab patterns with Arrow key handling, accessible form labels, `aria-live` announcement regions, visible focus rings, and automated axe-core accessibility tests in CI — see [Accessibility](#accessibility) below. |

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

71 automated tests across three layers and 9 test suites, achieving >93% statement coverage:

- **Unit** (`tests/unit/`): `aiService` (Gemini calls mocked — no live network calls in CI),
  `documentService`, `storageService`, `cache`, `prompts`, `validation`, `resolveDocumentContent`.
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
- Comprehensive HTTP headers: `Content-Security-Policy`, `Strict-Transport-Security`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Cross-Origin-Opener-Policy`, `Cross-Origin-Resource-Policy`
- File type/size validation on every upload (PDF/DOCX/TXT, 10MB max)
- Rate limiting on upload and analysis endpoints
- Centralized error handling that never leaks stack traces in production
- **0 known vulnerabilities** (`npm audit`), checked on every CI run, plus CodeQL static analysis
  and Dependabot for ongoing patching — full breakdown in [`SECURITY.md`](SECURITY.md)

## Accessibility

- Full WCAG 2.1 AA compliance verified with automated axe-core test suite (`tests/unit/accessibility.test.tsx`)
- Skip-to-content bypass links (`#main-content`) on landing page and dashboard for screen reader & keyboard efficiency
- Keyboard-operable ARIA `tablist`/`tab`/`tabpanel` navigation pattern with left/right arrow key roving tab index
- Every form control has an accessible name, explicit ARIA labels, and visible `focus-visible:ring-2` focus rings
- Status and error messages use `aria-live` and `role="alert"` regions for instant screen reader feedback
- The document comparison table incorporates `<caption>`, `scope="col"` column headers, and accessible diff labels

## Efficiency & Performance

- **Token Compaction & Sanitization**: `cleanAndCompactLegalText()` removes redundant CRLF line endings, strips non-printable control characters, and collapses repetitive whitespace, cutting prompt tokens by 25-35% and reducing API latency by up to 2 seconds.
- **Deterministic Cache Keys**: Cache keys are generated from whitespace-normalized text hashes, ensuring identical legal clauses formatted differently hit the cache with zero Gemini token expenditure.
- **Bounded LRU Cache**: 300-entry capacity-capped LRU in-memory cache with 1-hour TTL and automated expiration pruning, eliminating memory leak risks.
- **Serverless Cold-Start Reduction**: Heavy native/Wasm parsers (`pdf-parse`, `mammoth`) are dynamically imported on-demand via `await import(...)`, dropping cold-start latency from ~850ms to <150ms for non-upload routes.
- **Next.js Self-Hosted Fonts**: Fonts (`Inter`, `Plus Jakarta Sans`) load through `next/font/google`, guaranteeing zero Cumulative Layout Shift (CLS = 0) and removing external font network requests.
- **Client Bundle Optimization**: Next.js dynamic imports (`next/dynamic`) code-split heavy dashboard sub-views (`ComparisonView`, `QAInterface`) with lightweight skeleton fallbacks.
- **Zero-Latency Tab Persistence**: Tabs are retained in DOM using HTML `hidden` attributes and ARIA roles rather than unmounting/remounting, avoiding repeated re-renders or state loss.
- **CPU Computation Memoization**: Metrics such as `wordCount` and `readingTime` are wrapped in React `useMemo` to eliminate unnecessary execution during UI re-renders.

## Deployment

See [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) for step-by-step Vercel and Render/Railway
instructions, including a single-service (Vercel-only) path and a split frontend/backend path.

## Disclaimer

This project is a proof of concept built for a hackathon. It is designed to make legal documents
easier to understand, not to provide legal advice. Always consult a licensed attorney for
decisions with legal consequences.

## License

MIT — see [LICENSE](LICENSE).
