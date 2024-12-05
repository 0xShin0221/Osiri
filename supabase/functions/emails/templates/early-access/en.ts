import { emailStyles } from './styles.ts';

export const enTemplate = (data?: Record<string, any>) => {
  console.info('enTemplate Input:', data);

  if (!data || !data.name) {
    throw new Error('enTemplate requires a name field in data');
  }

  return {
    subject: '[Osiri App] Thanks for Joining Early Access',
    html: `
      <html>
        <body>
          <h1>Welcome to Osiri Early Access</h1>
          <p>Dear ${data.name},</p>
          <p>Thank you for signing up!</p>
        </body>
      </html>
    `,
  };
};
