// templates/newsletter/localized/ru.ts
import { emailStyles } from "../styles.ts";

export const ruTemplate = (data?: Record<string, any>) => {
  const { email } = data || {};
  return {
    subject: "[Osiri] Подписка на рассылку подтверждена",
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
            <h1 class="title">Добро пожаловать в рассылку Osiri</h1>
            <p class="subtitle">Спасибо за подписку на наши обновления</p>
          </div>
          
          <div class="content">
            <p>Уважаемый подписчик,</p>
            <p>Благодарим вас за подписку на рассылку Osiri! Теперь вы будете получать регулярные обновления о:</p>
            
            <div class="benefits">
              <div class="benefit-item">
                <span class="benefit-icon">📱</span>
                <div>
                  <strong>Новые функции</strong>
                  <p>Узнавайте первыми о новых функциях приложения</p>
                </div>
              </div>
              
              <div class="benefit-item">
                <span class="benefit-icon">📰</span>
                <div>
                  <strong>Технические новости</strong>
                  <p>Ежедневные подборки новостей и аналитика</p>
                </div>
              </div>
              
              <div class="benefit-item">
                <span class="benefit-icon">💡</span>
                <div>
                  <strong>Советы и приемы</strong>
                  <p>Получите максимум от использования Osiri</p>
                </div>
              </div>
            </div>

            <p>Ждите нашего следующего обновления!</p>
            
            <a href="https://osiri.xyz" class="cta-button">Посетить наш сайт</a>
            
            <div class="footer">
              <p>© 2024 Osiri by Dig Da Tech LLC. Все права защищены.</p>
              <p>Вы можете отписаться в любое время, нажав на ссылку в наших письмах.</p>
              <p>Если у вас есть вопросы, пожалуйста, свяжитесь с нами по адресу support@osiri.xyz</p>
            </div>
          </div>
        </div>
      </body>
    </html>
    `,
  };
};

