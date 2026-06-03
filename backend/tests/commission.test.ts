import request from 'supertest';
import app from '../src/app';
import { setupTestDB, closeTestDB } from './setupTestDB';

let adminToken = '';
let clientToken = '';

beforeEach(async () => {
  await setupTestDB();
  const loginAdmin = await request(app).post('/api/auth/login').send({ username: 'admin', password: 'testpass' });
  adminToken = loginAdmin.body.accessToken;
  const loginClient = await request(app).post('/api/auth/login').send({ username: 'client_a', password: 'testpass' });
  clientToken = loginClient.body.accessToken;
});

afterAll(async () => {
  await closeTestDB();
});

describe('GET /commissions', () => {
  it('should reject unauthenticated commissions fetch', async () => {
    const res = await request(app).get('/commissions');
    expect(res.status).toBe(401);
  });

  it('should fetch all commissions when authenticated', async () => {
    const login = await request(app).post('/api/auth/login').send({ username: 'admin', password: 'testpass' });
    const token = login.body.accessToken;

    const res = await request(app).get('/commissions').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('returns correct page slice with ?page=2&limit=2', async () => {
    const res = await request(app).get('/commissions?page=2&limit=2').set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.page).toBe(2);
    expect(res.body.data).toHaveLength(2);
    expect(res.body.total).toBe(6);
  });

  it('returns empty data for out-of-range page', async () => {
    const res = await request(app).get('/commissions?page=999&limit=10').set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(0);
    expect(res.body.total).toBe(6);
  });

  it('filters by ?client= query param', async () => {
    const res = await request(app).get('/commissions?client=Alex%20M.').set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data.every((c: { client: string }) => c.client === 'Alex M.')).toBe(true);
  });
});

describe('GET /commissions/stats', () => {
  it('returns correct aggregate fields', async () => {
    const res = await request(app).get('/commissions/stats').set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      total: 6,
      active: 2,
      completed: 1,
      overdue: 1,
      pending: 2,
      revenue: 800, // 1 completed × $800
    });
    expect(res.body.chartData).toHaveLength(6);
    expect(res.body.recentActivity).toHaveLength(5);
  });
});

describe('GET /commissions/:id', () => {
  it('returns commission when found', async () => {
    const res = await request(app).get('/commissions/COM-001').set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe('COM-001');
    expect(res.body.client).toBe('Alex M.');
  });

  it('returns 404 for unknown id', async () => {
    const res = await request(app).get('/commissions/DOES-NOT-EXIST').set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(404);
    expect(res.body.error).toBeDefined();
  });
});

describe('POST /commissions', () => {
  it('creates a new commission as client', async () => {
    const login = await request(app).post('/api/auth/login').send({ username: 'client_a', password: 'testpass' });
    const token = login.body.accessToken;

    const payload = {
      client: 'New Client',
      title: 'New Web App',
      appType: 'Web',
      note: 'Hello'
    };
    const res = await request(app).post('/commissions').send(payload).set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(201);
    expect(res.body.id).toMatch(/^COM-\d+$/);
    expect(res.body.title).toBe(payload.title);
  });

  it('returns 400 when required field is missing', async () => {
    const res = await request(app)
      .post('/commissions')
      .set('Authorization', `Bearer ${clientToken}`)
      .send({ client: 'Test User' }); // missing title and appType
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validation failed');
    expect(res.body.details).toBeDefined();
  });
});

describe('PUT /commissions/:id', () => {
  it('updates commission and returns 200', async () => {
    const res = await request(app)
      .put('/commissions/COM-002')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ title: 'Updated Title', client: 'Sarah K.', appType: 'Web App' });
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Updated Title');
  });

  it('returns 400 for invalid status enum in update body', async () => {
    const res = await request(app)
      .put('/commissions/COM-001')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'invalid-status' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validation failed');
  });

  it('returns 404 when commission does not exist', async () => {
    const res = await request(app)
      .put('/commissions/COM-999')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ title: 'Ghost', client: 'Nobody', appType: 'Design' });
    expect(res.status).toBe(404);
  });
});

describe('PATCH /commissions/:id/status', () => {
  it('patches status successfully', async () => {
    const res = await request(app)
      .patch('/commissions/COM-001/status')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'completed' });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('completed');
  });

  it('returns 400 for invalid status value', async () => {
    const res = await request(app)
      .patch('/commissions/COM-001/status')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'unknown' });
    expect(res.status).toBe(400);
  });

  it('returns 404 for unknown commission on status patch', async () => {
    const res = await request(app)
      .patch('/commissions/COM-999/status')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'active' });
    expect(res.status).toBe(404);
  });
});

describe('DELETE /commissions/:id', () => {
  it('deletes commission and returns 204, then 404 on retry', async () => {
    const del = await request(app).delete('/commissions/COM-003').set('Authorization', `Bearer ${adminToken}`);
    expect(del.status).toBe(204);

    const retry = await request(app).get('/commissions/COM-003').set('Authorization', `Bearer ${adminToken}`);
    expect(retry.status).toBe(404);
  });

  it('returns 404 when commission does not exist', async () => {
    const res = await request(app).delete('/commissions/COM-999').set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(404);
  });
});
