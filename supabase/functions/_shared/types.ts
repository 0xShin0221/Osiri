export interface RSSItem {
  title: string;
  content?: string;
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
