import { Request, Response } from 'express';
import { ContentTranslator } from '../../services/content/translator';
import { z } from 'zod';
import { withValidation } from '../../middleware/requestHandler';
import { FeedLanguage } from '../../types/models';

const translateRequestSchema = z.object({
  content: z.string(),
  sourceLanguage: z.custom<FeedLanguage>(),
  targetLanguage: z.custom<FeedLanguage>()
});

export const translateContent = withValidation(translateRequestSchema)(
  async (req: Request, res: Response) => {
    try {
      const validatedData = req.body;
      const translator = new ContentTranslator();

      const result = await translator.translate(
        validatedData.content,
        validatedData.sourceLanguage as FeedLanguage,
        validatedData.targetLanguage as FeedLanguage
      );

      res.json(result);
    } catch (error) {
      console.error('Translation error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Translation failed'
      });
    }
  }
);