import rateLimit from "express-rate-limit";
import { RATE_LIMIT_WINDOW_MS, RATE_LIMIT_MAX_REQUESTS } from "@/utils/constants";

export const analysisLimiter = rateLimit({
  windowMs: RATE_LIMIT_WINDOW_MS,
  max: RATE_LIMIT_MAX_REQUESTS,
  message: { error: "Too many analysis requests. Please try again in a minute." },
  standardHeaders: true,
  legacyHeaders: false,
});

export const uploadLimiter = rateLimit({
  windowMs: RATE_LIMIT_WINDOW_MS,
  max: Math.max(1, Math.floor(RATE_LIMIT_MAX_REQUESTS / 2)),
  message: { error: "Too many upload attempts. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});
