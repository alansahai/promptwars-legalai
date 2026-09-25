import type { NextApiRequest, NextApiResponse } from "next";
import multer from "multer";
import { runMiddleware, ExpressStyleMiddleware } from "@/utils/runMiddleware";
import { ALLOWED_MIME_TYPES, MAX_FILE_SIZE } from "@/utils/constants";
import { extractText, previewText } from "@/api/services/documentService";
import storageService from "@/api/services/storageService";
import { UploadResponseBody } from "@/types";

export const config = {
  api: { bodyParser: false },
};

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: MAX_FILE_SIZE } });

interface RequestWithFile extends NextApiRequest {
  file?: Express.Multer.File;
}

export default async function handler(
  req: RequestWithFile,
  res: NextApiResponse<UploadResponseBody>
): Promise<void> {
  if (req.method !== "POST") {
    res.status(405).json({ success: false, error: "Method not allowed" });
    return;
  }

  try {
    await runMiddleware(req, res, upload.single("document") as unknown as ExpressStyleMiddleware);
  } catch {
    res.status(413).json({ success: false, error: "File too large (max 10MB)." });
    return;
  }

  const file = req.file;
  if (!file) {
    res.status(400).json({ success: false, error: "No file provided" });
    return;
  }

  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    res.status(415).json({ success: false, error: "Invalid file type. Supported: PDF, TXT, DOCX" });
    return;
  }

  try {
    const content = await extractText(file.buffer, file.mimetype);
    if (!content) {
      res
        .status(422)
        .json({ success: false, error: "Could not extract any text from this document." });
      return;
    }

    const stored = storageService.save(file.originalname, file.mimetype, content);

    res.status(201).json({
      success: true,
      documentId: stored.id,
      filename: stored.filename,
      characterCount: content.length,
      preview: previewText(content),
      content,
    });
  } catch (error) {
    console.error("Upload parsing error:", error);
    res.status(422).json({
      success: false,
      error: "Failed to parse document. Ensure the file is a valid PDF, DOCX, or TXT.",
    });
  }
}
