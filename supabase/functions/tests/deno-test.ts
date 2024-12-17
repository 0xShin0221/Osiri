import { testContext } from "./test-helpers.ts";

await import("./emails/early-access-test.ts");
await import("./unsubscribe/unsubscribe-test.ts");

Deno.test({
  name: "Global Setup",
  async fn() {
    await testContext.cleanup();
    console.log("Test setup completed");
  },
  sanitizeOps: false,
  sanitizeResources: false,
});

Deno.test({
  name: "All Function Tests",
  async fn() {

  },
  sanitizeOps: false,
  sanitizeResources: false,
});

Deno.test({
  name: "Global Cleanup",
  async fn() {
    await testContext.cleanup();
    console.log("Test cleanup completed");
  },
  sanitizeOps: false,
  sanitizeResources: false,
});
addEventListener("load", () => {
  console.log("\nTest Summary:");
  console.log("--------------");
});
