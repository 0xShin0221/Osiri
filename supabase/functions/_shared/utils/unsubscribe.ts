import { encodeBase64Url } from "jsr:@std/encoding";
import { SupportedLanguage } from "../types.ts";

export const generateUnsubscribeUrl = (
  email: string,
  language: SupportedLanguage,
): string => {
  const base64Email = encodeBase64Url(email);
  return `https://osiri.xyz/${language}/unsubscribe?token=${base64Email}`;
};
