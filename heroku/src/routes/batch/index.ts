import express from 'express';
import { processBatch } from './processBatch';

const router = express.Router();

router.post('/run', processBatch);

export default router;
