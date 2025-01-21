import { assert, assertEquals } from "std/testing/asserts.ts";
import { decodeBase64Url } from "jsr:@std/encoding";
import { generateUnsubscribeUrl } from "../../_shared/utils/unsubscribe.ts";

Deno.test("Unsubscribe URL generation and decoding", () => {
  const testEmail = "test@example.com";

  // Generate URL
  const url = generateUnsubscribeUrl(testEmail, "en");

  // Extract token from URL
  const token = new URL(url).searchParams.get("token");
  assert(token, "URL should contain a token");
  if (!token) return;

  // Decode token
  const decodedBytes = decodeBase64Url(token);
  const decodedEmail = new TextDecoder().decode(decodedBytes);

  // Verify
  assertEquals(decodedEmail, testEmail, "Decoded email should match original");
});

Deno.test("URL format", () => {
  const testEmail = "test@example.com";
  const url = generateUnsubscribeUrl(testEmail, "en");

  assert(
    url.startsWith("https://o-siri.com/en/unsubscribe?token="),
    "URL should have correct format",
  );

  // URL should be valid
  assert(() => new URL(url), "Should be a valid URL");
});
