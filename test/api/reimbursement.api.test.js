const request = require('supertest');
const app = require('../backend/index');
const jwt = require('jsonwebtoken');

const SECRET = 'your_jwt_secret';

const adminToken = jwt.sign({ id: 1, username: 'admin', role: 'admin' }, SECRET);
const userToken = jwt.sign({ id: 2, username: 'user1', role: 'enduser' }, SECRET);

describe('Basic API Tests', () => {
  
  describe('Reimbursement Flow', () => {
    let reimbursementId;


    it('returns 422 for invalid reimbursement data', async () => {
      const res = await request(app)
        .post('/api/reimbursements')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ amount: -10, description: 'Bad', type: 'OTHER' });
      expect(res.statusCode).toBe(422);
      expect(res.body.errorType).toBe('ValidationError');
    });


    it('returns 404 when reimbursement not found', async () => {
      const res = await request(app)
        .patch('/api/reimbursements/9999/status')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'Approved' });
      expect(res.statusCode).toBe(404);
      expect(res.body).toMatchObject({
        errorCode: 'NOT_FOUND',
        errorType: 'ResourceNotFound',
        message: 'Reimbursement not found'
      });
    });

   
  });
});
