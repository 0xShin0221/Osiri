import express from 'express';
import healthRouter from './routes/health';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/health', healthRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});