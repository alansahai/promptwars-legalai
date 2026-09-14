import { Router } from "express";
import multer from "multer";
import { MAX_FILE_SIZE } from "@/utils/constants";
import { validateFileUpload, validateAnalysisBody } from "@/api/middleware/validation";
import { analysisLimiter, uploadLimiter } from "@/api/middleware/rateLimit";
import { uploadDocument, getDocument } from "@/api/controllers/documentController";
import { analyze, compare, ask } from "@/api/controllers/analysisController";

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: MAX_FILE_SIZE } });

const router = Router();

router.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

router.post("/upload", uploadLimiter, upload.single("document"), validateFileUpload, uploadDocument);
router.get("/documents/:id", getDocument);

router.post("/analyze", analysisLimiter, validateAnalysisBody, analyze);
router.post("/compare", analysisLimiter, compare);
router.post("/ask", analysisLimiter, ask);

export default router;
