import Head from "next/head";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Head>
        <title>Legal AI Assistant</title>
        <meta
          name="description"
          content="Understand contracts, terms of service, and privacy policies in plain English."
        />
      </Head>
      <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-4 py-16 text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-brand-600">
          AI for Legal Assistance &amp; Access
        </p>
        <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">Legal AI Assistant</h1>
        <p className="mt-4 max-w-xl text-lg text-gray-600">
          Upload a contract, terms of service, or privacy policy and get a plain-English summary,
          risk analysis, side-by-side comparison, and answers to your questions — powered by Google
          Gemini.
        </p>

        <Link
          href="/dashboard"
          className="mt-8 rounded-md bg-brand-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
        >
          Try it now
        </Link>

        <div className="mt-12 grid grid-cols-1 gap-4 text-left sm:grid-cols-2">
          <Feature title="Simplify" description="Turn dense legal language into clear, plain English." />
          <Feature title="Risk Analysis" description="Surface obligations, red flags, and ambiguous clauses." />
          <Feature title="Compare Documents" description="See exactly what changed between two versions." />
          <Feature title="Ask Questions" description="Get answers grounded only in the document you uploaded." />
        </div>

        <p className="mt-12 max-w-xl text-xs text-gray-400">
          This tool provides general information to help you understand legal documents. It is not
          a substitute for advice from a licensed attorney.
        </p>
      </main>
    </>
  );
}

function Feature({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-lg border border-gray-200 p-4">
      <h2 className="font-semibold text-gray-900">{title}</h2>
      <p className="mt-1 text-sm text-gray-600">{description}</p>
    </div>
  );
}
