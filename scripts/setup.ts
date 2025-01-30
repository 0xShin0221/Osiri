import path from "path";
import * as dotenv from "dotenv";
import { promises as fs } from "fs";
import { StripeResult } from "./types/models";

// Debug: Print current working directory and env path
const currentDir = process.cwd();
console.log("Current Directory:", currentDir);

// Load environment variables from project root
const envPath = path.resolve(currentDir, "../.env");
console.log("Env Path:", envPath);

// Try to read .env file directly
try {
    const envContent = await fs.readFile(envPath, "utf-8");
    console.log(".env file exists. Content loaded successfully");
} catch (error) {
    console.error("Error reading .env file:", error);
}

// Load environment variables
const result = dotenv.config({ path: envPath });
console.log("Dotenv Result:", {
    error: result.error ? "Error loading .env" : null,
    parsed: result.parsed ? "Config loaded" : null,
});

// Debug: Print environment variables (safely)
console.log("Environment variables after loading:", {
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY
        ? "exists (length: " + process.env.STRIPE_SECRET_KEY.length + ")"
        : "undefined",
    BASE_URL: process.env.STRIPE_WEBHOOK_BASE_URL,
});

// Verify environment variables
const stripeKey = process.env.STRIPE_SECRET_KEY?.trim();
if (!stripeKey) {
    console.error(
        "Error: STRIPE_SECRET_KEY is not set in the environment variables",
    );
    process.exit(1);
}

// Initialize Stripe
import { initializeStripe } from "./stripe/client";
import { createStripePlans } from "./stripe/plan";
import { setupWebhooks } from "./stripe/webhook";
import { generateInsertSql } from "./supabase/genSql";

// Initialize Stripe client
initializeStripe(stripeKey);

const STRIPE_RESULTS_FILE = path.resolve(currentDir, "stripe_results.json");
const SQL_OUTPUT_FILE = path.resolve(currentDir, "insert_plans.sql");

class StripeSetupManager {
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
    const setupManager = new StripeSetupManager();
    const BASE_URL = process.env.STRIPE_WEBHOOK_BASE_URL ||
        "http://localhost:54321";

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
