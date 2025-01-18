
import dotenv from 'dotenv';
import { Request, Response, NextFunction } from 'express';

interface ApiKeyVerification {
    isValid: boolean;
    error?: string;
  }
  
const verifyApiKey = (apiKey: string): ApiKeyVerification => {
    dotenv.config();
    const validApiKeys = (process.env.API_KEYS || '').split(',').filter(key => key.length > 0);
    
    if (!apiKey) {
      return { isValid: false, error: 'API key is required' };
    }
  
    if (validApiKeys.length === 0) {
      return { isValid: false, error: 'No valid API keys configured' };
    }
  
    if (!validApiKeys.includes(apiKey)) {
      return { isValid: false, error: 'Invalid API key' };
    }
  
    return { isValid: true };
  };
  

  export const requireApiKey = (req: Request, res: Response, next: NextFunction) => {
    if (req.path === '/health') {
      return next();
    }
  
    const apiKey = req.headers['x-api-key'] as string;
    const verification = verifyApiKey(apiKey);
  
    if (!verification.isValid) {
        return res.status(401).json({
          error: 'Unauthorized',
          message: verification.error
        });
      }
  
    next();
  };