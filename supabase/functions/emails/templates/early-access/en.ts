import { emailStyles } from './styles.ts';

export const enTemplate = {
  subject: '[Osiri] Thanks for joining Early Access',
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
           <h1 class="title">Welcome to Osiri Early Access</h1>
           <p class="subtitle">You're getting exclusive access to our global tech intelligence platform</p>
         </div>
         
         <div class="content">
           <p>Thank you for joining our early access program. As one of our first members, you'll receive these exclusive benefits:</p>
           
           <div class="benefits">
             <div class="benefit-item">
               <span class="benefit-icon">✨</span>
               <div>
                 <strong>50% Lifetime Discount</strong>
                 <p>Get half off our regular price for a full year</p>
               </div>
             </div>
             
             <div class="benefit-item">
               <span class="benefit-icon">🎯</span>
               <div>
                 <strong>Priority Access</strong>
                 <p>Be the first to try new features and updates</p>
               </div>
             </div>
             
             <div class="benefit-item">
               <span class="benefit-icon">👋</span>
               <div>
                 <strong>Dedicated Support</strong>
                 <p>Direct access to our support team</p>
               </div>
             </div>
           </div>

           <p>We'll notify you as soon as we launch. Stay tuned for updates!</p>
           
           <a href="https://osiri.xyz" class="cta-button">Visit Our Website</a>
           
           <div class="footer">
             <p>© 2024 Osiri by Dig Da Tech LLC. All rights reserved.</p>
             <p>If you have any questions, contact us at support@osiri.xyz</p>
           </div>
         </div>
       </div>
      </body>
    </html>
  `
};
