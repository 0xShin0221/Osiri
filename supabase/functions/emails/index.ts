import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { EmailPayload } from './utils/types.ts';
import { sendEmail } from "./utils/resend.ts";
import { getEarlyAccessTemplate } from "./templates/early-access/index.ts";

const getTemplateContent = (template: string, language: string, data?: Record<string, any>) => {
  switch (template) {
    case 'early-access':
      return getEarlyAccessTemplate(language, data);
    default:
      throw new Error(`Unknown template: ${template}`);
  }
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  try {
    const { to, template, language, data } = await req.json() as EmailPayload;

    const emailContent = getTemplateContent(template, language, data);
    const result = await sendEmail(to, emailContent.subject, emailContent.html);

    return new Response(
      JSON.stringify(result),
      {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      },
    );
  }
});

/* To invoke locally:
  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/emails' \
    --header 'Content-Type: application/json' \
    --data '{"to":"sintaronettt@gmail.com","template":"early-access","language":"en"}'
*/