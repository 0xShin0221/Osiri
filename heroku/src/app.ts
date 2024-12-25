import express from 'express';
import feedRoutes from './routes/feeds';
import contentRoutes from './routes/content';
import healthRouter from './routes/health';
import batchRoutes from './routes/batch';

const app = express();

app.use(express.json());

app.use('/health', healthRouter);
app.use('/feeds', feedRoutes);
app.use('/content', contentRoutes);
app.use('/batch', batchRoutes);

export default app;