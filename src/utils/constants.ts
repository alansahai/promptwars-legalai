export const MAX_FILE_SIZE = Number(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024; // 10MB

export const ALLOWED_MIME_TYPES = (
  process.env.ALLOWED_FILE_TYPES ||
  "application/pdf,text/plain,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
).split(",");

export const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

export const RATE_LIMIT_WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS) || 60 * 1000;

export const RATE_LIMIT_MAX_REQUESTS = Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 10;

export const CACHE_TTL_MS = Number(process.env.CACHE_TTL) || 60 * 60 * 1000; // 1 hour

// Documents longer than this are truncated before being sent to the model,
// to keep prompts within token limits and control cost.
export const MAX_DOCUMENT_CHARS = 50_000;

export const DOCUMENT_TTL_MS = 24 * 60 * 60 * 1000; // in-memory documents expire after 24h
