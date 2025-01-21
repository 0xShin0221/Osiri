import { SupportedLanguage } from "../../../../_shared/types.ts";
import { generateUnsubscribeUrl } from "../../../../_shared/utils/unsubscribe.ts";
import { emailStyles } from "../styles.ts";

export const enTemplate = (
  data: Record<string, any>,
  language: SupportedLanguage,
) => {
  const { email } = data || {};
  const unsubscribeUrl = generateUnsubscribeUrl(email || "", language);

  return {
    subject: "[Osiri] Newsletter Subscription Confirmed",
    html: `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          ${emailStyles}
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="title">Welcome to Osiri Newsletter</h1>
            <p class="subtitle">Thanks for subscribing to our updates</p>
          </div>
          
          <div class="content">
            <p>Dear Subscriber,</p>
            <p>Thank you for subscribing to the Osiri newsletter! You'll now receive regular updates about:</p>
            
            <div class="benefits">
              <div class="benefit-item">
                <span class="benefit-icon">📱</span>
                <div>
                  <strong>New Features</strong>
                  <p>Be the first to know about new app features</p>
                </div>
              </div>
              
              <div class="benefit-item">
                <span class="benefit-icon">📰</span>
                <div>
                  <strong>Tech News</strong>
                  <p>Daily curated tech news and insights</p>
                </div>
              </div>
              
              <div class="benefit-item">
                <span class="benefit-icon">💡</span>
                <div>
                  <strong>Tips & Tricks</strong>
                  <p>Get the most out of Osiri</p>
                </div>
              </div>
            </div>

            <p>Stay tuned for our next update!</p>
            
            <a href="https://o-siri.com" class="cta-button">Visit Our Website</a>
            
            <div class="footer">
              <p>© 2024 Osiri by Dig Da Tech LLC. All rights reserved.</p>
              <p>If you wish to unsubscribe, <a href="${unsubscribeUrl}">click here</a>.</p>
              <p>If you have any questions, please contact us at support@o-siri.com</p>
            </div>
          </div>
        </div>
      </body>
    </html>
    `,
  };
};
