export type WebhookReceptionStatus = "T" | "F";

export interface WebhookSetting {
  scopes?: string[];
  reception_status: WebhookReceptionStatus;
}

export interface WebhookSettingResponse {
  webhook: WebhookSetting;
}
