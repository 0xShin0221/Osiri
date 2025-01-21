import { SupportedLanguage } from "../../../../_shared/types.ts";
import { generateUnsubscribeUrl } from "../../../../_shared/utils/unsubscribe.ts";
import { emailStyles } from "../styles.ts";

export const jaTemplate = (
  data: Record<string, any>,
  language: SupportedLanguage,
) => {
  const { email } = data || {};
  const unsubscribeUrl = generateUnsubscribeUrl(email || "", language);

  return {
    subject: "[Osiri] ニュースレター購読のご確認",
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
            <h1 class="title">Osiriニュースレターへようこそ</h1>
            <p class="subtitle">アップデート情報の購読ありがとうございます</p>
          </div>
          
          <div class="content">
            <p>購読者様</p>
            <p>Osiriニュースレターにご登録いただき、ありがとうございます！以下の情報を定期的にお届けします：</p>
            
            <div class="benefits">
              <div class="benefit-item">
                <span class="benefit-icon">📱</span>
                <div>
                  <strong>新機能情報</strong>
                  <p>アプリの新機能をいち早くお知らせ</p>
                </div>
              </div>
              
              <div class="benefit-item">
                <span class="benefit-icon">📰</span>
                <div>
                  <strong>テックニュース</strong>
                  <p>日々のテクノロジーニュースと解説</p>
                </div>
              </div>
              
              <div class="benefit-item">
                <span class="benefit-icon">💡</span>
                <div>
                  <strong>使い方のヒント</strong>
                  <p>Osiriを最大限活用するコツ</p>
                </div>
              </div>
            </div>

            <p>次回のアップデート情報をお楽しみに！</p>
            
            <a href="https://o-siri.com" class="cta-button">ウェブサイトを見る</a>
            
            <div class="footer">
              <p>© 2024 Osiri by Dig Da Tech LLC. All rights reserved.</p>
             <p>配信停止をご希望の場合は、<a href="${unsubscribeUrl}">こちらをクリック</a>してください。</p>
              <p>ご不明な点がございましたら、support@o-siri.com までお問い合わせください。</p>
            </div>
          </div>
        </div>
      </body>
    </html>
    `,
  };
};
