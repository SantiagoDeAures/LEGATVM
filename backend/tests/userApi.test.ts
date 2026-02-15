import { describe, it, expect } from 'vitest';
import request from 'supertest';
import type { Express } from 'express';
import app from '../src/main'

describe('User API', () => {
  it('registers a user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'example@email.com', username: 'user10', password: './gbo18InP' });
    expect(res.status).toBe(201);
    expect(res.body.message).toMatch(/Registro exitoso/i);
  });

  it('verifies email', async () => {
    const res = await request(app)
      .post('/api/auth/verify-email')
      .send({ token: 'abc123xyz' });
    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/activado/i);
  });

  it('logs in a user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'example@email.com', password: './gbo18InP' });
    expect(res.status).toBe(200);
    expect(res.body.user).toEqual({id: '1', username: 'user10', email:'example@email.com', wallet:{
        balance: 150
    }});
  });

  it('logs out a user', async () => {
    const res = await request(app)
      .post('/api/auth/logout');
    expect(res.status).toBe(204);
  });

  it('refreshes the session', async () => {
    const res = await request(app)
      .post('/api/auth/refresh')
      .send({ refreshToken: 'dummy-refresh-token' });
    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/Token refrescado/i);
  });
});
