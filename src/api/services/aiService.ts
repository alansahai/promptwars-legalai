import { createHash } from "crypto";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GEMINI_MODEL } from "@/utils/constants";
import { buildPrompt } from "@/utils/prompts";
import analysisCache from "@/utils/cache";
import { AnalysisRequest, AnalysisResult, AnalysisData } from "@/types";

let client: GoogleGenerativeAI | null = null;

function getClient(): GoogleGenerativeAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not set");
  }
  if (!client) {
    client = new GoogleGenerativeAI(apiKey);
  }
  return client;
}

function cacheKey(request: AnalysisRequest): string {
  return createHash("sha256")
    .update(request.analysisType)
    .update("::")
    .update(request.documentContent)
    .update("::")
    .update(request.additionalContext || "")
    .digest("hex");
}

/**
 * Calls the Gemini API to analyze a legal document. Results for identical
 * (document, analysisType, context) triples are cached for CACHE_TTL_MS to
 * avoid redundant API calls and reduce latency/cost.
 */
export async function analyzeDocument(request: AnalysisRequest): Promise<AnalysisResult> {
  if (!request.documentContent || !request.documentContent.trim()) {
    return { success: false, error: "Document content is empty." };
  }

  const key = cacheKey(request);
  const cached = analysisCache.get(key);
  if (cached) {
    return { success: true, data: cached, cached: true };
  }

  try {
    const prompt = buildPrompt(request);
    const model = getClient().getGenerativeModel({
      model: GEMINI_MODEL,
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.2,
        maxOutputTokens: 2048,
      },
    });

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const parsed = parseJSONResponse(responseText);

    analysisCache.set(key, parsed);
    return { success: true, data: parsed };
  } catch (error) {
    console.error("Gemini analysis error:", error);
    return {
      success: false,
      error: "Failed to analyze document. Please try again.",
    };
  }
}

function parseJSONResponse(text: string): AnalysisData {
  try {
    return JSON.parse(text) as AnalysisData;
  } catch {
    // Fall back to extracting the first {...} block, in case the model
    // wrapped the JSON in prose or markdown fences despite instructions.
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]) as AnalysisData;
      } catch {
        console.warn("Failed to parse extracted JSON block from Gemini response");
      }
    }
    return { raw: text };
  }
}
