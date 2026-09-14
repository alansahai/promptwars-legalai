# API Reference

All endpoints are available both as Next.js API routes (`/api/...` on the Vercel deployment) and
as Express routes (`/api/...` on the Render/Railway deployment). Request/response shapes are
identical.

Base URL examples:
- Same-origin (Vercel): `https://legal-ai-poc.vercel.app/api`
- Standalone backend: `https://legal-ai-poc-backend.onrender.com/api`

## `GET /api/health`

Health check.

```json
{ "status": "ok" }
```

## `POST /api/upload`

Uploads a document (`multipart/form-data`, field name `document`). Accepts PDF, DOCX, and TXT, up
to 10MB. Returns a `documentId` that can be reused by the analysis endpoints instead of resending
the full document text.

```bash
curl -X POST https://.../api/upload -F "document=@contract.pdf"
```

Response:

```json
{
  "success": true,
  "documentId": "b3f1...",
  "filename": "contract.pdf",
  "characterCount": 4213,
  "preview": "RESIDENTIAL LEASE AGREEMENT..."
}
```

## `POST /api/analyze`

Runs `simplify` or `risks` analysis. Provide either `documentId` (from `/upload`) or raw
`documentContent`.

```json
{ "documentId": "b3f1...", "analysisType": "simplify" }
```

Response (`simplify`):

```json
{
  "success": true,
  "data": {
    "summary": "...",
    "keyPoints": ["..."],
    "termsDefinitions": { "indemnify": "..." }
  }
}
```

Response (`risks`):

```json
{
  "success": true,
  "data": {
    "obligations": [{ "item": "Pay rent by the 1st", "severity": "medium" }],
    "risks": [{ "item": "Late fee of $75 after day 5", "severity": "high" }],
    "ambiguities": ["\"reasonable time\" for repair notice is not defined"]
  }
}
```

## `POST /api/compare`

Compares two documents. Provide `documentId1`/`documentId2` or `documentContent1`/`documentContent2`.

```json
{ "documentId1": "b3f1...", "documentId2": "9ac2..." }
```

Response:

```json
{
  "success": true,
  "data": {
    "differences": [
      {
        "section": "Late fee",
        "doc1": "$75 after day 5",
        "doc2": "$50 after day 10",
        "impact": "Document 2 is more lenient on late payments"
      }
    ],
    "summary": "..."
  }
}
```

## `POST /api/ask`

Answers a question grounded in one document. Provide `documentId` or `documentContent`, plus
`question`.

```json
{ "documentId": "b3f1...", "question": "What happens if I miss a rent payment?" }
```

Response:

```json
{
  "success": true,
  "data": {
    "answer": "If rent is received after the 5th of the month, a $75 late fee applies...",
    "groundedInDocument": true
  }
}
```

## Errors

All error responses share this shape and an appropriate HTTP status (400/404/413/415/422/502):

```json
{ "error": "Human-readable message" }
```

## Rate limits

- `/api/upload`: 5 requests/minute per client (default)
- `/api/analyze`, `/api/compare`, `/api/ask`: 10 requests/minute per client (default)

Configurable via `RATE_LIMIT_WINDOW_MS` and `RATE_LIMIT_MAX_REQUESTS`.
