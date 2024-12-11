import { createClient } from 'jsr:@supabase/supabase-js';

interface WaitlistEntry {
  email: string;
  name?: string;
  company?: string;
  role?: string;
  language: string;
}

const supabase = createClient(
  Deno.env.get('LOCAL_SUPABASE_FUNCTION_URL') ?? '',
  Deno.env.get('LOCAL_SUPABASE_ANON_KEY') ?? ''
);

export const saveToWaitlist = async (
  email: string,
  language: string,
  data?: Record<string, any>
): Promise<void> => {
  console.info('saveToWaitlist:', { email, language, data });
  console.info('SUPABASE_URL:', Deno.env.get('LOCAL_SUPABASE_FUNCTION_URL'));
  console.info('SUPABASE_ANON_KEY:', Deno.env.get('LOCAL_SUPABASE_ANON_KEY'));
  const waitlistEntry: WaitlistEntry = {
    email,
    name: data?.name || '',
    company: data?.company,
    role: data?.role,
    language
  };

  const { error } = await supabase
    .from('waitlist')
    .insert(waitlistEntry);

  if (error) {
    console.error('Error saving to waitlist:', error);
    throw error;
  }
};