import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import DocumentUpload from "@/components/DocumentUpload";
import AnalysisResult from "@/components/AnalysisResult";
import ComparisonView from "@/components/ComparisonView";
import QAInterface from "@/components/QAInterface";

type Tab = "simplify" | "risks" | "checklist" | "compare" | "qa";

interface Document {
  id: string;
  filename: string;
  preview: string;
  content?: string;
}

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "simplify", label: "Simplified Summary", icon: "document-text" },
  { id: "risks", label: "Risk & Obligation Audit", icon: "shield-exclamation" },
  { id: "checklist", label: "Checklist & Lawyer Prep", icon: "clipboard-check" },
  { id: "compare", label: "Compare Documents", icon: "scale" },
  { id: "qa", label: "Ask a Question", icon: "chat-bubble-left-right" },
];

export default function Dashboard() {
  const [document, setDocument] = useState<Document | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("simplify");

  function handleTabKeyDown(e: React.KeyboardEvent<HTMLButtonElement>, index: number): void {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const nextIndex =
      e.key === "ArrowRight" ? (index + 1) % TABS.length : (index - 1 + TABS.length) % TABS.length;
    setActiveTab(TABS[nextIndex].id);
    // `window.document` (not the local `document` state variable above) is the DOM document.
    window.document.getElementById(`tab-${TABS[nextIndex].id}`)?.focus();
  }

  const wordCount = document?.content
    ? document.content.trim().split(/\s+/).filter(Boolean).length
    : document?.preview
    ? document.preview.trim().split(/\s+/).filter(Boolean).length
    : 0;

  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <>
      <Head>
        <title>Dashboard - Legal AI Assistant</title>
        <meta
          name="description"
          content="Analyze legal contracts, spot risks, generate checklists, and compare clauses with Gemini."
        />
      </Head>

      <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        {/* Header Bar */}
        <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 sticky top-0 z-20 shadow-xs">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="flex items-center gap-2 rounded-lg text-sm font-semibold text-slate-900 hover:text-brand-600 dark:text-slate-100 dark:hover:text-brand-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-600"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white font-bold text-sm shadow-xs">
                  §
                </span>
                <span>Legal AI Assistant</span>
              </Link>
              <span className="hidden sm:inline-block rounded-full bg-brand-50 px-2.5 py-0.5 text-[11px] font-semibold text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                Gemini 2.5 Flash
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[11px] text-slate-500 hidden sm:inline">
                Informational Legal Access POC
              </span>
              <Link
                href="/"
                className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-600"
              >
                &larr; Home
              </Link>
            </div>
          </div>
        </header>

        {/* Legal Boundary Notice Banner */}
        <div className="border-b border-amber-200 bg-amber-50/80 px-4 py-2 text-center text-xs text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-300">
          <span className="font-semibold">Notice:</span> This assistant provides automated document analysis to improve legal accessibility. It does not provide legal advice or create an attorney-client relationship.
        </div>

        <main className="mx-auto max-w-5xl px-4 py-8">
          <div className="mb-6 flex flex-wrap items-baseline justify-between gap-2">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                Document Intelligence
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Upload or paste contracts, terms, and agreements for comprehensive AI-assisted analysis.
              </p>
            </div>
          </div>

          {!document ? (
            <DocumentUpload
              label="Select or upload a legal document to begin analysis"
              onUploaded={setDocument}
            />
          ) : (
            <div className="space-y-6">
              {/* Active Document Card */}
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-400">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{document.filename}</p>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span>{wordCount} words</span>
                      <span>•</span>
                      <span>~{readingTime} min read</span>
                      <span>•</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-medium">Ready for AI analysis</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setDocument(null)}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-600"
                >
                  Upload different document
                </button>
              </div>

              {/* Navigation Tabs (ARIA compliant) */}
              <div
                role="tablist"
                aria-label="Analysis mode"
                className="flex overflow-x-auto gap-1 border-b border-slate-200 dark:border-slate-800 pb-px"
              >
                {TABS.map((tab, index) => (
                  <button
                    key={tab.id}
                    id={`tab-${tab.id}`}
                    role="tab"
                    type="button"
                    aria-selected={activeTab === tab.id}
                    aria-controls={`panel-${tab.id}`}
                    tabIndex={activeTab === tab.id ? 0 : -1}
                    onClick={() => setActiveTab(tab.id)}
                    onKeyDown={(e) => handleTabKeyDown(e, index)}
                    className={`shrink-0 border-b-2 px-3.5 py-2.5 text-xs font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 ${
                      activeTab === tab.id
                        ? "border-brand-600 text-brand-600 dark:border-brand-400 dark:text-brand-400"
                        : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Panels */}
              <div
                id={`panel-${activeTab}`}
                role="tabpanel"
                aria-labelledby={`tab-${activeTab}`}
                tabIndex={0}
                className="focus-visible:outline-none"
              >
                {activeTab === "simplify" && (
                  <AnalysisResult
                    documentId={document.id}
                    documentContent={document.content}
                    analysisType="simplify"
                  />
                )}
                {activeTab === "risks" && (
                  <AnalysisResult
                    documentId={document.id}
                    documentContent={document.content}
                    analysisType="risks"
                  />
                )}
                {activeTab === "checklist" && (
                  <AnalysisResult
                    documentId={document.id}
                    documentContent={document.content}
                    analysisType="checklist"
                  />
                )}
                {activeTab === "compare" && (
                  <ComparisonView
                    documentId={document.id}
                    documentContent={document.content}
                  />
                )}
                {activeTab === "qa" && (
                  <QAInterface
                    documentId={document.id}
                    documentContent={document.content}
                  />
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
