import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../src/main';

describe('Volume API', () => {
  let accessToken: string;

  beforeAll(async () => {
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'ana@test.com', password: '123456' });
    accessToken = loginRes.body.accessToken;
  });

  // ─── GET VOLUMES (public) ──────────────────────────────────

  describe('GET /api/volumes', () => {
    it('returns a list of volumes', async () => {
      const res = await request(app).get('/api/volumes');
      expect(res.status).toBe(200);
      expect(res.body.data).toBeDefined();
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('each volume contains id, title and thumbnail', async () => {
      const res = await request(app).get('/api/volumes');
      expect(res.status).toBe(200);
      res.body.data.forEach((volume: any) => {
        expect(volume).toHaveProperty('id');
        expect(volume).toHaveProperty('title');
        expect(volume).toHaveProperty('thumbnail');
      });
    });

    it('filters volumes by category query param', async () => {
      const res = await request(app).get('/api/volumes?category=historia');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('returns empty array when no volumes match the category', async () => {
      const res = await request(app).get('/api/volumes?category=nonexistent');
      expect(res.status).toBe(200);
      expect(res.body.data).toEqual([]);
    });
  });

  // ─── GET MY VOLUMES (authenticated) ────────────────────────

  describe('GET /api/users/volumes', () => {
    it('returns user volumes when authenticated', async () => {
      const res = await request(app)
        .get('/api/users/volumes')
        .set('Authorization', `Bearer ${accessToken}`);
      expect(res.status).toBe(200);
      expect(res.body.data).toBeDefined();
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('returns 401 when not authenticated', async () => {
      const res = await request(app).get('/api/users/volumes');
      expect(res.status).toBe(401);
    });
  });

  // ─── GET VOLUME DETAILS (authenticated) ────────────────────

  describe('GET /api/volumes/:volumeId', () => {
    it('returns volume details when authenticated', async () => {
      const res = await request(app)
        .get('/api/volumes/01')
        .set('Authorization', `Bearer ${accessToken}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('title');
      expect(res.body).toHaveProperty('description');
      expect(res.body).toHaveProperty('categories');
      expect(Array.isArray(res.body.categories)).toBe(true);
    });

    it('returns 404 when volume does not exist', async () => {
      const res = await request(app)
        .get('/api/volumes/nonexistent')
        .set('Authorization', `Bearer ${accessToken}`);
      expect(res.status).toBe(404);
    });

    it('returns 401 when not authenticated', async () => {
      const res = await request(app).get('/api/volumes/01');
      expect(res.status).toBe(401);
    });
  });

  // ─── GET CHAPTERS ──────────────────────────────────────────

  describe('GET /api/volumes/:volumeId/chapters', () => {
    it('returns chapters for a volume when authenticated', async () => {
      const res = await request(app)
        .get('/api/volumes/01/chapters')
        .set('Authorization', `Bearer ${accessToken}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      if (res.body.length > 0) {
        expect(res.body[0]).toHaveProperty('id');
        expect(res.body[0]).toHaveProperty('title');
        expect(res.body[0]).toHaveProperty('type');
        expect(res.body[0]).toHaveProperty('isCompleted');
      }
    });

    it('returns 404 when volume does not exist', async () => {
      const res = await request(app)
        .get('/api/volumes/nonexistent/chapters')
        .set('Authorization', `Bearer ${accessToken}`);
      expect(res.status).toBe(404);
    });

    it('returns 401 when not authenticated', async () => {
      const res = await request(app).get('/api/volumes/01/chapters');
      expect(res.status).toBe(401);
    });
  });

  // ─── GET PRUEBA (test/proof) ───────────────────────────────

  describe('GET /api/volumes/:volumeId/:chapterId/prueba', () => {
    it('returns a proof with questions when authenticated', async () => {
      const res = await request(app)
        .get('/api/volumes/01/01/prueba')
        .set('Authorization', `Bearer ${accessToken}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('timeLimit');
      expect(res.body).toHaveProperty('questions');
      expect(Array.isArray(res.body.questions)).toBe(true);
      if (res.body.questions.length > 0) {
        const question = res.body.questions[0];
        expect(question).toHaveProperty('id');
        expect(question).toHaveProperty('question');
        expect(question).toHaveProperty('options');
        expect(Array.isArray(question.options)).toBe(true);
      }
    });

    it('returns 404 when chapter or volume does not exist', async () => {
      const res = await request(app)
        .get('/api/volumes/nonexistent/nonexistent/prueba')
        .set('Authorization', `Bearer ${accessToken}`);
      expect(res.status).toBe(404);
    });

    it('returns 401 when not authenticated', async () => {
      const res = await request(app).get('/api/volumes/01/01/prueba');
      expect(res.status).toBe(401);
    });
  });

  // ─── SUBMIT PRUEBA ─────────────────────────────────────────

  describe('POST /api/pruebas/:pruebaId/submit', () => {
    it('submits answers and returns a result when authenticated', async () => {
      const res = await request(app)
        .post('/api/pruebas/01/submit')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          answers: [
            { questionId: 'q_01', selectedOptions: ['b'] },
          ],
        });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('score');
      expect(res.body).toHaveProperty('passed');
    });

    it('returns 400 when answers are missing', async () => {
      const res = await request(app)
        .post('/api/pruebas/01/submit')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({});
      expect(res.status).toBe(400);
    });

    it('returns 404 when prueba does not exist', async () => {
      const res = await request(app)
        .post('/api/pruebas/nonexistent/submit')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          answers: [
            { questionId: 'q_01', selectedOptions: ['b'] },
          ],
        });
      expect(res.status).toBe(404);
    });

    it('returns 401 when not authenticated', async () => {
      const res = await request(app)
        .post('/api/pruebas/01/submit')
        .send({
          answers: [
            { questionId: 'q_01', selectedOptions: ['b'] },
          ],
        });
      expect(res.status).toBe(401);
    });
  });
});
