import express from 'express';
import { collectFeeds } from './collect';
import { processFeeds } from './process';

const router = express.Router();

router.post('/collect', collectFeeds);
router.post('/process', processFeeds);

export default router;