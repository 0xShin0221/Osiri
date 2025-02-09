import { emailStyles } from "../styles.ts";

export const frTemplate = (data?: Record<string, any>) => {
  const { name } = data || {};
  return {
    subject: `Inscription à l'accès anticipé Osiri | Obtenez un coupon gratuit`,
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
            <h1 class="title">Bienvenue dans l'accès anticipé Osiri</h1>
            <p class="subtitle">Vous avez reçu un coupon spécial pour Osiri App, le flux d'actualités IA mondial</p>
            <p>(Le coupon sera envoyé avant le lancement de la version bêta.)</p>
          </div>
          
          <div class="content">
            <p>${name}, merci de vous être inscrit à notre programme d'accès anticipé ! En guise de remerciement, nous vous offrons les avantages suivants :</p>
            
            <div class="benefits">
              <div class="benefit-item">
                <span class="benefit-icon">✨</span>
                <div>
                  <strong>50% de réduction pendant un an</strong>
                  <p>Bénéficiez de 50% de réduction sur le tarif standard</p>
                </div>
              </div>
              
              <div class="benefit-item">
                <span class="benefit-icon">🎯</span>
                <div>
                  <strong>Accès prioritaire</strong>
                  <p>Découvrez les nouvelles fonctionnalités et mises à jour en avant-première</p>
                </div>
              </div>
              
              <div class="benefit-item">
                <span class="benefit-icon">👋</span>
                <div>
                  <strong>Support dédié</strong>
                  <p>Accédez directement à notre équipe de support</p>
                </div>
              </div>
            </div>

            <p>Nous vous contacterons à nouveau lors du lancement de notre service bêta. Merci de patienter.</p>
            
            <a href="https://o-siri.com" class="cta-button">Visitez notre site</a>
            
            <div class="footer">
              <p>© 2025 Osiri by Dig Da Tech LLC. Tous droits réservés.</p>
              <p>Pour toute question, contactez-nous à support@o-siri.com.</p>
            </div>
          </div>
        </div>
      </body>
    </html>
    `,
  };
};
