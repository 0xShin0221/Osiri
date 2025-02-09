import { emailStyles } from "../styles.ts";

export const esTemplate = (data?: Record<string, any>) => {
  const { name } = data || {};
  return {
    subject: `Registro de acceso anticipado en Osiri | Obtén un cupón gratis`,
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
            <h1 class="title">Bienvenido al acceso anticipado de Osiri</h1>
            <p class="subtitle">Has recibido un cupón especial para el servicio global de noticias de IA de Osiri App</p>
            <p>(El cupón se enviará antes del lanzamiento de la versión beta).</p>
          </div>
          
          <div class="content">
            <p>${name}, ¡gracias por unirte a nuestro programa de acceso anticipado! Como agradecimiento, te ofrecemos los siguientes beneficios:</p>
            
            <div class="benefits">
              <div class="benefit-item">
                <span class="benefit-icon">✨</span>
                <div>
                  <strong>50% de descuento por 1 año</strong>
                  <p>Disfruta del servicio a mitad de precio</p>
                </div>
              </div>
              
              <div class="benefit-item">
                <span class="benefit-icon">🎯</span>
                <div>
                  <strong>Acceso prioritario</strong>
                  <p>Prueba nuevas funciones y actualizaciones antes que nadie</p>
                </div>
              </div>
              
              <div class="benefit-item">
                <span class="benefit-icon">👋</span>
                <div>
                  <strong>Soporte dedicado</strong>
                  <p>Accede directamente a nuestro equipo de soporte</p>
                </div>
              </div>
            </div>

            <p>Nos pondremos en contacto nuevamente cuando el servicio beta esté disponible. Gracias por tu paciencia.</p>
            
            <a href="https://o-siri.com" class="cta-button">Visita nuestro sitio web</a>
            
            <div class="footer">
              <p>© 2025 Osiri by Dig Da Tech LLC. Todos los derechos reservados.</p>
              <p>Si tienes alguna pregunta, contáctanos en support@o-siri.com.</p>
            </div>
          </div>
        </div>
      </body>
    </html>
    `,
  };
};
