import { MAX_DOCUMENT_CHARS } from "./constants";
import { AnalysisRequest } from "@/types";

const DISCLAIMER =
  "You are a legal-literacy assistant helping a non-lawyer understand a document. " +
  "You provide plain-language information and education, NOT legal advice, and you never " +
  "tell the user what to do. Never invent facts that are not in the document.";

function truncate(text: string): string {
  if (text.length <= MAX_DOCUMENT_CHARS) return text;
  return `${text.slice(0, MAX_DOCUMENT_CHARS)}\n\n[...document truncated for length...]`;
}

export function buildPrompt(request: AnalysisRequest): string {
  const document = truncate(request.documentContent);

  const builders: Record<AnalysisRequest["analysisType"], () => string> = {
    simplify: () => `
${DISCLAIMER}

Task: Translate the following legal document into clear, plain English while preserving its
actual meaning. Do not add caveats about needing a lawyer inside the JSON fields themselves.

Document:
"""
${document}
"""

Respond with ONLY valid JSON, no markdown fences, matching exactly this shape:
{
  "summary": "2-4 sentence plain-English summary of what this document is and what it does",
  "keyPoints": ["short plain-English point", "..."],
  "termsDefinitions": {"legal term found in the document": "plain-English definition"}
}`,

    risks: () => `
${DISCLAIMER}

Task: Analyze the following legal document for the obligations it creates, potential risks to the
signer, and ambiguous language. Severity must be exactly one of "high", "medium", or "low".
Also provide an overallRiskLevel based on the aggregate severity of clauses found.

Document:
"""
${document}
"""

Respond with ONLY valid JSON, no markdown fences, matching exactly this shape:
{
  "overallRiskLevel": "high|medium|low",
  "obligations": [{"item": "what the signer must do or provide", "severity": "high|medium|low"}],
  "risks": [{"item": "a risk or red flag for the signer", "severity": "high|medium|low"}],
  "ambiguities": ["a clause that is vague or open to interpretation"]
}`,

    compare: () => `
${DISCLAIMER}

Task: Compare Document 1 and Document 2 below and identify the substantive differences between
them (added/removed/changed clauses, different obligations, different terms).

Document 1:
"""
${document}
"""

Document 2:
"""
${truncate(request.additionalContext || "")}
"""

Respond with ONLY valid JSON, no markdown fences, matching exactly this shape:
{
  "differences": [
    {"section": "the clause/topic that differs", "doc1": "what Document 1 says", "doc2": "what Document 2 says", "impact": "why this difference matters in plain English"}
  ],
  "summary": "2-4 sentence plain-English summary of the overall differences"
}`,

    qa: () => `
${DISCLAIMER}

Task: Answer the user's question using ONLY information found in the document below. If the
answer is not covered in the document, say so explicitly rather than guessing.

Document:
"""
${document}
"""

Question: ${request.additionalContext || ""}

Respond with ONLY valid JSON, no markdown fences, matching exactly this shape:
{
  "answer": "plain-English answer, or a clear statement that this is not covered in the document",
  "groundedInDocument": true
}`,

    checklist: () => `
${DISCLAIMER}

Task: Generate an actionable preparation checklist, strategic user options, and lawyer consultation questions for the legal document below.
Help the user understand immediate deadlines, obligations, tactical choices, and what specific questions to ask an attorney before signing or agreeing.

Document:
"""
${document}
"""

Respond with ONLY valid JSON, no markdown fences, matching exactly this shape:
{
  "summary": "2-3 sentence overview of immediate actionable takeaways and next steps for the user",
  "actionItems": [
    {"task": "Actionable task or compliance step required before or upon signing", "deadlineOrTrigger": "e.g., within 30 days, prior to execution, or monthly", "priority": "high|medium|low"}
  ],
  "questionsForLawyer": [
    {"question": "Precise, tactical question the user should ask a legal professional", "contextOrClause": "The specific clause or risk motivating this question"}
  ],
  "userOptions": [
    {"option": "Strategic course of action or negotiation point (e.g. Request mutual indemnification, dispute resolution venue change)", "pros": "Advantage of this option", "cons": "Potential drawback or tradeoff"}
  ]
}`,
  };

  return builders[request.analysisType]();
}
