import { SupportedLanguage } from "../../../../_shared/types.ts";
import { generateUnsubscribeUrl } from "../../../../_shared/utils/unsubscribe.ts";
import { emailStyles } from "../styles.ts";

export const idTemplate = (
  data: Record<string, any>,
  language: SupportedLanguage,
) => {
  const { email } = data || {};
  const unsubscribeUrl = generateUnsubscribeUrl(email || "", language);

  return {
    subject: "[Osiri] Konfirmasi Langganan Newsletter",
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
              <h1 class="title">Selamat Datang di Newsletter Osiri</h1>
              <p class="subtitle">Terima kasih telah berlangganan update kami</p>
            </div>
            
            <div class="content">
              <p>Pelanggan yang terhormat,</p>
              <p>Terima kasih telah berlangganan newsletter Osiri! Anda akan menerima update rutin tentang:</p>
              
              <div class="benefits">
                <div class="benefit-item">
                  <span class="benefit-icon">📱</span>
                  <div>
                    <strong>Fitur Baru</strong>
                    <p>Jadilah yang pertama mengetahui fitur aplikasi baru</p>
                  </div>
                </div>
                
                <div class="benefit-item">
                  <span class="benefit-icon">📰</span>
                  <div>
                    <strong>Berita Tech</strong>
                    <p>Berita tech pilihan dan wawasan harian</p>
                  </div>
                </div>
                
                <div class="benefit-item">
                  <span class="benefit-icon">💡</span>
                  <div>
                    <strong>Tips & Trik</strong>
                    <p>Dapatkan manfaat maksimal dari Osiri</p>
                  </div>
                </div>
              </div>
  
              <p>Tunggu update kami berikutnya!</p>
              
              <a href="https://o-siri.com" class="cta-button">Kunjungi Website Kami</a>
              
              <div class="footer">
                <p>© 2025 Osiri by Dig Da Tech LLC. Hak cipta dilindungi undang-undang.</p>
                <p>Jika Anda ingin berhenti berlangganan, <a href="${unsubscribeUrl}">klik di sini</a>.</p>
                <p>Jika Anda memiliki pertanyaan, silakan hubungi kami di support@o-siri.com</p>
              </div>
            </div>
          </div>
        </body>
      </html>
      `,
  };
};
