import express from 'express';
import feedRoutes from './routes/feeds';
import contentRoutes from './routes/content';
import healthRouter from './routes/health';

const app = express();

app.use(express.json());

app.use('/health', healthRouter);
app.use('/feeds', feedRoutes);
app.use('/content', contentRoutes);

export default app;