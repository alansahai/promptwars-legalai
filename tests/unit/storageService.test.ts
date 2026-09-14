import storageService from "@/api/services/storageService";

describe("Storage Service", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("saves and retrieves a document", () => {
    const doc = storageService.save("contract.txt", "text/plain", "Hello, contract.");
    const fetched = storageService.get(doc.id);

    expect(fetched?.filename).toBe("contract.txt");
    expect(fetched?.content).toBe("Hello, contract.");
  });

  test("returns undefined for an unknown id", () => {
    expect(storageService.get("does-not-exist")).toBeUndefined();
  });

  test("expires documents older than the TTL", () => {
    const nowSpy = jest.spyOn(Date, "now");
    nowSpy.mockReturnValue(1_000_000);
    const doc = storageService.save("old.txt", "text/plain", "stale content");

    nowSpy.mockReturnValue(1_000_000 + 25 * 60 * 60 * 1000);
    expect(storageService.get(doc.id)).toBeUndefined();
  });

  test("delete() removes a document", () => {
    const doc = storageService.save("temp.txt", "text/plain", "temp content");
    storageService.delete(doc.id);
    expect(storageService.get(doc.id)).toBeUndefined();
  });

  test("size reflects the number of stored documents", () => {
    const before = storageService.size;
    storageService.save("a.txt", "text/plain", "a");
    expect(storageService.size).toBe(before + 1);
  });
});
