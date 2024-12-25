import { Request, Response } from 'express';
import { ContentScraper } from '../../services/content/scraper';
import { z } from 'zod';

const scrapeRequestSchema = z.object({
  url: z.string().url(),
  options: z.object({
    timeout: z.number().optional(),
    waitUntil: z.enum(['domcontentloaded', 'networkidle0', 'networkidle2']).optional()
  }).optional()
});

export const scrapeContent = async (req: Request, res: Response) => {
  try {
    const validatedData = scrapeRequestSchema.parse(req.body);
    
    const scraper = new ContentScraper();
    const result = await scraper.scrape(validatedData.url, validatedData.options);
    
    res.json(result);
  } catch (error) {
    console.error('Content scraping error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request data',
        details: error.errors
      });
    }
    
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Content scraping failed'
    });
  }
};