export interface DiagnosticResult {
  slug: string;
  diagnostic: string;
  created_at: string;
  updated_at: string;
}

export interface DiagnosticState {
  isLoading: boolean;
  isAvailable: boolean;
  content: string | null;
  error: string | null;
}

export interface DiagnosticPollingState extends DiagnosticState {
  isPolling: boolean;
  pollingDuration: number;
}