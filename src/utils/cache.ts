import { CACHE_TTL_MS } from "./constants";
import { AnalysisData } from "@/types";

interface CachedEntry {
  data: AnalysisData;
  timestamp: number;
}

/**
 * In-memory cache for analysis results, keyed by a hash of
 * (document content + analysis type + extra context). Avoids paying for
 * duplicate Gemini calls on identical requests within the TTL window.
 */
class AnalysisCache {
  private cache = new Map<string, CachedEntry>();

  get(key: string): AnalysisData | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
      this.cache.delete(key);
      return null;
    }
    return entry.data;
  }

  set(key: string, data: AnalysisData): void {
    this.cache.set(key, { data, timestamp: Date.now() });
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
