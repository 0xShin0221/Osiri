export const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'content-type, authorization, x-client-info, apikey',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  }

  export const handleWithCors = (
    handler: (req: Request) => Promise<Response>
  ) => {
    return (req: Request) => {
      if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders })
      }
  
      return handler(req)
    }
  }