import { Request, Response } from "express";
import { extractText, previewText } from "@/api/services/documentService";
import storageService from "@/api/services/storageService";
import { UploadResponseBody } from "@/types";

export async function uploadDocument(
  req: Request,
  res: Response<UploadResponseBody>
): Promise<void> {
  const file = req.file;
  if (!file) {
    res.status(400).json({ success: false, error: "No file provided" });
    return;
  }

  try {
    const content = await extractText(file.buffer, file.mimetype);

    if (!content) {
      res.status(422).json({
        success: false,
        error: "Could not extract any text from this document.",
      });
      return;
    }

    const stored = storageService.save(file.originalname, file.mimetype, content);

    res.status(201).json({
      success: true,
      documentId: stored.id,
      filename: stored.filename,
      characterCount: content.length,
      preview: previewText(content),
    });
  } catch (error) {
    console.error("Upload parsing error:", error);
    res.status(422).json({
      success: false,
      error: "Failed to parse document. Ensure the file is a valid PDF, DOCX, or TXT.",
    });
  }
}

export function getDocument(req: Request, res: Response): void {
  const { id } = req.params;
  if (typeof id !== "string") {
    res.status(400).json({ error: "Invalid document id." });
    return;
  }

  const doc = storageService.get(id);
  if (!doc) {
    res.status(404).json({ error: "Document not found or expired." });
    return;
  }
  res.status(200).json({
    id: doc.id,
    filename: doc.filename,
    characterCount: doc.content.length,
    preview: previewText(doc.content),
  });
}
