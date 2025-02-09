import { emailStyles } from "../styles.ts";

export const ruTemplate = (data?: Record<string, any>) => {
  const { name } = data || {};
  return {
    subject: `Ранняя регистрация на Osiri | Получите бесплатный купон`,
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
            <h1 class="title">Добро пожаловать в ранний доступ Osiri</h1>
            <p class="subtitle">Вы получили специальный купон для глобальной ленты новостей AI в приложении Osiri</p>
            <p>(Купон будет отправлен вам до выхода бета-версии.)</p>
          </div>
          
          <div class="content">
            <p>${name}, спасибо за участие в нашей программе раннего доступа! В знак благодарности мы предлагаем вам следующие преимущества:</p>
            
            <div class="benefits">
              <div class="benefit-item">
                <span class="benefit-icon">✨</span>
                <div>
                  <strong>50% скидка на 1 год</strong>
                  <p>Пользуйтесь за половину стандартной стоимости</p>
                </div>
              </div>
              
              <div class="benefit-item">
                <span class="benefit-icon">🎯</span>
                <div>
                  <strong>Приоритетный доступ</strong>
                  <p>Используйте новые функции и обновления раньше всех</p>
                </div>
              </div>
              
              <div class="benefit-item">
                <span class="benefit-icon">👋</span>
                <div>
                  <strong>Выделенная поддержка</strong>
                  <p>Прямой доступ к нашей службе поддержки</p>
                </div>
              </div>
            </div>

            <p>Мы свяжемся с вами снова, как только бета-версия станет доступна. Спасибо за ожидание.</p>
            
            <a href="https://o-siri.com" class="cta-button">Посетить сайт</a>
            
            <div class="footer">
              <p>© 2025 Osiri by Dig Da Tech LLC. Все права защищены.</p>
              <p>Если у вас есть вопросы, пожалуйста, свяжитесь с нами по адресу support@o-siri.com.</p>
            </div>
          </div>
        </div>
      </body>
    </html>
    `,
  };
};
