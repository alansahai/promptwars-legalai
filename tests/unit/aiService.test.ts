const mockGenerateContent = jest.fn();

jest.mock("@google/generative-ai", () => ({
  GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
    getGenerativeModel: () => ({ generateContent: mockGenerateContent }),
  })),
}));

import { analyzeDocument } from "@/api/services/aiService";

describe("AI Service (Gemini)", () => {
  beforeEach(() => {
    process.env.GEMINI_API_KEY = "test-key";
    mockGenerateContent.mockReset();
  });

  test("returns parsed JSON analysis on success", async () => {
    mockGenerateContent.mockResolvedValue({
      response: {
        text: () => JSON.stringify({ summary: "test summary", keyPoints: [], termsDefinitions: {} }),
      },
    });

    const result = await analyzeDocument({
      documentContent: "Some contract text A",
      analysisType: "simplify",
    });

    expect(result.success).toBe(true);
    expect(result.data).toHaveProperty("summary", "test summary");
  });

  test("rejects empty document content without calling Gemini", async () => {
    const result = await analyzeDocument({ documentContent: "   ", analysisType: "simplify" });
    expect(result.success).toBe(false);
    expect(mockGenerateContent).not.toHaveBeenCalled();
  });

  test("handles Gemini API failures gracefully", async () => {
    mockGenerateContent.mockRejectedValue(new Error("network error"));
    const result = await analyzeDocument({
      documentContent: "Some contract text B",
      analysisType: "risks",
    });
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });

  test("falls back to extracting a JSON block if the model adds prose", async () => {
    mockGenerateContent.mockResolvedValue({
      response: {
        text: () => `Here is the analysis:\n${JSON.stringify({ summary: "wrapped" })}\nEnd.`,
      },
    });
    const result = await analyzeDocument({
      documentContent: "Some contract text C",
      analysisType: "simplify",
    });
    expect(result.success).toBe(true);
    expect(result.data).toHaveProperty("summary", "wrapped");
  });

  test("caches repeated identical requests instead of calling Gemini again", async () => {
    mockGenerateContent.mockResolvedValue({
      response: { text: () => JSON.stringify({ raw: "cached-value" }) },
    });
    const req = { documentContent: `Unique cache test ${Math.random()}`, analysisType: "simplify" as const };

    const first = await analyzeDocument(req);
    const second = await analyzeDocument(req);

    expect(first.cached).toBeUndefined();
    expect(second.cached).toBe(true);
    expect(mockGenerateContent).toHaveBeenCalledTimes(1);
  });
});
