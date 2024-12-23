import { Request, Response } from 'express';
import { ContentTranslator } from '../../services/content/translator';
import { z } from 'zod';

const translateRequestSchema = z.object({
  content: z.union([
    z.string(),
    z.array(z.string())
  ]),
  targetLanguage: z.string()
});

export const translateContent = async (req: Request, res: Response) => {
  try {
    const validatedData = translateRequestSchema.parse(req.body);
    const translator = new ContentTranslator();

    let result;
    if (Array.isArray(validatedData.content)) {
      result = await translator.translateBatch(
        validatedData.content,
        validatedData.targetLanguage
      );
    } else {
      result = await translator.translate(
        validatedData.content,
        validatedData.targetLanguage
      );
    }

    res.json(result);
  } catch (error) {
    console.error('Translation error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request data',
        details: error.errors
      });
    }
    
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Translation failed'
    });
  }
};