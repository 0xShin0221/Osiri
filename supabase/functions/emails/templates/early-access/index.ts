import { EmailTemplate } from '../../utils/types.ts';
import { enTemplate } from './en.ts';
import { jaTemplate } from './ja.ts';

export const getEarlyAccessTemplate = (language: string): EmailTemplate => {
 return language === 'ja' ? jaTemplate : enTemplate;
};