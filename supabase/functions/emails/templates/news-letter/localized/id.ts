import { emailStyles } from "../styles.ts";

export const idTemplate = (data?: Record<string, any>) => {
    const { email } = data || {};
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
              
              <a href="https://osiri.xyz" class="cta-button">Kunjungi Website Kami</a>
              
              <div class="footer">
                <p>© 2024 Osiri by Dig Da Tech LLC. Hak cipta dilindungi undang-undang.</p>
                <p>Anda dapat berhenti berlangganan kapan saja dengan mengklik tautan di email kami.</p>
                <p>Jika Anda memiliki pertanyaan, silakan hubungi kami di support@osiri.xyz</p>
              </div>
            </div>
          </div>
        </body>
      </html>
      `,
    };
  };
  