import { Request, Response } from 'express';
import { z } from 'zod';

type RouteHandler = (req: Request, res: Response) => Promise<any>;

export const withValidation = (schema: z.ZodSchema) => {
  return (handler: RouteHandler) => {
    return async (req: Request, res: Response) => {
      try {
        const validatedData = schema.parse(req.body);
        req.body = validatedData;
        await handler(req, res);
      } catch (error) {
        console.error('Request error:', error);

        if (error instanceof z.ZodError) {
          return res.status(400).json({
            success: false,
            error: 'Invalid request data',
            details: error.errors
          });
        }

        if (error instanceof Error && error.message === 'Missing Supabase credentials') {
          return res.status(401).json({
            success: false,
            error: error.message
          });
        }

        res.status(500).json({
          success: false,
          error: error instanceof Error ? error.message : 'An error occurred'
        });
      }
    };
  };
};
