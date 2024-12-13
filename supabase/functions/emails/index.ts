import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import {
  EmailPayload,
  EmailTemplateContent,
  NotificationTemplate,
} from "../_shared/types.ts";
import { sendEmail } from "./utils/resend.ts";
import { getEarlyAccessTemplate } from "./templates/early-access/index.ts";
import { corsHeaders, handleWithCors } from "../_shared/cors.ts";
import { saveToWaitlist } from "../_shared/db.ts";
import { slackNotify } from "../_shared/slack.ts";

const getTemplateContent = (
  template: NotificationTemplate,
  language: string,
  data?: Record<string, any>,
): EmailTemplateContent => {
  console.info("getTemplateContent Input:", { template, language, data });

  switch (template) {
    case "early-access":
      return getEarlyAccessTemplate(language, data);
    case "contact":
    case "feedback":
      // Add other template handlers here
      throw new Error(`Template ${template} not implemented yet`);
    default:
      console.error(`Unknown template: ${template}`);
      throw new Error(`Unknown template: ${template}`);
  }
};

Deno.serve(handleWithCors(async (req) => {
  try {
    const { to, template, language, data } = await req.json() as EmailPayload;
    console.info("Request payload:", { to, template, language, data });

    if (!to || !template || !language) {
      throw new Error("Missing required fields in request body");
    }

    await saveToWaitlist(to, language, data);

    const emailContent = getTemplateContent(template, language, data);
    console.info("Email content:", emailContent);
    const result = await sendEmail(to, emailContent.subject, emailContent.html);
    console.info("Email sent:", result);

    await slackNotify({
      email: to,
      language,
      template,
      data,
    });

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error sending email:", error.message);
    return new Response(JSON.stringify({ error: error }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
}));

/* To invoke locally:
  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/emails' \
    --header 'Content-Type: application/json' \
    --data '{"to":"sintaronettt@gmail.com","template":"early-access","language":"en"}'
*/
