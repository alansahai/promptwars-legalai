import { useRef, useState } from "react";
import { UploadResponseBody } from "@/types";

interface DocumentUploadProps {
  label: string;
  onUploaded: (doc: { id: string; filename: string; preview: string }) => void;
}

export default function DocumentUpload({ label, onUploaded }: DocumentUploadProps) {
  const [status, setStatus] = useState<"idle" | "uploading" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [filename, setFilename] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File): Promise<void> {
    setStatus("uploading");
    setError(null);

    const formData = new FormData();
    formData.append("document", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const body = (await res.json()) as UploadResponseBody;

      if (!res.ok || !body.success || !body.documentId) {
        throw new Error(body.error || "Upload failed");
      }

      setFilename(body.filename || file.name);
      setStatus("idle");
      onUploaded({
        id: body.documentId,
        filename: body.filename || file.name,
        preview: body.preview || "",
      });
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Upload failed");
    }
  }

  return (
    <div className="rounded-lg border-2 border-dashed border-gray-300 p-6 text-center">
      <p className="mb-2 text-sm font-medium text-gray-700">{label}</p>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.txt,.docx"
        aria-label={label}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleFile(file);
        }}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={status === "uploading"}
        aria-busy={status === "uploading"}
        className="rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 disabled:opacity-50"
      >
        {status === "uploading" ? "Uploading..." : filename ? "Change document" : "Choose document"}
      </button>
      <div aria-live="polite">
        {filename && status !== "error" && (
          <p className="mt-2 text-xs text-gray-500">Loaded: {filename}</p>
        )}
        {error && (
          <p role="alert" className="mt-2 text-xs text-red-600">
            {error}
          </p>
        )}
      </div>
      <p className="mt-2 text-xs text-gray-400">PDF, DOCX, or TXT — up to 10MB</p>
    </div>
  );
}
