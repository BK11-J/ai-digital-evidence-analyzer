
export type Verdict = 'Phishing' | 'Suspicious' | 'Legitimate';

export type RedFlagType = 'Sender' | 'Content' | 'URL' | 'Urgency' | 'Generic' | 'Attachment' | 'Other';

export interface RedFlag {
  type: RedFlagType;
  description: string;
  problematicText: string;
}

export interface AnalysisReport {
  verdict: Verdict;
  riskScore: number;
  explanation: string;
  redFlags: RedFlag[];
}
