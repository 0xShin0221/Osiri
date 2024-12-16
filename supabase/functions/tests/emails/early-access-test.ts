import { assert } from "std/testing/asserts.ts";
import "https://deno.land/x/dotenv@v3.2.2/load.ts";
import { getEarlyAccessTemplate } from "../../emails/templates/early-access/index.ts";
import { SupportedLanguage } from "../../_shared/types.ts";

const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
const FUNCTION_URL = Deno.env.get("SUPABASE_URL") ?? "";
const FUNCTION_API_URL = `${FUNCTION_URL}/functions/v1`;

if (!supabaseKey) {
  throw new Error("Supabase key not found");
}
if (!FUNCTION_URL) {
  throw new Error("Supabase URL not found");
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
  // English
  testLanguageTemplate("en", {
    subject: "Osiri",
    welcomeText: "Welcome",
    discountText: "50% Off",
    description: "English template test",
  });

  // Japanese
  testLanguageTemplate("ja", {
    subject: "Osiri",
    welcomeText: "ようこそ",
    discountText: "50%オフ",
    description: "Japanese template test",
  });

  // Bengali
  testLanguageTemplate("bn", {
    subject: "Osiri",
    welcomeText: "স্বাগতম",
    discountText: "৫০% ছাড়",
    description: "Bengali template test",
  });

  // Russian
  testLanguageTemplate("ru", {
    subject: "Osiri",
    welcomeText: "Добро пожаловать",
    discountText: "50% скидка",
    description: "Russian template test",
  });

  // Indonesian
  testLanguageTemplate("id", {
    subject: "Osiri",
    welcomeText: "Selamat Datang",
    discountText: "Diskon 50% selama",
    description: "Indonesian template test",
  });

  // German
  testLanguageTemplate("de", {
    subject: "Osiri",
    welcomeText: "Willkommen",
    discountText: "50% Rabatt",
    description: "German template test",
  });
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
  const { response, responseText } = await sendTestEmail("test@osiri.xyz");

  if (!response.ok) {
    throw new Error(`Email sending failed: ${response.status} ${responseText}`);
  }

  const data = JSON.parse(responseText);
  assert(data, "Response data should exist");
  assert(data.id, "Response should contain an email ID");
};

const testEmailSendingMultiLanguage = async () => {
  const testLanguages = ["en", "ja", "bn", "ru", "id", "de"];
  const baseEmail = "test@osiri.xyz";

  for (const lang of testLanguages) {
    const { response, responseText } = await sendTestEmail(
      `${lang}.${baseEmail}`,
      lang
    );

    if (!response.ok) {
      throw new Error(
        `Email sending failed for ${lang}: ${response.status} ${responseText}`
      );
    }

    const data = JSON.parse(responseText);
    assert(data, `Response data should exist for ${lang}`);
    assert(data.id, `Response should contain an email ID for ${lang}`);
  }
};

const testDuplicateEmailHandling = async () => {
  const testEmail = "duplicate@osiri.xyz";

  // First email should succeed
  const { response: firstResponse, responseText: firstResponseText } =
    await sendTestEmail(testEmail);

  assert(firstResponse.ok, "First email should be sent successfully");
  const firstData = JSON.parse(firstResponseText);
  assert(firstData.id, "First response should contain an email ID");

  // Second email should fail with duplicate error
  const { response: secondResponse, responseText: secondResponseText } =
    await sendTestEmail(testEmail, "ja");

  assert(!secondResponse.ok, "Duplicate email should be rejected");
  assert(
    secondResponseText.includes("23505"),
    "Should return unique constraint violation error",
  );
  assert(
    secondResponseText.includes("duplicate key value"),
    "Should indicate duplicate email",
  );
};

const testDuplicateEmailHandlingMultiLanguage = async () => {
  const testLanguages = ["ja", "bn", "ru", "id", "de"];
  const timestamp = new Date().getTime();
  const baseEmail = `duplicate${timestamp}@osiri.xyz`;

  try {
    // First email in English should succeed
    const { response: firstResponse, responseText: firstResponseText } =
      await sendTestEmail(baseEmail, "en");

    if (!firstResponse.ok) {
      console.error('First email response:', firstResponseText);
    }

    assert(firstResponse.ok, "First email should be sent successfully");
    const firstData = JSON.parse(firstResponseText);
    assert(firstData.id, "First response should contain an email ID");

    // Test duplicate handling for each language
    for (const lang of testLanguages) {
      const { response: duplicateResponse, responseText: duplicateResponseText } =
        await sendTestEmail(baseEmail, lang);

      assert(
        !duplicateResponse.ok,
        `Duplicate email should be rejected for ${lang}`
      );
      assert(
        duplicateResponseText.includes("23505"),
        `Should return unique constraint violation error for ${lang}`
      );
      assert(
        duplicateResponseText.includes("duplicate key value"),
        `Should indicate duplicate email for ${lang}`
      );
    }
  } catch (error) {
    console.error('Test error:', error);
    throw error;
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
Deno.test("Duplicate Email Handling Multi-Language Test", testDuplicateEmailHandlingMultiLanguage);
Deno.test("HTML Structure Test", testHtmlStructure);
Deno.test("Email Styles Test", testStyles);