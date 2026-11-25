export interface ZaloBotConfig {
  enabled: boolean;
  mode: "zalo-bot-api" | "custom-webhook";
  botToken: string;
  chatId: string;
  customWebhookUrl: string;
}
