import { randomUUID } from "crypto";
import { DOCUMENT_TTL_MS } from "@/utils/constants";
import { StoredDocument } from "@/types";

/**
 * In-memory document store for this POC. Documents are never persisted to
 * disk or a database; they live only in server memory and expire after
 * DOCUMENT_TTL_MS. This is intentional for a legal-document tool: nothing
 * touches long-term storage unless a real database is wired in.
 */
class StorageService {
  private documents = new Map<string, StoredDocument>();

  save(filename: string, mimetype: string, content: string): StoredDocument {
    const doc: StoredDocument = {
      id: randomUUID(),
      filename,
      mimetype,
      content,
      createdAt: Date.now(),
    };
    this.documents.set(doc.id, doc);
    return doc;
  }

  get(id: string): StoredDocument | undefined {
    const doc = this.documents.get(id);
    if (!doc) return undefined;
    if (Date.now() - doc.createdAt > DOCUMENT_TTL_MS) {
      this.documents.delete(id);
      return undefined;
    }
    return doc;
  }

  delete(id: string): void {
    this.documents.delete(id);
  }

  get size(): number {
    return this.documents.size;
  }
}

const storageService = new StorageService();
export default storageService;
