import { emailStyles } from "../styles.ts";

export const enTemplate = (data?: Record<string, any>) => {
  const { name } = data || {};
  return {
    subject: "[Osiri App] Thanks for Joining Early Access",
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
            <h1 class="title">Welcome to Osiri Early Access</h1>
            <p class="subtitle">You've unlocked an exclusive coupon for the Osiri App</p>
            <p>(Your coupon will be sent before the beta release.)</p>
          </div>
          
          <div class="content">
            <p>Dear ${name},</p>
            <p>Thank you for signing up for our Early Access Program. As one of our first supporters, we are delighted to offer you the following rewards:</p>
            
            <div class="benefits">
              <div class="benefit-item">
                <span class="benefit-icon">✨</span>
                <div>
                  <strong>50% Off for One Year</strong>
                  <p>Enjoy half off the regular price for a full year</p>
                </div>
              </div>
              
              <div class="benefit-item">
                <span class="benefit-icon">🎯</span>
                <div>
                  <strong>Priority Access</strong>
                  <p>Be the first to experience new features and updates</p>
                </div>
              </div>
              
              <div class="benefit-item">
                <span class="benefit-icon">👋</span>
                <div>
                  <strong>Dedicated Support</strong>
                  <p>Get direct access to our support team</p>
                </div>
              </div>
            </div>

            <p>We’ll keep you updated as we approach the beta release. Stay tuned for more updates!</p>
            
            <a href="https://o-siri.com" class="cta-button">Visit Our Website</a>
            
            <div class="footer">
              <p>© 2024 Osiri by Dig Da Tech LLC. All rights reserved.</p>
              <p>If you have any questions, please feel free to contact us at support@o-siri.com.</p>
            </div>
          </div>
        </div>
      </body>
    </html>
    `,
  };
};
