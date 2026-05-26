import request from 'supertest';
import app from '../src/app';
import { setupTestDB, closeTestDB } from './setupTestDB';

beforeEach(async () => {
  await setupTestDB();
});

afterAll(async () => {
  await closeTestDB();
});

/** Fetch the first project's id from the seeded list */
async function getFirstProjectId(): Promise<string> {
  const res = await request(app).get('/projects');
  return res.body.data[0].id as string;
}

describe('GET /projects', () => {
  it('returns seeded data with default pagination', async () => {
    const res = await request(app).get('/projects');
    expect(res.status).toBe(200);
    expect(res.body.total).toBe(3);
    expect(res.body.data).toHaveLength(3);
    expect(res.body.data[0]).toHaveProperty('id');
  });

  it('returns correct page slice with ?page=2&limit=1', async () => {
    const res = await request(app).get('/projects?page=2&limit=1');
    expect(res.status).toBe(200);
    expect(res.body.page).toBe(2);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.totalPages).toBe(3);
  });
});

describe('GET /projects/:id', () => {
  it('returns project when found', async () => {
    const id = await getFirstProjectId();
    const res = await request(app).get(`/projects/${id}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(id);
    expect(res.body.title).toBeDefined();
  });

  it('returns 404 for unknown id', async () => {
    const res = await request(app).get('/projects/00000000-0000-0000-0000-000000000000');
    expect(res.status).toBe(404);
    expect(res.body.error).toBeDefined();
  });
});

describe('POST /projects', () => {
  it('creates a project with a UUID id and returns 201', async () => {
    const res = await request(app)
      .post('/projects')
      .send({ title: 'New Project', type: 'SaaS', desc: 'Description here', imageAlt: 'New project alt' });
    expect(res.status).toBe(201);
    expect(res.body.id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    );
    expect(res.body.title).toBe('New Project');
  });

  it('returns 400 when required field is missing', async () => {
    const res = await request(app)
      .post('/projects')
      .send({ title: 'No Desc' }); // missing type, desc, imageAlt
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validation failed');
  });
});

describe('PUT /projects/:id', () => {
  it('updates project and returns 200', async () => {
    const id = await getFirstProjectId();
    const res = await request(app)
      .put(`/projects/${id}`)
      .send({ title: 'Renamed Project' });
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Renamed Project');
    expect(res.body.id).toBe(id); // id unchanged
  });

  it('returns 404 when project does not exist', async () => {
    const res = await request(app)
      .put('/projects/00000000-0000-0000-0000-000000000000')
      .send({ title: 'Ghost' });
    expect(res.status).toBe(404);
  });
});

describe('DELETE /projects/:id', () => {
  it('deletes project (204) then 404 on retry', async () => {
    const id = await getFirstProjectId();

    const del = await request(app).delete(`/projects/${id}`);
    expect(del.status).toBe(204);

    const retry = await request(app).get(`/projects/${id}`);
    expect(retry.status).toBe(404);
  });

  it('returns 404 for unknown id', async () => {
    const res = await request(app).delete('/projects/00000000-0000-0000-0000-000000000000');
    expect(res.status).toBe(404);
  });
});
