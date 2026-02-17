import { describe, it, expect } from 'vitest';
import request from 'supertest';
import type { Express } from 'express';
import app from '../src/main'

describe('User API', () => {

  // ─── REGISTER ───────────────────────────────────────────────

  describe('POST /api/auth/register', () => {
    it('registers a user successfully', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: 'newuser@email.com', username: 'newuser', password: 'Str0ng!Pass' });
      expect(res.status).toBe(201);
      expect(res.body.message).toMatch(/Registro exitoso/i);
    });

    it('returns 400 when email is missing', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ username: 'user', password: '123456' });
      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/faltan campos/i);
    });

    it('returns 400 when username is missing', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: 'a@b.com', password: '123456' });
      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/faltan campos/i);
    });

    it('returns 400 when password is missing', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: 'a@b.com', username: 'user' });
      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/faltan campos/i);
    });

    it('returns 409 when email already exists', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: 'ana@test.com', username: 'otheruser', password: '123456' });
      expect(res.status).toBe(409);
      expect(res.body.message).toMatch(/ya existe/i);
    });

    it('returns 409 when username already exists', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: 'other@email.com', username: 'Ana Developer', password: '123456' });
      expect(res.status).toBe(409);
      expect(res.body.message).toMatch(/ya existe/i);
    });
  });

  // ─── LOGIN ──────────────────────────────────────────────────

  describe('POST /api/auth/login', () => {
    it('logs in a user and returns user data with wallet', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'ana@test.com', password: '123456' });
      expect(res.status).toBe(200);
      expect(res.body.user).toEqual({
        email: 'ana@test.com',
        id: 'user-uuid-1',
        username: 'Ana Developer',
        wallet: { balance: 500 },
      });
      expect(res.body.accessToken).toBeDefined();
    });

    it('sets a refreshToken cookie on successful login', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'ana@test.com', password: '123456' });
      expect(res.status).toBe(200);
      const cookies = res.headers['set-cookie'];
      expect(cookies).toBeDefined();
      const cookieArray = Array.isArray(cookies) ? cookies : [cookies]
      expect(cookieArray.some((c: string) => c.startsWith('refreshToken='))).toBe(true);
    });

    it('does not expose refreshToken in response body', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'ana@test.com', password: '123456' });
      expect(res.status).toBe(200);
      expect(res.body.refreshToken).toBeUndefined();
    });

    it('returns 400 when email is missing', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ password: '123456' });
      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/faltan campos/i);
    });

    it('returns 400 when password is missing', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'ana@test.com' });
      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/faltan campos/i);
    });

    it('returns 401 when email does not exist', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'nonexistent@email.com', password: '123456' });
      expect(res.status).toBe(401);
      expect(res.body.message).toMatch(/credenciales inválidas/i);
    });

    it('returns 401 when password is incorrect', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'ana@test.com', password: 'wrongpassword' });
      expect(res.status).toBe(401);
      expect(res.body.message).toMatch(/credenciales inválidas/i);
    });
  });

  // ─── LOGOUT ─────────────────────────────────────────────────

  describe('POST /api/auth/logout', () => {
    it('logs out a user and clears refreshToken cookie', async () => {
      const res = await request(app)
        .post('/api/auth/logout')
        .set('Cookie', 'refreshToken=token-seguro-para-logout-123');
      expect(res.status).toBe(204);
      const cookies = res.headers['set-cookie'];
      expect(cookies).toBeDefined();
      const cookieArray = Array.isArray(cookies) ? cookies : [cookies]
      const cookieCleared = cookieArray.some((c: string) => 
        c.includes('refreshToken=;') || c.includes('Max-Age=0') || c.includes('Expires=')
    );
    expect(cookieCleared).toBe(true);
    });

    it('returns 204 even without a refreshToken cookie', async () => {
      const res = await request(app)
        .post('/api/auth/logout');
      expect(res.status).toBe(204);
    });
  });

  // ─── REFRESH ────────────────────────────────────────────────

  describe('POST /api/auth/refresh', () => {
    it('refreshes the session using the cookie from login', async () => {
      // First, login to get a real JWT refreshToken cookie
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({ email: 'ana@test.com', password: '123456' });
      expect(loginRes.status).toBe(200);

      // Extract the refreshToken cookie from login response
      const cookies = loginRes.headers['set-cookie'];
      const cookieArray = Array.isArray(cookies) ? cookies : [cookies];
      const refreshCookie = cookieArray.find((c: string) => c.startsWith('refreshToken='));
      expect(refreshCookie).toBeDefined();

      // Use that cookie to call /refresh
      const res = await request(app)
        .post('/api/auth/refresh')
        .set('Cookie', refreshCookie!);
      expect(res.status).toBe(200);
      expect(res.body.accessToken).toBeDefined();
    });
  });
});

