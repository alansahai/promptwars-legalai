export type AnalysisType = "simplify" | "risks" | "compare" | "qa" | "checklist";

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
  overallRiskLevel?: Severity;
}

export interface ActionItem {
  task: string;
  deadlineOrTrigger?: string;
  priority: Severity;
}

export interface LawyerQuestion {
  question: string;
  contextOrClause: string;
}

export interface UserOption {
  option: string;
  pros: string;
  cons: string;
}

export interface ChecklistResult {
  summary: string;
  actionItems: ActionItem[];
  questionsForLawyer: LawyerQuestion[];
  userOptions: UserOption[];
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

export type AnalysisData =
  | SimplifyResult
  | RisksResult
  | CompareResult
  | QAResult
  | ChecklistResult
  | { raw: string };

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
  content?: string;
  error?: string;
}

export interface ApiErrorBody {
  error: string;
  stack?: string;
}
