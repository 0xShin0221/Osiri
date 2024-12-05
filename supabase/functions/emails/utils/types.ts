export interface EmailTemplate {
    subject: string;
    html: string;
}
export interface EmailPayload {
    to: string;
    template: string;
    language: string;
    data?: Record<string, any>;
}
