import './emails/early-access-test.ts';


const setup = async () => {
 console.log('Test setup completed');
};

const cleanup = async () => {

 console.log('Test cleanup completed');
};

Deno.test({
 name: "Global Setup",
 fn: setup,
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
 fn: cleanup,
 sanitizeOps: false,
 sanitizeResources: false,
});

addEventListener("load", () => {
 console.log("\nTest Summary:");
 console.log("--------------");

});