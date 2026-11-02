const request = require('supertest');
const app = require('../app');

describe('API', () => {
  test('GET /health returns 200', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });

  test('GET / returns JSON', async () => {
    const res = await request(app).get('/');
    expect(res.headers['content-type']).toMatch(/json/);
    expect(res.body).toHaveProperty('message');
  });
});
