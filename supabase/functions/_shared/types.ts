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

interface ArticleData {
  feed_id: string;
  title: string;
  content: string;
  url: string;
  created_at: string;
  updated_at: string;
}
