import { emailStyles } from "../styles.ts";

export const idTemplate = (data?: Record<string, any>) => {
  const { name } = data || {};
  return {
    subject: `Pendaftaran Akses Awal di Osiri | Dapatkan Kupon Gratis`,
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
            <h1 class="title">Selamat Datang di Akses Awal Osiri</h1>
            <p class="subtitle">Anda telah menerima kupon khusus untuk Osiri App, layanan berita AI global</p>
            <p>(Kupon akan dikirimkan sebelum versi beta dirilis.)</p>
          </div>
          
          <div class="content">
            <p>${name}, terima kasih telah mendaftar ke program akses awal kami! Sebagai ucapan terima kasih, kami menawarkan keuntungan berikut:</p>
            
            <div class="benefits">
              <div class="benefit-item">
                <span class="benefit-icon">✨</span>
                <div>
                  <strong>Diskon 50% selama 1 tahun</strong>
                  <p>Nikmati setengah harga dari harga standar</p>
                </div>
              </div>
              
              <div class="benefit-item">
                <span class="benefit-icon">🎯</span>
                <div>
                  <strong>Akses Prioritas</strong>
                  <p>Rasakan fitur dan pembaruan baru lebih awal</p>
                </div>
              </div>
              
              <div class="benefit-item">
                <span class="benefit-icon">👋</span>
                <div>
                  <strong>Dukungan Khusus</strong>
                  <p>Akses langsung ke tim dukungan kami</p>
                </div>
              </div>
            </div>

            <p>Kami akan menghubungi Anda lagi saat layanan beta diluncurkan. Harap tunggu.</p>
            
            <a href="https://osiri.xyz" class="cta-button">Kunjungi Situs</a>
            
            <div class="footer">
              <p>© 2024 Osiri by Dig Da Tech LLC. Hak cipta dilindungi undang-undang.</p>
              <p>Jika ada pertanyaan, silakan hubungi kami di support@osiri.xyz.</p>
            </div>
          </div>
        </div>
      </body>
    </html>
    `,
  };
};
