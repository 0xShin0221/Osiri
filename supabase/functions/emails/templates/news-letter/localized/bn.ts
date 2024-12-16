import { SupportedLanguage } from "../../../../_shared/types.ts";
import { generateUnsubscribeUrl } from "../../../../_shared/utils/unsubscribe.ts";
import { emailStyles } from "../styles.ts";

export const bnTemplate = (
  data: Record<string, any>,
  language: SupportedLanguage,
) => {
  const { email } = data || {};
  const unsubscribeUrl = generateUnsubscribeUrl(email || "", language);
  return {
    subject: "[Osiri] নিউজলেটার সাবস্ক্রিপশন নিশ্চিত করা হয়েছে",
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
            <h1 class="title">Osiri নিউজলেটারে স্বাগতম</h1>
            <p class="subtitle">আমাদের আপডেট সাবস্ক্রাইব করার জন্য ধন্যবাদ</p>
          </div>
          
          <div class="content">
            <p>প্রিয় সাবস্ক্রাইবার,</p>
            <p>Osiri নিউজলেটারে সাবস্ক্রাইব করার জন্য ধন্যবাদ! আপনি এখন নিয়মিত আপডেট পাবেন:</p>
            
            <div class="benefits">
              <div class="benefit-item">
                <span class="benefit-icon">📱</span>
                <div>
                  <strong>নতুন ফিচার</strong>
                  <p>নতুন অ্যাপ ফিচার সম্পর্কে প্রথম জানুন</p>
                </div>
              </div>
              
              <div class="benefit-item">
                <span class="benefit-icon">📰</span>
                <div>
                  <strong>টেক নিউজ</strong>
                  <p>দৈনিক কিউরেটেড টেক নিউজ এবং ইনসাইট</p>
                </div>
              </div>
              
              <div class="benefit-item">
                <span class="benefit-icon">💡</span>
                <div>
                  <strong>টিপস ও ট্রিকস</strong>
                  <p>Osiri থেকে সর্বোচ্চ সুবিধা নিন</p>
                </div>
              </div>
            </div>

            <p>আমাদের পরবর্তী আপডেটের জন্য অপেক্ষা করুন!</p>
            
            <a href="https://osiri.xyz" class="cta-button">ওয়েবসাইট দেখুন</a>
            
            <div class="footer">
              <p>© 2024 Osiri by Dig Da Tech LLC. সর্বস্বত্ব সংরক্ষিত।</p>
              <p>আপনি যদি সাবস্ক্রিপশন বাতিল করতে চান, <a href="${unsubscribeUrl}">এখানে ক্লিক করুন</a>।</p>
              <p>কোনো প্রশ্ন থাকলে, support@osiri.xyz-তে যোগাযোগ করুন</p>
            </div>
          </div>
        </div>
      </body>
    </html>
    `,
  };
};
