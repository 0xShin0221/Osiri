import { createStripePlans } from "./stripe/setup";

import fs from "fs/promises";
import { generateInsertSql } from "./supabase/genSql";
import { StripeResult } from "./types/models";

async function main() {
    try {
        console.log("Starting Stripe plan creation...");

        // Save results to JSON for reference
        // const results = await createStripePlans();
        // await fs.writeFile(
        //     "stripe_results.json",
        //     JSON.stringify(results, null, 2),
        // );
        // console.log("Saved results to stripe_results.json");

        // Read the JSON file
        const jsonContent = await fs.readFile("stripe_results.json", "utf-8");
        const results = JSON.parse(jsonContent) as StripeResult[];

        // Generate SQL
        await generateInsertSql(results);
        console.log("Generated insert_plans.sql");
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
}

main();
