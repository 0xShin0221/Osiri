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
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-client-info, apikey',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
}

const handleWithCors = (
  handler: (req: Request) => Promise<Response>
) => {
  return (req: Request) => {
    if (req.method === "OPTIONS") {
      return new Response("ok", { headers: corsHeaders })
    }

    return handler(req)
  }
}

serve(handleWithCors(async (req) => {
  try {
    const { to, template, language, data } = await req.json() as EmailPayload;
    console.info('Request payload:', { to, template, language, data });
    if (!to || !template || !language) {
      throw new Error("Missing required fields in request body");
    }

    const emailContent = getTemplateContent(template, language, data);
    console.info('Email content:', emailContent);
    const result = await sendEmail(to, emailContent.subject, emailContent.html);
    console.info('Email sent:', result);


    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Error sending email:', error.message);
    return new Response(JSON.stringify({ error: error }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

/* To invoke locally:
  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/emails' \
    --header 'Content-Type: application/json' \
    --data '{"to":"sintaronettt@gmail.com","template":"early-access","language":"en"}'
*/