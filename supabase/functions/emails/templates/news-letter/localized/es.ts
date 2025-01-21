import { SupportedLanguage } from "../../../../_shared/types.ts";
import { generateUnsubscribeUrl } from "../../../../_shared/utils/unsubscribe.ts";
import { emailStyles } from "../styles.ts";

export const esTemplate = (
  data: Record<string, any>,
  language: SupportedLanguage,
) => {
  const { email } = data || {};
  const unsubscribeUrl = generateUnsubscribeUrl(email || "", language);

  return {
    subject: "[Osiri] Confirmación de suscripción al boletín",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>${emailStyles}</style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 class="title">Bienvenido al boletín de Osiri</h1>
              <p class="subtitle">Gracias por suscribirte a nuestras actualizaciones</p>
            </div>
            <div class="content">
              <p>Estimado suscriptor,</p>
              <p>¡Gracias por suscribirte al boletín de Osiri! Recibirás actualizaciones regulares sobre:</p>
              <div class="benefits">
                <div class="benefit-item">
                  <span class="benefit-icon">📱</span>
                  <div>
                    <strong>Nuevas funciones</strong>
                    <p>Sé el primero en conocer las nuevas funciones de la aplicación</p>
                  </div>
                </div>
                <div class="benefit-item">
                  <span class="benefit-icon">📰</span>
                  <div>
                    <strong>Noticias de tecnología</strong>
                    <p>Noticias y análisis tecnológicos diarios seleccionados</p>
                  </div>
                </div>
                <div class="benefit-item">
                  <span class="benefit-icon">💡</span>
                  <div>
                    <strong>Consejos y trucos</strong>
                    <p>Aprovecha al máximo Osiri</p>
                  </div>
                </div>
              </div>
              <p>¡Mantente atento a nuestra próxima actualización!</p>
              <a href="https://o-siri.com" class="cta-button">Visita nuestro sitio web</a>
              <div class="footer">
                <p>© 2024 Osiri by Dig Da Tech LLC. Todos los derechos reservados.</p>
                <p>Si deseas cancelar tu suscripción, <a href="${unsubscribeUrl}">haz clic aquí</a>.</p>
                <p>Si tienes alguna pregunta, contáctanos en support@o-siri.com</p>
              </div>
            </div>
          </div>
        </body>
      </html>`,
  };
};
