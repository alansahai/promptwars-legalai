import storageService from "@/api/services/storageService";

/** Resolves document text either from a stored documentId or raw text in the request body. */
export function resolveContent(
  body: Record<string, unknown>,
  idField: string,
  contentField: string
): string | null {
  const documentId = body[idField];
  if (typeof documentId === "string" && documentId) {
    const doc = storageService.get(documentId);
    if (doc && doc.content) {
      return doc.content;
    }
  }
  const content = body[contentField];
  return typeof content === "string" && content.trim() ? content : null;
}
