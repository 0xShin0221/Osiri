import express from 'express';
// import feedRoutes from './routes/feeds';
// import contentRoutes from './routes/content';
import healthRouter from './routes/health';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Routes
app.use('/health', healthRouter);
// app.use('/feeds', feedRoutes);
// app.use('/content', contentRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;