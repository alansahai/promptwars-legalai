import fs from "fs";
import path from "path";
import { extractText, previewText } from "@/api/services/documentService";

describe("Document Service", () => {
  test("extracts text from a plain text buffer", async () => {
    const buffer = fs.readFileSync(path.join(__dirname, "../fixtures/sample_contract.txt"));
    const text = await extractText(buffer, "text/plain");
    expect(text).toContain("RESIDENTIAL LEASE AGREEMENT");
  });

  test("throws for unsupported mime types", async () => {
    await expect(extractText(Buffer.from("data"), "image/png")).rejects.toThrow(
      "Unsupported file type"
    );
  });

  test("previewText truncates long text with an ellipsis", () => {
    const long = "a".repeat(500);
    const preview = previewText(long, 400);
    expect(preview.endsWith("...")).toBe(true);
    expect(preview.length).toBe(403);
  });

  test("previewText returns short text unchanged", () => {
    expect(previewText("short text")).toBe("short text");
  });
});
