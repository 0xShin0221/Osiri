export interface EmailPayload {
  to: NotificationTemplate;
  template: NotificationTemplate;
  language: string;
  data?: Record<string, any>;
}

export interface SlackPayload {
  email?: string;
  language?: string;
  template?: NotificationTemplate;
  data?: Record<string, any>;
}

export type NotificationTemplate = "early-access" | "contact" | "feedback";

export interface EmailTemplateContent {
  subject: string;
  html: string;
}

export interface TemplateConfig {
  title: string;
  showData: boolean;
  emoji: string;
}

export type TemplateConfigs =
  & {
    [K in NotificationTemplate]: TemplateConfig;
  }
  & {
    default: TemplateConfig;
  };
