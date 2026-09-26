import Head from "next/head";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Head>
        <title>Legal AI Assistant - Accessible Legal Intelligence</title>
        <meta
          name="description"
          content="GenAI-powered platform to simplify legal documents, audit risks, prepare action checklists, and compare contracts."
        />
      </Head>

      <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        {/* Skip to Main Content Link for Accessibility (WCAG 2.4.1) */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-brand-600 focus:px-4 focus:py-2 focus:text-xs focus:font-semibold focus:text-white focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-brand-400"
        >
          Skip to main content
        </a>

        {/* Navigation */}
        <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-30 dark:border-slate-800/80 dark:bg-slate-900/80">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white font-bold text-base shadow-sm">
                §
              </span>
              <div>
                <span className="font-bold text-sm tracking-tight text-slate-900 dark:text-slate-100">
                  Legal AI Assistant
                </span>
                <span className="ml-2 rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-semibold text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                  Gemini 2.5 Flash
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="#architecture"
                className="hidden sm:inline-block text-xs font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 transition"
              >
                Architecture
              </a>
              <Link
                href="/dashboard"
                className="rounded-lg bg-brand-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-600"
              >
                Launch Assistant &rarr;
              </Link>
            </div>
          </div>
        </header>

        <main id="main-content">
          {/* Hero Section */}
        <section className="relative overflow-hidden px-4 pt-16 pb-20 sm:px-6 lg:pt-24 lg:pb-28">
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50/80 px-3.5 py-1 text-xs font-semibold text-brand-700 dark:border-brand-900 dark:bg-brand-950/60 dark:text-brand-300 mb-6">
              <span className="flex h-2 w-2 rounded-full bg-brand-600 animate-pulse" />
              PromptWars: AI for Legal Assistance &amp; Access
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl dark:text-white">
              Demystify Legal Contracts with{" "}
              <span className="bg-gradient-to-r from-brand-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
                Generative AI
              </span>
            </h1>

            <p className="mt-6 text-base sm:text-lg leading-relaxed text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Empowering consumers, freelancers, and businesses to understand complex legal documents, audit hidden red flags, compare versions, and prepare targeted questions for an attorney.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/dashboard"
                className="rounded-xl bg-brand-600 px-6 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
              >
                Try Document Analysis Free &rarr;
              </Link>
              <a
                href="#features"
                className="rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Explore Capabilities
              </a>
            </div>

            {/* Quick Guarantees Pill Bar */}
            <div className="mt-12 grid grid-cols-2 gap-3 text-left sm:grid-cols-4 max-w-3xl mx-auto">
              <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100">🔒 100% In-Memory</p>
                <p className="mt-0.5 text-[11px] text-slate-500">Zero persistent document storage</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100">⚡ Gemini 2.5 Flash</p>
                <p className="mt-0.5 text-[11px] text-slate-500">Sub-second structured analysis</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100">🎯 Zero Hallucination</p>
                <p className="mt-0.5 text-[11px] text-slate-500">Strictly grounded in provided text</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100">♿ WCAG 2.1 AA</p>
                <p className="mt-0.5 text-[11px] text-slate-500">Keyboard &amp; screen reader ready</p>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section id="features" className="border-t border-slate-200 bg-white py-16 dark:border-slate-800 dark:bg-slate-900/50">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-xs font-bold uppercase tracking-wider text-brand-600">Core Capabilities</h2>
              <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                Everything You Need Before Signing
              </p>
              <p className="mt-2 text-xs text-slate-500">
                Mapped directly to the PromptWars evaluation parameters and real-world legal assistance workflows.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <FeatureCard
                icon="📖"
                title="Plain-English Simplification"
                description="Translates complex legalese into clear, conversational summaries. Automatically extracts and defines dense terminology."
              />
              <FeatureCard
                icon="🛡️"
                title="Risk & Obligation Audit"
                description="Flags one-sided clauses, harsh indemnities, and ambiguous terms. Classifies obligations by high, medium, and low severity."
              />
              <FeatureCard
                icon="📋"
                title="Action Plan & Lawyer Prep"
                description="Generates an interactive compliance checklist, tactical negotiation options, and specific questions to ask an attorney."
              />
              <FeatureCard
                icon="⚖️"
                title="Side-by-Side Comparison"
                description="Performs substantive clause-by-clause diffs between two contract revisions, explaining legal impact in plain language."
              />
              <FeatureCard
                icon="💬"
                title="Grounded Document Q&A"
                description="Ask specific questions about penalties, auto-renewals, or termination. Explicitly alerts when a point is not covered."
              />
              <FeatureCard
                icon="📤"
                title="Export & Reporting"
                description="Download complete analyses as formatted Markdown reports or copy directly to clipboard for your records or counsel."
              />
            </div>
          </div>
        </section>

        {/* Architecture Section */}
        <section id="architecture" className="border-t border-slate-200 py-16 dark:border-slate-800">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <div className="text-center mb-10">
              <h2 className="text-xs font-bold uppercase tracking-wider text-brand-600">GenAI Architecture</h2>
              <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Engineered for Reliability &amp; Precision
              </p>
              <p className="mt-2 text-xs text-slate-500">
                Transparent mapping of AI services and security measures.
              </p>
            </div>

            <div className="space-y-4">
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                  1. Model &amp; Structured JSON Mode
                </h3>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Utilizes <strong>Google Gemini 2.5 Flash</strong> via <code>@google/generative-ai</code> with <code>responseMimeType: &quot;application/json&quot;</code> and temperature 0.2. A regex fallback parser provides additional resilience if prose wrappers occur.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                  2. Cost &amp; Latency Caching Layer
                </h3>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  In-memory SHA-256 hash caching (1-hour TTL) prevents redundant Gemini API calls when re-analyzing or toggling tabs on identical documents.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                  3. Token Budgeting &amp; Document Parsing
                </h3>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Uploaded files (PDF via <code>pdf-parse</code>, DOCX via <code>mammoth</code>, TXT) are sanitized and truncated at 50,000 characters to fit token budgets without context overflow.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                  4. Stateless Serverless Resilience
                </h3>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Compatible with single-tier Vercel serverless deployments: clients transmit document content directly to analysis endpoints, eliminating reliance on ephemeral server memory.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Legal Disclaimer Footer */}
        <footer className="border-t border-slate-200 bg-white py-10 dark:border-slate-800 dark:bg-slate-900">
          <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Legal Boundary &amp; Terms
            </p>
            <p className="mt-2 text-xs leading-relaxed text-slate-500 max-w-2xl mx-auto">
              This application is an educational and informational tool developed for the PromptWars Hackathon. It does not constitute legal advice and cannot replace the counsel of a licensed attorney. Users should consult legal professionals before signing binding legal agreements.
            </p>
            <p className="mt-4 text-xs text-slate-400">
              Built with Next.js 16 • React 19 • Tailwind CSS • Google Gemini API
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-5 transition hover:border-brand-300 hover:bg-white hover:shadow-sm dark:border-slate-800 dark:bg-slate-800/40 dark:hover:border-brand-700">
      <span className="text-2xl" role="img" aria-hidden="true">
        {icon}
      </span>
      <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-slate-100">{title}</h3>
      <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{description}</p>
    </div>
  );
}
