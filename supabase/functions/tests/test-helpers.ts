// test-helpers.ts
import { createClient } from 'jsr:@supabase/supabase-js';

export class TestContext {
  private static instance: TestContext;
  private supabase: any;
  private testRunId: string;

  private constructor() {
    this.supabase = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_ANON_KEY") || ""
    );
    this.testRunId = `test_${Date.now()}`;
  }

  static getInstance(): TestContext {
    if (!TestContext.instance) {
      TestContext.instance = new TestContext();
    }
    return TestContext.instance;
  }

  generateTestEmail(prefix: string = 'test'): string {
    return `${this.testRunId}.${prefix}@osiri.xyz`;
  }

  async cleanup() {
    const emailPattern = `${this.testRunId}%`;
    await this.supabase
      .from('waitlist')
      .delete()
      .like('email', emailPattern);
  }
}
export const testContext = TestContext.getInstance();