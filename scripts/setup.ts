// scripts/setup.ts
import { createStripePlans } from "./stripe/plan";
import { setupWebhooks } from "./stripe/webhook";
import fs from "fs/promises";
import { generateInsertSql } from "./supabase/genSql";
import { StripeResult } from "./types/models";
import * as dotenv from "dotenv";

dotenv.config();

if (!process.env.STRIPE_SECRET_KEY) {
    console.error(
        "Error: STRIPE_SECRET_KEY is not set in the environment variables",
    );
    process.exit(1);
}

const STRIPE_RESULTS_FILE = "stripe_results.json";
const SQL_OUTPUT_FILE = "insert_plans.sql";

class StripeSetupManager {
    private stripeSecretKey: string;

    constructor() {
        this.stripeSecretKey = process.env.STRIPE_SECRET_KEY || (() => {
            throw new Error("STRIPE_SECRET_KEY is not defined");
        })();
    }
    private async saveResultsToFile(results: StripeResult[]): Promise<void> {
        await fs.writeFile(
            STRIPE_RESULTS_FILE,
            JSON.stringify(results, null, 2),
        );
        console.log(`Saved results to ${STRIPE_RESULTS_FILE}`);
    }

    private async readResultsFromFile(): Promise<StripeResult[]> {
        const jsonContent = await fs.readFile(STRIPE_RESULTS_FILE, "utf-8");
        return JSON.parse(jsonContent) as StripeResult[];
    }

    async registerPlansToStripe(): Promise<void> {
        try {
            console.log("Starting Stripe plan creation...");
            const results = await createStripePlans();
            await this.saveResultsToFile(results);
        } catch (error) {
            console.error("Error registering plans to Stripe:", error);
            throw error;
        }
    }

    async setupWebhook(baseUrl: string): Promise<void> {
        try {
            console.log("Starting Stripe webhook setup...");
            await setupWebhooks(baseUrl);
        } catch (error) {
            console.error("Error setting up webhook:", error);
            throw error;
        }
    }

    async generateSqlFromResults(): Promise<void> {
        try {
            const results = await this.readResultsFromFile();
            await generateInsertSql(results);
            console.log(`Generated ${SQL_OUTPUT_FILE}`);
        } catch (error) {
            console.error("Error generating SQL:", error);
            throw error;
        }
    }
}

async function main() {
    dotenv.config();
    const setupManager = new StripeSetupManager();
    const BASE_URL = process.env.BASE_URL || "http://localhost:54321"; // Supabase Edge Functions default URL

    try {
        // 1. Register plans to Stripe
        await setupManager.registerPlansToStripe();

        // 2. Setup webhook
        await setupManager.setupWebhook(BASE_URL);

        // 3. Generate SQL
        await setupManager.generateSqlFromResults();

        console.log("Setup completed successfully!");
    } catch (error) {
        console.error("Setup process failed:", error);
        process.exit(1);
    }
}

main();
