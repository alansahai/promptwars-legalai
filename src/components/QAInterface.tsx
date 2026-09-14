import { useState } from "react";
import { QAResult } from "@/types";

interface QAInterfaceProps {
  documentId: string;
}

interface QAExchange {
  question: string;
  answer: string;
  groundedInDocument: boolean;
}

export default function QAInterface({ documentId }: QAInterfaceProps) {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<QAExchange[]>([]);

  async function askQuestion(): Promise<void> {
    if (!question.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentId, question }),
      });
      const body = await res.json();
      if (!res.ok || !body.success) {
        throw new Error(body.error || "Failed to get an answer");
      }
      const data = body.data as QAResult;
      setHistory((prev) => [...prev, { question, answer: data.answer, groundedInDocument: data.groundedInDocument }]);
      setQuestion("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to get an answer");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          void askQuestion();
        }}
      >
        <label htmlFor="qa-question" className="sr-only">
          Ask a question about this document
        </label>
        <input
          id="qa-question"
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="e.g. What happens if I miss a payment?"
          className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-600"
        />
        <button
          type="submit"
          disabled={loading || !question.trim()}
          aria-busy={loading}
          className="rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 disabled:opacity-50"
        >
          {loading ? "Asking..." : "Ask"}
        </button>
      </form>

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="space-y-3" aria-live="polite">
        {history.map((exchange, i) => (
          <div key={i} className="rounded-lg border border-gray-200 p-3">
            <p className="text-sm font-semibold text-gray-900">Q: {exchange.question}</p>
            <p className="mt-1 text-sm text-gray-700">A: {exchange.answer}</p>
            {!exchange.groundedInDocument && (
              <p className="mt-1 text-xs text-amber-600">
                This may not be directly covered in the document.
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
