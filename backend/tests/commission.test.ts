import request from 'supertest';
import app from '../src/app';
import { setupTestDB, closeTestDB } from './setupTestDB';

beforeEach(async () => {
  await setupTestDB();
});

afterAll(async () => {
  await closeTestDB();
});

describe('GET /commissions', () => {
  it('returns seeded data with default pagination', async () => {
    const res = await request(app).get('/commissions');
    expect(res.status).toBe(200);
    expect(res.body.total).toBe(6);
    expect(res.body.page).toBe(1);
    expect(res.body.limit).toBe(10);
    expect(res.body.totalPages).toBe(1);
    expect(res.body.data).toHaveLength(6);
  });

  it('returns correct page slice with ?page=2&limit=2', async () => {
    const res = await request(app).get('/commissions?page=2&limit=2');
    expect(res.status).toBe(200);
    expect(res.body.page).toBe(2);
    expect(res.body.limit).toBe(2);
    expect(res.body.totalPages).toBe(3);
    expect(res.body.data).toHaveLength(2);
  });

  it('returns empty data for out-of-range page', async () => {
    const res = await request(app).get('/commissions?page=999&limit=10');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(0);
    expect(res.body.total).toBe(6);
  });

  it('filters by ?client= query param', async () => {
    const res = await request(app).get('/commissions?client=Alex%20M.');
    expect(res.status).toBe(200);
    expect(res.body.data.every((c: { client: string }) => c.client === 'Alex M.')).toBe(true);
  });
});

describe('GET /commissions/stats', () => {
  it('returns correct aggregate fields', async () => {
    const res = await request(app).get('/commissions/stats');
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
    const res = await request(app).get('/commissions/COM-001');
    expect(res.status).toBe(200);
    expect(res.body.id).toBe('COM-001');
    expect(res.body.client).toBe('Alex M.');
  });

  it('returns 404 for unknown id', async () => {
    const res = await request(app).get('/commissions/DOES-NOT-EXIST');
    expect(res.status).toBe(404);
    expect(res.body.error).toBeDefined();
  });
});

describe('POST /commissions', () => {
  it('creates a commission and returns 201', async () => {
    const res = await request(app)
      .post('/commissions')
      .send({ client: 'Test User', title: 'New Site', appType: 'Web App' });
    expect(res.status).toBe(201);
    expect(res.body.id).toMatch(/^COM-/);
    expect(res.body.status).toBe('pending');
    expect(res.body.client).toBe('Test User');
  });

  it('returns 400 when required field is missing', async () => {
    const res = await request(app)
      .post('/commissions')
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
      .send({ title: 'Updated Title', client: 'Sarah K.', appType: 'Web App' });
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Updated Title');
  });

  it('returns 400 for invalid status enum in update body', async () => {
    const res = await request(app)
      .put('/commissions/COM-001')
      .send({ status: 'invalid-status' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validation failed');
  });

  it('returns 404 when commission does not exist', async () => {
    const res = await request(app)
      .put('/commissions/COM-999')
      .send({ title: 'Ghost', client: 'Nobody', appType: 'Design' });
    expect(res.status).toBe(404);
  });
});

describe('PATCH /commissions/:id/status', () => {
  it('patches status successfully', async () => {
    const res = await request(app)
      .patch('/commissions/COM-001/status')
      .send({ status: 'completed' });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('completed');
  });

  it('returns 400 for invalid status value', async () => {
    const res = await request(app)
      .patch('/commissions/COM-001/status')
      .send({ status: 'unknown' });
    expect(res.status).toBe(400);
  });

  it('returns 404 for unknown commission on status patch', async () => {
    const res = await request(app)
      .patch('/commissions/COM-999/status')
      .send({ status: 'active' });
    expect(res.status).toBe(404);
  });
});

describe('DELETE /commissions/:id', () => {
  it('deletes commission and returns 204, then 404 on retry', async () => {
    const del = await request(app).delete('/commissions/COM-003');
    expect(del.status).toBe(204);

    const retry = await request(app).get('/commissions/COM-003');
    expect(retry.status).toBe(404);
  });

  it('returns 404 when commission does not exist', async () => {
    const res = await request(app).delete('/commissions/COM-999');
    expect(res.status).toBe(404);
  });
});
