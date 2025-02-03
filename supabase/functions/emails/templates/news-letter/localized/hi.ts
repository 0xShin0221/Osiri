import { SupportedLanguage } from "../../../../_shared/types.ts";
import { generateUnsubscribeUrl } from "../../../../_shared/utils/unsubscribe.ts";
import { emailStyles } from "../styles.ts";

export const hiTemplate = (
  data: Record<string, any>,
  language: SupportedLanguage,
) => {
  const { email } = data || {};
  const unsubscribeUrl = generateUnsubscribeUrl(email || "", language);

  return {
    subject: "[Osiri] न्यूजलेटर सदस्यता की पुष्टि",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>${emailStyles}</style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 class="title">Osiri न्यूजलेटर में आपका स्वागत है</h1>
              <p class="subtitle">हमारे अपडेट्स की सदस्यता लेने के लिए धन्यवाद</p>
            </div>
            <div class="content">
              <p>प्रिय सदस्य,</p>
              <p>Osiri न्यूजलेटर की सदस्यता लेने के लिए धन्यवाद! अब आप नियमित रूप से अपडेट प्राप्त करेंगे:</p>
              <div class="benefits">
                <div class="benefit-item">
                  <span class="benefit-icon">📱</span>
                  <div>
                    <strong>नई सुविधाएं</strong>
                    <p>ऐप की नई सुविधाओं के बारे में सबसे पहले जानें</p>
                  </div>
                </div>
                <div class="benefit-item">
                  <span class="benefit-icon">📰</span>
                  <div>
                    <strong>टेक समाचार</strong>
                    <p>दैनिक चुनिंदा टेक समाचार और विश्लेषण</p>
                  </div>
                </div>
                <div class="benefit-item">
                  <span class="benefit-icon">💡</span>
                  <div>
                    <strong>टिप्स और ट्रिक्स</strong>
                    <p>Osiri का सर्वोत्तम उपयोग करें</p>
                  </div>
                </div>
              </div>
              <p>हमारे अगले अपडेट का इंतजार करें!</p>
              <a href="https://o-siri.com" class="cta-button">हमारी वेबसाइट देखें</a>
              <div class="footer">
                <p>© 2024 Osiri by Dig Da Tech LLC. सर्वाधिकार सुरक्षित।</p>
                <p>यदि आप सदस्यता समाप्त करना चाहते हैं, तो <a href="${unsubscribeUrl}">यहां क्लिक करें</a>।</p>
                <p>यदि आपके कोई प्रश्न हैं, तो कृपया हमें support@o-siri.com पर संपर्क करें</p>
              </div>
            </div>
          </div>
        </body>
      </html>`,
  };
};
