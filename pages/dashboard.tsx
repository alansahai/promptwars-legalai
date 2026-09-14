import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import DocumentUpload from "@/components/DocumentUpload";
import AnalysisResult from "@/components/AnalysisResult";
import ComparisonView from "@/components/ComparisonView";
import QAInterface from "@/components/QAInterface";

type Tab = "simplify" | "risks" | "compare" | "qa";

interface Document {
  id: string;
  filename: string;
  preview: string;
}

const TABS: { id: Tab; label: string }[] = [
  { id: "simplify", label: "Simplified Summary" },
  { id: "risks", label: "Risk Analysis" },
  { id: "compare", label: "Compare Documents" },
  { id: "qa", label: "Ask a Question" },
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

  return (
    <>
      <Head>
        <title>Dashboard - Legal AI Assistant</title>
      </Head>
      <main className="mx-auto min-h-screen max-w-4xl px-4 py-10">
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/"
            className="rounded text-sm font-medium text-brand-600 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
          >
            &larr; Back home
          </Link>
          <p className="text-xs text-gray-400">Not legal advice — informational only</p>
        </div>

        <h1 className="mb-6 text-2xl font-bold text-gray-900">Document Analysis</h1>

        {!document ? (
          <DocumentUpload label="Upload a legal document to get started" onUploaded={setDocument} />
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
              <div>
                <p className="text-sm font-semibold text-gray-900">{document.filename}</p>
                <p className="text-xs text-gray-500">{document.preview}</p>
              </div>
              <button
                type="button"
                onClick={() => setDocument(null)}
                className="rounded text-xs font-medium text-brand-600 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
              >
                Upload a different document
              </button>
            </div>

            <div role="tablist" aria-label="Analysis mode" className="flex flex-wrap gap-2 border-b border-gray-200">
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
                  className={`border-b-2 px-3 py-2 text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 ${
                    activeTab === tab.id
                      ? "border-brand-600 text-brand-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div
              id={`panel-${activeTab}`}
              role="tabpanel"
              aria-labelledby={`tab-${activeTab}`}
              tabIndex={0}
            >
              {activeTab === "simplify" && <AnalysisResult documentId={document.id} analysisType="simplify" />}
              {activeTab === "risks" && <AnalysisResult documentId={document.id} analysisType="risks" />}
              {activeTab === "compare" && <ComparisonView documentId={document.id} />}
              {activeTab === "qa" && <QAInterface documentId={document.id} />}
            </div>
          </div>
        )}
      </main>
    </>
  );
}
