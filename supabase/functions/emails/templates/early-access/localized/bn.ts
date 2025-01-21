import { emailStyles } from "../styles.ts";

export const bnTemplate = (data?: Record<string, any>) => {
  const { name } = data || {};
  return {
    subject: `Osiri-এর প্রাথমিক অ্যাক্সেস নিবন্ধন | বিনামূল্যে কুপন পান`,
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
            <h1 class="title">Osiri প্রাথমিক অ্যাক্সেসে আপনাকে স্বাগতম</h1>
            <p class="subtitle">আপনি Osiri App-এর গ্লোবাল AI নিউজ ফিডের জন্য একটি বিশেষ কুপন পেয়েছেন</p>
            <p>(কুপনটি বিটা সংস্করণ প্রকাশের আগে আপনাকে পাঠানো হবে।)</p>
          </div>
          
          <div class="content">
            <p>${name}, আমাদের প্রাথমিক অ্যাক্সেস প্রোগ্রামে যোগদানের জন্য ধন্যবাদ! আপনার অংশগ্রহণের জন্য আমরা আপনাকে নিম্নলিখিত সুবিধাগুলি প্রদান করছি:</p>
            
            <div class="benefits">
              <div class="benefit-item">
                <span class="benefit-icon">✨</span>
                <div>
                  <strong>১ বছরের জন্য ৫০% ছাড়</strong>
                  <p>স্ট্যান্ডার্ড মূল্যের অর্ধেক উপভোগ করুন</p>
                </div>
              </div>
              
              <div class="benefit-item">
                <span class="benefit-icon">🎯</span>
                <div>
                  <strong>অগ্রাধিকার অ্যাক্সেস</strong>
                  <p>নতুন বৈশিষ্ট্য এবং আপডেটগুলি সবার আগে ব্যবহার করুন</p>
                </div>
              </div>
              
              <div class="benefit-item">
                <span class="benefit-icon">👋</span>
                <div>
                  <strong>নির্দিষ্ট সহায়তা</strong>
                  <p>আমাদের সহায়তা টিমের সাথে সরাসরি যোগাযোগ করুন</p>
                </div>
              </div>
            </div>

            <p>আমরা বিটা পরিষেবা চালু হলে আবার আপনার সাথে যোগাযোগ করব। অনুগ্রহ করে অপেক্ষা করুন।</p>
            
            <a href="https://o-siri.com" class="cta-button">ওয়েবসাইট দেখুন</a>
            
            <div class="footer">
              <p>© 2024 Osiri by Dig Da Tech LLC. সর্বস্বত্ব সংরক্ষিত।</p>
              <p>যদি আপনার কোনও প্রশ্ন থাকে, দয়া করে support@o-siri.com-এ যোগাযোগ করুন।</p>
            </div>
          </div>
        </div>
      </body>
    </html>
    `,
  };
};
