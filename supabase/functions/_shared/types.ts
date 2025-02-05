export interface RSSItem {
  title: string;
  content: string;
  link: string;
}

export interface EmailPayload {
  to: NotificationTemplate;
  template: NotificationTemplate;
  language: SupportedLanguage;
  data?: Record<string, any>;
}

export interface SlackPayload {
  email?: string;
  language?: SupportedLanguage;
  template?: NotificationTemplate;
  data?: Record<string, any>;
}

export type NotificationTemplate =
  | "early-access"
  | "newsletter"
  | "contact"
  | "feedback";

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

export type SupportedLanguage =
  | "en" // English
  | "ja" // Japanese
  | "zh" // Chinese
  | "fr" // French
  | "hi" // Hindi
  | "pt" // Portuguese
  | "bn" // Bengali
  | "ru" // Russian
  | "id" // Indonesian
  | "de" // German
  | "es" // Spanish
  | "ko"; // Korean

export interface WaitlistEntry {
  email: string;
  name?: string;
  company?: string;
  role?: string;
  language: string;
}

export interface NewsletterSubscription {
  email: string;
  language: string;
  status?: string;
}

export interface ProcessResult {
  url: string;
  success: boolean;
  error?: string;
}

export interface RSSFeed {
  id: string;
  name: string;
  url: string;
  is_active: boolean;
  last_fetched_at?: string;
}

export interface RSSFeedUpdateResult {
  feedId: string;
  itemsProcessed: number;
  results: ProcessResult[];
  success: boolean;
}

export interface SlackOAuthResponse {
  ok: boolean;
  access_token: string;
  token_type: "bot" | "user";
  scope: string;
  bot_user_id?: string;
  app_id: string;
  team: {
    id: string;
    name: string;
  };
  enterprise: any;
  authed_user?: {
    id: string;
    scope: string;
    access_token: string;
    token_type: "user";
    expires_in?: number; // Token Rotation enabled
    refresh_token?: string; // Token Rotation enabled
  };
  expires_in?: number; // Token Rotation enabled
  refresh_token?: string; // Token Rotation enabled
  is_enterprise_install: boolean;
}
