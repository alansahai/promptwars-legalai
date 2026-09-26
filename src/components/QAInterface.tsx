import { useState } from "react";
import { QAResult } from "@/types";

interface QAInterfaceProps {
  documentId: string;
  documentContent?: string;
}

interface QAExchange {
  question: string;
  answer: string;
  groundedInDocument: boolean;
}

const SUGGESTED_QUESTIONS = [
  "What are my payment obligations and due dates?",
  "What are the termination conditions and notice periods?",
  "Are there penalties for early exit or breach?",
  "What indemnification liabilities do I assume?",
];

export default function QAInterface({ documentId, documentContent }: QAInterfaceProps) {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<QAExchange[]>([]);
  const [copied, setCopied] = useState(false);

  async function askQuestion(promptText?: string): Promise<void> {
    const q = (promptText || question).trim();
    if (!q) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentId, documentContent, question: q }),
      });
      let body;
      try {
        body = await res.json();
      } catch {
        throw new Error(`Server returned an unexpected response (${res.status}). Please try again.`);
      }
      if (!res.ok || !body.success) {
        throw new Error(body.error || "Failed to get an answer");
      }
      const data = body.data as QAResult;
      setHistory((prev) => [
        ...prev,
        { question: q, answer: data.answer, groundedInDocument: data.groundedInDocument },
      ]);
      setQuestion("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to get an answer");
    } finally {
      setLoading(false);
    }
  }

  function handleCopyTranscript(): void {
    if (history.length === 0) return;
    let text = `# Legal Document Q&A Transcript\n\n`;
    history.forEach((h, idx) => {
      text += `**Q${idx + 1}: ${h.question}**\n${h.answer}\n*(Grounded in document: ${h.groundedInDocument ? "Yes" : "Inferred/Not explicit"})*\n\n`;
    });
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-1">
          Document Q&amp;A Assistant
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Answers are strictly grounded in your uploaded text. If a detail is missing, Gemini will explicitly alert you.
        </p>

        {/* Suggested Quick Prompts */}
        <div className="mb-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Suggested questions to test:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {SUGGESTED_QUESTIONS.map((sq, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setQuestion(sq);
                  void askQuestion(sq);
                }}
                disabled={loading}
                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-700 transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-brand-600 dark:hover:bg-slate-700"
              >
                {sq}
              </button>
            ))}
          </div>
        </div>

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
            placeholder="Ask anything about this document, e.g. What happens if I miss a payment?"
            className="flex-1 rounded-lg border border-slate-300 px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:placeholder-slate-500"
          />
          <button
            type="submit"
            disabled={loading || !question.trim()}
            aria-busy={loading}
            className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 disabled:opacity-50"
          >
            {loading ? "Asking..." : "Ask Question"}
          </button>
        </form>
      </div>

      {error && (
        <div role="alert" className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-xs font-medium text-rose-800 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-200">
          {error}
        </div>
      )}

      <div className="space-y-3" aria-live="polite">
        {history.length > 0 && (
          <div className="flex items-center justify-between pb-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Conversation History ({history.length})
            </h3>
            <button
              type="button"
              onClick={handleCopyTranscript}
              className="text-xs text-brand-600 hover:underline dark:text-brand-400 font-medium"
            >
              {copied ? "Copied Transcript!" : "Copy Transcript"}
            </button>
          </div>
        )}

        {history.map((exchange, i) => (
          <div
            key={i}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm space-y-2 dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex items-start gap-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700 text-[10px] font-bold dark:bg-brand-950 dark:text-brand-300">
                Q
              </span>
              <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">{exchange.question}</p>
            </div>

            <div className="flex items-start gap-2 pl-1">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold dark:bg-emerald-950 dark:text-emerald-300">
                A
              </span>
              <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                <p>{exchange.answer}</p>
                {exchange.groundedInDocument ? (
                  <span className="mt-1.5 inline-flex items-center gap-1 rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                    <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Directly grounded in document text
                  </span>
                ) : (
                  <span className="mt-1.5 inline-flex items-center gap-1 rounded bg-amber-50 px-1.5 py-0.5 text-[10px] font-medium text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                    <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Not explicitly stated in the document
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
