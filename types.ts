export interface AnalysisResult {
  summary: string;
  likelyCause: string;
  solutionSteps: string[];
  alternativeCauses: string[];
  searchQueries: string[];
  warnings: string[];
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  imageUrl: string; // Base64 or URL
  userDescription: string;
  result: AnalysisResult;
}

export enum AppStatus {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}
