export type ADKIntentType = "monitoring_rule" | "report_generate" | "alert_create" | "ambiguous";

export interface ADKIntent {
  intent_type: ADKIntentType;
  confidence: number;
  metric?: string;
  data_hint?: string;
  time_window?: TimeWindow;
  schedule?: ScheduleIntent;
  threshold?: ThresholdIntent;
  alert_channels?: string[];
  recipients?: string[];
  dataSourceId?: string;
  userId: string;
  rawRequest: string;
}

export interface TimeWindow {
  unit: "hour" | "day" | "week" | "month" | "quarter" | "year";
  value: number;
  description: string;
}

export interface ScheduleIntent {
  natural: string;
  cron: string;
  timezone: string;
  description: string;
}

export interface ThresholdIntent {
  operator: "gt" | "gte" | "lt" | "lte" | "eq" | "neq" | "between";
  value: number;
  upperBound?: number;
  currency?: string;
  unit?: string;
  percentageChange?: boolean;
}

export interface ADKPipelineResult {
  success: boolean;
  intentId?: string;
  reportDefinitionId?: string;
  monitoringRuleId?: string;
  jobDefinitionId?: string;
  nextRunAt?: string;
  adkIntent?: ADKIntent;
  error?: string;
  clarificationNeeded?: boolean;
  clarificationPrompt?: string;
}

export interface ADKStoredIntent {
  id: string;
  user_id: string;
  session_id?: string;
  raw_nl_request: string;
  request_source: "text" | "voice";
  intent_type: string;
  confidence?: number;
  adk_intent_json: ADKIntent;
  pipeline_status: "pending" | "success" | "failed" | "partial";
  report_definition_id?: string;
  monitoring_rule_id?: string;
  error_message?: string;
  classification_ms?: number;
  total_pipeline_ms?: number;
  created_at: string;
}
