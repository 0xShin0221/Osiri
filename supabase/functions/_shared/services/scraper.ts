import puppeteer from "npm:puppeteer";

interface ScraperOptions {
  timeout?: number;
}

export async function scrapeContent(
  url: string,
  options: ScraperOptions = {},
): Promise<string> {
  const TIMEOUT = options.timeout || 30000;

  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    headless: true,
  });

  try {
    const page = await browser.newPage();
    await page.setRequestInterception(true);

    page.on("request", (request) => {
      if (["image", "stylesheet", "font"].includes(request.resourceType())) {
        request.abort();
      } else {
        request.continue();
      }
    });

    await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: TIMEOUT,
    });

    return await page.content();
  } finally {
    await browser.close();
  }
}
