import { assert } from "jsr:@std/assert";
import "https://deno.land/x/dotenv@v3.2.2/load.ts";
import { getEarlyAccessTemplate } from "../../emails/templates/early-access/index.ts";
import { SupportedLanguage } from "../../_shared/types.ts";
import { testContext } from "../test-helpers.ts";
import { templateConfigs } from "./test-config.ts";

const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
const FUNCTION_URL = Deno.env.get("SUPABASE_URL") ?? "";
const FUNCTION_API_URL = `${FUNCTION_URL}/functions/v1`;

if (!supabaseKey) {
  throw new Error("Supabase key not found");
}
if (!FUNCTION_URL) {
  throw new Error("Supabase URL not found");
}

// Helper function for random selection
function shuffleAndSelect<T>(array: T[], n: number): T[] {
  const shuffled = [...array].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

const testLanguageTemplate = (lang: SupportedLanguage, config: {
  subject: string;
  welcomeText: string;
  discountText: string;
  description: string;
}) => {
  const testData = {
    name: "Test User",
  };
  const template = getEarlyAccessTemplate(lang, testData);
  assert(
    template.subject.includes("Osiri"),
    `${lang}: Subject should contain "Osiri"`,
  );
  assert(
    template.html.includes(config.welcomeText),
    `${lang}: Content should contain welcome message`,
  );
  assert(
    template.html.includes(config.discountText),
    `${lang}: Content should mention discount`,
  );
};

const testTemplateContent = () => {
  // Randomly select 3 languages to test
  const selectedLanguages = shuffleAndSelect(Object.keys(templateConfigs), 3);
  console.log(
    `Testing templates for languages: ${selectedLanguages.join(", ")}`,
  );

  for (const lang of selectedLanguages as SupportedLanguage[]) {
    testLanguageTemplate(lang, templateConfigs[lang]);
  }
};

const sendTestEmail = async (email: string, language: string = "en") => {
  const response = await fetch(`${FUNCTION_API_URL}/emails`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${supabaseKey}`,
    },
    body: JSON.stringify({
      to: email,
      template: "early-access",
      language,
    }),
  });

  const responseText = await response.text();
  return { response, responseText };
};

const testEmailSending = async () => {
  const testEmail = testContext.generateTestEmail("single");
  const selectedLanguage = shuffleAndSelect(Object.keys(templateConfigs), 1)[0];
  console.log(`Testing email sending with language: ${selectedLanguage}`);

  const { response, responseText } = await sendTestEmail(
    testEmail,
    selectedLanguage,
  );

  if (!response.ok) {
    throw new Error(
      `Email sending failed for ${selectedLanguage}: ${response.status} ${responseText}`,
    );
  }

  const data = JSON.parse(responseText);
  assert(data, "Response data should exist");
  assert(data.id, "Response should contain an email ID");
};

const testEmailSendingMultiLanguage = async () => {
  // Select 2 random languages
  const selectedLanguages = shuffleAndSelect(Object.keys(templateConfigs), 2);
  console.log(
    `Testing multi-language emails for: ${selectedLanguages.join(", ")}`,
  );

  for (const lang of selectedLanguages) {
    const testEmail = testContext.generateTestEmail(`multi_${lang}`);
    const { response, responseText } = await sendTestEmail(testEmail, lang);

    if (!response.ok) {
      throw new Error(
        `Email sending failed for ${lang}: ${response.status} ${responseText}`,
      );
    }

    const data = JSON.parse(responseText);
    assert(
      data && typeof data === "object",
      `Response data should be an object for ${lang}`,
    );
    assert(
      typeof data.id === "string" && data.id.length > 0,
      `Response should contain a non-empty ID string for ${lang}`,
    );
  }
};

const testDuplicateEmailHandling = async () => {
  const testEmail = testContext.generateTestEmail("duplicate");
  const [primaryLang, secondaryLang] = shuffleAndSelect(
    Object.keys(templateConfigs),
    2,
  );
  console.log(
    `Testing duplicate handling with languages: ${primaryLang}, ${secondaryLang}`,
  );

  // First email should succeed
  const { response: firstResponse, responseText: firstResponseText } =
    await sendTestEmail(testEmail, primaryLang);

  assert(
    firstResponse.ok,
    `First email should be sent successfully (${primaryLang})`,
  );
  const firstData = JSON.parse(firstResponseText);
  assert(
    firstData.id,
    `First response should contain an email ID (${primaryLang})`,
  );

  // Second email should fail with duplicate error
  const { response: secondResponse, responseText: secondResponseText } =
    await sendTestEmail(testEmail, secondaryLang);

  assert(
    !secondResponse.ok,
    `Duplicate email should be rejected (${secondaryLang})`,
  );
  assert(
    secondResponseText.includes("23505"),
    `Should return unique constraint violation error (${secondaryLang})`,
  );
  assert(
    secondResponseText.includes("duplicate key value"),
    `Should indicate duplicate email (${secondaryLang})`,
  );
};

const testDuplicateEmailHandlingMultiLanguage = async () => {
  const [primaryLang, ...testLanguages] = shuffleAndSelect(
    Object.keys(templateConfigs),
    3,
  );
  console.log(
    `Testing multi-language duplicate handling: primary=${primaryLang}, tests=${
      testLanguages.join(", ")
    }`,
  );

  const baseEmail = testContext.generateTestEmail("multi_duplicate");

  // First email in primary language
  const { response: firstResponse, responseText: firstResponseText } =
    await sendTestEmail(baseEmail, primaryLang);

  assert(
    firstResponse.ok,
    `First email should be sent successfully (${primaryLang})`,
  );
  const firstData = JSON.parse(firstResponseText);
  assert(
    firstData.id,
    `First response should contain an email ID (${primaryLang})`,
  );

  // Test duplicate handling for selected languages
  for (const lang of testLanguages) {
    const { response: duplicateResponse, responseText: duplicateResponseText } =
      await sendTestEmail(baseEmail, lang);

    assert(
      !duplicateResponse.ok,
      `Duplicate email should be rejected for ${lang}`,
    );
    assert(
      duplicateResponseText.includes("23505"),
      `Should return unique constraint violation error for ${lang}`,
    );
    assert(
      duplicateResponseText.includes("duplicate key value"),
      `Should indicate duplicate email for ${lang}`,
    );
  }
};

const testHtmlStructure = () => {
  const template = getEarlyAccessTemplate("en");
  const html = template.html;

  assert(html.includes("<!DOCTYPE html>"), "Should have DOCTYPE declaration");
  assert(html.includes("<style>"), "Should contain styles");
  assert(html.includes('class="container"'), "Should have container class");
  assert(html.includes('class="header"'), "Should have header class");
  assert(html.includes('class="benefits"'), "Should have benefits section");
  assert(html.includes('class="cta-button"'), "Should have CTA button");
  assert(html.includes('class="footer"'), "Should have footer section");
};

const testStyles = () => {
  const template = getEarlyAccessTemplate("en");
  const html = template.html;

  assert(html.includes("#4F46E5"), "Should use primary color");
  assert(html.includes("max-width"), "Should have max-width defined");
  assert(html.includes("border-radius"), "Should have rounded corners");
  assert(html.includes("font-family"), "Should define font family");
  assert(
    html.includes("!important"),
    "Should use important for critical styles",
  );
};

Deno.test("Email Template Content Test", testTemplateContent);
Deno.test("Email Sending Test", testEmailSending);
Deno.test("Email Sending Multi-Language Test", testEmailSendingMultiLanguage);
Deno.test("Duplicate Email Handling Test", testDuplicateEmailHandling);
Deno.test(
  "Duplicate Email Handling Multi-Language Test",
  testDuplicateEmailHandlingMultiLanguage,
);
Deno.test("HTML Structure Test", testHtmlStructure);
Deno.test("Email Styles Test", testStyles);
