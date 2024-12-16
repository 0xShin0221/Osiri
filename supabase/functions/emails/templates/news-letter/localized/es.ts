import { emailStyles } from "../styles.ts";

export const esTemplate = (data?: Record<string, any>) => {
    const { email } = data || {};
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
              <a href="https://osiri.xyz" class="cta-button">Visita nuestro sitio web</a>
              <div class="footer">
                <p>© 2024 Osiri by Dig Da Tech LLC. Todos los derechos reservados.</p>
                <p>Puedes darte de baja en cualquier momento haciendo clic en el enlace de nuestros correos.</p>
                <p>Si tienes alguna pregunta, contáctanos en support@osiri.xyz</p>
              </div>
            </div>
          </div>
        </body>
      </html>`,
    };
  };