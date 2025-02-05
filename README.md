# Osiri - AI-Powered Global Tech News RSS Reader

![Osiri Logo](public/assets/og-image.jpg)

Stay updated with global startup and tech trends in your native language. Osiri provides AI-powered summaries from 200+ trusted sources, updated hourly.

## 🌟 Features

- **Global Intelligence**: Access worldwide startup ecosystem news, tech updates, VC investments, and product design insights - all automatically curated and delivered to you
- **AI-Powered Insights**: Convert long articles into concise summaries using the latest GPT technology
- **Effortless Discovery**: Break through language barriers and access local information in your native language

## 🌐 Supported Languages

The following languages are currently supported in our application:

English (Default)
Japanese (日本語)
Chinese (中文)
French (Français)
Hindi (हिंदी)
Portuguese (Português)
Bengali (বাংলা)
Russian (Русский)
Indonesian (Bahasa Indonesia)
German (Deutsch)

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details

## 🔗 Links

- Website: [o-siri.com](https://o-siri.com)
- Twitter: [@OsiriApp](https://twitter.com/OsiriApp)
- LinkedIn: [Osiri](https://www.linkedin.com/company/osiri)
- GitHub: [osiriapp](https://github.com/osiriapp)

## 📫 Contact

For support or inquiries, please email: support@o-siri.com

# Development Environment Setup

This guide outlines the steps required to set up a new development environment, particularly focusing on Supabase and Stripe integration.

## Prerequisites

- Access to Supabase project
- Stripe account with permissions to create new environments
- Node.js and npm/npx installed

## Setup Steps

### 1. Reset Supabase Database

```bash
supabase db reset
```

### 2. Create New Stripe Environment

1. Navigate to your Stripe Dashboard
2. Create a new environment for the project
3. Note down the Secret Key for the next steps

### 3. Configure Environment and Run Setup Script

1. Add the Stripe Secret Key to your environment variables
2. Execute the setup script:

```bash
npx tsx scripts/setup.ts
```

### 4. Sync Remote Environment (Pre-Stripe Merge Only)

> ⚠️ Important: This step must be executed BEFORE merging Stripe changes. After merging, the Stripe environment will sync with local, requiring test environment reconstruction.

If you need to reset a linked Supabase environment to sync with local:

```bash
supabase db reset --linked
```

### 5. Execute Stripe Console Setup

1. Using the Secret Key from step 2, execute the Stripe setup SQL:

```bash
# Modify the API key in the file before running
psql -f migrations/1_stripe_setup_console.sql
```

### 6. Import Plan Data

Execute the generated plans SQL script in Supabase:

```bash
# Run the SQL script generated in step 3
psql -f scripts/insert_plans.sql
```

## Important Notes

- The order of operations is crucial, particularly regarding the timing of the Supabase reset relative to Stripe merges
- Always verify environment variables are correctly set before running scripts
- Keep your Stripe Secret Keys secure and never commit them to version control

## Troubleshooting

If you encounter issues during setup:

1. Verify all prerequisites are met
2. Ensure correct environment variables are set
3. Check Stripe API key permissions
4. Confirm Supabase connection details are correct

---

Developed with ❤️ by [DigDaTech](https://o-siri.com)
