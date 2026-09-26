import { Request, Response, NextFunction } from "express";
import { validateFileUpload, validateAnalysisBody } from "@/api/middleware/validation";
import { MAX_FILE_SIZE } from "@/utils/constants";

describe("Validation Middleware", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let nextFn: NextFunction;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });
    mockRes = {
      status: statusMock,
    };
    nextFn = jest.fn();
  });

  describe("validateFileUpload", () => {
    test("returns 400 when no file is present", () => {
      mockReq = {};
      validateFileUpload(mockReq as Request, mockRes as Response, nextFn);
      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ error: "No file provided" });
      expect(nextFn).not.toHaveBeenCalled();
    });

    test("returns 413 when file exceeds MAX_FILE_SIZE", () => {
      mockReq = {
        file: {
          size: MAX_FILE_SIZE + 1024,
          mimetype: "text/plain",
        } as Express.Multer.File,
      };
      validateFileUpload(mockReq as Request, mockRes as Response, nextFn);
      expect(statusMock).toHaveBeenCalledWith(413);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({ error: expect.stringContaining("File too large") })
      );
      expect(nextFn).not.toHaveBeenCalled();
    });

    test("returns 415 when file has unsupported mimetype", () => {
      mockReq = {
        file: {
          size: 1024,
          mimetype: "image/jpeg",
        } as Express.Multer.File,
      };
      validateFileUpload(mockReq as Request, mockRes as Response, nextFn);
      expect(statusMock).toHaveBeenCalledWith(415);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({ error: expect.stringContaining("Invalid file type") })
      );
      expect(nextFn).not.toHaveBeenCalled();
    });

    test("calls next() for valid upload", () => {
      mockReq = {
        file: {
          size: 2048,
          mimetype: "application/pdf",
        } as Express.Multer.File,
      };
      validateFileUpload(mockReq as Request, mockRes as Response, nextFn);
      expect(nextFn).toHaveBeenCalled();
      expect(statusMock).not.toHaveBeenCalled();
    });
  });

  describe("validateAnalysisBody", () => {
    test("returns 400 when both documentContent and documentId are missing", () => {
      mockReq = {
        body: { analysisType: "simplify" },
      };
      validateAnalysisBody(mockReq as Request, mockRes as Response, nextFn);
      expect(statusMock).toHaveBeenCalledWith(400);
      expect(nextFn).not.toHaveBeenCalled();
    });

    test("returns 400 when analysisType is invalid", () => {
      mockReq = {
        body: { documentContent: "Valid legal text", analysisType: "invalid_mode" },
      };
      validateAnalysisBody(mockReq as Request, mockRes as Response, nextFn);
      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({ error: expect.stringContaining("analysisType must be one of") })
      );
      expect(nextFn).not.toHaveBeenCalled();
    });

    test("calls next() when documentContent and analysisType are valid", () => {
      mockReq = {
        body: { documentContent: "Valid legal clause text", analysisType: "checklist" },
      };
      validateAnalysisBody(mockReq as Request, mockRes as Response, nextFn);
      expect(nextFn).toHaveBeenCalled();
      expect(statusMock).not.toHaveBeenCalled();
    });

    test("calls next() when documentId and analysisType are valid", () => {
      mockReq = {
        body: { documentId: "doc-12345", analysisType: "risks" },
      };
      validateAnalysisBody(mockReq as Request, mockRes as Response, nextFn);
      expect(nextFn).toHaveBeenCalled();
      expect(statusMock).not.toHaveBeenCalled();
    });
  });
});
