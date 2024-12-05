// Import required libraries and modules
import { assert, assertEquals } from 'https://deno.land/std@0.192.0/testing/asserts.ts'
import { createClient, SupabaseClient } from 'jsr:@supabase/supabase-js@2'

import 'https://deno.land/x/dotenv@v3.2.2/load.ts'
import { getEarlyAccessTemplate } from '../../emails/templates/early-access';

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
const options = {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false,
  },
};


const testTemplateContent = () => {
//
  const enTemplate = getEarlyAccessTemplate('en');
  assert(enTemplate.subject.includes('Osiri'), 'English subject should contain "Osiri"');
  assert(enTemplate.html.includes('Welcome'), 'English content should contain welcome message');
  assert(enTemplate.html.includes('50% off'), 'English content should mention discount');


  const jaTemplate = getEarlyAccessTemplate('ja');
  assert(jaTemplate.subject.includes('Osiri'), '日本語の件名にOsiriが含まれるべき');
  assert(jaTemplate.html.includes('ようこそ'), '日本語の本文に歓迎メッセージが含まれるべき');
  assert(jaTemplate.html.includes('50%オフ'), '日本語の本文に割引の説明が含まれるべき');
};

const testEmailSending = async () => {
  const client: SupabaseClient = createClient(supabaseUrl, supabaseKey, options);
  
  const testEmail = 'test@example.com';
  

  const { data: func_data, error: func_error } = await client.functions.invoke('emails', {
    body: {
      to: testEmail,
      template: 'early-access',
      language: 'en'
    },
  });


  if (func_error) {
    throw new Error('Email sending failed: ' + func_error.message);
  }


  assert(func_data, 'Response data should exist');
  assert(func_data.id, 'Response should contain an email ID');
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