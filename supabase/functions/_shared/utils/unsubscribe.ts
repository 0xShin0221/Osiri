import { encodeBase64 } from "jsr:@std/encoding";

export const generateUnsubscribeUrl = (email: string): string => {
  const base64Email = encodeBase64(email);
  return `https://osiri.xyz/unsubscribe?token=${base64Email}`;
};