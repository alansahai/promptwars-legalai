import pdfParse from "pdf-parse";
import mammoth from "mammoth";

const DOCX_MIME = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

/**
 * Extracts plain text content from an uploaded document buffer based on its
 * MIME type. Supports PDF, DOCX, and plain text.
 */
export async function extractText(buffer: Buffer, mimetype: string): Promise<string> {
  switch (mimetype) {
    case "application/pdf": {
      const parsed = await pdfParse(buffer);
      return parsed.text.trim();
    }
    case DOCX_MIME: {
      const parsed = await mammoth.extractRawText({ buffer });
      return parsed.value.trim();
    }
    case "text/plain":
      return buffer.toString("utf-8").trim();
    default:
      throw new Error(`Unsupported file type: ${mimetype}`);
  }
}

export function previewText(text: string, chars = 400): string {
  if (text.length <= chars) return text;
  return `${text.slice(0, chars)}...`;
}
