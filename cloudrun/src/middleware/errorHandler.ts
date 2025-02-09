import { Request, Response } from 'express';

type RouteHandler = (req: Request, res: Response) => Promise<any>;

export const withErrorHandling = (handler: RouteHandler) => {
  return async (req: Request, res: Response) => {
    try {
      await handler(req, res);
    } catch (error) {
      console.error('Request error:', error);
      
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