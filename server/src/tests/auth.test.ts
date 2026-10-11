import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../app.js';
import { User } from '../models/User.js';
import argon2 from 'argon2';

const getRawCookies = (res: request.Response): string[] => {
  const sc = res.headers['set-cookie'];
  if (!sc) return [];
  return Array.isArray(sc) ? sc : [sc];
};

const getCookies = (res: request.Response): string[] => {
  return getRawCookies(res).map((c) => c.split(';')[0]);
};

describe('Auth & Security API Suite', () => {
  const app = createApp();

  const testUser = {
    name: 'Ada Lovelace',
    email: 'ada@csflivebook.com',
    password: 'Password123!',
  };

  it('POST /api/v1/auth/register should create user and set httpOnly cookies', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send(testUser);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.name).toBe(testUser.name);
    expect(res.body.data.user.email).toBe(testUser.email);
    expect(res.body.data.user.passwordHash).toBeUndefined();

    // Verify httpOnly cookies in raw set-cookie
    const rawCookies = getRawCookies(res);
    expect(rawCookies.some((c: string) => c.startsWith('accessToken=') && c.includes('HttpOnly'))).toBe(true);
    expect(rawCookies.some((c: string) => c.startsWith('refreshToken=') && c.includes('HttpOnly'))).toBe(true);

    // Verify user in DB
    const dbUser = await User.findOne({ email: testUser.email }).select('+passwordHash');
    expect(dbUser).toBeDefined();
    expect(await argon2.verify(dbUser!.passwordHash, testUser.password)).toBe(true);
  });

  it('POST /api/v1/auth/register should reject duplicate email', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send(testUser);

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('EMAIL_ALREADY_EXISTS');
  });

  it('POST /api/v1/auth/register should reject weak password', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Weak Pass User',
        email: 'weak@csflivebook.com',
        password: 'weak',
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('POST /api/v1/auth/login should authenticate valid user and set cookies', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password,
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe(testUser.email);
    expect(res.body.data.user.passwordHash).toBeUndefined();

    const rawCookies = getRawCookies(res);
    expect(rawCookies.some((c: string) => c.startsWith('accessToken=') && c.includes('HttpOnly'))).toBe(true);
    expect(rawCookies.some((c: string) => c.startsWith('refreshToken=') && c.includes('HttpOnly'))).toBe(true);
  });

  it('POST /api/v1/auth/login should reject wrong password', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: testUser.email,
        password: 'WrongPassword123!',
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('INVALID_CREDENTIALS');
  });

  it('GET /api/v1/auth/me should return authenticated user profile via cookie', async () => {
    const loginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: testUser.email, password: testUser.password });

    const cookies = getCookies(loginRes);

    const meRes = await request(app)
      .get('/api/v1/auth/me')
      .set('Cookie', cookies);

    expect(meRes.status).toBe(200);
    expect(meRes.body.success).toBe(true);
    expect(meRes.body.data.user.email).toBe(testUser.email);
    expect(meRes.body.data.user.passwordHash).toBeUndefined();
  });

  it('GET /api/v1/auth/me should reject unauthenticated request', async () => {
    const res = await request(app).get('/api/v1/auth/me');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });

  it('PATCH /api/v1/auth/me should update profile preferences', async () => {
    const loginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: testUser.email, password: testUser.password });

    const cookies = getCookies(loginRes);

    const updateRes = await request(app)
      .patch('/api/v1/auth/me')
      .set('Cookie', cookies)
      .send({
        name: 'Ada King Lovelace',
        preferences: { theme: 'light', reducedMotion: true },
      });

    expect(updateRes.status).toBe(200);
    expect(updateRes.body.data.user.name).toBe('Ada King Lovelace');
    expect(updateRes.body.data.user.preferences.theme).toBe('light');
    expect(updateRes.body.data.user.preferences.reducedMotion).toBe(true);
  });

  it('POST /api/v1/auth/refresh should rotate refresh token and issue new cookies', async () => {
    const loginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: testUser.email, password: testUser.password });

    const cookies = getCookies(loginRes);
    const oldRefreshTokenCookie = cookies.find((c: string) => c.startsWith('refreshToken='));
    expect(oldRefreshTokenCookie).toBeDefined();

    const refreshRes = await request(app)
      .post('/api/v1/auth/refresh')
      .set('Cookie', [oldRefreshTokenCookie!]);

    expect(refreshRes.status).toBe(200);
    expect(refreshRes.body.success).toBe(true);

    const newCookies = getCookies(refreshRes);
    const newRefreshTokenCookie = newCookies.find((c: string) => c.startsWith('refreshToken='));
    expect(newRefreshTokenCookie).toBeDefined();
    expect(newRefreshTokenCookie).not.toBe(oldRefreshTokenCookie);

    // Replay attack test: Trying to use the OLD refresh token again MUST fail
    const replayRes = await request(app)
      .post('/api/v1/auth/refresh')
      .set('Cookie', [oldRefreshTokenCookie!]);

    expect(replayRes.status).toBe(401);
  });

  it('POST /api/v1/auth/logout should clear cookies and revoke token', async () => {
    const loginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: testUser.email, password: testUser.password });

    const cookies = getCookies(loginRes);

    const logoutRes = await request(app)
      .post('/api/v1/auth/logout')
      .set('Cookie', cookies);

    expect(logoutRes.status).toBe(200);
    expect(logoutRes.body.data.message).toBe('Logged out successfully');

    // Verify clear-cookie headers
    const rawCookies = getRawCookies(logoutRes);
    expect(rawCookies.some((c: string) => c.startsWith('accessToken=;') || c.includes('Expires=Thu, 01 Jan 1970'))).toBe(true);
  });

  it('Role guards should block STUDENT from accessing ADMIN route with 403 FORBIDDEN', async () => {
    const loginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: testUser.email, password: testUser.password });

    const cookies = getCookies(loginRes);

    const forbiddenRes = await request(app)
      .get('/api/v1/auth/admin-check')
      .set('Cookie', cookies);

    expect(forbiddenRes.status).toBe(403);
    expect(forbiddenRes.body.success).toBe(false);
    expect(forbiddenRes.body.error.code).toBe('FORBIDDEN');
  });

  it('Role guards should allow ADMIN to access ADMIN route', async () => {
    const adminPassHash = await argon2.hash('AdminSecret123!');
    await User.create({
      name: 'System Admin',
      email: 'admin_test@csflivebook.com',
      passwordHash: adminPassHash,
      role: 'ADMIN',
    });

    const loginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'admin_test@csflivebook.com', password: 'AdminSecret123!' });

    const cookies = getCookies(loginRes);

    const adminRes = await request(app)
      .get('/api/v1/auth/admin-check')
      .set('Cookie', cookies);

    expect(adminRes.status).toBe(200);
    expect(adminRes.body.success).toBe(true);
    expect(adminRes.body.data.secret).toBe('admin_classified_data');
  });

  it('Password recovery flow: forgot-password -> reset-password -> login with new password', async () => {
    const forgotRes = await request(app)
      .post('/api/v1/auth/forgot-password')
      .send({ email: testUser.email });

    expect(forgotRes.status).toBe(200);
    const resetToken = forgotRes.body.data.resetToken;
    expect(resetToken).toBeDefined();

    const newPassword = 'BrandNewPassword123!';
    const resetRes = await request(app)
      .post('/api/v1/auth/reset-password')
      .send({
        token: resetToken,
        newPassword,
      });

    expect(resetRes.status).toBe(200);
    expect(resetRes.body.success).toBe(true);

    const oldLoginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: testUser.email, password: testUser.password });
    expect(oldLoginRes.status).toBe(401);

    const newLoginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: testUser.email, password: newPassword });
    expect(newLoginRes.status).toBe(200);
    expect(newLoginRes.body.success).toBe(true);
  });
});
