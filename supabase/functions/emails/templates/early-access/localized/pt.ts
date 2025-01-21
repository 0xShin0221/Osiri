import { emailStyles } from "../styles.ts";

export const ptTemplate = (data?: Record<string, any>) => {
  const { name } = data || {};
  return {
    subject: `Registro de Acesso Antecipado no Osiri | Obtenha um Cupom Grátis`,
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
            <h1 class="title">Bem-vindo ao Acesso Antecipado do Osiri</h1>
            <p class="subtitle">Você recebeu um cupom especial para o feed de notícias globais de IA do Osiri App</p>
            <p>(O cupom será enviado antes do lançamento da versão beta.)</p>
          </div>
          
          <div class="content">
            <p>${name}, obrigado por se inscrever no nosso programa de acesso antecipado! Como forma de agradecimento, oferecemos os seguintes benefícios:</p>
            
            <div class="benefits">
              <div class="benefit-item">
                <span class="benefit-icon">✨</span>
                <div>
                  <strong>50% de desconto por 1 ano</strong>
                  <p>Aproveite metade do preço padrão</p>
                </div>
              </div>
              
              <div class="benefit-item">
                <span class="benefit-icon">🎯</span>
                <div>
                  <strong>Acesso prioritário</strong>
                  <p>Experimente novos recursos e atualizações antes de todos</p>
                </div>
              </div>
              
              <div class="benefit-item">
                <span class="benefit-icon">👋</span>
                <div>
                  <strong>Suporte dedicado</strong>
                  <p>Entre em contato diretamente com nossa equipe de suporte</p>
                </div>
              </div>
            </div>

            <p>Entraremos em contato novamente quando o serviço beta estiver disponível. Por favor, aguarde.</p>
            
            <a href="https://o-siri.com" class="cta-button">Visite nosso site</a>
            
            <div class="footer">
              <p>© 2024 Osiri by Dig Da Tech LLC. Todos os direitos reservados.</p>
              <p>Se tiver dúvidas, entre em contato via support@o-siri.com.</p>
            </div>
          </div>
        </div>
      </body>
    </html>
    `,
  };
};
