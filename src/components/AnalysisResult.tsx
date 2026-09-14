import { useState } from "react";
import { AnalysisData, RisksResult, SimplifyResult, Severity } from "@/types";

interface AnalysisResultProps {
  documentId: string;
  analysisType: "simplify" | "risks";
}

const SEVERITY_STYLES: Record<Severity, string> = {
  high: "bg-red-100 text-red-800 border-red-300",
  medium: "bg-amber-100 text-amber-800 border-amber-300",
  low: "bg-green-100 text-green-800 border-green-300",
};

function isSimplifyResult(data: AnalysisData): data is SimplifyResult {
  return typeof (data as SimplifyResult).summary === "string";
}

function isRisksResult(data: AnalysisData): data is RisksResult {
  return Array.isArray((data as RisksResult).risks);
}

function isRawFallback(data: AnalysisData): data is { raw: string } {
  return typeof (data as { raw: string }).raw === "string";
}

export default function AnalysisResult({ documentId, analysisType }: AnalysisResultProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AnalysisData | null>(null);

  async function runAnalysis(): Promise<void> {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentId, analysisType }),
      });
      const body = await res.json();
      if (!res.ok || !body.success) {
        throw new Error(body.error || "Analysis failed");
      }
      setData(body.data as AnalysisData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setLoading(false);
    }
  }

  function exportMarkdown(): void {
    if (!data) return;
    const md = `# ${analysisType === "simplify" ? "Simplified Summary" : "Risk Analysis"}\n\n${JSON.stringify(
      data,
      null,
      2
    )}`;
    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${analysisType}-analysis.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={() => void runAnalysis()}
        disabled={loading}
        aria-busy={loading}
        className="rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 disabled:opacity-50"
      >
        {loading ? "Analyzing with Gemini..." : `Run ${analysisType === "simplify" ? "Simplification" : "Risk Analysis"}`}
      </button>

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <div aria-live="polite">
      {data && isSimplifyResult(data) && (
        <div className="space-y-3 rounded-lg border border-gray-200 p-4">
          <div>
            <h3 className="font-semibold text-gray-900">Summary</h3>
            <p className="text-sm text-gray-700">{data.summary}</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Key Points</h3>
            <ul className="list-disc pl-5 text-sm text-gray-700">
              {data.keyPoints?.map((point, i) => (
                <li key={i}>{point}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Terms Defined</h3>
            <dl className="text-sm text-gray-700">
              {Object.entries(data.termsDefinitions || {}).map(([term, def]) => (
                <div key={term} className="mb-1">
                  <dt className="font-medium">{term}</dt>
                  <dd className="pl-3 text-gray-600">{def}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      )}

      {data && isRisksResult(data) && (
        <div className="space-y-4 rounded-lg border border-gray-200 p-4">
          <Section title="Obligations" items={data.obligations} />
          <Section title="Risks" items={data.risks} />
          <div>
            <h3 className="font-semibold text-gray-900">Ambiguities</h3>
            <ul className="list-disc pl-5 text-sm text-gray-700">
              {data.ambiguities?.map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {data && isRawFallback(data) && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm text-amber-800">
            Gemini returned a response that could not be parsed into structured fields, so here is
            the raw output:
          </p>
          <pre className="mt-2 whitespace-pre-wrap text-xs text-gray-700">{data.raw}</pre>
        </div>
      )}
      </div>

      {data && (
        <button
          type="button"
          onClick={exportMarkdown}
          className="text-sm font-medium text-brand-600 underline hover:text-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
        >
          Export as Markdown
        </button>
      )}
    </div>
  );
}

function Section({ title, items }: { title: string; items: { item: string; severity: Severity }[] }) {
  return (
    <div>
      <h3 className="font-semibold text-gray-900">{title}</h3>
      <ul className="space-y-1">
        {items?.map((entry, i) => (
          <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
            <span className={`rounded border px-2 py-0.5 text-xs font-medium ${SEVERITY_STYLES[entry.severity]}`}>
              {entry.severity}
            </span>
            {entry.item}
          </li>
        ))}
      </ul>
    </div>
  );
}
