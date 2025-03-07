import * as dotenv from "dotenv";
import path from "path";
export interface AppSecrets {
    OPENAI_API_KEY: string;
    SUPABASE_URL: string;
    SUPABASE_SERVICE_KEY: string;
    LANGCHAIN_API_KEY: string;
    LANGSMITH_API_KEY: string;
    LANGSMITH_PROJECT_NAME: string;
    API_KEYS: string;
    GOOGLE_API_KEY: string;
    SLACK_CLIENT_ID: string;
    SLACK_CLIENT_SECRET: string;
    DISCORD_CLIENT_ID: string;
    DISCORD_CLIENT_SECRET: string;
    DISCORD_BOT_TOKEN: string;
}

export interface AppConfig {
    environment: string;
    isProduction: boolean;
    isDevelopment: boolean;
    isTest: boolean;
    version: string;
    apiUrl: string;
    corsOrigins: string[];
}
export class ConfigManager {
    private static instance: ConfigManager;
    private secrets: Partial<AppSecrets> = {};
    private readonly isDevelopment: boolean;

    private constructor() {
        this.isDevelopment = process.env.NODE_ENV === "development";
        this.loadSecrets();
    }

    public static getInstance(): ConfigManager {
        if (!ConfigManager.instance) {
            ConfigManager.instance = new ConfigManager();
        }
        return ConfigManager.instance;
    }

    private loadSecrets(): void {
        if (this.isDevelopment) {
            const envPath = path.resolve(process.cwd(), ".env");
            dotenv.config({ path: envPath });

            // In development, construct APP_SECRETS from individual environment variables
            const secretKeys: (keyof AppSecrets)[] = [
                "OPENAI_API_KEY",
                "SUPABASE_URL",
                "SUPABASE_SERVICE_KEY",
                "LANGCHAIN_API_KEY",
                "LANGSMITH_API_KEY",
                "LANGSMITH_PROJECT_NAME",
                "API_KEYS",
                "GOOGLE_API_KEY",
                "SLACK_CLIENT_ID",
                "SLACK_CLIENT_SECRET",
                "DISCORD_CLIENT_ID",
                "DISCORD_CLIENT_SECRET",
                "DISCORD_BOT_TOKEN",
            ];

            const secrets: Partial<AppSecrets> = {};
            for (const key of secretKeys) {
                if (process.env[key]) {
                    secrets[key] = process.env[key] as string;
                }
            }

            // Set APP_SECRETS environment variable
            process.env.APP_SECRETS = JSON.stringify(secrets);
        }
        const appSecrets = process.env.APP_SECRETS;

        if (appSecrets) {
            try {
                this.secrets = JSON.parse(appSecrets);
            } catch (error) {
                console.warn("Failed to parse APP_SECRETS:", error);
            }
        }

        this.validateRequiredSecrets();
    }

    private validateRequiredSecrets(): void {
        const requiredKeys: (keyof AppSecrets)[] = [
            "OPENAI_API_KEY",
            "SUPABASE_URL",
            "SUPABASE_SERVICE_KEY",
            "LANGCHAIN_API_KEY", // LangChain API Key
            "LANGSMITH_API_KEY", // LangSmith API Key
            "GOOGLE_API_KEY",
            "SLACK_CLIENT_ID", // Add Slack client ID
            "SLACK_CLIENT_SECRET", // Add Slack client secret
            "DISCORD_CLIENT_ID", // Add Discord client ID
            "DISCORD_CLIENT_SECRET", // Add Discord client secret
            "DISCORD_BOT_TOKEN", // Add Discord bot token
        ];

        const missingKeys = requiredKeys.filter((key) => !this.get(key));
        if (missingKeys.length > 0) {
            throw new Error(
                `Missing required configuration: ${missingKeys.join(", ")}`,
            );
        }
    }

    public get<K extends keyof AppSecrets>(key: K): string | undefined {
        if (key in this.secrets) {
            return this.secrets[key];
        }
        return process.env[key];
    }

    public getOrThrow<K extends keyof AppSecrets>(key: K): string {
        const value = this.get(key);
        if (!value) {
            throw new Error(`Required configuration '${key}' is missing`);
        }
        return value;
    }

    // Helper method for LangChain/LangSmith configuration
    public getLangChainConfig() {
        return {
            langchainApiKey: this.getOrThrow("LANGCHAIN_API_KEY"),
            langsmithApiKey: this.getOrThrow("LANGSMITH_API_KEY"),
            endpoint: "https://api.smith.langchain.com",
            projectName: this.getOrThrow("LANGSMITH_PROJECT_NAME"),
        };
    }

    // Helper method for OpenAI configuration
    public getOpenAIConfig() {
        return {
            apiKey: this.getOrThrow("OPENAI_API_KEY"),
        };
    }

    public getSlackConfig() {
        return {
            clientId: this.getOrThrow("SLACK_CLIENT_ID"),
            clientSecret: this.getOrThrow("SLACK_CLIENT_SECRET"),
        };
    }

    // Helper method for Supabase configuration
    public getSupabaseConfig() {
        return {
            url: this.getOrThrow("SUPABASE_URL"),
            serviceKey: this.getOrThrow("SUPABASE_SERVICE_KEY"),
        };
    }

    public getGoogleGeminiConfig() {
        return {
            apiKey: this.getOrThrow("GOOGLE_API_KEY"),
        };
    }

    public getDiscordConfig() {
        return {
            clientId: this.getOrThrow("DISCORD_CLIENT_ID"),
            clientSecret: this.getOrThrow("DISCORD_CLIENT_SECRET"),
            botToken: this.getOrThrow("DISCORD_BOT_TOKEN"),
        };
    }
}
