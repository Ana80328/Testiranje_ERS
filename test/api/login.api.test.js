const request = require('supertest');
const app = require('../backend/index'); 

describe('Authentication API', () => {
  it('POST /api/login – valid credentials should return token', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ username: 'admin', password: 'adminPass' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('POST /api/login – invalid credentials should be rejected', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ username: 'admin', password: 'wrongPass' });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('message');
  });
});
