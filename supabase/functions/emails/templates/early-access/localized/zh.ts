import { emailStyles } from "../styles.ts";

export const zhTemplate = (data?: Record<string, any>) => {
  const { name } = data || {};
  return {
    subject: `Osiri 早期访问注册 | 免费优惠券获取`,
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
            <h1 class="title">欢迎加入 Osiri 早期访问</h1>
            <p class="subtitle">您已获得 Osiri App 全球 AI 新闻服务的特别优惠券</p>
            <p>（优惠券将在测试版发布前发送给您。）</p>
          </div>
          
          <div class="content">
            <p>${name}，感谢您注册我们的早期访问计划！作为感谢，我们为您提供以下优惠：</p>
            
            <div class="benefits">
              <div class="benefit-item">
                <span class="benefit-icon">✨</span>
                <div>
                  <strong>一年50%折扣</strong>
                  <p>享受标准价格的半价优惠</p>
                </div>
              </div>
              
              <div class="benefit-item">
                <span class="benefit-icon">🎯</span>
                <div>
                  <strong>优先访问权</strong>
                  <p>抢先体验新功能和更新</p>
                </div>
              </div>
              
              <div class="benefit-item">
                <span class="benefit-icon">👋</span>
                <div>
                  <strong>专属支持</strong>
                  <p>直接联系我们的支持团队</p>
                </div>
              </div>
            </div>

            <p>我们将在测试版服务上线时再次联系您，敬请期待。</p>
            
            <a href="https://o-siri.com" class="cta-button">访问官网</a>
            
            <div class="footer">
              <p>© 2024 Osiri by Dig Da Tech LLC. 版权所有。</p>
              <p>如有疑问，请发送邮件至 support@o-siri.com 联系我们。</p>
            </div>
          </div>
        </div>
      </body>
    </html>
    `,
  };
};
