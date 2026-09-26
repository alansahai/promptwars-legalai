import { CACHE_TTL_MS } from "./constants";
import { AnalysisData } from "@/types";

interface CachedEntry {
  data: AnalysisData;
  timestamp: number;
}

const MAX_CACHE_ENTRIES = 300;

/**
 * High-efficiency, bounded LRU in-memory cache for analysis results.
 * Keyed by a SHA-256 hash of (document content + analysis type + extra context).
 * Prevents memory leaks with bounded capacity, LRU eviction, and TTL pruning.
 */
class AnalysisCache {
  private cache = new Map<string, CachedEntry>();

  get(key: string): AnalysisData | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    // Check TTL expiration
    if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
      this.cache.delete(key);
      return null;
    }

    // Refresh access order for LRU behavior
    this.cache.delete(key);
    this.cache.set(key, entry);

    return entry.data;
  }

  set(key: string, data: AnalysisData): void {
    // If key exists, delete first to reposition at the end
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= MAX_CACHE_ENTRIES) {
      // Evict oldest entry (first key in Map insertion order)
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey !== undefined) {
        this.cache.delete(oldestKey);
      }
    }

    this.cache.set(key, { data, timestamp: Date.now() });
  }

  pruneExpired(): number {
    const now = Date.now();
    let pruned = 0;
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > CACHE_TTL_MS) {
        this.cache.delete(key);
        pruned++;
      }
    }
    return pruned;
  }

  clear(): void {
    this.cache.clear();
  }

  get size(): number {
    return this.cache.size;
  }
}

const analysisCache = new AnalysisCache();
export default analysisCache;
