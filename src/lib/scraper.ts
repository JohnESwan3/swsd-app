// Initial setup, this will be overhauled as I build out funtionality. I just want to get this in here.
import { chromium, Browser, Page, BrowserContext } from 'playwright';

export interface ScraperConfig {
  headless?: boolean;
  timeout?: number;
}

export interface FormData {
  [selector: string]: string;
}

export class WebScraper {
  private browser: Browser | null = null;
  private context: BrowserContext | null = null;
  private config: ScraperConfig;

  constructor(config: ScraperConfig = {}) {
    this.config = {
      headless: config.headless ?? false,
      timeout: config.timeout ?? 30000,
    };
  }

  async initialize(): Promise<void> {
    this.browser = await chromium.launch({
      headless: this.config.headless,
    });
    this.context = await this.browser.newContext();
  }

  async navigateToUrl(url: string): Promise<Page> {
    if (!this.context) {
      throw new Error('Browser not initialized. Call initialize() first.');
    }

    const page = await this.context.newPage();
    await page.goto(url, { timeout: this.config.timeout });
    return page;
  }

  async fillForm(page: Page, formData: FormData): Promise<void> {
    for (const [selector, value] of Object.entries(formData)) {
      await page.fill(selector, value);
    }
  }

  async clickButton(page: Page, selector: string): Promise<void> {
    await page.click(selector);
  }

  async waitForSelector(page: Page, selector: string): Promise<void> {
    await page.waitForSelector(selector, { timeout: this.config.timeout });
  }

  async extractText(page: Page, selector: string): Promise<string | null> {
    return await page.textContent(selector);
  }

  async extractMultiple(page: Page, selector: string): Promise<string[]> {
    const elements = await page.$$(selector);
    const texts: string[] = [];

    for (const element of elements) {
      const text = await element.textContent();
      if (text) texts.push(text);
    }

    return texts;
  }

  async screenshot(page: Page, path: string): Promise<void> {
    await page.screenshot({ path });
  }

  async close(): Promise<void> {
    if (this.context) await this.context.close();
    if (this.browser) await this.browser.close();
  }

  async scrapeMultipleUrls(
    urls: string[],
    scrapeFunction: (page: Page, url: string) => Promise<any>
  ): Promise<any[]> {
    const results = [];

    for (const url of urls) {
      const page = await this.navigateToUrl(url);
      try {
        const result = await scrapeFunction(page, url);
        results.push(result);
      } catch (error) {
        console.error(`Error scraping ${url}:`, error);
        results.push({ url, error: error.message });
      } finally {
        await page.close();
      }
    }

    return results;
  }
}
