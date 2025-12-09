export enum SystemType {
  JIRA = 'Jira',
  GITHUB = 'GitHub',
  DOCS = 'Google Docs',
  SLACK = 'Slack',
  ANALYSIS = 'Analysis'
}

export interface OrchestrationStep {
  stepNumber: number;
  system: SystemType;
  action: string;
  dataFlow: string;
  status: 'pending' | 'processing' | 'complete';
}

export interface ExecutionResults {
  detectedComponent: string;
  bugPriority: string;
  bugSummary: string;
  commitHash: string;
  developerName: string;
  docEntryId: string;
  docContent: string;
  slackChannel: string;
  slackMessage: string;
}

export interface AgentResponse {
  orchestrationPlan: OrchestrationStep[];
  executionResults: ExecutionResults;
}

export interface SimulationState {
  status: 'idle' | 'uploading' | 'analyzing' | 'complete' | 'error';
  errorMessage?: string;
  imagePreview?: string;
  response?: AgentResponse;
}