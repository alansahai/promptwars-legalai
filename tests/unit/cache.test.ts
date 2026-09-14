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
});
