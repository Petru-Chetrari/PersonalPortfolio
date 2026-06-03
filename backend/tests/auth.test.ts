import request from 'supertest';
import app from '../src/app';
import { setupTestDB, closeTestDB } from './setupTestDB';

beforeAll(async () => {
  await setupTestDB();
});

afterAll(async () => {
  await closeTestDB();
});

describe('Auth API', () => {
  let clientToken = '';
  let adminToken = '';
  let refreshToken = '';

  it('should register a new client user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'new_client',
        email: 'new@test.com',
        password: 'password123'
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('accessToken');
    expect(res.body).toHaveProperty('refreshToken');
    expect(res.body.user).toMatchObject({
      username: 'new_client',
      email: 'new@test.com',
      role: 'client'
    });
  });

  it('should not register duplicate username', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'new_client',
        email: 'other@test.com',
        password: 'password123'
      });

    expect(res.status).toBe(409);
  });

  it('should login client successfully', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'client_a', // seeded in setupTestDB
        password: 'testpass'
      });

    expect(res.status).toBe(200);
    expect(res.body.user.role).toBe('client');
    clientToken = res.body.accessToken;
    refreshToken = res.body.refreshToken;
  });

  it('should login admin successfully', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'admin', // seeded in setupTestDB
        password: 'testpass'
      });

    expect(res.status).toBe(200);
    expect(res.body.user.role).toBe('admin');
    adminToken = res.body.accessToken;
  });

  it('should fail login with wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'admin',
        password: 'wrongpassword'
      });

    expect(res.status).toBe(401);
  });

  it('should refresh access token', async () => {
    const res = await request(app)
      .post('/api/auth/refresh')
      .send({ refreshToken });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('accessToken');
  });

  it('should get current user info with me endpoint', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${clientToken}`);

    expect(res.status).toBe(200);
    expect(res.body.username).toBe('client_a');
  });

  it('should protect admin routes', async () => {
    // Client trying to access admin stats
    const resClient = await request(app)
      .get('/commissions/stats')
      .set('Authorization', `Bearer ${clientToken}`);
    expect(resClient.status).toBe(403);

    // Admin trying to access admin stats
    const resAdmin = await request(app)
      .get('/commissions/stats')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(resAdmin.status).toBe(200);
  });

  it('should reject requests without token to protected routes', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });
});
