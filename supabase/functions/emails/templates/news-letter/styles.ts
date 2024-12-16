export const emailStyles = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    line-height: 1.6;
    color: #1a1a1a;
    background-color: #f5f5f5;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  .container {
    max-width: 600px;
    margin: 0 auto;
    padding: 40px 20px;
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .header {
    text-align: center;
    margin-bottom: 32px;
    padding-bottom: 32px;
    border-bottom: 1px solid #e5e5e5;
  }

  .title {
    font-size: 28px;
    font-weight: bold;
    color: #4F46E5;
    margin-bottom: 12px;
  }

  .subtitle {
    font-size: 18px;
    color: #666666;
  }

  .content {
    margin-bottom: 32px;
  }

  .content p {
    margin-bottom: 16px;
    color: #333333;
  }

  .benefits {
    margin: 24px 0;
  }

  .benefit-item {
    display: flex;
    align-items: flex-start;
    margin-bottom: 20px;
    padding: 16px;
    background-color: #f8f9fa;
    border-radius: 8px;
  }

  .benefit-icon {
    font-size: 24px;
    margin-right: 16px;
    min-width: 32px;
    text-align: center;
  }

  .benefit-item strong {
    display: block;
    font-size: 18px;
    margin-bottom: 4px;
    color: #2d3748;
  }

  .benefit-item p {
    margin: 0;
    color: #4a5568;
  }

  .cta-button {
    display: inline-block;
    padding: 12px 24px;
    background: linear-gradient(to right, #4F46E5, #2563EB);
    color: #ffffff !important;
    text-decoration: none;
    border-radius: 6px;
    font-weight: bold;
    text-align: center;
    margin: 24px 0;
  }

  .footer {
    margin-top: 40px;
    padding-top: 24px;
    border-top: 1px solid #e5e5e5;
    font-size: 14px;
    color: #666666;
    text-align: center;
  }

  .footer p {
    margin-bottom: 8px;
  }

  @media only screen and (max-width: 600px) {
    .container {
      padding: 20px;
    }

    .title {
      font-size: 24px;
    }

    .subtitle {
      font-size: 16px;
    }

    .benefit-item {
      padding: 12px;
    }

    .benefit-icon {
      font-size: 20px;
    }

    .benefit-item strong {
      font-size: 16px;
    }
  }

  /* ダークモードのメールクライアント対応 */
  @media (prefers-color-scheme: dark) {
    body {
      background-color: #1a1a1a;
      color: #f5f5f5;
    }

    .container {
      background-color: #2d2d2d;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    .title {
      color: #6366f1;
    }

    .subtitle {
      color: #d1d1d1;
    }

    .content p {
      color: #f0f0f0;
    }

    .benefit-item {
      background-color: #363636;
    }

    .benefit-item strong {
      color: #f0f0f0;
    }

    .benefit-item p {
      color: #d1d1d1;
    }

    .footer {
      color: #d1d1d1;
    }
  }

  /* Outlook and Legacy MailClient Fallback */
  [data-ogsc] .container,
  [data-ogsb] .container {
    background-color: #ffffff !important;
  }

  [data-ogsc] .content p,
  [data-ogsb] .content p {
    color: #333333 !important;
  }
`;
