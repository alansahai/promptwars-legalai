import Head from "next/head";
import Link from "next/link";

export default function Custom404() {
  return (
    <>
      <Head>
        <title>404 - Page Not Found | Legal AI Assistant</title>
        <meta
          name="description"
          content="The requested page could not be found. Return to Legal AI Assistant."
        />
      </Head>

      <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        {/* Navigation */}
        <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/80">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
            <Link
              href="/"
              prefetch={false}
              className="flex items-center gap-2 text-sm font-semibold text-slate-900 hover:text-brand-600 dark:text-slate-100 dark:hover:text-brand-400"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white font-bold text-sm shadow-xs">
                §
              </span>
              <span>Legal AI Assistant</span>
            </Link>
            <Link
              href="/dashboard"
              prefetch={false}
              className="rounded-lg bg-brand-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-brand-700 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-600"
            >
              Go to Dashboard &rarr;
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <main
          id="main-content"
          className="flex flex-1 flex-col items-center justify-center px-4 py-16 text-center sm:px-6"
        >
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-2xl font-bold text-brand-600 dark:bg-brand-950/60 dark:text-brand-400 mb-6 shadow-xs">
            404
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Page Not Found
          </h1>
          <p className="mt-3 max-w-md text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            The document, tool, or page you were looking for could not be located or has expired.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/dashboard"
              prefetch={false}
              className="rounded-xl bg-brand-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-600"
            >
              Launch Dashboard &rarr;
            </Link>
            <Link
              href="/"
              prefetch={false}
              className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-medium text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-600"
            >
              Back to Home
            </Link>
          </div>
        </main>

        <footer className="border-t border-slate-200 bg-white py-6 dark:border-slate-800 dark:bg-slate-900 text-center text-xs text-slate-400">
          PromptWars: AI for Legal Assistance &amp; Access POC
        </footer>
      </div>
    </>
  );
}
