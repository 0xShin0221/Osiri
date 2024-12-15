import { emailStyles } from "../styles.ts";

export const hiTemplate = (data?: Record<string, any>) => {
  const { name } = data || {};
  return {
    subject: `Osiri पर अर्ली एक्सेस पंजीकरण | मुफ़्त कूपन प्राप्त करें`,
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
            <h1 class="title">Osiri अर्ली एक्सेस में आपका स्वागत है</h1>
            <p class="subtitle">आपने Osiri App के वैश्विक AI न्यूज़ फ़ीड का विशेष कूपन प्राप्त किया है</p>
            <p>(कूपन आपको बीटा संस्करण के रिलीज़ से पहले भेजा जाएगा।)</p>
          </div>
          
          <div class="content">
            <p>${name}, हमारे अर्ली एक्सेस प्रोग्राम में शामिल होने के लिए धन्यवाद! आपकी भागीदारी के लिए, हम आपको निम्नलिखित लाभ प्रदान कर रहे हैं:</p>
            
            <div class="benefits">
              <div class="benefit-item">
                <span class="benefit-icon">✨</span>
                <div>
                  <strong>1 वर्ष के लिए 50% की छूट</strong>
                  <p>मानक मूल्य का आधा</p>
                </div>
              </div>
              
              <div class="benefit-item">
                <span class="benefit-icon">🎯</span>
                <div>
                  <strong>प्राथमिकता पहुँच</strong>
                  <p>नई सुविधाओं और अपडेट को पहले अनुभव करें</p>
                </div>
              </div>
              
              <div class="benefit-item">
                <span class="benefit-icon">👋</span>
                <div>
                  <strong>समर्पित समर्थन</strong>
                  <p>हमारी सपोर्ट टीम से सीधे संपर्क करें</p>
                </div>
              </div>
            </div>

            <p>हम बीटा सेवा के शुरू होने पर आपसे फिर से संपर्क करेंगे। कृपया प्रतीक्षा करें।</p>
            
            <a href="https://osiri.xyz" class="cta-button">वेबसाइट देखें</a>
            
            <div class="footer">
              <p>© 2024 Osiri by Dig Da Tech LLC. सर्वाधिकार सुरक्षित।</p>
              <p>अगर आपके कोई प्रश्न हैं, तो support@osiri.xyz पर संपर्क करें।</p>
            </div>
          </div>
        </div>
      </body>
    </html>
    `,
  };
};
