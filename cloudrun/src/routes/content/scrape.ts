import { Request, Response } from 'express';
import { ContentScraper } from '../../services/content/scraper';
import { z } from 'zod';
import { withValidation } from '../../middleware/requestHandler';

const scrapeRequestSchema = z.object({
  url: z.string().url(),
  options: z.object({
    timeout: z.number().min(1000).max(60000).optional(),
    waitUntil: z.enum(['domcontentloaded', 'networkidle0', 'networkidle2']).optional()
  }).optional()
});

export const scrapeContent = withValidation(scrapeRequestSchema)(
  async (req: Request, res: Response) => {
    const validatedData = req.body;
    const scraper = new ContentScraper();
    const result = await scraper.scrape(validatedData.url, validatedData.options);
    res.json(result);
  }
);