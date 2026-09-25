import { Request, Response } from "express";
import { analyzeDocument } from "@/api/services/aiService";
import { resolveContent } from "@/utils/resolveDocumentContent";
import { AnalysisResult } from "@/types";

export async function analyze(req: Request, res: Response<AnalysisResult>): Promise<void> {
  const body = req.body ?? {};
  const analysisType = body.analysisType as "simplify" | "risks" | "checklist" | undefined;

  if (analysisType !== "simplify" && analysisType !== "risks" && analysisType !== "checklist") {
    res.status(400).json({ success: false, error: "analysisType must be 'simplify', 'risks', or 'checklist'." });
    return;
  }

  const documentContent = resolveContent(body, "documentId", "documentContent");
  if (!documentContent) {
    res.status(400).json({ success: false, error: "Provide a valid documentId or documentContent." });
    return;
  }

  const result = await analyzeDocument({ documentContent, analysisType });
  res.status(result.success ? 200 : 502).json(result);
}

export async function compare(req: Request, res: Response<AnalysisResult>): Promise<void> {
  const body = req.body ?? {};

  const documentContent = resolveContent(body, "documentId1", "documentContent1");
  const additionalContext = resolveContent(body, "documentId2", "documentContent2");

  if (!documentContent || !additionalContext) {
    res.status(400).json({
      success: false,
      error: "Provide both documents (documentId1/documentId2 or documentContent1/documentContent2).",
    });
    return;
  }

  const result = await analyzeDocument({ documentContent, analysisType: "compare", additionalContext });
  res.status(result.success ? 200 : 502).json(result);
}

export async function ask(req: Request, res: Response<AnalysisResult>): Promise<void> {
  const body = req.body ?? {};
  const question = body.question;

  if (typeof question !== "string" || !question.trim()) {
    res.status(400).json({ success: false, error: "A non-empty 'question' is required." });
    return;
  }

  const documentContent = resolveContent(body, "documentId", "documentContent");
  if (!documentContent) {
    res.status(400).json({ success: false, error: "Provide a valid documentId or documentContent." });
    return;
  }

  const result = await analyzeDocument({ documentContent, analysisType: "qa", additionalContext: question });
  res.status(result.success ? 200 : 502).json(result);
}
