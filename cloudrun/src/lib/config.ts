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
            ];

            const secrets: Partial<AppSecrets> = {};
            secretKeys.forEach((key) => {
                if (process.env[key]) {
                    secrets[key] = process.env[key] as string;
                }
            });

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
}
