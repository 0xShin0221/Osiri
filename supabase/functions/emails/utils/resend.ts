export const sendEmail = async (to: string, subject: string, html: string) => {
  const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
  const FROM_EMAIL = "noreply@o-siri.com";

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to,
      subject,
      html,
    }),
  });

  return response.json();
};
