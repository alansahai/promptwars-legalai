# Architecture

## Overview

Legal AI Assistant is a Next.js application with a thin Express backend layer. Both share the
same TypeScript service code under `src/api/services`, so the app runs two ways:

1. **Single deployment (Vercel only)** — the Next.js API routes in `pages/api/*` call the shared
   services directly. This is the simplest way to run and demo the app.
2. **Split deployment (Vercel + Render/Railway)** — the Express app in `src/api/server.ts` exposes
   the same functionality as `/api/*` routes on its own host, and the frontend is pointed at it via
   `NEXT_PUBLIC_API_URL`.

```
┌───────────────────────────────────────────────────────────────┐
│ Frontend (Next.js + React + Tailwind)                         │
│  pages/index.tsx      – landing page                          │
│  pages/dashboard.tsx  – upload, simplify, risks, compare, Q&A  │
│  src/components/*     – DocumentUpload, AnalysisResult,        │
│                         ComparisonView, QAInterface            │
└───────────────────────────────────────────────────────────────┘
                              │  fetch("/api/...")
                              ▼
┌───────────────────────────────────────────────────────────────┐
│ API layer (two equivalent entry points, same services)        │
│  pages/api/{upload,analyze,compare,ask}.ts   (Next.js/Vercel)  │
│  src/api/{routes,controllers}/*              (Express/Render) │
└───────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌───────────────────────────────────────────────────────────────┐
│ Services (src/api/services)                                   │
│  documentService.ts – PDF/DOCX/TXT text extraction             │
│  storageService.ts  – in-memory document store (TTL 24h)       │
│  aiService.ts        – Gemini API calls + response caching     │
└───────────────────────────────────────────────────────────────┘
                              │
                              ▼
                     Google Gemini API
                 (gemini-2.5-flash, JSON mode)
```

## GenAI integration

All four analysis modes go through a single function, `analyzeDocument()` in
`src/api/services/aiService.ts`:

| Mode       | Prompt builder (`src/utils/prompts.ts`) | Output shape                                  |
|------------|------------------------------------------|------------------------------------------------|
| `simplify` | plain-English rewrite                    | `{ summary, keyPoints[], termsDefinitions{} }`  |
| `risks`    | obligation/risk/ambiguity extraction     | `{ obligations[], risks[], ambiguities[] }`     |
| `compare`  | diff between two documents                | `{ differences[], summary }`                    |
| `qa`       | grounded question answering               | `{ answer, groundedInDocument }`                |

Design choices:

- **Structured output**: requests use Gemini's `responseMimeType: "application/json"` so the model
  returns machine-parseable JSON directly, with a regex fallback in case of malformed output.
- **Grounding**: every prompt instructs the model to answer only from the supplied document text
  and to say so explicitly when something isn't covered, rather than inventing facts.
- **Not legal advice**: prompts explicitly frame the assistant as an educational, plain-language
  tool — never as a source of legal advice or recommended actions.
- **Caching**: identical `(analysisType, document, context)` triples are cached in-memory for one
  hour (`src/utils/cache.ts`) to cut latency and API cost on repeated requests.
- **Truncation**: documents longer than `MAX_DOCUMENT_CHARS` (50,000 chars) are truncated before
  being sent to the model to keep prompts within context limits.

## Data handling

There is no database in this POC. Uploaded documents are parsed to plain text and held in an
in-memory `Map` (`storageService.ts`) for 24 hours, then expire. Nothing is written to disk or a
third-party store. This is a deliberate simplicity/privacy trade-off for a legal-document tool —
swap in a real database only if persistence across restarts is required.

## Security

See `src/api/middleware/` for input validation, rate limiting, and centralized error handling,
`docs/DEPLOYMENT.md` for environment variable and CORS configuration, and
[`SECURITY.md`](../SECURITY.md) for the full posture (dependency audit status, CodeQL, Dependabot).

## CI/CD

`.github/workflows/ci-cd.yml` runs on every push/PR to `main`: lint, type-check, and the test suite
(matrixed across Node 20 and 22 with coverage thresholds enforced) run in parallel jobs, a
dependency security audit runs alongside them, and the production build only runs once lint,
type-check, and tests have all passed. `.github/workflows/codeql.yml` runs static analysis on the
same triggers plus a weekly schedule, and `.github/dependabot.yml` opens weekly PRs for outdated
dependencies.
