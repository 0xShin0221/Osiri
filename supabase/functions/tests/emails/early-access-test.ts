import { assert } from "std/testing/asserts.ts";
import 'https://deno.land/x/dotenv@v3.2.2/load.ts';
import { getEarlyAccessTemplate } from '../../emails/templates/early-access/index.ts';

const supabaseKey = Deno.env.get('VITE_SUPABASE_ANON_KEY') ?? '';
const FUNCTION_URL = Deno.env.get('VITE_SUPABASE_URL') ?? '';
const FUNCTION_API_URL = `${FUNCTION_URL}/functions/v1`;


if (!supabaseKey) {
  throw new Error('Supabase key not found');
}
if (!FUNCTION_URL) {
  throw new Error('Supabase URL not found');
}


const testTemplateContent = () => {
 const enTemplate = getEarlyAccessTemplate('en');
 assert(enTemplate.subject.includes('Osiri'), 'English subject should contain "Osiri"');
 assert(enTemplate.html.includes('Welcome'), 'English content should contain welcome message');
 assert(enTemplate.html.includes('50%'), 'English content should mention discount');

 const jaTemplate = getEarlyAccessTemplate('ja');
 assert(jaTemplate.subject.includes('Osiri'), '日本語の件名にOsiriが含まれるべき');
 assert(jaTemplate.html.includes('ようこそ'), '日本語の本文に歓迎メッセージが含まれるべき');
 assert(jaTemplate.html.includes('50%オフ'), '日本語の本文に割引の説明が含まれるべき');
};

const testEmailSending = async () => {
 const testEmail = 'test@osiri.xyz';
 
 const response = await fetch(`${FUNCTION_API_URL}/emails`, {
   method: 'POST',
   headers: {
     'Content-Type': 'application/json',
     'Authorization': `Bearer ${supabaseKey}`,
   },
   body: JSON.stringify({
     to: testEmail,
     template: 'early-access',
     language: 'en',
     data: {
        name: 'Test User',
        role: 'Developer',
        company: 'Osiri'
      },
   })
 });

 if (!response.ok) {
   const errorText = await response.text();
   throw new Error(`Email sending failed: ${response.status} ${errorText}`);
 }

 const data = await response.json();
 assert(data, 'Response data should exist');
 assert(data.id, 'Response should contain an email ID');
};

const testHtmlStructure = () => {
 const template = getEarlyAccessTemplate('en');
 const html = template.html;

 assert(html.includes('<!DOCTYPE html>'), 'Should have DOCTYPE declaration');
 assert(html.includes('<style>'), 'Should contain styles');
 assert(html.includes('class="container"'), 'Should have container class');
 assert(html.includes('class="header"'), 'Should have header class');
 assert(html.includes('class="benefits"'), 'Should have benefits section');
 assert(html.includes('class="cta-button"'), 'Should have CTA button');
 assert(html.includes('class="footer"'), 'Should have footer section');
};

const testStyles = () => {
 const template = getEarlyAccessTemplate('en');
 const html = template.html;

 assert(html.includes('#4F46E5'), 'Should use primary color');
 assert(html.includes('max-width'), 'Should have max-width defined');
 assert(html.includes('border-radius'), 'Should have rounded corners');
 assert(html.includes('font-family'), 'Should define font family');
 assert(html.includes('!important'), 'Should use important for critical styles');
};

Deno.test('Email Template Content Test', testTemplateContent);
Deno.test('Email Sending Test', testEmailSending);
Deno.test('HTML Structure Test', testHtmlStructure);
Deno.test('Email Styles Test', testStyles);