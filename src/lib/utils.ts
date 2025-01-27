import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Currency } from "./i18n/languages";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number, currency: Currency): string {
  const formatters: Record<Currency, (amount: number) => string> = {
    usd: (amount) => `$${amount.toFixed(2)}`,
    jpy: (amount) => `¥${amount.toLocaleString()}`,
    cny: (amount) => `¥${amount.toFixed(2)}`,
    krw: (amount) => `₩${amount.toLocaleString()}`,
    eur: (amount) => `€${amount.toFixed(2)}`,
    inr: (amount) => `₹${amount.toFixed(2)}`,
    brl: (amount) => `R$${amount.toFixed(2)}`,
    bdt: (amount) => `৳${amount.toFixed(2)}`,
    rub: (amount) => `₽${amount.toFixed(2)}`,
    idr: (amount) => `Rp${amount.toLocaleString()}`,
  };

  return formatters[currency](amount);
}
