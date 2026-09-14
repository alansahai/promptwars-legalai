import { buildPrompt } from "@/utils/prompts";

describe("buildPrompt", () => {
  test("simplify prompt includes the document and expected JSON keys", () => {
    const prompt = buildPrompt({ documentContent: "Sample clause text", analysisType: "simplify" });
    expect(prompt).toContain("Sample clause text");
    expect(prompt).toContain("summary");
    expect(prompt).toContain("keyPoints");
  });

  test("risks prompt requests severity fields", () => {
    const prompt = buildPrompt({ documentContent: "Sample clause text", analysisType: "risks" });
    expect(prompt).toContain("obligations");
    expect(prompt).toContain("high|medium|low");
  });

  test("compare prompt includes both documents", () => {
    const prompt = buildPrompt({
      documentContent: "Document A text",
      analysisType: "compare",
      additionalContext: "Document B text",
    });
    expect(prompt).toContain("Document A text");
    expect(prompt).toContain("Document B text");
  });

  test("qa prompt includes the user's question", () => {
    const prompt = buildPrompt({
      documentContent: "Sample clause text",
      analysisType: "qa",
      additionalContext: "What is the penalty for late payment?",
    });
    expect(prompt).toContain("What is the penalty for late payment?");
  });

  test("truncates very long documents", () => {
    const longDoc = "x".repeat(60000);
    const prompt = buildPrompt({ documentContent: longDoc, analysisType: "simplify" });
    expect(prompt).toContain("[...document truncated for length...]");
  });
});
