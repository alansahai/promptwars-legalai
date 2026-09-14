import { Request, Response, NextFunction } from "express";
import { ALLOWED_MIME_TYPES, MAX_FILE_SIZE } from "@/utils/constants";

export function validateFileUpload(req: Request, res: Response, next: NextFunction): void {
  const file = req.file;

  if (!file) {
    res.status(400).json({ error: "No file provided" });
    return;
  }

  if (file.size > MAX_FILE_SIZE) {
    res.status(413).json({ error: "File too large (max 10MB). Please upload a smaller file." });
    return;
  }

  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    res.status(415).json({ error: "Invalid file type. Supported: PDF, TXT, DOCX" });
    return;
  }

  next();
}

export function validateAnalysisBody(req: Request, res: Response, next: NextFunction): void {
  const { documentContent, documentId, analysisType } = req.body ?? {};
  const validTypes = ["simplify", "risks", "compare", "qa"];

  const hasContent =
    (typeof documentContent === "string" && documentContent.trim().length > 0) ||
    (typeof documentId === "string" && documentId.length > 0);

  if (!hasContent) {
    res.status(400).json({ error: "Provide a valid documentId or non-empty documentContent." });
    return;
  }

  if (!validTypes.includes(analysisType)) {
    res.status(400).json({ error: `analysisType must be one of: ${validTypes.join(", ")}` });
    return;
  }

  next();
}
