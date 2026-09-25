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
