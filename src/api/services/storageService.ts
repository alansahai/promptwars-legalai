import { randomUUID } from "crypto";
import { DOCUMENT_TTL_MS } from "@/utils/constants";
import { StoredDocument } from "@/types";

const MAX_STORED_DOCS = 100;

/**
 * In-memory document store with bounded capacity and TTL-based pruning.
 * Documents are never persisted to disk or external databases; they live
 * only in volatile server memory and expire after DOCUMENT_TTL_MS.
 * Employs LRU eviction to prevent memory bloat in high-throughput environments.
 */
class StorageService {
  private documents = new Map<string, StoredDocument>();

  save(filename: string, mimetype: string, content: string): StoredDocument {
    this.pruneExpired();

    // Enforce capacity limit (evict oldest if full)
    if (this.documents.size >= MAX_STORED_DOCS) {
      const oldestKey = this.documents.keys().next().value;
      if (oldestKey !== undefined) {
        this.documents.delete(oldestKey);
      }
    }

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
    // Refresh access order (LRU)
    this.documents.delete(id);
    this.documents.set(id, doc);
    return doc;
  }

  delete(id: string): void {
    this.documents.delete(id);
  }

  pruneExpired(): number {
    const now = Date.now();
    let count = 0;
    for (const [id, doc] of this.documents.entries()) {
      if (now - doc.createdAt > DOCUMENT_TTL_MS) {
        this.documents.delete(id);
        count++;
      }
    }
    return count;
  }

  get size(): number {
    return this.documents.size;
  }
}

const storageService = new StorageService();
export default storageService;
