import { z } from "zod";
import { Currency } from "../../types/models";

export const planSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    base_price_amount: z.number().int(),
    currency: z.enum([
        "usd",
        "jpy",
        "cny",
        "krw",
        "eur",
        "inr",
        "brl",
        "bdt",
        "rub",
        "idr",
    ] as [Currency, ...Currency[]]),
    base_notifications_per_day: z.number().int(),
    sort_order: z.number().int(),
    metered: z.object({
        unitAmount: z.number(),
    }).optional(),
});

export type ValidatedPlan = z.infer<typeof planSchema>;
