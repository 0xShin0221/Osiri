import { assert } from "std/testing/asserts.ts";
import 'https://deno.land/x/dotenv@v3.2.2/load.ts';
import { getEarlyAccessTemplate } from '../../emails/templates/early-access/index.ts';

// 環境変数からURLを取得
const FUNCTION_URL = Deno.env.get('FUNCTION_URL') || 'http://localhost:54321/functions/v1';

const testTemplateContent = () => {
 // 英語テンプレートのテスト
 const enTemplate = getEarlyAccessTemplate('en');
 assert(enTemplate.subject.includes('Osiri'), 'English subject should contain "Osiri"');
 assert(enTemplate.html.includes('Welcome'), 'English content should contain welcome message');
 assert(enTemplate.html.includes('50% off'), 'English content should mention discount');

 // 日本語テンプレートのテスト
 const jaTemplate = getEarlyAccessTemplate('ja');
 assert(jaTemplate.subject.includes('Osiri'), '日本語の件名にOsiriが含まれるべき');
 assert(jaTemplate.html.includes('ようこそ'), '日本語の本文に歓迎メッセージが含まれるべき');
 assert(jaTemplate.html.includes('50%オフ'), '日本語の本文に割引の説明が含まれるべき');
};

const testEmailSending = async () => {
 const testEmail = 'test@example.com';
 
 // fetchを使用してメール送信をテスト
 const response = await fetch(`${FUNCTION_URL}/emails`, {
   method: 'POST',
   headers: {
     'Content-Type': 'application/json'
   },
   body: JSON.stringify({
     to: testEmail,
     template: 'early-access',
     language: 'en'
   })
 });

 if (!response.ok) {
   throw new Error('Email sending failed: ' + await response.text());
 }

 const data = await response.json();
 assert(data, 'Response data should exist');
 assert(data.id, 'Response should contain an email ID');
};

const testHtmlStructure = () => {
 const template = getEarlyAccessTemplate('en');
 const html = template.html;

 // HTML構造の検証
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

 // スタイルの検証
 assert(html.includes('#4F46E5'), 'Should use primary color');
 assert(html.includes('max-width'), 'Should have max-width defined');
 assert(html.includes('border-radius'), 'Should have rounded corners');
 assert(html.includes('font-family'), 'Should define font family');
 assert(html.includes('!important'), 'Should use important for critical styles');
};

// テストの実行
Deno.test('Email Template Content Test', testTemplateContent);
Deno.test('Email Sending Test', testEmailSending);
Deno.test('HTML Structure Test', testHtmlStructure);
Deno.test('Email Styles Test', testStyles);