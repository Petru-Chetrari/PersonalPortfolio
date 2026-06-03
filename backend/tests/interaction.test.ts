import request from 'supertest';
import app from '../src/app';
import { setupTestDB, closeTestDB } from './setupTestDB';

let adminToken = '';

beforeEach(async () => {
  await setupTestDB();
  const login = await request(app).post('/api/auth/login').send({ username: 'admin', password: 'testpass' });
  adminToken = login.body.accessToken;
});

afterAll(async () => {
  await closeTestDB();
});

describe('GET /interactions', () => {
  it('returns seeded data with default pagination', async () => {
    const res = await request(app).get('/interactions').set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.total).toBe(9);
    expect(res.body.data).toHaveLength(9);
  });

  it('returns correct slice with ?page=2&limit=3', async () => {
    const res = await request(app).get('/interactions?page=2&limit=3').set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.page).toBe(2);
    expect(res.body.data).toHaveLength(3);
    expect(res.body.totalPages).toBe(3);
  });
});

describe('GET /interactions/:date', () => {
  it('returns interaction when found (URL-encoded date)', async () => {
    const res = await request(app).get('/interactions/Mar%2001').set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.date).toBe('Mar 01');
    expect(res.body.links).toBe(120);
  });

  it('returns 404 for unknown date', async () => {
    const res = await request(app).get('/interactions/Jan%2001').set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(404);
    expect(res.body.error).toBeDefined();
  });
});

describe('POST /interactions', () => {
  it('creates a new interaction and returns 201', async () => {
    const res = await request(app)
      .post('/interactions')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ date: 'Apr 01', links: 50, projects: 30, commissions: 20 });
    expect(res.status).toBe(201);
    expect(res.body.date).toBe('Apr 01');
    expect(res.body.links).toBe(50);
  });

  it('returns 409 when date already exists', async () => {
    const res = await request(app)
      .post('/interactions')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ date: 'Mar 01', links: 1, projects: 1, commissions: 1 });
    expect(res.status).toBe(409);
    expect(res.body.error).toMatch(/already exists/i);
  });

  it('returns 400 for invalid body (missing fields)', async () => {
    const res = await request(app)
      .post('/interactions')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ date: 'Apr 02' }); // missing numeric fields
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validation failed');
  });

  it('returns 400 for negative counter values', async () => {
    const res = await request(app)
      .post('/interactions')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ date: 'Apr 03', links: -5, projects: 1, commissions: 1 });
    expect(res.status).toBe(400);
  });
});

describe('PUT /interactions/:date', () => {
  it('updates interaction counters and returns 200', async () => {
    const res = await request(app)
      .put('/interactions/Mar%2001')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ links: 999 });
    expect(res.status).toBe(200);
    expect(res.body.links).toBe(999);
    expect(res.body.date).toBe('Mar 01'); // date unchanged
  });

  it('returns 404 for unknown date', async () => {
    const res = await request(app)
      .put('/interactions/Jan%2001')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ links: 1 });
    expect(res.status).toBe(404);
  });
});

describe('POST /interactions/:date/increment', () => {
  it('increments existing interaction with default deltas', async () => {
    const before = await request(app).get('/interactions/Mar%2001').set('Authorization', `Bearer ${adminToken}`);
    const prevLinks = before.body.links as number;

    const res = await request(app).post('/interactions/Mar%2001/increment').set('Authorization', `Bearer ${adminToken}`).send({});
    expect(res.status).toBe(200);
    expect(res.body.links).toBe(prevLinks + 10);
    expect(res.body.projects).toBe(before.body.projects + 1);
    expect(res.body.commissions).toBe(before.body.commissions + 1);
  });

  it('upserts a new interaction when date does not exist', async () => {
    const res = await request(app)
      .post('/interactions/Mar%2009/increment')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ links: 5, projects: 2, commissions: 3 });
    expect(res.status).toBe(200);
    expect(res.body.date).toBe('Mar 09');
    expect(res.body.links).toBe(5);
  });
});

describe('DELETE /interactions/:date', () => {
  it('deletes interaction (204) then 404 on retry', async () => {
    const del = await request(app).delete('/interactions/Mar%2001').set('Authorization', `Bearer ${adminToken}`);
    expect(del.status).toBe(204);

    const retry = await request(app).get('/interactions/Mar%2001').set('Authorization', `Bearer ${adminToken}`);
    expect(retry.status).toBe(404);
  });

  it('returns 404 for unknown date', async () => {
    const res = await request(app).delete('/interactions/Jan%2001').set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(404);
  });
});
