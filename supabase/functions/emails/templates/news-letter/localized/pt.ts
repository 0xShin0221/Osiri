import { emailStyles } from "../styles.ts";

export const ptTemplate = (data?: Record<string, any>) => {
    const { email } = data || {};
    return {
      subject: "[Osiri] Confirmação de inscrição na newsletter",
      html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>${emailStyles}</style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 class="title">Bem-vindo à newsletter da Osiri</h1>
              <p class="subtitle">Obrigado por se inscrever em nossas atualizações</p>
            </div>
            <div class="content">
              <p>Prezado assinante,</p>
              <p>Obrigado por se inscrever na newsletter da Osiri! Você receberá atualizações regulares sobre:</p>
              <div class="benefits">
                <div class="benefit-item">
                  <span class="benefit-icon">📱</span>
                  <div>
                    <strong>Novos recursos</strong>
                    <p>Seja o primeiro a saber sobre novos recursos do aplicativo</p>
                  </div>
                </div>
                <div class="benefit-item">
                  <span class="benefit-icon">📰</span>
                  <div>
                    <strong>Notícias de tecnologia</strong>
                    <p>Notícias e análises tecnológicas diárias selecionadas</p>
                  </div>
                </div>
                <div class="benefit-item">
                  <span class="benefit-icon">💡</span>
                  <div>
                    <strong>Dicas e truques</strong>
                    <p>Aproveite ao máximo o Osiri</p>
                  </div>
                </div>
              </div>
              <p>Fique atento à nossa próxima atualização!</p>
              <a href="https://osiri.xyz" class="cta-button">Visite nosso site</a>
              <div class="footer">
                <p>© 2024 Osiri by Dig Da Tech LLC. Todos os direitos reservados.</p>
                <p>Você pode cancelar a inscrição a qualquer momento clicando no link em nossos emails.</p>
                <p>Se tiver alguma dúvida, entre em contato conosco em support@osiri.xyz</p>
              </div>
            </div>
          </div>
        </body>
      </html>`,
    };
  };
  