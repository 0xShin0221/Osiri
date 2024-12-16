import { emailStyles } from "../styles.ts";

export const zhTemplate = (data?: Record<string, any>) => {
    const { email } = data || {};
    return {
      subject: "[Osiri] 订阅通讯确认",
      html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>${emailStyles}</style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 class="title">欢迎订阅 Osiri 通讯</h1>
              <p class="subtitle">感谢您订阅我们的更新</p>
            </div>
            <div class="content">
              <p>尊敬的订阅者，</p>
              <p>感谢您订阅 Osiri 通讯！您将定期收到以下更新：</p>
              <div class="benefits">
                <div class="benefit-item">
                  <span class="benefit-icon">📱</span>
                  <div>
                    <strong>新功能</strong>
                    <p>第一时间了解应用新功能</p>
                  </div>
                </div>
                <div class="benefit-item">
                  <span class="benefit-icon">📰</span>
                  <div>
                    <strong>科技新闻</strong>
                    <p>每日精选科技新闻和见解</p>
                  </div>
                </div>
                <div class="benefit-item">
                  <span class="benefit-icon">💡</span>
                  <div>
                    <strong>使用技巧</strong>
                    <p>充分利用 Osiri</p>
                  </div>
                </div>
              </div>
              <p>敬请期待我们的下一次更新！</p>
              <a href="https://osiri.xyz" class="cta-button">访问我们的网站</a>
              <div class="footer">
                <p>© 2024 Osiri by Dig Da Tech LLC. 版权所有。</p>
                <p>您可以随时通过我们邮件中的链接取消订阅。</p>
                <p>如有任何问题，请通过 support@osiri.xyz 与我们联系</p>
              </div>
            </div>
          </div>
        </body>
      </html>`,
    };
  };