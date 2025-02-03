import express from 'express';
import { scrapeContent } from './scrape';
import { translateContent } from './translate';

const router = express.Router();

router.post('/scrape', scrapeContent);
router.post('/translate', translateContent);

export default router;