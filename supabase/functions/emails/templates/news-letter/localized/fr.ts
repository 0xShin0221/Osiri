import { emailStyles } from "../styles.ts";

export const frTemplate = (data?: Record<string, any>) => {
    const { email } = data || {};
    return {
      subject: "[Osiri] Confirmation d'inscription à la newsletter",
      html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>${emailStyles}</style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 class="title">Bienvenue à la newsletter Osiri</h1>
              <p class="subtitle">Merci de vous être inscrit à nos mises à jour</p>
            </div>
            <div class="content">
              <p>Cher abonné,</p>
              <p>Merci de vous être abonné à la newsletter Osiri ! Vous recevrez régulièrement des mises à jour sur :</p>
              <div class="benefits">
                <div class="benefit-item">
                  <span class="benefit-icon">📱</span>
                  <div>
                    <strong>Nouvelles fonctionnalités</strong>
                    <p>Soyez le premier à découvrir les nouvelles fonctionnalités de l'application</p>
                  </div>
                </div>
                <div class="benefit-item">
                  <span class="benefit-icon">📰</span>
                  <div>
                    <strong>Actualités tech</strong>
                    <p>Actualités tech et analyses quotidiennes sélectionnées</p>
                  </div>
                </div>
                <div class="benefit-item">
                  <span class="benefit-icon">💡</span>
                  <div>
                    <strong>Conseils et astuces</strong>
                    <p>Tirez le meilleur parti d'Osiri</p>
                  </div>
                </div>
              </div>
              <p>Restez à l'écoute pour notre prochaine mise à jour !</p>
              <a href="https://osiri.xyz" class="cta-button">Visitez notre site web</a>
              <div class="footer">
                <p>© 2024 Osiri by Dig Da Tech LLC. Tous droits réservés.</p>
                <p>Vous pouvez vous désabonner à tout moment en cliquant sur le lien dans nos emails.</p>
                <p>Si vous avez des questions, contactez-nous à support@osiri.xyz</p>
              </div>
            </div>
          </div>
        </body>
      </html>`,
    };
  };
  