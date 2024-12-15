import { emailStyles } from "../styles.ts";

export const koTemplate = (data?: Record<string, any>) => {
  const { name } = data || {};
  return {
    subject: `Osiri 조기 액세스 등록 | 무료 쿠폰 받기`,
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
            <h1 class="title">Osiri 조기 액세스에 오신 것을 환영합니다</h1>
            <p class="subtitle">Osiri App의 글로벌 AI 뉴스 피드를 위한 특별 쿠폰을 받으셨습니다</p>
            <p>(쿠폰은 베타 버전 출시 전에 발송됩니다.)</p>
          </div>
          
          <div class="content">
            <p>${name}님, 저희 조기 액세스 프로그램에 등록해 주셔서 감사합니다! 감사의 의미로 다음과 같은 혜택을 제공해 드립니다:</p>
            
            <div class="benefits">
              <div class="benefit-item">
                <span class="benefit-icon">✨</span>
                <div>
                  <strong>1년간 50% 할인</strong>
                  <p>정가의 절반 가격으로 이용하세요</p>
                </div>
              </div>
              
              <div class="benefit-item">
                <span class="benefit-icon">🎯</span>
                <div>
                  <strong>우선 접근 권한</strong>
                  <p>새로운 기능과 업데이트를 가장 먼저 경험하세요</p>
                </div>
              </div>
              
              <div class="benefit-item">
                <span class="benefit-icon">👋</span>
                <div>
                  <strong>전담 지원</strong>
                  <p>지원 팀에 직접 문의할 수 있습니다</p>
                </div>
              </div>
            </div>

            <p>베타 서비스가 시작되면 다시 연락드리겠습니다. 조금만 기다려 주세요.</p>
            
            <a href="https://osiri.xyz" class="cta-button">웹사이트 방문하기</a>
            
            <div class="footer">
              <p>© 2024 Osiri by Dig Da Tech LLC. All rights reserved.</p>
              <p>문의 사항이 있으시면 support@osiri.xyz로 연락해 주세요.</p>
            </div>
          </div>
        </div>
      </body>
    </html>
    `,
  };
};
