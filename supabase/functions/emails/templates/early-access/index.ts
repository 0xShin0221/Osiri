import { EmailTemplate } from '../../utils/types.ts';
import { enTemplate } from './en.ts';
import { jaTemplate } from './ja.ts';

export const getEarlyAccessTemplate = (language: string, data?: Record<string, any>): EmailTemplate => {
 return language === 'ja' ? jaTemplate(data) : enTemplate(data);
};