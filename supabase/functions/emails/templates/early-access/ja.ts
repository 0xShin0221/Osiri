import { emailStyles } from "./styles.ts";

export const jaTemplate = (data?: Record<string, any>) => {
  const { name } = data || {};
  return {
    subject: `Osiriでの早期アーリーアクセス登録| 無料クーポン取得`,
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

           <h1 class="title">Osiriアーリーアクセスへようこそ</h1>
           <p class="subtitle">グローバルなAIニュースフィードOsiri Appの特別クーポンを獲得しました</p>
           <p>(クーポン送付はベータ版リリース前に、送付されます。) </p>
         </div>
         
         <div class="content">
           <p>${name}さん、アーリーアクセスプログラムにご登録いただき、ありがとうございます。一番初めに目をかけてくだっさお礼として、以下のクーポンをご用意しております：</p>
           
           <div class="benefits">
             <div class="benefit-item">
               <span class="benefit-icon">✨</span>
               <div>
                 <strong>1年間50%オフ</strong>
                 <p>通常価格から半額でご利用いただけます</p>
               </div>
             </div>
             
             <div class="benefit-item">
               <span class="benefit-icon">🎯</span>
               <div>
                 <strong>優先アクセス権</strong>
                 <p>新機能やアップデートをいち早く体験できます</p>
               </div>
             </div>
             
             <div class="benefit-item">
               <span class="benefit-icon">👋</span>
               <div>
                 <strong>専任サポート</strong>
                 <p>サポートチームに直接アクセス可能です</p>
               </div>
             </div>
           </div>

           <p>ベータ版サービス開始時に改めてご連絡させていただきます。今しばらくお待ちください。</p>
           
           <a href="https://osiri.xyz" class="cta-button">ウェブサイトを見る</a>
           
           <div class="footer">
             <p>© 2024 Osiri by Dig Da Tech LLC. All rights reserved.</p>
             <p>ご不明な点がございましたら、support@osiri.xyz までお気軽にお問い合わせください。</p>
           </div>
         </div>
       </div>
      </body>
    </html>
  `,
  };
};
