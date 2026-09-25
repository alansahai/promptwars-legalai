import { useRef, useState } from "react";
import { UploadResponseBody } from "@/types";

interface DocumentUploadProps {
  label: string;
  onUploaded: (doc: { id: string; filename: string; preview: string; content?: string }) => void;
}

const SAMPLE_LEASE = `RESIDENTIAL LEASE AGREEMENT
This Lease Agreement ("Agreement") is entered into between Landlord (Apex Properties LLC) and Tenant (Alex Mercer).

1. TERM & AUTO-RENEWAL: The lease term commences October 1, 2026 and continues for twelve (12) months. The agreement automatically renews on a month-to-month basis unless either party provides sixty (60) days' written notice of non-renewal prior to expiration.
2. RENT & LATE PENALTIES: Tenant shall pay monthly rent of $1,850.00 USD, strictly due on the first (1st) day of each calendar month. A late fee of $95.00 shall be assessed for any payment received after 11:59 PM on the 5th day of the month.
3. SECURITY DEPOSIT: Tenant deposits $1,850.00 as security for damages beyond normal wear and tear. Landlord shall return the deposit, less itemized lawful deductions, within twenty-one (21) days of move-out inspection.
4. MAINTENANCE & REPAIRS: Tenant is liable for all minor repairs and maintenance items under $150.00. Landlord is responsible for major structural, electrical, and plumbing repairs unless caused by tenant negligence. Tenant must report needed repairs in writing within 48 hours.
5. EARLY TERMINATION: Tenant may terminate early only upon providing 60 days' written notice and paying an early termination fee equivalent to two (2) months' rent ($3,700.00).
6. INDEMNIFICATION: Tenant agrees to indemnify, defend, and hold harmless Landlord and its agents from any claims, suits, liabilities, or expenses arising from Tenant's occupancy or use of the premises, except for claims resulting directly from Landlord's proven gross negligence.
7. GOVERNING LAW & ARBITRATION: This Agreement shall be governed by state law. Any disputes exceeding $5,000 shall be resolved via binding private arbitration, with costs split equally between parties.`;

const SAMPLE_SAAS = `SOFTWARE SERVICES & CONSULTING AGREEMENT
This Agreement is entered into by and between Client (OmniCorp Industries) and Provider (Apex Digital Solutions).

1. SCOPE & DELIVERABLES: Provider will deliver customized cloud integration services as detailed in Exhibit A. Any modifications require a mutually signed Change Order.
2. FEES & PAYMENT SCHEDULE: Client will be billed $12,500 monthly. Invoices are payable net-15 days. Unpaid balances accrue interest at 1.5% per month (18% per annum) or the maximum legal rate.
3. INTELLECTUAL PROPERTY RIGHTS: Upon full and final payment of all outstanding invoices, Provider assigns all proprietary rights in custom deliverables to Client. Provider retains exclusive ownership of all pre-existing background code, frameworks, and reusable libraries.
4. NON-SOLICITATION: Client agrees not to solicit, recruit, or hire any of Provider's employees or subcontractors during the term and for twenty-four (24) months following termination. Liquidated damages for breach equal 100% of the employee's annual salary.
5. LIMITATION OF LIABILITY: Neither party shall be liable for indirect, punitive, or consequential damages. Provider's total aggregate liability arising under this agreement is strictly capped at the total amount paid by Client in the three (3) months preceding the incident.
6. DATA PRIVACY & CONFIDENTIALITY: Both parties agree to protect proprietary data with reasonable care. Provider processes personal data solely to execute the services and complies with applicable data protection regulations.`;

export default function DocumentUpload({ label, onUploaded }: DocumentUploadProps) {
  const [mode, setMode] = useState<"file" | "paste">("file");
  const [pastedText, setPastedText] = useState("");
  const [status, setStatus] = useState<"idle" | "uploading" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [filename, setFilename] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
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
        content: body.content,
      });
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Upload failed");
    }
  }

  function handlePasteSubmit(): void {
    const trimmed = pastedText.trim();
    if (!trimmed) {
      setError("Please paste contract or policy text before analyzing.");
      return;
    }
    setError(null);
    const docId = `doc-${Date.now()}`;
    const name = "Pasted Legal Document";
    setFilename(name);
    onUploaded({
      id: docId,
      filename: name,
      preview: trimmed.slice(0, 300) + (trimmed.length > 300 ? "..." : ""),
      content: trimmed,
    });
  }

  function loadSample(title: string, text: string): void {
    setError(null);
    const docId = `doc-${Date.now()}`;
    setFilename(title);
    setPastedText(text);
    onUploaded({
      id: docId,
      filename: title,
      preview: text.slice(0, 300) + (text.length > 300 ? "..." : ""),
      content: text,
    });
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">{label}</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">PDF, DOCX, TXT or direct text input (up to 10MB)</p>
        </div>
        <div className="inline-flex rounded-lg bg-slate-100 p-1 dark:bg-slate-800" role="group" aria-label="Upload mode selection">
          <button
            type="button"
            onClick={() => setMode("file")}
            className={`rounded-md px-3 py-1 text-xs font-medium transition ${
              mode === "file"
                ? "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            Upload File
          </button>
          <button
            type="button"
            onClick={() => setMode("paste")}
            className={`rounded-md px-3 py-1 text-xs font-medium transition ${
              mode === "paste"
                ? "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            Paste Text
          </button>
        </div>
      </div>

      {mode === "file" ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragOver(false);
            const file = e.dataTransfer.files?.[0];
            if (file) void handleFile(file);
          }}
          className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center transition ${
            isDragOver
              ? "border-brand-500 bg-brand-50/50 dark:border-brand-400 dark:bg-brand-950/20"
              : "border-slate-300 bg-slate-50/50 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800/30 dark:hover:bg-slate-800/50"
          }`}
        >
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-brand-600 dark:bg-brand-950 dark:text-brand-400">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>
          <p className="mb-1 text-sm font-medium text-slate-800 dark:text-slate-200">
            Drag and drop your contract or policy here
          </p>
          <p className="mb-4 text-xs text-slate-500 dark:text-slate-400">
            Supported formats: PDF, DOCX, TXT (up to 10MB)
          </p>

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
            className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 disabled:opacity-50"
          >
            {status === "uploading" ? "Uploading..." : filename ? "Change document" : "Choose document"}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <label htmlFor="pasted-legal-text" className="sr-only">
            Paste legal document or clause text
          </label>
          <textarea
            id="pasted-legal-text"
            rows={7}
            value={pastedText}
            onChange={(e) => setPastedText(e.target.value)}
            placeholder="Paste contract terms, non-disclosure agreement, privacy policy, or legal clauses here..."
            className="w-full rounded-lg border border-slate-300 p-3 font-mono text-xs text-slate-800 placeholder-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:placeholder-slate-500"
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {pastedText.length} characters
            </span>
            <button
              type="button"
              onClick={handlePasteSubmit}
              disabled={!pastedText.trim()}
              className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 disabled:opacity-50"
            >
              Analyze Pasted Document
            </button>
          </div>
        </div>
      )}

      {/* Quick Sample Selector for Live Testing */}
      <div className="mt-4 border-t border-slate-100 pt-3 dark:border-slate-800">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Or try an instant sample for live testing:
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => loadSample("Residential Lease Agreement.txt", SAMPLE_LEASE)}
            className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700 transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-brand-600 dark:hover:bg-slate-800"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Residential Lease Agreement
          </button>
          <button
            type="button"
            onClick={() => loadSample("Software Services MSA.txt", SAMPLE_SAAS)}
            className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700 transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-brand-600 dark:hover:bg-slate-800"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
            Software Services MSA
          </button>
        </div>
      </div>

      <div aria-live="polite">
        {filename && status !== "error" && (
          <div className="mt-3 flex items-center gap-2 rounded-md bg-emerald-50 p-2.5 text-xs font-medium text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
            <svg className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Loaded document: <strong>{filename}</strong></span>
          </div>
        )}
        {error && (
          <p role="alert" className="mt-3 rounded-md bg-rose-50 p-2.5 text-xs font-medium text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
