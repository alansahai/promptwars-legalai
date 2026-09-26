import { resolveContent } from "@/utils/resolveDocumentContent";
import storageService from "@/api/services/storageService";

describe("resolveDocumentContent", () => {
  afterEach(() => {
    // Clean up any saved test documents
  });

  test("resolves content from storageService when a valid documentId is provided", () => {
    const stored = storageService.save("test.txt", "text/plain", "Lease agreement text content");
    const result = resolveContent(
      { documentId: stored.id },
      "documentId",
      "documentContent"
    );
    expect(result).toBe("Lease agreement text content");
  });

  test("falls back to documentContent when documentId is not in storageService (serverless cold start)", () => {
    const result = resolveContent(
      { documentId: "ephemeral-nonexistent-id", documentContent: "Fallback contract text" },
      "documentId",
      "documentContent"
    );
    expect(result).toBe("Fallback contract text");
  });

  test("resolves directly from documentContent when documentId is missing", () => {
    const result = resolveContent(
      { documentContent: "Direct contract body without id" },
      "documentId",
      "documentContent"
    );
    expect(result).toBe("Direct contract body without id");
  });

  test("returns null when neither documentId nor documentContent is provided", () => {
    const result = resolveContent({}, "documentId", "documentContent");
    expect(result).toBeNull();
  });

  test("returns null when documentContent is only whitespace and documentId does not exist", () => {
    const result = resolveContent(
      { documentId: "invalid-id", documentContent: "   " },
      "documentId",
      "documentContent"
    );
    expect(result).toBeNull();
  });

  test("handles custom idField and contentField keys (e.g. documentId1 and documentContent1)", () => {
    const result = resolveContent(
      { documentId1: "missing", documentContent1: "Doc 1 text" },
      "documentId1",
      "documentContent1"
    );
    expect(result).toBe("Doc 1 text");
  });
});
