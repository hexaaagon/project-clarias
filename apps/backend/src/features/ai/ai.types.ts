export interface ChatRequest {
  pondId: number;
  question: string;
}

export interface ChatResponse {
  answer: string;
}

export interface DashboardSummaryRequest {
  pondId: number;
}

export interface DashboardSummaryResponse {
  healthScore: number;
  headline: string;
  summary: string;
  issues: string[];
  recommendations: string[];
  confidence: number;
}

export interface RecommendationsRequest {
  pondId: number;
}

export interface RecommendationsResponse {
  recommendations: string[];
}

export interface ExplainChartRequest {
  pondId: number;
  chart: string;
  history: Record<string, unknown>[];
}

export interface ExplainChartResponse {
  explanation: string;
}

export interface DailySummaryRequest {
  pondId: number;
}

export interface DailySummaryResponse {
  summary: string;
}
