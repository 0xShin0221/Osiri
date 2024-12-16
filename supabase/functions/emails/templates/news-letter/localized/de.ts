import { SupportedLanguage } from "../../../../_shared/types.ts";
import { generateUnsubscribeUrl } from "../../../../_shared/utils/unsubscribe.ts";
import { emailStyles } from "../styles.ts";

export const deTemplate = (
  data: Record<string, any>,
  language: SupportedLanguage,
) => {
  const { email } = data || {};
  const unsubscribeUrl = generateUnsubscribeUrl(email || "", language);

  return {
    subject: "[Osiri] Newsletter-Anmeldung bestätigt",
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
              <h1 class="title">Willkommen beim Osiri Newsletter</h1>
              <p class="subtitle">Danke für Ihr Interesse an unseren Updates</p>
            </div>
            
            <div class="content">
              <p>Sehr geehrter Abonnent,</p>
              <p>Vielen Dank für Ihr Abonnement des Osiri Newsletters! Sie erhalten ab jetzt regelmäßige Updates zu:</p>
              
              <div class="benefits">
                <div class="benefit-item">
                  <span class="benefit-icon">📱</span>
                  <div>
                    <strong>Neue Funktionen</strong>
                    <p>Erfahren Sie als Erster von neuen App-Funktionen</p>
                  </div>
                </div>
                
                <div class="benefit-item">
                  <span class="benefit-icon">📰</span>
                  <div>
                    <strong>Tech-News</strong>
                    <p>Täglich kuratierte Tech-News und Einblicke</p>
                  </div>
                </div>
                
                <div class="benefit-item">
                  <span class="benefit-icon">💡</span>
                  <div>
                    <strong>Tipps & Tricks</strong>
                    <p>Holen Sie das Beste aus Osiri heraus</p>
                  </div>
                </div>
              </div>
  
              <p>Bleiben Sie gespannt auf unser nächstes Update!</p>
              
              <a href="https://osiri.xyz" class="cta-button">Besuchen Sie unsere Website</a>
              
              <div class="footer">
                <p>© 2024 Osiri by Dig Da Tech LLC. Alle Rechte vorbehalten.</p>
                 <p>Wenn Sie das Abonnement abbestellen möchten, <a href="${unsubscribeUrl}">klicken Sie hier</a>.</p>
                <p>Bei Fragen kontaktieren Sie uns bitte unter support@osiri.xyz</p>
              </div>
            </div>
          </div>
        </body>
      </html>
      `,
  };
};
