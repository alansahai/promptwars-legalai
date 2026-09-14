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
