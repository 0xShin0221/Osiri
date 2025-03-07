import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import {
  EmailPayload,
  EmailTemplateContent,
  NotificationTemplate,
  SupportedLanguage,
} from "../_shared/types.ts";
import { sendEmail } from "./utils/resend.ts";
import { getEarlyAccessTemplate } from "./templates/early-access/index.ts";
import { getNewsletterTemplate } from "./templates/news-letter/index.ts";
import { corsHeaders, handleWithCors } from "../_shared/cors.ts";

import { slackNotify } from "../_shared/slack.ts";
import { waitlist } from "../_shared/db/waitlist.ts";
import { newsletter } from "../_shared/db/newsletter.ts";

const getTemplateContent = (
  template: NotificationTemplate,
  language: SupportedLanguage,
  data?: Record<string, any>,
): EmailTemplateContent => {
  console.info("getTemplateContent Input:", { template, language, data });

  switch (template) {
    case "early-access":
      return getEarlyAccessTemplate(language, data);
    case "newsletter":
      return getNewsletterTemplate(language, data);
    case "contact":
      throw new Error(`Template ${template} not implemented yet`);
    case "feedback":
      throw new Error(`Template ${template} not implemented yet`);
    default:
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

    switch (template) {
      case "early-access":
        await waitlist.save(to, language, data);
        break;
      case "newsletter":
        await newsletter.subscribe(to, language);
        break;
      default:
        throw new Error(`Unknown template: ${template}`);
    }

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
