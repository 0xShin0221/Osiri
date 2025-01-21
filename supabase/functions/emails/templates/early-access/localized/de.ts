import { emailStyles } from "../styles.ts";

export const deTemplate = (data?: Record<string, any>) => {
  const { name } = data || {};
  return {
    subject:
      `Frühzeitige Registrierung bei Osiri | Erhalten Sie einen kostenlosen Gutschein`,
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
            <h1 class="title">Willkommen beim Frühzugang zu Osiri</h1>
            <p class="subtitle">Sie haben einen speziellen Gutschein für den globalen KI-Nachrichtenfeed der Osiri App erhalten</p>
            <p>(Der Gutschein wird Ihnen vor der Veröffentlichung der Beta-Version zugesandt.)</p>
          </div>
          
          <div class="content">
            <p>${name}, vielen Dank für Ihre Anmeldung zu unserem Frühzugangsprogramm! Als Dankeschön bieten wir Ihnen folgende Vorteile:</p>
            
            <div class="benefits">
              <div class="benefit-item">
                <span class="benefit-icon">✨</span>
                <div>
                  <strong>50% Rabatt für 1 Jahr</strong>
                  <p>Genießen Sie die Hälfte des Standardpreises</p>
                </div>
              </div>
              
              <div class="benefit-item">
                <span class="benefit-icon">🎯</span>
                <div>
                  <strong>Vorrangiger Zugang</strong>
                  <p>Erleben Sie neue Funktionen und Updates früher</p>
                </div>
              </div>
              
              <div class="benefit-item">
                <span class="benefit-icon">👋</span>
                <div>
                  <strong>Dedizierter Support</strong>
                  <p>Direkter Zugang zu unserem Support-Team</p>
                </div>
              </div>
            </div>

            <p>Wir werden uns erneut bei Ihnen melden, sobald der Beta-Dienst verfügbar ist. Vielen Dank für Ihre Geduld.</p>
            
            <a href="https://o-siri.com" class="cta-button">Besuchen Sie unsere Website</a>
            
            <div class="footer">
              <p>© 2024 Osiri by Dig Da Tech LLC. Alle Rechte vorbehalten.</p>
              <p>Bei Fragen kontaktieren Sie uns bitte unter support@o-siri.com.</p>
            </div>
          </div>
        </div>
      </body>
    </html>
    `,
  };
};
