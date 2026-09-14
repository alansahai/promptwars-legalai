import { useState } from "react";
import DocumentUpload from "./DocumentUpload";
import { CompareResult } from "@/types";

interface ComparisonViewProps {
  documentId: string;
}

export default function ComparisonView({ documentId }: ComparisonViewProps) {
  const [secondDocId, setSecondDocId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CompareResult | null>(null);

  async function runCompare(): Promise<void> {
    if (!secondDocId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentId1: documentId, documentId2: secondDocId }),
      });
      const body = await res.json();
      if (!res.ok || !body.success) {
        throw new Error(body.error || "Comparison failed");
      }
      setResult(body.data as CompareResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Comparison failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <DocumentUpload
        label="Upload a second document to compare against"
        onUploaded={(doc) => setSecondDocId(doc.id)}
      />

      <button
        type="button"
        onClick={() => void runCompare()}
        disabled={!secondDocId || loading}
        aria-busy={loading}
        className="rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 disabled:opacity-50"
      >
        {loading ? "Comparing with Gemini..." : "Compare Documents"}
      </button>

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <div aria-live="polite">
      {result && (
        <div className="space-y-3 rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-700">{result.summary}</p>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[500px] text-left text-sm">
              <caption className="sr-only">Differences between the two uploaded documents</caption>
              <thead>
                <tr className="border-b border-gray-200 text-xs uppercase text-gray-500">
                  <th scope="col" className="py-2 pr-4">Section</th>
                  <th scope="col" className="py-2 pr-4">Document 1</th>
                  <th scope="col" className="py-2 pr-4">Document 2</th>
                  <th scope="col" className="py-2">Impact</th>
                </tr>
              </thead>
              <tbody>
                {result.differences?.map((d, i) => (
                  <tr key={i} className="border-b border-gray-100 align-top">
                    <td className="py-2 pr-4 font-medium">{d.section}</td>
                    <td className="py-2 pr-4 text-gray-600">{d.doc1}</td>
                    <td className="py-2 pr-4 text-gray-600">{d.doc2}</td>
                    <td className="py-2 text-gray-600">{d.impact}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
