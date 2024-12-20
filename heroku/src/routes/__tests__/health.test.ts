import request from 'supertest';
import express from 'express';
import healthRouter from '../health';

const app = express();
app.use('/health', healthRouter);

describe('Health Check Endpoint', () => {
  it('should return 200 OK with timestamp', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'ok');
    expect(response.body).toHaveProperty('timestamp');
  });
});