import { Router } from 'express';

const router = Router();

router.get('/', (_, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version
  });
});

export default router;