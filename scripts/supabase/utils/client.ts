import { createClient } from "@supabase/supabase-js";

import * as dotenv from "dotenv";

dotenv.config();
if (!process.env.SUPABASE_URL) throw new Error("Missing SUPABASE_URL");
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");
}

export const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
        db: {
            schema: "public",
        },
        global: {
            fetch: fetch.bind(globalThis),
            headers: { "x-statement-timeout": "60000" },
        },
    },
);
