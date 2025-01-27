import fs from "fs/promises";
import { format } from "sql-formatter";
import { StripeResult } from "../types/models";

function escapeSqlString(str: string): string {
    if (str === null || str === undefined) return "NULL";
    return `'${str.replace(/'/g, "''")}'`;
}

export async function generateInsertSql(results: StripeResult[]) {
    const insertPlans = results.map((r) => {
        const values = [
            "gen_random_uuid()", // id
            escapeSqlString(r.name),
            escapeSqlString(r.description),
            escapeSqlString(r.currency),
            r.base_price_amount,
            escapeSqlString(r.stripe_product_id),
            escapeSqlString(r.stripe_base_price_id),
            r.stripe_metered_price_id
                ? escapeSqlString(r.stripe_metered_price_id)
                : "NULL",
            r.base_notifications_per_day,
            r.has_usage_billing ? "true" : "false",
            r.sort_order,
            "true", // is_active
        ];

        return `INSERT INTO subscription_plans (
            id,
            name,
            description,
            currency,
            base_price_amount,
            stripe_product_id,
            stripe_base_price_id,
            stripe_metered_price_id,
            base_notifications_per_day,
            has_usage_billing,
            sort_order,
            is_active
        ) VALUES (
            ${values.join(",\n            ")}
        );`;
    }).join("\n\n");

    // Format SQL with PostgreSQL dialect
    const sql = format(insertPlans, {
        language: "postgresql",
        keywordCase: "upper",
        indentStyle: "standard",
    });

    await fs.writeFile("insert_plans.sql", sql);
}
