export type AnalysisType = "simplify" | "risks" | "compare" | "qa";

export type Severity = "high" | "medium" | "low";

export interface SimplifyResult {
  summary: string;
  keyPoints: string[];
  termsDefinitions: Record<string, string>;
}

export interface RiskItem {
  item: string;
  severity: Severity;
}

export interface RisksResult {
  obligations: RiskItem[];
  risks: RiskItem[];
  ambiguities: string[];
}

export interface DocumentDifference {
  section: string;
  doc1: string;
  doc2: string;
  impact: string;
}

export interface CompareResult {
  differences: DocumentDifference[];
  summary: string;
}

export interface QAResult {
  answer: string;
  groundedInDocument: boolean;
}

export type AnalysisData = SimplifyResult | RisksResult | CompareResult | QAResult | { raw: string };

export interface AnalysisRequest {
  documentContent: string;
  analysisType: AnalysisType;
  additionalContext?: string;
}

export interface AnalysisResult {
  success: boolean;
  data?: AnalysisData;
  error?: string;
  cached?: boolean;
}

export interface StoredDocument {
  id: string;
  filename: string;
  mimetype: string;
  content: string;
  createdAt: number;
}

export interface UploadResponseBody {
  success: boolean;
  documentId?: string;
  filename?: string;
  characterCount?: number;
  preview?: string;
  error?: string;
}

export interface ApiErrorBody {
  error: string;
  stack?: string;
}
