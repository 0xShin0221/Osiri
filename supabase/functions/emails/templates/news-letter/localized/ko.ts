import { emailStyles } from "../styles.ts";

export const koTemplate = (data?: Record<string, any>) => {
    const { email } = data || {};
    return {
      subject: "[Osiri] 뉴스레터 구독 확인",
      html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>${emailStyles}</style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 class="title">Osiri 뉴스레터에 오신 것을 환영합니다</h1>
              <p class="subtitle">업데이트 구독해 주셔서 감사합니다</p>
            </div>
            <div class="content">
              <p>구독자님,</p>
              <p>Osiri 뉴스레터를 구독해 주셔서 감사합니다! 이제 다음과 같은 정기 업데이트를 받으실 수 있습니다:</p>
              <div class="benefits">
                <div class="benefit-item">
                  <span class="benefit-icon">📱</span>
                  <div>
                    <strong>새로운 기능</strong>
                    <p>앱의 새로운 기능을 가장 먼저 확인하세요</p>
                  </div>
                </div>
                <div class="benefit-item">
                  <span class="benefit-icon">📰</span>
                  <div>
                    <strong>테크 뉴스</strong>
                    <p>매일 엄선된 테크 뉴스와 인사이트</p>
                  </div>
                </div>
                <div class="benefit-item">
                  <span class="benefit-icon">💡</span>
                  <div>
                    <strong>팁과 요령</strong>
                    <p>Osiri를 최대한 활용하세요</p>
                  </div>
                </div>
              </div>
              <p>다음 업데이트를 기대해 주세요!</p>
              <a href="https://osiri.xyz" class="cta-button">웹사이트 방문하기</a>
              <div class="footer">
                <p>© 2024 Osiri by Dig Da Tech LLC. 모든 권리 보유.</p>
                <p>이메일의 링크를 클릭하여 언제든지 구독을 취소할 수 있습니다.</p>
                <p>문의사항이 있으시면 support@osiri.xyz로 연락해 주세요</p>
              </div>
            </div>
          </div>
        </body>
      </html>`,
    };
  };