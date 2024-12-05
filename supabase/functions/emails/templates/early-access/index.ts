import { EmailTemplate } from '../../utils/types.ts';
import { enTemplate } from './en.ts';
import { jaTemplate } from './ja.ts';

export const getEarlyAccessTemplate = (language: string, data?: Record<string, any>): EmailTemplate => {
    console.info('getEarlyAccessTemplate Input:', { language, data });
  
    if (language === 'ja') {
      return jaTemplate(data);
    } else {
      return enTemplate(data);
    }
  };