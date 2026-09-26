const DOCX_MIME = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

/**
 * Extracts plain text content from an uploaded document buffer based on its
 * MIME type. Supports PDF, DOCX, and plain text.
 * Heavy native/Wasm parsers (pdf-parse, mammoth) are dynamically imported on-demand
 * to drastically reduce serverless cold-start latency and module memory overhead.
 */
export async function extractText(buffer: Buffer, mimetype: string): Promise<string> {
  switch (mimetype) {
    case "application/pdf": {
      const pdfModule = await import("pdf-parse");
      const parse = (pdfModule.default || pdfModule) as unknown as (buf: Buffer) => Promise<{ text: string }>;
      const parsed = await parse(buffer);
      return parsed.text.trim();
    }
    case DOCX_MIME: {
      const mammothModule = await import("mammoth");
      const mammoth = mammothModule.default || mammothModule;
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
