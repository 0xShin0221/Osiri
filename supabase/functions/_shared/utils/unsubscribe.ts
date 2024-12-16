import { encodeBase64Url } from "jsr:@std/encoding";

export const generateUnsubscribeUrl = (email: string): string => {
  const base64Email = encodeBase64Url(email);
  return `https://osiri.xyz/unsubscribe?token=${base64Email}`;
};