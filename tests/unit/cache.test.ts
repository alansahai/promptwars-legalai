import analysisCache from "@/utils/cache";

describe("AnalysisCache", () => {
  afterEach(() => {
    analysisCache.clear();
    jest.restoreAllMocks();
  });

  test("returns null for a key that was never set", () => {
    expect(analysisCache.get("missing-key")).toBeNull();
  });

  test("stores and retrieves a value", () => {
    analysisCache.set("key-1", { raw: "hello" });
    expect(analysisCache.get("key-1")).toEqual({ raw: "hello" });
    expect(analysisCache.size).toBe(1);
  });

  test("expires entries older than the TTL", () => {
    const nowSpy = jest.spyOn(Date, "now");
    nowSpy.mockReturnValue(1_000_000);
    analysisCache.set("key-2", { raw: "expiring" });

    nowSpy.mockReturnValue(1_000_000 + 60 * 60 * 1000 + 1);
    expect(analysisCache.get("key-2")).toBeNull();
  });

  test("clear() empties the cache", () => {
    analysisCache.set("key-3", { raw: "value" });
    analysisCache.clear();
    expect(analysisCache.size).toBe(0);
  });

  test("pruneExpired() removes stale items and returns count", () => {
    const nowSpy = jest.spyOn(Date, "now");
    nowSpy.mockReturnValue(1_000_000);
    analysisCache.set("stale-1", { raw: "stale" });
    analysisCache.set("fresh-1", { raw: "fresh" });

    nowSpy.mockReturnValue(1_000_000 + 60 * 60 * 1000 + 10);
    analysisCache.set("fresh-2", { raw: "fresh2" });

    const pruned = analysisCache.pruneExpired();
    expect(pruned).toBe(2);
    expect(analysisCache.get("fresh-2")).toEqual({ raw: "fresh2" });
  });

  test("evicts oldest entry when MAX_CACHE_ENTRIES is exceeded", () => {
    // Fill to 300 entries
    for (let i = 0; i < 300; i++) {
      analysisCache.set(`key-${i}`, { raw: `value-${i}` });
    }
    expect(analysisCache.size).toBe(300);
    expect(analysisCache.get("key-0")).toEqual({ raw: "value-0" });

    // Adding 301st entry triggers eviction of oldest
    analysisCache.set("key-301", { raw: "value-301" });
    expect(analysisCache.size).toBe(300);
  });
});
