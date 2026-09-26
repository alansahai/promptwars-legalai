jest.mock("@/api/services/aiService", () => ({
  analyzeDocument: jest.fn().mockResolvedValue({
    success: true,
    data: { summary: "mocked summary", keyPoints: [], termsDefinitions: {} },
  }),
}));

process.env.GEMINI_API_KEY = "test-key";

import path from "path";
import request from "supertest";
import app from "@/api/server";

describe("API Endpoints", () => {
  test("GET /api/health returns ok", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });

  test("POST /api/upload accepts a valid text document", async () => {
    const res = await request(app)
      .post("/api/upload")
      .attach("document", path.join(__dirname, "../fixtures/sample_contract.txt"));

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.documentId).toBeDefined();
  });

  test("POST /api/upload rejects a request with no file", async () => {
    const res = await request(app).post("/api/upload");
    expect(res.status).toBe(400);
  });

  test("POST /api/analyze rejects an invalid analysisType", async () => {
    const res = await request(app)
      .post("/api/analyze")
      .send({ documentContent: "Some contract", analysisType: "nonsense" });
    expect(res.status).toBe(400);
  });

  test("POST /api/analyze succeeds with valid input (simplify)", async () => {
    const res = await request(app)
      .post("/api/analyze")
      .send({ documentContent: "Some contract text", analysisType: "simplify" });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test("POST /api/analyze succeeds with checklist mode", async () => {
    const res = await request(app)
      .post("/api/analyze")
      .send({ documentContent: "Some contract text", analysisType: "checklist" });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test("POST /api/ask requires a non-empty question", async () => {
    const res = await request(app)
      .post("/api/ask")
      .send({ documentContent: "Some contract text" });
    expect(res.status).toBe(400);
  });

  test("POST /api/compare requires both documents", async () => {
    const res = await request(app)
      .post("/api/compare")
      .send({ documentContent1: "Doc A" });
    expect(res.status).toBe(400);
  });

  test("POST /api/compare succeeds with both documents provided", async () => {
    const res = await request(app)
      .post("/api/compare")
      .send({ documentContent1: "Doc A text", documentContent2: "Doc B text" });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test("POST /api/ask succeeds with a valid question", async () => {
    const res = await request(app)
      .post("/api/ask")
      .send({ documentContent: "Some contract text", question: "What is the late fee?" });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test("GET /api/documents/:id returns a previously uploaded document", async () => {
    const uploadRes = await request(app)
      .post("/api/upload")
      .attach("document", path.join(__dirname, "../fixtures/sample_contract.txt"));

    const getRes = await request(app).get(`/api/documents/${uploadRes.body.documentId}`);
    expect(getRes.status).toBe(200);
    expect(getRes.body.filename).toBe("sample_contract.txt");
  });

  test("GET /api/documents/:id returns 404 for an unknown id", async () => {
    const res = await request(app).get("/api/documents/does-not-exist");
    expect(res.status).toBe(404);
  });

  test("malformed JSON bodies are handled by the error handler", async () => {
    const res = await request(app)
      .post("/api/analyze")
      .set("Content-Type", "application/json")
      .send("{ not valid json");
    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(res.body.error).toBeDefined();
  });

  test("unknown routes return 404", async () => {
    const res = await request(app).get("/api/does-not-exist");
    expect(res.status).toBe(404);
  });
});
