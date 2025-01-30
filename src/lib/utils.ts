import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Currency } from "./i18n/languages";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Currency configuration for Stripe
 * Reference: https://stripe.com/docs/currencies
 */
export const CURRENCY_CONFIG: Record<
  Currency,
  {
    symbol: string;
    decimalPlaces: number;
    zeroDecimal: boolean; // Whether the currency uses zero decimal places in Stripe
  }
> = {
  usd: { symbol: "$", decimalPlaces: 2, zeroDecimal: false },
  jpy: { symbol: "¥", decimalPlaces: 0, zeroDecimal: true },
  cny: { symbol: "¥", decimalPlaces: 2, zeroDecimal: false },
  krw: { symbol: "₩", decimalPlaces: 0, zeroDecimal: true },
  eur: { symbol: "€", decimalPlaces: 2, zeroDecimal: false },
  inr: { symbol: "₹", decimalPlaces: 2, zeroDecimal: false },
  brl: { symbol: "R$", decimalPlaces: 2, zeroDecimal: false },
  bdt: { symbol: "৳", decimalPlaces: 2, zeroDecimal: false },
  rub: { symbol: "₽", decimalPlaces: 2, zeroDecimal: false },
  idr: { symbol: "Rp", decimalPlaces: 0, zeroDecimal: true },
};
/**
 * Formats a price amount according to the currency's configuration
 * @param amount - The amount in the smallest currency unit (e.g., cents for USD)
 * @param currency - The currency code
 * @returns Formatted price string with the appropriate currency symbol and decimal places
 */
export function formatPrice(amount: number, currency: Currency): string {
  const config = CURRENCY_CONFIG[currency];

  // Convert amount based on whether it's a zero-decimal currency
  const convertedAmount = config.zeroDecimal ? amount : amount / 100;

  const formatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: config.decimalPlaces,
    maximumFractionDigits: config.decimalPlaces,
  });

  return `${config.symbol}${formatter.format(convertedAmount)}`;
}
