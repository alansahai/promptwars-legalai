import type { NextApiRequest, NextApiResponse } from "next";
import { analyzeDocument } from "@/api/services/aiService";
import { resolveContent } from "@/utils/resolveDocumentContent";
import { AnalysisResult } from "@/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AnalysisResult>
): Promise<void> {
  if (req.method !== "POST") {
    res.status(405).json({ success: false, error: "Method not allowed" });
    return;
  }

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
