import { createClient, SupabaseClient, PostgrestError } from '@supabase/supabase-js';
import type { Database } from '../types/database.types';
import dotenv from 'dotenv';

export abstract class BaseRepository {
  protected client: SupabaseClient<Database>;

  constructor() {
    dotenv.config();
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase credentials');
    }

    this.client = createClient<Database>(supabaseUrl, supabaseKey);
  }

  protected isPostgrestError(error: unknown): error is PostgrestError {
    return (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      typeof (error as PostgrestError).code === 'string'
    );
  }

  protected handleError(error: unknown): never {
    console.error('Database error:', error);
    
    if (this.isPostgrestError(error)) {
      throw new Error(`Database error: ${error.message}`);
    }

    if (error instanceof Error) {
      throw new Error(`Unexpected error: ${error.message}`);
    }

    throw new Error('An unknown error occurred');
  }
}
